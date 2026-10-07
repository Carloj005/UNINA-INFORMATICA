---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezione 23: Il Livello di Collegamento — Il Sottolivello MAC (*Medium Access Control*)

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Tipologie di Collegamenti Fisici: Punto-a-Punto vs Broadcast

Nel livello di collegamento si distinguono due architetture trasmissive fondamentali:

1. **Collegamenti Punto-a-Punto (*Point-to-Point Link*)**:
   - Connettono un singolo trasmettitore a un singolo ricevitore dedicato (es. collegamento in fibra tra due router core, protocollo PPP).
   - Nessun rischio di contesa del canale.
2. **Collegamenti ad Accesso Condiviso o Broadcast (*Broadcast Link*)**:
   - Un unico mezzo trasmissivo fisico condiviso a cui sono collegate contemporaneamente molteplici stazioni (es. Wi-Fi, reti cellulari, vecchie reti Ethernet con cavo coassiale a bus).
   - **Il Problema Cruciale: la Collisione**:
     - Se due o più nodi trasmettono contemporaneamente sullo stesso canale condiviso, i segnali elettrici o radio si sovrappongono, corrompendo irrimediabilmente i bit (*Collision*). Tutte le trame coinvolte diventano illeggibili e vanno perse!

---

## Il Ruolo dei Protocolli di Accesso Multiplo (MAC)

Un protocollo **MAC (*Multiple Access Control*)** è un algoritmo distribuito che coordina le trasmissioni dei nodi su un canale a diffusione:

### Requisiti di un Protocollo MAC Ideale:
Per un canale di capacità $R\text{ bps}$:
1. Quando **un solo nodo** ha dati da trasmettere, può utilizzare l'intera capacità del canale con un throughput effettivo pari a **$R$**.
2. Quando **$M$ nodi** hanno dati da trasmettere contemporaneamente, ciascuno ottiene in media un throughput equo pari a **$R / M$**.
3. **Decentralizzato**: nessun nodo master unico (il cui guasto paralizzerebbe l'intera rete); nessuna necessità di sincronizzazione globale complicata di clock.
4. **Semplice ed Economico** da implementare nell'hardware delle schede di rete.

---

## Tassonomia dei Protocolli di Accesso Multiplo

I protocolli MAC si suddividono in tre grandi classi architetturali:

```
                      PROTOCOLLI DI ACCESSO MULTIPLO (MAC)
                                        |
      +---------------------------------+---------------------------------+
      |                                 |                                 |
PARTIZIONAMENTO DEL CANALE        ACCESSO CASUALE                  A ROTAZIONE
- Divisione rigida della banda   - Trasmissione a pieno rate (R)   - Turni coordinati
- Nessuna collisione              - Rilevamento collisioni          - Overhead di controllo
- Esempi:                         - Esempi:                         - Esempi:
  * TDMA (Divisione di Tempo)       * ALOHA (Puro / Slotted)          * Polling
  * FDMA (Divisione Frequenza)      * CSMA (Carrier Sense)            * Token Ring
  * CDMA (Divisione di Codice)      * CSMA/CD (Ethernet)
```

---

## Partizionamento del Canale: TDMA, FDMA e CDMA

### 1. TDMA (*Time Division Multiple Access*)
- Il tempo è suddiviso in frame temporali ciclici, a loro volta divisi in **$N$ slot temporali**.
- Ciascun nodo trasmette solo durante il proprio slot dedicato a velocità $R$.
- **Pregio**: zero collisioni, perfettamente equo.
- **Difetto**: se un nodo non ha dati da inviare, il suo slot temporale va sprecato; un singolo nodo attivo non può superare la velocità media $R/N$.

### 2. FDMA (*Frequency Division Multiple Access*)
- Lo spettro di frequenza è diviso in $N$ canali più stretti ciascuno di capacità $R/N$.
- Presenta gli stessi vantaggi e svantaggi di TDMA.

### 3. CDMA (*Code Division Multiple Access*)
- A ciascun nodo viene assegnato un codice matematico ortogonale univoco (*Chipping sequence*).
- I nodi trasmettono contemporaneamente sulla stessa frequenza: il ricevitore estrae il segnale desiderato mediante prodotto scalare matematico. Ampiamente impiegato nelle reti cellulari 3G.

---

## Protocolli ad Accesso Casuale (*Random Access Protocols*)

Nei protocolli ad accesso casuale:
- Non vi è alcuna suddivisione preventiva di slot temporali o frequenze.
- Un nodo trasmette sempre alla **piena velocità del canale ($R$ bps)** non appena ha un pacchetto pronto.
- Quando si verifica una collisione tra trasmissioni sovrapposte, i nodi coinvolti ritrasmettono la propria trama dopo un tempo di attesa casuale (*Random Backoff*).

### Il Pioniere: Il Protocollo ALOHA (Università delle Hawaii, 1970)
- Progettato originariamente da Norman Abramson per collegare via radio le isole Hawaii.
- Ha introdotto il concetto moderno di accesso conteso e ritrasmissione casuale.
- Si suddivide in due varianti: **Pure ALOHA** e **Slotted ALOHA**.

---

## Slotted ALOHA: Funzionamento e Prestazioni

In **Slotted ALOHA**:
- Il tempo è discretizzato in slot temporali identici, ciascuno di durata pari al tempo di trasmissione di una trama ($L/R$).
- I nodi sono sincronizzati e possono iniziare a trasmettere **solo ed esclusivamente all'inizio di uno slot**.
- Se due nodi trasmettono nello stesso slot $\implies$ **Collisione**. Entrambi rilevano la collisione al termine dello slot.
- Per evitare collisioni ripetute, ciascun nodo ritrasmette la trama nello slot successivo con una certa probabilità $p$ (oppure attende con probabilità $1 - p$).

### Efficienza Massima di Slotted ALOHA:
- La probabilità che uno slot abbia successo con $N$ nodi attivi è $P = N \cdot p \cdot (1 - p)^{N-1}$.
- Al tendere di $N \to \infty$, il massimo valore teorico di efficienza è:
  $$\text{Efficienza Massima} = \frac{1}{e} \approx \mathbf{37\%}$$

---

## Pure ALOHA: Accesso Continuo non Sincronizzato

In **Pure ALOHA (ALOHA Puro)** non esistono slot né sincronizzazione temporale:
- Un nodo trasmette la trama nell'istante esatto in cui i dati arrivano dal livello superiore.
- **Intervallo di Vulnerabilità Raddoppiato**:
  - Se un nodo trasmette al tempo $t_0$, la sua trasmissione collide se qualsiasi altro nodo inizia a trasmettere nell'intervallo $[t_0 - 1, t_0 + 1]$ (finestra temporale di ampiezza $2 \times \text{durata trama}$).

```
             Trama considerata:        [    Pkt 1    ]
                                       ^             ^
 Intervallo Vulnerabile:       [ Pkt 2 ]             [ Pkt 3 ]
                           t_0 - 1           t_0          t_0 + 1
```

- A causa della finestra di vulnerabilità doppia, l'efficienza massima teorica di Pure ALOHA crolla alla metà di Slotted ALOHA:
  $$\text{Efficienza Massima} = \frac{1}{2e} \approx \mathbf{18.4\%}$$

---

## Oltre ALOHA: Il Principio del Carrier Sense (CSMA)

Nei protocolli ALOHA i nodi trasmettono alla cieca senza curarsi se qualcun altro stia già parlando sul canale.  
Nelle reti reali umane, se due persone parlano in una stanza, prima di intervenire **ascoltano** se qualcun altro sta parlando.

Questo principio naturale è alla base di **CSMA (*Carrier Sense Multiple Access*)**:
- **Ascolta prima di trasmettere (*Listen Before Transmit*)**:
  - Se il canale viene rilevato occupato (*Busy*), il nodo posticipa la trasmissione.
  - Se il canale viene rilevato libero (*Idle*), il nodo procede a inviare la propria trama.
- Nonostante il carrier sense, le collisioni possono ancora verificarsi a causa del **ritardo di propagazione del segnale** lungo il cavo fisico, come analizzeremo nella prossima lezione.
