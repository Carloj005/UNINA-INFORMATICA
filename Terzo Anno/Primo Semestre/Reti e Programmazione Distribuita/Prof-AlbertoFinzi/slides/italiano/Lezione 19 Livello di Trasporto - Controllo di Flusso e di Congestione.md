---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
style: |
  section {
    font-size: 21px;
    line-height: 1.38;
    padding: 48px 54px 52px 54px;
  }
  h1 { font-size: 1.9em; }
  h2 { font-size: 1.35em; margin-top: 0; margin-bottom: 0.45em; }
  h3 { font-size: 1.08em; margin: 0.4em 0 0.25em 0; }
  p, ul, ol { margin: 0.3em 0; }
  li { margin: 0.18em 0; }
  pre { font-size: 0.72em; line-height: 1.25; padding: 0.55em 0.8em; margin: 0.4em 0; }
  table { font-size: 0.86em; margin: 0.4em 0; }
  th, td { padding: 0.3em 0.55em; }
---

# Reti e Programmazione Distribuita
## Lezione 19: Il Livello di Trasporto — Controllo di Flusso e di Congestione
### Receive Window, Window Scaling, Scenari di Congestione, ECN, TCP Reno e Algoritmi Moderni

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Due Limiti Diversi, la Stessa Azione: Inviare Meno

In TCP esistono **due limiti distinti** alla velocità del mittente:

1. **Controllo di Flusso (*Flow Control*):**
   - Imposto dal **ricevitore** tramite il campo *Receive Window* (`rwnd`) dell'header TCP.
   - Protegge il **buffer di ricezione** dell'host destinatario quando l'applicazione legge lentamente.
2. **Controllo di Congestione (*Congestion Control*):**
   - Imposto dalla **rete** (non esiste alcun campo nell'header TCP che dica quanta banda è libera sul percorso!).
   - Protegge i **buffer dei router intermedi** dal traboccamento (*buffer overflow*).

- La perdita di pacchetti su Internet è raramente un cavo rotto: è quasi sempre **overflow di un buffer** (del ricevitore o di un router).
- L'affidabilità dice cosa fare *dopo* una perdita; flusso e congestione servono a **non causarla**.

---

## Controllo di Flusso (*Flow Control*): `rwnd`

TCP deposita i byte ricevuti correttamente e in ordine nel **Receive Buffer** del kernel; l'applicazione li legge con i propri tempi. Il controllo di flusso è un servizio di ***speed-matching***:

```text
         Buffer di Ricezione del Destinatario (RcvBuffer)
  [------------------------------------------------------------------]
  | Dati già letti dall'App | Dati ricevuti non letti | SPAZIO LIBERO|
  [-------------------------+-------------------------+--------------]
                            ^                         ^              ^
                       LastByteRead             LastByteRcvd    Fine Buffer
                                                      [<--- rwnd --->]
```

- **Spazio libero annunciato dal ricevitore in ogni segmento di ritorno:**
  $$\mathbf{rwnd} = \mathbf{RcvBuffer} - (\mathbf{LastByteRcvd} - \mathbf{LastByteRead})$$
- **Vincolo rispettato dal mittente** (*dati in volo* $\le$ spazio disponibile):
  $$\mathbf{LastByteSent} - \mathbf{LastByteAcked} \le \mathbf{rwnd}$$
- Poiché TCP è **full-duplex**, ogni direzione ha la propria finestra e ciascun estremo annuncia la propria `rwnd`.

---

## Quando la Finestra si Chiude: Deadlock e *Zero-Window Probes*

Immaginiamo che il ricevitore B riempia il proprio buffer e annunci **`rwnd = 0`**, senza avere dati propri da inviare ad A. Poco dopo l'applicazione su B legge e libera spazio (`rwnd > 0`). **Chi parla per primo?**

- **Nessuno!**
  - TCP invia segmenti solo quando ha dati da trasmettere oppure un `ACK` da restituire.
  - B non invia spontaneamente l'aggiornamento di `rwnd`, mentre A (che vede `rwnd = 0`) non può trasmettere nulla $\Rightarrow$ **deadlock infinito!**
- **Soluzione dello standard TCP (lato mittente):**
  - Quando `rwnd = 0`, il mittente A continua a inviare periodicamente segmenti da **1 solo byte di dati** (*Zero-Window Probes*).
  - Il ricevitore riscontra questi segmenti sonda con un `ACK` contenente il valore aggiornato di `rwnd`: appena `rwnd > 0`, il trasferimento riprende!

---

## Limite a 16 Bit della Finestra, BDP e *TCP Window Scaling*

- **Limite dell'header TCP originale:** il campo *Receive Window* è di **16 bit** $\Rightarrow$ valore massimo **65.535 byte ($\approx 64\text{ KB}$)**.
- **Impatto sul throughput (*Bandwidth-Delay Product*):**
  - Un mittente può avere al più una finestra in volo per ogni RTT: $\text{Rate}_{\max} = \frac{\text{Window}}{\text{RTT}}$.
  - Su un collegamento con $\text{RTT} = 100\text{ ms}$, una finestra da $64\text{ KB}$ limita la velocità a **$\approx 5\text{ Mbps}$**, anche se il canale fisico è da **1 Gbps**!
  - Per saturare **1 Gbps** con $\text{RTT} = 100\text{ ms}$ servono $1\text{ Gbps} \times 0.1\text{ s} = \mathbf{12.5\text{ MB}}$ in volo (circa 200 volte il limite a 16 bit!).
- **Soluzione — *TCP Window Scaling* (Opzione TCP):**
  - Durante il **3-way handshake**, ciascun estremo negozia un fattore di scala (*shift count* $S$), che resta fisso per l'intera connessione.
  - Il valore reale della finestra è ottenuto spostando a sinistra di $S$ bit il campo a 16 bit: $\text{Window}_{\text{reale}} = \text{Window}_{\text{header}} \times 2^S$.

---

## Il Problema della Congestione: Costi e Tre Scenari

Il controllo di flusso è un accordo tra i due estremi: la rete non ne fa parte, ma il percorso è **condiviso** da molti flussi. Che cosa costa davvero la congestione? Lo vediamo attraverso **tre scenari** progressivamente più realistici:

### Scenario 1: Due Mittenti, un Router con Buffer Infiniti

```text
  Host A (tasso λ_in) \
                       +--> [ Router (Buffer ∞) ] --- Link capacità R ---> Destinazioni
  Host B (tasso λ_in) /
```

- Con $\lambda_{\text{in}} < R/2$: tutto il traffico viene consegnato ($\lambda_{\text{out}} = \lambda_{\text{in}}$) con ritardo finito.
- Appena $\lambda_{\text{in}}$ si avvicina a $R/2$: il throughput si satura a **$R/2$** per connessione, ma il **ritardo di accodamento diverge all'infinito ($\to \infty$)**.
- Anche con buffer infiniti la rete diventa inutilizzabile: **Costo 1 = elevati ritardi di accodamento** quando il carico si avvicina alla capacità del link.

---

## Scenario 2: Due Mittenti e Router con Buffer Finiti

Con buffer di dimensione finita, i pacchetti in arrivo su una coda piena vengono **scartati** e la connessione affidabile li **ritrasmette**:
- $\lambda_{\text{in}}$: dati originali consegnati dall'applicazione al socket.
- $\lambda'_{\text{in}}$: **carico offerto** alla rete (dati originali + ritrasmissioni).
- $\lambda_{\text{out}}$: **throughput utile** consegnato all'applicazione destinataria.

| Caso | Comportamento | Effetto su $\lambda_{\text{out}}$ |
| :--- | :--- | :--- |
| **(a) Nessuna perdita** | Trasmissione ideale senza overflow | Raggiunge il massimo teorico $R/2$ |
| **(b) Ritrasmissione solo di pacchetti persi** | Buffer overflow $\Rightarrow$ perdite reali ritrasmesse | **Costo 2:** parte della banda è consumata dalle ritrasmissioni ($\lambda_{\text{out}} < R/2$) |
| **(c) Ritrasmissioni inutili** | Timeout prematuri duplicano pacchetti ancora in coda | **Costo 3:** il router trasporta copie duplicate già destinate ad arrivare $\Rightarrow$ throughput ancora più basso |

---

## Scenario 3: Quattro Mittenti, Rete Multihop e *Congestion Collapse*

Quattro mittenti inviano dati su percorsi sovrapposti a **2 hop**, contendendosi buffer finiti e capacità dei router intermedi:

```text
  A --(λ_in)--> [ R1 ] ----> [ R2 ] ----> Destinazione A
                  ^            |
                  |            v
                [ R4 ] <---- [ R3 ]   (4 flussi incrociati su percorsi a 2 hop)
```

- **Costo 4 — Spreco di capacità a monte:** un pacchetto può attraversare con successo il primo router (consumandone la banda), ma venire **scartato al secondo router** per congestione $\Rightarrow$ tutta la capacità usata sul primo hop è andata sprecata!
- ***Congestion Collapse*:** aumentando il carico offerto $\lambda'_{\text{in}}$, i router si saturano di traffico che verrà scartato a valle e il **throughput utile $\lambda_{\text{out}}$ crolla verso zero**!
- Nota storica: il *congestion collapse* si verificò realmente su Internet negli anni '80, motivando la nascita degli algoritmi di controllo di congestione TCP.

---

## Approcci al Controllo di Congestione

Esistono due grandi approcci per segnalare e gestire la congestione:

1. **Controllo di Congestione End-to-End *(approccio classico di TCP)*:**
   - Il livello di rete non fornisce supporto esplicito.
   - Gli host deducono la congestione osservando **perdite di pacchetti** (timeout o 3 ACK duplicati) o aumenti di RTT.
2. **Controllo di Congestione Assistito dalla Rete (*Network-Assisted*):**
   - I router intermedi segnalano esplicitamente lo stato di congestione al livello di trasporto.
   - Su Internet è standardizzato tramite **ECN (*Explicit Congestion Notification*, RFC 3168)**, sfruttando i flag TCP **`ECE`** e **`CWR`**.

---

## Controllo Assistito dalla Rete: ECN (RFC 3168)

**ECN** consente ai router congestionati di avvisare gli host **senza dover scartare i pacchetti**:

1. **Negoziazione ECN (nel 3-way handshake TCP):**
   - `SYN`: `ECE = 1, CWR = 1` (il client richiede ECN).
   - `SYN-ACK`: `ECE = 1, CWR = 0` (il server accetta ECN).
2. **Marcatura a livello IP (campo ECN a 2 bit nell'header IP):**
   - `00` = Not-ECT | `01` = ECT(1) | `10` = **ECT(0)** (pacchetto ECN-capable) | `11` = **CE** (*Congestion Experienced*).
   - Il mittente marca i pacchetti IP come `ECT(0)`. Se un router è congestionato, imposta i bit a **`CE = 11`** invece di scartare il datagramma.
3. **Feedback e Reazione TCP:**
   - Il livello IP del ricevitore avvisa il proprio TCP del bit `CE`; il ricevitore imposta il flag **`ECE`** negli `ACK` di ritorno.
   - Ricevuto `ECE`, il mittente **dimezza `cwnd`** (come per una perdita) e imposta **`CWR`** (*Congestion Window Reduced*) nel segmento successivo per confermare la riduzione.

---

## Controllo di Congestione TCP: `cwnd` e le Tre Questioni Chiave

In modalità end-to-end i mittenti non si coordinano tra loro: ciascuno reagisce in modo asincrono usando informazioni locali. Tre problemi fondamentali:

1. **Regolazione della velocità:** come limita il mittente il traffico immesso in rete?
2. **Rilevamento della congestione:** come capisce che il percorso è congestionato?
3. **Risposta alla congestione:** con quale algoritmo adegua la finestra?

- **Finestra di Congestione (`cwnd`):** il mittente mantiene la variabile `cwnd` e limita i byte non riscontrati in volo al **minimo** tra `cwnd` e `rwnd`:

$$\mathbf{LastByteSent} - \mathbf{LastByteAcked} \le \min\{\mathbf{cwnd},\ \mathbf{rwnd}\}$$

- Regolando `cwnd` si controlla dinamicamente la frequenza di trasmissione sul canale.

---

## Frequenza di Invio TCP, *Self-Clocking* ed Esempio Numerico

Poiché una finestra `cwnd` viene trasmessa e riscontrata nell'arco di circa un RTT, il tasso medio di invio è approssimato da:

$$\text{Sending Rate} \approx \frac{\text{cwnd}}{\text{RTT}}$$

- **Trasmissione *ACK-clocked* (Self-Clocking):** TCP non imposta esplicitamente un bitrate; sono gli `ACK` in arrivo che liberano spazio nella finestra consentendo l'invio di nuovi segmenti.
- **Esempio numerico:** $\text{cwnd} = 10\text{ MSS}$, $\text{MSS} = 1\,000\text{ byte}$, $\text{RTT} = 100\text{ ms} = 0{,}1\text{ s}$:
  $$\text{Sending Rate} \approx \frac{10 \times 1\,000\text{ byte}}{0{,}1\text{ s}} = 100\,000\text{ byte/s} = \mathbf{800\text{ kbit/s}}$$
- **Impatto sull'equità (*Fairness*):** poiché `cwnd` cresce in base agli ACK (cioè a ogni RTT), **connessioni con RTT più lungo aumentano la finestra più lentamente** e ottengono un throughput minore sullo stesso collo di bottiglia.

---

## Rilevamento della Congestione e *Bandwidth Probing*

- **Rilevamento tramite *Loss Events* (Eventi di Perdita):**
  1. **Timeout di ritrasmissione:** segnale di **congestione grave** (nemmeno i segmenti successivi raggiungono il ricevitore).
  2. **Ricezione di 3 ACK duplicati:** segnale di **congestione moderata** (un segmento è andato perso, ma altri segmenti continuano ad arrivare al ricevitore).
- **Esplorazione della banda (*Bandwidth Probing*):**
  - Finché gli `ACK` arrivano regolarmente senza perdite, TCP deduce che la rete non è satura e **aumenta `cwnd`**.
  - Appena rileva un evento di perdita, **riduce `cwnd`** (*backoff*) e ricomincia a sondare.
- I meccanismi di **TCP classico (Reno)** si articolano in **3 fasi**: *Slow Start*, *Congestion Avoidance* e *Fast Recovery*.

---

## Fase 1: *Slow Start* (Partenza Lenta)

- All'avvio della connessione, **`cwnd` parte da `1 MSS`** (es. con $\text{MSS} = 500\text{ B}$ e $\text{RTT} = 200\text{ ms}$ sono appena $20\text{ kbit/s}$).
- Per **ogni ACK ricevuto**, `cwnd` aumenta di `1 MSS` $\Rightarrow$ in un RTT la finestra **raddoppia** ($1 \to 2 \to 4 \to 8 \to 16\dots$):
  - **Crescita lineare negli ACK, esponenziale nel tempo** ("lento" è solo il punto di partenza, non la crescita!).
- **Quando termina lo Slow Start?** Al verificarsi di uno di 3 eventi:
  1. **Timeout:** `ssthresh = cwnd / 2`, `cwnd = 1 MSS` e si riparte da *Slow Start*.
  2. **`cwnd` raggiunge `ssthresh`** (*Slow Start Threshold*): si passa a **Congestion Avoidance** (crescita lineare).
  3. **3 ACK duplicati:** si esegue *Fast Retransmit* e si entra in **Fast Recovery** (TCP Reno).

---

## Fase 2: *Congestion Avoidance* (Evitamento della Congestione)

Una volta raggiunto `ssthresh`, la banda disponibile è vicina: TCP passa da crescita esponenziale a **crescita lineare prudente** di circa **`1 MSS` per RTT**:

- **Incremento per ogni ACK ricevuto:**
  $$\text{cwnd} \mathrel{+}= \text{MSS} \cdot \left(\frac{\text{MSS}}{\text{cwnd}}\right) = \frac{\text{MSS}^2}{\text{cwnd}}$$
- **Esempio numerico:** con $\text{cwnd} = 10\text{ MSS}$, ogni ACK aggiunge $\frac{1}{10}\text{ MSS} = 0{,}1\text{ MSS}$; dopo 10 ACK (cioè 1 intero RTT), la finestra è cresciuta esattamente di **`+1 MSS`**!
- **Cosa accade in caso di perdita durante Congestion Avoidance?**
  - **Timeout:** `ssthresh = cwnd / 2`, `cwnd = 1 MSS` $\to$ ritorno in **Slow Start**.
  - **3 ACK duplicati (TCP Reno):** `ssthresh = cwnd / 2`, `cwnd = ssthresh + 3 MSS` $\to$ passaggio a **Fast Recovery**.

---

## Fase 3: *Fast Recovery* (TCP Reno)

Innescata da **3 ACK duplicati**, evita il brusco crollo a `1 MSS` dello Slow Start:

1. **Fast Retransmit:** ritrasmette immediatamente il segmento mancante.
2. **Riduzione finestra:** imposta `ssthresh = cwnd / 2` e `cwnd = ssthresh + 3 MSS` (i 3 segmenti già arrivati hanno lasciato la rete).
3. **Ulteriori ACK duplicati:** `cwnd += 1 MSS` per ogni nuovo ACK duplicato ricevuto.
4. **Fine recupero (arriva un ACK per nuovi dati):** imposta `cwnd = ssthresh` e riprende **Congestion Avoidance**.
5. **Timeout durante Fast Recovery:** `ssthresh = cwnd / 2`, `cwnd = 1 MSS` $\to$ riparte da **Slow Start**.

---

## Macchina a Stati: Algoritmo Completo di TCP Reno

Tre stati operativi governati da due eventi chiave di perdita (*perdita lieve* = 3 dup ACK, *perdita grave* = timeout):

```text
  [ Slow Start ] ---(cwnd >= ssthresh)---> [ Congestion Avoidance ]
     |   ^                                        |          ^
     |   |___________ Timeout (cwnd=1) ___________|          |
     |                                            |          |
     +-------- 3 Dup ACK --------+--- 3 Dup ACK --+          | Nuovo ACK (cwnd=ssthresh)
                                 v                           |
                          [ Fast Recovery ] -----------------+
```

- **Riga superiore:** separata dalle due regole di crescita (*esponenziale* in Slow Start vs *lineare* in Congestion Avoidance).
- **Discesa in Fast Recovery:** perdita moderata (3 ACK duplicati); **ritorno a Slow Start:** perdita severa (timeout).

---

## Andamento a Dente di Sega (*Sawtooth*) e AIMD

```text
  cwnd (MSS)
   ^
   |                  /|  <- 3 Dup ACK: Fast Recovery (dimezza a ssthresh)
   |                 / |        /|
   |                /  |       / |      <-- AIMD: Additive Increase (+1 MSS/RTT)
   |        /|     /   |      /  |          Multiplicative Decrease (cwnd / 2)
   |       / |    /    |     /   |
   |  ssth/  |   /     |    /    |
   |   --/   |  /      |   /     |
   |  /      | /       |  /      |
   +---------+---------+---------+---------> Tempo (RTT)
    Slow     Timeout   CA      Fast Rec.
    Start    (cwnd=1)
```

- **AIMD (*Additive Increase, Multiplicative Decrease*):** la crescita lineare (+1 MSS/RTT) seguita dal dimezzamento alla congestione produce la classica curva a **dente di sega (*sawtooth*)** di Jacobson/Reno.

---

## Evoluzione degli Algoritmi di Controllo di Congestione

TCP Reno rappresenta il modello classico di riferimento, ma i sistemi moderni impiegano varianti ottimizzate per reti ad alta velocità e bassa latenza:

| Algoritmo | Principio di Funzionamento | Caratteristica Chiave |
| :--- | :--- | :--- |
| **TCP Tahoe** | Reset a `1 MSS` dopo **qualsiasi** perdita (timeout o 3 dup ACK) | Nessun *Fast Recovery* |
| **TCP Reno** | Introduce **Fast Recovery** dopo 3 ACK duplicati | Dimezza la finestra invece di ripartire da 1 MSS |
| **TCP CUBIC** | Crescita **cubica** di `cwnd` in Congestion Avoidance | Standard **default su Linux**; eccelle su link veloci ad alto BDP |
| **TCP Vegas** | Osserva variazioni di **RTT** per rilevare code crescenti | Controllo **basato sul ritardo** (*delay-based*), agisce prima delle perdite |
| **BBR** *(Google)* | Stima **banda collo di bottiglia** e **ritardo di propagazione** | Regola direttamente il ritmo di invio minimizzando le code |

---

## Sintesi della Lezione 19

- **Flow Control (`rwnd`):** protegge il buffer del ricevitore (integrato da *zero-window probes* e *Window Scaling* per superare il limite di 64 KB).
- **Costi della Congestione:** ritardi infiniti (Scenario 1), ritrasmissioni e timeout prematuri (Scenario 2), banda sprecata a monte e *congestion collapse* (Scenario 3).
- **Approcci:** end-to-end (perdite/ritardi) oppure assistito dalla rete (**ECN** con `ECT`/`CE` e `ECE`/`CWR`).
- **TCP Reno classico:** *Slow Start* (esponenziale fino a `ssthresh`), *Congestion Avoidance* (lineare $+1\text{ MSS/RTT}$), *Fast Recovery* (dimezzamento su 3 ACK duplicati) $\Rightarrow$ comportamento **AIMD**.
- **Limite effettivo del mittente:** i byte in volo non superano mai $\min\{\text{cwnd}, \text{rwnd}\}$, con tasso approssimato $\approx \text{cwnd}/\text{RTT}$.
