# Laboratorio e Esercitazioni di Programmazione di Rete (Socket C)

Materiale didattico ufficiale, codici sorgente ed esercitazioni pratiche di laboratorio per il corso di **Reti e Programmazione Distribuita** (Prof. Alberto Finzi) - Corso di Laurea in Informatica, Università degli Studi di Napoli Federico II (A.A. 2026/2027).

Questo pacchetto raccoglie e organizza i sorgenti completi delle sessioni di laboratorio (collegate alle **Lezioni 09-13: Network Programming & Sockets**) e funge da riferimento sia per lo studio pratico sia per la preparazione della parte applicativa dell'esame.

Per chi desidera scaricare l'intero archivio in un unico pacchetto compresso, è disponibile il file [laboratorio-socket-c.zip](./laboratorio-socket-c.zip).

---

## 📂 Struttura delle Esercitazioni di Laboratorio

Le esercitazioni sono suddivise in 5 moduli tematici progressivi:

```text
esercizi/
├── 01-dns-http-whois/              # Risoluzione DNS e client applicativi TCP
│   ├── dns_lookup.c                # Risoluzione nomi/IP con getaddrinfo()
│   ├── http_unina.c                # Client HTTP minimale per richieste GET
│   ├── whois_client.c              # Client TCP per query WHOIS (porta 43)
│   ├── Makefile                    # Automazione di compilazione
│   └── README.md                   # Istruzioni d'uso ed esempi
├── 02-tcp-client-server-basic/     # Fondamenti di programmazione Client/Server TCP
│   ├── 01-basic/                   # Echo TCP elementare single-client
│   ├── 02-increment/               # Trasmissione e manipolazione di interi
│   ├── 03-sum/                     # Calcolo somma remota su connessione TCP
│   ├── 04-sum-safe/                # Gestione corretta dell'endianness (htonl/ntohl)
│   ├── 05-fork/                    # Server TCP concorrente basato su processi (fork)
│   └── README.txt                  # Guida all'esecuzione dei 5 moduli
├── 03-tcp-echo-concurrency/        # Architetture server concorrenti e avanzate
│   ├── client_basic.c              # Client TCP robusto con send_all() e recv_exact()
│   ├── server_select.c             # Multiplexing I/O monothread con select()
│   ├── server_thread.c             # Server TCP concorrente multi-thread (POSIX pthreads)
│   ├── Makefile                    # Compilazione ed eseguibili in bin/
│   └── README.md                   # Confronto tra modelli di concorrenza
├── 04-udp-client-server/           # Comunicazione non orientata alla connessione (UDP)
│   ├── 01-basic/                   # Scambio datagrammi elementare con sendto/recvfrom
│   ├── 02-implicit-bind/           # Dimostrazione dell'assegnazione porta effimera
│   ├── 03-timeout/                 # Gestione del timeout di ricezione con SO_RCVTIMEO
│   ├── 04-keyboard-one-way/        # Invio interattivo di stringhe da tastiera
│   ├── 05-keyboard-echo/           # Echo bidirezionale su datagrammi UDP
│   ├── 06-multi-client-echo/       # Gestione simultanea di client multipli nominati
│   └── README.txt                  # Istruzioni passo-passo
└── 05-broadcast-multicast/         # Comunicazione di gruppo a livello di trasporto
    ├── broadcast_sender.c          # Invio datagrammi broadcast con SO_BROADCAST
    ├── broadcast_receiver.c        # Ricevitore su indirizzo limitato o subnet
    ├── multicast_chat.c            # Chat P2P di gruppo multicast con select() e IP_ADD_MEMBERSHIP
    ├── Makefile                    # Script di compilazione
    └── README.md                   # Note teoriche sulle opzioni socket IPv4
```

---

## 🛠️ Come Compilare ed Eseguire

### Requisiti di Sistema
- **Linux** (qualsiasi distribuzione moderna: Ubuntu, Debian, Arch, Fedora) oppure **macOS**.
- Su **Windows**: è raccomandato l'uso di **WSL** (Windows Subsystem for Linux), in quanto le primitive POSIX di rete (`sys/socket.h`, `netinet/in.h`, `arpa/inet.h`, `pthreads`) sono native dell'ambiente Linux.
- Compilatore C: `gcc` o `clang` e utility `make`.

### Comandi Generali di Compilazione
All'interno di ciascuna cartella provvista di `Makefile`:
```bash
make          # Compila tutti gli eseguibili della cartella
make clean    # Elimina i file oggetto e gli eseguibili generati
```

Per i file C singoli senza Makefile (es. nelle sottocartelle `02-...` o `04-...`):
```bash
# Compilazione standard con controlli di sicurezza
gcc -std=c11 -Wall -Wextra server.c -o server
gcc -std=c11 -Wall -Wextra client.c -o client

# Nel caso di programmi multi-thread (es. server_thread):
gcc -std=c11 -Wall -Wextra -pthread server_thread.c -o server_thread
```

---

## 🎯 Guida agli Esercizi d'Esame di Reti (Finzi)

All'esame scritto/pratico di Reti e Programmazione Distribuita sono frequentemente richieste implementazioni o estensioni di client e server in C con socket POSIX. Di seguito i pattern essenziali da dominare:

### 1. Inizializzazione e Endianness
```c
struct sockaddr_in srv_addr;
memset(&srv_addr, 0, sizeof(srv_addr));
srv_addr.sin_family = AF_INET;
srv_addr.sin_port = htons(PORT);               // htons() per la porta (16 bit)
srv_addr.sin_addr.s_addr = htonl(INADDR_ANY);  // oppure inet_pton(AF_INET, ip_str, &srv_addr.sin_addr);
```

### 2. Gestione Robusta del Flusso TCP (Framing)
Poiché TCP è uno stream continuo di byte senza separatori di messaggio intrinseci, per inviare o ricevere blocchi esatti di byte è necessario iterare:
```c
// Invio garantito di tutti i byte
ssize_t send_all(int fd, const void *buf, size_t len) {
    size_t total = 0;
    while (total < len) {
        ssize_t n = send(fd, (const char *)buf + total, len - total, 0);
        if (n <= 0) return n;
        total += n;
    }
    return total;
}
```

### 3. Server Concorrente con `fork()` e Prevenzione Processi Zombie
Ogni volta che si usa `fork()` in un server di rete, occorre intercettare il segnale `SIGCHLD` per ripulire la tabella dei processi dai figli terminati (*zombie*):
```c
#include <signal.h>
#include <sys/wait.h>

void sigchld_handler(int sig) {
    (void)sig;
    // Raccoglie tutti i processi figli terminati senza bloccare (WNOHANG)
    while (waitpid(-1, NULL, WNOHANG) > 0);
}

// Nel main del server prima del ciclo accept():
struct sigaction sa;
sa.sa_handler = sigchld_handler;
sigemptyset(&sa.sa_mask);
sa.sa_flags = SA_RESTART;
sigaction(SIGCHLD, &sa, NULL);
```

### 4. Multiplexing con `select()`
Utilizzato per gestire contemporaneamente connessioni multiple e l'input da tastiera (`STDIN_FILENO`) in un singolo thread senza blocchi:
- `FD_ZERO(&set)`: azzera la maschera.
- `FD_SET(fd, &set)`: aggiunge un descrittore.
- `FD_ISSET(fd, &set)`: verifica se il descrittore è pronto dopo la chiamata a `select()`.
- Ricordare che `select()` modifica distruttivamente la maschera passata: mantenere sempre una copia `master_set` e assegnarla a `read_set` prima di ciascuna invocazione.

### 5. Timeout Socket UDP
Per evitare che un client UDP resti bloccato indefinitamente su `recvfrom()` in caso di pacchetti persi:
```c
struct timeval tv;
tv.tv_sec = 5;  // 5 secondi di timeout
tv.tv_usec = 0;
setsockopt(sockfd, SOL_SOCKET, SO_RCVTIMEO, &tv, sizeof(tv));
```

### 6. Comunicazione di Gruppo (Broadcast & Multicast)
- **Broadcast:** richiede l'opzione `SO_BROADCAST`:
  ```c
  int enable = 1;
  setsockopt(sock, SOL_SOCKET, SO_BROADCAST, &enable, sizeof(enable));
  ```
- **Multicast:** richiede l'adesione al gruppo tramite la struttura `ip_mreq` e l'opzione `IP_ADD_MEMBERSHIP`:
  ```c
  struct ip_mreq mreq;
  mreq.imr_multiaddr.s_addr = inet_addr("239.255.0.1");
  mreq.imr_interface.s_addr = htonl(INADDR_ANY);
  setsockopt(sock, IPPROTO_IP, IP_ADD_MEMBERSHIP, &mreq, sizeof(mreq));
  ```
