#!/usr/bin/env python3
"""
Sincronizza e analizza il calendario ufficiale degli esami della Laurea Triennale
(inclusi gli Insegnamenti a Scelta Libera) dal sito DIETI Federico II.

Estrae i link ai PDF dalla pagina ufficiale DIETI:
  https://informatica.dieti.unina.it/index.php/it/servizi-per-gli-studenti/calendario-esami/calendario-esami-laurea-triennale
Converte ogni tabella con `pdftotext -bbox` e `pdfinfo` e salva `exam_calendar.json`
in modo deterministico (il file su disco cambia solo se cambiano date, docenti o PDF).
"""

import argparse
import hashlib
import json
import os
import re
import ssl
import subprocess
import sys
import tempfile
import unicodedata
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime
from urllib.parse import urljoin

DIETI_BASE_URL = "https://informatica.dieti.unina.it"
DIETI_PAGE_URL = (
    "https://informatica.dieti.unina.it/index.php/it/servizi-per-gli-studenti/"
    "calendario-esami/calendario-esami-laurea-triennale"
)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_OUT_JSON = os.path.join(SCRIPT_DIR, "exam_calendar.json")

MONTH_ABBR = {
    "gen": 1,
    "feb": 2,
    "mar": 3,
    "apr": 4,
    "mag": 5,
    "giu": 6,
    "lug": 7,
    "ago": 8,
    "set": 9,
    "ott": 10,
    "nov": 11,
    "dic": 12,
}

MONTH_NAMES_IT = {
    1: "Gennaio",
    2: "Febbraio",
    3: "Marzo",
    4: "Aprile",
    5: "Maggio",
    6: "Giugno",
    7: "Luglio",
    8: "Agosto",
    9: "Settembre",
    10: "Ottobre",
    11: "Novembre",
    12: "Dicembre",
}

MONTH_SHORT_IT = {
    1: "Gen",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "Mag",
    6: "Giu",
    7: "Lug",
    8: "Ago",
    9: "Set",
    10: "Ott",
    11: "Nov",
    12: "Dic",
}

# Mappatura da nomi normalizzati presenti nei PDF DIETI -> (repoCourse, extraAliases)
REPO_COURSE_MAP = {
    "architettura degli elaboratori": ("Architettura degli Elaboratori", "ade architettura elaboratori"),
    "architettura degli elaboratori i": ("Architettura degli Elaboratori", "ade ade1 architettura elaboratori"),
    "analisi matematica i": ("Analisi Matematica 1", "analisi 1 am1 analisi1"),
    "programmazione": ("Programmazione 1", "prog 1 prog1 pr1 programmazione"),
    "laboratorio di programmazione": ("Programmazione 1", "lab prog laboratorio programmazione lp"),
    "algebra": ("Algebra", "alg"),
    "programmazione object-oriented": ("Programmazione Object Oriented", "poo oop oggetti"),
    "object orientation": ("Programmazione Object Oriented", "poo oop oggetti object orientation"),
    "basi di dati": ("Basi di Dati", "bd db sql"),
    "elementi di informatica teorica": ("Elementi di Informatica Teorica", "it eoit teorica automi"),
    "fisica generale i": ("Fisica Generale 1", "fisica 1 fisica1 fg1"),
    "geometria": ("Geometria", "geom"),
    "analisi e progettazione di strutture dati": ("Analisi e Progettazione di Strutture Dati", "apsd asd lasd strutture dati"),
    "laboratorio di algoritmi e strutture dati": ("Analisi e Progettazione di Strutture Dati", "lasd asd apsd laboratorio algoritmi"),
    "algoritmi i": ("Analisi e Progettazione di Strutture Dati", "algoritmi 1 asd apsd"),
    "sistemi operativi": ("Sistemi Operativi", "so os kernel"),
    "laboratorio di sistemi operativi": ("Sistemi Operativi", "lso lab so sistemi operativi"),
    "linguaggi di programmazione": ("Linguaggi di Programmazione 1", "lp1 lmp lmc linguaggi prolog lisp"),
    "linguaggi di programmazione ii": ("Linguaggi di Programmazione 1", "lp2 linguaggi"),
    "metodi statistici per l'informazione": ("Metodi Statistici per l'Informazione", "msi eps statistica probabilita"),
    "analisi e progettazione di algoritmi": ("Analisi e Progettazione di Algoritmi", "apa algoritmi algo"),
    "tecnologie web": ("Tecnologie Web", "tecweb tw web"),
    "tecnologie web (2025-2026)": ("Tecnologie Web", "tecweb tw web"),
    "ingegneria del software": ("Ingegneria del Software", "ingsw is"),
    "ingegneria del software (mod. a+b)": ("Ingegneria del Software", "ingsw is mod ab"),
    "reti e programmazione distribuita": ("Reti e Programmazione Distribuita", "rpd reti"),
    "reti di calcolatori": ("Reti e Programmazione Distribuita", "rc reti calcolatori rpd"),
    "tecniche di programmazione avanzata": ("Tecniche di Programmazione Avanzata", "tpa"),
    "ai technologies": ("AI Technologies", "ait ai intelligenza artificiale"),
    "istituzioni di matematica ii": ("Istituzioni di Matematica II", "im2 istituzioni matematica 2"),
    "parallel and distributed computing": ("Parallel and Distributed Computing", "pdc"),
    "scientific computing": ("Scientific Computing", "sc"),
    "calcolo numerico": ("Calcolo Numerico", "cn"),
    "operation research": ("Ricerca Operativa", "ro ero ricerca operativa operation research"),
    "ricerca operativa": ("Ricerca Operativa", "ro ero ricerca operativa"),
    "operating systems for mobile, cloud and iot": ("Operating Systems for Mobile, Cloud and IoT", "osmci iot"),
    "algorithm design": ("Algorithm Design", "ad"),
    "logics for computer science": ("Logics for Computer Science", "lcs logica"),
    "computer forensics": ("Computer Forensics", "cf forensics"),
    "diritto dell'informatica": ("Diritto dell'Informatica", "diritto"),
    "economia ed organizzazione aziendale": ("Economia e Organizzazione Aziendale", "eoa economia"),
    "economia e organizzazione aziendale": ("Economia e Organizzazione Aziendale", "eoa economia"),
    "multimedia information systems": ("Multimedia Information Systems", "mis multimedia"),
}

EMAIL_PROF_OVERRIDES = {
    "marco.lapegna@unina.it": "Marco Lapegna",
    "salvatore.cuomo@unina.it": "Salvatore Cuomo",
    "paola.festa@unina.it": "Paola Festa",
    "silvio.barra@unina.it": "Silvio Barra",
    "fabio.mogavero@unina.it": "Fabio Mogavero",
    "massimo.benerecetti@unina.it": "Massimo Benerecetti",
    "marco.alfe@unina.it": "Marco Alfè",
    "walter.balzano@unina.it": "Walter Balzano",
    "luigiliberolucio.starace@unina.it": "Luigi Libero Lucio Starace",
    "sergio.dimartino@unina.it": "Sergio Di Martino",
    "porfirio.tramontana@unina.it": "Porfirio Tramontana",
    "bernardo.breve@unina.it": "Bernardo Breve",
    "alberto.finzi@unina.it": "Alberto Finzi",
    "andrea.cali@unina.it": "Andrea Calì",
}

WEEK_RE = re.compile(r"(\d{1,2})\s*(?:([a-z]{3})\.?)?\s*-\s*(\d{1,2})\s*([a-z]{3})\.?", re.I)
EMAIL_RE = re.compile(r"[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}", re.I)


def norm_key(s: str) -> str:
    nfd = unicodedata.normalize("NFD", s.strip().lower())
    cleaned = "".join(ch for ch in nfd if unicodedata.category(ch) != "Mn")
    return re.sub(r"\s+", " ", cleaned)


def http_get_bytes(url: str, timeout: int = 25) -> bytes:
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
        ),
        "Accept": "text/html,application/pdf,*/*;q=0.8",
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.read()
    except urllib.error.URLError:
        # Fallback con contesto SSL standard + curl se il resolver di sistema ha particolarità TLS
        try:
            ctx = ssl.create_default_context()
            with urllib.request.urlopen(req, timeout=timeout, context=ctx) as resp:
                return resp.read()
        except Exception:
            return subprocess.check_output(
                ["curl", "-fsSL", "-A", headers["User-Agent"], url],
                timeout=timeout,
            )


def discover_triennale_pdfs(page_url: str) -> list:
    html_text = http_get_bytes(page_url).decode("utf-8", errors="replace")
    # Limita la ricerca all'area contenuti principali se presente, altrimenti usa tutta la pagina
    links = re.findall(r'<a\b[^>]*href=["\']([^"\']+\.pdf[^"\']*)["\'][^>]*>(.*?)</a>', html_text, re.I | re.S)
    results = []
    seen = set()
    for href, inner in links:
        if "calendario-esami" not in href.lower() and "triennale" not in href.lower():
            continue
        if "magistrale" in href.lower():
            continue
        abs_url = urljoin(DIETI_BASE_URL, href.strip())
        if abs_url in seen:
            continue
        seen.add(abs_url)
        label = re.sub(r"<[^>]+>", "", inner)
        label = re.sub(r"\s+", " ", label).strip()
        results.append({"url": abs_url, "title": label})
    return results


def parse_pdf_info(pdf_path: str) -> dict:
    out = subprocess.check_output(["pdfinfo", pdf_path], text=True, errors="replace")
    meta = {}
    for line in out.splitlines():
        if ":" not in line:
            continue
        k, v = line.split(":", 1)
        meta[k.strip()] = v.strip()
    mod_raw = meta.get("ModDate") or meta.get("CreationDate") or ""
    mod_display = ""
    # Formato tipico pdfinfo: "Mon Nov 16 12:06:22 2026 CET"
    en_months = {
        "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6,
        "jul": 7, "aug": 8, "sep": 9, "oct": 10, "nov": 11, "dec": 12,
    }
    m = re.search(r"[A-Za-z]{3}\s+([A-Za-z]{3})\s+(\d{1,2})\s+\d{2}:\d{2}:\d{2}\s+(\d{4})", mod_raw)
    if m:
        mo = en_months.get(m.group(1).lower(), 0)
        day = int(m.group(2))
        yr = int(m.group(3))
        if mo:
            mod_display = f"{day:02d}/{mo:02d}/{yr}"
    return {
        "title": meta.get("Title", ""),
        "author": meta.get("Author", ""),
        "modDisplay": mod_display,
        "pages": int(meta.get("Pages", "0") or 0),
    }


def infer_academic_years(pdf_url: str, session_title: str, mod_display: str) -> tuple[int, int]:
    """Restituisce (start_year, end_year) es. (2026, 2027) per associare mesi 9..12 e 1..8."""
    combined = f"{pdf_url} {session_title}"
    m = re.search(r"(20\d{2})\s*[-/]\s*(\d{2,4})", combined)
    if m:
        y1 = int(m.group(1))
        y2_s = m.group(2)
        y2 = int(y2_s if len(y2_s) == 4 else str(y1)[:2] + y2_s)
        return y1, y2
    m2 = re.search(r"-(\d{2})-(\d{2})\.pdf", combined)
    if m2:
        y1 = 2000 + int(m2.group(1))
        y2 = 2000 + int(m2.group(2))
        return y1, y2
    # Fallback dalla data di modifica
    if mod_display:
        yr = int(mod_display.split("/")[-1])
        mo = int(mod_display.split("/")[1])
        return (yr, yr + 1) if mo >= 8 else (yr - 1, yr)
    now = datetime.now()
    return (now.year, now.year + 1) if now.month >= 8 else (now.year - 1, now.year)


def extract_week_columns(words_in_row: list) -> list:
    """Ricostruisce le colonne settimanali (d1, m1, d2, m2, xMin, xMax, xCenter) tramite interpolazione caratteri."""
    joined = ""
    char_boxes = []
    for w in words_in_row:
        if w["xMin"] < 165:
            continue
        t = w["text"]
        if joined:
            joined += " "
            char_boxes.append((w["xMin"], w["xMin"]))
        n = max(1, len(t))
        dx = (w["xMax"] - w["xMin"]) / n
        for i, ch in enumerate(t):
            joined += ch
            char_boxes.append((w["xMin"] + i * dx, w["xMin"] + (i + 1) * dx))

    cols = []
    for m in WEEK_RE.finditer(joined):
        s_idx, e_idx = m.start(), m.end() - 1
        xmin = char_boxes[s_idx][0]
        xmax = char_boxes[e_idx][1]
        d1 = int(m.group(1))
        m1_str = (m.group(2) or m.group(4)).lower()
        d2 = int(m.group(3))
        m2_str = m.group(4).lower()
        m1 = MONTH_ABBR.get(m1_str, 0)
        m2 = MONTH_ABBR.get(m2_str, 0)
        if not (m1 and m2):
            continue
        cols.append({
            "xMin": xmin,
            "xMax": xmax,
            "xCenter": (xmin + xmax) / 2.0,
            "d1": d1,
            "m1": m1,
            "d2": d2,
            "m2": m2,
            "label": m.group(0),
        })
    return cols


def match_day_to_week(day: int, x_center: float, cols: list) -> dict | None:
    """Associa un numero di giorno alla colonna settimanale tramite distanza xCenter + controllo intervallo giorni."""
    def valid_days(c: dict, pad: int = 0) -> list[tuple[int, int]]:
        d1, m1, d2, m2 = c["d1"], c["m1"], c["d2"], c["m2"]
        if m1 == m2:
            lo = max(1, d1 - pad)
            hi = min(31, d2 + pad)
            return [(d, m1) for d in range(lo, hi + 1)]
        # Settimana a cavallo di due mesi (es. 30 nov.-4 dic.)
        out = [(d, m1) for d in range(max(1, d1 - pad), 32)]
        out += [(d, m2) for d in range(1, min(31, d2 + pad) + 1)]
        return out

    # Pass 1: match esatto nell'intervallo della settimana entro 18pt
    best = None
    best_dist = 1e9
    for c in cols:
        dist = abs(x_center - c["xCenter"])
        if dist > 18.0:
            continue
        for cand_d, cand_m in valid_days(c, pad=0):
            if cand_d == day and dist < best_dist:
                best_dist = dist
                best = {"col": c, "day": day, "month": cand_m}
    if best:
        return best

    # Pass 2: tolleranza +/- 3 giorni entro 15pt (gestisce refusi minori nel PDF, es. 21 sotto 22-26 feb.)
    for c in cols:
        dist = abs(x_center - c["xCenter"])
        if dist > 15.0:
            continue
        for cand_d, cand_m in valid_days(c, pad=3):
            if cand_d == day and dist < best_dist:
                best_dist = dist
                best = {"col": c, "day": day, "month": cand_m}
    return best


def prof_from_email(email: str) -> str:
    if not email:
        return ""
    e_low = email.strip().lower()
    if e_low in EMAIL_PROF_OVERRIDES:
        return EMAIL_PROF_OVERRIDES[e_low]
    local = e_low.split("@", 1)[0]
    parts = [p for p in re.split(r"[._-]+", local) if p]
    return " ".join(p.capitalize() for p in parts)


def split_course_and_semester_header(left_words: list) -> str:
    txt = " ".join(w["text"] for w in left_words)
    if "II semestre" in txt or "II SEMESTRE" in txt:
        if "I e II" in txt:
            return "1° / 2°"
        return "2°"
    if "I semestre" in txt or "I SEMESTRE" in txt:
        return "1°"
    return "1°"


def clean_row_spacing(words: list) -> str:
    return re.sub(r"\s+", " ", " ".join(w["text"] for w in words)).strip()


def should_ignore_footer_row(row_text: str) -> bool:
    low = row_text.lower().strip()
    return (
        low.startswith("limite esami")
        or low.startswith("dicembre 202")
        or low.startswith("* l'insegnamento")
        or low.startswith("calendario esami")
        or low == ""
    )


def detect_year_group(text: str) -> str:
    """Ricava l'anno accademico dalle intestazioni testuali del PDF invece che dall'indice di pagina."""
    low = norm_key(text)
    if "insegnamenti a scelta" in low or "scelta libera" in low:
        return "Esami a Scelta"
    if re.search(r"\biii\s+anno\b|\b3[°o]?\s+anno\b", low):
        return "Terzo Anno"
    if re.search(r"\bii\s+anno\b|\b2[°o]?\s+anno\b", low):
        return "Secondo Anno"
    if re.search(r"\bi\s+anno\b|\b1[°o]?\s+anno\b", low):
        return "Primo Anno"
    return ""


def email_matches_prof(email: str, prof: str) -> bool:
    """Verifica che la parte locale dell'email contenga almeno il cognome normalizzato del docente."""
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
    # Verifica cognome (ultimo token) oppure nome+cognome per casi tipo "Starace Luigi Libero Lucio"
    if tokens[-1] in local:
        return True
    if tokens[0] in local and len(tokens) >= 2 and any(t in local for t in tokens[1:]):
        return True
    # Cognomi composti (es. "de rosa" -> "derosa", "di martino" -> "dimartino")
    raw_parts = [re.sub(r"[^a-z]", "", t) for t in norm_key(prof).split() if re.sub(r"[^a-z]", "", t)]
    if len(raw_parts) >= 2 and (raw_parts[-2] + raw_parts[-1]) in local:
        return True
    return False


def parse_pdf_calendar(pdf_path: str, academic_years: tuple[int, int]) -> list:
    xml_out = subprocess.check_output(["pdftotext", "-bbox", pdf_path, "-"], text=True, errors="replace")
    root = ET.fromstring(xml_out)
    ns = {"x": "http://www.w3.org/1999/xhtml"}
    pages = root.findall(".//x:page", ns)
    y_start, y_end = academic_years

    year_by_page_fallback = {
        1: "Primo Anno",
        2: "Secondo Anno",
        3: "Terzo Anno",
        4: "Esami a Scelta",
    }

    all_entries = []
    last_detected_year = ""

    for p_idx, page in enumerate(pages, 1):
        words = []
        for w in page.findall(".//x:word", ns):
            txt = (w.text or "").strip()
            if not txt:
                continue
            words.append({
                "xMin": float(w.attrib["xMin"]),
                "xMax": float(w.attrib["xMax"]),
                "yMin": float(w.attrib["yMin"]),
                "yMax": float(w.attrib["yMax"]),
                "xCenter": (float(w.attrib["xMin"]) + float(w.attrib["xMax"])) / 2.0,
                "text": txt,
            })

        words.sort(key=lambda w: (w["yMin"], w["xMin"]))
        rows = []
        for w in words:
            if not rows or abs(w["yMin"] - rows[-1][0]["yMin"]) > 2.3:
                rows.append([w])
            else:
                rows[-1].append(w)

        # Rileva l'anno della pagina direttamente dalle intestazioni testuali (fallback su indice pagina solo se assenti)
        page_year = ""
        for r_probe in rows[:12]:
            r_probe_sorted = sorted(r_probe, key=lambda w: w["xMin"])
            yg_cand = detect_year_group(clean_row_spacing(r_probe_sorted))
            if yg_cand:
                page_year = yg_cand
                break
        year_group = page_year or last_detected_year or year_by_page_fallback.get(p_idx, "Esami a Scelta")
        last_detected_year = year_group

        regolamento = "Esami a Scelta" if year_group == "Esami a Scelta" else "Nuovo Regolamento"
        cur_sem = "1°"
        cur_cols = []
        x_doc = 61.0
        x_mail = 104.0
        x_sem = None
        x_can = 147.0
        x_week0 = 171.0

        page_rows = []
        orphan_note_prefixes = []

        for r in rows:
            r.sort(key=lambda w: w["xMin"])
            full_text = clean_row_spacing(r)
            low_text = full_text.lower()
            row_ymin = min(w["yMin"] for w in r)
            row_ymax = max(w["yMax"] for w in r)

            if should_ignore_footer_row(full_text):
                continue

            if low_text == "nuovo regolamento":
                regolamento = "Nuovo Regolamento"
                continue
            if low_text == "vecchio regolamento":
                regolamento = "Vecchio Regolamento"
                cur_sem = "1° / 2°"
                continue
            if low_text == "insegnamenti a scelta libera":
                year_group = "Esami a Scelta"
                last_detected_year = year_group
                regolamento = "Esami a Scelta"
                continue

            # Salta righe introduttive tipo solo "Insegnamento"
            if low_text == "insegnamento":
                continue

            # Rileva intestazione tabella (contiene >= 3 colonne settimanali o Docente + Mail)
            cols_cand = extract_week_columns(r)
            if len(cols_cand) >= 3 or ("docente" in low_text and ("mail" in low_text or "canale" in low_text)):
                if cols_cand:
                    cur_cols = cols_cand
                    x_week0 = cur_cols[0]["xMin"] - 3.0
                left_words = [w for w in r if w["xMin"] < x_doc]
                left_txt = clean_row_spacing(left_words)
                yg_hdr = detect_year_group(left_txt)
                if yg_hdr:
                    year_group = yg_hdr
                    last_detected_year = yg_hdr
                    if yg_hdr == "Esami a Scelta":
                        regolamento = "Esami a Scelta"
                if any(w["text"].lower() == "semestre" for w in left_words):
                    cur_sem = split_course_and_semester_header(left_words)

                # Aggiorna tagli colonne metadati solo se la riga header contiene esplicitamente le etichette nella zona destra
                for w in r:
                    if w["xMin"] >= x_week0:
                        continue
                    wl = w["text"].lower()
                    if wl == "docente":
                        x_doc = w["xMin"] - 3.5
                    elif wl in ("mail", "e-mail", "email"):
                        x_mail = w["xMin"] - 3.5
                    elif wl in ("sem.", "semestre") and w["xMin"] > max(x_mail, 120.0):
                        x_sem = w["xMin"] - 2.5
                    elif wl.startswith("canale"):
                        x_can = w["xMin"] - 3.5
                continue

            if not cur_cols:
                continue

            # Separa le parole per colonna geometrica
            course_w, doc_w, mail_w, sem_w, can_w, grid_w = [], [], [], [], [], []
            for w in r:
                x = w["xMin"]
                if x < x_doc:
                    course_w.append(w)
                elif x < x_mail:
                    doc_w.append(w)
                elif x_sem is not None and x < x_sem:
                    mail_w.append(w)
                elif x_sem is not None and x < x_can:
                    sem_w.append(w)
                elif x_sem is None and x < x_can:
                    mail_w.append(w)
                elif x < x_week0:
                    can_w.append(w)
                else:
                    grid_w.append(w)

            course_str = clean_row_spacing(course_w)
            doc_str = clean_row_spacing(doc_w)
            mail_str = clean_row_spacing(mail_w)
            sem_cell = clean_row_spacing(sem_w)
            can_str = clean_row_spacing(can_w)

            # Fix caso specifico Page 4: "carlomaria.mantegazza@unina.itFG" -> sposta "FG" nel canale
            if mail_str.endswith("FG") or mail_str.endswith("fg"):
                can_str = f"FG {can_str}".strip()
                mail_str = mail_str[:-2].strip()

            # Normalizza "FG 1" -> "FG1", "FG A-Z" -> "FG A-Z"
            can_str = re.sub(r"^FG\s+([1-3])\b", r"FG\1", can_str)

            row_sem = cur_sem
            if sem_cell in ("I", "1", "1°"):
                row_sem = "1°"
            elif sem_cell in ("II", "2", "2°"):
                row_sem = "2°"

            dates = []
            note_words = []
            for w in grid_w:
                if re.fullmatch(r"\d{1,2}", w["text"]):
                    day = int(w["text"])
                    if 1 <= day <= 31:
                        matched = match_day_to_week(day, w["xCenter"], cur_cols)
                        if matched:
                            mo = matched["month"]
                            yr = y_start if mo >= 9 else y_end
                            try:
                                dt_obj = datetime(yr, mo, day)
                            except ValueError:
                                continue
                            date_item = {
                                "iso": f"{yr:04d}-{mo:02d}-{day:02d}",
                                "display": f"{day:02d}/{mo:02d}/{yr:04d}",
                                "day": day,
                                "month": mo,
                                "year": yr,
                                "monthKey": f"{yr:04d}-{mo:02d}",
                                "weekLabel": matched["col"]["label"],
                            }
                            if dt_obj.weekday() >= 5:
                                date_item["isTentative"] = True
                                date_item["warning"] = "Verificare sul PDF DIETI (data nel weekend)"
                            dates.append(date_item)
                            continue
                note_words.append(w["text"])

            note_str = re.sub(r"\s+", " ", " ".join(note_words)).strip()

            # Caso Page 2: nota nella griglia spezzata su riga immediatamente precedente ("contattare" sopra "il docente")
            if not course_str and not doc_str and not mail_str and not can_str and not dates and note_str:
                if page_rows and page_rows[-1].get("_expecting_note_cont"):
                    page_rows[-1]["note"] = f"{page_rows[-1]['note']} {note_str}".strip()
                else:
                    orphan_note_prefixes.append(note_str)
                continue

            if orphan_note_prefixes and note_str:
                note_str = f"{' '.join(orphan_note_prefixes)} {note_str}".strip()
                orphan_note_prefixes = []
            elif orphan_note_prefixes and (course_str or doc_str):
                # Verifica se c'era un prefisso orfano appena prima della riga corrente
                note_str = f"{' '.join(orphan_note_prefixes)} {note_str}".strip()
                orphan_note_prefixes = []

            # Caso Page 1 Vecchio Regolamento: avvisi multi-riga nella colonna Docente ("Mutua docenti...", "Insegnamento disattivato...")
            doc_low = doc_str.lower()
            is_note_in_doc_col = (
                not mail_str
                and not can_str
                and not dates
                and any(
                    kw in doc_low
                    for kw in (
                        "mutua",
                        "disattivato",
                        "nomina",
                        "commissione",
                        "nuovo regolamento",
                        "programma",
                        "docenti e date",
                    )
                )
            )

            row_obj = {
                "yearGroup": year_group,
                "semester": row_sem,
                "regolamento": regolamento,
                "course": course_str,
                "prof": "" if is_note_in_doc_col else doc_str,
                "email": mail_str,
                "channel": can_str,
                "dates": dates,
                "note": doc_str if is_note_in_doc_col else note_str,
                "_is_doc_note_row": is_note_in_doc_col,
                "_expecting_note_cont": False,
                "_yMin": row_ymin,
                "_yMax": row_ymax,
                "_pending_codocs": [],
            }
            page_rows.append(row_obj)

        # Post-processing su page_rows
        merged = []
        for idx, r in enumerate(page_rows):
            # 1) Unisci note in colonna Docente spezzate su 2 righe (es. "Mutua docenti..." + "Programmazione | nuovo regolamento")
            if r["_is_doc_note_row"] and merged and merged[-1]["_is_doc_note_row"] and not merged[-1]["course"]:
                prev = merged[-1]
                prev["note"] = f"{prev['note']} {r['note']}".strip()
                if r["course"]:
                    prev["course"] = r["course"]
                prev["_yMax"] = max(prev["_yMax"], r["_yMax"])
                continue
            merged.append(r)

        # 2) Unisci co-docenti orfani associandoli alla riga adiacente (sopra o sotto) con distanza verticale minore
        consolidated = []
        for idx, r in enumerate(merged):
            if r["_pending_codocs"]:
                for co_prof, co_mail in r["_pending_codocs"]:
                    if co_prof and co_prof not in r["prof"]:
                        r["prof"] = f"{r['prof']} / {co_prof}".strip(" /")
                    if co_mail and co_mail not in r["email"]:
                        r["email"] = f"{r['email']} / {co_mail}".strip(" /")
                r["_pending_codocs"] = []

            is_orphan_codoc = (
                not r["course"]
                and not r["channel"]
                and not r["dates"]
                and not r["note"]
                and bool(r["prof"])
            )
            if is_orphan_codoc:
                prev_cand = (
                    consolidated[-1]
                    if (
                        consolidated
                        and consolidated[-1]["dates"]
                        and consolidated[-1]["course"]
                        and consolidated[-1]["regolamento"] == r["regolamento"]
                    )
                    else None
                )
                next_cand = (
                    merged[idx + 1]
                    if (
                        idx + 1 < len(merged)
                        and merged[idx + 1]["dates"]
                        and merged[idx + 1]["course"]
                        and merged[idx + 1]["regolamento"] == r["regolamento"]
                    )
                    else None
                )
                gap_up = (r["_yMin"] - prev_cand["_yMax"]) if prev_cand else 1e9
                gap_dn = (next_cand["_yMin"] - r["_yMax"]) if next_cand else 1e9

                if next_cand is not None and (prev_cand is None or gap_dn < gap_up):
                    next_cand["_pending_codocs"].append((r["prof"], r["email"]))
                    continue
                if prev_cand is not None:
                    if r["prof"] not in prev_cand["prof"]:
                        prev_cand["prof"] = f"{prev_cand['prof']} / {r['prof']}".strip(" /")
                    if r["email"] and r["email"] not in prev_cand["email"]:
                        prev_cand["email"] = f"{prev_cand['email']} / {r['email']}".strip(" /")
                    continue

            consolidated.append(r)

        # 3) Risolvi celle Insegnamento unite verticalmente su 2 o 3 righe (Vecchio Regolamento Pagine 1 e 3)
        n = len(consolidated)
        for i, r in enumerate(consolidated):
            if r["course"] or r["_is_doc_note_row"]:
                continue
            # Caso 3 righe centrate (Page 1 Vecchio Regolamento: row i-1 sopra row i con course, e row i+1 sotto)
            if i + 1 < n and consolidated[i + 1]["course"] and not consolidated[i + 1]["_is_doc_note_row"]:
                r["course"] = consolidated[i + 1]["course"]
            elif i > 0 and consolidated[i - 1]["course"] and not consolidated[i - 1]["_is_doc_note_row"]:
                r["course"] = consolidated[i - 1]["course"]

        all_entries.extend(consolidated)

    # Costruisci lookup di email verificate per correggere eventuali scambi nel PDF DIETI
    verified_email_by_prof = {norm_key(v): k for k, v in EMAIL_PROF_OVERRIDES.items()}
    for raw in all_entries:
        p_parts = [p.strip() for p in raw["prof"].split("/") if p.strip()]
        e_parts = [e.strip().lower() for e in raw["email"].split("/") if "@" in e]
        if len(p_parts) == len(e_parts):
            for pp, ee in zip(p_parts, e_parts):
                if email_matches_prof(ee, pp):
                    verified_email_by_prof.setdefault(norm_key(pp), ee)

    # Normalizzazione finale e associazione a repoCourse + aliases
    cleaned_entries = []
    seen_empty_keys = {}

    for raw in all_entries:
        course_name = re.sub(r"\s+", " ", raw["course"]).strip()
        if not course_name:
            continue
        prof = re.sub(r"\s+", " ", raw["prof"]).strip()
        email = re.sub(r"\s+", " ", raw["email"]).strip()
        channel = re.sub(r"\s+", " ", raw["channel"]).strip()
        note = re.sub(r"\s+", " ", raw["note"]).strip()
        dates = sorted(raw["dates"], key=lambda d: d["iso"])

        # Se Docente == "VEDI CALENDARIO MAGISTRALE", ricava nome docente dall'email
        if "vedi calendario magistrale" in prof.lower():
            derived = prof_from_email(email)
            prof = derived if derived else prof
            if not dates and not note:
                note = "Consultare il calendario di Laurea Magistrale"

        # Validazione coerenza email <-> docente (corregge scambi noti/rilevati nel PDF DIETI)
        if prof and email:
            p_parts = [p.strip() for p in prof.split("/") if p.strip()]
            e_parts = [e.strip() for e in email.split("/") if e.strip()]
            fixed_emails = []
            unresolved_mismatch = False
            for idx_e, em in enumerate(e_parts):
                p_ref = p_parts[idx_e] if idx_e < len(p_parts) else prof
                if email_matches_prof(em, p_ref):
                    fixed_emails.append(em)
                else:
                    # Prova a risolvere tramite lookup email verificate dello stesso PDF / overrides
                    cand = verified_email_by_prof.get(norm_key(p_ref), "")
                    if not cand:
                        p_surname = norm_key(p_ref).split()[-1] if norm_key(p_ref).split() else ""
                        if len(p_surname) >= 4:
                            for vk, ve in verified_email_by_prof.items():
                                if vk.endswith(p_surname) and email_matches_prof(ve, p_ref):
                                    cand = ve
                                    break
                    if cand:
                        fixed_emails.append(cand)
                    else:
                        unresolved_mismatch = True
            email = " / ".join(fixed_emails)
            if unresolved_mismatch:
                warn_msg = "Verificare email docente sul PDF ufficiale DIETI"
                note = f"{note} · {warn_msg}".strip(" ·") if note else warn_msg

        # Righe vuote come Inglese
        if norm_key(course_name) == "inglese" and not dates and not prof and not note:
            note = "Prove gestite dal Centro Linguistico di Ateneo (CLA)"

        # Verifica mapping verso corso nel repository e sigle ricerca
        ck = norm_key(course_name)
        repo_course, extra_aliases = REPO_COURSE_MAP.get(ck, ("", ""))

        # Unisce eventuali duplicati identici di Esami a Scelta senza date su I e II semestre (es. OSMCI Pagina 4)
        if not dates:
            dup_key = (raw["yearGroup"], raw["regolamento"], ck, prof.lower(), email.lower(), channel.lower(), note.lower())
            if dup_key in seen_empty_keys:
                prev_e = seen_empty_keys[dup_key]
                if raw["semester"] not in prev_e["semester"]:
                    prev_e["semester"] = f"{prev_e['semester']} / {raw['semester']}"
                continue

        entry_obj = {
            "id": f"cal-{len(cleaned_entries) + 1}",
            "yearGroup": raw["yearGroup"],
            "semester": raw["semester"],
            "regolamento": raw["regolamento"],
            "course": course_name,
            "repoCourse": repo_course,
            "aliases": extra_aliases,
            "prof": prof,
            "email": email,
            "channel": channel,
            "dates": dates,
            "note": note,
        }
        cleaned_entries.append(entry_obj)
        if not dates:
            seen_empty_keys[dup_key] = entry_obj

    return cleaned_entries


def build_calendar_payload(pdf_url: str, session_title: str, pdf_meta: dict, entries: list, ac_years: tuple[int, int]) -> dict:
    month_counts = {}
    total_dates = 0
    for e in entries:
        for d in e["dates"]:
            total_dates += 1
            mk = d["monthKey"]
            if mk not in month_counts:
                month_counts[mk] = {
                    "key": mk,
                    "label": f"{MONTH_NAMES_IT[d['month']]} {d['year']}",
                    "shortLabel": f"{MONTH_SHORT_IT[d['month']]} {d['year']}",
                    "count": 0,
                }
            month_counts[mk]["count"] += 1

    months = [month_counts[k] for k in sorted(month_counts.keys())]
    return {
        "academicYear": f"{ac_years[0]}/{ac_years[1]}",
        "sourcePageUrl": DIETI_PAGE_URL,
        "pdfUrl": pdf_url,
        "sessionTitle": session_title or pdf_meta.get("title") or "Calendario Esami Laurea Triennale",
        "pdfModifiedAt": pdf_meta.get("modDisplay", ""),
        "totalEntries": len(entries),
        "totalDates": total_dates,
        "months": months,
        "entries": entries,
    }


def sync_calendar(out_path: str = DEFAULT_OUT_JSON, local_pdf: str = "", force: bool = False) -> dict:
    if local_pdf:
        pdf_meta = parse_pdf_info(local_pdf)
        ac_years = infer_academic_years(local_pdf, pdf_meta.get("title", ""), pdf_meta.get("modDisplay", ""))
        entries = parse_pdf_calendar(local_pdf, ac_years)
        payload = build_calendar_payload(
            f"{DIETI_BASE_URL}/images/calendario-esami/{ac_years[0]}-{str(ac_years[1])[-2:]}/{os.path.basename(local_pdf)}",
            pdf_meta.get("title", ""),
            pdf_meta,
            entries,
            ac_years,
        )
    else:
        pdfs = discover_triennale_pdfs(DIETI_PAGE_URL)
        if not pdfs:
            raise RuntimeError("Nessun PDF del calendario Triennale trovato sulla pagina DIETI.")

        all_entries = []
        primary_pdf = pdfs[0]
        primary_meta = {}
        primary_years = (2026, 2027)

        for idx, pdf_info in enumerate(pdfs):
            pdf_bytes = http_get_bytes(pdf_info["url"])
            with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tf:
                tf.write(pdf_bytes)
                tmp_path = tf.name
            try:
                meta = parse_pdf_info(tmp_path)
                ac_years = infer_academic_years(pdf_info["url"], pdf_info["title"], meta.get("modDisplay", ""))
                entries = parse_pdf_calendar(tmp_path, ac_years)
                if idx == 0:
                    primary_meta = meta
                    primary_years = ac_years
                all_entries.extend(entries)
            finally:
                try:
                    os.unlink(tmp_path)
                except OSError:
                    pass

        # Rinumera gli ID sequenzialmente se più PDF di sessione sono pubblicati
        for i, e in enumerate(all_entries, 1):
            e["id"] = f"cal-{i}"

        session_title = " / ".join(p["title"] for p in pdfs if p["title"]) or primary_meta.get("title", "")
        payload = build_calendar_payload(primary_pdf["url"], session_title, primary_meta, all_entries, primary_years)
        if len(pdfs) > 1:
            payload["extraPdfUrls"] = [p["url"] for p in pdfs[1:]]

    # Guardrail anti-corruzione: non sovrascrivere exam_calendar.json se il parse fallisce o crolla > 30%
    if payload["totalEntries"] == 0 or payload["totalDates"] == 0:
        raise RuntimeError(
            f"Guardrail calendario: parse sospetto ({payload['totalEntries']} canali, {payload['totalDates']} date). "
            "Sovrascrittura bloccata."
        )

    new_json = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
    if os.path.exists(out_path):
        old_json = open(out_path, encoding="utf-8").read()
        if not force:
            try:
                old_data = json.loads(old_json)
                old_entries = int(old_data.get("totalEntries", 0) or 0)
                old_dates = int(old_data.get("totalDates", 0) or 0)
                if old_entries > 0 and payload["totalEntries"] < old_entries * 0.70:
                    raise RuntimeError(
                        f"Guardrail calendario: calo canali >30% ({old_entries} -> {payload['totalEntries']}). "
                        "Usa --force per confermare."
                    )
                if old_dates > 0 and payload["totalDates"] < old_dates * 0.70:
                    raise RuntimeError(
                        f"Guardrail calendario: calo appelli >30% ({old_dates} -> {payload['totalDates']}). "
                        "Usa --force per confermare."
                    )
            except json.JSONDecodeError:
                pass
        if hashlib.sha256(old_json.encode("utf-8")).hexdigest() == hashlib.sha256(new_json.encode("utf-8")).hexdigest():
            print(f"ℹ️ Calendario esami già aggiornato ({payload['totalEntries']} canali, {payload['totalDates']} appelli).")
            return payload

    with open(out_path, "w", encoding="utf-8") as fp:
        fp.write(new_json)
    print(f"✅ Calendario esami salvato in '{out_path}': {payload['totalEntries']} canali, {payload['totalDates']} appelli.")
    return payload


def main():
    parser = argparse.ArgumentParser(description="Sincronizza il calendario esami Triennale dal sito DIETI.")
    parser.add_argument("--out", default=DEFAULT_OUT_JSON, help="Percorso file JSON di output")
    parser.add_argument("--pdf", default="", help="Percorso opzionale PDF locale (salta download HTTP)")
    parser.add_argument("--force", action="store_true", help="Forza la sovrascrittura ignorando il guardrail calo >30%%")
    args = parser.parse_args()
    sync_calendar(out_path=args.out, local_pdf=args.pdf, force=args.force)


if __name__ == "__main__":
    main()
