---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezione 14: Il Livello di Trasporto
### Comunicazione Process-to-Process, Porte, Multiplexing/Demultiplexing e Protocollo UDP

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Dal Livello di Applicazione al Livello di Trasporto

- Nelle lezioni di laboratorio abbiamo utilizzato le **Socket API**:
  - `bind()` associa una socket a un indirizzo IP e a una porta locale.
  - `connect()` identifica l'endpoint remoto a cui connettersi.
  - `accept()` estrae una connessione TCP in ingresso restituendo una nuova socket dedicata.
- **Cosa avviene al di sotto del socket?**
  - Come fa un segmento o datagramma in arrivo dalla scheda di rete a raggiungere la specifica socket dell'applicazione corretta?
- Il **Livello di Trasporto** fornisce:
  1. **Multiplexing e Demultiplexing**: instradamento dei dati verso la socket corretta.
  2. **Servizi di trasporto differenti**: non orientato alla connessione (*UDP*) vs affidabile e orientato alla connessione (*TCP*).
  3. **Interazione con il livello di Rete (IP)**: incapsulamento ed estrazione dei segmenti.

---

## Comunicazione Logica End-to-End

- Il livello di trasporto stabilisce una **comunicazione logica** tra processi applicativi residenti su host differenti.
- Dal punto di vista delle applicazioni, gli host appaiono direttamente collegati come se risiedessero sulla stessa macchina locale:

```text
+-------------------------------------------------------------+
|                  Livello Applicativo (Processi)             |
+-------------------------------------------------------------+
                               |  (Messaggi applicativi)
                               v
+-------------------------------------------------------------+
|              Livello di Trasporto (TCP / UDP)               | <--- Comunicazione Logica
+-------------------------------------------------------------+      Process-to-Process
                               |  (Segmenti / Datagrammi)
                               v
+-------------------------------------------------------------+
|                 Livello di Rete (IP - Router)               | <--- Comunicazione
+-------------------------------------------------------------+      Host-to-Host
```

- **Lato Trasmittente:** converte i messaggi/stream applicativi in unità di trasporto (*segmenti* per TCP, *datagrammi* per UDP), appone l'header di trasporto e li passa al livello di rete.
- **Lato Ricevente:** estrae il payload dai pacchetti IP, verifica l'integrità e recapita i dati alla socket appropriata.

---

## Differenza Fondamentale: Trasporto vs Rete

| Livello | Ambito (*Scope*) | Unità Dati | Dispositivi Coinvolti |
| :--- | :--- | :--- | :--- |
| **Livello di Trasporto** | **Process-to-Process** | Segmento / Datagramma | Esclusivamente gli **Host terminali (*End Systems*)** |
| **Livello di Rete (IP)** | **Host-to-Host** | Datagramma IP / Pacchetto | Host terminali + **Router intermedi** |

- I router intermedi lungo il cammino di rete esaminano unicamente gli header fino al livello 3 (Rete/IP).
- I router sono **del tutto trasparenti** agli header di trasporto: la gestione di connessione, numeri di sequenza e porte risiede unicamente negli host mittente e destinatario (**Principio End-to-End**).
- *Attenzione alla terminologia:*
  - La **segmentazione TCP** (suddivisione dello stream applicativo in segmenti MSS) e la **frammentazione IP** (suddivisione dei pacchetti per rispettare la MTU del link) sono meccanismi distinti operanti a livelli differenti!

---

## Process-to-Process Delivery e Porte

- Su un singolo sistema operativo possono essere attivi contemporaneamente decine di processi che accedono alla rete (browser, client Spotify, download SSH, server web).
- Per distinguere le diverse sorgenti e destinazioni applicative all'interno dello stesso host, i protocolli di trasporto utilizzano i **Numeri di Porta** (interi senza segno a 16 bit, da `0` a `65535`):

```text
+----------------------+--------------------+------------------------------------------+
| Tipologia            | Intervallo Porte   | Utilizzo Tipico                          |
+----------------------+--------------------+------------------------------------------+
| Well-Known Ports     | 0 - 1023           | Servizi di sistema standard e privilegiati|
|                      |                    | (HTTP 80, HTTPS 443, SSH 22, DNS 53, ...) |
+----------------------+--------------------+------------------------------------------+
| Registered Ports     | 1024 - 49151       | Registrate presso IANA da applicazioni    |
|                      |                    | terze (MySQL 3306, PostgreSQL 5432, ...) |
+----------------------+--------------------+------------------------------------------+
| Dynamic / Ephemeral  | 49152 - 65535      | Assegnate temporaneamente dal kernel OS  |
|                      |                    | ai client per le connessioni in uscita   |
+----------------------+--------------------+------------------------------------------+
```

---

## Ispezione delle Porte di Rete: `nmap`, `ss` e `netstat`

- Su Linux possiamo verificare le porte su cui i servizi locali sono in ascolto o scansionare un host remoto tramite **Nmap** (*Network Mapper*):

```bash
# Scansione delle 1000 porte TCP più comuni su un target
$ nmap scanme.nmap.org

# Scansione rapida delle 10 porte principali
$ nmap --top-ports 10 scanme.nmap.org

# Scansione di porte specifiche (SSH, HTTP, HTTPS)
$ nmap -p 22,80,443 scanme.nmap.org

# Service Version Detection (rileva software e versione in ascolto)
$ nmap -sV -p 22,80 scanme.nmap.org

# Visualizzare le socket in ascolto sulla macchina locale (con processi associati)
$ ss -tulnp
```

- Output tipico di Nmap:
  - `PORT 22/tcp OPEN ssh OpenSSH 8.9p1`
  - `PORT 80/tcp OPEN http Apache httpd 2.4.52`

---

## Meccanismo di Multiplexing e Demultiplexing

```text
   [ Processo P1 ] (Porta 46428)         [ Processo P2 ] (Porta 51234)
            \                                   /
             \                                 /
       [ Socket 1 ]                      [ Socket 2 ]
              \                             /
        =======v===========================v=======
        |  MULTIPLEXING (Host Trasmittente):      |
        |  Raccoglie i dati dai socket, aggiunge   |
        |  l'header di trasporto (porte) e passa   |
        |  i segmenti al livello IP               |
        ===========================================
                            |
                     (Rete Internet)
                            |
        ===========================================
        |  DEMULTIPLEXING (Host Ricevente):       |
        |  Esamina i campi dell'header di         |
        |  trasporto e recapita i dati alla        |
        |  socket corretta                        |
        =======^===========================^=======
              /                             \
       [ Socket Dest 1 ]              [ Socket Dest 2 ]
             /                               \
   [ Processo Ricevente A ]         [ Processo Ricevente B ]
```

---

## Demultiplexing Non Orientato alla Connessione (UDP)

- Una socket UDP è identificata unicamente da una **coppia a due elementi**:
  - `(Indirizzo IP di Destinazione, Numero di Porta di Destinazione)`
- Quando un host riceve un datagramma UDP:
  1. Controlla il numero di **porta di destinazione** nell'header UDP.
  2. Instrada il datagramma alla socket associata a quella porta locale, **indipendentemente dall'IP o dalla porta sorgente**.
- **Conseguenza fondamentale:**
  - Se due host client differenti inviano datagrammi UDP alla stessa porta di destinazione dello stesso server (es. porta 53 di un server DNS), entrambi i datagrammi vengono consegnati alla **medesima socket** del server.
  - Il server leggerà l'indirizzo del mittente tramite `recvfrom()` leggendo la `struct sockaddr_in` valorizzata dal kernel.

---

## Demultiplexing Orientato alla Connessione (TCP)

- Una socket TCP connessa è identificata univocamente da una **quadrupla (4-tuple)**:
  1. **Indirizzo IP Sorgente**
  2. **Numero di Porta Sorgente**
  3. **Indirizzo IP di Destinazione**
  4. **Numero di Porta di Destinazione**
- Il server TCP possiede:
  - Una **Welcoming / Listening Socket** associata a una porta nota (es. 80 o 19157) creata con `socket()`, `bind()` e `listen()`.
  - Quando un client esegue `connect()`, il server accetta la connessione con `accept()`, che alloca una **nuova socket connessa distinta**.
- Quando un segmento TCP giunge all'host:
  - Il kernel confronta tutti e 4 i parametri per instradare il segmento alla specifica socket di connessione.
  - Due client con IP diversi che contattano la porta 80 otterranno **due socket server differenti**, permettendo sessioni isolate e concorrenti.

---

## Esempio: Sessioni HTTP Concorrenti verso un Server

```text
    Client Host A                     Server Web B                     Client Host C
    (IP: 192.168.1.10)              (IP: 203.0.113.5)                (IP: 198.51.100.20)
+-----------------------+        +---------------------+        +-----------------------+
| HTTP Client (P1)      |        | Server Web (HTTP)   |        | HTTP Client (P2)      |
| Porta Sorgente: 26145 |        | Welcoming Port: 80  |        | Porta Sorgente: 26145 |
+-----------------------+        +---------------------+        +-----------------------+
           \                                |                               /
            \                               |                              /
  Segmento TCP:                             |                     Segmento TCP:
  Sorg: (192.168.1.10, 26145)               |                     Sorg: (198.51.100.20, 26145)
  Dest: (203.0.113.5, 80)                   |                     Dest: (203.0.113.5, 80)
            \                               |                              /
             v                              v                             v
  +----------------------------------------------------------------------------------+
  | Kernel Server B:                                                                 |
  | Socket Connessa 1: (192.168.1.10, 26145, 203.0.113.5, 80) -> Processo Thread 1   |
  | Socket Connessa 2: (198.51.100.20, 26145, 203.0.113.5, 80) -> Processo Thread 2  |
  +----------------------------------------------------------------------------------+
```

- Nonostante Host A e Host C abbiano casualmente scelto la **stessa porta sorgente (26145)**, non vi è alcun conflitto perché gli **indirizzi IP sorgente differiscono**!

---

## Il Protocollo UDP (*User Datagram Protocol*) — RFC 768

- UDP è un protocollo di trasporto **leggero e minimale** ("bare-bones"):
  - Fornisce unicamente il multiplexing/demultiplexing dei processi e un controllo minimale degli errori sui bit (*checksum* opzionale in IPv4, obbligatorio in IPv6).
- **Caratteristiche principali:**
  - **Connectionless:** nessun handshake a 3 vie iniziale $\rightarrow$ **zero RTT di ritardo di setup**.
  - **Nessuno stato di connessione:** il server non mantiene buffer di invio/ricezione persistenti o numeri di sequenza per i client $\rightarrow$ supporto a un numero elevatissimo di client attivi contemporaneamente.
  - **Header compatto:** overhead di soli **8 byte** (contro i 20-60 byte di TCP).
  - **Nessun controllo della congestione:** l'applicazione può trasmettere alla velocità desiderata (compatibilmente con la banda del link).
- **Ambiti d'uso ideali:**
  - Query rapide Request/Response: **DNS** (porta 53), **SNMP** (porta 161), **DHCP** (porte 67/68).
  - Streaming multimediale e VoIP tolleranti a perdite moderate (ma sensibili al ritardo).
  - Protocolli moderni che implementano affidabilità al livello applicativo (es. **QUIC** su UDP alla base di **HTTP/3**).

---

## Struttura dell'Header UDP

L'header UDP è composto esattamente da **4 campi da 16 bit** (totale 8 byte):

```text
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|       Porta Sorgente (16 bit) |     Porta Destinazione (16 bit)|
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|       Lunghezza UDP (16 bit)  |       UDP Checksum (16 bit)   |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
|                 Dati Applicativi (Payload)                    |
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

- **Porta Sorgente (16 bit):** porta del processo mittente (opzionale se non si attendono risposte, altrimenti valorizzata con 0).
- **Porta Destinazione (16 bit):** porta del servizio destinatario.
- **Lunghezza (16 bit):** dimensione complessiva in byte del datagramma UDP (**Header + Dati**; valore minimo: 8 byte).
- **Checksum (16 bit):** codice per il rilevamento di errori su header, dati e pseudo-header IP.

---

## Calcolo del Checksum UDP e Pseudo-Header IP

- **Obiettivo:** rilevare corruzioni di bit introdotte durante il tragitto end-to-end.
- **Procedimento di calcolo (Internet Checksum):**
  1. I dati UDP (header + payload) vengono suddivisi in parole a 16 bit. Se il payload ha lunghezza dispari, viene aggiunto un byte di padding `0x00` alla fine.
  2. Viene anteposto uno **Pseudo-Header IP** (12 byte in IPv4) contenente:
     - IP Sorgente (32 bit), IP Destinazione (32 bit), Byte a zero (8 bit), Protocollo IP (`17` per UDP, 8 bit), Lunghezza UDP (16 bit).
  3. Viene eseguita la **somma in complemento a uno** di tutte le parole a 16 bit (eventuali riporti oltre il 16° bit vengono sommati nuovamente al bit meno significativo, *end-around carry*).
  4. Il checksum finale è il **complemento a uno (NOT bit a bit)** della somma risultante.
- **Verifica al Ricevitore:**
  - Il ricevente calcola la somma in complemento a uno includendo anche il checksum ricevuto: se il risultato è composto da soli `1` (`0xFFFF`), il pacchetto è integro; altrimenti è corrotto e viene **scartato silenziosamente**.

---

## Perché il Checksum a Livello Trasporto? (Principio End-to-End)

- *Domanda frequente:* "Se il livello di collegamento (es. Ethernet) effettua già il controllo degli errori tramite CRC a 32 bit, perché anche UDP calcola il checksum?"
- **Motivazioni architetturali:**
  1. **Non tutti i link offrono controlli di integrità:** alcuni link o protocolli di livello 2 potrebbero non implementare controlli affidabili.
  2. **Errori nei dispositivi intermedi (Router/Switch):** un pacchetto può essere corrotto nella memoria RAM o nei buffer interni di un router mentre viene instradato, pur venendo trasmesso con un CRC di collegamento formalmente valido all'uscita!
  3. **Principio End-to-End di Saltzer, Reed e Clark (1984):**
     > *"Le funzioni necessarie per la correttezza a livello applicativo possono essere implementate completamente e correttamente solo con l'aiuto delle estremità del sistema di comunicazione."*
- **Importante:** UDP rileva gli errori ma **non li corregge** né richiede ritrasmissioni: i datagrammi corrotti vengono semplicemente scartati.

---

## Percorso di Ricezione UDP nel Kernel Linux

```text
 1. Ricezione Frame su NIC (Network Interface Card)
    │
    ▼
 2. Ring Buffer DMA in Kernel Memory & Interrupt (o NAPI polling)
    │
    ▼
 3. Elaborazione Livello di Rete (IP Layer)
    ├── Verifica Checksum Header IP
    └── Riassemblaggio pacchetti se era avvenuta frammentazione IP
    │
    ▼
 4. Elaborazione Livello di Trasporto (UDP Layer)
    ├── Verifica validità UDP Header e Calcolo UDP Checksum
    ├── Se checksum errato: Scarta il datagramma ed incrementa contatore errori
    └── Se valido: Esegue Demultiplexing tramite Porta Destinazione
    │
    ▼
 5. Inserimento nel Socket Receive Buffer
    └── Il datagramma è accodato nel buffer di ricezione del socket associato
    │
    ▼
 6. Lettura da parte dell'Applicazione Utente
    └── Il processo legge i dati tramite la chiamata di sistema recvfrom()
```

---

## Riepilogo della Lezione

- Il **livello di trasporto** opera esclusivamente tra i sistemi terminali (*end systems*), realizzando una comunicazione logica **process-to-process**.
- I **numeri di porta (16 bit)** permettono:
  - Il **Multiplexing** all'invio (raccolta dai socket e incapsulamento).
  - Il **Demultiplexing** alla ricezione: a 2 elementi per UDP `(IP dest, Porta dest)` e a 4 elementi per TCP `(IP sorg, Porta sorg, IP dest, Porta dest)`.
- **UDP** è un protocollo connectionless, snello (8 byte di header), privo di ritardo di setup e privo di controllo della congestione.
- Il **Checksum UDP** calcolato su header, dati e pseudo-header IP garantisce il rilevamento degli errori end-to-end conformemente al principio fondamentale di progettazione delle reti.
