# UNINA-INFORMATICA 🎓

[![Portale Web Ricercabile](https://img.shields.io/badge/🌐_Portale_Web-Ricerca_Rapida_&_Codici_Teams-005596?style=flat-square)](https://carloj005.github.io/UNINA-INFORMATICA/)
![GitHub last commit](https://img.shields.io/github/last-commit/Carloj005/UNINA-INFORMATICA?style=flat-square)
[![CI Audit](https://img.shields.io/github/actions/workflow/status/Carloj005/UNINA-INFORMATICA/audit-pr.yml?label=audit%20struttura&style=flat-square)](https://github.com/Carloj005/UNINA-INFORMATICA/actions/workflows/audit-pr.yml)
![License](https://img.shields.io/badge/license-CC%20BY--NC--SA%204.0-lightgrey?style=flat-square)

Repository dedicata alla raccolta e organizzazione del materiale didattico per il Corso di Laurea Triennale in **Informatica** presso l'Università degli Studi di Napoli Federico II. Anno accademico di inizio 2024-2025. [Pagina Ufficiale del Corso di Laurea](https://informatica.dieti.unina.it/index.php/it/)

> 🌐 **NOVITÀ — Portale Web con Ricerca Istantanea:** Cerchi una singola traccia d'esame, le slide di una lezione o un Codice Teams senza voler scaricare gigabyte di cartelle? Usa il nuovo [**Portale Web UNINA-INFORMATICA**](https://carloj005.github.io/UNINA-INFORMATICA/)!

**NOTA**: Il materiale originale nasce per gli studenti del gruppo 1. Tuttavia, la repository è strutturata per ospitare il materiale di **tutti i canali e docenti**. Potete trovare tutto il materiale necessario e tutti i gruppi Telegram ufficiali [qui](https://t.me/+7HOZaOMbgSphNGM0) se vi dovesse servire altro.

> **⚠️ Disclaimer:** Il materiale qui presente (appunti, riassunti, sbobine) è redatto in gran parte da studenti e potrebbe contenere inesattezze. Usalo come supporto, ma ricorda che non sostituisce lo studio sul materiale ufficiale consigliato dai docenti.

## 📊 Valutazione Corsi e Docenti
Hai seguito un corso o superato un esame? Lascia una valutazione del tutto anonima per aiutare i futuri studenti!  
Compila il nostro [**Google Form di Valutazione**](https://forms.gle/seGUyzc2HiRxmpDs9) per condividere la tua opinione su:
* Difficoltà dell'esame e del corso.
* Chiarezza, esposizione e disponibilità del docente.
* Qualità del materiale didattico e modalità d'esame.

## 📝 Valutazione del Materiale Didattico

La tua opinione è fondamentale per migliorare la qualità del materiale condiviso!  
Se hai utilizzato appunti, dispense o file presenti in questa repository, ti invitiamo a lasciare un feedback sul materiale per un dato **Corso e Professore**.

👉 **[Compila il Form di Valutazione Anonimo](https://forms.gle/KFHXPqoKNj1LyCk67)** 👈

Nel modulo (che è **completamente anonimo**) potrai:
1. Selezionare lo specifico Insegnamento e Professore.
2. Lasciare una valutazione da 1 a 5 sulla qualità e completezza del materiale.
3. Suggerire nei dettagli (campo a risposta libera) cosa migliorare, cosa manca o quali file hai trovato particolarmente utili.

## 🗣️ Raccolta Domande Esami Orali

Hai sostenuto un esame orale? Condividi le domande ricevute per supportare gli altri studenti nella preparazione!  
La raccolta delle domande reali permette a tutti di orientare lo studio sui concetti, teoremi e dimostrazioni più frequentemente richiesti da ciascun docente.

👉 **[Compila il Modulo per le Domande Orali (Anonimo)](https://docs.google.com/forms/d/e/1FAIpQLSfvGQmwT_MQWKN01Ru08KnlvdL-S65TlTPMx-NLvd9kYmX_Xg/viewform)** 👈

---

## 🚀 Come usare e scaricare il materiale (Guida Salva-Spazio e Salva-Banda)

Questa repository utilizza **Git LFS** e contiene **oltre 2,3 GB** di PDF, slide e tracce dell'intero triennio.  
Per **non riempire inutilmente il tuo PC** e **non consumare la quota mensile condivisa di banda Git LFS** (10 GB/mese per tutta la community!), scegli il metodo più adatto a te:

### 🌟 Metodo A — Dal Browser / Portale Web (Consigliato — Zero installazioni)
Se ti servono singoli PDF, slide o tracce d'esame:
1. Apri il [**Portale Web Ricercabile**](https://carloj005.github.io/UNINA-INFORMATICA/) per filtrare istantaneamente file, esami per data, CFU, propedeuticità e copiare i Codici Teams.
2. Oppure naviga direttamente nelle cartelle qui su GitHub, clicca sul file che ti interessa e premi **Download raw file** (icona `⬇` in alto a destra).

### ⚡ Metodo B — Clone Selettivo con Git (Consigliato se usi il terminale)
Con questo metodo scarichi in **2 secondi** l'intera alberatura leggera (meno di 15 MB) e poi scarichi i PDF **solo dell'Anno o del Corso che stai studiando**:

1. **Installa Git e Git LFS** (solo la prima volta):
   - **Windows (PowerShell):** `winget install -e --id Git.Git`
   - **macOS (Homebrew):** `brew install git git-lfs`
   - **Linux:** `sudo apt install git git-lfs` *(Ubuntu/Debian)* • `sudo dnf install git git-lfs` *(Fedora)* • `sudo pacman -S git git-lfs` *(Arch)*
   - Attiva Git LFS:
     ```bash
     git lfs install
     ```
2. **Clona solo l'indice leggero (senza scaricare subito i 2,3 GB di PDF):**
   - **Linux / macOS / Git Bash:**
     ```bash
     GIT_LFS_SKIP_SMUDGE=1 git clone https://github.com/Carloj005/UNINA-INFORMATICA.git
     cd UNINA-INFORMATICA
     ```
   - **Windows (PowerShell):**
     ```powershell
     $env:GIT_LFS_SKIP_SMUDGE="1"; git clone https://github.com/Carloj005/UNINA-INFORMATICA.git; Remove-Item Env:\GIT_LFS_SKIP_SMUDGE
     cd UNINA-INFORMATICA
     ```
3. **Scarica i file reali SOLO per il corso o l'anno che ti serve:**
   ```bash
   # Esempio 1: scarica tutto e solo il Primo Anno
   git lfs pull --include="Primo Anno/**"

   # Esempio 2: scarica solo un singolo corso (es. Tecnologie Web o Analisi 1)
   git lfs pull --include="Terzo Anno/Primo Semestre/Tecnologie Web/**"
   ```
4. **Per aggiornare in futuro solo il tuo corso:**
   ```bash
   GIT_LFS_SKIP_SMUDGE=1 git pull
   git lfs pull --include="Terzo Anno/Primo Semestre/Tecnologie Web/**"
   ```

<details>
<summary>📦 <b>Metodo C — Clone Integrale (~2,4 GB, solo se vuoi l'intero triennio offline)</b></summary>

```bash
git lfs install
git clone --depth 1 https://github.com/Carloj005/UNINA-INFORMATICA.git
```
*(Usa `--depth 1` per scaricare solo la versione più recente dei file senza lo storico passato).*
</details>

---

## 🗺️ Navigazione Rapida

- [🌐 Portale Web & Ricerca File](https://carloj005.github.io/UNINA-INFORMATICA/)
- [Primo Anno](#primo-anno) • [Secondo Anno](#secondo-anno) • [Terzo Anno](#terzo-anno) • [Esami a Scelta](#esami-a-scelta)
- [Informazioni Generali & Mappe](#informazioni-generali) • [Come Contribuire](#come-contribuire)

---

## 📚 Dashboard Corsi (A.A. 2026/2027)

**Legenda Colonne:**
* **Materiale** *(orientamento per tutti gli studenti)*:
  * 🟢 = **Ricco / Completo** *(15+ file tra slide, appunti o prove d'esame)*
  * 🟡 = **Parziale** *(1–14 file presenti — ogni contributo è prezioso!)*
  * ⚪ = **Da popolare** *(struttura pronta ma 0 file — [aiutaci a caricare materiale!](#come-contribuire))*
* **Esame** *(tracker personale del percorso accademico dell'autore)*:
  * ✅ = **Esame Superato** • ⏳ = **In Corso / Da Sostenere**

> 💡 *Clicca sul **nome della materia** per aprire la scheda corso (CFU, SSD, Propedeuticità, Obiettivi) oppure direttamente sul **nome del docente** per entrare nella sua cartella!*

<a id="primo-anno"></a>
### 🟢 Primo Anno (Canali: C1: A-DE, C2: DF-M, C3: N-Z)

| Semestre | Materia | Canale 1 | Canale 2 | Canale 3 | Materiale | Esame |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: |
| 1° | [Architettura degli Elaboratori](./Primo%20Anno/Primo%20Semestre/Architettura%20degli%20Elaboratori) | [L. Sauro](./Primo%20Anno/Primo%20Semestre/Architettura%20degli%20Elaboratori/Prof-LuigiSauro) | [S. Rossi](./Primo%20Anno/Primo%20Semestre/Architettura%20degli%20Elaboratori/Prof-SilviaRossi) | [Da Definire](./Primo%20Anno/Primo%20Semestre/Architettura%20degli%20Elaboratori/Prof-DaDefinire) | 🟢 | ✅ |
| 1° | [Analisi Matematica I](./Primo%20Anno/Primo%20Semestre/Analisi%20Matematica%201) | [R. Alicandro](./Primo%20Anno/Primo%20Semestre/Analisi%20Matematica%201/Prof-RobertoAlicandro) / [C. Leone](./Primo%20Anno/Primo%20Semestre/Analisi%20Matematica%201/Prof-ChiaraLeone) | [D. Castorina](./Primo%20Anno/Primo%20Semestre/Analisi%20Matematica%201/Prof-DanieleCastorina) | [A.M. Barbagallo](./Primo%20Anno/Primo%20Semestre/Analisi%20Matematica%201/Prof-AnnaMariaBarbagallo) / [F. Oliva](./Primo%20Anno/Primo%20Semestre/Analisi%20Matematica%201/Prof-FrancescoOliva) | 🟢 | ✅ |
| 1° | [Programmazione 1](./Primo%20Anno/Primo%20Semestre/Programmazione%201) | [R. Prevete](./Primo%20Anno/Primo%20Semestre/Programmazione%201/Prof-RobertoPrevete) | [D. Riccio](./Primo%20Anno/Primo%20Semestre/Programmazione%201/Prof-DanielRiccio) / [L. Sauro](./Primo%20Anno/Primo%20Semestre/Programmazione%201/Prof-LuigiSauro) | [F. Isgrò](./Primo%20Anno/Primo%20Semestre/Programmazione%201/Prof-FrancescoIsgro) / [G. Laccetti](./Primo%20Anno/Primo%20Semestre/Programmazione%201/Prof-GiulianoLaccetti) | 🟡 | ✅ |
| 2° | [Algebra](./Primo%20Anno/Secondo%20Semestre/Algebra) | [M.R. Celentani](./Primo%20Anno/Secondo%20Semestre/Algebra/Prof-MariaRosariaCelentani) | [G. Cutolo](./Primo%20Anno/Secondo%20Semestre/Algebra/Prof-GiovanniCutolo) | [M. Brescia](./Primo%20Anno/Secondo%20Semestre/Algebra/Prof-MattiaBrescia) | 🟡 | ⏳ |
| 2° | [Programmazione Object Oriented](./Primo%20Anno/Secondo%20Semestre/Programmazione%20Object%20Oriented) | [S. Di Martino](./Primo%20Anno/Secondo%20Semestre/Programmazione%20Object%20Oriented/Prof-SergioDiMartino) | [P. Tramontana](./Primo%20Anno/Secondo%20Semestre/Programmazione%20Object%20Oriented/Prof-PorfirioTramontana) | [B. Breve](./Primo%20Anno/Secondo%20Semestre/Programmazione%20Object%20Oriented/Prof-BernardoBreve) / [R. Caccavale](./Primo%20Anno/Secondo%20Semestre/Programmazione%20Object%20Oriented/Prof-RiccardoCaccavale) | 🟢 | ✅ |
| 2° | [Basi di Dati](./Primo%20Anno/Secondo%20Semestre/Basi%20di%20Dati) | [M. Sangiovanni](./Primo%20Anno/Secondo%20Semestre/Basi%20di%20Dati/Prof-MaraSangiovanni) | [S. Barra](./Primo%20Anno/Secondo%20Semestre/Basi%20di%20Dati/Prof-SilvioBarra) | [A. Calì](./Primo%20Anno/Secondo%20Semestre/Basi%20di%20Dati/Prof-AndreaCali) | 🟢 | ⏳ |

<a id="secondo-anno"></a>
### 🟡 Secondo Anno (Canali: C1: A-G, C2: H-Z)

| Semestre | Materia | Canale 1 | Canale 2 | Materiale | Esame |
| :---: | :--- | :--- | :--- | :---: | :---: |
| 1° | [Analisi e Progettazione di Strutture Dati](./Secondo%20Anno/Primo%20Semestre/Analisi%20e%20Progettazione%20di%20Strutture%20Dati) | [M. Benerecetti](./Secondo%20Anno/Primo%20Semestre/Analisi%20e%20Progettazione%20di%20Strutture%20Dati/Prof-MassimoBenerecetti) | [F. Mogavero](./Secondo%20Anno/Primo%20Semestre/Analisi%20e%20Progettazione%20di%20Strutture%20Dati/Prof-FabioMogavero) | 🟢 | ✅ |
| 1° | [Elementi di Informatica Teorica](./Secondo%20Anno/Primo%20Semestre/Elementi%20di%20Informatica%20Teorica) | [A. De Luca](./Secondo%20Anno/Primo%20Semestre/Elementi%20di%20Informatica%20Teorica/Prof-AlessandroDeLuca) | A. Murano | 🟡 | ⏳ |
| 1° | [Fisica Generale I](./Secondo%20Anno/Primo%20Semestre/Fisica%20Generale%201) | [G. Chirco](./Secondo%20Anno/Primo%20Semestre/Fisica%20Generale%201/Prof-GoffredoChirco) / [G. De Rosa](./Secondo%20Anno/Primo%20Semestre/Fisica%20Generale%201/Prof-GianfrancaDeRosa) | [G. Esposito](./Secondo%20Anno/Primo%20Semestre/Fisica%20Generale%201/Prof-GiampieroEsposito) | 🟢 | ✅ |
| 1° | [Geometria](./Secondo%20Anno/Primo%20Semestre/Geometria) | [F. Cioffi](./Secondo%20Anno/Primo%20Semestre/Geometria/Prof-FrancescaCioffi) | [M. Trombetti](./Secondo%20Anno/Primo%20Semestre/Geometria/Prof-MarcoTrombetti) | 🟡 | ⏳ |
| 2° | [Sistemi Operativi](./Secondo%20Anno/Secondo%20Semestre/Sistemi%20Operativi) | [A. Finzi](./Secondo%20Anno/Secondo%20Semestre/Sistemi%20Operativi/Prof-AlbertoFinzi) | [W. Balzano](./Secondo%20Anno/Secondo%20Semestre/Sistemi%20Operativi/Prof-WalterBalzano) | 🟢 | ✅ |
| 2° | [Analisi e Progettazione di Algoritmi](./Secondo%20Anno/Secondo%20Semestre/Analisi%20e%20Progettazione%20di%20Algoritmi) | [M. Benerecetti](./Secondo%20Anno/Secondo%20Semestre/Analisi%20e%20Progettazione%20di%20Algoritmi/Prof-MassimoBenerecetti) | [F. Mogavero](./Secondo%20Anno/Secondo%20Semestre/Analisi%20e%20Progettazione%20di%20Algoritmi/Prof-FabioMogavero) | 🟡 | ⏳ |
| 2° | [Linguaggi di Programmazione 1](./Secondo%20Anno/Secondo%20Semestre/Linguaggi%20di%20Programmazione%201) | [P.A. Bonatti](./Secondo%20Anno/Secondo%20Semestre/Linguaggi%20di%20Programmazione%201/Prof-PieroAndreaBonatti) | [M. Faella](./Secondo%20Anno/Secondo%20Semestre/Linguaggi%20di%20Programmazione%201/Prof-MarcoFaella) | 🟢 | ✅ |
| 2° | [Metodi Statistici per l'Informazione](./Secondo%20Anno/Secondo%20Semestre/Metodi%20Statistici%20per%20l%27Informazione) | [M. Lops](./Secondo%20Anno/Secondo%20Semestre/Metodi%20Statistici%20per%20l%27Informazione/Prof-MarcoLops) | [M. Tanda](./Secondo%20Anno/Secondo%20Semestre/Metodi%20Statistici%20per%20l%27Informazione/Prof-MarioTanda) | 🟡 | ⏳ |

<a id="terzo-anno"></a>
### 🔴 Terzo Anno (Canali: C1: A-G, C2: H-Z)

| Semestre | Materia | Canale 1 | Canale 2 | Materiale | Esame |
| :---: | :--- | :--- | :--- | :---: | :---: |
| 1° | [Reti e Programmazione Distribuita](./Terzo%20Anno/Primo%20Semestre/Reti%20e%20Programmazione%20Distribuita) | [A. Finzi](./Terzo%20Anno/Primo%20Semestre/Reti%20e%20Programmazione%20Distribuita/Prof-AlbertoFinzi) | [A. Calì](./Terzo%20Anno/Primo%20Semestre/Reti%20e%20Programmazione%20Distribuita/Prof-AndreaCali) | 🟢 | ⏳ |
| 1° | [Ingegneria del Software](./Terzo%20Anno/Primo%20Semestre/Ingegneria%20del%20Software) | [S. Di Martino](./Terzo%20Anno/Primo%20Semestre/Ingegneria%20del%20Software/Prof-SergioDiMartino) | [P. Tramontana](./Terzo%20Anno/Primo%20Semestre/Ingegneria%20del%20Software/Prof-PorfirioTramontana) | 🟡 | ⏳ |
| 1° | [Tecnologie Web](./Terzo%20Anno/Primo%20Semestre/Tecnologie%20Web) | [L.L.L. Starace](./Terzo%20Anno/Primo%20Semestre/Tecnologie%20Web/Prof-LuigiLiberoLucioStarace) | [B. Breve](./Terzo%20Anno/Primo%20Semestre/Tecnologie%20Web/Prof-BernardoBreve) | 🟢 | ⏳ |
| 2° | [AI Technologies](./Terzo%20Anno/Secondo%20Semestre/AI%20Technologies) | [A. Corazza](./Terzo%20Anno/Secondo%20Semestre/AI%20Technologies/Prof-AnnaCorazza) | [S. Rossi](./Terzo%20Anno/Secondo%20Semestre/AI%20Technologies/Prof-SilviaRossi) | ⚪ | ⏳ |
| 2° | [Tecniche di Programmazione Avanzata](./Terzo%20Anno/Secondo%20Semestre/Tecniche%20di%20Programmazione%20Avanzata) | [M. Faella](./Terzo%20Anno/Secondo%20Semestre/Tecniche%20di%20Programmazione%20Avanzata/Prof-MarcoFaella) | [Da Definire](./Terzo%20Anno/Secondo%20Semestre/Tecniche%20di%20Programmazione%20Avanzata/Prof-DaDefinire) | ⚪ | ⏳ |

<a id="esami-a-scelta"></a>
### 🧩 Esami a Scelta (Tabella B)

| Materia | Docente di Riferimento | Materiale | Esame |
| :--- | :--- | :---: | :---: |
| **[Ricerca Operativa](./Esami%20a%20Scelta/Ricerca%20Operativa)** | [P. Festa](./Esami%20a%20Scelta/Ricerca%20Operativa/Prof-PaolaFesta) | ⚪ | ⏳ |
| **[Economia e Organizzazione Aziendale](./Esami%20a%20Scelta/Economia%20e%20Organizzazione%20Aziendale)** | [Piccirillo](./Esami%20a%20Scelta/Economia%20e%20Organizzazione%20Aziendale/Prof-Piccirillo) | 🟢 | ✅ |
| **[Algorithm Design](./Esami%20a%20Scelta/Algorithm%20Design)** | [M. Benerecetti](./Esami%20a%20Scelta/Algorithm%20Design/Prof-MassimoBenerecetti) | ⚪ | ⏳ |
| **[Parallel and Distributed Computing](./Esami%20a%20Scelta/Parallel%20and%20Distributed%20Computing)** | [M. Lapegna](./Esami%20a%20Scelta/Parallel%20and%20Distributed%20Computing/Prof-MarcoLapegna) / [G. Laccetti](./Esami%20a%20Scelta/Parallel%20and%20Distributed%20Computing/Prof-GiulianoLaccetti) | ⚪ | ⏳ |
| **[Multimedia Information Systems](./Esami%20a%20Scelta/Multimedia%20Information%20Systems)** | [W. Balzano](./Esami%20a%20Scelta/Multimedia%20Information%20Systems/Prof-WalterBalzano) | 🟢 | ⏳ |
| **[Calcolo Numerico](./Esami%20a%20Scelta/Calcolo%20Numerico)** | [L. D'Amore](./Esami%20a%20Scelta/Calcolo%20Numerico/Prof-LuisaDAmore) | ⚪ | ⏳ |
| **[Computer Forensics](./Esami%20a%20Scelta/Computer%20Forensics)** | [L. Laurato](./Esami%20a%20Scelta/Computer%20Forensics/Prof-LorenzoLaurato) | ⚪ | ⏳ |
| **[Diritto dell'Informatica](./Esami%20a%20Scelta/Diritto%20dell%27Informatica)** | [L. Franzese](./Esami%20a%20Scelta/Diritto%20dell%27Informatica/Prof-LucioFranzese) | ⚪ | ⏳ |
| **[Istituzioni di Matematica II](./Esami%20a%20Scelta/Istituzioni%20di%20Matematica%20II)** | [Da Definire](./Esami%20a%20Scelta/Istituzioni%20di%20Matematica%20II/Prof-DaDefinire) | ⚪ | ⏳ |
| **[Logics for Computer Science](./Esami%20a%20Scelta/Logics%20for%20Computer%20Science)** | [M. Benerecetti](./Esami%20a%20Scelta/Logics%20for%20Computer%20Science/Prof-MassimoBenerecetti) | ⚪ | ⏳ |
| **[Operating Systems for Mobile, Cloud and IoT](./Esami%20a%20Scelta/Operating%20Systems%20for%20Mobile%2C%20Cloud%20and%20IoT)** | [P. Tramontana](./Esami%20a%20Scelta/Operating%20Systems%20for%20Mobile%2C%20Cloud%20and%20IoT/Prof-PorfirioTramontana) | ⚪ | ⏳ |
| **[Scientific Computing](./Esami%20a%20Scelta/Scientific%20Computing)** | [E. Messina](./Esami%20a%20Scelta/Scientific%20Computing/Prof-EleonoraMessina) | ⚪ | ⏳ |

---

<a id="informazioni-generali"></a>
## ℹ️ Informazioni Generali

Nella cartella [**info-generali**](./info-generali) puoi trovare:
- [**Guida Completa ai Vantaggi di GitHub Education & Student Pack**](./info-generali/guida-github-education.md) 🎓 *(Copilot, JetBrains, Azure, crediti cloud e guida passo-passo con mail `@studenti.unina.it`)*
- **Guide dello Studente:** [A.A. 2026/2027](./info-generali/GuidaTriennaleInformatica-26-27.pdf) • [A.A. 2025/2026](./info-generali/GuidaTriennaleInformatica-25-26.pdf) • [A.A. 2024/2025](./info-generali/GuidaTriennaleInformatica-24-25.pdf)
- [**Orario delle Lezioni 2026/2027 (1°, 2° e 3° Anno)**](./info-generali/Orario%20Lezioni%202026-2027.pdf)
- [Script di automazione e audit](./info-generali/scripts) e generatore del [Portale Web](./info-generali/web)
- Mappe dei Complessi Universitari (Monte Sant'Angelo e Via Claudio)

### 🗺️ Mappa di Monte Sant'Angelo
![Mappa Monte Sant'Angelo](./info-generali/MappaMSA.png)

### 🗺️ Mappa di Via Claudio
![Mappa Via Claudio](./info-generali/MappaViaClaudio.jpg)

---

<a id="struttura-della-repository"></a>
## 🛠️ Struttura della Repository

Ogni corso è organizzato rigorosamente seguendo questo schema (verificato in automatico via GitHub Actions su ogni Pull Request):
```text
Nome Corso/
├── Prof-NomeCognome/          # Materiale suddiviso per docente (CamelCase ASCII, senza spazi/accenti)
│   ├── slides/                # Presentazioni ufficiali del corso
│   ├── appunti/               # Sbobine, riassunti e appunti personali
│   ├── esercizi/              # Esercitazioni pratiche e compiti
│   ├── progetti/              # Codice e relazioni per prove pratiche
│   ├── esami/                 # Divisi in "scritto" e "orale" (tracce, soluzioni, domande)
│   │   ├── scritto/
│   │   └── orale/
│   ├── libri/                 # Libri di testo di riferimento
│   ├── contenuto-non-proprio/ # Materiale raccolto da altri studenti (con crediti.txt obbligatorio)
│   └── README.md              # Scheda canale docente e Codice Teams 2026/2027
└── README.md                  # Info ufficiali del corso (CFU, SSD, Propedeuticità, Obiettivi)
```

---

<a id="come-contribuire"></a>
## 🤝 Come Contribuire

Hai vecchie tracce, un **Codice Teams 2026/2027** mancante, appunti ben scritti o correzioni da suggerire? Il contributo di tutti è benvenuto!

### 🛠️ 1. Proporre file o modifiche con una Pull Request (PR)
1. **Fai un Fork**: Clicca sul tasto **Fork** in alto a destra su GitHub.
2. **Carica i file**: Naviga nella cartella corretta rispettando la [struttura della repository](#struttura-della-repository) (usa `Prof-NomeCognome` in CamelCase senza spazi).
   - *Nota*: Se il materiale non è tuo, inseriscilo in `contenuto-non-proprio/` e aggiungi/aggiorna il file `crediti.txt` per ringraziare l'autore originale.
3. **Apri la Pull Request**: Un controllo automatico verificherà struttura e link prima dell'approvazione!

### 💬 2. Segnalare Codici Teams, errori o richiedere materiale con le Issues & Discussions
- [**Segnala un Codice Teams 2026/2027**](https://github.com/Carloj005/UNINA-INFORMATICA/issues/new?template=codice_teams.yml)
- [**Richiedi o condividi tracce/materiale**](https://github.com/Carloj005/UNINA-INFORMATICA/issues/new?template=richiesta_o_materiale.yml)
- [**Segnala un errore negli appunti**](https://github.com/Carloj005/UNINA-INFORMATICA/issues/new?template=segnalazione_errore.yml)
- [**Partecipa alle GitHub Discussions**](https://github.com/Carloj005/UNINA-INFORMATICA/discussions) per domande generali sui corsi o confronto tra colleghi!

---

## ⚖️ Licenza

Questo materiale è distribuito sotto licenza **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)**.  
Consultare il file [LICENSE](./LICENSE) per i dettagli.
