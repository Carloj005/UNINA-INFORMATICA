# Contesto AI - Progetto UNINA-INFORMATICA

Questo documento contiene tutto il contesto, le regole, gli standard consolidati e la cronologia completa delle attività per ripristinare la massima operatività su qualsiasi macchina dopo un reset. Il tuo compito è assistere l'utente nella gestione della repository GitHub **UNINA-INFORMATICA**.

> 🔄 **REGOLA DI AGGIORNAMENTO CONTINUO DEL CONTESTO (FONDAMENTALE):**  
> **Ogni volta che ci sono cambiamenti alla repository** (modifiche strutturali, aggiunta/spostamento di corsi o docenti, nuove risorse, aggiornamenti a script, crediti o standard di naming), **aggiorna sempre questo file (`contesto_ai_unina.md`) se lo reputi necessario**. In questo modo la memoria operativa, la lore e le istruzioni dell'assistente AI resteranno costantemente allineate ed efficaci nel tempo.

---

## 1. Informazioni sulla Repository
- **Posizione locale tipica:** `D:\UNINA-INFORMATICA` (su Windows) oppure `/home/clay-thinkpad/Documents/UNINA-INFORMATICA` / `/home/clay/Documents/UNINA-INFORMATICA` (su Linux).
- **GitHub Remote:** `https://github.com/Carloj005/UNINA-INFORMATICA.git` (branch `master`).
- **Obiettivo:** Raccogliere, organizzare e mantenere il materiale didattico (appunti, slide, esami, tracce, libri) del Corso di Laurea Triennale in Informatica all'Università degli Studi di Napoli Federico II, costantemente allineato alla **Guida dello Studente** e agli **Orari delle Lezioni ufficiali 2026/2027**.
- **GitHub CLI (`gh`):** Viene utilizzato per gestire, analizzare e unire Pull Request (`gh pr list`, `gh pr diff`, `gh pr comment`, `gh pr merge`) e per monitorare le issue.

---

## 2. Regole di Struttura (FONDAMENTALI)

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
1. **Sottocartelle Obbligatorie:** Ciascuna cartella docente *deve* contenere tutte e 8 le sottocartelle standard sopra elencate. Se una cartella è momentaneamente vuota, deve contenere un file `.gitkeep` per garantirne il tracciamento in Git.
2. **Standard Cartella Esami:** La cartella `esami` *deve sempre* essere suddivisa in `esami/scritto/` ed `esami/orale/` (tutto minuscolo e singolare). Non usare mai denominazioni alternative come `Scritti`, `Orale`, `Scritto` o cartelle non standard.
3. **Regola d'Oro per `contenuto-non-proprio`:** In ogni cartella `contenuto-non-proprio` che ospita file, *deve SEMPRE esserci* un file `crediti.txt` per ringraziare e citare esplicitamente l'autore originale o la fonte (es. canale YouTube, repository GitHub o studente).
4. **README di Canale Docente (`Prof-*/README.md`):** Ogni docente ha una scheda informativa contenente:
   - Titolo `# Nome Insegnamento`
   - `## Informazioni Corso` (Docente, Anno, Semestre, Stato)
   - `Codice Teams 2026/2027:` (con codice alfanumerico o vuoto se non ancora disponibile)
   - Eventuali dettagli d'esame e link a risorse aggiuntive.
5. **README di Corso (`[Corso]/README.md`):** Ogni insegnamento (compresi tutti gli *Esami a Scelta*) possiede un file `README.md` a livello di cartella di corso con Anno, Semestre, CFU, Stato e l'elenco cliccabile di **tutti** i canali docenti attivi su disco.
6. **Esami a Scelta:** Risiedono tutti nella cartella radice `Esami a Scelta/[NomeCorso]/Prof-[NomeCognome]/` (totale 12 insegnamenti ufficiali coerenti con la Tabella B della Guida dello Studente 2026/2027).
7. **Nomi File ed Encoding:** Evitare assolutamente apostrofi tipografici curvi (`’`, U+2019) o caratteri speciali nei nomi delle cartelle (usare sempre l'apice ASCII standard `'`, es. `Diritto dell'Informatica`).

---

## 3. Gestione Git e Git LFS
- **Git LFS:** Traccia tutti i formati multimediali pesanti e documenti: `*.pdf`, `*.pptx`, `*.jpg`, `*.png`, `*.zip`, `*.docx` (configurato in `.gitattributes`).
- **Flusso di Lavoro:** Verificare sempre lo stato con `git status`, testare la coerenza dei link e committare regolarmente con messaggi chiari e convenzionali (`feat:`, `fix:`, `docs:`, `chore:`), eseguendo il push su `origin master`.
- **Gestione PR:** Quando viene aperta una Pull Request, va analizzata verificando che i file rispettino l'alberatura, accettata, commentata con ringraziamenti, integrata localmente (`git pull`) e perfezionata con eventuali `.gitkeep` e `crediti.txt` mancanti.

---

## 4. Struttura del README.md Principale
Il [README.md](file:///D:/UNINA-INFORMATICA/README.md) funge da hub centrale della community e include:
- **Badge di stato:** Licenza CC BY-NC-SA 4.0, Ultimo Commit, Dimensione Repository.
- **Link Rapidi:** Canale/Gruppo Telegram studenti, Google Form per Valutazione Materiale Didattico e Form per Raccolta Domande Esami Orali.
- **Tabelle Triennio:** 
  - 1° Anno suddiviso per canali alfabetici (A-DE, DF-M, N-Z) con tutti i docenti censiti.
  - 2° Anno suddiviso per canali (A-G, H-Z).
  - 3° Anno con i 3 corsi del 1° semestre (Reti, Ing. Software, Tecnologie Web) e i corsi del 2° semestre (AI Technologies, Tecniche di Prog. Avanzata, esami a scelta).
  - Tabella Esami a Scelta con docenti ufficiali di riferimento.
  - Icone di avanzamento: ✅ (Completato / Materiale solido) e ⏳ (In Corso / Da sostenere).
- **Informazioni Generali:** Link alla Guida GitHub Education, alle Guide dello Studente (2026/27, 2025/26, 2024/25), all'Orario delle Lezioni 2026/2027 e alla Mappa del Complesso Universitario di Monte Sant'Angelo.
- **Guida per la Contribuzione:** Istruzioni passo-passo sia per le Pull Request che per le Issues di GitHub.

---

## 5. Cronologia Recente e Lore del Progetto
- **Riordino Radicale Esami a Scelta:** Spostati tutti gli esami a scelta nella cartella di primo livello `Esami a Scelta/`, con docenti ufficiali assegnati da Guida dello Studente 2026/2027 (Laurato per *Computer Forensics*, Franzese per *Diritto dell'Informatica*, Benerecetti per *Logics*, Tramontana per *OS for Mobile*, D'Amore per *Calcolo Numerico*, Messina per *Scientific Computing*, Festa per *Ricerca Operativa*).
- **Allineamento Ufficiale 3° Anno (A.A. 2026/2027):** Consolidati i semestri in accordo al piano di studi:
  - Spostato *Tecnologie Web* (Starace / Breve) e *Ingegneria del Software* (Di Martino / Tramontana) unicamente al 1° semestre (9 CFU cad.).
  - Spostato *Tecniche di Programmazione Avanzata* (Faella) e *AI Technologies* (Corazza / Rossi) al 2° semestre (6 CFU cad.).
  - Eliminata la cartella duplicata fantasma `Terzo Anno/Primo Semestre/Operation Research` (in quanto materia a scelta già presente in `Esami a Scelta/Ricerca Operativa`).
- **Standardizzazione Integrale Cartelle Esami:** Normalizzate tutte le cartelle in `esami/scritto/` ed `esami/orale/` per tutti i 67 docenti della repository.
- **Applicazione Regola `crediti.txt`:** Creati i file `crediti.txt` in tutte le cartelle `contenuto-non-proprio` (riconoscendo il contributo di Danilo Amalfitano e Max Cascone per Analisi 1, Edoardo Capasso per Architettura, Hicortab/'L'informatica che appassiona' per Basi di Dati e POO, Armando Fiorillo per Sistemi Operativi e Linguaggi di Programmazione 1, Giuseppe Cautiero per Geometria e Prolog).
- **Integrazione Nuove Risorse Didattiche:**
  - Aggiunto il pacchetto completo di appunti di Analisi 1 (24 lezioni A.A. 2024/2025 e 6 dispense tematiche di teoria) redatto da Max Cascone in `Primo Anno/Primo Semestre/Analisi Matematica 1/Prof-RobertoAlicandro/contenuto-non-proprio/Analisi 1 by Max Cascone/`.
  - Organizzata la cartella dedicata a Danilo Amalfitano in `Primo Anno/Primo Semestre/Analisi Matematica 1/Prof-RobertoAlicandro/contenuto-non-proprio/Danilo Amalfitano/` con la dispensa teorica completa e il relativo `crediti.txt`.
  - Aggiunta la slide introduttiva "Lezione 0 Introduzione al corso.pdf" per Ingegneria del Software in `Terzo Anno/Primo Semestre/Ingegneria del Software/Prof-Sergio Di Martino/slides/`.
  - Aggiunte risorse per *Reti e Programmazione Distribuita* (Prof. Alberto Finzi): libro di testo *Computer Networking: A Top-Down Approach* (7th Ed.) in `libri/`, mappa concettuale in `appunti/` e aggiornato `README.md` con codice Teams 2026/2027 (`rpmzm7k`), modalità d'esame (Scritto + Orale, Preappello disponibile) e testi consigliati.
  - Aggiunta slide "Lezione 01 DNS.pdf" per *Tecnologie Web* in `Terzo Anno/Primo Semestre/Tecnologie Web/Prof-L.L.L.Starace/slides/`.
  - Creata la guida completa e dettagliata ai vantaggi e iscrizione a GitHub Education per studenti Unina (`info-generali/guida-github-education.md`).
  - Aggiornato l'Orario delle Lezioni unificato 2026/2027 per 1°, 2° e 3° anno (`info-generali/Orario Lezioni 2026-2027.pdf`).
- **Google Forms Condizionali (3 Step):** Implementata e distribuita l'architettura dinamica per i form di community (*Valutazione Corsi e Docenti*, *Valutazione Materiale Didattico*, *Raccolta Domande Orale*): Scelta corso (31 corsi A.A. 2026/2027) -> Scelta docente del corso specifico -> Compilazione/Valutazione mirata.
- **Aggiornamento Script di Automazione (`info-generali/scripts/new_course.py`):** Completamente riscritto e modernizzato per creare automaticamente tutte le 8 sottocartelle standard (`esami/scritto` ed `esami/orale` inclusi), i file `.gitkeep`, il `README.md` del docente con la voce Teams e il supporto agli esami a scelta (`--scelta`).
- **Suite di Audit e Validazione:** Eseguita scansione automatica completa con script dedicati verificando: 0 link markdown rotti (su 134 testati), tutti i 24 URL esterni operativi con HTTP 200 OK, 100% dei file README presenti e conformi, alberature prive di cartelle o file orfani.

---

## Istruzioni Operative per l'Assistente AI (Dopo un reset)
1. Esegui sempre `git status` per verificare la pulizia della working tree e la sincronizzazione con `origin master`.
2. Mantieni inalterate le 8 sottocartelle standard per ogni nuovo docente aggiunto.
3. Se aggiungi materiale non originale, inseriscilo in `contenuto-non-proprio/` e crea/aggiorna il file `crediti.txt`.
4. Per ogni nuovo corso o docente, aggiorna sia il rispettivo `README.md` sia la tabella di riepilogo in `README.md`.
5. Se generi o modifichi percorsi file, usa sempre link markdown cliccabili e verificabili su disco.
6. **Aggiornamento Continuo del Contesto:** Ogni volta che ci sono dei cambiamenti nella repository, aggiorna il file `contesto_ai_unina.md` se lo reputi necessario, registrando la nuova lore, le decisioni tecniche o le variazioni strutturali per mantenere la memoria dell'assistente costantemente aggiornata.
