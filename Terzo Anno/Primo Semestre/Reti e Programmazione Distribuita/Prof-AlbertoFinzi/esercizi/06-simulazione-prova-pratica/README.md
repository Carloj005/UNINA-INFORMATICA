# Reti e Programmazione Distribuita — Prova pratica

Durata: 120 minuti. È consentito consultare le slide del corso e usare il computer.

Completare i TODO nei file C e le risposte in `domande-risposte.md`.
Lavorare sui file forniti e consegnare **l'intera cartella in un unico ZIP**.
Non è necessario consegnare gli eseguibili.

## Programmazione

### Esercizio 1 — HTTP (5 punti)

Completare `http/client.c` per richiedere con HTTP/1.1 la risorsa
`http://info.cern.ch/hypertext/WWW/TheProject.html` e stampare la risposta
ricevuta dal server. I TODO H1, H2 e H3 valgono rispettivamente 2, 1 e 2 punti.

Compilazione:

```sh
gcc -Wall -Wextra http/client.c -o http/http_client
```

Esecuzione: `./http/http_client`

### Esercizio 2 — Server TCP con select (7 punti)

Completare `select/server.c`. Il server gestisce più client: ciascun client
invia un carattere, riceve lo stesso carattere maiuscolo e poi viene
scollegato. I TODO S1, S2 e S3 valgono rispettivamente 2, 2 e 3 punti.

```sh
gcc -Wall -Wextra select/server.c -o select/server
gcc -Wall -Wextra select/client.c -o select/client
```

Avviare `./select/server` in un terminale. Da altri terminali eseguire,
per esempio, `./select/client a 5` e `./select/client b 0`.
Il secondo argomento del client è il ritardo in secondi prima dell'invio.

### Esercizio 3 — Server UDP (6 punti)

Completare `udp/server.c`. Il client invia un intero tra 0 e 1000,
come intero a 32 bit in network byte order. Il server restituisce il
quadrato del numero, nello stesso formato. Deve servire richieste
successive, senza terminare dopo la prima.
I TODO U1, U2 e U3 valgono rispettivamente 2, 2 e 2 punti.

```sh
gcc -Wall -Wextra udp/server.c -o udp/server
gcc -Wall -Wextra udp/client.c -o udp/client
```

Avviare `./udp/server` e provare `./udp/client 12`, poi `./udp/client 25`.

## Protocolli

Completare le tabelle e le risposte in `domande-risposte.md`:

- Esercizio 4 — DNS (4 punti)
- Esercizio 5 — Go-Back-N e Selective Repeat (4 punti)
- Esercizio 6 — TCP: numeri SEQ e ACK (4 punti)

**Totale degli esercizi: 30 punti.**

## Consegna

Consegnare un unico file ZIP contenente questa cartella, con i file C
modificati e `domande-risposte.md` compilato. È possibile usare qualsiasi
editor di testo (gedit, nano, VS Code, ecc.).
