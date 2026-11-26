---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
style: |
  section {
    font-size: 21px;
    line-height: 1.38;
    padding: 48px 54px 52px 54px;
  }
  h1 { font-size: 1.9em; }
  h2 { font-size: 1.35em; margin-top: 0; margin-bottom: 0.45em; }
  h3 { font-size: 1.08em; margin: 0.4em 0 0.25em 0; }
  p, ul, ol { margin: 0.3em 0; }
  li { margin: 0.18em 0; }
  pre { font-size: 0.72em; line-height: 1.25; padding: 0.55em 0.8em; margin: 0.4em 0; }
  table { font-size: 0.86em; margin: 0.4em 0; }
  th, td { padding: 0.3em 0.55em; }
---

# Reti e Programmazione Distribuita
## Lezione 17: Il Livello di Trasporto — Gestione della Connessione TCP
### Three-Way Handshake, SYN Flood/Cookies, Chiusura, TIME_WAIT, RST e Laboratorio

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Richiamo: Gestione della Connessione e i Tre Flag Chiave

Tutto ciò che abbiamo visto finora presupponeva una connessione TCP già attiva (buffer, variabili, numeri di sequenza). Prima e dopo lo scambio dati servono **apertura** e **chiusura** concordate:

- All'apertura (`connect()` / `accept()`): i due estremi devono accordarsi per comunicare e scambiarsi i rispettivi numeri di sequenza iniziali (**ISN**).
- Alla chiusura (`close()`): entrambi devono terminare senza lasciare un estremo a trasmettere verso un peer già uscito.
- **Bastano 3 flag dell'header TCP** (i campi `SEQ` e `ACK` portano l'accordo; i flag indicano di che tipo è):
  - **`SYN`**: apre la connessione (impostato **solo nei primi due segmenti**, mai più in seguito).
  - **`FIN`**: il mittente non ha più dati da inviare (chiude **una sola direzione**, inviato una volta per direzione).
  - **`RST`**: qui non esiste alcuna connessione — scarta il segmento e interrompi subito.

---

## Il Problema del Consenso e il Problema dei Due Eserciti

Poiché la rete può perdere o danneggiare i segmenti, è difficile per due host avere la certezza assoluta dello stato altrui (*Two-Army Problem*):

```text
   Colle Ovest                                          Colle Est
  [Esercito Blu 1]                                   [Esercito Blu 2]
          \                                                 /
           \      [ Esercito Bianco (nella valle) ]        /
            +---> Messaggeri (possono essere catturati) <-+
```

- I due eserciti Blu vincono **solo se attaccano insieme**, ma il canale è inaffidabile:
  - **2 messaggi** (*"Attacchiamo?"* $\to$ *"OK"*): Blu 2 non sa se il suo *"OK"* è arrivato $\Rightarrow$ esita.
  - **3 messaggi** (*"Ho ricevuto il tuo OK"*): ora è Blu 1 a non sapere se il 3° messaggio è arrivato.
  - **Teorema:** su un canale inaffidabile **nessun protocollo a numero finito di messaggi** garantisce la certezza assoluta a entrambi gli estremi.

---

## Cosa Serve Davvero a TCP

- **Impossibile:** garantire con certezza matematica, in un numero finito di scambi, che entrambi sappiano che l'altro ha completato la procedura.
- **Ciò che basta a TCP è più debole:** ciascun estremo deve aver appreso l'ISN dell'altro e sapere che il proprio ISN è stato ricevuto.
- **Tre segmenti (*Three-Way Handshake*) bastano esattamente a questo:** ogni segmento è confermato dal successivo, nulla è accettato "sulla fiducia".
- Il solo dubbio residuo riguarda il recapito dell'ultimo `ACK` da parte del mittente:
  - **All'apertura:** il successivo scambio di dati conferma implicitamente che il server ha aperto la connessione.
  - **Alla chiusura:** l'incertezza sull'ultimo `ACK` viene gestita mediante il timer dello stato **`TIME_WAIT`**.

---

## Apertura della Connessione: il *Three-Way Handshake*

```text
         Client TCP                                          Server TCP
             |                                                   |
             |--- 1. SYN=1, SEQ = client_isn (no dati) --------->| Riceve SYN
             |                                                   | Alloca buffer e variabili
             |<-- 2. SYN=1, ACK=1, SEQ = server_isn, ------------|
             |       ACK = client_isn + 1 (no dati)              |
             |                                                   |
  Alloca buffer                                                  |
  Connesso!  |--- 3. SYN=0, ACK=1, SEQ = client_isn + 1, ------->| Riceve ACK
             |       ACK = server_isn + 1 [possibili dati]       | Connesso!
```

- L'handshake aggiunge **1 intero RTT** prima che il primo byte applicativo possa partire (e impegna subito memoria sul server al primo `SYN`).
- Ecco perché in HTTP le **connessioni persistenti** sono decisive: si paga il costo dell'handshake una sola volta e lo si riutilizza per più richieste.
- Se l'handshake non si completa entro un timeout tipico (30–60 s), la procedura viene abortita.

---

## Perché i Numeri di Sequenza Iniziali (ISN) sono Casuali?

Nessuna connessione reale parte da `SEQ = 0`; entrambi gli estremi scelgono un **ISN casuale** (*Initial Sequence Number*):

1. **Protezione da segmenti ritardati di connessioni precedenti:**
   - Un vecchio segmento appartenente a una connessione precedente sulla stessa 4-tupla `(IP_src, port_src, IP_dst, port_dst)` potrebbe ancora vagare in rete.
   - Con un nuovo punto di partenza casuale, il vecchio segmento ricade fuori dalla finestra della nuova connessione e viene **scartato** invece di essere accettato come dato valido.
2. **Difesa contro il *TCP Sequence Prediction / Injection*:**
   - Se gli ISN fossero prevedibili, un attaccante cieco (che non vede il traffico di ritorno) potrebbe iniettare segmenti falsificati nella connessione.
3. **Prova di ricezione (`+ 1`):**
   - Solo chi ha davvero ricevuto il `SYN` può rispondere esattamente con `ACK = client_isn + 1`.

---

## FSM di Apertura e Ruolo del Kernel (`listen`, `connect`, `accept`)

```text
                    +----------------------+
                    |        CLOSED        |
                    +----------------------+
                       /                \
         listen()     /                  \  connect() / Invia SYN
     (Passive Open)  v                    v  (Active Open)
            +--------------+       +--------------+
            |    LISTEN    |       |   SYN_SENT   |
            +--------------+       +--------------+
                   |                      |
     Riceve SYN /  |                      | Riceve SYN+ACK /
     Invia SYN+ACK v                      v Invia ACK
            +--------------+       +--------------+
            |   SYN_RCVD   |       |  ESTABLISHED |
            +--------------+       +--------------+
                   | Riceve ACK
                   v
            +--------------+
            |  ESTABLISHED |
            +--------------+
```

- `listen()` porta il socket in `LISTEN`: da quell'istante **il kernel risponde ai `SYN` in autonomia**, senza coinvolgere il processo applicativo.
- `connect()` invia il `SYN` e si blocca finché arriva `SYN-ACK` e parte il 3° `ACK`.
- `accept()` **non partecipa all'handshake**: preleva solo una connessione già `ESTABLISHED` dalla coda del kernel!

---

## Le Due Code di un Socket in Ascolto (`backlog`)

Ogni socket TCP in stato `LISTEN` mantiene nel kernel **due code distinte**:

```text
  SYN in arrivo ---> [ 1. SYN Queue (Half-Open) ] --- 3° ACK ---> [ 2. Accept Queue (Completed) ] ---> accept()
                     (SYN_RCVD: manca il 3° ACK)                  (ESTABLISHED: pronte per l'app)
                                                                   ^ lunghezza controllata da backlog
```

1. **SYN Queue (connessioni semi-aperte):** un `SYN` in arrivo crea una voce in questa coda; all'arrivo del 3° `ACK` la connessione viene spostata nella seconda coda.
2. **Accept Queue (connessioni completate):** `accept()` estrae una connessione già stabilita; il parametro `backlog` passato a `listen()` limita questa coda.
   - Se si riempie, nuove connessioni vengono scartate o rifiutate e il client sperimenta ritardi senza conoscerne la causa.
- La **SYN Queue** è il bersaglio diretto degli attacchi **SYN Flood**, mitigati mediante **SYN Cookies**.

---

## Nessuna Risposta vs Rifiuto Esplicito (`ETIMEDOUT` vs `RST`)

Cosa succede quando il client invoca `connect()` e qualcosa va storto?

- **Nessuna risposta (host irraggiungibile o pacchetti filtrati da firewall):**
  - TCP ritrasmette il `SYN` più volte con intervallo crescente (*backoff*) per decine di secondi, poi abbandona: `connect()` restituisce `-1` con `errno = ETIMEDOUT`.
- **Rifiuto immediato (host attivo, ma nessun processo in ascolto su quella porta):**
  - Il TCP remoto risponde immediatamente con un segmento con flag **`RST = 1`**.
  - `connect()` fallisce subito restituendo `-1` con `errno = ECONNREFUSED` (errore tipico quando si avvia il client prima del server).
- **Confronto con UDP:** in UDP una porta chiusa veniva segnalata dal livello di rete (`ICMP Port Unreachable`); in TCP la segnalazione è un segmento di trasporto (`RST`).

---

## Attacco SYN Flood e Contromisura SYN Cookies

- **Attacco SYN Flood (DoS):**
  - Un attaccante invia migliaia di `SYN` con **IP sorgente falsificati** (*spoofing*) e non completa mai il 3° `ACK`.
  - Il server alloca stato nella *SYN Queue* trattenendolo per 60+ s: basta pochissima banda per **esaurire la coda** e bloccare i client legittimi.
- **Contromisura: SYN Cookies** *(evita l'allocazione anticipata di memoria)*:
  1. Quando la *SYN Queue* si riempie, il server **non memorizza stato** per il `SYN` ricevuto.
  2. Calcola un **cookie crittografico** (hash di IP, porte, chiave segreta del server e timestamp) e lo codifica come proprio **`server_isn`** nel `SYN-ACK`.
  3. Solo quando torna il 3° `ACK` (con `ACK = server_isn + 1`), il server ricalcola e **valida il cookie**: solo se autentico alloca le risorse della connessione!

---

## Port Scanning con `nmap`: Cosa Rivelano le 3 Risposte a un `SYN`

Inviando un singolo segmento `SYN` verso ogni porta di un host, le tre possibili risposte mappano completamente i servizi esposti dall'esterno senza nemmeno completare la connessione:

| Risposta al `SYN` | Stato della Porta | Significato |
| :--- | :---: | :--- |
| **`SYN-ACK`** | **Open** | Un servizio è in ascolto sulla porta (lo scanner può poi inviare `RST` per non completare l'handshake). |
| **`RST`** | **Closed** | L'host è raggiungibile, ma nessun processo è in ascolto su quella porta. |
| **Nessuna risposta** *(o ICMP unreachable)* | **Filtered** | Un firewall sta scartando i pacchetti diretti a quella porta. |

- Questo meccanismo (*TCP SYN Scan*) è alla base di **`nmap`**, usato sia per diagnostica di rete sia nelle fasi di ricognizione.

---

## Chiusura della Connessione (*Teardown*) e *Half-Close*

Poiché TCP è **full-duplex**, ciascuna direzione di invio viene chiusa in modo indipendente tramite un segmento con flag **`FIN = 1`**:

```text
        Client (Chiude per primo)                           Server (Chiude dopo)
               |                                                     |
    close() /  |--- 1. FIN = 1 ------------------------------------->| Riceve FIN (recv() -> 0)
  shutdown(WR) |<-- 2. ACK = 1 --------------------------------------| (Può continuare a inviare!)
               |                                                     |
               |<-- 3. FIN = 1 [può viaggiare con 2 se chiude subito]| close()
               |--- 4. ACK = 1 ------------------------------------->| CLOSED
    TIME_WAIT  v
```

- **Chiusura normale in 4 segmenti:** `FIN`, `ACK`, poi `FIN`, `ACK` nell'altra direzione (collassa in **3 segmenti** solo quando il peer non ha più dati e accorpa `ACK + FIN`).
- **Half-Close:**
  - `close(fd)` invia `FIN` e rilascia il descrittore.
  - `shutdown(fd, SHUT_WR)` invia `FIN` **mantenendo aperta la lettura**: il client comunica *"ho finito di inviare la richiesta"* e continua a leggere la risposta del server.

---

## Macchina a Stati Finiti (FSM) della Chiusura TCP

```text
    CHI CHIUDE PER PRIMO (Active Close)             CHI SUBISCE LA CHIUSURA (Passive Close)
    -----------------------------------             ---------------------------------------
              ESTABLISHED                                         ESTABLISHED
                   | close() / Invia FIN                               | Riceve FIN / Invia ACK
                   v                                                   v
              FIN_WAIT_1 --(Riceve FIN / Invia ACK)--> CLOSING     CLOSE_WAIT
                   | Riceve ACK                           |            | close() / Invia FIN
                   v                             Riceve ACK            v
              FIN_WAIT_2                                  |         LAST_ACK
                   | Riceve FIN / Invia ACK               |            | Riceve ACK
                   v                                      v            v
               TIME_WAIT <--------------------------------+          CLOSED
                   | Scadenza Timer (2 * MSL)
                   v
                 CLOSED
```

- Lo stato **`CLOSING`** gestisce il caso di **chiusura simultanea**, in cui entrambi gli estremi inviano il proprio `FIN` prima di ricevere quello dell'altro.

---

## Lo Stato `TIME_WAIT` e l'Opzione `SO_REUSEADDR`

Chi chiude **per primo** non passa subito a `CLOSED`, ma resta in **`TIME_WAIT`** per circa $30\text{ s} \text{–} 2\text{ min}$ ($\approx 2 \times \text{MSL}$):

1. **Proteggere l'ultimo `ACK`:** se l'ultimo `ACK` va perduto, il peer ritrasmette il proprio `FIN` e qualcuno deve essere ancora vivo per rispondere `ACK`.
2. **Drenare i vecchi segmenti:** garantisce che eventuali segmenti ritardati della vecchia connessione muoiano in rete prima che la stessa 4-tupla venga riutilizzata.

- **Effetto pratico sul server:** se interrompi e riavvii un server con connessioni attive, il server è chi ha chiuso per primo $\Rightarrow$ le sue connessioni restano in `TIME_WAIT` trattenendo la porta e `bind()` fallisce!
  - **`SO_REUSEADDR`** consente di rifare `bind()` subito sulla stessa porta in modo sicuro (la vecchia 4-tupla resta distinta dalle nuove).
  - Quando è il **client** a chiudere per primo, il server non entra in `TIME_WAIT` e il problema non compare.

---

## Il Bug del Descrittore Dimenticato: `CLOSE_WAIT`

Cosa accade se nel tuo server `recv()` restituisce **`0`** e dimentichi di chiamare `close(fd)`?

- All'inizio sembra non rompersi nulla, ma la connessione resta intrappolata in **`CLOSE_WAIT` per sempre**:
  - Il kernel ha già riscontrato il `FIN` del peer, ma il tuo processo non invia mai il proprio `FIN`.
  - Anche il peer rimane bloccato in `FIN_WAIT_2` e la chiusura non termina su nessun lato.
- Dopo alcune migliaia di client, il server **esaurisce i file descriptor** disponibili e smette di accettare nuove connessioni: il guasto emerge lontano dalla causa!
- **Diagnosi su Linux:** `ss -tn state close-wait`
  - Una colonna di connessioni in `CLOSE_WAIT` è **sempre un bug applicativo**, mai un problema di rete.
  - Ricorda: `recv() == 0` significa *è arrivato il `FIN` del peer* — è l'istruzione esplicita di chiudere il socket!

---

## Perdita di Pacchetti Durante la Chiusura (Timer vs Due Eserciti)

Poiché nemmeno la chiusura è immune dalle perdite, TCP ricorre ai **timer**:

1. **Perdita dell'ultimo `ACK` (Client $\to$ Server):**
   - Il client ha inviato l'ultimo `ACK` e chiude; il segmento va perduto.
   - Il server resta in attesa finché **scade il suo timer** (o dopo le ritrasmissioni del `FIN`) e chiude comunque la connessione.
   - Entrambi finiscono in `CLOSED` (solo in istanti leggermente diversi): è il costo pratico del dubbio dei Due Eserciti.
2. **Perdita del `FIN-ACK` del Server (Server $\to$ Client):**
   - Il client non riceve risposta; allo scadere del timer **ritrasmette il proprio `FIN`**, esattamente come farebbe per un segmento dati.
   - Il server risponde di nuovo con `FIN-ACK`, il client conferma con `ACK` e la chiusura va a buon fine.

---

## Interruzione Bruta (`RST`), Crash dell'Host e Segnali applicativi

A differenza di `FIN` (chiusura ordinata), **`RST` abortisce istantaneamente la connessione**, potenzialmente scartando i dati nei buffer:

- **Generazione di `RST`:** inviato quando arriva un segmento per una connessione inesistente (es. `SYN` su porta chiusa, oppure dati verso un host riavviato).
- **Crash di un host:** un host che si spegne di colpo non invia né `FIN` né `RST`; il peer continua a credere la connessione `ESTABLISHED` finché non prova a trasmettere.
- **Dopo il riavvio (*reboot*):** l'host riavviato ha perso lo stato TCP; appena il peer invia dati, risponde con **`RST`**.
- **Errori lato applicazione C:**
  - Ricevere `RST` genera **`ECONNRESET`**.
  - Scrivere ulteriormente su una connessione chiusa/resettata fallisce con **`EPIPE`** e invia il segnale **`SIGPIPE`**.
- **Rilevamento guasti:** affidato ai timeout di ritrasmissione, ai probe opzionali di **TCP Keepalive**, oppure a **heartbeat** periodici a livello applicativo.

---

## Laboratorio Pratico: `nc` (Netcat), `ss` e Cattura Wireshark

Due terminali sulla stessa macchina consentono di osservare l'intero ciclo di vita TCP sul loopback (`127.0.0.1`):

```bash
# Terminale 1 (Server in ascolto sulla porta 5001)
$ nc -l 5001

# Verifica stato del socket in ascolto
$ ss -tln 'sport = :5001'

# Terminale 2 (Client)
$ nc localhost 5001
```

- **Filtro Wireshark (su interfaccia `loopback`):** `tcp && tcp.port == 5001 && ip`
- **Sequenza osservabile nella cattura:**
  - **Segmenti 1–3:** Three-way handshake (`SYN`, `SYN-ACK`, `ACK`).
  - **Segmenti 4–7:** Dati (`PSH-ACK`, es. 9 B $\to$ `ACK=10`; poi 13 B $\to$ `ACK=23`).
  - **Segmento 8 (`Ctrl-C`):** invio di `FIN-ACK` per terminare la connessione.
- **Trasferimento file con `nc`:** TCP è un **byte stream senza confini** — qui il `FIN` funge da *End-Of-File*; per inviare due file sulla stessa connessione occorre un framing applicativo.

---

## Sintesi della Lezione 17

- **Accordo su canale inaffidabile:** l'accordo assoluto è impossibile (*Two-Army Problem*); tre segmenti non sono una dimostrazione matematica, ma sono sufficienti in pratica.
- **Handshake:** scambia due ISN casuali e alloca stato sui due kernel, al costo di **1 RTT** prima dei dati (protetto contro *SYN Flood* tramite **SYN Cookies**).
- **Chiusura:** due metà indipendenti, un `FIN` per direzione ciascuno riscontrato; `recv() == 0` segnala il `FIN` del peer.
- **`TIME_WAIT` vs `CLOSE_WAIT`:** `TIME_WAIT` protegge l'ultimo `ACK` e la 4-tupla (`SO_REUSEADDR` per il riavvio); `CLOSE_WAIT` persistente è un bug del codice che dimentica `close()`.
- **`RST` e Timer:** `RST` gestisce rifiuti e connessioni inesistenti; i timer chiudono ciò che l'accordo esplicito non può garantire.
