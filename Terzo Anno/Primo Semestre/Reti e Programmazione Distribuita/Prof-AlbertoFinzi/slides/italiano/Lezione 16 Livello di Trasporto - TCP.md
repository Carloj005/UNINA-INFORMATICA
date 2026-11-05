---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezione 16: Il Livello di Trasporto — Il Protocollo TCP
### Segmentazione, Header TCP, Numeri di Sequenza e Riscontro, Stima RTT e Fast Retransmit

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Fondamenti del Protocollo TCP (*Transmission Control Protocol*)

- TCP si fonda direttamente sui principi teorici di **Reliable Data Transfer (RDT)**:
  - Rilevamento degli errori mediante **Checksum**.
  - Numerazione progressiva mediante **Numeri di Sequenza**.
  - Riscontri positivi cumulativi (**ACK**).
  - Gestione temporale delle perdite (**Timer di Ritrasmissione** dinamici).
  - Controllo di flusso a finestra scorrevole (**Sliding Window**).
- **Differenza concettuale cruciale rispetto a GBN e Selective Repeat:**
  - Mentre nei modelli teorici i numeri di sequenza contano i **singoli pacchetti**, in TCP i numeri di sequenza contano i **singoli byte del flusso dati**!
- **Sintesi delle caratteristiche di TCP:**
  - **Orientato alla Connessione (*Connection-Oriented*):** handshake preliminare tra i due sistemi.
  - **Punto a Punto (*Point-to-Point*):** esattamente una coppia mittente/destinatario (nessun multicast/broadcast).
  - **Full-Duplex:** scambio dati bidirezionale contemporaneo sulla medesima connessione.
  - **Stream di Byte Affidabile (*Reliable Byte Stream*):** garantisce l'assenza di perdite, corruzioni e duplicati.
  - **Controllo di Flusso e di Congestione:** salvaguardia sia del buffer del ricevitore che delle risorse della rete.

---

## La Connessione Logica TCP: Stato solo negli End Systems

- Due moduli di trasporto TCP comunicano come se fossero uniti da un canale bidirezionale dedicato privo di errori.
- **Nessun circuito fisico riservato nella rete:**
  - La rete Internet sottostante è a commutazione di pacchetto (*datagram network*): i router intermedi instradano i pacchetti IP in modo del tutto indipendente e non conservano **alcuno stato** della connessione TCP!
  - Lo **stato TCP** (buffer di invio/ricezione, numeri di sequenza correnti, variabili di finestra e timer) risiede **esclusivamente nella memoria kernel degli host terminali**:

```text
    HOST A (Client)                                                  HOST B (Server)
+------------------------+                                      +------------------------+
| Stato TCP Host A:      |                                      | Stato TCP Host B:      |
| - Send/Recv Buffer     |                                      | - Send/Recv Buffer     |
| - LastByteAcked        |        [ Router IP ]   [ Router IP ] | - LastByteRead         |
| - NextSeqNum           |--------> (Solo L3)  ----> (Solo L3)  | - RcvWindow            |
| - EstimatedRTT / Timer |                                      | - AckNum atteso        |
+------------------------+                                      +------------------------+
```

---

## Buffer TCP e Dimensionamento del Segmento (MSS vs MTU)

- Quando un'applicazione invoca `write()` o `send()`, i byte vengono depositati nel **Send Buffer TCP**:
  - TCP preleva blocchi di byte dal buffer e li incapsula in segmenti TCP.
- **Relazione fondamentale tra MSS e MTU:**
  - **MTU (*Maximum Transmission Unit*):** massima dimensione del frame trasportabile dal livello di collegamento (es. standard Ethernet: $1500\text{ byte}$).
  - **MSS (*Maximum Segment Size*):** massima quantità di **dati applicativi (payload)** che TCP può inserire in un singolo segmento, al fine di evitare la frammentazione a livello IP:

$$MSS = MTU - \text{Header IP (20 byte)} - \text{Header TCP (20 byte)} = 1500 - 40 = 1460\text{ byte}$$

```text
+----------------------------------- Frame Ethernet (MTU: 1500 byte) -----------------------------------+
| Header Ethernet | Header IP (20 B) | Header TCP (20 B) |        Payload Dati TCP (MSS: 1460 B)         |
+-------------------------------------------------------------------------------------------------------+
```

- Il valore MSS viene tipicamente negoziato durante l'handshake iniziale mediante un'apposita opzione TCP.

---

## Struttura dell'Header TCP (RFC 793)

Un header TCP standard ha una dimensione minima di **20 byte** (fino a 60 byte con le opzioni):

```text
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|          Porta Sorgente (16 bit)      |     Porta Destinazione (16 bit)     |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                        Numero di Sequenza (32 bit)                          |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Numero di Riscontro (ACK, 32 bit)                        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
| HLEN  | Riserv|C|E|U|A|P|R|S|F|             Receive Window (16 bit)         |
| (4 b) | (4 b) |W|C|R|C|S|S|Y|I|                                             |
|       |       |R|E|G|K|H|T|N|N|                                             |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|          Internet Checksum (16 bit)   |         Urgent Pointer (16 bit)     |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                    Opzioni TCP (opzionale, lunghezza variabile)             |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                             Dati Applicativi (Payload)                      |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

---

## Analisi dei Campi dell'Header TCP

- **Porta Sorgente / Destinazione (16 bit cad.):** identificano i socket locali e remoti per il demultiplexing.
- **Sequence Number (32 bit):** numero progressivo assegnato al **primo byte di dati** contenuto nel segmento.
- **Acknowledgment Number (32 bit):** indica il numero del **prossimo byte atteso** dalla controparte (**ACK Cumulativo**).
- **Header Length / Data Offset (4 bit):** dimensione dell'header in parole a 32 bit (valore minimo: `5` $\rightarrow 5 \times 4 = 20\text{ byte}$).
- **Receive Window (16 bit):** numero di byte che il ricevitore è disposto ad accettare nel proprio buffer (*Controllo di Flusso*).
- **Checksum (16 bit):** calcolato su header TCP, dati e pseudo-header IP.
- **I Flag di Controllo Fondamentali (1 bit ciascuno):**
  - **SYN:** sincronizza i numeri di sequenza per instaurare la connessione (3-way handshake).
  - **ACK:** attesta che il campo *Acknowledgment Number* è valido (sempre attivo dopo il primo segmento).
  - **FIN:** richiede la chiusura ordinata della connessione in una direzione.
  - **RST:** forza l'interruzione immediata e il reset della connessione.
  - **PSH:** richiede al ricevitore di consegnare immediatamente i dati all'applicazione senza attendere il riempimento del buffer.
  - **URG:** segnala la presenza di dati urgenti (individuati tramite l'*Urgent Pointer*).

---

## Numeri di Sequenza e ACK: Numerazione Orientata ai Byte

- Immaginiamo che un client debba trasmettere uno stream di **500.000 byte** e che l'MSS sia pari a **1.000 byte**:
  - Il segmento 1 conterrà i byte da `0` a `999` $\rightarrow$ `Seq = 0`.
  - Il segmento 2 conterrà i byte da `1000` a `1999` $\rightarrow$ `Seq = 1000`.
  - Il segmento 3 conterrà i byte da `2000` a `2999` $\rightarrow$ `Seq = 2000`.

```text
Stream Byte Applicativi:
|  0 ... 999  |  1000 ... 1999  |  2000 ... 2999  | ...
  Segmento 1       Segmento 2        Segmento 3
 (Seq = 0)        (Seq = 1000)      (Seq = 2000)
```

- **Semantica dell'Acknowledgment Number (Cumulativo):**
  - Quando il server riceve il Segmento 1 (`Seq = 0`, 1.000 byte di payload), risponde con:
    $$\text{ACK} = 1000$$
  - Il significato formale di `ACK = 1000` è:
    *"Ho ricevuto con successo e in ordine tutti i byte fino a 999 compreso; **ora sto attendendo il byte numero 1000**"*.

---

## Piggybacking e Scambio Dati Bidirezionale

- TCP supporta il **Piggybacking**: la possibilità di combinare un riscontro di ricezione (**ACK**) e dati applicativi in uscita all'interno del **medesimo segmento**:

```text
       Host Client A                                           Host Server B
             |                                                       |
             |  Segmento 1: Seq = 42, ACK = 79, Dati = 'C' (1 byte)  | (Client invia carattere 'C')
             |------------------------------------------------------>|
             |                                                       |
             |  Segmento 2: Seq = 79, ACK = 43, Dati = 'C' (1 byte)  | (Server conferma 'C' con ACK 43
             |<------------------------------------------------------|  e invia l'eco del carattere 'C')
             |                                                       |
             |  Segmento 3: Seq = 43, ACK = 80 (Nessun dato)         | (Client conferma la ricezione
             |------------------------------------------------------>|  dell'eco con ACK 80)
```

- In questo classico esempio di sessione terminale remota (Telnet/SSH):
  - Il server risponde con `ACK = 43` (ha ricevuto il byte 42 di A) e contemporaneamente invia il proprio byte con `Seq = 79`.
  - Il client conferma a sua volta con `ACK = 80`.

---

## Stima del Round-Trip Time (RTT) e Timeout di Ritrasmissione

- Per evitare ritrasmissioni premature o attese eccessive in caso di perdite, TCP calcola il timeout in modo **adattivo**:
  1. **Misurazione di $SampleRTT$:** misura il tempo trascorso tra la trasmissione di un segmento e la ricezione del relativo ACK (escludendo segmenti ritrasmessi, *Regola di Karn*).
  2. **Stima $EstimatedRTT$ (Media Mobile Ponderata Esponenziale - EWMA):**
     $$EstimatedRTT = (1 - \alpha) \cdot EstimatedRTT + \alpha \cdot SampleRTT \quad (\text{con tipicamente } \alpha = 0.125)$$
  3. **Stima della Deviazione RTT ($DevRTT$ - variabilità del ritardo):**
     $$DevRTT = (1 - \beta) \cdot DevRTT + \beta \cdot |SampleRTT - EstimatedRTT| \quad (\text{con tipicamente } \beta = 0.25)$$
  4. **Calcolo dell'Intervallo di Timeout ($RTO$ - Retransmission Timeout):**
     $$TimeoutInterval = EstimatedRTT + 4 \cdot DevRTT$$
- Questo valore garantisce un margine di sicurezza prudenziale: se il ritardo della rete oscilla molto, $DevRTT$ cresce aumentando il timeout.

---

## Il Mittente TCP e la Gestione dei Timer

- **Principio del Singolo Timer:**
  - A differenza del modello teorico Selective Repeat (che richiederebbe decine di timer hardware), TCP standard mantiene un **unico timer di ritrasmissione**:
  - Il timer è sempre associato al **segmento inviato più vecchio non ancora riscontrato (*oldest unacknowledged segment*)**.
- **I Tre Eventi Principali per il Mittente TCP:**
  1. **Arrivo di dati dall'applicazione:** incapsula i dati in un segmento con `Seq = NextSeqNum`, aggiorna `NextSeqNum = NextSeqNum + LunghezzaDati`, invia il segmento e avvia il timer se non era già in esecuzione.
  2. **Scadenza del Timer (Timeout):**
     - Ritrasmette il singolo segmento con il numero di sequenza più basso non ancora riscontrato.
     - Raddoppia il timeout corrente (**Exponential Backoff**, $Timeout = 2 \times Timeout$) per decongestionare la rete.
     - Riavvia il timer.
  3. **Ricezione di un ACK valido:**
     - Se `AckNum > SendBase`, fa avanzare la finestra di trasmissione: `SendBase = AckNum`.
     - Se vi sono ancora segmenti trasmessi non riscontrati, riavvia il timer.

---

## ACK Ritardati e il Meccanismo di Fast Retransmit

- **Delayed ACK (RFC 1122):** il ricevitore può ritardare l'invio dell'ACK fino a $500\text{ ms}$ in attesa di un altro segmento o di dati in uscita su cui agganciarsi.
- **Il Problema dell'Attesa del Timeout:**
  - Il timeout può richiedere centinaia di millisecondi prima di scattare.
- **Fast Retransmit (Ritrasmissione Rapida):**
  - Quando un segmento viene smarrito, i segmenti successivi arrivano fuori ordine al ricevitore.
  - Il ricevitore **non può confermarli con ACK superiori**, quindi invia immediatamente un **ACK Duplicato (*Duplicate ACK*)** ripetendo l'ultimo numero atteso.
  - Quando il mittente riceve **3 ACK duplicati consecutivi** (in totale 4 ACK con lo stesso numero), deduce che il segmento mancante è andato perduto e lo **ritrasmette immediatamente**, prima della scadenza del timer!

```text
 Mittente A                                                           Ricevitore B
     |  Seq = 100, 20 B  (Ricevuto)                                        |
     |-------------------------------------------------------------------->| -> Invia ACK 120
     |  Seq = 120, 20 B  (SMARRITO IN RETE)    X                           |
     |-----------------------------------------                            |
     |  Seq = 140, 20 B  (Fuori ordine)                                    |
     |-------------------------------------------------------------------->| -> Invia ACK 120 (1° Dup ACK)
     |  Seq = 160, 20 B  (Fuori ordine)                                    |
     |-------------------------------------------------------------------->| -> Invia ACK 120 (2° Dup ACK)
     |  Seq = 180, 20 B  (Fuori ordine)                                    |
     |-------------------------------------------------------------------->| -> Invia ACK 120 (3° Dup ACK)
     |                                                                     |
     | <=== RICEVUTI 3 ACK DUPLICATI! ===                                  |
     | [FAST RETRANSMIT] Invia subito Seq = 120!                           |
     |-------------------------------------------------------------------->| -> Invia ACK 200 (Cumulativo!)
```

---

## TCP: Go-Back-N o Selective Repeat?

- **Analogie con Go-Back-N:**
  - Utilizza **ACK Cumulativi** (un ACK conferma tutto il flusso precedente).
  - Gestisce un **singolo timer** per la finestra di trasmissione.
- **Analogie con Selective Repeat:**
  - Alla scadenza del timeout o al Fast Retransmit, TCP ritrasmette **solo il segmento mancante**, non tutti i segmenti successivi già in volo!
  - Le implementazioni moderne di TCP memorizzano i segmenti fuori ordine nel **Receive Buffer** anziché scartarli.
- **L'Estensione SACK (*Selective Acknowledgment* - RFC 2018):**
  - Attraverso le opzioni dell'header TCP, il ricevitore comunica al mittente blocchi discontinui di dati ricevuti con successo (es. *"ho ricevuto 140-199, ma mi manca 120-139"*).
  - Il mittente ritrasmette con precisione chirurgica unicamente i byte mancanti.
- **Conclusione:** TCP è un **protocollo ibrido ad altissima efficienza**, che unisce la semplicità di riscontro cumulativo di GBN alla flessibilità di memorizzazione selettiva di Selective Repeat!
