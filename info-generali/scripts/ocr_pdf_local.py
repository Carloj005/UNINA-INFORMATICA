#!/usr/bin/env python3
"""
Pipeline OCR AI locale (GPU via llama.cpp + Chandra OCR 2 GGUF) ->
Markdown strutturato + estrazione automatica figure/circuiti in images/ (PNG-8) +
compilazione PDF ricercabile via KaTeX offline e Chrome/Chromium Headless.

Compatibile con NVIDIA GTX 1080 Ti (11 GB VRAM, Pascal sm_61) tramite
llama.cpp CUDA 12.4 (61-virtual / __dp4a) o Vulkan senza compilazione da sorgenti.

Dipendenze Python:
    pip install pymupdf pillow beautifulsoup4 markdownify markdown

Esempio d'uso:
    python3 info-generali/scripts/ocr_pdf_local.py \
        --input "dispensa_scansionata.pdf" \
        --out-dir "./out" \
        --name "Dispensa" \
        --title "Titolo Documento" \
        --llama-server "/path/to/llama-server" \
        --model "/path/to/chandra-ocr-2.Q8_0.gguf" \
        --mmproj "/path/to/chandra-ocr-2.mmproj-f16.gguf" \
        --katex-dir "/path/to/katex"
"""

import argparse
import base64
import html as html_lib
import io
import json
import os
import re
import shutil
import subprocess
import time
import urllib.request
from pathlib import Path

import markdown as md_lib
import pymupdf
from bs4 import BeautifulSoup
from markdownify import MarkdownConverter, re_whitespace
from PIL import Image, ImageChops

CHANDRA_LAYOUT_PROMPT = """OCR this image to HTML, arranged as layout blocks.  Each layout block should be a div with the data-bbox attribute representing the bounding box of the block in x0 y0 x1 y1 format.  Bboxes are normalized 0-1000. The data-label attribute is the label for the block.

Use the following labels:
- Caption
- Footnote
- Equation-Block
- List-Group
- Page-Header
- Page-Footer
- Image
- Section-Header
- Table
- Text
- Complex-Block
- Code-Block
- Form
- Table-Of-Contents
- Figure
- Chemical-Block
- Diagram
- Bibliography
- Blank-Page

Only use these tags ['math', 'br', 'i', 'b', 'u', 'del', 'sup', 'sub', 'table', 'tr', 'td', 'p', 'th', 'div', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'ul', 'ol', 'li', 'input', 'a', 'span', 'img', 'hr', 'tbody', 'small', 'caption', 'strong', 'thead', 'big', 'code', 'chem'], and these attributes ['class', 'colspan', 'rowspan', 'display', 'checked', 'type', 'border', 'value', 'style', 'href', 'alt', 'align', 'data-bbox', 'data-label'].

Guidelines:
* Inline math: Surround math with <math>...</math> tags. Math expressions should be rendered in KaTeX-compatible LaTeX. Use display for block math.
* Tables: Use colspan and rowspan attributes to match table structure.
* Formatting: Maintain consistent formatting with the image, including spacing, indentation, subscripts/superscripts, and special characters.
* Images: Include a description of any images in the alt attribute of an <img> tag. Do not fill out the src property. Describe in detail inside the div tag. Also convert charts to high fidelity data, and convert diagrams to mermaid.
* Forms: Mark checkboxes and radio buttons properly.
* Text: join lines together properly into paragraphs using <p>...</p> tags.  Use <br> tags for line breaks within paragraphs, but only when absolutely necessary to maintain meaning.
* Chemistry: Use <chem>...</chem> tags for chemical formulas with reactive SMILES.
* Lists: Preserve indents and proper list markers.
* Use the simplest possible HTML structure that accurately represents the content of the block.
* Make sure the text is accurate and easy for a human to read and interpret.  Reading order should be correct and natural."""

IMAGE_LABELS = {"image", "figure", "diagram"}
WATERMARK_RE = re.compile(
    r"(?:appuntioff[i]?cinastudenti\.com|officina\s*studenti\.com|\bnotein\b)",
    re.IGNORECASE,
)
_LEADING_OL_NUM_RE = re.compile(r"^\s*\d+[\.\)]\s+")
_DANGEROUS_CONTAINER_RE = re.compile(
    r"<\s*(script|style|iframe|object|embed|applet)\b[^>]*>[\s\S]*?<\s*/\s*\1\s*>",
    re.IGNORECASE,
)
_DANGEROUS_TAGS_RE = re.compile(
    r"<\s*/?\s*(?:script|iframe|object|embed|applet|meta|link|base|form|style)\b[^>]*>",
    re.IGNORECASE,
)


def scale_image_grid(img: Image.Image, max_dim: int = 1792, grid: int = 28) -> Image.Image:
    w, h = img.size
    if w <= 0 or h <= 0:
        return img
    scale = min(1.0, max_dim / max(w, h))
    nw = max(grid, round((w * scale) / grid) * grid)
    nh = max(grid, round((h * scale) / grid) * grid)
    if (nw, nh) != (w, h):
        return img.resize((nw, nh), Image.Resampling.LANCZOS)
    return img


def detect_repeat_token(text: str, base_max_repeats: int = 5, window_size: int = 400) -> bool:
    if not text or len(text) < 200:
        return False
    tail = text[-window_size:]
    for seq_len in range(4, min(120, len(tail) // 3)):
        cand = tail[-seq_len:]
        if not cand.strip():
            continue
        repeats = 0
        pos = len(tail) - seq_len
        while pos >= 0 and tail[pos : pos + seq_len] == cand:
            repeats += 1
            pos -= seq_len
        if repeats >= base_max_repeats:
            return True
    return False


def trim_whitespace(im: Image.Image, pad: int = 8) -> Image.Image:
    rgb = im.convert("RGB")
    bg = Image.new("RGB", rgb.size, (255, 255, 255))
    diff = ImageChops.difference(rgb, bg).convert("L")
    diff = diff.point(lambda p: 255 if p > 18 else 0)
    bbox = diff.getbbox()
    if not bbox:
        return rgb
    x0 = max(0, bbox[0] - pad)
    y0 = max(0, bbox[1] - pad)
    x1 = min(rgb.width, bbox[2] + pad)
    y1 = min(rgb.height, bbox[3] + pad)
    if x1 - x0 < 20 or y1 - y0 < 20:
        return rgb
    return rgb.crop((x0, y0, x1, y1))


def save_optimized_diagram(crop: Image.Image, out_path: str, max_width: int = 1500) -> None:
    im = crop.convert("RGB")
    if im.width > max_width:
        ratio = max_width / im.width
        im = im.resize((max_width, max(1, int(im.height * ratio))), Image.Resampling.LANCZOS)
    pal = im.quantize(colors=64, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    pal.save(out_path, format="PNG", optimize=True)


def sanitize_html(raw: str) -> str:
    if not raw:
        return ""
    s = raw.strip()
    if s.startswith("```"):
        s = re.sub(r"^```[a-zA-Z]*\s*", "", s)
        s = re.sub(r"\s*```$", "", s)
    s = _DANGEROUS_CONTAINER_RE.sub("", s)
    s = _DANGEROUS_TAGS_RE.sub("", s)
    return s


def parse_bbox(raw_bbox: str | None) -> list[float] | None:
    if not raw_bbox:
        return None
    nums = re.findall(r"-?\d+(?:\.\d+)?", raw_bbox)
    if len(nums) != 4:
        return None
    return [float(n) for n in nums]


class ChandraMarkdownConverter(MarkdownConverter):
    def convert_math(self, el, text, parent_tags):
        raw_latex = el.get_text().strip()
        if not raw_latex:
            return ""
        is_block = el.has_attr("display") and str(el.get("display", "")).lower() == "block"
        if is_block:
            return f"\n\n$$\n{raw_latex}\n$$\n\n"
        return f" ${raw_latex}$ "

    def convert_div(self, el, text, parent_tags):
        stripped = text.strip()
        return f"\n\n{stripped}\n\n" if stripped else ""

    def convert_table(self, el, text, parent_tags):
        tbl_copy = BeautifulSoup(str(el), "html.parser")
        for m in tbl_copy.find_all("math"):
            latex = m.get_text().strip()
            m.replace_with(f"${latex}$" if latex else "")
        for tag in tbl_copy.find_all(attrs={"data-bbox": True}):
            del tag["data-bbox"]
        for tag in tbl_copy.find_all(attrs={"data-label": True}):
            del tag["data-label"]
        return "\n\n" + str(tbl_copy).strip() + "\n\n"

    def convert_li(self, el, text, parent_tags):
        parent = el.parent
        if parent and parent.name == "ol" and text:
            text = _LEADING_OL_NUM_RE.sub("", text, count=1)
        elif parent and parent.name == "ul" and text:
            text = re.sub(r"^\s*(?:[-–—•·\*]\s+)+", "", text)
        return super().convert_li(el, text, parent_tags)

    def escape(self, text, parent_tags=None):
        text = super().escape(text, parent_tags)
        return text.replace("$", r"\$")

    def process_text(self, el, parent_tags=None):
        text = str(el) or ""
        if not el.find_parent("pre"):
            text = re_whitespace.sub(" ", text)
        if not el.find_parent(["pre", "code", "kbd", "samp", "math"]):
            text = self.escape(text)
        if el.parent and el.parent.name == "li" and (
            not el.next_sibling or getattr(el.next_sibling, "name", None) in ["ul", "ol"]
        ):
            text = text.rstrip()
        return text


def process_page_html(
    raw_html: str,
    hi_res_img: Image.Image,
    page_num: int,
    images_dir: str,
    images_rel_prefix: str = "images",
    skip_watermarks: bool = True,
) -> tuple[str, list[str]]:
    cleaned = sanitize_html(raw_html)
    soup = BeautifulSoup(cleaned, "html.parser")
    top_divs = soup.find_all("div", recursive=False)

    w, h = hi_res_img.size
    saved_images = []
    fig_counter = 0
    out_blocks = []

    if not top_divs:
        conv = ChandraMarkdownConverter(
            heading_style="ATX",
            bullets="-",
            escape_misc=False,
            escape_underscores=False,
            escape_asterisks=False,
        )
        return conv.convert(cleaned).strip(), []

    for div in top_divs:
        label = (div.get("data-label") or "").strip()
        label_low = label.lower()

        if label_low in ("blank-page", "page-header", "page-footer"):
            continue

        plain_text = div.get_text(" ", strip=True)
        if skip_watermarks and plain_text and len(plain_text) < 60 and WATERMARK_RE.search(plain_text):
            continue

        if label_low in IMAGE_LABELS:
            coords = parse_bbox(div.get("data-bbox"))
            img_tag = div.find("img")
            alt_text = (img_tag.get("alt") or "").strip() if img_tag else ""
            if not alt_text:
                alt_text = f"Figura pagina {page_num}"
            alt_text = re.sub(r"\s+", " ", alt_text).replace("]", ")").replace("[", "(")
            if len(alt_text) > 160:
                alt_text = alt_text[:157].rstrip() + "..."

            crop_saved = False
            if coords:
                x0 = max(0, min(w, int(coords[0] * w / 1000.0) - 8))
                y0 = max(0, min(h, int(coords[1] * h / 1000.0) - 8))
                x1 = max(x0, min(w, int(coords[2] * w / 1000.0) + 8))
                y1 = max(y0, min(h, int(coords[3] * h / 1000.0) + 8))
                bw, bh = x1 - x0, y1 - y0
                if bw >= 45 and bh >= 35 and not (bw < w * 0.08 and bh > h * 0.45):
                    crop = trim_whitespace(hi_res_img.crop((x0, y0, x1, y1)), pad=8)
                    if crop.width >= 36 and crop.height >= 28:
                        fig_counter += 1
                        fname = f"p{page_num:03d}_fig{fig_counter:02d}.png"
                        save_optimized_diagram(crop, os.path.join(images_dir, fname))
                        saved_images.append(fname)
                        out_blocks.append(f"![{alt_text}]({images_rel_prefix}/{fname})")
                        crop_saved = True
            if not crop_saved and plain_text:
                out_blocks.append(f"> *[Figura p.{page_num}: {plain_text}]*")
            continue

        table_visual_md = None
        if label_low == "table" and div.find("img"):
            coords = parse_bbox(div.get("data-bbox"))
            if coords:
                x0 = max(0, min(w, int(coords[0] * w / 1000.0) - 8))
                y0 = max(0, min(h, int(coords[1] * h / 1000.0) - 8))
                x1 = max(x0, min(w, int(coords[2] * w / 1000.0) + 8))
                y1 = max(y0, min(h, int(coords[3] * h / 1000.0) + 8))
                if (x1 - x0) >= 60 and (y1 - y0) >= 40:
                    crop = trim_whitespace(hi_res_img.crop((x0, y0, x1, y1)), pad=8)
                    if crop.width >= 48 and crop.height >= 36:
                        fig_counter += 1
                        fname = f"p{page_num:03d}_fig{fig_counter:02d}.png"
                        save_optimized_diagram(crop, os.path.join(images_dir, fname))
                        saved_images.append(fname)
                        alts = [t.get("alt", "").strip() for t in div.find_all("img") if t.get("alt")]
                        alt_desc = "; ".join(alts)[:150] if alts else f"Schema e tabella pagina {page_num}"
                        alt_desc = re.sub(r"\s+", " ", alt_desc).replace("]", ")").replace("[", "(")
                        table_visual_md = f"![{alt_desc}]({images_rel_prefix}/{fname})"
            for img_tag in div.find_all("img"):
                alt_short = (img_tag.get("alt") or "Schema grafico").strip()
                if len(alt_short) > 65:
                    alt_short = alt_short[:62].rstrip() + "..."
                img_tag.replace_with(f"({alt_short})")

        for img_tag in div.find_all("img"):
            if not img_tag.get("src"):
                img_tag.decompose()

        if skip_watermarks:
            for p_el in list(div.find_all(["p", "span"])):
                pt = p_el.get_text(" ", strip=True)
                if pt and len(pt) < 45 and WATERMARK_RE.search(pt):
                    p_el.decompose()

        inner_html = str(div.decode_contents()).strip()
        if not inner_html:
            if table_visual_md:
                out_blocks.append(table_visual_md)
            continue

        conv = ChandraMarkdownConverter(
            heading_style="ATX",
            bullets="-",
            escape_misc=False,
            escape_underscores=False,
            escape_asterisks=False,
        )
        block_md = conv.convert(inner_html).strip()
        if not block_md:
            if table_visual_md:
                out_blocks.append(table_visual_md)
            continue
        if skip_watermarks and len(block_md) < 60 and WATERMARK_RE.search(block_md):
            continue

        if label_low == "section-header" and not block_md.startswith("#"):
            clean_h = block_md.strip("*_ ").replace("\n", " ")
            block_md = f"## {clean_h}"

        if table_visual_md:
            out_blocks.append(table_visual_md)
        out_blocks.append(block_md)

    page_md = "\n\n".join(out_blocks)
    page_md = re.sub(r"(?m)^(\s*)(\d+\.\s+)\*\*\2", r"\1\2**", page_md)
    page_md = re.sub(r"(?m)^(\s*)(\d+\.\s+)\2", r"\1\2", page_md)
    page_md = re.sub(r"\n{3,}", "\n\n", page_md).strip()
    return page_md, saved_images


def wait_server(port: int, proc: subprocess.Popen, timeout: int = 120) -> bool:
    t0 = time.time()
    url = f"http://127.0.0.1:{port}/health"
    while time.time() - t0 < timeout:
        if proc.poll() is not None:
            return False
        try:
            with urllib.request.urlopen(url, timeout=2) as r:
                if r.status == 200:
                    data = json.loads(r.read().decode("utf-8", errors="ignore"))
                    if data.get("status") == "ok":
                        return True
        except Exception:
            pass
        time.sleep(0.5)
    return False


def ocr_single_page(
    port: int,
    img_ocr: Image.Image,
    max_tokens: int = 6144,
    temperature: float = 0.0,
    top_p: float = 0.1,
    repeat_penalty: float = 1.0,
) -> tuple[str, dict]:
    buf = io.BytesIO()
    img_ocr.save(buf, format="PNG")
    b64_png = base64.b64encode(buf.getvalue()).decode("ascii")
    payload = {
        "model": "chandra-ocr-2",
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64_png}"}},
                    {"type": "text", "text": CHANDRA_LAYOUT_PROMPT},
                ],
            }
        ],
        "temperature": temperature,
        "top_p": top_p,
        "repeat_penalty": repeat_penalty,
        "max_tokens": max_tokens,
    }
    req = urllib.request.Request(
        f"http://127.0.0.1:{port}/v1/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=300) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    content = data["choices"][0]["message"]["content"]
    meta = {
        "finish_reason": data["choices"][0].get("finish_reason", ""),
        "usage": data.get("usage", {}),
        "timings": data.get("timings", {}),
    }
    return content, meta


def protect_math_for_markdown(md_text: str) -> tuple[str, dict[str, str]]:
    placeholders = {}
    counter = 0

    def _sub(match):
        nonlocal counter
        key = f"XMATHPLACEHOLDERX{counter}X"
        counter += 1
        placeholders[key] = match.group(0)
        return key

    code_placeholders = {}
    code_counter = 0

    def _sub_code(match):
        nonlocal code_counter
        key = f"XCODEPLACEHOLDERX{code_counter}X"
        code_counter += 1
        code_placeholders[key] = match.group(0)
        return key

    text = re.sub(r"```[\s\S]*?```", _sub_code, md_text)
    text = re.sub(r"\$\$[\s\S]*?\$\$", _sub, text)
    text = re.sub(r"(?<!\\)\$(?!\$)([^\n$]+?)(?<!\\)\$", _sub, text)
    for k, v in code_placeholders.items():
        text = text.replace(k, v)
    return text, placeholders


def detect_chrome() -> str:
    for cand in (
        shutil.which("google-chrome"),
        shutil.which("chromium"),
        shutil.which("chromium-browser"),
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    ):
        if cand and os.path.exists(cand):
            return cand
    raise FileNotFoundError("Chrome/Chromium non trovato; specifica --chrome.")


def compile_markdown_to_pdf(
    md_path: str,
    pdf_path: str,
    title: str,
    subtitle: str,
    katex_dir: str | None = None,
    chrome_exe: str | None = None,
) -> None:
    md_text = Path(md_path).read_text(encoding="utf-8")
    md_text = re.sub(r"^\s*#\s+[^\n]+\n+(?:>\s+[^\n]+\n+)*---\s*\n+", "", md_text, count=1)
    protected_md, math_map = protect_math_for_markdown(md_text)

    body_html = md_lib.markdown(
        protected_md,
        extensions=["tables", "fenced_code", "sane_lists", "nl2br"],
    )
    for k, v in math_map.items():
        safe_math = v.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        body_html = body_html.replace(k, safe_math)

    md_dir = Path(md_path).resolve().parent
    base_uri = md_dir.as_uri().rstrip("/") + "/"
    if katex_dir and os.path.isdir(katex_dir):
        katex_uri = Path(katex_dir).resolve().as_uri().rstrip("/")
    else:
        katex_uri = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist"

    html_doc = f"""<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="utf-8">
<base href="{base_uri}">
<title>{html_lib.escape(title)}</title>
<link rel="stylesheet" href="{katex_uri}/katex.min.css">
<script defer src="{katex_uri}/katex.min.js"></script>
<script defer src="{katex_uri}/contrib/auto-render.min.js"></script>
<style>
  @page {{ size: A4; margin: 18mm 16mm 18mm 16mm; }}
  * {{ box-sizing: border-box; }}
  body {{
    font-family: "Segoe UI", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
    font-size: 10pt;
    line-height: 1.5;
    color: #1a202c;
    margin: 0;
  }}
  .doc-cover {{ border-bottom: 2.5px solid #0f4c81; padding-bottom: 12px; margin-bottom: 18px; }}
  .doc-cover h1 {{ font-size: 19pt; color: #0f4c81; margin: 0 0 6px 0; border: none; padding: 0; }}
  .doc-cover p {{ margin: 0; color: #4a5568; font-size: 9.5pt; }}
  h1 {{ font-size: 15pt; color: #0f4c81; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 4px; margin: 18px 0 10px 0; page-break-after: avoid; }}
  h2 {{ font-size: 12.5pt; color: #0f4c81; margin: 15px 0 8px 0; page-break-after: avoid; }}
  h3, h4 {{ font-size: 11pt; color: #1e3a5f; margin: 12px 0 6px 0; page-break-after: avoid; }}
  p {{ margin: 0 0 8px 0; text-align: justify; orphans: 3; widows: 3; }}
  ul, ol {{ margin: 4px 0 10px 0; padding-left: 20px; }}
  li {{ margin-bottom: 3px; }}
  hr {{ border: none; border-top: 1px dashed #cbd5e1; margin: 14px 0; }}
  table {{ border-collapse: collapse; width: auto; max-width: 100%; margin: 10px auto; font-size: 9pt; page-break-inside: avoid; }}
  th, td {{ border: 1px solid #94a3b8; padding: 4px 7px; text-align: left; vertical-align: middle; }}
  th {{ background: #edf2f7; color: #0f4c81; font-weight: 600; }}
  tr:nth-child(even) td {{ background: #f8fafc; }}
  pre {{
    background: #f1f5f9; border: 1px solid #cbd5e1; border-left: 3px solid #0f4c81;
    border-radius: 4px; padding: 8px 10px;
    font-family: "Cascadia Code", Consolas, "Courier New", monospace;
    font-size: 8.5pt; line-height: 1.4; overflow: visible; white-space: pre-wrap; page-break-inside: avoid;
  }}
  code {{ font-family: "Cascadia Code", Consolas, "Courier New", monospace; font-size: 8.8pt; background: #f1f5f9; padding: 1px 4px; border-radius: 3px; }}
  pre code {{ background: transparent; padding: 0; }}
  img {{
    display: block; max-width: 96%; max-height: 115mm; width: auto; height: auto;
    margin: 10px auto; border: 1px solid #e2e8f0; border-radius: 4px; padding: 4px;
    background: #ffffff; page-break-inside: avoid;
  }}
  blockquote {{ margin: 8px 0; padding: 6px 12px; border-left: 3px solid #0284c7; background: #f0f9ff; color: #334155; font-size: 9.2pt; }}
  .katex-display {{ margin: 8px 0 !important; overflow: visible !important; }}
</style>
</head>
<body>
<div class="doc-cover">
  <h1>{html_lib.escape(title)}</h1>
  <p>{html_lib.escape(subtitle)}</p>
</div>
{body_html}
<script>
document.addEventListener("DOMContentLoaded", function() {{
  if (typeof renderMathInElement === "function") {{
    renderMathInElement(document.body, {{
      delimiters: [
        {{left: "$$", right: "$$", display: true}},
        {{left: "$", right: "$", display: false}},
        {{left: "\\\\(", right: "\\\\)", display: false}},
        {{left: "\\\\[", right: "\\\\]", display: true}}
      ],
      throwOnError: false,
      strict: false
    }});
  }}
}});
</script>
</body>
</html>
"""
    tmp_html = str(Path(pdf_path).with_suffix(".render.html"))
    Path(tmp_html).write_text(html_doc, encoding="utf-8")

    chrome = chrome_exe or detect_chrome()
    cmd = [
        chrome,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--allow-file-access-from-files",
        "--virtual-time-budget=20000",
        "--no-pdf-header-footer",
        f"--print-to-pdf={os.path.abspath(pdf_path)}",
        Path(tmp_html).resolve().as_uri(),
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0 or not os.path.exists(pdf_path):
        raise RuntimeError(f"Chrome PDF build failed ({res.returncode}): {res.stderr}")
    try:
        os.remove(tmp_html)
    except OSError:
        pass

    opt_pdf = Path(pdf_path).with_suffix(".opt.pdf")
    doc = pymupdf.open(pdf_path)
    doc.save(str(opt_pdf), garbage=4, deflate=True, clean=True)
    doc.close()
    if opt_pdf.stat().st_size < Path(pdf_path).stat().st_size:
        os.replace(opt_pdf, pdf_path)
    else:
        opt_pdf.unlink()
    print(f"[PDF] Compiled {pdf_path} ({os.path.getsize(pdf_path)/1024/1024:.2f} MB)", flush=True)


def run_pipeline(args) -> None:
    os.makedirs(args.out_dir, exist_ok=True)
    images_dir = os.path.join(args.out_dir, args.images_subdir)
    os.makedirs(images_dir, exist_ok=True)
    ckpt_dir = os.path.join(args.work_dir, f"{args.name}_ckpt")
    os.makedirs(ckpt_dir, exist_ok=True)

    md_path = os.path.join(args.out_dir, f"{args.name}.md")
    pdf_path = os.path.join(args.out_dir, f"{args.name}.pdf")

    if args.compile_only:
        compile_markdown_to_pdf(md_path, pdf_path, args.title, args.subtitle, args.katex_dir, args.chrome)
        return

    doc = pymupdf.open(args.input)
    total_pages = len(doc)
    start_pg = max(1, args.start_page)
    end_pg = min(total_pages, args.end_page) if args.end_page > 0 else total_pages

    pending = [
        pno
        for pno in range(start_pg, end_pg + 1)
        if args.force or not os.path.exists(os.path.join(ckpt_dir, f"p{pno:04d}.json"))
    ]
    print(f"[INIT] {args.input}: pages {start_pg}..{end_pg}/{total_pages}, pending={len(pending)}", flush=True)

    proc = None
    log_f = None
    if pending:
        if not args.model or not args.mmproj:
            raise ValueError("Specificare --model e --mmproj per eseguire l'inferenza GPU.")
        log_path = os.path.join(ckpt_dir, "llama_server.log")
        log_f = open(log_path, "w", encoding="utf-8")
        cmd = [
            args.llama_server,
            "-m", args.model,
            "--mmproj", args.mmproj,
            "-ngl", "99",
            "-c", str(args.ctx),
            "--reasoning", "off",
            "--image-min-tokens", "1024",
            "--host", "127.0.0.1",
            "--port", str(args.port),
            "--parallel", "1",
        ]
        proc = subprocess.Popen(cmd, stdout=log_f, stderr=subprocess.STDOUT)
        if not wait_server(args.port, proc, timeout=150):
            proc.kill()
            log_f.close()
            raise RuntimeError(f"llama-server failed to start. Check {log_path}")

    try:
        t_batch = time.time()
        for done_now, pno in enumerate(pending, 1):
            t0 = time.time()
            pix_ocr = doc[pno - 1].get_pixmap(dpi=args.ocr_dpi)
            img_ocr = Image.frombytes("RGB", [pix_ocr.width, pix_ocr.height], pix_ocr.samples)
            img_scaled = scale_image_grid(img_ocr, max_dim=args.max_dim, grid=28)

            raw_html, meta = ocr_single_page(args.port, img_scaled, max_tokens=args.max_tokens)
            if detect_repeat_token(raw_html) or meta.get("finish_reason") == "length":
                raw_html, meta = ocr_single_page(
                    args.port, img_scaled, max_tokens=args.max_tokens,
                    temperature=0.25, top_p=0.9, repeat_penalty=1.12,
                )

            with open(os.path.join(ckpt_dir, f"p{pno:04d}.json"), "w", encoding="utf-8") as f:
                json.dump(
                    {"page": pno, "raw_html": raw_html, "elapsed_s": round(time.time() - t0, 2), "meta": meta},
                    f, ensure_ascii=False,
                )
            avg_s = (time.time() - t_batch) / done_now
            eta_m = (avg_s * (len(pending) - done_now)) / 60.0
            print(f"  [p.{pno:03d}/{end_pg:03d}] {time.time()-t0:5.1f}s | chars={len(raw_html):5d} | ETA={eta_m:4.1f} min", flush=True)
    finally:
        if proc is not None:
            proc.terminate()
            try:
                proc.wait(timeout=10)
            except Exception:
                proc.kill()
        if log_f is not None:
            log_f.close()

    for old_f in os.listdir(images_dir):
        if re.match(r"^p\d+_fig\d+\.png$", old_f):
            os.remove(os.path.join(images_dir, old_f))

    sections = []
    total_figs = 0
    for pno in range(start_pg, end_pg + 1):
        ck_path = os.path.join(ckpt_dir, f"p{pno:04d}.json")
        if not os.path.exists(ck_path):
            continue
        raw_html = json.loads(Path(ck_path).read_text(encoding="utf-8")).get("raw_html", "")
        if not raw_html.strip():
            continue
        needs_crop = bool(
            re.search(r'data-label\s*=\s*["\'](?:image|figure|diagram)["\']', raw_html, re.I)
            or re.search(r"<img\b", raw_html, re.I)
        )
        if needs_crop:
            pix_hi = doc[pno - 1].get_pixmap(dpi=args.crop_dpi)
            hi_img = Image.frombytes("RGB", [pix_hi.width, pix_hi.height], pix_hi.samples)
        else:
            hi_img = Image.new("RGB", (1000, 1414), (255, 255, 255))

        page_md, figs = process_page_html(
            raw_html, hi_img, page_num=pno, images_dir=images_dir,
            images_rel_prefix=args.images_subdir, skip_watermarks=True,
        )
        total_figs += len(figs)
        if page_md:
            sections.append(f"<!-- Pagina {pno} -->\n\n{page_md}")

    doc.close()

    header = f"# {args.title}\n\n> {args.subtitle}\n\n---\n\n"
    full_md = header + "\n\n---\n\n".join(sections) + "\n"
    Path(md_path).write_text(full_md, encoding="utf-8")
    print(f"[MD] Wrote {md_path} ({len(full_md):,} chars, {total_figs} figures)", flush=True)

    if total_figs == 0 and os.path.isdir(images_dir) and not os.listdir(images_dir):
        os.rmdir(images_dir)

    if not args.no_pdf:
        compile_markdown_to_pdf(md_path, pdf_path, args.title, args.subtitle, args.katex_dir, args.chrome)


def main() -> None:
    p = argparse.ArgumentParser(description="Pipeline OCR AI locale (Chandra OCR 2 GGUF -> MD + images/ + PDF)")
    p.add_argument("--input", required=True, help="PDF scansionato di input")
    p.add_argument("--out-dir", required=True, help="Cartella di output per .md, .pdf e images/")
    p.add_argument("--name", required=True, help="Nome base file (senza estensione)")
    p.add_argument("--title", required=True, help="Titolo del documento")
    p.add_argument("--subtitle", default="Digitalizzato con OCR AI locale (Chandra OCR 2 Q8_0)")
    p.add_argument("--images-subdir", default="images")
    p.add_argument("--work-dir", default="./ocr_work")
    p.add_argument("--llama-server", default=shutil.which("llama-server") or "llama-server")
    p.add_argument("--model", default=os.environ.get("OCR_MODEL_GGUF", ""))
    p.add_argument("--mmproj", default=os.environ.get("OCR_MMPROJ_GGUF", ""))
    p.add_argument("--katex-dir", default=os.environ.get("KATEX_DIR", ""))
    p.add_argument("--chrome", default=None)
    p.add_argument("--port", type=int, default=8088)
    p.add_argument("--ctx", type=int, default=12288)
    p.add_argument("--max-tokens", type=int, default=6144)
    p.add_argument("--ocr-dpi", type=int, default=192)
    p.add_argument("--crop-dpi", type=int, default=240)
    p.add_argument("--max-dim", type=int, default=1792)
    p.add_argument("--start-page", type=int, default=1)
    p.add_argument("--end-page", type=int, default=0)
    p.add_argument("--force", action="store_true")
    p.add_argument("--no-pdf", action="store_true")
    p.add_argument("--compile-only", action="store_true")
    run_pipeline(p.parse_args())


if __name__ == "__main__":
    main()
