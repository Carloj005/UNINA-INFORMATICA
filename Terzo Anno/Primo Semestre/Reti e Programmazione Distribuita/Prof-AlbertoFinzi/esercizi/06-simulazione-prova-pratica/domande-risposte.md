# Reti e Programmazione Distribuita — Domande e risposte

Compilare le celle `...` e le risposte indicate. Non cancellare le domande.

## Esercizio 4 — DNS (4 punti)

Si considerino i seguenti estratti di risposte DNS:

```text
$ dig www.campus.example
;; ANSWER SECTION:
www.campus.example.  300 IN CNAME web.campus.example.
web.campus.example.   60 IN A     192.0.2.80

$ dig campus.example MX
;; ANSWER SECTION:
campus.example.      600 IN MX 10 mail1.campus.example.
campus.example.      600 IN MX 20 mail2.campus.example.

$ dig campus.example NS
;; ANSWER SECTION:
campus.example.     3600 IN NS ns1.campus.example.
campus.example.     3600 IN NS ns2.campus.example.
```

**A (2 punti).** Completare la tabella.

| Informazione | Risposta |
|---|---|
| IPv4 del server Web | 192.0.2.80 |
| Nome canonico di `www.campus.example` | web.campus.example. |
| Server di posta con priorità maggiore | mail1.campus.example. |
| Un name server autoritativo del dominio | ns1.campus.example. (oppure ns2.campus.example.) |

**B (1 punto).** Al tempo t = 0 vengono memorizzati in cache il record CNAME
(TTL 300) e il record A (TTL 60). A t = 90 secondi, quali sono ancora
validi in cache? Quali devono essere risolti nuovamente?

Risposta: A t = 90 secondi è ancora valido in cache solo il record CNAME (perché ha TTL = 300 s e 90 < 300), mentre il record A è scaduto (perché aveva TTL = 60 s e 90 > 60) e quindi deve essere risolto nuovamente.

**C (1 punto).** Un programma deve inviare un'email al dominio
`campus.example` e ottiene `MX 10 mail1.campus.example.`.
Indicare: che cosa specifica questo record MX; quale ulteriore
risoluzione DNS serve per contattare il server (e quali tipi di record
si possono richiedere); quale protocollo di trasporto usa SMTP.

Risposta: Il record MX specifica qual è il server di posta associato al dominio campus.example (mail1.campus.example.) con valore di preferenza 10 (valore più basso = priorità maggiore). Per contattare il server serve un'ulteriore risoluzione DNS per ottenere l'indirizzo IP di mail1.campus.example., richiedendo un record di tipo A (per IPv4) o AAAA (per IPv6). SMTP usa TCP come protocollo di trasporto.

## Esercizio 5 — Go-Back-N e Selective Repeat (4 punti)

Finestra di invio N = 4; numeri di sequenza a 4 bit (0–15).
Il mittente invia, nell'ordine, i pacchetti 0, 1, 2 e 3.
Il pacchetto 1 si perde; i pacchetti 0, 2 e 3 arrivano al destinatario.
Non ci sono altre perdite. Tutti gli ACK prodotti arrivano al mittente
prima dello scadere del timer del pacchetto 1.
Gli ACK generati alla ricezione dei pacchetti 2 e 3 arrivano al mittente
in ordine inverso rispetto a quello di emissione.

Convenzione: in Go-Back-N `ACK k` conferma cumulativamente fino al
pacchetto k incluso; in Selective Repeat `ACK k` conferma il pacchetto k.

**A (3 punti).** Completare le righe mancanti indicando cosa fa il
ricevente e quale ACK genera.

| Evento | Go-Back-N | Selective Repeat |
|---|---|---|
| Arriva pkt 0 | Accetta, consegna, ACK 0 | Accetta, consegna, ACK 0 |
| Pkt 1 perso | Nessuna azione, nessun ACK | Nessuna azione, nessun ACK |
| Arriva pkt 2 | Scarta, ACK 0 | Accetta nel buffer (non consegna), ACK 2 |
| Arriva pkt 3 | Scarta, ACK 0 | Accetta nel buffer (non consegna), ACK 3 |

**B (1 punto).** Allo scadere del timer relativo al pacchetto 1,
quali pacchetti ritrasmette il mittente in Go-Back-N? E in Selective Repeat?

Go-Back-N: Ritrasmette i pacchetti 1, 2 e 3.

Selective Repeat: Ritrasmette solo il pacchetto 1 (perché gli ACK 2 e 3 sono già arrivati al mittente prima della scadenza del timer).

## Esercizio 6 — TCP: SEQ e ACK (4 punti)

Una connessione TCP è già stabilita. Il prossimo byte da inviare da A ha
numero di sequenza 1000; il prossimo byte da inviare da B ha numero 5000.
Inizialmente non ci sono dati in sospeso. Tutti i segmenti arrivano
nell'ordine mostrato. B invia il segmento 3 dopo aver ricevuto i segmenti
1 e 2; il segmento 5 contiene solo un ACK e viene inviato dopo il 4.

**A (3 punti).** Completare i sei campi mancanti.

| Segmento | SEQ | ACK | Dati |
|---|---:|---:|---:|
| 1. A -> B | 1000 | 5000 | 80 byte |
| 2. A -> B | 1080 | 5000 | 20 byte |
| 3. B -> A | 5000 | 1100 | 30 byte |
| 4. A -> B | 1100 | 5030 | 50 byte |
| 5. B -> A | 5030 | 1150 | 0 byte |

**B (1 punto).** Quali byte inviati da A sono confermati da ACK = 1100?
Perché il segmento 5, che contiene solo un ACK, non fa avanzare il
numero di sequenza di B?

Risposta: ACK = 1100 conferma cumulativamente tutti i byte inviati da A fino al byte 1099 incluso (cioè i byte da 1000 a 1099 dei segmenti 1 e 2). Il segmento 5 non fa avanzare il numero di sequenza di B perché contiene 0 byte di dati e in TCP i numeri di sequenza contano i byte di payload trasmessi, non i segmenti di solo ACK.
