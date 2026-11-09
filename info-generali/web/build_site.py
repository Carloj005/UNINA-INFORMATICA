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
import subprocess
from datetime import datetime, timezone
from urllib.parse import quote

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
TEMPLATE_PATH = os.path.join(os.path.dirname(__file__), "template.html")

LFS_POINTER_PREFIX = b"version https://git-lfs.github.com/spec/v1"
LFS_SIZE_RE = re.compile(rb"^size\s+(\d+)", re.MULTILINE)

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


def extract_recent_updates(repo: str, prof_display_map: dict) -> list:
    """Estrae gli ultimi aggiornamenti didattici reali dalla cronologia Git."""
    updates = []
    seen_keys = set()
    try:
        out = subprocess.check_output(
            ["git", "-c", "core.quotePath=false", "log", "-n", "15", "--date=format:%d/%m/%Y", "--pretty=format:COMMIT|%ad|%s", "--name-status"],
            cwd=repo,
            text=True,
            errors="replace",
        )
    except Exception:
        return updates

    cur_date = ""
    for line in out.splitlines():
        line = line.strip()
        if not line:
            continue
        if line.startswith("COMMIT|"):
            parts = line.split("|", 2)
            cur_date = parts[1] if len(parts) > 1 else ""
            continue

        cols = line.split("\t")
        if len(cols) < 2:
            continue
        status = cols[0]
        # Prefer added (A) or renamed (R) files so pure compression commits don't pollute recent additions
        if not (status.startswith("A") or status.startswith("R")):
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
        dedup_key = (course, prof_folder, cat, top_sub if top_sub else fname[:18])
        if dedup_key in seen_keys:
            continue
        seen_keys.add(dedup_key)

        prof_disp = prof_display_map.get(f"{course}/{prof_folder}", prof_folder.replace("Prof-", "Prof. "))
        updates.append({
            "date": cur_date,
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
                    date_iso, date_disp = extract_date_info(fn, subpath)
                    search_blob = f"{fn} {cname} {doc_disp} {year_group} {cat} {subpath} {date_disp}".lower()
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
                    "searchBlob": f"{fn} info generali guida mappa orario lezioni".lower(),
                })

    recent_updates = extract_recent_updates(repo, prof_display_map)
    now_str = datetime.now(timezone.utc).strftime("%d/%m/%Y")
    return {
        "stats": {
            "totalBytes": total_bytes,
            "teamsCount": teams_count,
            "generatedAt": now_str,
        },
        "recentUpdates": recent_updates,
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
    json_payload = json.dumps(catalog, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    html = template.replace("__UNINA_JSON_PAYLOAD__", json_payload)

    with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as fp:
        fp.write(html)

    with open(os.path.join(out_dir, ".nojekyll"), "w", encoding="utf-8"):
        pass

    fav_src = os.path.join(os.path.dirname(__file__), "favicon.svg")
    if os.path.exists(fav_src):
        shutil.copy2(fav_src, os.path.join(out_dir, "favicon.svg"))

    for map_name in ("MappaMSA.png", "MappaViaClaudio.jpg"):
        src = os.path.join(REPO_ROOT, "info-generali", map_name)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(assets_dir, map_name))

    print(
        f"✅ Portale Web generato in '{out_dir}': "
        f"{len(catalog['courses'])} corsi, {len(catalog['files'])} file indicizzati, "
        f"{catalog['stats']['teamsCount']} codici Teams, "
        f"{len(catalog['recentUpdates'])} aggiornamenti recenti."
    )


if __name__ == "__main__":
    main()
