---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezioni 09-13: Il Livello di Applicazione
### Programmazione di Rete con Socket POSIX in C (TCP, UDP, Concorrenza e Multiplexing)

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Introduzione alla Socket API

- Una **socket** è l'interfaccia standard (API) fornita dal sistema operativo tra l'applicazione (*User Space*) e lo stack dei protocolli di trasporto/rete (*Kernel Space*).
- Identificata dalla tupla:  
  $$\text{Endpoint} = \langle \text{Indirizzo IP}, \text{Porta}, \text{Protocollo di Trasporto} \rangle$$
- Nei sistemi operativi POSIX/UNIX, le socket sono trattate come **descrittori di file** (*file descriptor*), consentendo l'uso di primitive di I/O standard oltre a quelle dedicate.

---

## Tipologie di Socket

1. **Stream Socket (`SOCK_STREAM` - TCP)**:
   - Basate sul protocollo TCP (orientate alla connessione).
   - Canale affidabile, bidirezionale (*full-duplex*), con consegna garantita e ordinata dei dati sotto forma di flusso continuo di byte (*byte-stream*).

2. **Datagram Socket (`SOCK_DGRAM` - UDP)**:
   - Basate sul protocollo UDP (senza connessione).
   - Trasferimento di datagrammi indipendenti e non affidabili (possibile perdita, duplicazione o disordinamento), ma senza overhead di handshake o controllo congestione.

---

## Strutture Dati di Indirizzamento (IPv4)

```c
#include <netinet/in.h>

struct in_addr {
    in_addr_t s_addr;          // Indirizzo IPv4 a 32 bit (network byte order)
};

struct sockaddr_in {
    sa_family_t    sin_family; // AF_INET per IPv4
    in_port_t      sin_port;   // Porta a 16 bit (network byte order)
    struct in_addr sin_addr;   // Struttura indirizzo IP
    char           sin_zero[8];// Padding per allineamento a sockaddr generica
};
```

- Prima dell'uso, la struttura deve sempre essere inizializzata a zero con `memset(&addr, 0, sizeof(addr))`.

---

## Endianness e Conversione di Formato

Architetture diverse usano ordini diversi dei byte:
- **Host Byte Order (x86/ARM):** Tipicamente *Little-Endian* (byte meno significativo all'indirizzo più basso).
- **Network Byte Order (Standard Internet):** Sempre *Big-Endian* (byte più significativo per primo).

### Funzioni di Conversione:
- `htons()` / `ntohs()`: *Host to Network / Network to Host Short* (16 bit per le **porte**).
- `htonl()` / `ntohl()`: *Host to Network / Network to Host Long* (32 bit per **indirizzi IP e interi**).

### Conversione Indirizzi Testo $\leftrightarrow$ Binario:
- `inet_pton(AF_INET, "127.0.0.1", &addr.sin_addr)` (*presentation to numeric*)
- `inet_ntop(AF_INET, &addr.sin_addr, buffer, sizeof(buffer))` (*numeric to presentation*)

---

## Ciclo di Vita del Socket TCP

```text
       SERVER TCP                                CLIENT TCP
  socket() [crea descrittore]                socket()
         ↓                                      ↓
  bind()   [associa IP/Porta]                   |
         ↓                                      |
  listen() [apre coda connessioni]              |
         ↓                                      ↓
  accept() [bloccante in attesa]  ←───────  connect() [3-way handshake]
         │ (crea client_fd)                     │
         ├──────────────────────────────────────┤
         │ ←───────── send() / recv() ────────→ │ [scambio dati bidirezionale]
         ├──────────────────────────────────────┤
         ↓                                      ↓
  close(client_fd)                          close(sock_fd)
```

---

## Primitive Fondamentali TCP in C

```c
// 1. Creazione Socket
int fd = socket(AF_INET, SOCK_STREAM, 0);

// 2. Associazione all'indirizzo locale (Server)
bind(fd, (struct sockaddr*)&srv_addr, sizeof(srv_addr));

// 3. Messa in ascolto (Server)
listen(fd, BACKLOG); // BACKLOG: max richieste pendenti

// 4. Connessione al Server (Client)
connect(fd, (struct sockaddr*)&srv_addr, sizeof(srv_addr));

// 5. Accettazione connessione in ingresso (Server)
struct sockaddr_in cli_addr;
socklen_t cli_len = sizeof(cli_addr);
int client_fd = accept(fd, (struct sockaddr*)&cli_addr, &cli_len);
```

---

## Ciclo di Vita e Primitive UDP

A differenza di TCP, UDP non stabilisce una connessione: ciascun datagramma è inviato specificando esplicitamente la destinazione ad ogni chiamata.

```c
// Creazione socket UDP
int udp_fd = socket(AF_INET, SOCK_DGRAM, 0);

// Invio di un datagramma
ssize_t n = sendto(udp_fd, buffer, len, 0,
                   (struct sockaddr*)&dest_addr, sizeof(dest_addr));

// Ricezione di un datagramma
struct sockaddr_in src_addr;
socklen_t src_len = sizeof(src_addr);
ssize_t r = recvfrom(udp_fd, buffer, sizeof(buffer), 0,
                     (struct sockaddr*)&src_addr, &src_len);
```

- Nel client, se non si chiama `bind()`, il sistema operativo assegna automaticamente una porta effimera (*implicit bind*) alla prima `sendto()`.

---

## Flusso a Byte Stream vs Framing TCP

- **TCP non preserva i confini dei messaggi:** Una singola chiamata `recv()` può restituire mezzo messaggio, un messaggio intero o parti di messaggi consecutivi.
- **Strategie di Framing:**
  1. *Lunghezza prefissata (Fixed-length header)*: si invia prima un intero a 4 byte (in *network byte order*) che indica la dimensione del payload.
  2. *Delimitatori espliciti*: terminare ogni messaggio con `\n` o `\r\n`.

### Helper di Trasmissione Affidabile:
```c
ssize_t send_all(int fd, const void *buf, size_t len) {
    size_t total = 0;
    while (total < len) {
        ssize_t n = send(fd, (const char*)buf + total, len - total, 0);
        if (n <= 0) return n;
        total += n;
    }
    return total;
}
```

---

## Modelli di Concorrenza nei Server

Un server *iterativo* gestisce un solo client per volta, bloccando tutti gli altri. Per servire più client contemporaneamente si adottano 3 modelli:

1. **Multi-Processo (`fork()`):**
   - Per ogni connessione accettata, il server crea un processo figlio con il proprio spazio di indirizzamento isolato.
2. **Multi-Thread (`pthread`):**
   - Viene creato un thread concorrente che condivide memoria, variabili globali e file descriptor col processo padre.
3. **Multiplexing I/O Monothread (`select()` / `epoll()`):**
   - Un unico thread monitora un insieme di descrittori di file e reagisce solo quando diventano pronti per la lettura/scrittura.

---

## Concorrenza Multi-Processo (`fork()`)

```c
while (1) {
    int client_fd = accept(listen_fd, ...);
    pid_t pid = fork();
    if (pid == 0) {
        // PROCESSO FIGLIO
        close(listen_fd);      // Chiude il socket passivo
        handle_client(client_fd);
        close(client_fd);
        exit(0);
    }
    // PROCESSO PADRE
    close(client_fd);          // Il padre cede il controllo al figlio
}
```

### Gestione dei Processi Zombie:
Installare un gestore del segnale `SIGCHLD`:
```c
signal(SIGCHLD, sigchld_handler);
// Nell'handler: while (waitpid(-1, NULL, WNOHANG) > 0);
```

---

## Concorrenza Multi-Thread (`pthread`)

```c
void *worker_thread(void *arg) {
    int client_fd = *(int*)arg;
    free(arg); // Libera la memoria allocata dinamicamente
    pthread_detach(pthread_self()); // Rilascio automatico risorse alla terminazione
    
    handle_client(client_fd);
    close(client_fd);
    return NULL;
}

// Nel ciclo del server:
int *arg = malloc(sizeof(int));
*arg = accept(listen_fd, ...);
pthread_t tid;
pthread_create(&tid, NULL, worker_thread, arg);
```

- Più leggero del processo figlio in termini di memoria e context-switch, ma richiede sincronizzazione (*mutex*) se si accede a risorse condivise.

---

## Multiplexing I/O con `select()`

`select()` consente a un processo di monitorare simultaneamente più socket e `stdin` senza creare thread o processi:

```c
fd_set read_fds, master_set;
FD_ZERO(&master_set);
FD_SET(listen_fd, &master_set);
int max_fd = listen_fd;

while (1) {
    read_fds = master_set; // Ripristina la maschera (modificata da select)
    select(max_fd + 1, &read_fds, NULL, NULL, NULL);

    if (FD_ISSET(listen_fd, &read_fds)) {
        int new_fd = accept(listen_fd, ...);
        FD_SET(new_fd, &master_set);
        if (new_fd > max_fd) max_fd = new_fd;
    }
    // Itera sugli altri fd per leggere dati con recv()
}
```

---

## Opzioni Socket Avanzate (`setsockopt`)

- **`SO_REUSEADDR`:** Evita l'errore `Address already in use` se il server viene riavviato prima della scadenza dello stato `TIME_WAIT`:
  ```c
  int opt = 1;
  setsockopt(fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
  ```
- **`SO_RCVTIMEO`:** Imposta un timeout massimo per le chiamate bloccanti di ricezione (`recv` / `recvfrom`):
  ```c
  struct timeval tv = {.tv_sec = 5, .tv_usec = 0};
  setsockopt(fd, SOL_SOCKET, SO_RCVTIMEO, &tv, sizeof(tv));
  ```
- **`SO_BROADCAST`:** Abilita la trasmissione di datagrammi broadcast su reti IPv4 locali (`255.255.255.255`).

---

## Multicast Group Chat con `IP_ADD_MEMBERSHIP`

- **Multicast IPv4:** Permette di trasmettere un datagramma a tutti i nodi iscritti a uno specifico gruppo di classe D (`224.0.0.0` - `239.255.255.255`).

```c
struct ip_mreq mreq;
mreq.imr_multiaddr.s_addr = inet_addr("239.255.0.1"); // Indirizzo di gruppo
mreq.imr_interface.s_addr = htonl(INADDR_ANY);        // Interfaccia locale

setsockopt(sock, IPPROTO_IP, IP_ADD_MEMBERSHIP, &mreq, sizeof(mreq));
```

- **`IP_MULTICAST_TTL`:** Impostato a `1` per limitare il traffico alla sottorete locale (non instradato dai router).
- **`IP_MULTICAST_LOOP`:** Abilita o disabilita il loopback locale dei pacchetti inviati.

---

## Riepilogo e Raccomandazioni per l'Esame

1. **Controllare sempre i valori di ritorno:** Ogni funzione di sistema (`socket`, `bind`, `listen`, `accept`, `send`, `recv`) restituisce `-1` in caso di errore; usare `perror()` per visualizzare la causa.
2. **Attenzione alla byte order:** Porte sempre con `htons()`/`ntohs()`, interi nei pacchetti sempre con `htonl()`/`ntohl()`.
3. **Gestione del descrittore:** Chiudere sempre i socket non più utilizzati per non esaurire le risorse del kernel.
4. **Concorrenza:** Scegliere il modello appropriato (fork, thread, select) in base al testo della prova d'esame.
5. **Framing TCP:** Non assumere mai che un intero messaggio arrivi in una sola `recv()`.
