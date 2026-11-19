#!/usr/bin/env python3
"""
Verifica automatica della build statica del Portale Web UNINA-INFORMATICA.
Eseguita in CI (audit-pr.yml) e localmente prima del rilascio:
- Build con build_site.py in una directory temporanea
- Assenza di placeholder non sostituiti in index.html e 404.html
- Validità JSON (catalog.*.json, calendar.*.json, manifest.webmanifest)
- Validità codici Teams (nessun falso positivo come '---')
- Bilanciamento parentesi CSS e assenza di dichiarazioni orfane a profondità 0
- Sintassi JS con `node --check` su app.*.js, theme-init.*.js, sw.js
- Integrità di recentUpdates (non vuoto, nessun percorso duplicato, max 2 card/corso)
- Schema di exam_calendar.json (totalEntries > 0, date calendariali valide, coerenza email docente)
"""

import argparse
import glob
import json
import os
import re
import shutil
import subprocess
import sys
import unicodedata
from datetime import datetime

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
BUILD_SCRIPT = os.path.join(REPO_ROOT, "info-generali", "web", "build_site.py")
TEAMS_CODE_RE = re.compile(r"^[A-Za-z0-9]{6,12}$")


def norm_key(s: str) -> str:
    nfd = unicodedata.normalize("NFD", s.strip().lower())
    return re.sub(r"\s+", " ", "".join(ch for ch in nfd if unicodedata.category(ch) != "Mn"))


def email_matches_prof(email: str, prof: str) -> bool:
    if not email or "@" not in email or not prof:
        return True
    local = re.sub(r"[^a-z]", "", norm_key(email.split("@", 1)[0]))
    if not local:
        return False
    ignore = {"prof", "di", "de", "del", "della", "dello", "da", "la", "le", "lo", "al"}
    tokens = [
        re.sub(r"[^a-z]", "", t)
        for t in norm_key(prof).split()
        if len(re.sub(r"[^a-z]", "", t)) >= 3 and re.sub(r"[^a-z]", "", t) not in ignore
    ]
    if not tokens:
        return True
    if tokens[-1] in local:
        return True
    if tokens[0] in local and len(tokens) >= 2 and any(t in local for t in tokens[1:]):
        return True
    raw_parts = [re.sub(r"[^a-z]", "", t) for t in norm_key(prof).split() if re.sub(r"[^a-z]", "", t)]
    if len(raw_parts) >= 2 and (raw_parts[-2] + raw_parts[-1]) in local:
        return True
    return False


def check_css(css_path: str, errors: list):
    css = open(css_path, encoding="utf-8").read()
    clean = re.sub(r"/\*.*?\*/", lambda m: "\n" * m.group(0).count("\n"), css, flags=re.S)
    depth = 0
    for lineno, line in enumerate(clean.splitlines(), 1):
        for ch in line:
            if ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth < 0:
                    errors.append(f"[CSS] Parentesi chiusa in eccesso in {os.path.basename(css_path)}:{lineno}")
                    depth = 0
        stripped = line.strip()
        if depth == 0 and stripped and not stripped.startswith("@") and "{" not in stripped and "}" not in stripped:
            if re.match(r"^[a-zA-Z-]+\s*:\s*[^;]+;\s*$", stripped):
                errors.append(f"[CSS] Dichiarazione orfana a profondità 0 in {os.path.basename(css_path)}:{lineno}: {stripped}")
    if depth != 0:
        errors.append(f"[CSS] Parentesi non bilanciate in {os.path.basename(css_path)} (depth finale={depth})")
    if "light-dark(" in clean:
        errors.append(f"[CSS] Uso residuo di light-dark() trovato in {os.path.basename(css_path)}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Verifica integrità build statica del Portale Web.")
    parser.add_argument("--out", default="/tmp/_site_check", help="Directory temporanea di build")
    args = parser.parse_args()

    out_dir = os.path.abspath(args.out)
    if os.path.exists(out_dir):
        shutil.rmtree(out_dir)

    errors = []

    # 1. Esegui build_site.py
    build_res = subprocess.run([sys.executable, BUILD_SCRIPT, "--out", out_dir], cwd=REPO_ROOT, capture_output=True, text=True)
    if build_res.returncode != 0:
        print(build_res.stdout)
        print(build_res.stderr, file=sys.stderr)
        return 1
    print(build_res.stdout.strip())

    # 2. Controlla index.html e 404.html (placeholder + dimensione)
    index_path = os.path.join(out_dir, "index.html")
    page404_path = os.path.join(out_dir, "404.html")
    if not os.path.exists(index_path):
        errors.append("[HTML] index.html non generato")
    else:
        html = open(index_path, encoding="utf-8").read()
        html_bytes = len(html.encode("utf-8"))
        if html_bytes >= 40960:
            errors.append(f"[HTML] Payload iniziale index.html troppo grande: {html_bytes} byte (>= 40 KB)")
        for marker in ("__UNINA_", "__STAT_", "__STYLES_", "__APP_", "__THEME_INIT_", "__CATALOG_", "__CALENDAR_"):
            if marker in html:
                errors.append(f"[HTML] Placeholder non sostituito trovato in index.html: {marker}")

    if not os.path.exists(page404_path):
        errors.append("[HTML] 404.html non generato")

    # 3. Controlla CSS e JS hashati
    css_files = glob.glob(os.path.join(out_dir, "styles.*.css"))
    app_files = glob.glob(os.path.join(out_dir, "app.*.js"))
    theme_files = glob.glob(os.path.join(out_dir, "theme-init.*.js"))
    sw_path = os.path.join(out_dir, "sw.js")
    if len(css_files) != 1:
        errors.append(f"[Assets] Atteso 1 file styles.*.css, trovati {len(css_files)}")
    else:
        check_css(css_files[0], errors)

    for js_label, js_list in (("app.*.js", app_files), ("theme-init.*.js", theme_files), ("sw.js", [sw_path] if os.path.exists(sw_path) else [])):
        if len(js_list) != 1:
            errors.append(f"[Assets] Atteso 1 file {js_label}, trovati {len(js_list)}")
            continue
        chk = subprocess.run(["node", "--check", js_list[0]], capture_output=True, text=True)
        if chk.returncode != 0:
            errors.append(f"[JS] Errore di sintassi in {os.path.basename(js_list[0])}: {chk.stderr.strip()}")

    # 4. Controlla manifest.webmanifest
    man_path = os.path.join(out_dir, "manifest.webmanifest")
    try:
        manifest = json.load(open(man_path, encoding="utf-8"))
        for icon in manifest.get("icons", []):
            if icon.get("purpose") == "any maskable":
                errors.append("[PWA] manifest.webmanifest usa purpose combinato 'any maskable'")
    except Exception as exc:
        errors.append(f"[PWA] manifest.webmanifest non valido: {exc}")

    # 5. Controlla catalog.*.json (Teams validi, recentUpdates integro, no campi ridondanti)
    cat_files = glob.glob(os.path.join(out_dir, "data", "catalog.*.json"))
    if len(cat_files) != 1:
        errors.append(f"[JSON] Atteso 1 file data/catalog.*.json, trovati {len(cat_files)}")
    else:
        try:
            cat = json.load(open(cat_files[0], encoding="utf-8"))
            if "files" in cat:
                errors.append("[JSON] Chiave ridondante 'files' presente in catalog.*.json")
            if not cat.get("filesCompact", {}).get("rows"):
                errors.append("[JSON] filesCompact.rows vuoto in catalog.*.json")

            valid_teams = 0
            for c in cat.get("courses", []):
                if "searchBlob" in c:
                    errors.append(f"[JSON] searchBlob ridondante nel corso '{c.get('name')}'")
                for p in c.get("profs", []):
                    tc = p.get("teamsCode", "")
                    tu = p.get("teamsUrl", "")
                    if tc:
                        if not TEAMS_CODE_RE.fullmatch(tc):
                            errors.append(f"[Teams] Codice Teams invalido in catalog.json: '{c.get('name')}/{p.get('folder')}' -> {tc!r}")
                        else:
                            valid_teams += 1
                    elif tu:
                        if not tu.startswith("https://"):
                            errors.append(f"[Teams] URL Teams non HTTPS in catalog.json: {tu!r}")
                        else:
                            valid_teams += 1
            if valid_teams != cat.get("stats", {}).get("teamsCount"):
                errors.append(f"[Teams] teamsCount incoerente: stats={cat.get('stats', {}).get('teamsCount')} vs validi={valid_teams}")

            updates = cat.get("recentUpdates", [])
            if not updates:
                errors.append("[RecentUpdates] Lista recentUpdates vuota")
            seen_u = set()
            course_u = {}
            for u in updates:
                k = (u.get("course"), u.get("prof"), u.get("cat"), u.get("subpath"))
                if k in seen_u:
                    errors.append(f"[RecentUpdates] Duplicato rilevato: {k}")
                seen_u.add(k)
                course_u[u.get("course")] = course_u.get(u.get("course"), 0) + 1
            for cname, cnt in course_u.items():
                if cnt > 2:
                    errors.append(f"[RecentUpdates] Corso '{cname}' monopolizza il feed ({cnt} card > max 2)")
        except Exception as exc:
            errors.append(f"[JSON] Errore lettura catalog.*.json: {exc}")

    # 6. Controlla schema calendar.*.json
    cal_files = glob.glob(os.path.join(out_dir, "data", "calendar.*.json"))
    if len(cal_files) != 1:
        errors.append(f"[JSON] Atteso 1 file data/calendar.*.json, trovati {len(cal_files)}")
    else:
        try:
            cal = json.load(open(cal_files[0], encoding="utf-8"))
            if int(cal.get("totalEntries", 0)) <= 0 or int(cal.get("totalDates", 0)) <= 0:
                errors.append(f"[Calendar] Conteggi non validi: entries={cal.get('totalEntries')}, dates={cal.get('totalDates')}")
            for e in cal.get("entries", []):
                # Verifica date calendariali valide
                for d in e.get("dates", []):
                    try:
                        datetime(int(d["year"]), int(d["month"]), int(d["day"]))
                    except Exception:
                        errors.append(f"[Calendar] Data invalida in {e.get('id')}: {d}")
                # Verifica coerenza email <-> docente (nessun mismatch non segnalato)
                prof = (e.get("prof") or "").strip()
                email = (e.get("email") or "").strip()
                note = (e.get("note") or "").lower()
                if prof and email and "verificare email" not in note:
                    p_parts = [p.strip() for p in prof.split("/") if p.strip()]
                    e_parts = [em.strip() for em in email.split("/") if "@" in em]
                    for idx_e, em in enumerate(e_parts):
                        p_ref = p_parts[idx_e] if idx_e < len(p_parts) else prof
                        if not email_matches_prof(em, p_ref):
                            errors.append(f"[Calendar] Email incoerente non segnalata in {e.get('id')} ({e.get('course')}): prof={p_ref!r}, email={em!r}")
        except Exception as exc:
            errors.append(f"[JSON] Errore lettura calendar.*.json: {exc}")

    if errors:
        print(f"\n❌ VERIFICA PORTALE FALLITA con {len(errors)} errori:")
        for err in errors:
            print(f"  - {err}")
        return 1

    print("✅ VERIFICA BUILD PORTALE SUPERATA AL 100%: HTML, CSS, JS, PWA, Teams, RecentUpdates e Calendario conformi!")
    return 0


if __name__ == "__main__":
    sys.exit(main())
