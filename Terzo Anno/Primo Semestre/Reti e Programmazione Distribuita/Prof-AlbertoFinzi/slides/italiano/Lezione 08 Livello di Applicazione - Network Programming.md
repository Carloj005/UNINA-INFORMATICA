---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezione 08: Il Livello di Applicazione — Programmazione di Rete (*Network Programming*)

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Creazione di Applicazioni di Rete

- Nelle lezioni precedenti abbiamo analizzato diversi protocolli applicativi consolidati (HTTP, SMTP, DNS). Ora vediamo come **progettare e implementare** nuove applicazioni di rete distribuite.
- La maggior parte delle applicazioni di rete segue il paradigma **Client-Server**:
  - Un programma in esecuzione sul lato **Client**.
  - Un programma in esecuzione sul lato **Server**.
- Quando questi due programmi vengono mandati in esecuzione, il sistema operativo genera:
  - Un **processo client**.
  - Un **processo server**.
- Questi due processi comunicano tra loro leggendo e scrivendo attraverso un'interfaccia chiamata **Socket**.

---

## Scelta dei Protocolli di Rete

Nel progettare una nuova applicazione di rete possiamo scegliere tra:

1. **Protocolli Aperti (*Open Protocols*)**:
   - Definiti in documenti RFC pubblici (es. HTTP, SMTP).
   - Garantiscono l'interoperabilità tra implementazioni scritte da sviluppatori diversi su sistemi eterogenei.
2. **Protocolli Proprietari (*Proprietary Protocols*)**:
   - Specifiche private non pubblicate in standard aperti.
   - Utilizzati per servizi proprietari (es. vecchie versioni di Skype, Zoom).

### Scelta del Protocollo di Trasporto Sottostante:
- **TCP (*Transmission Control Protocol*)**:
  - Orientato alla connessione (*Connection-oriented*).
  - Canale affidabile basato su flusso di byte (*Byte-stream*).
  - Controllo di flusso, congestione e ritrasmissione delle perdite.
- **UDP (*User Datagram Protocol*)**:
  - Senza connessione (*Connectionless*).
  - Invio di datagrammi indipendenti senza garanzie di consegna, ordinamento o integrità temporale (*Best-effort*).

---

## Il Ruolo dei Socket nella Comunicazione

- I **Socket** rappresentano l'elemento centrale per la creazione di applicazioni distribuite.
- Fungono da interfaccia tra il codice applicativo (nello spazio utente) e lo stack di rete del sistema operativo (*Transport* e *Network Layer*).
- Agiscono come un'astrazione a "scatola nera" (*Black-box*): lo sviluppatore scrive sul socket, e il kernel gestisce l'incapsulamento TCP/IP e la trasmissione su scheda di rete.

```
+----------------------------------------------------+
| Applicazione Utente (Spazio Utente / User Space)   |
+----------------------------------------------------+
                          |
             [ Interfaccia Socket API ]
                          v
+----------------------------------------------------+
| Livello di Trasporto (TCP / UDP)   - Kernel OS      |
+----------------------------------------------------+
| Livello di Rete (IP)               - Kernel OS      |
+----------------------------------------------------+
| Livello Collegamento + Fisico      - Scheda di Rete |
+----------------------------------------------------+
```

- Esistono librerie di middleware di livello più alto (RPC, gRPC, REST, WebSocket), ma le API socket BSD native rimangono lo standard de facto alla base di tutto.

---

## Modelli di Comunicazione: Con Connessione vs Senza Connessione

La comunicazione di rete si suddivide in due paradigmi architetturali fondamentali:

```
    SENZA CONNESSIONE (UDP)                    CON CONNESSIONE (TCP)
  Client                Server             Client                Server
    |                      |                 |                      |
[Crea Socket]        [Crea Socket]     [Crea Socket]        [Crea Welcoming Socket]
    |                      |                 |                      |
    |                 [Bind Porta]           |                 [Bind Porta]
    |                      |                 |                      |
    |                      |                 |                 [Listen & Wait]
    |                      |                 |                      |
    |---- Sendto --------->|                 |---- Connect (3WH) -->|
    |                      |                 |                      v
    |<--- Recvfrom --------|                 |             [Crea Client Socket]
    |                      |                 |                      |
    |                      |                 |---- Send ----------->|
 [Close]                [Close]              |<--- Read ------------|
                                             |                      |
                                          [Close]                [Close]
```

- In **UDP**: nessun preavviso; ogni messaggio è autonomo (*Datagram*).
- In **TCP**: è richiesta una fase di negoziazione preventiva (*Three-way Handshake*) prima di poter scambiare dati.

---

## Standardizzazione delle Socket API

- Le API per la gestione dei socket sono disponibili in quasi tutti i linguaggi di programmazione moderni:
  - C, C++, C#, Java, Python, Go, Rust, ecc.
- Nei sistemi UNIX/Linux l'implementazione di riferimento è costituita dalle **Berkeley Sockets** (o *POSIX Sockets*), scritte nativamente in **C**.
- Principi cardine delle socket POSIX:
  - Rispettano la filosofia UNIX: **"Everything is a file"** (*Tutto è un file*).
  - Un socket è identificato da un **File Descriptor** intero (`sockfd`).
  - È possibile utilizzare primitive standard di I/O (come `read()`, `write()`, `close()`) direttamente sui descrittori di socket TCP.

---

## Strutture Dati di Rete in C: `sockaddr_in`

Per definire indirizzi IP e porte nei socket di dominio Internet IPv4 (`AF_INET`), si utilizzano le strutture header `<netinet/in.h>` e `<arpa/inet.h>`:

```c
#include <netinet/in.h>
#include <arpa/inet.h>
#include <sys/types.h>

struct sockaddr_in {
    short            sin_family;   // Famiglia indirizzo: AF_INET (IPv4)
    unsigned short   sin_port;     // Numero di porta in Network Byte Order (es. htons(8080))
    struct in_addr   sin_addr;     // Struttura contenente l'indirizzo IP
    char             sin_zero[8];  // Padding a zeri per allineare la dimensione a struct sockaddr
};

struct in_addr {
    unsigned long    s_addr;       // Indirizzo IPv4 a 32 bit (es. INADDR_ANY o inet_addr("192.168.1.1"))
};
```

- **Nota sui Byte Order**: la rete utilizza il formato *Big-Endian* (**Network Byte Order**), mentre i processori x86 usano *Little-Endian*. Funzioni come `htons()` (*Host to Network Short*) e `htonl()` convertono i valori numerici.

---

## Creazione di un Socket: la funzione `socket()`

Per creare un nuovo canale di comunicazione si invoca la funzione di sistema:

```c
#include <sys/socket.h>

int sockfd = socket(int domain, int type, int protocol);
```

### Parametri:
- **`domain`**: specifica la famiglia di protocolli:
  - `AF_INET`: protocolli IPv4.
  - `AF_INET6`: protocolli IPv6.
- **`type`**: definisce il tipo di semantica di trasporto:
  - `SOCK_STREAM`: canale affidabile, bidirezionale e orientato alla connessione su flusso di byte (**TCP**).
  - `SOCK_DGRAM`: canale a datagrammi non affidabili e senza connessione (**UDP**).
- **`protocol`**: protocollo specifico all'interno della famiglia (solitamente impostato a `0` per selezionare il protocollo di default corrispondente a `type`).
- **Valore di ritorno (`sockfd`)**: intero che rappresenta il descrittore del socket creato; restituisce `-1` in caso di errore.

---

## Associazione a Porta e Indirizzo: la funzione `bind()`

Associa il socket generato a uno specifico indirizzo IP locale e a una determinata porta:

```c
#include <sys/socket.h>

int val = bind(int socket, const struct sockaddr *address, socklen_t address_len);
```

### Parametri e Comportamento:
- **`socket`**: il descrittore del socket da associare.
- **`address`**: puntatore a una struttura `sockaddr` (ottenuta mediante cast da `struct sockaddr_in`).
- **`address_len`**: dimensione in byte della struttura indirizzo (`sizeof(servaddr)`).
- **Valore di ritorno**: `0` in caso di successo, `-1` se si verifica un errore.

> **Importanza**:
> - **Lato Server**: `bind()` è **obbligatorio**, poiché i client devono contattare il servizio su una porta ben nota (*Well-known port*). Con `INADDR_ANY` il server si mette in ascolto su tutte le interfacce di rete attive.
> - **Lato Client**: `bind()` è solitamente **omesso**: il kernel assegna in automatico una porta effimera (*Ephemeral port*) libera.

---

## Comunicazione UDP: `sendto()` e `recvfrom()`

Poiché in UDP non esiste una connessione stabilita, ogni singola operazione di trasmissione e ricezione deve specificare esplicitamente l'indirizzo del destinatario o sorgente:

```c
#include <sys/socket.h>

int ob = sendto(int osock, const void *obuf, size_t olen, int oflags, 
                const struct sockaddr *oaddr, socklen_t oaddr_len);

int ib = recvfrom(int isock, void *ibuf, size_t ilen, int iflags, 
                  struct sockaddr *iaddr, socklen_t *iaddr_len);
```

- **`osock` / `isock`**: descrittore del socket UDP.
- **`obuf` / `ibuf`**: buffer contenente i dati da trasmettere o in cui memorizzare i dati ricevuti.
- **`olen` / `ilen`**: lunghezza massima del buffer in byte.
- **`oflags` / `iflags`**: flag speciali (tipicamente `0` o `MSG_WAITALL`).
- **`oaddr` / `iaddr`**: struttura contenente l'indirizzo di destinazione (in `sendto`) o l'indirizzo del mittente mittente registrato (in `recvfrom`).
- **Valore di ritorno**: numero di byte effettivamente spediti o letti (`-1` in caso di fallimento).

---

## Chiusura del Socket: la funzione `close()`

Al termine delle comunicazioni, le risorse associate al descrittore nel kernel devono essere liberate:

```c
#include <unistd.h>

int val = close(int socket);
```

- **`socket`**: descrittore del socket da chiudere.
- **`val`**: restituisce `0` in caso di successo, `-1` in caso di errore.
- **Effetto nei protocolli**:
  - In **UDP**: rilascia immediatamente la porta effimera e le risorse del buffer kernel.
  - In **TCP**: avvia la sequenza standard di chiusura della connessione (*Four-Way Handshake* con invio del segmento `FIN`).

---

## Esempio Completo Socket UDP in C/C++: Client e Server

```c
// CLIENT UDP
int main() {
    int sockfd;
    char buffer[1024];
    const char *hello = "Hello from client";
    struct sockaddr_in servaddr;
    sockfd = socket(AF_INET, SOCK_DGRAM, 0);

    memset(&servaddr, 0, sizeof(servaddr));
    servaddr.sin_family = AF_INET;
    servaddr.sin_port = htons(8080);
    servaddr.sin_addr.s_addr = inet_addr("127.0.0.1");

    sendto(sockfd, hello, strlen(hello), 0, (struct sockaddr *)&servaddr, sizeof(servaddr));
    socklen_t len = sizeof(servaddr);
    int n = recvfrom(sockfd, buffer, 1024, 0, (struct sockaddr *)&servaddr, &len);
    buffer[n] = '\0';
    printf("Risposta Server: %s\n", buffer);
    close(sockfd);
    return 0;
}
```

```c
// SERVER UDP
int main() {
    int sockfd;
    char buffer[1024];
    const char *reply = "Hello from server";
    struct sockaddr_in servaddr, cliaddr;
    sockfd = socket(AF_INET, SOCK_DGRAM, 0);

    memset(&servaddr, 0, sizeof(servaddr));
    servaddr.sin_family = AF_INET;
    servaddr.sin_addr.s_addr = INADDR_ANY;
    servaddr.sin_port = htons(8080);
    bind(sockfd, (struct sockaddr *)&servaddr, sizeof(servaddr));

    socklen_t len = sizeof(cliaddr);
    int n = recvfrom(sockfd, buffer, 1024, 0, (struct sockaddr *)&cliaddr, &len);
    buffer[n] = '\0';
    printf("Messaggio ricevuto dal Client: %s\n", buffer);
    sendto(sockfd, reply, strlen(reply), 0, (struct sockaddr *)&cliaddr, len);
    close(sockfd);
    return 0;
}
```

---

## Transizione da UDP a TCP: Architettura a Due Socket

A differenza di UDP, in **TCP** client e server devono completare un accordo preventivo (*Handshake*) a livello di trasporto prima di poter scambiare qualsiasi byte di dati.

Sul server TCP operano **due tipologie distinte di socket**:
1. **Socket di Ascolto (*Welcoming Socket*)**:
   - Creato all'avvio del server e associato alla porta pubblica (`bind`).
   - Sempre attivo in attesa di richieste di connessione in ingresso da nuovi client.
   - Non trasmette mai dati applicativi: gestisce solo l'handshake.
2. **Socket Dedicato al Client (*Connection Socket*)**:
   - Creato dinamicamente dal kernel ogni volta che una connessione viene accettata (`accept`).
   - Dedicato esclusivamente alla sessione di comunicazione con quello specifico client.
   - Permette al server di gestire più client in parallelo (es. fork, thread, I/O multiplexing).

> Il *Three-Way Handshake* viene eseguito interamente e in modo trasparente dal livello di trasporto del sistema operativo.

---

## Connessione TCP lato Client: la funzione `connect()`

Il client avvia l'handshake a 3 vie verso l'indirizzo e la porta del server mediante la funzione:

```c
#include <sys/socket.h>

int val = connect(int socket, const struct sockaddr *address, socklen_t address_len);
```

### Parametri:
- **`socket`**: descrittore del socket TCP client (creato con `SOCK_STREAM`).
- **`address`**: puntatore alla struttura `sockaddr_in` contenente IP e porta del server a cui connettersi.
- **`address_len`**: dimensione della struttura (`sizeof(servaddr)`).
- **Valore di ritorno**:
  - Restituisce `0` se la connessione ha avuto successo (handshake completato).
  - Restituisce `-1` in caso di rifiuto della connessione (*Connection refused*), timeout o host irraggiungibile.

---

## Ricezione Connessioni TCP lato Server: `listen()` e `accept()`

Sul server, l'accettazione delle connessioni avviene in due fasi distinte:

```
Client 1: connect() ---> [     CODA DI BACKLOG     ] ---> accept() ---> Nuovo Socket Dedicato
Client 2: connect() ---> [ Connessioni in attesa   ]                    per lo scambio dati
Client 3: connect() ---> [ di essere accettate...  ]
```

### 1. `listen()`: predispone la coda di attesa
```c
int val = listen(int socket, int backlog);
```
- Configura il socket come passivo (welcoming socket).
- **`backlog`**: numero massimo di connessioni pendenti memorizzabili nella coda kernel prima che nuove richieste vengano scartate.

### 2. `accept()`: estrae la prima connessione ed apre il socket dedicato
```c
int new_sockfd = accept(int socket, struct sockaddr *address, socklen_t *address_len);
```
- È una chiamata **bloccante**: sospende il processo finché un client non si connette.
- Restituisce un **nuovo file descriptor (`new_sockfd`)** riservato a quella specifica connessione.
- Valorizza `address` con i dettagli dell'host client appena connesso.

---

## Trasmissione e Ricezione TCP: `send()` e `read()` / `recv()`

Una volta stabilita la connessione, client e server possono trasmettere e ricevere byte senza dover specificare nuovamente indirizzi e porte:

```c
#include <sys/socket.h>
int ob = send(int osock, const void *obuf, size_t olen, int flags);

#include <unistd.h>
int ib = read(int isock, void *ibuf, size_t ilen);
// In alternativa:
// int ib = recv(int isock, void *ibuf, size_t ilen, int flags);
```

- **Semantica di Stream (*Byte Stream*)**:
  - TCP non preserva i confini dei messaggi applicativi. I dati inviati con più chiamate `send()` possono essere ricevuti con un'unica chiamata `read()`, o viceversa.
  - È responsabilità del livello applicativo frammentare o delimitare i messaggi (es. tramite sequenze `\r\n` o prefissi con lunghezza del messaggio).

---

## Esempio Completo Socket TCP in C/C++: Client e Server

```c
// CLIENT TCP
int main() {
    int sockfd;
    char buffer[1024];
    struct sockaddr_in servaddr;
    sockfd = socket(AF_INET, SOCK_STREAM, 0);

    servaddr.sin_family = AF_INET;
    servaddr.sin_port = htons(8080);
    servaddr.sin_addr.s_addr = inet_addr("127.0.0.1");

    connect(sockfd, (struct sockaddr *)&servaddr, sizeof(servaddr));
    send(sockfd, "Hello from client", 17, 0);
    int n = read(sockfd, buffer, 1024);
    buffer[n] = '\0';
    printf("Server response: %s\n", buffer);
    close(sockfd);
    return 0;
}
```

```c
// SERVER TCP
int main() {
    int welcome_sock, client_sock;
    char buffer[1024];
    struct sockaddr_in servaddr, cliaddr;
    welcome_sock = socket(AF_INET, SOCK_STREAM, 0);

    servaddr.sin_family = AF_INET;
    servaddr.sin_addr.s_addr = INADDR_ANY;
    servaddr.sin_port = htons(8080);
    bind(welcome_sock, (struct sockaddr *)&servaddr, sizeof(servaddr));

    listen(welcome_sock, 5);
    socklen_t addrlen = sizeof(cliaddr);
    client_sock = accept(welcome_sock, (struct sockaddr *)&cliaddr, &addrlen);

    int n = read(client_sock, buffer, 1024);
    buffer[n] = '\0';
    printf("Ricevuto: %s\n", buffer);
    send(client_sock, "Hello from server", 17, 0);

    close(client_sock);     // Chiude la connessione con il client
    close(welcome_sock);    // Chiude il server in ascolto
    return 0;
}
```

---

## Riepilogo Funzioni Socket: Confronto UDP vs TCP

| Fase del Ciclo di Vita | UDP (*Connectionless*) | TCP (*Connection-oriented*) |
| :--- | :--- | :--- |
| **Creazione Socket** | `socket(AF_INET, SOCK_DGRAM, 0)` | `socket(AF_INET, SOCK_STREAM, 0)` |
| **Associazione Indirizzo/Porta** | `bind()` (lato server) | `bind()` (lato server) |
| **Predisposizione Ascolto** | Non presente | `listen()` (server, apre coda backlog) |
| **Attesa Connessioni** | Non presente | `accept()` (server, restituisce nuovo socket) |
| **Apertura Connessione** | Non presente | `connect()` (client, 3-way handshake) |
| **Invio Dati** | `sendto()` (specifica indirizzo) | `send()` / `write()` (su socket connesso) |
| **Ricezione Dati** | `recvfrom()` (cattura mittente) | `recv()` / `read()` (stream di byte) |
| **Chiusura** | `close()` | `close()` (chiude canale e invia FIN) |

> La conoscenza dei socket è essenziale per comprendere il comportamento interno dei livelli di Trasporto e Rete trattati nelle prossime lezioni.
