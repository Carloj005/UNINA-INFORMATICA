---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezione 14: Il Livello di Trasporto — Controllo di Flusso e di Congestione

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Controllo di Flusso vs Controllo di Congestione

Due funzionalità distintive e fondamentali di TCP rispetto a UDP sono la gestione della velocità di trasmissione per prevenire la saturazione dei buffer:

1. **Controllo di Flusso (*Flow Control*)**:
   - Problema **End-to-End locale** tra mittente e ricevitore.
   - Previene che un mittente troppo veloce inondi e saturi il buffer di ricezione dell'host destinatario, la cui applicazione potrebbe essere lenta nel consumare i dati.
2. **Controllo di Congestione (*Congestion Control*)**:
   - Problema **Globale di Rete**.
   - Previene che l'insieme dei mittenti su Internet inietti un volume di traffico eccessivo rispetto alla capacità fisica dei collegamenti e delle code dei **router intermedi**.

> Se i buffer (del ricevitore o dei router) traboccano, i pacchetti vengono scartati, innescando timeout e ritrasmissioni che possono degradare catastroficamente il throughput globale (*Congestion Collapse*).

---

## Meccanismo del Controllo di Flusso (*Flow Control*)

Quando TCP riceve byte corretti e in sequenza, li deposita nel buffer di ricezione del socket (`Receive Buffer`). L'applicazione legge i dati da questo buffer, ma potrebbe farlo a intermittenza o con ritardo.

- Il controllo di flusso è un **servizio di speed-matching**: adegua la velocità di trasmissione del mittente alla frequenza di lettura dell'applicazione ricevente.
- Si basa sull'annuncio continuo della **Finestra di Ricezione (`rwnd` - Receive Window)**:
  - Il ricevitore comunica al mittente lo spazio libero attualmente disponibile nel proprio buffer tramite il campo a 16 bit **Receive Window** nell'header di ogni segmento TCP.

```
       Buffer di Ricezione del Destinatario (RcvBuffer)
 [-----------------------------------------------------------------]
 | Dati letti dall'App | Dati memorizzati non ancora letti | SPAZIO LIBERO |
 [---------------------+-----------------------------------+---------------]
                       ^                                   ^               ^
                  LastByteRead                        LastByteRcvd         Fine Buffer
                                                           [<---- rwnd --->]
```

---

## Formulazione Matematica della Finestra di Ricezione (`rwnd`)

Definiamo i puntatori sul buffer del ricevitore:
- **`RcvBuffer`**: dimensione complessiva del buffer allocato nel kernel (in byte).
- **`LastByteRead`**: numero dell'ultimo byte letto ed estratto dal processo applicativo.
- **`LastByteRcvd`**: numero dell'ultimo byte giunto dalla rete e memorizzato nel buffer.

### Calcolo dello Spazio Libero (`rwnd`):
$$\mathbf{rwnd} = \mathbf{RcvBuffer} - (\mathbf{LastByteRcvd} - \mathbf{LastByteRead})$$

### Vincolo Rispettato dal Mittente:
$$\mathbf{LastByteSent} - \mathbf{LastByteAckd} \le \mathbf{rwnd}$$

> [!NOTE] Gestione della Finestra a Zero (`rwnd = 0`)
> Se l'applicazione ricevente smette di leggere, `rwnd` scende a 0 e il mittente si blocca. Per evitare deadlock (se l'ACK con la riapertura della finestra si perdesse), il mittente invia periodicamente un **segmento sonda da 1 byte**: la risposta del server con il nuovo valore di `rwnd` sbloccherà la trasmissione.

---

## Il Problema della Congestione della Rete

Immaginiamo due host (A e B) che trasmettono dati verso i rispettivi destinatari condividendo un router con un canale di uscita di capacità limitata $R$:

```
 Host A (Sorgente con rate λ_in) \
                                  +--> [ Router con Buffer Limitato ] --- Canale di uscita R ---> Destinatari
 Host B (Sorgente con rate λ_in) /
```

- Se la somma dei flussi $\lambda_{\text{in}} < R/2$, tutti i pacchetti attraversano il router con un ritardo finito e trascurabile.
- Quando il traffico offerto si avvicina alla capacità massima ($\lambda_{\text{in}} \to R/2$), le code nel router crescono esponenzialmente:
  - **Buffer Limitato**: le code si riempiono, i pacchetti in eccesso vengono scartati (*Drop*), e i mittenti ritrasmettono, moltiplicando inutilmente il traffico sulla rete.
  - **Buffer Illimitato**: nessun pacchetto viene perso, ma i ritardi di accodamento tendono a infinito, rendendo i dati inutilizzabili per l'applicazione.

---

## Approcci Architetturali al Controllo di Congestione

Nel panorama delle reti di calcolatori esistono due grandi filosofie di controllo:

1. **Controllo di Congestione End-to-End (Approccio Storico di TCP)**:
   - Nessun supporto esplicito dai nodi interni della rete.
   - Lo stato di congestione viene **dedotto autonomamente dai sistemi terminali** analizzando il comportamento della trasmissione: perdite di pacchetti, timeout o aumento sensibile del ritardo (RTT).
2. **Controllo di Congestione Assistito dalla Rete (*Network-Assisted*)**:
   - I router intermedi monitorano le proprie code e inviano feedback espliciti agli host mittenti o destinatari.
   - Implementato in Internet mediante **ECN (*Explicit Congestion Notification*)**: i router marcano 2 bit nell'header IP quando la coda si satura; il ricevitore riflette la notifica nel segmento TCP tramite i flag **`ECE`** (*ECN-Echo*) e il mittente risponde riducendo il rate e confermando con **`CWR`** (*Congestion Window Reduced*).

---

## Controllo di Congestione TCP End-to-End

TCP implementa il controllo di congestione end-to-end gestendo una variabile interna al mittente chiamata **Congestion Window (`cwnd`)**:

- La quantità di byte che il mittente può trasmettere contemporaneamente senza aver ricevuto ACK è limitata dal minimo tra la finestra del ricevitore e la finestra di congestione:
  $$\mathbf{LastByteSent} - \mathbf{LastByteAckd} \le \min\{\mathbf{cwnd},\ \mathbf{rwnd}\}$$

### Le Tre Questioni Chiave di TCP:
1. **Regolazione della Frequenza (*Rate Regulation*)**: il throughput di trasmissione è approssimabile da $\frac{\text{cwnd}}{\text{RTT}}$ byte al secondo.
2. **Rilevamento della Congestione (*Congestion Detection*)**: rilevato mediante **Eventi di Perdita (*Loss Events*)**:
   - Scadenza di un **Timeout** (congestione grave: la rete non riesce a far passare nemmeno gli ACK).
   - Ricezione di **3 ACK Duplicati** (congestione moderata: la rete è intasata ma i pacchetti successivi transitano).
3. **Adeguamento della Frequenza (*Rate Adjustment*)**: algoritmo di esplorazione dinamica della banda (*Bandwidth Probing*).

---

## L'Algoritmo di Jacobson per il Controllo di Congestione

Introdotto da Van Jacobson nel 1988, l'algoritmo regola `cwnd` alternando tre fasi operative:

```
 cwnd (in MSS)
  ^
  |                   /| (Perdita / 3 Dup ACK: Taglio a metà)
  |                  / |      /|
  |                 /  |     / |
  |       /|       /   |    /  |
  |      / |      /    |   /   |  <--- Andamento a "Dente di Sega" (Sawtooth)
  |     /  |     /     |  /    |
  |  --/   |    /      | /     |
  | /      |   /       |/      |
  +-------------------------------------> Tempo
   Slow  Congestion  Fast
   Start Avoidance   Recovery
```

1. **Slow Start (Partenza Lenta)**: crescita esponenziale iniziale della finestra per raggiungere rapidamente la piena capacità del canale.
2. **Congestion Avoidance (Evitamento della Congestione)**: crescita lineare prudente una volta superata la soglia di sicurezza.
3. **Fast Recovery (Ripresa Rapida)**: dimezzamento della finestra anziché ripartenza da zero in caso di 3 ACK duplicati.

---

## Dettaglio delle Fasi: Slow Start e Congestion Avoidance

### 1. Slow Start (Partenza Lenta)
- All'inizio della connessione, `cwnd` viene inizializzata a un valore piccolo (storicamente **1 MSS**, oggi spesso 10 MSS).
- Per **ogni ACK ricevuto con successo**, la finestra incrementa di 1 MSS:
  $$\text{Per ogni ACK: } \text{cwnd} \leftarrow \text{cwnd} + 1\text{ MSS}$$
- Poiché in un RTT vengono riscontrati tutti i pacchetti della finestra, **`cwnd` raddoppia a ogni RTT**: $1 \to 2 \to 4 \to 8 \to 16\dots$ (crescita esponenziale!).
- La fase di Slow Start termina quando `cwnd` raggiunge la soglia **`ssthresh` (*Slow Start Threshold*)**.

### 2. Congestion Avoidance (Evitamento della Congestione)
- Quando $\text{cwnd} \ge \text{ssthresh}$, la crescita esponenziale viene interrotta per evitare congestioni improvvise.
- La finestra viene incrementata linearmente di **1 solo MSS per ogni intero RTT**:
  $$\text{Ad ogni ACK: } \text{cwnd} \leftarrow \text{cwnd} + \frac{\text{MSS}}{\text{cwnd}} \cdot \text{MSS}$$

---

## Reazione agli Eventi di Perdita: Timeout vs 3 ACK Duplicati (AIMD)

La reazione del mittente dipende dalla gravità dell'evento di perdita rilevato:

### Caso 1: Rilevamento tramite Timeout (Congestione Grave)
- TCP interpreta il timeout come un blocco serio nei router lungo il percorso.
- Aggiorna la soglia dimezzando la finestra attuale: $\mathbf{ssthresh} \leftarrow \frac{\mathbf{cwnd}}{2}$.
- Fa crollare drasticamente la finestra di congestione a **1 MSS**:
  $$\mathbf{cwnd} \leftarrow \mathbf{1\ MSS}$$
- Riavvia la trasmissione ripartendo dalla fase di **Slow Start**.

### Caso 2: Rilevamento tramite 3 ACK Duplicati (TCP Reno - Fast Recovery)
- I pacchetti continuano ad arrivare al ricevitore, quindi la rete non è totalmente collassata.
- Aggiorna la soglia a metà finestra: $\mathbf{ssthresh} \leftarrow \frac{\mathbf{cwnd}}{2}$.
- Imposta $\mathbf{cwnd} \leftarrow \mathbf{ssthresh} + 3\text{ MSS}$ ed entra in **Fast Recovery**.
- Evita di ripartire da 1 MSS: non appena riceve il riscontro del pacchetto mancante ritrasmesso, torna subito in **Congestion Avoidance**.

> Questo comportamento alternato (incremento lineare prudente e dimezzamento moltiplicativo alla prima perdita) è noto come **AIMD (*Additive Increase Multiplicative Decrease*)**.
