#!/usr/bin/env python3
"""
Suite di Audit e Validazione Automatica per UNINA-INFORMATICA.
Eseguita localmente e su GitHub Actions ad ogni Pull Request / Push.

Controlli effettuati:
1. Alberatura standard dei 31 corsi (README.md di corso presente, sole sottocartelle Prof-*).
2. Standard naming ASCII CamelCase per tutte le cartelle docente (^Prof-[A-Z][A-Za-z0-9]+$).
3. Presenza esatta delle 8 sottocartelle obbligatorie per ogni docente (inclusi esami/scritto ed esami/orale)
   e assenza di cartelle extra fuori standard.
4. Presenza obbligatoria di crediti.txt in ogni cartella contenuto-non-proprio/ che contiene file.
5. Validazione integrale di tutti i link relativi nei file Markdown (.md) della repository.
6. Assenza di eseguibili compilati (ELF Linux, PE Windows .exe/.dll, Java .class/.jar) fuori dagli archivi.
7. Coerenza Git LFS: verifica che nessun file con estensione pesante sfugga alle regole di .gitattributes.
"""

import os
import re
import sys
import subprocess
from urllib.parse import unquote

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

MANDATORY_SUBDIRS = [
    "slides",
    "appunti",
    "esercizi",
    "progetti",
    os.path.join("esami", "scritto"),
    os.path.join("esami", "orale"),
    "libri",
    "contenuto-non-proprio",
]

ALLOWED_PROF_TOP = {
    "slides",
    "appunti",
    "esercizi",
    "progetti",
    "esami",
    "libri",
    "contenuto-non-proprio",
    "README.md",
}

PROF_NAME_RE = re.compile(r"^Prof-[A-Z][A-Za-z0-9]+$")
MD_LINK_RE = re.compile(r"!?\[([^\]]*)\]\(([^)]+)\)")

BINARY_LFS_EXTS = {
    ".pdf", ".pptx", ".ppt", ".docx", ".doc", ".xlsx", ".xls",
    ".odt", ".odp", ".ods", ".epub",
    ".jpg", ".jpeg", ".png", ".webp", ".gif",
    ".zip", ".rar", ".7z",
}

FORBIDDEN_EXTS = {".class", ".jar", ".exe", ".dll", ".so", ".dylib", ".o"}


def discover_courses(repo: str):
    courses = []
    for year in ("Primo Anno", "Secondo Anno", "Terzo Anno"):
        yp = os.path.join(repo, year)
        if not os.path.isdir(yp):
            continue
        for sem in sorted(os.listdir(yp)):
            sp = os.path.join(yp, sem)
            if not os.path.isdir(sp):
                continue
            for cname in sorted(os.listdir(sp)):
                cp = os.path.join(sp, cname)
                if os.path.isdir(cp):
                    courses.append(cp)
    esp = os.path.join(repo, "Esami a Scelta")
    if os.path.isdir(esp):
        for cname in sorted(os.listdir(esp)):
            cp = os.path.join(esp, cname)
            if os.path.isdir(cp):
                courses.append(cp)
    return courses


def main() -> int:
    errors = []
    warnings = []

    courses = discover_courses(REPO_ROOT)
    prof_count = 0

    # 1-4. Controllo struttura corsi e docenti
    for cp in courses:
        rel_c = os.path.relpath(cp, REPO_ROOT)
        if "’" in rel_c or "‘" in rel_c:
            errors.append(f"[Encoding] Apostrofo curvo non consentito nel percorso corso: {rel_c}")

        entries = sorted(os.listdir(cp))
        if "README.md" not in entries:
            errors.append(f"[Corso] README.md mancante in: {rel_c}")

        for e in entries:
            ep = os.path.join(cp, e)
            if os.path.isdir(ep):
                prof_count += 1
                rel_p = os.path.relpath(ep, REPO_ROOT)
                if not PROF_NAME_RE.match(e):
                    errors.append(
                        f"[Naming Docente] '{rel_p}' non rispetta lo standard CamelCase ASCII puro 'Prof-NomeCognome' (senza spazi, punti o accenti)."
                    )
                p_items = set(os.listdir(ep))
                if "README.md" not in p_items:
                    errors.append(f"[Docente] README.md mancante in: {rel_p}")
                extra = p_items - ALLOWED_PROF_TOP
                if extra:
                    errors.append(f"[Struttura] Elementi fuori standard in '{rel_p}': {sorted(extra)}")

                esami_p = os.path.join(ep, "esami")
                if os.path.isdir(esami_p):
                    es_extra = set(os.listdir(esami_p)) - {"scritto", "orale"}
                    if es_extra:
                        errors.append(f"[Cartella Esami] Sottocartelle fuori standard in '{rel_p}/esami': {sorted(es_extra)}")

                for msub in MANDATORY_SUBDIRS:
                    sp = os.path.join(ep, msub)
                    if not os.path.isdir(sp):
                        errors.append(f"[Sottocartella Mancante] '{msub}' assente in '{rel_p}'")

                # Regola d'oro crediti.txt in contenuto-non-proprio
                cnp = os.path.join(ep, "contenuto-non-proprio")
                if os.path.isdir(cnp):
                    cnp_files = []
                    for r2, _, f2 in os.walk(cnp):
                        for fn in f2:
                            if fn != ".gitkeep":
                                cnp_files.append(fn)
                    if cnp_files and not any("credit" in fn.lower() for fn in cnp_files):
                        errors.append(
                            f"[Crediti Mancanti] '{rel_p}/contenuto-non-proprio' contiene {len(cnp_files)} file ma nessun 'crediti.txt'."
                        )
            elif e != "README.md":
                errors.append(f"[Corso] File imprevisto nella radice del corso '{rel_c}': {e}")

    # 5-7. Controllo file tracciati da Git (link Markdown, eseguibili ELF, filtro Git LFS)
    git_files = subprocess.check_output(
        ["git", "-c", "core.quotePath=false", "ls-files"], cwd=REPO_ROOT, text=True
    ).splitlines()

    md_checked = 0
    links_checked = 0

    for gf in git_files:
        full_p = os.path.join(REPO_ROOT, gf)
        if not os.path.exists(full_p):
            continue
        ext = os.path.splitext(gf)[1].lower()

        # Check forbidden compiled extensions
        if ext in FORBIDDEN_EXTS:
            errors.append(f"[Binario Vietato] File compilato o libreria non ammessa in Git: {gf}")

        # Check ELF magic bytes on extensionless files
        if ext == "" and os.path.basename(gf) not in ("LICENSE", "Makefile") and not gf.endswith(".gitkeep"):
            try:
                with open(full_p, "rb") as fp:
                    magic = fp.read(4)
                if magic == b"\x7fELF" or magic[:2] == b"MZ":
                    errors.append(f"[Eseguibile Compilato] Binario eseguibile ELF/PE tracciato in Git: {gf}")
            except OSError:
                pass

        # Check Markdown relative links
        if ext == ".md":
            md_checked += 1
            base_dir = os.path.dirname(full_p)
            text = open(full_p, encoding="utf-8", errors="replace").read()
            clean_text = re.sub(r"```.*?```", "", text, flags=re.DOTALL)
            for m in MD_LINK_RE.finditer(clean_text):
                target = m.group(2).strip()
                if target.startswith(("http://", "https://", "mailto:", "#")):
                    continue
                if ' "' in target:
                    target = target.split(' "', 1)[0].strip()
                path_part = target.split("#", 1)[0]
                if not path_part:
                    continue
                links_checked += 1
                resolved = os.path.normpath(os.path.join(base_dir, unquote(path_part)))
                if not os.path.exists(resolved):
                    errors.append(f"[Link Rotto] In '{gf}' -> '{target}' (non trovato su disco)")

    # Verifica attributi LFS e puntatori reali nell'indice Git per tutti i file binari
    binary_candidates = [
        gf for gf in git_files
        if os.path.splitext(gf)[1].lower() in BINARY_LFS_EXTS or gf.lower().endswith(".tar.gz")
    ]
    if binary_candidates:
        proc = subprocess.run(
            ["git", "-c", "core.quotePath=false", "check-attr", "-z", "--stdin", "filter"],
            input="\0".join(binary_candidates) + "\0",
            cwd=REPO_ROOT,
            text=True,
            capture_output=True,
            check=True,
        )
        tokens = proc.stdout.split("\0")
        # Con -z l'output e' una sequenza di triple: <path>\0<attr>\0<value>\0
        for idx in range(0, len(tokens) - 2, 3):
            bpath, _, bval = tokens[idx], tokens[idx + 1], tokens[idx + 2]
            if bval != "lfs":
                errors.append(f"[Git LFS] File binario non coperto da filtro LFS in .gitattributes: {bpath} (filter={bval})")

        # Verifica che il blob nell'indice Git (:path) sia realmente un puntatore Git LFS (o file vuoto 0 byte)
        cat_input = "\n".join(f":{gf}" for gf in binary_candidates) + "\n"
        cat_proc = subprocess.run(
            ["git", "cat-file", "--batch-check=%(objectname) %(objectsize)"],
            input=cat_input,
            cwd=REPO_ROOT,
            text=True,
            capture_output=True,
            check=True,
        )
        for gf, meta_line in zip(binary_candidates, cat_proc.stdout.splitlines()):
            parts = meta_line.split()
            if len(parts) == 2 and parts[1].isdigit():
                blob_size = int(parts[1])
                # Un puntatore Git LFS standard pesa ~125-140 byte (0 byte se file vuoto).
                # Se supera 512 byte nell'indice Git, il file binario e' stato committato fuori da Git LFS!
                if blob_size > 512:
                    errors.append(
                        f"[Git LFS Bypass] '{gf}' e' committato come binario diretto in Git ({blob_size} byte nell'indice) invece che come puntatore LFS!"
                    )

    print("=== REPORT AUDIT UNINA-INFORMATICA ===")
    print(f"Corsi verificati       : {len(courses)}")
    print(f"Canali docenti (Prof-*): {prof_count}")
    print(f"File tracciati da Git  : {len(git_files)}")
    print(f"File Markdown / Link   : {md_checked} file / {links_checked} link relativi validati")
    print(f"File binari sotto LFS  : {len(binary_candidates)}")

    if warnings:
        print(f"\nAvvisi ({len(warnings)}):")
        for w in warnings:
            print(f"  ⚠️  {w}")

    if errors:
        print(f"\n❌ AUDIT FALLITO con {len(errors)} errori:")
        for err in errors:
            print(f"  - {err}")
        return 1

    print("\n✅ AUDIT SUPERATO AL 100%: Struttura, naming, crediti, link e regole LFS conformi!")
    return 0


if __name__ == "__main__":
    sys.exit(main())
