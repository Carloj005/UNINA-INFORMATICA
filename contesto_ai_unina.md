# Contesto AI - Progetto UNINA-INFORMATICA

Questo documento contiene tutto il contesto, le regole, gli standard consolidati e la cronologia completa delle attività per ripristinare la massima operatività su qualsiasi macchina dopo un reset. Il tuo compito è assistere l'utente nella gestione della repository GitHub **UNINA-INFORMATICA**.

> 🔄 **REGOLA DI AGGIORNAMENTO CONTINUO DEL CONTESTO (FONDAMENTALE):**  
> **Ogni volta che ci sono cambiamenti alla repository** (modifiche strutturali, aggiunta/spostamento di corsi o docenti, nuove risorse, aggiornamenti a script, crediti o standard di naming), **aggiorna sempre questo file (`contesto_ai_unina.md`) se lo reputi necessario**. In questo modo la memoria operativa, la lore e le istruzioni dell'assistente AI resteranno costantemente allineate ed efficaci nel tempo.

---

## 1. Informazioni sulla Repository
- **Posizione locale tipica:** `D:\UNINA-INFORMATICA` (su Windows) oppure `/home/clay-thinkpad/Documents/UNINA-INFORMATICA` / `/home/clay/Documents/UNINA-INFORMATICA` (su Linux).
- **GitHub Remote:** `https://github.com/Carloj005/UNINA-INFORMATICA.git` (branch `master`).
- **Portale Web (GitHub Pages):** `https://carloj005.github.io/UNINA-INFORMATICA/` (generato automaticamente ad ogni push su `master` tramite `.github/workflows/deploy-pages.yml` da `info-generali/web/build_site.py`, senza committare artefatti compilati su `master`).
- **Obiettivo:** Raccogliere, organizzare e mantenere il materiale didattico (appunti, slide, esami, tracce, libri) del Corso di Laurea Triennale in Informatica all'Università degli Studi di Napoli Federico II, costantemente allineato alla **Guida dello Studente** e agli **Orari delle Lezioni ufficiali 2026/2027**.
- **GitHub CLI (`gh`):** Viene utilizzato per gestire, analizzare e unire Pull Request (`gh pr list`, `gh pr diff`, `gh pr comment`, `gh pr merge`), monitorare le issue, le GitHub Discussions e i workflow GitHub Actions.

---

## 2. Regole di Struttura e Naming (FONDAMENTALI)

Ogni corso *deve* seguire rigorosamente questa alberatura standard:
```text
[Anno]/[Semestre]/[Corso]/Prof-[NomeCognome]/
├── slides/                 # Presentazioni e slide ufficiali del docente
├── appunti/                # Sbobine, riassunti e appunti personali
├── esercizi/               # Esercitazioni pratiche, compiti di laboratorio
├── progetti/               # Codice, relazioni e presentazioni per prove pratiche
├── esami/                  # Prove d'esame, RIGOROSAMENTE suddivise in:
│   ├── scritto/            # Tracce scritte, prove intercorso, soluzioni
│   └── orale/              # Domande orali, mappe mentali, riassunti per l'orale
├── libri/                  # Libri di testo consigliati in PDF
└── contenuto-non-proprio/  # Materiale didattico raccolto da altri studenti/autori
```

### Regole per i file e le cartelle:
1. **Sottocartelle Obbligatorie (Nessuna Cartella Extra):** Ciascuna cartella docente *deve* contenere esattamente le 8 sottocartelle standard sopra elencate (`slides`, `appunti`, `esercizi`, `progetti`, `esami/scritto`, `esami/orale`, `libri`, `contenuto-non-proprio`) più il `README.md`. Se una cartella è momentaneamente vuota, deve contenere un file `.gitkeep` per garantirne il tracciamento in Git. Non creare sottocartelle extra fuori standard (es. `robe-utili`, `dettagli`).
2. **Standard Naming `Prof-[NomeCognome]` (ASCII CamelCase):** Tutte le cartelle docente — inclusi 1°, 2°, 3° Anno ed Esami a Scelta — devono usare rigorosamente il formato `Prof-NomeCognome` in **CamelCase ASCII senza spazi, punti, apostrofi o lettere accentate** (es. `Prof-SergioDiMartino`, `Prof-AndreaCali`, `Prof-LuigiLiberoLucioStarace`, `Prof-AnnaCorazza`). Lo script `info-generali/scripts/new_course.py` applica automaticamente questa sanitizzazione. Usare `Prof-DaDefinire` *esclusivamente* se un corso non ha ancora alcun docente ufficiale assegnato su disco.
3. **Title Case per i Corsi:** I nomi delle cartelle corso devono seguire il Title Case coerente (es. `Algorithm Design`, `Logics for Computer Science`, `Operating Systems for Mobile, Cloud and IoT`, `Metodi Statistici per l'Informazione`).
4. **Standard Cartella Esami:** La cartella `esami` *deve sempre* essere suddivisa in `esami/scritto/` ed `esami/orale/` (tutto minuscolo e singolare). Non usare mai denominazioni alternative come `Scritti`, `Orale`, `Scritto` o cartelle non standard.
5. **Regola d'Oro per `contenuto-non-proprio`:** In ogni cartella `contenuto-non-proprio` che ospita file (oltre a `.gitkeep`), *deve SEMPRE esserci* un file `crediti.txt` per ringraziare e citare esplicitamente l'autore originale o la fonte (es. canale YouTube, repository GitHub o studente).
6. **README di Canale Docente (`Prof-*/README.md`):** Ogni docente ha una scheda informativa contenente:
   - Titolo `# Nome Insegnamento`
   - `## Informazioni Corso` (Docente, Anno, Semestre, Stato)
   - `Codice Teams 2026/2027:` (con codice alfanumerico o vuoto se non ancora disponibile)
   - Eventuali dettagli d'esame, note operative e strumenti consigliati.
7. **README di Corso (`[Corso]/README.md`):** Tutti i 31 insegnamenti possiedono un file `README.md` arricchito con i metadati ufficiali della Guida dello Studente 2026/2027: titolo italiano/inglese, Anno, Semestre, CFU, SSD, Propedeuticità cliccabili, Modalità d'Esame, Copertura Materiale (`🟢`/`🟡`/`⚪`), Stato Esame personale, Obiettivi Formativi ed elenco cliccabile di **tutti** i canali `Prof-*` attivi su disco.
8. **Esami a Scelta:** Risiedono tutti nella cartella radice `Esami a Scelta/[NomeCorso]/Prof-[NomeCognome]/` (totale 12 insegnamenti ufficiali coerenti con la Tabella B della Guida dello Studente 2026/2027).
9. **Nomi File, Encoding e Binari Compilati:** Evitare apostrofi tipografici curvi (`’`, U+2019) nei nomi delle cartelle (usare sempre l'apice ASCII `'`, es. `Diritto dell'Informatica`). Non committare mai eseguibili compilati (ELF Linux, `.exe`, `.out`), librerie `.jar` o file temporanei LaTeX (`*.aux`, `*.synctex.gz`, ecc.).

---

## 3. Gestione Git, Git LFS, CI e Automazione
- **Git LFS & Strategia Salva-Banda (10 GiB/mese):** `.gitattributes` traccia in modo case-insensitive tutti i documenti e archivi binari (`*.pdf`, `*.pptx`, `*.ppt`, `*.docx`, `*.doc`, `*.xlsx`, `*.xls`, `*.odt`, `*.odp`, `*.ods`, `*.epub`, `*.jpg`, `*.jpeg`, `*.png`, `*.webp`, `*.gif`, `*.zip`, `*.rar`, `*.7z`, `*.tar.gz`). Per proteggere la quota mensile Git LFS da 10 GiB/mese:
  1. Il `README.md` istruisce gli studenti a clonare con `GIT_LFS_SKIP_SMUDGE=1 git clone ...` e scaricare selettivamente solo i corsi desiderati (`git lfs pull --include="..."`), oppure a usare il Portale Web per il download dei singoli file.
  2. Le GitHub Actions (`.github/workflows/audit-pr.yml` e `deploy-pages.yml`) usano `lfs: false` (scaricando al massimo le 2 mappe campus `~1.1 MB` per Pages) così le build CI consumano **0 byte** di banda LFS sui PDF/archivi dei corsi.
- **Validazione Automatica (`info-generali/scripts/audit_repo.py`):** Prima di ogni commit/push importante (ed eseguito automaticamente sulle PR da `audit-pr.yml`), lanciare `python3 info-generali/scripts/audit_repo.py`. Verifica: 8 sottocartelle standard, assenza di cartelle extra o `Prof-DaDefinire` ridondanti, naming `Prof-NomeCognome` CamelCase, presenza di `crediti.txt`, zero link Markdown rotti, zero eseguibili ELF/PE/Mach-O e zero binari pesanti sfuggiti a Git LFS.
- **Google Apps Script (`info-generali/scripts/aggiorna_form_esistenti.gs`):** Gli `EDIT_ID` dei Google Form non vanno mai hardcoded nel codice sorgente pubblico; lo script li legge da `PropertiesService.getScriptProperties()` con fallback automatico tramite ricerca per nome su Google Drive del proprietario.
- **Flusso di Lavoro:** Verificare sempre lo stato con `git status` e `audit_repo.py`, committare regolarmente con messaggi convenzionali (`feat:`, `fix:`, `docs:`, `chore:`) ed eseguire il push su `origin master` (mai riscrivere la storia Git con `--force`).

---

## 4. Struttura del README.md Principale e Portale Web
Il [README.md](./README.md) funge da hub centrale della community e include:
- **Banner Portale Web:** Link in evidenza a `https://carloj005.github.io/UNINA-INFORMATICA/` per ricerca istantanea su oltre 1.300 file, filtri per Anno/Corso/Categoria, copia 1-click dei codici Teams, mappe zoomabili e generatore di comandi `git lfs pull` selettivi.
- **Guida Clone Salva-Banda:** Istruzioni `GIT_LFS_SKIP_SMUDGE=1` e `git lfs pull --include`.
- **Dashboard a Doppia Colonna (`Materiale` + `Esame`):**
  - Colonna **Materiale** (per tutti gli studenti): `🟢 Ricco`, `🟡 Parziale`, `⚪ Da popolare`.
  - Colonna **Esame** (tracker personale dell'autore): `✅ Superato`, `⏳ Da sostenere`.
  - Tutti i nomi dei docenti nelle tabelle puntano direttamente con link cliccabili alle rispettive cartelle `./.../Prof-NomeCognome`.
- **Issue & PR Templates (`.github/`):** Moduli strutturati per segnalare codici Teams 2026/2027 (`codice_teams.yml`), inviare/richiedere materiale (`richiesta_o_materiale.yml`), segnalare errori (`segnalazione_errore.yml`), oltre a GitHub Discussions attivo.

---

## 5. Cronologia Recente e Lore del Progetto
- **Riordino Radicale Esami a Scelta:** Spostati tutti gli esami a scelta nella cartella di primo livello `Esami a Scelta/`, con docenti ufficiali assegnati da Guida dello Studente 2026/2027 (Laurato per *Computer Forensics*, Franzese per *Diritto dell'Informatica*, Benerecetti per *Logics for Computer Science*, Tramontana per *Operating Systems for Mobile, Cloud and IoT*, D'Amore per *Calcolo Numerico*, Messina per *Scientific Computing*, Festa per *Ricerca Operativa*).
- **Allineamento Ufficiale 3° Anno (A.A. 2026/2027):** Consolidati i semestri in accordo al piano di studi:
  - *Tecnologie Web* (Starace / Breve) e *Ingegneria del Software* (Di Martino / Tramontana) al 1° semestre (9 CFU cad.).
  - *Tecniche di Programmazione Avanzata* (Faella) e *AI Technologies* (Corazza / Rossi) al 2° semestre (6 CFU cad.).
  - Eliminata la cartella duplicata fantasma `Terzo Anno/Primo Semestre/Operation Research` (materia a scelta già presente in `Esami a Scelta/Ricerca Operativa`).
- **Standardizzazione Integrale Cartelle Esami & `crediti.txt`:** Normalizzate tutte le cartelle in `esami/scritto/` ed `esami/orale/` per tutti i docenti e creati i file `crediti.txt` in tutte le cartelle `contenuto-non-proprio` popolate (Danilo Amalfitano e Max Cascone per Analisi 1, Edoardo Capasso per Architettura, Hicortab/'L'informatica che appassiona' per Basi di Dati e POO, Armando Fiorillo per Sistemi Operativi e Linguaggi di Programmazione 1, Giuseppe Cautiero per Geometria e Prolog, Annunziata per Geometria).
- **Integrazione Risorse Didattiche Principali:**
  - *Analisi Matematica 1* (`Prof-RobertoAlicandro`): appunti completi Max Cascone (24 lezioni + 6 dispense), dispensa Danilo Amalfitano e 42 prove scritte normalizzate per data in `esami/scritto/`.
  - *Reti e Programmazione Distribuita* (`Prof-AlbertoFinzi`): slide ufficiali aggiornate A.A. 2026/2027 (incluse Lezione 08 DNS 2 e la corposa Lezioni 09-13 Network Programming & Sockets da 160 pagine), traduzione italiana integrale Marp + PDF in `slides/italiano/`, testi Kurose-Ross (IT + EN) in `libri/`, mappa concettuale in `appunti/`, codice Teams `rpmzm7k` e suite completa di laboratorio C in `esercizi/` (5 moduli: DNS/HTTP/WHOIS, TCP basic e fork, TCP concorrente con select e thread, UDP con timeout ed echo multi-client, Broadcast & Multicast con chat P2P, oltre all'archivio `laboratorio-socket-c.zip` e guida ai pattern d'esame).
  - *Ingegneria del Software* (`Prof-SergioDiMartino`): slide Lezioni 00-06 (inclusa Lezione 06 Parti 1-4 su architetture, cloud e container) e specifica `SideQuest_Progetto_Integrato_2026-2027.pdf`.
  - *Tecnologie Web* (`Prof-LuigiLiberoLucioStarace`): slide Lezioni 00-17 (DNS, HTTP, HTML, CSS, JS, Asynchronism, Node, Session, Express), esercizi `.zip` Lezioni 15-17 e specifica `SideQuest_Progetto_Integrato_2026-2027.pdf`.
  - *Elementi di Informatica Teorica* (`Prof-AlessandroDeLuca`): dispensa ufficiale 2025-2026; *Geometria* (`Prof-FrancescaCioffi`): appunti Annunziata (PR #21); *Linguaggi di Programmazione 1*: contrassegnato come esame superato (`✅`, voto 26).
  - *Guide & Mappe*: `info-generali/guida-github-education.md`, `Orario Lezioni 2026-2027.pdf`, `MappaMSA.png` e `MappaViaClaudio.jpg` (Issue #19).
- **Modernizzazione Completa Struttura, LFS, CI e Portale Web (Ottobre 2026):**
  - **Uniformazione Naming:** Convertite tutte le 9 cartelle docenti del 3° Anno allo standard CamelCase ASCII (`Prof-PorfirioTramontana`, `Prof-SergioDiMartino`, `Prof-AlbertoFinzi`, `Prof-AndreaCali`, `Prof-BernardoBreve`, `Prof-LuigiLiberoLucioStarace`, `Prof-AnnaCorazza`, `Prof-SilviaRossi`, `Prof-MarcoFaella`), uniformato il Title Case di 4 corsi (*Algorithm Design*, *Logics for Computer Science*, *Operating Systems for Mobile, Cloud and IoT*, *Metodi Statistici per l'Informazione*) e rimosse le 5 cartelle `Prof-DaDefinire` superflue (*Geometria*, *Metodi Statistici*, *Reti*, *AI Technologies*, *Economia*).
  - **Bonifica Alberatura e Binari:** Eliminata `robe-utili/` in *Basi di Dati* (preservando il riferimento StarUML nel `README.md` di `Prof-MaraSangiovanni` insieme a una guida agli strumenti gratuiti senza watermark aggiunta anche ai README di *Basi di Dati*, *POO* e *Ingegneria del Software*), integrato `dettagli` nel `README.md` di `Prof-Piccirillo` (*Economia*), rimossi i 9 `.jar` JUnit in `APSD/.../cartella senza nome/`, rimossi i 19 eseguibili ELF Linux compilati in `Sistemi Operativi/.../Esercitazione2/` sostituendoli con un `Makefile` + `.gitignore` locale, e rinominati i file generici (`Diagramma_UML_Cinema.pdf`, `Esercizio_1.mdj`, `Lezioni_APSD.zip`).
  - **Ottimizzazione Git LFS & Compressione Lossless-Readable (-418 MiB working tree):** Esteso `.gitattributes` a tutte le estensioni binarie mancanti (`.jpeg`, `.epub`, `.rar`, `.odt`, `.odp`, `.doc`, case-insensitive), blindato `aggiorna_form_esistenti.gs` con `PropertiesService`, e ottimizzati i 4 file giganti >90 MiB mantenendo intatta la nitidezza visiva (`SIM - Appunti.docx` 116.6 -> 10.5 MiB, `Domande Orale AdE 2023.pdf` 111.5 -> 2.1 MiB, `ESERCIZI ADE.pdf` 94.1 -> 71.3 MiB, `ADE.pdf` 90.3 -> 42.7 MiB).
  - **Schede Corso 2026/2027, CI & GitHub Pages:** Arricchiti tutti i 31 `README.md` di corso con CFU, SSD, Propedeuticità cliccabili, Modalità d'esame e Obiettivi Formativi estratti da `GuidaTriennaleInformatica-26-27.pdf`; introdotta la doppia colonna `Materiale` + `Esame` nel `README.md` principale; attivati `.github/workflows/audit-pr.yml`, `.github/workflows/deploy-pages.yml`, Issue/PR templates, GitHub Discussions e il Portale Web statico ricercabile (`info-generali/web/`).

---

## Istruzioni Operative per l'Assistente AI (Dopo un reset)
1. Esegui sempre `git status` per verificare la pulizia della working tree e la sincronizzazione con `origin master`.
2. Mantieni rigorosamente le 8 sottocartelle standard e il naming `Prof-NomeCognome` (ASCII CamelCase, senza spazi/punti/accenti) per ogni docente.
3. Se aggiungi materiale non originale, inseriscilo in `contenuto-non-proprio/` e crea/aggiorna il file `crediti.txt`.
4. Per ogni nuovo corso o docente, aggiorna il rispettivo `README.md`, la dashboard in `README.md` ed esegui `python3 info-generali/scripts/audit_repo.py` per validare struttura, LFS e link prima del push (il portale GitHub Pages si aggiornerà automaticamente via GitHub Actions).
5. Se generi o modifichi percorsi file, usa sempre link markdown cliccabili e verificabili su disco.
6. **Aggiornamento Continuo del Contesto:** Ogni volta che ci sono dei cambiamenti nella repository, aggiorna il file `contesto_ai_unina.md` se lo reputi necessario, registrando la nuova lore, le decisioni tecniche o le variazioni strutturali per mantenere la memoria dell'assistente costantemente aggiornata.
