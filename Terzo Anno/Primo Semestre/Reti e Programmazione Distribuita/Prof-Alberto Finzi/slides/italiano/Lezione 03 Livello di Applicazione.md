---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezione 03: Il Livello di Applicazione (*Application Layer*)

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Applicazioni di Rete (*Network Applications*)

- Un'**applicazione di rete** è costituita da programmi eseguiti su **sistemi periferici differenti (*End Systems*)** che comunicano tra loro attraverso la rete.
- **Principio fondamentale**:  
  Il software applicativo risiede ed è eseguito **esclusivamente sugli host periferici**, non nei dispositivi interni del nucleo della rete (*Network Core*).
- I router e gli switch instradano e commutano pacchetti a livello di rete e di collegamento, rimanendo completamente agnostici rispetto alle applicazioni utente.
- Questo modello consente di sviluppare e distribuire nuove applicazioni di rete (es. Web, Zoom, BitTorrent, ChatGPT) senza dover modificare l'infrastruttura di rete sottostante!

---

## Creazione di Applicazioni di Rete e Concetto di Socket

Per creare un'applicazione di rete occorre scrivere programmi che:
- Vengono eseguiti su computer diversi (client e server o peer).
- Comunicano attraverso l'infrastruttura di rete.
- Non richiedono la scrittura di codice per i router o i nodi interni.

### La Socket: L'Interfaccia con la Rete
- I processi in esecuzione su host diversi comunicano inviando e ricevendo messaggi attraverso le **Socket**.
- La **Socket** è l'interfaccia di programmazione applicativa (**API**) tra il processo utente (Livello Applicazione) e lo stack di rete del sistema operativo (Livello di Trasporto).

---

## L'Analogia della Socket: La Porta della Stanza

- **Analogia classica**:
  - Il processo applicativo è come una persona all'interno di una stanza.
  - La **socket** è la porta della stanza.
  - Per inviare un messaggio nel mondo esterno, il processo spinge il messaggio fuori dalla porta (nella socket).
  - Il processo fa affidamento sull'infrastruttura di trasporto fuori dalla stanza per recapitare il messaggio alla porta del destinatario.
- Lo sviluppatore controlla tutto ciò che sta all'interno del livello applicativo, ma ha controllo limitato sul livello di trasporto (scelta tra TCP e UDP, impostazione di pochi parametri come dimensione dei buffer e timeout).

---

## Architetture delle Applicazioni di Rete

La struttura di un'applicazione di rete è definita dall'architettura scelta dallo sviluppatore.  
Le due macro-architetture dominanti sono:

1. **Architettura Client-Server**
2. **Architettura Peer-to-Peer (P2P)**
3. **Architetture Ibride (Client-Server + P2P)**

---

## Architettura Client-Server (1/2)

- **Server**:
  - Host sempre attivo (*always-on host*).
  - Indirizzo IP fisso e ben noto (*permanent/well-known IP address*).
  - Spesso collocato in data center professionali per gestire carichi elevati (cluster di server).
- **Client**:
  - Comunicano direttamente ed esclusivamente con il server.
  - Possono avere indirizzi IP dinamici e intermittenti.
  - Non comunicano direttamente tra loro (un client web non parla con un altro client web).
  - Possono disconnettersi in qualunque momento.

---

## Architettura Client-Server (2/2)

- **Esempi classici**:
  - Il **Web**: browser (client) che richiedono pagine e oggetti a web server (Apache, Nginx).
  - La **Posta Elettronica**: client email che inviano o scaricano posta da mail server.
  - **Basi di Dati e Servizi Cloud**: client mobile che interrogano API centralizzate.
- **Limite principale**:
  - Il server centrale rappresenta un potenziale collo di bottiglia (*bottleneck*) per le prestazioni e un punto singolo di fallimento se non adeguatamente replicato.

---

## Architettura Peer-to-Peer (P2P)

- **Caratteristiche**:
  - **Nessun server centrale sempre attivo**: i nodi terminali sono computer ordinari (*peer*).
  - I peer comunicano **direttamente tra loro** (*arbitrary end systems*).
  - Ogni nodo funge contemporaneamente sia da client che da server (*servent*).
- **Proprietà chiave: Auto-scalabilità (*Self-Scalability*)**:
  - In un sistema P2P di condivisione file, ogni nuovo peer che si connette richiede dati, ma mette contemporaneamente a disposizione la propria banda di upload per servire gli altri peer!
  - La capacità del sistema cresce naturalmente con la domanda.
- **Esempi**: BitTorrent, reti decentralizzate, blockchain.

---

## Sistemi P2P Puri vs Ibridi

- **P2P Puro (*Pure P2P*)**:
  - Completamente decentralizzato: non esiste alcun server centrale nemmeno per la ricerca iniziale o il coordinamento.
  - Molto complesso da gestire, elevato traffico di segnalazione.
- **P2P Ibrido (*Hybrid P2P*)**:
  - La maggior parte delle applicazioni pratiche adotta un approccio ibrido:
    - Un server centrale gestisce l'autenticazione, la ricerca delle risorse o l'elenco dei nodi attivi (*directory/tracker*).
    - Il trasferimento effettivo dei dati pesanti (file, audio/video) avviene direttamente in modalità peer-to-peer tra gli utenti.
  - Esempi storici e moderni: Napster, prime versioni di Skype, BitTorrent con tracker centrale.

---

## Comunicazione tra Processi: Identificazione dell'Host

- Per consentire a un processo su un host di inviare un messaggio a un processo su un altro host, il mittente deve identificare:
  1. L'**Host di destinazione** nella rete.
  2. Il **Processo specifico** in esecuzione su quell'host.
- In Internet, un host è identificato univocamente a livello di rete da un **Indirizzo IP (*IP Address*)**.

---

## Gli Indirizzi IP: IPv4 e IPv6

- **IPv4 (*Internet Protocol version 4*)**:
  - Lunghezza: **32 bit** (4 byte).
  - Notazione: decimale puntata (*dotted-decimal notation*), es. `143.225.161.30`.
  - Spazio di indirizzamento limitato a circa $2^{32} \approx 4.3$ miliardi di indirizzi (ormai esauriti).
- **IPv6 (*Internet Protocol version 6*)**:
  - Lunghezza: **128 bit** (16 byte).
  - Notazione: esadecimale separata da due punti, es. `2001:0db8:85a3:0000:0000:8a2e:0370:7334`.
  - Spazio di indirizzamento virtualmente illimitato ($2^{128} \approx 3.4 \times 10^{38}$ indirizzi).

---

## Indirizzo di Loopback e Localhost

- Quando due processi comunicano all'interno dello **stesso computer**, non è necessario uscire sulla rete fisica.
- Viene utilizzata l'interfaccia virtuale di **Loopback**:
  - Nome mnemonico: `localhost`
  - Indirizzo IPv4 riservato: `127.0.0.1` (o l'intera subnet `127.0.0.0/8`)
  - Indirizzo IPv6 riservato: `::1`
- Il traffico indirizzato a `localhost` attraversa comunque l'intero stack di protocolli TCP/IP del sistema operativo, ma viene reindirizzato internamente senza raggiungere la scheda di rete fisica.

---

## Quanti Indirizzi IP ha un Dispositivo?

- L'indirizzo IP identifica **un'interfaccia di rete (*Network Interface*)**, non l'intero computer!
- Se un portatile è collegato contemporaneamente con il cavo Ethernet e con il Wi-Fi:
  - Ha **due interfacce di rete fisiche attive**.
  - Possiede **due indirizzi IP distinti** (uno per la scheda Ethernet, uno per la scheda Wi-Fi), più l'interfaccia di loopback `127.0.0.1`.
- I router possiedono decine o centinaia di interfacce e indirizzi IP differenti.

---

## Identificazione del Processo: I Numeri di Porta (*Port Numbers*)

- Un singolo computer può eseguire contemporaneamente **decine di applicazioni di rete diverse**:
  - Un browser web aperto, un client di posta, Spotify, un terminale SSH.
- L'indirizzo IP indica solo a quale computer consegnare il pacchetto, ma **non a quale applicazione appartiene**.
- Per identificare il processo destinatario all'interno dell'host si utilizzano i **Numeri di Porta (*Port Numbers*)**:
  - Valori interi a 16 bit (da 0 a 65535).
- Una connessione di rete è identificata univocamente dalla **5-tupla**:  
  `(IP sorgente, Porta sorgente, IP destinazione, Porta destinazione, Protocollo di trasporto)`

---

## Porte Ben Note (*Well-Known Ports*)

Le porte da 0 a 1023 sono riservate ai servizi standard di sistema (*Well-Known Ports*):

| Porta | Protocollo | Servizio Applicativo |
| :--- | :--- | :--- |
| **20 / 21** | TCP | **FTP** (Trasferimento file dati/controllo) |
| **22** | TCP | **SSH** (Accesso remoto sicuro) |
| **25** | TCP | **SMTP** (Invio posta elettronica) |
| **53** | UDP / TCP | **DNS** (Risoluzione nomi di dominio) |
| **80** | TCP | **HTTP** (Navigazione Web standard) |
| **110** | TCP | **POP3** (Ricezione posta elettronica) |
| **143** | TCP | **IMAP** (Accesso e sincronizzazione posta) |
| **443** | TCP | **HTTPS** (Web sicuro con crittografia TLS) |

---

## Requisiti delle Applicazioni dal Servizio di Trasporto

Diverse applicazioni richiedono garanzie differenti al protocollo di trasporto sottostante:

1. **Integrità dei Dati / Tolleranza alle Perdite (*Data Loss Tolerance*)**:
   - Applicazioni che **non tollerano perdite di dati** (*Loss-intolerant*): trasferimento file (FTP), transazioni bancarie, codice web (HTML/JS), email. Richiedono consegna affidabile al 100%.
   - Applicazioni **tolleranti alle perdite** (*Loss-tolerant*): audio/video in streaming, videoconferenze, videogiochi.
2. **Throughput (Banda)**:
   - Applicazioni sensibili alla banda: richiedono un bitrate minimo garantito (es. video 4K).
   - Applicazioni elastiche (*Elastic*): usano tutta la banda disponibile, adattandosi (download file, web).
3. **Temporizzazione e Latenza (*Timing / Delay*)**:
   - Chiamate VoIP e gaming online richiedono latenze basse e jitter minimo.
4. **Sicurezza**: riservatezza, autenticazione e integrità del messaggio.

---

## Servizi Offerti dai Protocolli di Trasporto Internet

Internet offre due protocolli di trasporto standard: **TCP** e **UDP**.

| Proprietà del Servizio | TCP (*Transmission Control Protocol*) | UDP (*User Datagram Protocol*) |
| :--- | :--- | :--- |
| **Connessione** | Orientato alla connessione (handshake a 3 vie) | Senza connessione (*Connectionless*) |
| **Affidabilità** | Trasferimento affidabile garantito (ACK, ritrasmissioni)| Best-effort (i pacchetti possono perdersi) |
| **Ordinamento** | Consegna rigorosamente in ordine | Nessuna garanzia di ordine |
| **Controllo di Flusso** | Sì (evita di saturare il ricevitore) | No |
| **Controllo Congestione**| Sì (rallenta se la rete è intasata) | No (invia al massimo ritmo consentito) |
| **Overhead e Ritardo** | Più elevato (header minimo 20 byte + handshake) | Minimo (header di soli 8 byte, zero setup) |
| **Garanzie di Banda/Tempo**| Nessuna garanzia di throughput o delay minimo | Nessuna garanzia |

---

## Protocolli del Livello di Applicazione

Un **protocollo di livello applicativo** definisce le regole con cui comunicano i processi:
- **Tipi di messaggi scambiati**: messaggi di richiesta (*request*) e di risposta (*response*).
- **Sintassi dei messaggi**: quali campi compongono il messaggio e come sono delimitati.
- **Semantica dei campi**: il significato preciso delle informazioni contenute nei campi.
- **Regole temporali**: quando e come un processo invia messaggi o risponde ai messaggi ricevuti.

### Protocolli Pubblici vs Proprietari:
- **Protocolli Pubblici (RFC / IETF)**: standard aperti che garantiscono interoperabilità totale (es. HTTP, SMTP).
- **Protocolli Proprietari**: definiti privatamente da aziende (es. Skype originale, protocolli interni Zoom).

---

## Caso di Studio: Il Protocollo FTP (*File Transfer Protocol*)

- Definito nella **RFC 959**, è uno dei protocolli storici più longevi di Internet.
- Utilizzato per trasferire file tra un client locale e un server remoto.
- **Architettura a due canali separati (*Out-of-band Control*)**:
  - A differenza di HTTP, FTP utilizza **due connessioni TCP parallele distinte**:
    1. **Connessione di Controllo (Porta 21)**: invia comandi utente e riceve codici di stato (es. login, cambio cartella, richiesta file). Rimane aperta per l'intera sessione.
    2. **Connessione Dati (Porta 20 o effimera)**: viene aperta appositamente per trasferire il contenuto effettivo di un file o l'elenco di una directory, e viene chiusa al termine di ogni singolo trasferimento!

---

## Connessione di Controllo vs Connessione Dati in FTP

```
   Client FTP                                       Server FTP
   +----------+                                    +----------+
   |          | ====== Connessione Controllo ===== |          |
   | Interfaccia (TCP Porta 21 - Persistente)     | Processo |
   | Utente   |                                    | Server   |
   |          | ------ Connessione Dati ---------- |          |
   |          |  (TCP Porta Dati - Effimera)       |          |
   +----------+                                    +----------+
```

- Poiché la connessione di controllo trasporta solo comandi brevi e non è appesantita dai byte del file, FTP è definito un protocollo con controllo **\"fuori banda\" (*out-of-band*)**.
- Il server FTP mantiene lo **stato della sessione** dell'utente (*Stateful*): ricorda l'utente autenticato e la cartella corrente (*current working directory*).

---

## Comandi e Risposte Tipiche di FTP

I comandi FTP sono inviati in testo ASCII leggibile:

- `USER nomeutente`: autenticazione dell'utente.
- `PASS password`: invio della password.
- `LIST`: richiede l'elenco dei file nella directory corrente (inviato sulla connessione dati).
- `RETR nomefile`: scarica un file dal server remoto al client (*Retrieve*).
- `STOR nomefile`: carica un file dal client al server (*Store*).
- `QUIT`: disconnette la sessione di controllo.

### Codici di Risposta del Server:
- `331 Username OK, password required`
- `230 User logged in, proceed`
- `150 File status okay; about to open data connection`
- `226 Closing data connection; requested file action successful`
- `550 Requested action not taken; file unavailable`

---

## Sintesi della Lezione

- Le applicazioni di rete sono il vero motore di Internet: sono eseguite alla periferia (*End Systems*).
- I processi comunicano attraverso l'interfaccia delle **Socket**, identificandosi tramite la coppia **(Indirizzo IP, Numero di Porta)**.
- La scelta del protocollo di trasporto dipende dai requisiti dell'applicazione:
  - **TCP**: per affidabilità assoluta e controllo di flusso (Web, email, file transfer).
  - **UDP**: per velocità, basso overhead e tolleranza alle perdite (streaming live, gaming, DNS).
- Nei protocolli applicativi come **FTP**, l'architettura dei canali e la gestione dello stato determinano la robustezza e l'efficienza dello scambio dati.
- Nella prossima lezione approfondiremo il protocollo applicativo più diffuso al mondo: **HTTP e il Web**!
