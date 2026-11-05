---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezione 15: Il Livello di Trasporto — Trasferimento Dati Affidabile
### Principi di RDT, Protocolli Stop-and-Wait, Pipelining (Go-Back-N e Selective Repeat)

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Il Problema del Trasferimento Dati Affidabile (*RDT*)

- **Obiettivo:** garantire che i dati applicativi vengano consegnati al destinatario:
  - **Senza errori** sui singoli bit (correttezza).
  - **Senza perdite** di pacchetti (completezza).
  - **Nell'ordine esatto** in cui sono stati generati dal mittente (sequenzialità).
- **La sfida fondamentale:**
  - Il canale di comunicazione sottostante (Livello di Rete / IP / Canale fisico) è intrinsecamente **inaffidabile (*Unreliable Data Transfer - UDT*)**: può alterare i bit, smarrire pacchetti, duplicarli o recapitarli fuori sequenza.
- **Astrazione del servizio:**
  - Il protocollo RDT interposto fornisce ai livelli superiori l'illusione di un canale perfettamente affidabile, gestendo internamente le anomalie della rete.
  - È un problema fondamentale dell'ingegneria del software e delle reti, applicabile a livello di collegamento (Wi-Fi, Ethernet), di trasporto (TCP) e applicativo.

---

## Modello di Riferimento per RDT

```text
                  LATO TRASMITTENTE                           LATO RICEVENTE
              +-----------------------+                  +-----------------------+
              |  Processo Applicativo |                  |  Processo Applicativo |
              +-----------------------+                  +-----------------------+
                          |  rdt_send()                              ^  rdt_rcv()
                          v                                          |
              +-----------------------+                  +-----------------------+
              | Protocollo RDT (Send) |                  | Protocollo RDT (Recv) |
              +-----------------------+                  +-----------------------+
                          |  udt_send()                              ^
                          v                                          |
            ==============v==========================================|==============
                            CANALE SOTTOSTANTE INAFFIDABILE (IP)
                     (Corruzione bit, Perdita pacchetti, Ritardi variabili)
            ========================================================================
```

- `rdt_send()`: chiamata dal livello superiore per passare i dati da trasmettere.
- `udt_send()`: invocata dal protocollo RDT per inviare pacchetti sul canale inaffidabile.
- `rdt_rcv()`: notifica la ricezione di un pacchetto dal canale.
- `deliver_data()`: consegna i dati verificati e ordinati al livello superiore.

---

## RDT 1.0: Canale Perfettamente Affidabile

- **Ipotesi:** il canale fisico sottostante non perde mai pacchetti e non corrompe alcun bit.
- **Funzionamento:**
  - **Mittente:** attende la chiamata `rdt_send(data)`, incapsula i dati in un pacchetto e lo invia con `udt_send(packet)`.
  - **Ricevitore:** attende l'evento `rdt_rcv(packet)`, estrae il payload e lo consegna con `deliver_data(data)`.
- Nessun controllo degli errori, nessun riscontro (*feedback*) e nessun numero di sequenza necessari.

---

## RDT 2.0: Canale con Corruzione di Bit e Protocollo Stop-and-Wait

- **Nuova ipotesi realistica:** i pacchetti possono subire alterazioni di bit durante il tragitto, ma **non vengono persi**.
- **Meccanismi necessari per gestire la corruzione:**
  1. **Rilevamento degli errori (*Error Detection*):** aggiunta di un campo **Checksum** nell'header del pacchetto.
  2. **Riscontro dal Ricevitore (*Receiver Feedback*):**
     - **ACK (*Positive Acknowledgment*):** indica che il pacchetto è stato ricevuto correttamente.
     - **NAK (*Negative Acknowledgment*):** segnala che il pacchetto è giunto corrotto.
  3. **Ritrasmissione su Errore (*Retransmission*):**
     - Il mittente ritrasmette il pacchetto non appena riceve un NAK.
- Questi protocolli basati su riscontri e ritrasmissioni prendono il nome di **ARQ (*Automatic Repeat reQuest*)**.
- Funzionamento **Stop-and-Wait**: il mittente invia un pacchetto e si **arresta**, rimanendo in attesa dell'ACK/NAK prima di inviare il dato successivo.

---

## Il Difetto Fatale di RDT 2.0: Cosa succede se l'ACK o il NAK si corrompe?

- Se il messaggio di ACK o NAK inviato dal ricevitore viene corrotto sul canale di ritorno, il mittente **non può sapere** cosa sia avvenuto al destinatario!
- **Possibili tentativi e relative problematiche:**
  - Se il mittente chiede chiarimenti con un nuovo pacchetto ("cosa hai detto?"), anche tale messaggio di richiesta potrebbe corrompersi.
  - Se il mittente decide di ritrasmettere semplicemente il pacchetto nel dubbio, il ricevitore non è in grado di distinguere se il pacchetto in arrivo è:
    1. Una **ritrasmissione** del pacchetto precedente (ricevuto correttamente ma il cui ACK si è perso/corrotto).
    2. Un **nuovo pacchetto** applicativo che per pura coincidenza contiene gli stessi identici dati!
- La ritrasmissione "alla cieca" introdurrebbe **duplicati non rilevati** nello stream applicativo!

---

## RDT 2.1 e RDT 2.2: Numeri di Sequenza

- **Soluzione:** il mittente inserisce un **Numero di Sequenza (*Sequence Number*)** nell'header di ogni pacchetto.
- Per un protocollo Stop-and-Wait è sufficiente un numero di sequenza a **1 bit (`0` o `1`)**:
  - Il mittente invia il pacchetto con sequenza `0` e attende un `ACK 0`.
  - Se riceve un ACK corrotto o un NAK, ritrasmette il pacchetto `0`.
  - Il ricevitore, notando che il pacchetto ricevuto ha numero `0` (uguale a quello appena elaborato), sa con certezza che si tratta di un **duplicato**: lo memorizza/conferma inviando `ACK 0`, ma **non lo consegna una seconda volta** all'applicazione!
- **Evoluzione RDT 2.2 (Senza NAK):**
  - I messaggi NAK vengono eliminati del tutto: il ricevitore invia sempre e solo ACK specificando esplicitamente il numero di sequenza dell'ultimo pacchetto ricevuto correttamente.
  - La ricezione da parte del mittente di un **ACK duplicato** (es. riceve un secondo `ACK 0` mentre è in attesa di `ACK 1`) equivale concettualmente a un **NAK** per il pacchetto `1`, innescandone l'immediata ritrasmissione.

---

## RDT 3.0: Canale con Perdita di Pacchetti e Temporizzatore

- **Ipotesi reale completa:** il canale sottostante può sia **corrompere i bit** che **perdere completamente i pacchetti** (sia dati che ACK).
- Se un pacchetto dati o un ACK scompare nel nulla, il mittente in Stop-and-Wait rimarrebbe **bloccato all'infinito** in attesa di un evento che non si verificherà mai (*Deadlock*).
- **Nuovo meccanismo indispensabile: Countdown Timer (Temporizzatore di Timeout):**
  - Il mittente avvia un timer all'atto dell'invio di ogni pacchetto.
  - Se il timer scade prima dell'arrivo dell'ACK atteso (**Timeout**), il mittente presume che il pacchetto (o il rispettivo ACK) sia andato perduto e provvede a **ritrasmetterlo**.
  - Se l'ACK era soltanto in ritardo e giunge dopo la ritrasmissione, il numero di sequenza (`0` o `1`) protegge il ricevitore dall'accettare duplicati.

---

## Scenari di Funzionamento di RDT 3.0

```text
 1. Funzionamento Normale         2. Perdita Pacchetto Dati        3. Perdita Pacchetto ACK
   Mittente       Ricevitore        Mittente       Ricevitore        Mittente       Ricevitore
      |  Pkt 0        |                |  Pkt 0        |                |  Pkt 0        |
      |-------------->|                |----X (Lost)   |                |-------------->|
      |        ACK 0  |                |               |                |        ACK 0  |
      |<--------------|                | [Timeout]     |                |        (Lost)X|
      |  Pkt 1        |                |  Pkt 0 (Retx) |                | [Timeout]     |
      |-------------->|                |-------------->|                |  Pkt 0 (Retx) |
      |        ACK 1  |                |        ACK 0  |                |-------------->|
      |<--------------|                |<--------------|                |        ACK 0  |
                                                                        |<--------------|
                                                                        (Duplicato scartato)
```

- Nel caso (3), il ricevitore riceve due volte `Pkt 0`: grazie al numero di sequenza scarta il duplicato e rimanda `ACK 0` permettendo al mittente di sbloccarsi.

---

## Analisi Prestazionale di Stop-and-Wait: Il Collo di Bottiglia

- Consideriamo un link ad alte prestazioni attraverso un canale geografico:
  - Capacità del canale di trasmissione: $R = 1\text{ Gbps} = 10^9\text{ bit/s}$
  - Ritardo di propagazione andata/ritorno: $RTT = 30\text{ ms} = 0.03\text{ s}$
  - Dimensione del pacchetto: $L = 1000\text{ byte} = 8000\text{ bit}$
- **Tempo di trasmissione del pacchetto:**
  $$t_{\text{trans}} = \frac{L}{R} = \frac{8000\text{ bit}}{10^9\text{ bit/s}} = 8\text{ microsecondi} = 0.008\text{ ms}$$
- **Utilizzazione del canale da parte del mittente ($U_{\text{sender}}$):**
  $$U_{\text{sender}} = \frac{t_{\text{trans}}}{RTT + t_{\text{trans}}} = \frac{0.008\text{ ms}}{30\text{ ms} + 0.008\text{ ms}} \approx 0.000267 \approx 0.027\%$$
- **Conclusione drammatica:** il mittente trasmette per soli 8 microsecondi e trascorre i successivi 30 millisecondi con il link completamente inattivo in attesa dell'ACK!
- **Throughput effettivo:** soli $267\text{ kbps}$ su un canale fisico da $1\text{ Gbps}$!

---

## La Soluzione: Pipelining dei Pacchetti (*Sliding Window*)

- Invece di operare in Stop-and-Wait, il mittente è autorizzato a trasmettere **fino a $N$ pacchetti consecutivi** prima di fermarsi ad attendere i riscontri:

```text
  Stop-and-Wait (N = 1):
  [ Invia 1 ] ------------ RTT Attesa ACK ------------> [ Invia 2 ]

  Pipelining (N = 3):
  [ Invia 1 ][ Invia 2 ][ Invia 3 ] --- RTT Attesa ACK ---> [ Invia 4 ][ Invia 5 ]...
```

- Con una finestra di $N$ pacchetti, l'utilizzazione del canale cresce di un fattore $N$:
  $$U_{\text{sender}} = \frac{N \cdot (L/R)}{RTT + (L/R)}$$
- Con $N = 3750$, l'utilizzazione del canale salirebbe a circa il **100%**!
- I due approcci principali per gestire buffer e ritrasmissioni nel pipelining sono:
  1. **Go-Back-N (GBN)**
  2. **Selective Repeat (SR)**

---

## Protocollo Go-Back-N (GBN)

- **Caratteristiche del Mittente:**
  - Mantiene una **finestra di trasmissione di dimensione fissa $N$** (*Window Size*).
  - I numeri di sequenza sono interi a $k$ bit ($0 \dots 2^k - 1$).
  - Mantiene un **singolo timer** associato al pacchetto inviato più vecchio non ancora riscontrato (*oldest unACKed packet*).
  - Se il timer scade, il mittente ritrasmette **tutti gli $N$ pacchetti** della finestra a partire dal primo non riscontrato (da cui il nome *Go-Back-N*).

```text
                [  Finestra del Mittente (Dimensione N)  ]
   ... | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | ...
       ▲               ▲               ▲
       │               │               └── Prossimo numero da assegnare (nextseqnum)
       │               └────────────────── Primo non riscontrato (base / oldest unACKed)
       └────────────────────────────────── Già trasmessi e riscontrati con ACK
```

- **Caratteristiche del Ricevitore GBN:**
  - Utilizza **ACK Cumulativi**: `ACK n` attesta che tutti i pacchetti fino a `n` compreso sono stati ricevuti correttamente.
  - Se riceve un pacchetto fuori sequenza (*out-of-order*), **lo scarta senza salvarlo nel buffer** e rimanda l'ACK per l'ultimo pacchetto corretto in ordine consecutivo.

---

## Limiti di Go-Back-N e Protocollo Selective Repeat (SR)

- **Criticità di Go-Back-N:**
  - Se un singolo pacchetto va perduto in una finestra grande (es. $N=100$), il ricevitore scarta tutti i 99 pacchetti successivi anche se giunti privi di errori. Il mittente sarà costretto a ritrasmetterli per intero, sprecando banda preziosa.
- **Selective Repeat (SR):**
  - **Buffer al ricevitore:** il ricevitore accetta e conserva in memoria i pacchetti giunti correttamente anche se fuori ordine (*buffering out-of-order*).
  - **ACK Individuali:** il ricevitore invia un ACK specifico per ogni singolo pacchetto ricevuto.
  - **Timer Indipendenti:** il mittente gestisce un timer logico per ciascun pacchetto della finestra. Alla scadenza, ritrasmette **esclusivamente il singolo pacchetto** per cui è scaduto il timer.
  - La finestra del mittente avanza solo quando riceve l'ACK del pacchetto in testa alla finestra (*send_base*).

---

## Disallineamento della Finestra e Dimensione Massima in Selective Repeat

- *Domanda d'esame cruciale:* Qual è la relazione tra la dimensione della finestra $N$ e il numero totale di sequenze disponibili $K = 2^k$?
- **Il dilemma dell'ambiguità:**
  - Se $N$ è troppo grande rispetto a $K$, una finestra di ricezione e una di trasmissione possono disallinearsi al punto che un pacchetto ritrasmesso (vecchio) viene confuso con un pacchetto nuovo avente lo stesso numero di sequenza modulo $K$!
- **Condizione rigorosa di non ambiguità per Selective Repeat:**
  $$N_{\text{window}} \le \frac{K}{2} = \frac{2^k}{2} = 2^{k-1}$$
- La dimensione della finestra deve essere **minore o uguale alla metà dello spazio dei numeri di sequenza**!
- In Go-Back-N, dove il ricevitore non memorizza pacchetti fuori ordine, la condizione è invece: $N \le 2^k - 1$.

---

## Confronto Riassuntivo: Stop-and-Wait vs GBN vs Selective Repeat

| Caratteristica | Stop-and-Wait | Go-Back-N (GBN) | Selective Repeat (SR) |
| :--- | :--- | :--- | :--- |
| **Dimensione Finestra ($N$)** | $1$ | $> 1$ (Pipelined) | $> 1$ (Pipelined) |
| **Tipo di Riscontro (ACK)** | Individuale / Alternato | **Cumulativo** (`ACK n` conferma fino a $n$) | **Individuale** per ogni pacchetto |
| **Buffer al Ricevitore** | Nessuno | **Nessuno** (scarta fuori ordine) | **Sì** (memorizza pacchetti fuori ordine) |
| **Numero di Timer** | 1 | **1** (sul pacchetto non riscontrato più vecchio) | **Molteplici** (1 per ogni pacchetto pendente) |
| **Azione al Timeout** | Ritrasmette il singolo pacchetto | **Ritrasmette tutti** gli $N$ pacchetti della finestra | **Ritrasmette solo** il pacchetto scaduto |
| **Utilizzo Banda** | Pessimo (collo di bottiglia) | Buono (ma penalizzato da ritrasmissioni multiple) | **Ottimo ed efficiente** |
| **Complessità Logica** | Minima | Moderata | Elevata (gestione buffer e timer multipli) |
