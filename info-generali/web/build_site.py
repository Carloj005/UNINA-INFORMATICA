#!/usr/bin/env python3
"""
Generatore statico del Portale Web Ricercabile UNINA-INFORMATICA (GitHub Pages).
Funziona sia localmente (con file Git LFS scaricati) sia in GitHub Actions con `lfs: false`
(leggendo la dimensione reale in byte direttamente dai puntatori testuali Git LFS,
senza consumare banda mensile Git LFS!).
"""

import os
import re
import json
import shutil
import argparse
from datetime import datetime, timezone
from urllib.parse import quote

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), "template.html")

LFS_POINTER_PREFIX = b"version https://git-lfs.github.com/spec/v1"
LFS_SIZE_RE = re.compile(rb"^size\s+(\d+)", re.MULTILINE)


def url_encode_path(rel_path: str) -> str:
    return "/".join(quote(part) for part in rel_path.replace(os.sep, "/").split("/"))


def real_file_size(full_path: str) -> int:
    sz = os.path.getsize(full_path)
    if 0 < sz < 300:
        try:
            with open(full_path, "rb") as fp:
                head = fp.read(280)
            if head.startswith(LFS_POINTER_PREFIX):
                m = LFS_SIZE_RE.search(head)
                if m:
                    return int(m.group(1))
        except OSError:
            pass
    return sz


def extract_md_field(text: str, label: str, default: str = "") -> str:
    m = re.search(rf"\*\*{re.escape(label)}:\*\*\s*(.+)", text)
    if not m:
        return default
    val = m.group(1).strip()
    # Strip markdown links [label](url) -> label and backticks
    val = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", val)
    return val.strip("` ")


def parse_teams_info(prof_readme_text: str):
    m = re.search(r"Codice Teams[^:\n]*:\s*(.*)", prof_readme_text, re.IGNORECASE)
    if not m:
        return "", ""
    raw = m.group(1).strip()
    if not raw or raw.lower() in ("n/a", "-", "da definire", "nessuno"):
        return "", ""
    url_m = re.search(r"\((https?://[^)]+)\)", raw)
    if url_m:
        return "", url_m.group(1)
    if raw.startswith("http://") or raw.startswith("https://"):
        return "", raw
    return raw.strip("`*_ "), ""


def build_catalog(repo: str):
    courses = []
    files_index = []
    total_bytes = 0
    teams_count = 0

    # Discover all 31 courses
    course_dirs = []
    for yr in ("Primo Anno", "Secondo Anno", "Terzo Anno"):
        yp = os.path.join(repo, yr)
        if not os.path.isdir(yp):
            continue
        for sem in sorted(os.listdir(yp)):
            sp = os.path.join(yp, sem)
            if not os.path.isdir(sp):
                continue
            for cname in sorted(os.listdir(sp)):
                cp = os.path.join(sp, cname)
                if os.path.isdir(cp):
                    course_dirs.append((yr, cp))

    esp = os.path.join(repo, "Esami a Scelta")
    if os.path.isdir(esp):
        for cname in sorted(os.listdir(esp)):
            cp = os.path.join(esp, cname)
            if os.path.isdir(cp):
                course_dirs.append(("Esami a Scelta", cp))

    for year_group, cp in course_dirs:
        rel_c = os.path.relpath(cp, repo).replace(os.sep, "/")
        cname = os.path.basename(cp)
        creadme_p = os.path.join(cp, "README.md")
        creadme = open(creadme_p, encoding="utf-8", errors="replace").read() if os.path.exists(creadme_p) else ""

        en_m = re.search(r"^\*([^*]+)\*$", creadme, re.MULTILINE)
        title_en = en_m.group(1).strip() if en_m else cname
        sem = extract_md_field(creadme, "Semestre", "1°")
        cfu = extract_md_field(creadme, "CFU", "6")
        ssd = extract_md_field(creadme, "Settore Scientifico-Disciplinare (SSD)", "INFO-01/A")
        prop = extract_md_field(creadme, "Propedeuticità", "Nessuna")
        modalita = extract_md_field(creadme, "Modalità d'Esame", "Scritto e orale.")

        ob_m = re.search(r"## 🎯 Obiettivi Formativi\s+(.+?)(?=\n## |\Z)", creadme, re.DOTALL)
        obiettivi = re.sub(r"\s+", " ", ob_m.group(1)).strip() if ob_m else ""

        profs_data = []
        course_file_count = 0

        for entry in sorted(os.listdir(cp)):
            pp = os.path.join(cp, entry)
            if not (os.path.isdir(pp) and entry.startswith("Prof-")):
                continue
            rel_p = f"{rel_c}/{entry}"
            preadme_p = os.path.join(pp, "README.md")
            preadme = open(preadme_p, encoding="utf-8", errors="replace").read() if os.path.exists(preadme_p) else ""
            doc_disp = extract_md_field(preadme, "Docente", entry.replace("Prof-", "Prof. "))
            t_code, t_url = parse_teams_info(preadme)
            if t_code or t_url:
                teams_count += 1

            p_file_count = 0
            for r2, _, f2 in sorted(os.walk(pp)):
                for fn in sorted(f2):
                    if fn in (".gitkeep", "README.md", ".gitignore"):
                        continue
                    fp_full = os.path.join(r2, fn)
                    rel_f = os.path.relpath(fp_full, repo).replace(os.sep, "/")
                    rel_inside_prof = os.path.relpath(fp_full, pp).replace(os.sep, "/")
                    seg = rel_inside_prof.split("/")
                    if seg[0] == "esami" and len(seg) > 1:
                        cat = f"esami/{seg[1]}"
                        subpath = "/".join(seg[2:-1])
                    else:
                        cat = seg[0]
                        subpath = "/".join(seg[1:-1])

                    fsize = real_file_size(fp_full)
                    total_bytes += fsize
                    p_file_count += 1
                    course_file_count += 1
                    ext = os.path.splitext(fn)[1].lower()
                    search_blob = f"{fn} {cname} {doc_disp} {year_group} {cat} {subpath}".lower()
                    files_index.append({
                        "name": fn,
                        "ext": ext,
                        "size": fsize,
                        "yearGroup": year_group,
                        "course": cname,
                        "prof": doc_disp,
                        "cat": cat,
                        "subpath": subpath,
                        "urlPath": url_encode_path(rel_f),
                        "searchBlob": search_blob,
                    })

            profs_data.append({
                "folder": entry,
                "display": doc_disp,
                "teamsCode": t_code,
                "teamsUrl": t_url,
                "fileCount": p_file_count,
                "urlPath": url_encode_path(rel_p),
            })

        mat_icon = "🟢" if course_file_count >= 15 else ("🟡" if course_file_count >= 1 else "⚪")
        c_blob = f"{cname} {title_en} {ssd} {prop} {' '.join(p['display'] for p in profs_data)}".lower()
        courses.append({
            "name": cname,
            "titleEn": title_en,
            "yearGroup": year_group,
            "semester": sem,
            "cfu": cfu,
            "ssd": ssd,
            "propedeuticita": prop,
            "modalita": modalita,
            "obiettivi": obiettivi,
            "matIcon": mat_icon,
            "fileCount": course_file_count,
            "relPath": rel_c,
            "urlPath": url_encode_path(rel_c),
            "profs": profs_data,
            "searchBlob": c_blob,
        })

    # Index general guides in info-generali (excluding scripts/ and web/)
    ig_dir = os.path.join(repo, "info-generali")
    if os.path.isdir(ig_dir):
        for fn in sorted(os.listdir(ig_dir)):
            fp_full = os.path.join(ig_dir, fn)
            if os.path.isfile(fp_full) and not fn.startswith("."):
                rel_f = f"info-generali/{fn}"
                fsize = real_file_size(fp_full)
                total_bytes += fsize
                ext = os.path.splitext(fn)[1].lower()
                files_index.append({
                    "name": fn,
                    "ext": ext,
                    "size": fsize,
                    "yearGroup": "Info Generali",
                    "course": "Guide & Mappe d'Ateneo",
                    "prof": "",
                    "cat": "info-generali",
                    "subpath": "",
                    "urlPath": url_encode_path(rel_f),
                    "searchBlob": f"{fn} info generali guida mappa orario lezioni".lower(),
                })

    now_str = datetime.now(timezone.utc).strftime("%d/%m/%Y")
    return {
        "stats": {
            "totalBytes": total_bytes,
            "teamsCount": teams_count,
            "generatedAt": now_str,
        },
        "courses": courses,
        "files": files_index,
    }


def main():
    parser = argparse.ArgumentParser(description="Genera il sito statico per GitHub Pages.")
    parser.add_argument("--out", default="_site", help="Cartella di output (default: _site)")
    args = parser.parse_args()

    out_dir = os.path.abspath(args.out)
    assets_dir = os.path.join(out_dir, "assets")
    os.makedirs(assets_dir, exist_ok=True)

    catalog = build_catalog(REPO_ROOT)
    template = open(TEMPLATE_PATH, encoding="utf-8").read()
    # Escape </script> safely inside JSON
    json_payload = json.dumps(catalog, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    html = template.replace("__UNINA_JSON_PAYLOAD__", json_payload)

    with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as fp:
        fp.write(html)

    with open(os.path.join(out_dir, ".nojekyll"), "w", encoding="utf-8"):
        pass

    # Copy Campus Maps into assets/
    for map_name in ("MappaMSA.png", "MappaViaClaudio.jpg"):
        src = os.path.join(REPO_ROOT, "info-generali", map_name)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(assets_dir, map_name))

    print(
        f"✅ Portale Web generato in '{out_dir}': "
        f"{len(catalog['courses'])} corsi, {len(catalog['files'])} file indicizzati, "
        f"{catalog['stats']['teamsCount']} codici Teams."
    )


if __name__ == "__main__":
    main()
