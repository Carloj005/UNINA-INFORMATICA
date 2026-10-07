---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezione 12: Il Livello di Trasporto — Il Protocollo TCP (*Transmission Control Protocol*)

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Caratteristiche Fondamentali del Protocollo TCP

Definito storicamente nella RFC 793, **TCP** è il protocollo di trasporto affidabile standard di Internet:

- **Punto a Punto (*Point-to-Point*)**:
  - La comunicazione avviene sempre tra un singolo mittente e un singolo ricevitore (*Unicast*). Nessun supporto per multicast o broadcast.
- **Flusso di Byte Affidabile e Ordinato (*Reliable, In-Order Byte Stream*)**:
  - Non esistono confini di record o messaggi strutturati: i dati fluiscono come un flusso continuo di byte.
- **Pipelining e Finestra Scorrevole**:
  - TCP supporta finestre di trasmissione dinamiche regolate da controllo di flusso e congestione.
- **Comunicazione Bidirezionale Simultanea (*Full-Duplex Data*)**:
  - I due host possono trasmettere e ricevere dati contemporaneamente sullo stesso canale.
- **Orientato alla Connessione (*Connection-Oriented*)**:
  - Richiede un handshake preliminare a 3 vie prima di inviare dati.
- **Regolato da Meccanismi di Controllo**:
  - Controllo di flusso (*Flow Control*) e di congestione (*Congestion Control*).

---

## Formato del Segmento TCP

Un segmento TCP è costituito da un'intestazione (*Header*) di lunghezza variabile (tipicamente **20 byte**, espandibile fino a 60 byte con le opzioni) e da un campo dati (*Payload*):

```
 0                   15 16                   31
+-----------------------+-----------------------+
|  Source Port (16 bit) | Dest Port (16 bit)    |
+-----------------------+-----------------------+
|               Sequence Number (32 bit)        |
+-----------------------+-----------------------+
|            Acknowledgment Number (32 bit)     |
+----+--------+---------+-----------------------+
|HLEN| Riserv.|  Flags  | Receive Window (16 b) |
+----+--------+---------+-----------------------+
|   Checksum (16 bit)   | Urgent Pointer (16 b) |
+-----------------------+-----------------------+
| Options (Opzionale, lunghezza variabile 0-40B)|
+-----------------------------------------------+
|             Dati Applicativi (Payload)        |
+-----------------------------------------------+
```

---

## Campi dell'Header TCP

- **Source Port & Destination Port (16 bit ciascuna)**: identificano i processi applicativi endpoint.
- **Sequence Number (32 bit)**: indica la posizione nel flusso di byte del **primo byte di dati** trasportato in questo segmento.
- **Acknowledgment Number (32 bit)**: indica il **prossimo byte atteso** dal ricevitore (ACK cumulativo).
- **Header Length (HLEN, 4 bit)**: lunghezza dell'header TCP misurata in parole da 32 bit (minimo $5 \times 4 = 20\text{ byte}$).
- **Receive Window (16 bit)**: numero di byte che il ricevitore è disposto ad accettare nel proprio buffer (*Controllo di Flusso*).
- **Checksum (16 bit)**: verifica dell'integrità del segmento e dello pseudo-header IP.
- **Urgent Pointer (16 bit)**: punta all'ultimo byte di dati urgenti (usato raramente con il flag `URG`).
- **Options (variabile)**: negoziazione del **MSS** (*Maximum Segment Size*), fattori di scala della finestra (*Window Scaling*), timestamp e riscontri selettivi (**SACK**).

---

## I Flag di Controllo TCP

Il campo Flags contiene bit di segnalazione fondamentali per la gestione dello stato della connessione:

- **`SYN` (*Synchronize*)**: utilizzato durante l'apertura della connessione per negoziare i numeri di sequenza iniziali (*ISN*).
- **`ACK` (*Acknowledgment*)**: indica che il campo *Acknowledgment Number* contiene un valore valido.
- **`FIN` (*Finish*)**: segnala che il mittente ha terminato l'invio dei dati e desidera chiudere la connessione.
- **`RST` (*Reset*)**: resetta bruscamente la connessione a causa di un errore grave o di una porta chiusa.
- **`PSH` (*Push*)**: richiede al ricevitore di consegnare immediatamente i dati all'applicazione senza attendere il riempimento del buffer.
- **`URG` (*Urgent*)**: notifica che i dati contenuti sono prioritari.
- **`ECE` / `CWR`**: utilizzati per la notifica esplicita di congestione della rete (*Explicit Congestion Notification - ECN*).

---

## Numeri di Sequenza e Riscontro (*Seq & Ack Numbers*)

A differenza dei modelli didattici in cui si numerano i pacchetti ($0, 1, 2\dots$), **TCP numera i singoli byte del flusso applicativo**:

```
Flusso Dati Applicativo: 500.000 byte (da byte 0 a byte 499.999)
Assumiamo MSS = 1.000 byte:

Segmento 1: Byte [0 ... 999]       ---> Seq = 0
Segmento 2: Byte [1000 ... 1999]   ---> Seq = 1000
Segmento 3: Byte [2000 ... 2999]   ---> Seq = 2000
...
```

### Regole per il Calcolo di Seq e ACK:
- **`Seq Number`**: è il numero progressivo del primo byte di dati contenuto nel segmento.
- **`Ack Number`**: è il numero del **prossimo byte che il ricevitore si aspetta di ricevere**.
- **ACK Cumulativo (*Cumulative ACK*)**: se un ricevitore invia `ACK = 1000`, significa che ha ricevuto con successo tutti i byte fino al byte `999`.

---

## Comunicazione Full-Duplex e Meccanismo di Piggybacking

Poiché TCP è full-duplex, una singola connessione supporta due flussi indipendenti: $A \to B$ e $B \to A$.  
Quando l'Host B deve inviare dati all'Host A, può inserire l'ACK per i dati ricevuti da A **all'interno del segmento contenente i dati diretti ad A**: questa tecnica prende il nome di **Piggybacking** (*trasporto a cavalcioni*).

```
Host A (Client Telnet)                                 Host B (Server Echo)
      |                                                        |
      |-- Seq = 42, ACK = 79, Data = 'c' (1 byte) ------------>| Riceve byte 42
      |                                                        | Eco del carattere 'c'
      |<- Seq = 79, ACK = 43, Data = 'c' (1 byte) -------------| ACK 43 = attende byte 43
      |                                                        |
      |-- Seq = 43, ACK = 80 (Segmento puro di ACK, no data) ->| ACK 80 = attende byte 80
```

1. Host A invia il byte 42 e riscontra il byte 78 ricevuto in precedenza (`ACK = 79`).
2. Host B conferma il byte 42 di A (`ACK = 43`) e restituisce contemporaneamente il proprio byte 79 (`Seq = 79`).
3. Host A conferma la ricezione del byte 79 inviando un segmento di solo ACK (`ACK = 80`, `Seq = 43`).

---

## Stima del Round-Trip Time (RTT) in TCP

Per determinare quanto tempo attendere prima di dichiarare un segmento perso e ritrasmetterlo, TCP deve stimare dinamicamente il **Round-Trip Time ($RTT$)**:

1. **`SampleRTT` (RTT Campionato)**:
   - Tempo misurato tra la trasmissione di un segmento e la ricezione del corrispondente ACK.
   - Non viene mai misurato sui segmenti ritrasmessi (*Algoritmo di Karn*).
2. **`EstimatedRTT` (Media Mobile Esponenziale Pesata - EWMA)**:
   - Poiché i singoli campioni fluttuano a causa della congestione, TCP calcola una media smorzata:
   $$\text{EstimatedRTT} = (1 - \alpha) \cdot \text{EstimatedRTT} + \alpha \cdot \text{SampleRTT}$$
   - Il valore standard raccomandato (RFC 6298) è **$\alpha = 0.125$** ($1/8$).

---

## Variazione dell'RTT e Calcolo del Timeout di Ritrasmissione

Oltre al valore medio, TCP misura la variabilità dei ritardi di rete per evitare ritrasmissioni premature:

### 1. Stima della Deviazione dell'RTT (`DevRTT`):
$$\text{DevRTT} = (1 - \beta) \cdot \text{DevRTT} + \beta \cdot |\text{SampleRTT} - \text{EstimatedRTT}|$$
- Il valore standard raccomandato è **$\beta = 0.25$** ($1/4$).

### 2. Calcolo del Timeout Interval (`TimeoutInterval`):
$$\mathbf{TimeoutInterval} = \mathbf{EstimatedRTT} + \mathbf{4 \cdot DevRTT}$$

- Quando il ritardo di rete è stabile e poco variabile, $\text{DevRTT}$ è piccolo e il timeout è vicino a $\text{EstimatedRTT}$.
- Quando la rete è instabile e le fluttuazioni sono elevate, il margine di sicurezza ($4 \cdot \text{DevRTT}$) cresce automaticamente, evitando ritrasmissioni premature.
- All'inizio della connessione ($t = 0$), il valore di default è tipicamente fissato a **1 secondo**. In caso di timeout consecutivo, il timer viene raddoppiato (*Exponential Backoff*).

---

## Ritrasmissione Rapida: il Fast Retransmit

Attendere la scadenza del timer di ritrasmissione (*Timeout*) può causare lunghi periodi di inattività, riducendo drasticamente le prestazioni.  
Il meccanismo di **Fast Retransmit** permette al mittente di rilevare la perdita di un segmento **prima** dello scadere del timeout:

### Principio di Funzionamento:
- Quando il ricevitore riceve un segmento **fuori sequenza** (con `Seq` superiore a quello atteso), deduce che un pacchetto precedente è andato perso o ritardato.
- Il ricevitore non attende: genera immediatamente un **ACK Duplicato (*Duplicate ACK*)** indicando nuovamente il numero di sequenza del segmento mancante.
- **Regola dei 3 ACK Duplicati**: se il mittente riceve **3 ACK duplicati consecutivi** (4 ACK identici in totale), presume con altissima probabilità che il segmento atteso sia andato perso e **lo ritrasmette immediatamente**.

---

## Esempio Operativo di Fast Retransmit

```
      Mittente TCP                                          Ricevitore TCP
           |                                                      |
           |----- Seq = 92, 8 byte dati ------------------------->| Accetta (ricevuti fino a 99)
           |                                                      |
           |--x (PERSO!) Seq = 100, 20 byte ---------------------x| Mancante!
           |                                                      |
           |----- Seq = 120, 15 byte dati ----------------------->| Fuori sequenza! ACK 100 (1° Dup)
           |                                                      |
           |----- Seq = 135, 20 byte dati ----------------------->| Fuori sequenza! ACK 100 (2° Dup)
           |                                                      |
           |----- Seq = 155, 10 byte dati ----------------------->| Fuori sequenza! ACK 100 (3° Dup)
           |                                                      |
      [Ricevuti 3 Dup ACK!]                                       |
      [FAST RETRANSMIT Seq 100!]                                  |
           |----- Seq = 100 (Ritrasmissione Rapida) ------------->| Ricostruisce sequenza!
           |<---- ACK = 165 (ACK Cumulativo per tutti i byte) ---|
```

### Perché attendere esattamente 3 ACK duplicati?
- I pacchetti possono seguire percorsi di rete diversi e arrivare semplicemente riordinati.
- Se si ritrasmettesse al primo ACK duplicato, si genererebbero continue ritrasmissioni inutili.
- 3 ACK duplicati consecutivi offrono una sicurezza statistica quasi assoluta che il pacchetto non sia in ritardo, ma effettivamente perso.
