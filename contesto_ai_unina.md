# Contesto AI - Progetto UNINA-INFORMATICA

Questo documento contiene tutto il contesto, le regole e la cronologia della conversazione precedente per ripristinare operatività su questa macchina dopo un reset. Il tuo compito è assistere l'utente nella gestione della repository GitHub **UNINA-INFORMATICA**.

## 1. Informazioni sulla Repository
- **Posizione locale (attesa):** `/home/clay-thinkpad/Documents/UNINA-INFORMATICA` (o `/home/clay/Documents/UNINA-INFORMATICA`)
- **Obiettivo:** Raccogliere, organizzare e mantenere il materiale didattico (appunti, slide, esami) del Corso di Laurea Triennale in Informatica alla Federico II (iniziato A.A. 2024-2025).
- **GitHub CLI (`gh`):** Viene utilizzato intensivamente per controllare le Pull Request, commentarle e unirle (`gh pr list`, `gh pr diff`, `gh pr comment`, `gh pr merge`).

## 2. Regole di Struttura (FONDAMENTALI)
Ogni corso *deve* seguire rigorosamente questo path e questa alberatura:
`[Anno]/[Semestre]/[Corso]/Prof-[NomeCognome]/`
Le sottocartelle obbligatorie per ogni docente sono:
- `slides/` (Presentazioni del prof)
- `appunti/` (Sbobine e riassunti)
- `esercizi/` (Esercitazioni pratiche)
- `progetti/` (Codice e prove pratiche)
- `esami/` (Spesso divisa in `esami/scritto/` e `esami/orale/`)
- `libri/` (Libri di testo in PDF)
- `contenuto-non-proprio/` (Materiale di altri autori. **Regola d'oro:** In questa cartella deve SEMPRE esserci un file `crediti.txt` per ringraziare e citare la fonte/autore).

## 3. Gestione Git e GitHub
- **Git LFS:** È configurato per tracciare file `.pdf` e `.docx`. Attenzione ai file superiori ai 100MB.
- **Flusso di lavoro:** Tutte le modifiche locali vengono committate e pushate regolarmente (`git add .`, `git commit -m "..."`, `git pull`, `git push`). 
- **Gestione PR:** Quando un utente fa una Pull Request, va analizzata per assicurarsi che i file siano nelle cartelle giuste. Se lo sono, si accetta la PR, si lascia un commento di ringraziamento, si fa `git pull` localmente e si sistemano eventuali dettagli (es. aggiungere `crediti.txt` mancanti).

## 4. Aggiornamenti del README.md
Il `README.md` principale fa da Hub. Include:
- Mappa di Monte Sant'Angelo.
- Form di Valutazione Materiale: Abbiamo inserito un link a un Google Form (generato tramite Google Apps Script) che gli studenti usano per recensire anonimamente (da 1 a 5) il materiale per ogni specifica combinazione "Corso - Professore".
- Dashboard dei Corsi: Usa le icone ✅ (Esame Superato/Materiale consolidato) e ⏳ (In Corso/Materiale in fase di studio).

## 5. Cronologia Recente e Lore
- Abbiamo riordinato radicalmente gli esami a scelta, inserendoli nella root directory `Esami a Scelta/`.
- Abbiamo organizzato il corso di "Multimedia Information Systems" del prof. Walter Balzano, pulendo i nomi dei file ed eliminando copie esatte (verificate tramite hash SHA-1 dei blob di git).
- Abbiamo gestito due Pull Request (una per Algebra e una per Geometria), verificando la correttezza, accettandole tramite command line e sistemando localmente eventuali sviste (spostando prove scritte/orali nelle sottocartelle corrette e aggiungendo i file `crediti.txt`).
- Abbiamo gestito la Pull Request #15 (Linguaggi di Programmazione 1 - Bonatti, Guida Prolog di Giuseppe Cautiero), accettandola, commentandola, standardizzando il file dei crediti in `crediti.txt`, configurando `gh auth` e sincronizzando la repo.

## Istruzioni per la prima esecuzione (Dopo il reset)
1. Fai ricollegare all'utente l'account GitHub tramite `gh auth login`.
2. Assicurati che `git lfs install` sia stato eseguito.
3. Fai ricaricare la repository in `/home/clay-thinkpad/Documents/UNINA-INFORMATICA` se non è già presente (`git clone`).
4. Da questo momento, sei pronto a ricevere le nuove richieste dell'utente comportandoti come se la conversazione non si fosse mai interrotta!
