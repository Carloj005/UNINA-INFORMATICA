#!/usr/bin/env python3
"""
Monitoraggio stato del sito ufficiale del Corso di Laurea in Informatica (DIETI - Federico II).
Controlla:
  1. Portale CdL DIETI: https://informatica.dieti.unina.it/index.php/it/
  2. Pagina Calendario Esami Triennale: .../calendario-esami-laurea-triennale

Classifica lo stato in 4 livelli chiari:
  - online      : sito raggiungibile (HTTP 200), contenuto CdL integro, latenza normale
  - degraded    : sito principale raggiungibile ma lento (>= 4000 ms) oppure pagina calendario non raggiungibile
  - maintenance : HTTP 503 o pagina Joomla/server in manutenzione / offline rilevata
  - down        : errore di rete, timeout, errore DNS/TLS, HTTP 5xx/4xx sul sito principale

Mantiene uno storico compatto degli ultimi 24 controlli (~12 ore con cron ogni 30 minuti)
per calcolare uptime e mostrare la barra storica nel Portale Web.
"""

import argparse
import json
import os
import re
import socket
import ssl
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone

PORTAL_URL = "https://informatica.dieti.unina.it/index.php/it/"
CALENDAR_PAGE_URL = (
    "https://informatica.dieti.unina.it/index.php/it/servizi-per-gli-studenti/"
    "calendario-esami/calendario-esami-laurea-triennale"
)
DEFAULT_OUT_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dieti_status.json")
USER_AGENT = "UNINA-INFORMATICA-StatusMonitor/1.0 (+https://carloj005.github.io/UNINA-INFORMATICA/)"
SLOW_THRESHOLD_MS = 4000
MAX_HISTORY = 24

# Pattern tipici di Joomla / nginx / Apache in modalità manutenzione o sito offline
MAINTENANCE_PATTERNS = [
    re.compile(r"sito\s+(?:è\s+)?(?:momentaneamente\s+|temporaneamente\s+)?(?:offline|in\s+manutenzione)", re.I),
    re.compile(r"(?:in\s+manutenzione|manutenzione\s+programmata|lavori\s+in\s+corso)", re.I),
    re.compile(r"(?:under\s+maintenance|scheduled\s+maintenance|site\s+is\s+(?:currently\s+)?offline)", re.I),
    re.compile(r"(?:service\s+temporarily\s+unavailable|temporaneamente\s+(?:non\s+disponibile|sospeso))", re.I),
    re.compile(r'id=["\']frame["\'][^>]*>[\s\S]{0,600}offline', re.I),
    re.compile(r'name=["\']task["\']\s+value=["\']user\.login["\'][\s\S]{0,400}offline', re.I),
]

VALID_SITE_PATTERNS = [
    re.compile(r"informatica", re.I),
    re.compile(r"dieti|federico\s*ii|unina", re.I),
]


def looks_like_maintenance(html_text: str) -> bool:
    if not html_text:
        return False
    # Limita l'analisi ai primi 25 KB (testata/body/title) per evitare falsi positivi da articoli lunghi
    snippet = html_text[:25000]
    title_m = re.search(r"<title[^>]*>(.*?)</title>", snippet, re.I | re.S)
    title = title_m.group(1).strip() if title_m else ""
    if re.search(r"offline|manutenzione|maintenance|503|unavailable", title, re.I):
        return True
    # Pagina offline Joomla: corta (< 15 KB) oppure senza menu principale del CdL
    is_short = len(html_text) < 15000
    for pat in MAINTENANCE_PATTERNS:
        if pat.search(snippet):
            if is_short or not all(vp.search(snippet) for vp in VALID_SITE_PATTERNS):
                return True
    return False


def probe_url(url: str, timeout: float = 10.0, retries: int = 1) -> dict:
    """Esegue una richiesta GET leggera con 1 retry su errore transitorio di rete."""
    last_err = ""
    last_code = 0
    last_ms = 0

    for attempt in range(retries + 1):
        t0 = time.monotonic()
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": USER_AGENT,
                "Accept": "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "it-IT,it;q=0.9,en;q=0.5",
                "Cache-Control": "no-cache",
            },
            method="GET",
        )
        try:
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                code = int(getattr(resp, "status", 200) or 200)
                raw = resp.read(32768)
                elapsed_ms = int(round((time.monotonic() - t0) * 1000))
                text = raw.decode("utf-8", errors="replace")

                if code == 503 or looks_like_maintenance(text):
                    return {
                        "status": "maintenance",
                        "httpStatus": code,
                        "latencyMs": elapsed_ms,
                        "detail": f"Manutenzione rilevata (HTTP {code})",
                    }
                if 200 <= code < 400:
                    if not text.strip():
                        return {
                            "status": "down",
                            "httpStatus": code,
                            "latencyMs": elapsed_ms,
                            "detail": f"Risposta vuota (HTTP {code})",
                        }
                    if elapsed_ms >= SLOW_THRESHOLD_MS:
                        return {
                            "status": "degraded",
                            "httpStatus": code,
                            "latencyMs": elapsed_ms,
                            "detail": f"Risposta lenta • HTTP {code} ({elapsed_ms} ms)",
                        }
                    return {
                        "status": "online",
                        "httpStatus": code,
                        "latencyMs": elapsed_ms,
                        "detail": f"HTTP {code} • {elapsed_ms} ms",
                    }
                last_code = code
                last_ms = elapsed_ms
                last_err = f"HTTP {code}"
        except urllib.error.HTTPError as exc:
            elapsed_ms = int(round((time.monotonic() - t0) * 1000))
            code = int(exc.code or 0)
            body = ""
            try:
                body = exc.read(16384).decode("utf-8", errors="replace")
            except Exception:
                pass
            if code == 503 or looks_like_maintenance(body):
                return {
                    "status": "maintenance",
                    "httpStatus": code,
                    "latencyMs": elapsed_ms,
                    "detail": f"Manutenzione programmata (HTTP {code})",
                }
            last_code = code
            last_ms = elapsed_ms
            last_err = f"HTTP {code}"
        except (urllib.error.URLError, socket.timeout, TimeoutError, ssl.SSLError, OSError) as exc:
            elapsed_ms = int(round((time.monotonic() - t0) * 1000))
            reason = getattr(exc, "reason", exc)
            last_code = 0
            last_ms = elapsed_ms
            if isinstance(reason, (socket.timeout, TimeoutError)) or "timed out" in str(reason).lower():
                last_err = f"Timeout dopo {int(timeout)}s"
            elif isinstance(reason, ssl.SSLError) or "ssl" in str(reason).lower():
                last_err = "Errore certificato SSL/TLS"
            else:
                last_err = "Server non raggiungibile"

        if attempt < retries:
            time.sleep(1.5)

    return {
        "status": "down",
        "httpStatus": last_code,
        "latencyMs": last_ms,
        "detail": last_err or "Non raggiungibile",
    }


def load_previous_history(prev_file: str = "", prev_url: str = "") -> list:
    data = None
    if prev_file and os.path.exists(prev_file):
        try:
            with open(prev_file, encoding="utf-8") as fp:
                data = json.load(fp)
        except Exception:
            data = None
    elif prev_url:
        try:
            req = urllib.request.Request(prev_url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=8) as resp:
                data = json.loads(resp.read().decode("utf-8", errors="replace"))
        except Exception:
            data = None

    if not isinstance(data, dict):
        return []
    hist = data.get("history")
    if not isinstance(hist, list):
        return []
    cleaned = []
    for item in hist:
        if isinstance(item, dict) and item.get("t") and item.get("s") in ("online", "degraded", "maintenance", "down"):
            cleaned.append({
                "t": str(item["t"]),
                "s": str(item["s"]),
                "ms": int(item.get("ms") or 0),
                "c": int(item.get("c") or 0),
            })
    return cleaned[-(MAX_HISTORY - 1):]


def aggregate_status(portal_res: dict, cal_res: dict) -> tuple:
    ps = portal_res["status"]
    cs = cal_res["status"]

    if ps == "maintenance":
        return (
            "maintenance",
            "Manutenzione",
            "Il sito del Corso di Laurea DIETI risulta attualmente in manutenzione o offline temporaneo.",
        )
    if ps == "down":
        return (
            "down",
            "Down",
            f"Il sito del Corso di Laurea DIETI non è al momento raggiungibile ({portal_res['detail']}).",
        )
    if ps == "degraded":
        return (
            "degraded",
            "Lento",
            f"Il sito del Corso di Laurea DIETI risponde con latenza elevata ({portal_res['latencyMs']} ms).",
        )
    if cs in ("down", "maintenance"):
        return (
            "degraded",
            "Parziale",
            "La home DIETI è online, ma la pagina ufficiale del Calendario Esami presenta problemi.",
        )
    if cs == "degraded":
        return (
            "degraded",
            "Lento",
            "Il sito DIETI è online, ma la pagina del Calendario Esami risponde lentamente.",
        )
    return (
        "online",
        "Online",
        "Il sito del Corso di Laurea DIETI e la pagina del Calendario Esami sono raggiungibili.",
    )


def build_status_payload(timeout: float = 10.0, prev_file: str = "", prev_url: str = "") -> dict:
    checked_at = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    portal_res = probe_url(PORTAL_URL, timeout=timeout, retries=1)
    cal_res = probe_url(CALENDAR_PAGE_URL, timeout=timeout, retries=1)

    overall, label, summary = aggregate_status(portal_res, cal_res)

    history = load_previous_history(prev_file=prev_file, prev_url=prev_url)
    history.append({
        "t": checked_at,
        "s": overall,
        "ms": portal_res["latencyMs"],
        "c": portal_res["httpStatus"],
    })
    history = history[-MAX_HISTORY:]

    up_count = sum(1 for h in history if h["s"] in ("online", "degraded"))
    uptime_pct = round((up_count / len(history)) * 100, 1) if history else 100.0
    if uptime_pct == int(uptime_pct):
        uptime_pct = int(uptime_pct)

    return {
        "status": overall,
        "label": label,
        "summary": summary,
        "checkedAt": checked_at,
        "url": PORTAL_URL,
        "httpStatus": portal_res["httpStatus"],
        "latencyMs": portal_res["latencyMs"],
        "uptimePct": uptime_pct,
        "services": [
            {
                "id": "portal",
                "name": "Sito CdL Informatica DIETI",
                "url": PORTAL_URL,
                **portal_res,
            },
            {
                "id": "calendar",
                "name": "Pagina Calendario Esami",
                "url": CALENDAR_PAGE_URL,
                **cal_res,
            },
        ],
        "history": history,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Verifica stato sito ufficiale DIETI Informatica.")
    parser.add_argument("--out", default=DEFAULT_OUT_PATH, help="Percorso JSON di output")
    parser.add_argument("--timeout", type=float, default=10.0, help="Timeout HTTP in secondi")
    parser.add_argument("--prev-file", default="", help="JSON precedente locale per preservare lo storico")
    parser.add_argument("--prev-url", default="", help="URL JSON precedente per preservare lo storico")
    args = parser.parse_args()

    payload = build_status_payload(
        timeout=args.timeout,
        prev_file=args.prev_file,
        prev_url=args.prev_url,
    )
    out_dir = os.path.dirname(os.path.abspath(args.out))
    if out_dir:
        os.makedirs(out_dir, exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as fp:
        json.dump(payload, fp, ensure_ascii=False, indent=2)
        fp.write("\n")

    print(
        f"✅ Stato sito DIETI: {payload['label']} ({payload['status']}) | "
        f"HTTP {payload['httpStatus']} | {payload['latencyMs']} ms | "
        f"uptime {payload['uptimePct']}% ({len(payload['history'])} controlli) -> {args.out}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
