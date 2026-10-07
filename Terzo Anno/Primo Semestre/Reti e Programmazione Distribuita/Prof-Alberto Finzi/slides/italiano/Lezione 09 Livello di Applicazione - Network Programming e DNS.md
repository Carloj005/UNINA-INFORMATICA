---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezione 09: Il Livello di Applicazione — Programmazione di Rete e DNS

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Creazione di Applicazioni di Rete e Socket

- I **Socket** sono il pilastro per l'interazione tra i processi applicativi distribuiti su Internet.
- Operano come un'interfaccia a "scatola nera" (*Black-box*) che astrae e gestisce la complessità del:
  - **Livello di Trasporto** (TCP / UDP).
  - **Livello di Rete** (IP).
- Esistono diversi framework e middleware di livello più alto che incapsulano i socket, ma comprendere le primitive standard a basso livello (Berkeley / POSIX Sockets) è indispensabile per dominare il networking.

```
+---------------------------------------------------------+
|                  Applicazione Utente                    |
+---------------------------------------------------------+
                             |
                   [ Socket API (POSIX) ]
                             v
+---------------------------------------------------------+
|  Sistema Operativo (Kernel): Trasporto (TCP/UDP) + Rete |
+---------------------------------------------------------+
|              Hardware (Scheda di Rete NIC)              |
+---------------------------------------------------------+
```

---

## Ciclo di Vita della Comunicazione: UDP vs TCP

```
        SENZA CONNESSIONE (UDP)                           CON CONNESSIONE (TCP)
     Client                Server                     Client                Server
        |                     |                          |                     |
     socket()              socket()                   socket()              socket()
        |                     |                          |                     |
        |                  bind()                        |                  bind()
        |                     |                          |                     |
        |                  recvfrom() [attesa]           |                  listen()
        |                     ^                          |                     |
     sendto() ----------------|                          |                  accept() [bloccata]
        |                                                |                     ^
     recvfrom() <------------- sendto()               connect() -------------->| (3-way handshake)
        |                                                |                     v
     close()               close()                       |              [Nuovo socket creato]
                                                         |                     |
                                                      send() -----------------> read()
                                                      read() <----------------- send()
                                                         |                     |
                                                      close() ----------------> read() [EOF / release]
                                                                               close()
```

---

## Dettaglio Flusso Socket UDP (*Connectionless*)

In una comunicazione UDP:
1. Sia il client sia il server aprono un descrittore socket con `socket(AF_INET, SOCK_DGRAM, 0)`.
2. Il server associa obbligatoriamente il socket a una porta locale con `bind()`.
3. Il server si mette in attesa invocando `recvfrom()`: la chiamata rimane bloccata finché non arriva un datagramma.
4. Il client invia il datagramma specificando l'indirizzo e la porta del server con `sendto()`.
5. Il server riceve il datagramma e cattura l'indirizzo del mittente tramite la struttura compilata da `recvfrom()`.
6. Il server può rispondere immediatamente al client con `sendto()`.
7. Client e server possono scambiarsi ripetutamente datagrammi iterando su `sendto()` / `recvfrom()`.
8. Al termine, entrambi invocano `close()` per liberare le risorse di sistema.

> Se il client chiude il socket, il server rimane regolarmente in ascolto e può continuare a servire richieste provenienti da altri client.

---

## Dettaglio Flusso Socket TCP (*Connection-oriented*)

In una comunicazione TCP:
1. Client e server creano il socket (`SOCK_STREAM`). Il server effettua il `bind()` e abilita la coda con `listen()`.
2. Il server invoca `accept()` e si sospende in attesa di connessioni.
3. Il client invoca `connect()`, avviando il **Three-Way Handshake** gestito dal sistema operativo.
4. Ad handshake completato, `accept()` si sblocca e restituisce un **nuovo descrittore socket dedicato** al client.
5. Client e server comunicano scambiandosi flussi di byte con `send()` e `read()`.
6. Chiusura ordinata (*Connection Release*):
   - Il client invoca `close()`, inviando il pacchetto `FIN`.
   - Il server legge `0` byte con `read()` (indicatore di *End-Of-File*), capisce che il client ha terminato, chiude il socket dedicato con `close()` e torna in `accept()` per accogliere nuovi client.

> Una corretta chiusura previene il persistere dei descrittori nello stato `TIME_WAIT` ed evita il blocco temporaneo della porta.

---

## La Risoluzione dei Nomi: Integrazione del DNS nei Socket

- I socket di rete Berkeley lavorano esclusivamente a livello di trasporto e rete: accettano e richiedono **indirizzi IP binari/numerici a 32 bit**.
- Gli utenti e le applicazioni ad alto livello utilizzano invece **nomi simbolici mnemonici (*Hostname*)**, come `www.unina.it` o `google.com`.
- Prima di poter invocare `connect()` o `sendto()`, il programma applicativo deve interrogare il DNS per convertire l'hostname nel relativo indirizzo IP.

```
       Applicazione Client
                |
                | 1. gethostbyname("www.unina.it")
                v
       Resolver Locale / Server DNS
                |
                | 2. Risoluzione IP (es. 143.225.161.30)
                v
       Applicazione Client
                |
                | 3. connect(sockfd, 143.225.161.30:80)
                v
       Web Server Remoto
```

---

## La Struttura `hostent` in C/C++

La funzione tradizionale di risoluzione DNS in ambiente POSIX è `gethostbyname()`, che popola la struttura dati `hostent` definita nell'header `<netdb.h>`:

```c
#include <netdb.h>

struct hostent {
    char   *h_name;       // Nome canonico ufficiale dell'host
    char  **h_aliases;    // Vettore di puntatori a nomi alias alternativi (terminato da NULL)
    int     h_addrtype;   // Famiglia dell'indirizzo (AF_INET per IPv4)
    int     h_length;     // Lunghezza dell'indirizzo in byte (4 byte per IPv4)
    char  **h_addr_list;  // Vettore di puntatori agli indirizzi IP (terminato da NULL)
};

// Macro di compatibilità per accedere direttamente al primo indirizzo IP restituito:
#define h_addr h_addr_list[0]
```

- Un server ad alto traffico può restituire **più indirizzi IP** (*Round-Robin DNS* per bilanciamento del carico).
- Per connettersi è sufficiente estrarre il primo indirizzo utile (`h_addr_list[0]`).

---

## La Primitiva di Risoluzione: `gethostbyname()`

```c
#include <netdb.h>

struct hostent *host_info = gethostbyname(const char *name);
```

### Parametri e Ritorno:
- **`name`**: stringa contenente il nome mnemonico dell'host da risolvere (es. `"www.unina.it"`).
- **`host_info`**: puntatore alla struttura `hostent` contenente le informazioni restituite dal DNS.
  - Se la risoluzione fallisce (es. host non trovato, rete assente), restituisce `NULL` ed imposta il codice di errore nella variabile globale `h_errno`.

### Risoluzione Inversa:
- La funzione complementare **`gethostbyaddr()`** consente di eseguire il percorso inverso (*Reverse DNS Lookup*): dato un indirizzo IP binario, interroga il DNS per ottenere il nome mnemonico canonico dell'host associato.

---

## Esempio C++: Risoluzione DNS di un Hostname (1/2)

```cpp
#include <iostream>
#include <cstring>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <netdb.h>

int main(int argc, char **argv) {
    if (argc < 2) {
        std::cout << "Uso: " << argv[0] << " <hostname>" << std::endl;
        return 1;
    }

    const char *server_name = argv[1];
    struct hostent *server_info = gethostbyname(server_name);

    if (server_info == NULL) {
        std::cerr << "Impossibile risolvere l'hostname: " << server_name << std::endl;
        return 1;
    }
```

---

## Esempio C++: Risoluzione DNS di un Hostname (2/2)

```cpp
    // Stampa del Nome Canonico
    std::cout << "Nome Canonico: " << server_info->h_name << std::endl;

    // Stampa degli eventuali Alias
    std::cout << "Alias:" << std::endl;
    for (int i = 0; server_info->h_aliases[i] != NULL; ++i) {
        std::cout << "\t- " << server_info->h_aliases[i] << std::endl;
    }

    // Stampa degli Indirizzi IP associati
    std::cout << "Indirizzi IP:" << std::endl;
    for (int i = 0; server_info->h_addr_list[i] != NULL; ++i) {
        // Conversione da formato binario di rete a notazione decimale puntata
        struct in_addr *addr = (struct in_addr *)server_info->h_addr_list[i];
        std::cout << "\t- " << inet_ntoa(*addr) << std::endl;
    }

    return 0;
}
```

---

## Esempio Completo: Client HTTP da zero con Berkeley Sockets

Realizziamo un client Web in C++ che:
1. Risolve l'hostname `www.unina.it` tramite DNS.
2. Apre una connessione TCP sulla porta standard HTTP (`80`).
3. Invia una richiesta HTTP con metodo **`HEAD`** per la risorsa `/chi-siamo/cenni-storici`.
4. Riceve e visualizza a terminale gli header della risposta HTTP del server.

```
 Client C++                          Web Server UNINA (porta 80)
     |                                           |
     |--- 1. Risoluzione DNS "www.unina.it" ---->|
     |                                           |
     |--- 2. Connessione TCP (connect) --------->|
     |                                           |
     |--- 3. HEAD /chi-siamo/cenni-storici ----->|
     |                                           |
     |<-- 4. HTTP/1.1 200 OK + Headers ----------|
     |                                           |
     |--- 5. Chiusura Connessione (close) ------>|
```

---

## Client HTTP in C++: Creazione e Risoluzione DNS (1/3)

```cpp
#include <iostream>
#include <cstring>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <unistd.h>
#include <netdb.h>

int main() {
    int socket_desc;
    struct sockaddr_in serv_addr;
    struct hostent *server;
    char buffer[4096];

    // 1. Creazione del socket TCP
    socket_desc = socket(AF_INET, SOCK_STREAM, 0);
    if (socket_desc < 0) {
        std::cerr << "Errore nella creazione del socket" << std::endl;
        return 1;
    }

    // 2. Risoluzione DNS dell'host target
    server = gethostbyname("www.unina.it");
    if (server == NULL) {
        std::cerr << "Risoluzione DNS fallita per www.unina.it" << std::endl;
        close(socket_desc);
        return 1;
    }
```

---

## Client HTTP in C++: Configurazione Indirizzo e Connessione (2/3)

```cpp
    // 3. Preparazione della struttura indirizzo del server
    memset(&serv_addr, 0, sizeof(serv_addr));
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_port = htons(80); // Porta standard Web HTTP

    // Copia dell'indirizzo IP binario risolto dal DNS nella struttura sockaddr_in
    memcpy(&serv_addr.sin_addr.s_addr, server->h_addr, server->h_length);

    // 4. Connessione TCP al Web Server
    if (connect(socket_desc, (struct sockaddr *)&serv_addr, sizeof(serv_addr)) < 0) {
        std::cerr << "Connessione TCP fallita verso il server!" << std::endl;
        close(socket_desc);
        return 1;
    }

    std::cout << "Connessione TCP stabilita con successo verso www.unina.it:80" << std::endl;
```

---

## Client HTTP in C++: Invio Richiesta HEAD e Ricezione (3/3)

```cpp
    // 5. Composizione e invio della richiesta HTTP HEAD (connessione non persistente)
    const char *request = "HEAD /chi-siamo/cenni-storici HTTP/1.1\r\n"
                          "Host: www.unina.it\r\n"
                          "Connection: close\r\n\r\n";

    if (send(socket_desc, request, strlen(request), 0) < 0) {
        std::cerr << "Errore nell'invio della richiesta HTTP" << std::endl;
        close(socket_desc);
        return 1;
    }

    // 6. Ricezione della risposta (header HTTP restituiti dal metodo HEAD)
    int bytes_received = recv(socket_desc, buffer, sizeof(buffer) - 1, 0);
    if (bytes_received > 0) {
        buffer[bytes_received] = '\0';
        std::cout << "\nRisposta ricevuta (" << bytes_received << " byte):\n\n";
        std::cout << buffer << std::endl;
    }

    // 7. Chiusura del socket
    close(socket_desc);
    return 0;
}
```

---

## Considerazioni Moderne: Da `gethostbyname()` a `getaddrinfo()`

> [!NOTE] Evoluzione degli Standard POSIX
> Sebbene `gethostbyname()` sia didatticamente eccellente per la sua semplicità, negli standard moderni è considerata **deprecata** per due motivi principali:
> 1. Non è **thread-safe** (utilizza un buffer statico condiviso interno al processo).
> 2. È limitata a **IPv4** e non supporta la transizione trasparente a **IPv6**.

### L'alternativa moderna: `getaddrinfo()`
- Definito in POSIX.1g (RFC 3493).
- È completamente rientrante (*re-entrant* e thread-safe).
- Supporta in modo trasparente e unificato sia **IPv4 (`AF_INET`)** sia **IPv6 (`AF_INET6`)**.
- Combina la risoluzione dell'hostname e del servizio (porta) in un'unica chiamata, restituendo una lista concatenata di strutture `addrinfo` direttamente utilizzabili con `socket()` e `connect()`.
