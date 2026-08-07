# UNINA-INFORMATICA 🎓

![GitHub last commit](https://img.shields.io/github/last-commit/Carloj005/UNINA-INFORMATICA?style=flat-square)
![Repo Size](https://img.shields.io/github/repo-size/Carloj005/UNINA-INFORMATICA?style=flat-square)
![License](https://img.shields.io/badge/license-CC%20BY--NC--SA%204.0-lightgrey?style=flat-square)

Repository dedicata alla raccolta e organizzazione del materiale didattico per il Corso di Laurea Triennale in **Informatica** presso l'Università degli Studi di Napoli Federico II. Anno accademico di inizio 2024-2025. [Pagina Ufficiale del corso di laurea](https://informatica.dieti.unina.it/index.php/it/)

**NOTA**: Il materiale originale nasce per gli studenti del gruppo 1. Tuttavia, la repository è ora strutturata per contenere il materiale di **tutti i canali e docenti**. Potete trovare tutto il materiale necessario e tutti i gruppi telegram ufficiali [qui](https://t.me/+7HOZaOMbgSphNGM0) se vi dovesse servire altro.

> **⚠️ Disclaimer:** Il materiale qui presente (appunti, riassunti, sbobine) è redatto in gran parte da studenti e potrebbe contenere inesattezze. Usalo come supporto, ma ricorda che non sostituisce lo studio sul materiale ufficiale consigliato dai docenti.

## 📊 Valutazione Corsi e Docenti
Hai seguito un corso o superato un esame? Lascia una valutazione del tutto anonima per aiutare i futuri studenti!  
Compila il nostro [**Google Form di Valutazione**](https://forms.gle/seGUyzc2HiRxmpDs9) per condividere la tua opinione su:
*   Difficoltà dell'esame e del corso.
*   Chiarezza, esposizione e disponibilità del docente.
*   Qualità del materiale didattico e modalità d'esame.

## 🎯 Obiettivo
L'obiettivo di questa repository è fungere da cloud pubblico per centralizzare tutte le risorse universitarie, facilitandone l'accesso, l'organizzazione nel tempo e la fruizione del materiale didattico. La repository verrà aggiornata costantemente con l'avanzare del percorso accademico.

---

## 🚀 Come usare e aggiornare questa repository

Se vuoi avere tutto il materiale sul tuo computer e tenerlo sempre aggiornato con le ultime modifiche, segui questi semplici passaggi. Non preoccuparti se non hai mai usato Git o GitHub!

### 1. Installazione (Solo la prima volta)

Per scaricare e aggiornare automaticamente la cartella, devi installare un piccolo programma chiamato **Git**.  

- **Windows**:
  - **Metodo veloce (Terminale/PowerShell)**: Scrivi `winget install -e --id Git.Git`
  - **Metodo classico**: Scarica l'installer da [git-scm.com](https://git-scm.com/download/win).
- **macOS**:
  - **Metodo veloce (Homebrew)**: Scrivi `brew install git`
  - **Metodo classico**: Apri il Terminale, scrivi `git --version` e segui le istruzioni per installare i "Command Line Tools".
- **Linux**:
  - Ubuntu/Debian: `sudo apt install git`
  - Fedora: `sudo dnf install git`
  - Arch Linux: `sudo pacman -S git`

> 💾 **Nota per file grandi (Git LFS)**: Questa repository utilizza **Git LFS** per gestire PDF e dispense pesanti. Dopo aver installato Git, scrivi nel terminale: `git lfs install` per assicurarti di scaricare correttamente tutti i file, altrimenti scaricherai solo dei "puntatori" vuoti da 1KB! (Se invece scarichi i file singolarmente dal browser tramite il tasto "Download", non avrai problemi).

### 2. Scaricare la repository sul tuo PC (Clone)

Una volta installato Git, scegli una cartella sul tuo computer dove vuoi salvare il materiale (es. Documenti).  

1. Apri il terminale (su Windows si chiama **Git Bash** o **PowerShell**).
2. Scrivi il seguente comando e premi Invio:
   ```bash
   git clone https://github.com/Carloj005/UNINA-INFORMATICA.git
   ```
3. Ora avrai una cartella chiamata `UNINA-INFORMATICA` con tutto il contenuto.

### 3. Aggiornare periodicamente il materiale (Pull)

Quando vengono aggiunti nuovi appunti o modifiche su GitHub, basta aggiornare la cartella che hai già senza riscaricare tutto:

1. Apri il terminale dentro la cartella `UNINA-INFORMATICA`.
2. Scrivi questi comandi:
   ```bash
   git fetch origin
   git pull
   ```
3. Git scaricherà solo i file nuovi o modificati. Consigliamo di farlo ogni volta che vuoi studiare!

---

## 🗺️ Navigazione Rapida

- [Primo Anno](#primo-anno)
- [Secondo Anno](#secondo-anno)
- [Terzo Anno](#terzo-anno)
- [Esami a Scelta](#esami-a-scelta)
- [Informazioni Generali](#informazioni-generali)

---

## 📚 Dashboard Corsi (A.A. 2026/2027)

**Legenda Stato:**
*   ✅ = **Esame Superato** (Materiale consolidato e testato).
*   ⏳ = **In Corso / Da Sostenere** (Materiale in fase di studio o caricamento).

<a id="primo-anno"></a>
### 🟢 Primo Anno (Canali: C1: A-DE, C2: DF-M, C3: N-Z)

| Semestre | Materia | Canale 1 | Canale 2 | Canale 3 | Stato |
| :--- | :--- | :--- | :--- | :--- | :---: |
| 1° | [Architettura Elaboratori](./Primo%20Anno/Primo%20Semestre/Architettura%20degli%20Elaboratori) | L. Sauro | S. Rossi | Da Definire | ✅ |
| 1° | [Analisi Matematica I](./Primo%20Anno/Primo%20Semestre/Analisi%20Matematica%201) | R. Alicandro/C. Leone | D. Castorina | A.M. Barbagallo | ✅ |
| 1° | [Programmazione 1](./Primo%20Anno/Primo%20Semestre/Programmazione%201) | R. Prevete | D. Riccio/L. Sauro | F. Isgrò | ✅ |
| 2° | [Algebra](./Primo%20Anno/Secondo%20Semestre/Algebra) | M.R. Celentani | G. Cutolo | M. Brescia | ⏳ |
| 2° | [Programmazione OO](./Primo%20Anno/Secondo%20Semestre/Programmazione%20Object%20Oriented) | S. Di Martino/M. Sangiovanni | P. Tramontana | B. Breve/R. Caccavale | ✅ |
| 2° | [Basi di Dati](./Primo%20Anno/Secondo%20Semestre/Basi%20di%20Dati) | M. Sangiovanni | S. Barra | A. Calì | ⏳ |

<a id="secondo-anno"></a>
### 🟡 Secondo Anno (Canali: C1: A-G, C2: H-Z)

| Semestre | Materia | Canale 1 | Canale 2 | Stato |
| :--- | :--- | :--- | :--- | :---: |
| 1° | [Algoritmi e Strutture Dati](./Secondo%20Anno/Primo%20Semestre/Algoritmi%20e%20Strutture%20Dati) | M. Benerecetti | F. Mogavero | ✅ |
| 1° | [Informatica Teorica](./Secondo%20Anno/Primo%20Semestre/Elementi%20di%20Informatica%20Teorica) | A. De Luca | A. De Luca | ⏳ |
| 1° | [Fisica Generale I](./Secondo%20Anno/Primo%20Semestre/Fisica%20Generale%201) | G. Chirco/G. De Rosa | G. Esposito | ✅ |
| 1° | [Geometria](./Secondo%20Anno/Primo%20Semestre/Geometria) | F. Cioffi | M. Trombetti | ⏳ |
| 2° | [Sistemi Operativi](./Secondo%20Anno/Secondo%20Semestre/Sistemi%20Operativi) | A. Finzi | W. Balzano | ✅ |
| 2° | [Analisi e Progettazione Algoritmi](./Secondo%20Anno/Secondo%20Semestre/Analisi%20e%20Progettazione%20di%20Algoritmi) | M. Benerecetti | F. Mogavero | ⏳ |
| 2° | [Linguaggi Programmazione 1](./Secondo%20Anno/Secondo%20Semestre/Linguaggi%20di%20Programmazione%201) | P.A. Bonatti | M. Faella | ⏳ |
| 2° | [Metodi Statistici](./Secondo%20Anno/Secondo%20Semestre/Metodi%20Statistici%20per%20l'informazione) | M. Lops | M. Tanda | ⏳ |

<a id="terzo-anno"></a>
### 🔴 Terzo Anno (Canali: C1: A-G, C2: H-Z)

| Semestre | Materia | Canale 1 | Canale 2 | Stato |
| :--- | :--- | :--- | :--- | :---: |
| 1° | [Reti e Programmazione Distribuita](./Terzo%20Anno/Primo%20Semestre/Reti%20e%20Programmazione%20Distribuita) | A. Finzi | A. Calì | ⏳ |
| 1° | [Ingegneria del Software](./Terzo%20Anno/Primo%20Semestre/Ingegneria%20del%20Software) | S. Di Martino | P. Tramontana | ⏳ |
| 1° | [Tecniche di Programmazione Avanzata](./Terzo%20Anno/Primo%20Semestre/Tecniche%20di%20Programmazione%20Avanzata) | M. Faella | M. Faella | ⏳ |
| 2° | [AI Technologies](./Terzo%20Anno/Secondo%20Semestre/AI%20Technologies) | A. Corazza | S. Rossi | ⏳ |
| 2° | [Tecnologie Web](./Terzo%20Anno/Secondo%20Semestre/Tecnologie%20Web) | L.L.L. Starace | B. Breve | ⏳ |

<a id="esami-a-scelta"></a>
### 🧩 Esami a Scelta

| Materia | Docente (Riferimento) | Cartella | Stato |
| :--- | :--- | :--- | :---: |
| **Ricerca Operativa** | P. Festa | [Link](./Secondo%20Anno/Secondo%20Semestre/Esami%20a%20Scelta/Ricerca%20Operativa) | ⏳ |
| **Economia e Org. Aziendale** | Piccirillo / Da Definire | [Link](./Secondo%20Anno/Secondo%20Semestre/Esami%20a%20Scelta/Economia%20e%20Organizzazione%20Aziendale) | ✅ |
| **Algorithm Design** | M. Benerecetti | [Link](./Secondo%20Anno/Secondo%20Semestre/Esami%20a%20Scelta/Algorithm%20design) | ⏳ |
| **Parallel & Distributed Computing** | M. Lapegna | [Link](./Secondo%20Anno/Secondo%20Semestre/Esami%20a%20Scelta/Parallel%20and%20Distributed%20Computing) | ⏳ |
| **Multimedia Information Systems** | W. Balzano | [Link](./Secondo%20Anno/Secondo%20Semestre/Esami%20a%20Scelta/Multimedia%20Information%20Systems) | ⏳ |
| **Calcolo Numerico** | L. D'Amore | [Link](./Secondo%20Anno/Secondo%20Semestre/Esami%20a%20Scelta/Calcolo%20Numerico) | ⏳ |
| **Computer Forensics** | Da Definire | [Link](./Secondo%20Anno/Secondo%20Semestre/Esami%20a%20Scelta/Computer%20Forensics) | ⏳ |
| **Diritto dell'Informatica** | Da Definire | [Link](./Secondo%20Anno/Secondo%20Semestre/Esami%20a%20Scelta/Diritto%20dell’Informatica) | ⏳ |
| **Istituzioni di Matematica II** | Da Definire | [Link](./Secondo%20Anno/Secondo%20Semestre/Esami%20a%20Scelta/Istituzioni%20di%20Matematica%20II) | ⏳ |
| **Logics for Computer Science** | M. Benerecetti | [Link](./Secondo%20Anno/Secondo%20Semestre/Esami%20a%20Scelta/Logics%20for%20computer%20science) | ⏳ |
| **OS for Mobile, Cloud and IoT** | Da Definire | [Link](./Secondo%20Anno/Secondo%20Semestre/Esami%20a%20Scelta/Operating%20systems%20for%20mobile,%20cloud%20and%20IoT) | ⏳ |
| **Scientific Computing** | E. Messina | [Link](./Secondo%20Anno/Secondo%20Semestre/Esami%20a%20Scelta/Scientific%20Computing) | ⏳ |

---

<a id="informazioni-generali"></a>
## ℹ️ Informazioni Generali

Nella cartella [**info-generali**](./info-generali) puoi trovare:
- Guida dello Studente
- Orario delle Lezioni
- Script di automazione per la repo
- Mappa di Monte Sant'Angelo

### 🗺️ Mappa di Monte Sant'Angelo
![Mappa Monte Sant'Angelo](./info-generali/MappaMSA.png)

---

## 🛠️ Struttura della Repository

Ogni corso è organizzato rigorosamente seguendo questo schema:
```text
corso-nome/
├── Prof-NomeCognome/      # Materiale suddiviso per docente (canale)
│   ├── slides/            # Presentazioni ufficiali del corso
│   ├── appunti/           # Sbobine, riassunti e appunti personali
│   ├── esercizi/          # Esercitazioni pratiche e compiti
│   ├── progetti/          # Codice e relazioni per prove pratiche
│   ├── esami/             # Divisi in "scritto" e "orale" (tracce, soluzioni, domande)
│   ├── libri/             # Libri di testo in formato PDF
│   └── contenuto-non-proprio/ # Materiale raccolto da altri studenti (con crediti)
└── README.md              # Info base del corso (Anno, Semestre, Propedeuticità)
```

---

## 🤝 Come Contribuire

Hai vecchie tracce, appunti ben scritti o correzioni da suggerire? Il contributo di tutti è benvenuto! Puoi contribuire in due modi: tramite **Pull Request** (se vuoi caricare direttamente i file) o tramite le **Issues** (per segnalazioni o richieste).

### 🛠️ 1. Proporre modifiche con una Pull Request (PR)
Se hai dei file da aggiungere o vuoi correggere qualcosa direttamente nel codice:
1. **Fai un Fork**: Clicca sul tasto **Fork** in alto a destra su questa pagina per creare una copia della repository sul tuo account GitHub.
2. **Carica i file**: Nella tua copia (fork), naviga nella cartella corretta rispettando la [struttura della repository](#-struttura-della-repository) e carica i file (tramite l'interfaccia web di GitHub cliccando su *Add file -> Upload files*, oppure via Git da terminale).
   - *Nota*: Se il materiale non è tuo, inseriscilo nella cartella `contenuto-non-proprio` del relativo corso e aggiungi un piccolo file `crediti.txt` per ringraziare l'autore originale.
3. **Fai il Commit**: Salva le modifiche inserendo un messaggio chiaro (es. `Aggiunti appunti di Analisi 1`).
4. **Apri la Pull Request**: Torna sulla repository principale `Carloj005/UNINA-INFORMATICA`, clicca sulla scheda **Pull Requests** e poi su **New Pull Request**. Seleziona il tuo fork e invia la richiesta. Verrà esaminata e unita al progetto principale!

### 💬 2. Segnalare problemi o richiedere materiale con le Issues
Se non sai usare Git, hai trovato un errore negli appunti, o vuoi semplicemente richiedere del materiale specifico (es. una traccia d'esame mancante):
1. Vai nella scheda [**Issues**](https://github.com/Carloj005/UNINA-INFORMATICA/issues) in alto.
2. Clicca sul pulsante verde **New Issue**.
3. Inserisci un titolo chiaro (es. *[Richiesta] Traccia Sistemi Operativi 15-01-2026* oppure *[Errore] Refuso a pagina 4 appunti Geometria Cioffi*).
4. Descrivi dettagliatamente la tua segnalazione o richiesta nel box di testo e clicca su **Submit new issue**.

---

## ⚖️ Licenza

Questo materiale è distribuito sotto licenza **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)**.
Consultare il file [LICENSE](./LICENSE) per i dettagli.
