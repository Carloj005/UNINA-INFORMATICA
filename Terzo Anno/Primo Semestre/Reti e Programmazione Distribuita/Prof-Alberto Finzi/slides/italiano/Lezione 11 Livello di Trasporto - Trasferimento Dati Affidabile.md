---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezione 11: Il Livello di Trasporto — Trasferimento Dati Affidabile (*Reliable Data Transfer*)

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Il Problema del Trasferimento Affidabile dei Dati

Immaginiamo di essere in stazione in attesa del treno numero 6 al binario 5:
- Il capostazione invia un messaggio: *"Il treno 6 arriverà al binario 9"*.
- Cosa accade se il canale di comunicazione è inaffidabile?
  - **Perdita di parole**: *"Il treno %&! arriverà al binario 9"* (messaggio incomprensibile).
  - **Corruzione di bit/parole**: *"Il treno 7 arriverà al binario 9"* (informazione errata).
  - **Inversione/disordine**: *"Il treno 9 arriverà al binario 6"* (scambio di parametri critici).
  - **Duplicazione**: *"Il treno 66 arriverà al binario 9"*.

> In alcuni casi capiamo che c'è stato un errore, ma in altri potremmo salire sul treno sbagliato o perdere il treno giusto. Nei sistemi di rete il problema è identico.

---

## I Tre Requisiti Fondamentali di un Canale Affidabile

Il controllo degli errori (es. *Checksum*) consente al ricevitore di capire se un messaggio è corrotto, ma **non garantisce la corretta consegna**.

Un canale di trasporto affidabile deve garantire contemporaneamente tre proprietà:
1. **Assenza di Corruzione**: nessun bit deve risultare alterato ($0 \leftrightarrow 1$) durante il tragitto.
2. **Assenza di Perdite o Duplicati**: nessun pacchetto deve andare perso e nessun pacchetto deve essere consegnato più volte.
3. **Ordinamento Sequenziale Garantito**: tutti i pacchetti devono essere consegnati al processo applicativo destinatario **nello stesso identico ordine** in cui sono stati inviati.

> **Assunzione Architetturale**: Il livello di rete sottostante (**IP**) è intrinsecamente inaffidabile (*Best-Effort*). È compito esclusivo del protocollo di trasporto affidabile (**TCP**) colmare il divario e trasformare un canale inaffidabile in un canale perfetto.

---

## Canale con Corruzione di Bit: Protocolli Stop-and-Wait e ARQ

Ipotizziamo inizialmente un canale in cui i pacchetti non vanno mai persi, ma possono subire alterazioni nei bit.

- **Approccio Stop-and-Wait (Fermati e Attendi)**:
  - Il mittente trasmette un pacchetto e si arresta in attesa della conferma del ricevitore prima di inviare il successivo.
- **Protocolli ARQ (*Automatic Repeat reQuest*)**:
  - **ACK (*Positive Acknowledgment*)**: notifica inviata dal ricevitore per confermare che il pacchetto è arrivato integro.
  - **NAK (*Negative Acknowledgment*)**: notifica inviata dal ricevitore se il checksum ha rilevato un errore, richiedendo la ritrasmissione immediata del pacchetto.

```
       Mittente                               Ricevitore
          |                                        |
          |-------- Pacchetto Dati --------------->| (Integrità verificata)
          |<------- ACK ---------------------------|
          |                                        |
          |-------- Pacchetto Dati (Corrotto) ---->| (Checksum fallito!)
          |<------- NAK ---------------------------|
          |-------- Pacchetto Dati (Ritrasmesso) ->|
```

---

## Il Problema della Corruzione degli ACK/NAK: Numeri di Sequenza

Cosa succede se a corrompersi durante il viaggio di ritorno è lo stesso messaggio di **ACK o NAK**?
- Il mittente non può sapere se il ricevitore ha ricevuto correttamente i dati o meno.
- Se il mittente ritrasmette alla cieca, il ricevitore **non può distinguere** se il pacchetto in arrivo sia un nuovo dato o un duplicato del precedente!

### Soluzione: Aggiungere il Numero di Sequenza (*Sequence Number*)
- Si inserisce un campo numerico nell'intestazione del pacchetto.
- In un protocollo **Stop-and-Wait**, essendoci sempre e solo un pacchetto in transito alla volta, **è sufficiente 1 singolo bit** per il numero di sequenza:
  $$s \in \{0, 1\}$$
- Se il ricevitore riceve due volte consecutive un pacchetto con numero di sequenza `0`, capisce immediatamente che il secondo è un duplicato, lo scarta dalla consegna all'applicazione e rimanda semplicemente l'ACK per `0`.

---

## Canale con Perdita di Pacchetti: Timer e Timeout

Nei canali reali i pacchetti possono andare persi a causa della saturazione dei buffer (*Queue Overflow*) nei router intermedi.

- **Problema di Deadlock (Stallo)**:
  - Se il pacchetto dati si perde, il ricevitore non risponde.
  - Se l'ACK si perde, il mittente rimane bloccato in attesa indefinita.
  - La comunicazione si ferma per sempre.

### Soluzione: Timer di Ritrasmissione (*Retransmission Timer*)
- Il mittente avvia un timer per ogni pacchetto trasmesso.
- Se non riceve l'ACK prima che il timer scada (**Timeout**), presume che il pacchetto o l'ACK siano andati persi e **ritrasmette automaticamente** il pacchetto.
- Se l'ACK era solo in ritardo e non perso, il ricevitore gestisce il duplicato grazie al numero di sequenza (0/1) scartandolo e ri-inviando l'ACK.

---

## Il Dilemma della Scelta del Valore di Timeout

Il valore del timeout deve essere correlato al **Round Trip Time (RTT)** del canale:

```
  Trasmissione Pkt           ACK Normale           Timeout Troppo Breve:
         |                        |                 Ritrasmissione Prematura
         v                        v                            |
         |----------------------->|                            v
         |                        |                    +---------------+
         |                        |                    | Timeout Scaduto!|
         |<-----------------------|                    +---------------+
         |       Tempo RTT        |                            | (Doppia Copia Inutile)
```

- **Timeout Troppo Breve**:
  - Scade prima del tempo necessario all'ACK per ritornare.
  - Causa ritrasmissioni premature ingiustificate, duplicazione inutile di pacchetti e spreco di banda.
- **Timeout Troppo Lungo**:
  - La connessione reagisce con estrema lentezza alle perdite effettive, degradando il throughput applicativo.
- **Regola di Buona Pratica**: il timeout deve essere calibrato in modo da risultare leggermente superiore alla stima dell'RTT medio del collegamento.

---

## Analisi Prestazionale di Stop-and-Wait: Esempio Realistico

Consideriamo due host situati sulle coste opposte degli Stati Uniti collegati da una rete geografica ad alta velocità:
- **Round-Trip Time ($RTT$)**: $\approx 30\text{ ms} = 0.03\text{ s}$
- **Banda del Canale ($R$)**: $1\text{ Gbps} = 10^9\text{ bit/s}$
- **Dimensione Pacchetto ($L$)**: $1000\text{ byte} = 8000\text{ bit}$

### Tempo di Trasmissione del Pacchetto ($t_{\text{trans}}$):
$$t_{\text{trans}} = \frac{L}{R} = \frac{8000\text{ bit}}{10^9\text{ bit/s}} = 8\ \mu\text{s} = 0.000008\text{ s}$$

### Tempo Totale per Completare un Ciclo di Invio e ACK:
$$T_{\text{tot}} = t_{\text{trans}} + RTT = 0.000008 + 0.03 = 0.030008\text{ s}$$

### Efficienza di Utilizzo del Canale ($U_{\text{sender}}$):
$$U_{\text{sender}} = \frac{t_{\text{trans}}}{T_{\text{tot}}} = \frac{0.000008}{0.030008} \approx 0.000267 \implies \mathbf{0.027\%}$$

> [!WARNING] Inefficienza Drammatica
> Con Stop-and-Wait, il trasmettitore inietta bit sul canale per soli $8\ \mu s$ e rimane **completamente inattivo in attesa per il 99.973% del tempo**!

---

## Soluzione all'Inefficienza: Il Pipelining

Invece di fermarsi e attendere un ACK per ciascun singolo pacchetto, la tecnica del **Pipelining** consente al mittente di trasmettere **più pacchetti consecutivi** senza attendere le conferme intermedie:

```
  STOP-AND-WAIT                       PIPELINING (Finestra di Invio)
       |                                   |  |  |  (3 pacchetti in volo)
       | Pkt 0                             |  |  |  Pkt 0, Pkt 1, Pkt 2
       v                                   v  v  v
       |                                   |  |  |
   (Attesa...)                             |  |  |  (Canale costantemente
       |                                   |  |  |   riempito di dati)
       |<-- ACK 0                          |<-- ACK 0
       |                                   |<-- ACK 1
       | Pkt 1                             |<-- ACK 2
       v                                   v
```

### Requisiti Architetturali del Pipelining:
1. **Estensione dei Numeri di Sequenza**: 1 solo bit non basta più; serve un intervallo numerico sufficientemente ampio per identificare univocamente tutti i pacchetti contemporaneamente in volo.
2. **Buffer di Memoria**: sia il mittente che il ricevitore devono allocare buffer per trattenere i dati non ancora riscontrati o fuori sequenza.

---

## Protocolli a Pipelining: Go-Back-N (GBN)

Nel protocollo **Go-Back-N (Finestra Scorrevole / Sliding Window)**:
- Il mittente può trasmettere fino a $N$ pacchetti senza attendere riscontro (dove $N$ è la **dimensione della finestra**).

```
                Finestra di Trasmissione (Dimensione N)
             [-----------------------------------------]
  ... | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | ...
  -------------+-------------------+--------------------+----
   Riscontrati | In volo (inviati, | Inviabili subito  | Non utilizzabili
   con ACK     | non riscontrati)  | ma non ancora inv. | finché la finestra non avanza
               ^                   ^
             base              nextseqnum
```

- **`base`**: numero di sequenza del più vecchio pacchetto non ancora confermato.
- **`nextseqnum`**: primo numero di sequenza libero per la prossima trasmissione.
- **ACK Cumulativo (*Cumulative ACK*)**: l'ACK con valore $k$ notifica che **tutti i pacchetti fino a $k$ compreso** sono stati ricevuti con successo.
- **Un Singolo Timer**: associato al pacchetto più vecchio non riscontrato (`base`). Se scade, il mittente **ritrasmette tutti gli $N$ pacchetti** a partire da `base` (*Go-Back-N*).

---

## Ricevitore nel Protocollo Go-Back-N

La caratteristica distintiva di GBN è l'estrema semplicità del lato ricevente:
- Il ricevitore accetta **esclusivamente pacchetti che arrivano nel perfetto ordine sequenziale atteso**.
- **Scarto dei Pacchetti Fuori Ordine**: se arriva un pacchetto con numero di sequenza diverso da quello atteso (es. si è perso `pkt 2`, ma arrivano integri `pkt 3`, `pkt 4`, `pkt 5`), il ricevitore **scarta tutti i pacchetti successivi**, anche se privi di errori!
- Ri-invia semplicemente un ACK per l'ultimo pacchetto ricevuto correttamente in ordine (`pkt 1`).

```
  Mittente GBN                             Ricevitore GBN
       |--- Pkt 0 ---------------------------->| Accettato, invia ACK 0
       |--- Pkt 1 ---------------------------->| Accettato, invia ACK 1
       |--- Pkt 2 (PERSO SULLA RETE!) --------x|
       |--- Pkt 3 ---------------------------->| SCARTATO! Reinvia ACK 1
       |--- Pkt 4 ---------------------------->| SCARTATO! Reinvia ACK 1
       |                                       |
    [TIMEOUT Pkt 2!]                           |
       |--- Pkt 2 (Ritrasmesso) -------------->| Accettato, invia ACK 2
       |--- Pkt 3 (Ritrasmesso) -------------->| Accettato, invia ACK 3
       |--- Pkt 4 (Ritrasmesso) -------------->| Accettato, invia ACK 4
```

> **Limite di GBN**: una singola perdita provoca la ritrasmissione a cascata di molti pacchetti che erano già giunti a destinazione intatti.

---

## Protocollo Selective Repeat (SR)

Per eliminare le ritrasmissioni inutili di GBN si utilizza il protocollo **Selective Repeat (Ripetizione Selettiva)**:
- Il mittente ritrasmette **solo ed esclusivamente** i pacchetti effettivamente persi o corrotti.
- Il ricevitore invia **ACK individuali** per ciascun singolo pacchetto ricevuto correttamente.
- **Buffering Fuori Ordine**: se il ricevitore riceve pacchetti fuori sequenza (es. riceve `pkt 3` e `pkt 4` mentre attende `pkt 2`), **li memorizza nel proprio buffer interno** e invia i rispettivi ACK individuali.
- Quando `pkt 2` viene ritrasmesso e finalmente ricevuto, il ricevitore consegna l'intero blocco ordinato (`2, 3, 4`) all'applicazione e fa scorrere la finestra.

```
  Mittente SR                              Ricevitore SR
       |--- Pkt 2 (PERSO!) -------------------x|
       |--- Pkt 3 ---------------------------->| Bufferizzato in memoria! Invia ACK 3
       |--- Pkt 4 ---------------------------->| Bufferizzato in memoria! Invia ACK 4
       |<-- ACK 3 (Registrato) ----------------|
       |<-- ACK 4 (Registrato) ----------------|
    [TIMEOUT solo per Pkt 2!]                  |
       |--- Pkt 2 (Ritrasmesso) -------------->| Ricevuto! Consegna 2, 3, 4 all'applicazione
       |<-- ACK 2 -----------------------------| e fa avanzare la finestra.
```

---

## Dilemma dello Spazio dei Numeri di Sequenza in Selective Repeat

Nei calcolatori i numeri di sequenza sono rappresentati con un numero finito di bit $k$ (intervallo modulo $2^k$).  
Cosa accade se la dimensione della finestra $N$ è troppo grande rispetto allo spazio dei numeri di sequenza?

### Esempio Critico: Finestra $N = 3$, Numeri di Sequenza Modulo $4$ $\{0, 1, 2, 3\}$
1. Il mittente trasmette `pkt 0, pkt 1, pkt 2`.
2. Il ricevitore riceve tutti e 3 i pacchetti, fa avanzare la sua finestra a `[3, 0, 1]` e spedisce gli ACK.
3. **Scenario A (Tutti gli ACK persi)**:
   - Il mittente va in timeout e ritrasmette il vecchio `pkt 0`.
   - Il ricevitore vede arrivare un pacchetto numerato `0`: pensa che sia il **nuovo pacchetto 0** della nuova finestra!
4. **Scenario B (Gli ACK arrivano)**:
   - Il mittente fa scorrere la finestra e trasmette il nuovo `pkt 3` (che si perde) e poi il vero **nuovo `pkt 0`**.
   - Il ricevitore riceve `0`.
   - **Ambiguità insolubile**: il ricevitore non può sapere se `pkt 0` è una ritrasmissione del vecchio o un dato nuovo!

> [!IMPORTANT] Teorema della Dimensione della Finestra in Selective Repeat
> Per evitare qualsiasi ambiguità tra pacchetti nuovi e ritrasmessi, la dimensione della finestra $N$ non deve mai superare la **metà dello spazio totale dei numeri di sequenza**:
> $$N_{\text{finestra}} \le \frac{2^k}{2} = 2^{k-1}$$
