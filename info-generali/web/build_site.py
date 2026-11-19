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
import hashlib
import argparse
import subprocess
import unicodedata
from collections import Counter
from datetime import datetime, timezone
from urllib.parse import quote

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
WEB_DIR = os.path.dirname(os.path.abspath(__file__))
SRC_DIR = os.path.join(WEB_DIR, "src")
TEMPLATE_PATH = os.path.join(WEB_DIR, "template.html")
STYLES_SRC_PATH = os.path.join(SRC_DIR, "styles.css")
APP_SRC_PATH = os.path.join(SRC_DIR, "app.js")
THEME_INIT_SRC_PATH = os.path.join(SRC_DIR, "theme-init.js")
EXAM_CALENDAR_PATH = os.path.join(WEB_DIR, "exam_calendar.json")

LFS_POINTER_PREFIX = b"version https://git-lfs.github.com/spec/v1"
LFS_SIZE_RE = re.compile(rb"^size\s+(\d+)", re.MULTILINE)

# Sigle e alias comuni usati dagli studenti per la ricerca rapida
COURSE_ALIASES = {
    "Architettura degli Elaboratori": "ade architettura elaboratori",
    "Analisi Matematica 1": "analisi 1 am1 analisi1",
    "Programmazione 1": "prog 1 prog1 pr1",
    "Algebra": "alg",
    "Programmazione Object Oriented": "poo oop oggetti",
    "Basi di Dati": "bd db sql",
    "Analisi e Progettazione di Strutture Dati": "apsd asd lasd strutture dati",
    "Elementi di Informatica Teorica": "it eoit teorica automi",
    "Fisica Generale 1": "fisica 1 fisica1 fg1",
    "Geometria": "geom",
    "Sistemi Operativi": "so os kernel",
    "Analisi e Progettazione di Algoritmi": "apa algoritmi algo",
    "Linguaggi di Programmazione 1": "lp1 lmp lmc linguaggi prolog lisp",
    "Metodi Statistici per l'Informazione": "msi eps statistica probabilita",
    "Reti e Programmazione Distribuita": "rpd reti",
    "Ingegneria del Software": "ingsw is",
    "Tecnologie Web": "tecweb tw web",
    "AI Technologies": "ait ai intelligenza artificiale",
    "Tecniche di Programmazione Avanzata": "tpa",
    "Economia e Organizzazione Aziendale": "eoa economia",
    "Multimedia Information Systems": "mis multimedia",
    "Algorithm Design": "ad",
    "Ricerca Operativa": "ro ero ricerca operativa",
    "Calcolo Numerico": "cn",
    "Computer Forensics": "cf forensics",
    "Logics for Computer Science": "lcs logica",
    "Operating Systems for Mobile, Cloud and IoT": "osmci iot",
    "Parallel and Distributed Computing": "pdc",
    "Scientific Computing": "sc",
    "Diritto dell'Informatica": "diritto",
    "Istituzioni di Matematica II": "im2 istituzioni matematica 2",
}

# Artefatti temporanei di compilazione e fixture di test grezze da escludere dall'indice di ricerca
IGNORED_INDEX_EXTS = {
    ".aux", ".log", ".out", ".toc",
    ".out_copia", ".in_rif", ".in_out_copia", ".in_copia", ".in_out_rif", ".out_rif",
}


def norm_search_text(s: str) -> str:
    nfd = unicodedata.normalize("NFD", s.lower())
    return "".join(ch for ch in nfd if unicodedata.category(ch) != "Mn")


def fmt_bytes(b: int) -> str:
    if not b or b <= 0:
        return "—"
    if b >= 1073741824:
        return f"{b / 1073741824:.2f} GB"
    if b >= 1048576:
        return f"{b / 1048576:.1f} MB"
    if b >= 1024:
        return f"{round(b / 1024)} KB"
    return f"{b} B"

# Regex patterns for extracting exam/material dates
RE_DMY = re.compile(r"(?<!\d)(0[1-9]|[12]\d|3[01])[-_.](0[1-9]|1[0-2])[-_.](20[12]\d)(?!\d)")
RE_YMD = re.compile(r"(?<!\d)(20[12]\d)[-_.](0[1-9]|1[0-2])[-_.](0[1-9]|[12]\d|3[01])(?!\d)")
RE_AA = re.compile(r"(?<!\d)(20[12]\d)[-_/](20[12]\d|\d{2})(?!\d)")
RE_YEAR = re.compile(r"(?<!\d)(20[12]\d)(?!\d)")


def url_encode_path(rel_path: str) -> str:
    return "/".join(quote(part) for part in rel_path.replace(os.sep, "/").split("/"))


def extract_date_info(name: str, subpath: str):
    """Restituisce (dateIso, dateDisplay) estratti da subpath o nome file."""
    combined = f"{subpath} {name}"
    m = RE_DMY.search(combined)
    if m:
        d, mo, y = m.group(1), m.group(2), m.group(3)
        return f"{y}-{mo}-{d}", f"{d}/{mo}/{y}"
    m = RE_YMD.search(combined)
    if m:
        y, mo, d = m.group(1), m.group(2), m.group(3)
        return f"{y}-{mo}-{d}", f"{d}/{mo}/{y}"
    m = RE_AA.search(combined)
    if m:
        y1, y2 = m.group(1), m.group(2)
        if len(y2) == 2:
            y2 = y1[:2] + y2
        if int(y2) == int(y1) + 1:
            return f"{y1}-10-01", f"{y1}/{y2}"
    m = RE_YEAR.search(combined)
    if m:
        y = m.group(1)
        return f"{y}-01-01", y
    return "", ""


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
    val = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", val)
    return val.strip("` ")


TEAMS_CODE_RE = re.compile(r"^[A-Za-z0-9]{6,12}$")


def parse_teams_info(prof_readme_text: str):
    m = re.search(r"Codice Teams[^:\n]*:[ \t]*(.*)", prof_readme_text, re.IGNORECASE)
    if not m:
        return "", ""
    raw = m.group(1).strip()
    if not raw or raw.lower() in ("n/a", "-", "da definire", "nessuno"):
        return "", ""
    url_m = re.search(r"\((https://[^)\s]+)\)", raw)
    if url_m:
        return "", url_m.group(1)
    if raw.startswith("https://"):
        return "", raw.split()[0]
    cleaned = raw.strip("`*_ ")
    if TEAMS_CODE_RE.fullmatch(cleaned):
        return cleaned, ""
    return "", ""


def extract_recent_updates(repo: str, prof_display_map: dict) -> list:
    """Estrae gli ultimi aggiornamenti didattici reali dalla cronologia Git."""
    updates = []
    seen_keys = set()
    per_course_counts = {}
    root_commits = set()
    try:
        roots_out = subprocess.check_output(
            ["git", "rev-list", "--max-parents=0", "HEAD"],
            cwd=repo,
            text=True,
            errors="replace",
        )
        root_commits = {h.strip() for h in roots_out.splitlines() if h.strip()}
    except Exception:
        pass

    try:
        out = subprocess.check_output(
            [
                "git",
                "-c",
                "core.quotePath=false",
                "log",
                "-n",
                "80",
                "--no-merges",
                "--date=format:%d/%m/%Y",
                "--pretty=format:COMMIT|%H|%ad|%s",
                "--name-status",
                "--",
                "Primo Anno",
                "Secondo Anno",
                "Terzo Anno",
                "Esami a Scelta",
            ],
            cwd=repo,
            text=True,
            errors="replace",
        )
    except Exception:
        return updates

    cur_hash = ""
    cur_date = ""
    cur_subj = ""
    skip_commit = False
    for line in out.splitlines():
        line = line.strip()
        if not line:
            continue
        if line.startswith("COMMIT|"):
            parts = line.split("|", 3)
            cur_hash = parts[1].strip() if len(parts) > 1 else ""
            cur_date = parts[2].strip() if len(parts) > 2 else ""
            cur_subj = (parts[3] if len(parts) > 3 else "").lower()
            skip_commit = cur_hash in root_commits
            continue

        if skip_commit:
            continue

        cols = line.split("\t")
        if len(cols) < 2:
            continue
        status = cols[0]
        is_add = status.startswith("A")
        is_ren = status.startswith("R")
        is_mod = status.startswith("M") and "compress" not in cur_subj
        if not (is_add or is_ren or is_mod):
            continue
        rel_path = cols[-1].replace("\\", "/")
        if any(rel_path.endswith(ign) for ign in (".gitkeep", "README.md", ".gitignore", "crediti.txt")):
            continue

        segs = rel_path.split("/")
        year_group = ""
        course = ""
        prof_folder = ""
        rest = []
        if segs[0] in ("Primo Anno", "Secondo Anno", "Terzo Anno") and len(segs) >= 5:
            year_group = segs[0]
            course = segs[2]
            prof_folder = segs[3]
            rest = segs[4:]
        elif segs[0] == "Esami a Scelta" and len(segs) >= 4:
            year_group = "Esami a Scelta"
            course = segs[1]
            prof_folder = segs[2]
            rest = segs[3:]
        else:
            continue

        if not prof_folder.startswith("Prof-") or not rest:
            continue

        full_check = os.path.join(repo, rel_path)
        if not os.path.exists(full_check):
            continue

        if rest[0] == "esami" and len(rest) >= 2:
            cat = f"esami/{rest[1]}"
            sub_segs = rest[2:-1]
        else:
            cat = rest[0]
            sub_segs = rest[1:-1]

        top_sub = sub_segs[0] if sub_segs else ""
        fname = rest[-1]
        label = top_sub if top_sub else fname
        dedup_key = (course, prof_folder, cat, top_sub)
        if dedup_key in seen_keys:
            continue
        if per_course_counts.get(course, 0) >= 2:
            continue
        seen_keys.add(dedup_key)
        per_course_counts[course] = per_course_counts.get(course, 0) + 1

        prof_disp = prof_display_map.get(f"{course}/{prof_folder}", prof_folder.replace("Prof-", "Prof. "))
        updates.append({
            "date": cur_date,
            "action": "Nuovo" if is_add else "Aggiornato",
            "yearGroup": year_group,
            "course": course,
            "prof": prof_disp,
            "cat": cat,
            "subpath": top_sub,
            "label": label,
        })
        if len(updates) >= 8:
            break

    return updates


def load_exam_calendar() -> dict:
    """Carica il calendario esami Triennale generato da sync_exam_calendar.py."""
    if os.path.exists(EXAM_CALENDAR_PATH):
        try:
            with open(EXAM_CALENDAR_PATH, encoding="utf-8") as fp:
                return json.load(fp)
        except Exception:
            pass
    try:
        from sync_exam_calendar import sync_calendar
        return sync_calendar(out_path=EXAM_CALENDAR_PATH)
    except Exception:
        return {
            "academicYear": "",
            "sourcePageUrl": "https://informatica.dieti.unina.it/index.php/it/servizi-per-gli-studenti/calendario-esami/calendario-esami-laurea-triennale",
            "pdfUrl": "",
            "sessionTitle": "Calendario Esami Laurea Triennale",
            "pdfModifiedAt": "",
            "totalEntries": 0,
            "totalDates": 0,
            "months": [],
            "entries": [],
        }


def build_catalog(repo: str):
    courses = []
    files_index = []
    total_bytes = 0
    teams_count = 0
    prof_display_map = {}

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
        aliases = COURSE_ALIASES.get(cname, "")
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
            raw_prof_name = re.sub(r"(?<=[a-z])(?=[A-Z])", " ", entry[5:])
            fallback_prof = "Da Definire" if entry == "Prof-DaDefinire" else f"Prof. {raw_prof_name}"
            doc_disp = extract_md_field(preadme, "Docente", fallback_prof)
            prof_display_map[f"{cname}/{entry}"] = doc_disp
            t_code, t_url = parse_teams_info(preadme)
            if t_code or t_url:
                teams_count += 1

            p_file_count = 0
            for r2, _, f2 in sorted(os.walk(pp)):
                for fn in sorted(f2):
                    if fn in (".gitkeep", "README.md", ".gitignore"):
                        continue
                    ext = os.path.splitext(fn)[1].lower()
                    if ext in IGNORED_INDEX_EXTS:
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
                    date_iso, date_disp = extract_date_info(fn, subpath)
                    search_blob = norm_search_text(
                        f"{fn} {cname} {aliases} {doc_disp} {year_group} {cat} {subpath} {date_disp}"
                    )
                    files_index.append({
                        "name": fn,
                        "ext": ext,
                        "size": fsize,
                        "yearGroup": year_group,
                        "course": cname,
                        "prof": doc_disp,
                        "cat": cat,
                        "subpath": subpath,
                        "dateIso": date_iso,
                        "dateDisplay": date_disp,
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

        mat_level = "high" if course_file_count >= 15 else ("medium" if course_file_count >= 1 else "empty")
        c_blob = norm_search_text(
            f"{cname} {aliases} {title_en} {ssd} {prop} {' '.join(p['display'] for p in profs_data)}"
        )
        courses.append({
            "name": cname,
            "aliases": aliases,
            "titleEn": title_en,
            "yearGroup": year_group,
            "semester": sem,
            "cfu": cfu,
            "ssd": ssd,
            "propedeuticita": prop,
            "modalita": modalita,
            "obiettivi": obiettivi,
            "matIcon": mat_level,
            "matLevel": mat_level,
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
                date_iso, date_disp = extract_date_info(fn, "")
                files_index.append({
                    "name": fn,
                    "ext": ext,
                    "size": fsize,
                    "yearGroup": "Info Generali",
                    "course": "Guide & Mappe d'Ateneo",
                    "prof": "",
                    "cat": "info-generali",
                    "subpath": "",
                    "dateIso": date_iso,
                    "dateDisplay": date_disp,
                    "urlPath": url_encode_path(rel_f),
                    "searchBlob": norm_search_text(f"{fn} info generali guida mappa orario lezioni"),
                })

    recent_updates = extract_recent_updates(repo, prof_display_map)
    exam_calendar = load_exam_calendar()
    now_str = datetime.now(timezone.utc).strftime("%d/%m/%Y")
    return {
        "stats": {
            "totalBytes": total_bytes,
            "teamsCount": teams_count,
            "generatedAt": now_str,
        },
        "recentUpdates": recent_updates,
        "examCalendar": exam_calendar,
        "courses": courses,
        "files": files_index,
    }


def content_hash8(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()[:8]


def optimize_html(html: str) -> str:
    """Deduplica le icone SVG inline ripetute e compatta gli spazi HTML in sicurezza."""
    pat = re.compile(r'<svg class="([^"]+)" viewBox="0 0 24 24">(.*?)</svg>', re.S)
    counts = Counter(m.group(2) for m in pat.finditer(html))
    sym_map = {}
    symbols = []
    for body, cnt in counts.items():
        if cnt >= 2:
            sid = f"i{len(symbols)}"
            sym_map[body] = sid
            symbols.append(f'<symbol id="{sid}" viewBox="0 0 24 24">{body}</symbol>')
    if symbols:
        html = pat.sub(
            lambda m: f'<svg class="{m.group(1)}" aria-hidden="true"><use href="#{sym_map[m.group(2)]}"/></svg>'
            if m.group(2) in sym_map
            else m.group(0),
            html,
        )
        html = html.replace("<body>", f'<body><svg hidden aria-hidden="true"><defs>{"".join(symbols)}</defs></svg>', 1)

    html = re.sub(
        r'(<script type="application/ld\+json">)(.*?)(</script>)',
        lambda m: m.group(1) + re.sub(r"\s+", " ", m.group(2)).strip() + m.group(3),
        html,
        flags=re.S,
    )
    html = re.sub(r"<!--.*?-->", "", html, flags=re.S)
    html = "\n".join(line.strip() for line in html.splitlines() if line.strip())
    html = re.sub(r">\n<", "><", html)
    return html


def write_404_page(out_dir: str, styles_file: str, theme_init_file: str):
    page_404 = f"""<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="color-scheme" content="light dark">
  <meta name="theme-color" id="meta-theme-color" content="#f4f7fb">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; object-src 'none'; base-uri 'self';">
  <title>Pagina non trovata — Unina Informatica</title>
  <link rel="icon" type="image/svg+xml" href="./favicon.svg">
  <link rel="apple-touch-icon" sizes="180x180" href="./apple-touch-icon.png">
  <script src="./{theme_init_file}"></script>
  <link rel="stylesheet" href="./{styles_file}">
</head>
<body>
  <main style="flex:1;display:grid;place-items:center;padding:32px 16px;">
    <section class="empty-state-card" style="max-width:520px;width:100%;">
      <p class="kicker" style="margin-bottom:4px;">ERRORE 404</p>
      <h1 style="margin:0;font-size:1.75rem;color:var(--text);">Pagina non trovata</h1>
      <p>Il percorso richiesto non esiste oppure il materiale è stato spostato nell'archivio didattico di Informatica Federico II.</p>
      <div class="empty-state-actions">
        <a class="btn btn-primary" href="./">Torna alla Home</a>
        <a class="btn" href="./#catalogo">Apri il Catalogo</a>
        <a class="btn" href="./#calendario">Calendario esami</a>
      </div>
    </section>
  </main>
</body>
</html>
"""
    with open(os.path.join(out_dir, "404.html"), "w", encoding="utf-8") as fp:
        fp.write(page_404)


def write_pwa_and_seo_files(
    out_dir: str,
    generated_at: str,
    version_tag: str,
    styles_file: str,
    theme_init_file: str,
    app_file: str,
):
    manifest = {
        "id": "./",
        "name": "Unina Informatica — Archivio Didattico Federico II",
        "short_name": "Unina Info",
        "description": "Catalogo ricercabile di slide, appunti, tracce d'esame, codici Teams, calendario appelli DIETI e mappe per Informatica (Federico II).",
        "start_url": "./",
        "scope": "./",
        "display": "standalone",
        "background_color": "#070d19",
        "theme_color": "#0f4c81",
        "lang": "it",
        "categories": ["education", "utilities"],
        "icons": [
            {
                "src": "./favicon.svg",
                "sizes": "any",
                "type": "image/svg+xml",
                "purpose": "any",
            },
            {
                "src": "./assets/icon-192.png",
                "sizes": "192x192",
                "type": "image/png",
                "purpose": "any",
            },
            {
                "src": "./assets/icon-512.png",
                "sizes": "512x512",
                "type": "image/png",
                "purpose": "any",
            },
            {
                "src": "./assets/icon-maskable-512.png",
                "sizes": "512x512",
                "type": "image/png",
                "purpose": "maskable",
            },
        ],
        "shortcuts": [
            {
                "name": "Catalogo file ed esami",
                "short_name": "Catalogo",
                "url": "./#catalogo",
                "description": "Cerca slide, appunti e tracce d'esame",
            },
            {
                "name": "Calendario appelli DIETI",
                "short_name": "Calendario",
                "url": "./#calendario",
                "description": "Consulta date e countdown degli appelli",
            },
            {
                "name": "Corsi e codici Teams",
                "short_name": "Corsi",
                "url": "./#corsi",
                "description": "Insegnamenti, propedeuticità e codici Microsoft Teams",
            },
        ],
    }
    with open(os.path.join(out_dir, "manifest.webmanifest"), "w", encoding="utf-8") as fp:
        json.dump(manifest, fp, ensure_ascii=False, indent=2)

    cache_suffix = f"{generated_at.replace('/', '')}{('-' + version_tag) if version_tag else ''}"
    sw_code = f"""// Service Worker PWA per consultazione offline della shell leggera, dei dati con content-hash e delle mappe on-demand
const CACHE_NAME = 'unina-info-v3-{cache_suffix}';
const PRECACHE_ASSETS = [
  './',
  './{styles_file}',
  './{theme_init_file}',
  './{app_file}',
  './favicon.svg',
  './manifest.webmanifest'
];
const HASHED_ASSET_RE = /\\.[a-f0-9]{{8}}\\.(css|js|json)$/i;

self.addEventListener('install', (event) => {{
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS)).then(() => self.skipWaiting())
  );
}});

self.addEventListener('activate', (event) => {{
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
}});

self.addEventListener('fetch', (event) => {{
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Cache-first per asset immutabili con content-hash (CSS, JS, JSON) e caching lazy on-demand per mappe/icone in /assets/
  if (
    HASHED_ASSET_RE.test(url.pathname) ||
    url.pathname.includes('/assets/') ||
    url.pathname.endsWith('/favicon.svg') ||
    url.pathname.endsWith('/apple-touch-icon.png')
  ) {{
    event.respondWith(
      caches.match(event.request).then((cached) => cached || fetch(event.request).then((resp) => {{
        if (resp && resp.ok) {{
          const clone = resp.clone();
          caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
        }}
        return resp;
      }}))
    );
    return;
  }}

  // Network-first (bypass HTTP cache) per la shell HTML e manifest così gli aggiornamenti giornalieri arrivano subito
  event.respondWith(
    fetch(new Request(event.request, {{ cache: 'no-cache' }}))
      .then((resp) => {{
        if (resp && resp.ok) {{
          const clone = resp.clone();
          caches.open(CACHE_NAME).then((c) => c.put(event.request, clone));
        }}
        return resp;
      }})
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./')))
  );
}});
"""
    with open(os.path.join(out_dir, "sw.js"), "w", encoding="utf-8") as fp:
        fp.write(sw_code)

    robots_txt = "User-agent: *\nAllow: /\nSitemap: https://carloj005.github.io/UNINA-INFORMATICA/sitemap.xml\n"
    with open(os.path.join(out_dir, "robots.txt"), "w", encoding="utf-8") as fp:
        fp.write(robots_txt)

    iso_today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    sitemap_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://carloj005.github.io/UNINA-INFORMATICA/</loc>
    <lastmod>{iso_today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
"""
    with open(os.path.join(out_dir, "sitemap.xml"), "w", encoding="utf-8") as fp:
        fp.write(sitemap_xml)


def pack_catalog_for_client(catalog: dict) -> dict:
    """Comprime l'indice dei file in formato tabellare dizionario e rimuove campi ricostruibili client-side."""
    files = catalog.get("files", [])
    ygs = sorted({f["yearGroup"] for f in files})
    crs = sorted({f["course"] for f in files})
    prs = sorted({f["prof"] for f in files})
    cts = sorted({f["cat"] for f in files})
    dirs = sorted({f["urlPath"].rsplit("/", 1)[0] for f in files})

    yg_i = {v: i for i, v in enumerate(ygs)}
    cr_i = {v: i for i, v in enumerate(crs)}
    pr_i = {v: i for i, v in enumerate(prs)}
    ct_i = {v: i for i, v in enumerate(cts)}
    dir_i = {v: i for i, v in enumerate(dirs)}

    rows = []
    for f in files:
        d_part = f["urlPath"].rsplit("/", 1)[0]
        row = [
            f["name"],
            f["size"],
            yg_i[f["yearGroup"]],
            cr_i[f["course"]],
            pr_i[f["prof"]],
            ct_i[f["cat"]],
            dir_i[d_part],
        ]
        if f["subpath"] or f["dateIso"] or f["dateDisplay"]:
            row.append(f["subpath"])
        if f["dateIso"] or f["dateDisplay"]:
            row.append(f["dateIso"])
        if f["dateDisplay"]:
            row.append(f["dateDisplay"])
        rows.append(row)

    slim_courses = [
        {k: v for k, v in c.items() if k != "searchBlob"}
        for c in catalog.get("courses", [])
    ]

    return {
        "stats": catalog.get("stats", {}),
        "recentUpdates": catalog.get("recentUpdates", []),
        "courses": slim_courses,
        "filesCompact": {
            "ygs": ygs,
            "crs": crs,
            "prs": prs,
            "cts": cts,
            "dirs": dirs,
            "rows": rows,
        },
    }


def main():
    parser = argparse.ArgumentParser(description="Genera il sito statico per GitHub Pages.")
    parser.add_argument("--out", default="_site", help="Cartella di output (default: _site)")
    args = parser.parse_args()

    out_dir = os.path.abspath(args.out)
    assets_dir = os.path.join(out_dir, "assets")
    data_dir = os.path.join(out_dir, "data")
    os.makedirs(assets_dir, exist_ok=True)
    os.makedirs(data_dir, exist_ok=True)

    # Pulisci eventuali vecchi file con hash da build precedenti nella stessa cartella
    for stale_name in os.listdir(out_dir):
        if re.fullmatch(r"(?:styles|app|theme-init)\.[a-f0-9]{8}\.(?:css|js)", stale_name):
            try:
                os.unlink(os.path.join(out_dir, stale_name))
            except OSError:
                pass
    for stale_name in os.listdir(data_dir):
        if re.fullmatch(r"(?:catalog|calendar)\.[a-f0-9]{8}\.json", stale_name):
            try:
                os.unlink(os.path.join(data_dir, stale_name))
            except OSError:
                pass

    catalog = build_catalog(REPO_ROOT)
    template = open(TEMPLATE_PATH, encoding="utf-8").read()

    # Emetti CSS e JS esterni con content-hash
    styles_bytes = open(STYLES_SRC_PATH, "rb").read()
    styles_file = f"styles.{content_hash8(styles_bytes)}.css"
    with open(os.path.join(out_dir, styles_file), "wb") as fp:
        fp.write(styles_bytes)

    theme_init_bytes = open(THEME_INIT_SRC_PATH, "rb").read()
    theme_init_file = f"theme-init.{content_hash8(theme_init_bytes)}.js"
    with open(os.path.join(out_dir, theme_init_file), "wb") as fp:
        fp.write(theme_init_bytes)

    app_bytes = open(APP_SRC_PATH, "rb").read()
    app_file = f"app.{content_hash8(app_bytes)}.js"
    with open(os.path.join(out_dir, app_file), "wb") as fp:
        fp.write(app_bytes)

    # Emetti catalog.<hash>.json e calendar.<hash>.json separati per invalidazione cache indipendente
    client_catalog = pack_catalog_for_client(catalog)
    catalog_json_bytes = json.dumps(client_catalog, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    catalog_json_rel = f"data/catalog.{content_hash8(catalog_json_bytes)}.json"
    with open(os.path.join(out_dir, catalog_json_rel), "wb") as fp:
        fp.write(catalog_json_bytes)

    calendar_payload = catalog.get("examCalendar", {})
    calendar_json_bytes = json.dumps(calendar_payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    calendar_json_rel = f"data/calendar.{content_hash8(calendar_json_bytes)}.json"
    with open(os.path.join(out_dir, calendar_json_rel), "wb") as fp:
        fp.write(calendar_json_bytes)

    stat_files_str = f"{len(catalog['files']):,}".replace(",", ".")
    stat_courses_str = str(len(catalog["courses"]))
    stat_teams_str = str(catalog["stats"]["teamsCount"])
    stat_size_str = fmt_bytes(catalog["stats"]["totalBytes"])
    stat_updated_str = catalog["stats"]["generatedAt"]
    stat_exams_str = str(calendar_payload.get("totalDates", 0))

    html = (
        template.replace("__STYLES_CSS__", styles_file)
        .replace("__THEME_INIT_JS__", theme_init_file)
        .replace("__APP_JS__", app_file)
        .replace("__CATALOG_JSON__", catalog_json_rel)
        .replace("__CALENDAR_JSON__", calendar_json_rel)
        .replace("__STAT_FILES__", stat_files_str)
        .replace("__STAT_COURSES__", stat_courses_str)
        .replace("__STAT_TEAMS__", stat_teams_str)
        .replace("__STAT_SIZE__", stat_size_str)
        .replace("__STAT_UPDATED__", stat_updated_str)
        .replace("__STAT_EXAMS__", stat_exams_str)
    )
    html = optimize_html(html)

    with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as fp:
        fp.write(html)

    with open(os.path.join(out_dir, ".nojekyll"), "w", encoding="utf-8"):
        pass

    write_404_page(out_dir, styles_file, theme_init_file)

    version_tag = hashlib.sha1(html.encode("utf-8")).hexdigest()[:8]
    write_pwa_and_seo_files(
        out_dir,
        stat_updated_str,
        version_tag,
        styles_file=styles_file,
        theme_init_file=theme_init_file,
        app_file=app_file,
    )

    fav_src = os.path.join(WEB_DIR, "favicon.svg")
    if os.path.exists(fav_src):
        shutil.copy2(fav_src, os.path.join(out_dir, "favicon.svg"))

    web_assets_src = os.path.join(WEB_DIR, "assets")
    if os.path.isdir(web_assets_src):
        shutil.copytree(web_assets_src, assets_dir, dirs_exist_ok=True)
        apple_src = os.path.join(web_assets_src, "apple-touch-icon.png")
        if os.path.exists(apple_src):
            shutil.copy2(apple_src, os.path.join(out_dir, "apple-touch-icon.png"))

    html_kb = len(html.encode("utf-8")) / 1024
    print(
        f"✅ Portale Web generato in '{out_dir}': "
        f"{len(catalog['courses'])} corsi, {len(catalog['files'])} file indicizzati, "
        f"{catalog['stats']['teamsCount']} codici Teams, "
        f"{len(catalog['recentUpdates'])} aggiornamenti recenti, "
        f"{stat_exams_str} appelli d'esame (index.html {html_kb:.1f} KB)."
    )


if __name__ == "__main__":
    main()
