---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezione 02: Internet, Protocolli e Modelli a Livelli

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Internet: Visione Strutturale ("Nuts and Bolts")

Da una prospettiva puramente infrastrutturale e di componenti fisici:

- **Miliardi di dispositivi di calcolo connessi**:
  - Chiamati **Host** o **End Systems** (sistemi periferici).
  - Eseguono applicazioni di rete alla periferia (*edge*) della rete.
- **Dispositivi di commutazione di pacchetto (*Packet Switches*)**:
  - Inoltrano pacchetti (blocchi discreti di dati): **Router** e **Switch**.
- **Collegamenti di comunicazione (*Communication Links*)**:
  - Fibra ottica, cavi in rame, onde radio, satelliti; ciascuno caratterizzato da una velocità di trasmissione (*Transmission rate* / banda).
- **Reti di Reti (*Network of Networks*)**:
  - ISP locali, regionali, nazionali e globali interconnessi tra loro.

---

## Eterogeneità dei Dispositivi Connessi

Oggi Internet connette qualsiasi tipo di dispositivo intelligente (*Smart Device*):
- Computer, laptop, workstation, server da data center
- Smartphone, tablet, smartwatch
- Dispositivi medici (pacemaker e monitor cardiaci connessi)
- Sensori ambientali, contatori intelligenti (*smart grid*), elettrodomestici IoT
- Autovetture connesse e sistemi industriali cyber-fisici

---

## Internet: Visione Orientata ai Servizi (*Services View*)

Da una prospettiva applicativa e orientata all'utente:

- Internet è un'**infrastruttura che fornisce servizi** alle applicazioni distribuite:
  - Web, streaming multimediale, commercio elettronico, posta elettronica, videoconferenze, cloud computing, social network, intelligenza artificiale distribuita.
- **Interfaccia di programmazione per le applicazioni (*API / Socket*)**:
  - Fornisce un'interfaccia standard attraverso cui i programmi in esecuzione su host diversi possono comunicare e scambiarsi messaggi, analogamente al servizio postale.

---

## Che cos'è un Protocollo?

> Un **protocollo di rete** definisce il **formato**, l'**ordine** dei messaggi scambiati tra due o più entità comunicanti, e le **azioni** intraprese alla trasmissione e/o ricezione di un messaggio o di un evento.

### Analogia con i protocolli umani:
- *"Ciao!"* → Attesa di saluto → *"Ciao!"* → *"Che ore sono?"* → *"Sono le 12:00"*.
- Modello di comunicazione di Jakobson: mittente, destinatario, messaggio, codice condiviso, canale, contesto.

---

## Protocolli Umani vs Protocolli di Rete

- **Protocollo Umano**:
  - Utente 1: *"Hai l'ora?"*
  - Utente 2: *"Sì, sono le 12:30"* (oppure silenzio / incomprensione).
- **Protocollo di Rete (es. Connessione TCP)**:
  - Client: Invia richiesta di connessione (`TCP SYN`)
  - Server: Risponde con conferma (`TCP SYNACK`)
  - Client: Invia richiesta risorsa (`GET http://...`)
  - Server: Restituisce il contenuto richiesto (`HTTP 200 OK + File`)

Tutta l'attività di comunicazione in Internet è governata da protocolli.

---

## La Necessità di Standard e Protocolli

- Nelle reti moderne comunicano dispositivi e sistemi operativi **completamente eterogenei**:
  - Architetture hardware diverse (x86, ARM, RISC-V)
  - Sistemi operativi diversi (Linux, Windows, macOS, Android, iOS)
  - Produttori hardware differenti
- **Senza standard condivisi**, l'interoperabilità globale sarebbe impossibile.
- Gli standard stabiliscono regole aperte, pubbliche e non proprietarie per la trasmissione, codifica e gestione degli errori.

---

## Chi Definisce gli Standard di Internet?

Gli standard di Internet non sono governati da una singola nazione o azienda, ma da organizzazioni internazionali aperte:

- **IETF (*Internet Engineering Task Force*)**:
  - Definisce i protocolli centrali di Internet (IP, TCP, UDP, HTTP, DNS, TLS).
  - I documenti ufficiali sono le **RFC (*Request for Comments*)**.
- **W3C (*World Wide Web Consortium*)**:
  - Standard per il Web (HTML, CSS, XML).
- **IEEE (*Institute of Electrical and Electronics Engineers*)**:
  - Standard fisici e di collegamento (IEEE 802.3 Ethernet, IEEE 802.11 Wi-Fi).
- **ITU-T**: standard per le telecomunicazioni.
- **ISO (*International Organization for Standardization*)**: creatori del modello di riferimento OSI.

---

## Gestire la Complessità: I Modelli Architetturali

- Le reti di calcolatori sono sistemi **estremamente complessi**:
  - Miliardi di host, tecnologie eterogenee, hardware e software differenti, routing distribuito, gestione degli errori, sicurezza.
- Per gestire tale complessità si applica il principio classico dell'informatica:  
  **Divide et Impera (Scomposizione Modulare)**.
- Il sistema viene organizzato in una **struttura a livelli gerarchici (*Layered Architecture*)**.

---

## L'Approccio a Livelli (*Layering*)

In un'architettura a livelli:
- Ogni **livello (*Layer*)** implementa un insieme specifico di funzionalità correlate.
- Ogni livello si appoggia ai **servizi offerti dal livello sottostante**.
- Ogni livello offre i propri **servizi al livello immediatamente superiore**, nascondendo i dettagli implementativi interni (*information hiding* e astrazione).
- **Interfaccia di livello (*Layer Interface*)**: definisce le operazioni e le primitive con cui un livello superiore può richiedere servizi al sottostante.

---

## Analogia Quotidiana dell'Architettura a Livelli

L'organizzazione a livelli non è un'esclusiva delle reti:
- **Spedizione di una lettera**:
  1. *Scrittura del messaggio* (Livello Applicazione)
  2. *Inserimento in busta e affrancatura* (Livello Presentazione/Imballo)
  3. *Consegna alla cassetta postale* (Livello Interfaccia Locale)
  4. *Smistamento tra centri postali* (Livello Instradamento / Routing)
  5. *Trasporto su camion/treno/aereo* (Livello Fisico)
- Modificare il mezzo di trasporto (da treno a camion) **non cambia** la lettera né l'indirizzo sulla busta.

---

## Vantaggi e Svantaggi del Layering

### Vantaggi:
- **Modularità e Manutenibilità**: facilità di aggiornare o sostituire l'implementazione di un livello senza toccare gli altri (es. passare da Wi-Fi a cavo Ethernet non richiede modifiche al browser web o a TCP).
- **Interoperabilità**: produttori diversi possono sviluppare componenti per lo stesso livello.
- **Semplicità concettuale**: scomposizione di un problema enorme in compiti ben definiti.

### Svantaggi:
- **Overhead**: duplicazione potenziale di funzioni (es. controllo errori sia al livello 2 che al livello 4) e intestazioni aggiuntive (*headers*).
- **Possibile perdita di efficienza**: un livello non conosce direttamente lo stato interno dei livelli inferiori (*cross-layer optimization* limitata).

---

## Servizi e Primitive di Servizio (*Services & Primitives*)

- Un **Servizio** specifica **cosa** un livello fa per quello superiore, mai **come** lo realizza.
- Un **Protocollo** specifica le regole di scambio messaggi tra entità paritetiche (*peer entities*) per fornire quel servizio.
- Le operazioni offerte da un livello a quello superiore sono chiamate **Primitive di Servizio**:
  - `LISTEN`, `CONNECT`, `ACCEPT`, `RECEIVE`, `SEND`, `DISCONNECT`.
- Le entità allo stesso livello su host diversi si scambiano unità dati chiamate **PDU (*Protocol Data Unit*)**.

---

## Comunicazione Virtuale vs Comunicazione Reale

- **Comunicazione Orizzontale (Logica / Virtuale)**:
  - Il livello $N$ del mittente comunica concettualmente con il livello $N$ del destinatario secondo il protocollo di livello $N$.
- **Comunicazione Verticale (Fisica / Reale)**:
  - I dati scendono lungo lo stack dal livello superiore a quello inferiore sul mittente, attraversano il mezzo fisico, e risalgono lo stack sul ricevitore.

---

## Tipi di Servizio: Connessione e Affidabilità

I servizi di comunicazione si distinguono secondo due dimensioni ortogonali:

1. **Orientato alla Connessione (*Connection-Oriented*)**:
   - Ispirato al sistema telefonico: richiede 3 fasi:
     1. Instaurazione della connessione (*Setup*)
     2. Trasferimento dati
     3. Abbattimento della connessione (*Teardown*)
   - Mantiene lo stato della sessione (es. TCP).

2. **Senza Connessione (*Connectionless*)**:
   - Ispirato al sistema postale: ogni messaggio (*datagramma*) è indipendente e contiene l'indirizzo di destinazione completo.
   - Nessuna fase di configurazione preventiva (es. UDP, IP).

---

## Il Concetto di Affidabilità (*Reliability*)

- Un **servizio affidabile** garantisce che tutti i dati inviati vengano recapitati al destinatario:
  - Senza perdite di pacchetti
  - Senza duplicazioni
  - Senza errori nei dati
  - Mantenendo l'ordine corretto di invio (*in-order delivery*)
- Si ottiene mediante **conferme di ricezione (*Acknowledgements - ACK*)**, numeri di sequenza e **ritrasmissioni con timeout**.

> **Perché a volte si rinuncia all'affidabilità?**  
> L'affidabilità comporta **ritardo (latenza)** e **overhead**. Per applicazioni real-time (streaming voce/video, gaming online), perdere qualche pacchetto è preferibile a subire pause e ritardi di ritrasmissione.

---

## Le 6 Combinazioni Classiche di Servizio

| Tipo di Servizio | Caratteristiche | Esempio Tipico |
| :--- | :--- | :--- |
| **Flusso di byte affidabile** | Orientato alla conn., affidabile | Download file, Web (TCP / HTTP) |
| **Sequenza di record affidabile**| Orientato alla conn., affidabile | Trasmissione pagine/frame |
| **Connessione non affidabile** | Orientato alla conn., non affidabile| Streaming voce digitalizzata |
| **Datagramma non affidabile** | Senza connessione, best-effort | Richieste DNS, streaming veloce (UDP)|
| **Datagramma con riscontro** | Senza conn., conferma ricevuta | Ricevuta di ritorno (SMS registrati)|
| **Richiesta-Risposta (*Req-Rep*)**| Senza conn., atomico | Query rapida database |

---

## Il Modello di Riferimento ISO/OSI

Negli anni '80 la **ISO (*International Organization for Standardization*)** definì il modello **OSI (*Open Systems Interconnection*)**:
- Architettura a **7 Livelli ben distinti**:
  7. **Applicazione (*Application*)**
  6. **Presentazione (*Presentation*)**
  5. **Sessione (*Session*)**
  4. **Trasporto (*Transport*)**
  3. **Rete (*Network*)**
  2. **Collegamento Dati (*Data Link*)**
  1. **Fisico (*Physical*)**

---

## Dispositivi e Livelli Operativi

Non tutti i dispositivi di rete implementano l'intero stack a 7 livelli:
- **Host (End Systems)**: implementano tutti e 7 i livelli.
- **Router**: operano fino al **Livello 3 (Rete)**.
- **Switch**: operano fino al **Livello 2 (Data Link)**.
- **Hub / Ripetitori fisici**: operano al **Livello 1 (Fisico)**.

I dispositivi intermedi analizzano solo le intestazioni necessarie per instradare o inoltrare il dato al nodo successivo.

---

## Il Meccanismo dell'Incapsulamento (*Encapsulation*)

La trasmissione dati dall'alto verso il basso segue il principio dell'**incapsulamento**:
1. L'Applicazione genera il messaggio $M$ (o dati utente).
2. Il livello di **Trasporto** aggiunge un'intestazione (*Header* $H_t$) → **Segmento** (TCP) o Datagramma (UDP).
3. Il livello di **Rete** aggiunge l'intestazione $H_n$ (con IP sorgente e destinazione) → **Pacchetto / Datagramma IP**.
4. Il livello di **Collegamento** aggiunge l'intestazione $H_l$ e un trailer di controllo $T_l$ (es. CRC) → **Frame**.
5. Il livello **Fisico** converte il frame in una sequenza di **Bit** e li trasmette sul canale.

Al ricevitore avviene il processo inverso: **Decapsulamento** (*Decapsulation*).

---

## I 7 Livelli OSI: 1. Livello Fisico (*Physical Layer*)

- **Responsabilità**: trasmissione e ricezione di **singoli bit grezzi** sul canale di comunicazione fisico.
- Definisce le caratteristiche meccaniche, elettriche, ottiche e funzionali:
  - Livelli di tensione per rappresentare 0 e 1
  - Durata del bit in microsecondi
  - Connettori, cavi, pin, frequenze wireless
- **Unità Dati**: Bit.

---

## I 7 Livelli OSI: 2. Collegamento Dati (*Data Link Layer*)

- **Responsabilità**: trasferimento affidabile di dati tra due nodi **direttamente adiacenti** sullo stesso collegamento fisico (*node-to-node delivery*).
- Funzionalità chiave:
  - **Framing**: suddivisione del flusso di bit in frame delimitati.
  - **Indirizzamento fisico**: indirizzi MAC (es. scheda Ethernet/Wi-Fi).
  - **Controllo di flusso**: evita che il mittente inondi il ricevente locale.
  - **Rilevamento e correzione errori**: codice di ridondanza ciclica (CRC).
  - **Controllo di accesso al mezzo (MAC)** su canali condivisi.
- **Unità Dati**: Frame.

---

## I 7 Livelli OSI: 3. Livello di Rete (*Network Layer*)

- **Responsabilità**: consegna dei pacchetti dall'host sorgente all'host di destinazione attraverso reti multiple e router intermedi (**consegna host-to-host end-to-end**).
- Funzionalità chiave:
  - **Indirizzamento logico globale**: indirizzi IP (IPv4 e IPv6).
  - **Routing (Instradamento)**: determinazione del percorso ottimale attraverso la rete tramite algoritmi di routing.
  - **Forwarding (Inoltro)**: trasferimento di un pacchetto dall'interfaccia di ingresso a quella di uscita del router.
  - Frammentazione e riassemblaggio di pacchetti troppo grandi.
- **Unità Dati**: Pacchetto / Datagramma.

---

## I 7 Livelli OSI: 4. Livello di Trasporto (*Transport Layer*)

- **Responsabilità**: consegna affidabile e controllo del flusso dei dati tra **processi applicativi specifici** in esecuzione sugli host (**consegna process-to-process**).
- Funzionalità chiave:
  - **Indirizzamento dei processi**: porte logiche (*Port Numbers*, es. porta 80 per HTTP, 443 per HTTPS).
  - Segmentazione e riassemblaggio dei messaggi applicativi lunghi.
  - Gestione della connessione (apertura, mantenimento, chiusura).
  - Controllo di flusso end-to-end e controllo di congestione di rete.
- **Protocolli principali**: TCP (affidabile, orientato alla connessione) e UDP (non affidabile, connectionless).
- **Unità Dati**: Segmento (TCP) o Datagramma (UDP).

---

## I 7 Livelli OSI: 5. Livello di Sessione (*Session Layer*)

- **Responsabilità**: gestione del dialogo, instaurazione, sincronizzazione e terminazione delle sessioni di comunicazione tra applicazioni.
- Funzionalità:
  - Controllo del turno di parola (*dialog control*, simplex, half o full-duplex).
  - **Sincronizzazione**: inserimento di punti di controllo (*checkpoints*) per consentire la ripresa del trasferimento dati in caso di interruzione senza ripartire da zero.

---

## I 7 Livelli OSI: 6. Livello di Presentazione (*Presentation Layer*)

- **Responsabilità**: sintassi e semantica delle informazioni scambiate tra sistemi eterogenei.
- Funzionalità chiave:
  - **Traduzione e codifica**: interoperabilità tra formati dati diversi (es. ASCII, Unicode, Big-Endian vs Little-Endian).
  - **Crittografia**: cifratura e decifratura per la riservatezza dei dati.
  - **Compressione**: riduzione del numero di bit da trasmettere.

---

## I 7 Livelli OSI: 7. Livello di Applicazione (*Application Layer*)

- **Responsabilità**: fornisce servizi di rete direttamente agli utenti finali e alle applicazioni software.
- È il livello più alto: qui risiedono i protocolli che supportano le applicazioni umane:
  - Web: **HTTP / HTTPS**
  - Posta elettronica: **SMTP, IMAP, POP3**
  - Trasferimento file: **FTP, SFTP**
  - Risoluzione dei nomi: **DNS**
  - Accesso remoto sicuro: **SSH**
- **Unità Dati**: Messaggio.

---

## Critica al Modello OSI: Perché Non Si È Affermato?

Il modello OSI è un punto di riferimento teorico eccellente, ma i suoi protocolli reali hanno fallito commercialmente per 4 motivi principali (*I 4 mali di Tanenbaum*):

1. **Tempismo Sbagliato (*Bad Timing*)**:  
   Quando gli standard OSI furono completati, i protocolli TCP/IP erano già ampiamente diffusi, funzionanti e testati sul campo. (*Teoria dei due elefanti*).
2. **Tecnologia Cattiva (*Bad Technology*)**:  
   I livelli di Sessione e Presentazione erano quasi vuoti, mentre Rete e Data Link erano sovraccarichi. Funzionalità come il controllo errori erano duplicate ovunque.
3. **Implementazioni Scadenti (*Bad Implementation*)**:  
   I primi software OSI erano lenti, pesanti e difficili da configurare rispetto alla snella implementazione BSD UNIX di TCP/IP.
4. **Politica Sbagliata (*Bad Politics*)**:  
   Percepito come uno standard burocratico calato dall'alto da comitati governativi e monopoli telefonici europei, contro la filosofia pratica di Internet (*"Rough consensus and running code"*).

---

## Il Modello TCP/IP (Architettura Reale di Internet)

Il modello **TCP/IP** (nato dal progetto ARPANET/DoD) è l'architettura concreta su cui si basa l'intera rete Internet mondiale.  
Viene comunemente descritto a **4 livelli**:

1. **Applicazione (*Application*)**: unifica i livelli OSI 5, 6 e 7 (HTTP, DNS, SMTP, SSH).
2. **Trasporto (*Transport*)**: comunicazione end-to-end tra processi (TCP, UDP).
3. **Internet (*Internet / Network*)**: instradamento globale dei pacchetti senza connessione (protocollo IP, ICMP, ARP).
4. **Accesso alla Rete (*Network Access / Link*)**: unifica il livello fisico e data link per trasmettere i frame sul mezzo reale (Ethernet, Wi-Fi, fibra).

---

## Modello a 5 Livelli Utilizzato nel Corso

Nel testo di riferimento (Kurose-Ross) e in questo corso viene adottato il **Modello a 5 Livelli di Internet**:

```
5. Livello di Applicazione (Application Layer)
4. Livello di Trasporto (Transport Layer)
3. Livello di Rete (Network Layer)
2. Livello di Collegamento (Link Layer)
1. Livello Fisico (Physical Layer)
```

- I compiti di presentazione e sessione (crittografia TLS, formattazione JSON/XML, cookie) sono gestiti direttamente dagli sviluppatori all'interno del **Livello Applicativo**.

---

## Confronto Diretto: ISO/OSI vs TCP/IP

| Aspetto | Modello ISO/OSI | Modello TCP/IP |
| :--- | :--- | :--- |
| **Numero di Livelli** | 7 livelli | 4 o 5 livelli |
| **Distinzione Concettuale** | Chiara distinzione tra servizi, interfacce e protocolli | Protocolli nati prima del modello formale |
| **Approccio Progettuale** | Teorico, accademico, top-down | Pragmatico, orientato al software funzionante |
| **Livello di Rete** | Supporta sia connectionless sia connection-oriented | Rigidamente connectionless (IP) |
| **Livello di Trasporto** | Solo connection-oriented | Sia connection-oriented (TCP) sia connectionless (UDP) |
| **Diffusione Pratica** | Modello didattico di riferimento | Standard de facto dominante in tutto il mondo |

---

## Sintesi della Lezione

- Un'applicazione complessa che attraversa il pianeta non può essere progettata come un unico blocco monolitico.
- **L'architettura a livelli** scompone il problema:
  - L'**Applicazione** pensa all'interazione tra utenti e dati.
  - Il **Trasporto** pensa alla consegna tra processi e all'affidabilità.
  - La **Rete** pensa a trovare il cammino globale tra mittente e destinatario.
  - Il **Collegamento** pensa a recapitare il pacchetto al nodo fisicamente successivo.
  - Il **Fisico** converte i bit in onde elettromagnetiche, impulsi luminosi o tensioni.
- Da questa lezione in avanti analizzeremo i singoli livelli con l'approccio **Top-Down**, partendo dal Livello di Applicazione!
