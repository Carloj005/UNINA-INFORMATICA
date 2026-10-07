---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezione 04: Il Livello di Applicazione — HTTP e il Web

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Il Web e il Protocollo HTTP

- Fino ai primi anni '90 Internet era utilizzata principalmente da ricercatori, accademici e studenti universitari per email, bacheche usenet e trasferimento file (FTP).
- **World Wide Web (WWW / Web)**:
  - Introdotto al CERN da **Tim Berners-Lee** (1989–1991).
  - Ha trasformato Internet in un mezzo di comunicazione di massa.
  - È un insieme distribuito di risorse ipertestuali interconnesse da link (*Hyperlinks*).
- **HTTP (*HyperText Transfer Protocol*)**:
  - Il protocollo di livello applicativo alla base del Web (RFC 1945 per HTTP/1.0, RFC 2616 e RFC 7230 per HTTP/1.1, RFC 7540 per HTTP/2, RFC 9114 per HTTP/3).

---

## Risorse Web e URL (*Uniform Resource Locator*)

- Le informazioni disponibili sul Web sono chiamate **risorse** o **oggetti** (file HTML, immagini JPEG/PNG, fogli di stile CSS, script JavaScript, video, documenti PDF).
- Ogni oggetto è identificato univocamente da un **URL (*Uniform Resource Locator*)**:

```
http://www.sito.it:80/percorso/pagina.html?lingua=it#sezione
|____|  |_________| |__| |_________________| |________| |_____|
schema     host     porta        path          query    fragment
```

- **Componenti chiave**:
  - **Schema/Protocollo**: specifica il protocollo da utilizzare (`http://`, `https://`).
  - **Host**: nome di dominio o indirizzo IP del server che ospita la risorsa.
  - **Porta (opzionale)**: default `80` per HTTP, `443` per HTTPS.
  - **Path**: percorso logico della risorsa sul server.
  - **Query String**: parametri passati all'applicazione (coppie chiave-valore).

---

## Anatomia di una Pagina Web

- La maggior parte delle pagine Web è composta da:
  1. Un **file HTML di base** (*Base HTML File*).
  2. Diversi **oggetti referenziati** (*Referenced Objects*), come immagini, icone, file CSS e script JS inclusi tramite tag HTML:
     ```html
     <img src="logo.png">
     <link rel="stylesheet" href="style.css">
     <script src="app.js"></script>
     ```
- Per visualizzare completamente la pagina, il client browser deve effettuare **più richieste HTTP distinte**: una per il file HTML base e una per ciascun oggetto referenziato!

---

## Modello Client-Server di HTTP

HTTP adotta rigorosamente il modello **Client-Server**:

- **Web Client (Browser)**:
  - Invia un **messaggio di richiesta HTTP (*HTTP Request*)** per ottenere oggetti Web.
  - Riceve gli oggetti e li assembla a schermo (*rendering*).
  - Esempi: Chrome, Firefox, Safari, Edge, curl.
- **Web Server**:
  - Riceve le richieste HTTP, recupera gli oggetti richiesti dal file system o li genera dinamicamente (PHP, Node.js, Python).
  - Restituisce un **messaggio di risposta HTTP (*HTTP Response*)** contenente l'oggetto.
  - Esempi: Apache, Nginx, Microsoft IIS, Caddy.

---

## Protocollo di Trasporto Sottostante: Perché TCP?

- HTTP utilizza **TCP (*Transmission Control Protocol*)** come protocollo di trasporto:
  - Il client apre una connessione TCP verso il server (porta 80 o 443).
  - Il server accetta la connessione.
  - Messaggi HTTP (richieste e risposte) vengono scambiati all'interno della connessione TCP.
  - La connessione viene chiusa (subito o al termine della sessione).
- **Perché TCP e non UDP?**
  - Le pagine web, il testo e i file **non tollerano perdite di bit** (*Loss-intolerant*).
  - TCP garantisce che nessun byte vada perso, duplicato o corrotto durante il transito.

---

## HTTP è un Protocollo Senza Stato (*Stateless*)

> **Proprietà fondamentale**: Il server HTTP non mantiene **alcuna informazione di stato (*State*)** sui client tra una richiesta e l'altra.

- Se un client richiede lo stesso oggetto due volte a distanza di un secondo, il server non ricorda la richiesta precedente e reinvia l'oggetto daccapo.
- **Vantaggi del design Stateless**:
  - **Semplicità implementativa**: il server non deve allocare risorse di memoria o database per tracciare ogni singolo visitatore.
  - **Altissima scalabilità e tolleranza ai guasti**: se un server cade e si riavvia, non si perdono sessioni di memoria attiva; le richieste successive possono essere distribuite a qualsiasi altro server in un cluster (*load balancer*).
- *(Nota: Per gestire carrelli, accessi e login si utilizzano meccanismi aggiuntivi come i **Cookie**, che vedremo nella prossima lezione).*

---

## Tipologie di Connessioni HTTP

La gestione della connessione TCP tra client e server può avvenire in due modalità:

1. **Connessioni Non Persistenti (*Non-persistent Connections*)**:
   - Ogni coppia richiesta/risposta viene trasferita su una **connessione TCP separata e dedicata**.
   - Al termine della risposta, la connessione TCP viene immediatamente chiusa.
   - Comportamento predefinito in **HTTP/1.0**.

2. **Connessioni Persistenti (*Persistent Connections*)**:
   - Più richieste e risposte possono essere scambiate attraverso **la stessa connessione TCP**.
   - La connessione rimane aperta per richieste successive, riducendo latenza e overhead.
   - Comportamento predefinito in **HTTP/1.1** e versioni successive.

---

## Connessioni Non Persistenti: Esempio Dettagliato

Immaginiamo che l'utente richieda una pagina web contenente il file HTML base e **10 immagini JPEG** ospitate sullo stesso server:

1. Il client inizializza una connessione TCP verso il server alla porta 80.
2. Viene eseguito l'handshake TCP a tre vie (*Three-way Handshake*).
3. Il client invia la richiesta HTTP per il file HTML base.
4. Il server riceve la richiesta, prepara la risposta con il file HTML e la invia.
5. Il server **chiude la connessione TCP**.
6. Il browser riceve l'HTML, lo analizza (*parsing*) e rileva i 10 riferimenti alle immagini.
7. Per **ciascuna delle 10 immagini**, il client deve **ripetere l'intero ciclo**: aprire una nuova connessione TCP, fare l'handshake, inviare la richiesta, ricevere l'immagine e chiudere la connessione!

---

## Il Costo delle Connessioni Non Persistenti: Stima del Tempo con RTT

- **RTT (*Round Trip Time*)**:
  - Il tempo impiegato da un piccolo pacchetto per viaggiare dal client al server e ritornare indietro.
- **Handshake TCP a 3 vie**:
  - Passo 1: Client invia `SYN` → Server.
  - Passo 2: Server risponde con `SYN-ACK` → Client. *(Questo scambio iniziale richiede esattamente **1 RTT**)*.
  - Passo 3: Client risponde con `ACK` e include la richiesta HTTP (`GET`).
- **Ricezione dei Dati**:
  - Il server riceve il `GET` e trasmette la risposta HTTP con l'oggetto richiesto. *(Richiede un ulteriore **1 RTT** + il tempo di trasmissione del file)*.

$$\text{Tempo Totale per Oggetto} = 2 \times \text{RTT} + \text{Tempo di Trasmissione}$$

---

## Impatto sul Tempo Totale (HTML + 10 Oggetti)

Se la pagina contiene 1 file HTML base e 10 immagini, e le connessioni non persistenti sono aperte in modo strettamente **seriale**:

$$\text{Tempo Totale} = (2 \times \text{RTT}) + 10 \times (2 \times \text{RTT}) = \mathbf{22 \times \text{RTT}} + \text{Tempi di trasmissione}$$

- **Svantaggi delle connessioni non persistenti**:
  - **Elevata latenza percepita dall'utente**: $2 \times \text{RTT}$ sprecati per ogni singolo file.
  - **Sovraccarico sul server (*Server Overhead*)**: aprire e chiudere una connessione TCP consuma buffer di memoria e variabili di controllo sul server per ogni oggetto.
- *Mitigazione parziale in HTTP/1.0*: apertura di connessioni TCP parallele (es. fino a 6 connessioni contemporanee), che tuttavia aumenta il sovraccarico di banda e CPU sul server.

---

## Connessioni Persistenti (HTTP/1.1)

- Nelle connessioni persistenti, dopo aver inviato la risposta, **il server lascia aperta la connessione TCP**.
- Le richieste successive per gli oggetti referenziati possono essere inviate **sulla connessione TCP già attiva e stabilita**!
- Non serve ripetere l'handshake TCP a tre vie per ogni oggetto.
- **Risparmio netto di tempo**:
  - Il primo oggetto (HTML) richiede $2 \times \text{RTT}$.
  - Ciascun oggetto successivo richiede solo **$1 \times \text{RTT}$** (più il tempo di trasmissione).

$$\text{Tempo Totale (senza pipelining)} = 2 \times \text{RTT} + 10 \times (1 \times \text{RTT}) = \mathbf{12 \times \text{RTT}}$$

---

## Connessioni Persistenti con Pipelining

- In **HTTP/1.1 con Pipelining**:
  - Il client non aspetta di ricevere la risposta al primo oggetto prima di inviare la richiesta per il secondo.
  - Appena analizzato l'HTML, il client invia **tutte le richieste in sequenza consecutiva** sulla stessa connessione TCP!
  - Il server risponde a tutte le richieste nell'ordine in cui sono arrivate.
- **Tempo teorico con Pipelining**:
  - Tutte le richieste viaggiano insieme: il tempo si riduce a circa **$3 \times \text{RTT}$** complessivi per l'intera pagina!
- *Tuttavia*, il pipelining ha sofferto di un grave limite: il **blocco in testa alla coda (*Head-of-Line Blocking - HoL Blocking*)**. Se il primo oggetto richiede tempo per essere calcolato o è molto grande, tutte le risposte successive rimangono bloccate in attesa!

---

## HTTP/2: Superare i Limiti di HTTP/1.1

Rilasciato nel 2015 (RFC 7540), **HTTP/2** mantiene la semantica di HTTP (metodi, header, codici di stato) ma rivoluziona il trasporto:

1. **Livello di Framing Binario (*Binary Framing Sub-layer*)**:
   - I messaggi HTTP non sono più testo semplice, ma vengono frammentati in piccoli **frame binari**.
2. **Multiplexing Completo**:
   - Richieste e risposte multiple viaggiano in parallelo come flussi (*Streams*) indipendenti e interfogliati su un'**unica connessione TCP condivisa**.
   - Risolve l'Head-of-Line blocking a livello applicativo!
3. **Prioritizzazione dei Flussi (*Stream Prioritization*)**:
   - Il client può assegnare pesi alle risorse (es. carica prima il CSS critico, poi le immagini secondarie).
4. **Compressione degli Header (HPACK)**:
   - Elimina la ridondanza degli header HTTP ripetuti in ogni richiesta.

---

## HTTP/3 e il Protocollo QUIC

- In HTTP/2, sebbene non ci sia HoL blocking applicativo, persiste l'**HoL blocking a livello TCP**:
  - Poiché tutti i flussi viaggiano su un unico canale TCP, se un singolo pacchetto TCP si perde, **tutti i flussi vengono bloccati** in attesa della ritrasmissione del pacchetto perso!
- **HTTP/3 (RFC 9114, approvato nel 2022)**:
  - Abbandona TCP e si basa su **QUIC** (*Quick UDP Internet Connections*), eseguito sopra **UDP**.
  - **Flussi multiplexati realmente indipendenti**: la perdita di un pacchetto in uno stream non blocca gli altri stream.
  - **Zero-RTT Connection Setup**: integra TLS 1.3 direttamente a livello di trasporto, consentendo l'invio di dati al primo pacchetto per server già noti.
  - Resilienza al cambio di rete (*Connection Migration* tra Wi-Fi e 4G/5G).

---

## Analisi dei Protocolli di Rete con Wireshark

- **Wireshark**:
  - Il più diffuso analizzatore di protocolli di rete open-source (*Packet Sniffer / Protocol Analyzer*).
  - Cattura i pacchetti che transitano sulla scheda di rete e li decodifica livello per livello.
- **Cosa permette di osservare su una sessione HTTP**:
  1. I pacchetti dell'handshake TCP a 3 vie (`[SYN]`, `[SYN, ACK]`, `[ACK]`).
  2. Il messaggio `GET` inviato dal browser con gli header (`Host`, `User-Agent`, `Accept`).
  3. Il codice di stato restituito dal server (es. `200 OK`, `404 Not Found`).
  4. L'incapsulamento completo: Frame Ethernet → Pacchetto IP → Segmento TCP → Messaggio HTTP.

---

## Sintesi della Lezione

- **HTTP** è il protocollo applicativo centrale del Web, basato sull'architettura **Client-Server** e sul modello di interazione **Richiesta-Risposta**.
- Le risorse sono identificate univocamente tramite **URL**.
- HTTP è storicamente un protocollo **Stateless**, progettato per la massima scalabilità.
- L'evoluzione delle connessioni ha ridotto drasticamente la latenza di caricamento delle pagine:
  - **HTTP/1.0**: connessioni non persistenti ($2 \times \text{RTT}$ per oggetto).
  - **HTTP/1.1**: connessioni persistenti ($1 \times \text{RTT}$ per oggetto).
  - **HTTP/2**: framing binario e multiplexing su singola connessione TCP.
  - **HTTP/3**: protocollo QUIC su UDP per eliminare l'HoL blocking a livello di trasporto.
- Nella prossima lezione analizzeremo il **formato dei messaggi HTTP**, la gestione dello stato tramite **Cookie** e l'ottimizzazione tramite **Web Caching**!
