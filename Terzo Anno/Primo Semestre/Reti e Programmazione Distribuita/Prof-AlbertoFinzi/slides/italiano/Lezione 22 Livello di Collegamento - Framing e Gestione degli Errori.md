---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezione 22: Il Livello di Collegamento — Framing e Gestione degli Errori

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Dal Livello di Rete al Livello di Collegamento e Fisico

- Se il livello di rete fornisce la comunicazione logica globale tra due host qualsiasi su scala planetaria (*Host-to-Host*), i **Livelli di Collegamento (*Link Layer*) e Fisico (*Physical Layer*)** gestiscono il trasferimento dei dati attraverso i **singoli collegamenti fisici adiacenti** (*Node-to-Node*).
- **L'Analogia del Viaggio**:
  - Immaginiamo di pianificare un viaggio da Napoli a Parigi:
    - Livello di Rete: definisce l'itinerario complessivo (Auto da Napoli a Roma $\to$ Treno da Roma a Milano $\to$ Volo aereo da Milano a Parigi).
    - Livello di Collegamento: è il singolo mezzo di trasporto specifico (l'automobile, il treno su rotaia, l'aeromobile), ciascuno con protocolli, regole di circolazione e formati di biglietto completamente differenti.
- Lungo il percorso di rete, lo stesso datagramma IP viene estratto e re-incapsulato in **Trame (*Frames*)** di tipo diverso a ogni salto (es. Ethernet $\to$ Fibra Ottica SONET $\to$ Wi-Fi 802.11).

---

## Servizi Offerti dal Livello di Collegamento

Il livello di collegamento può implementare fino a quattro servizi chiave:

1. **Delimitazione della Trama (*Framing*)**:
   - Incapsula il datagramma IP all'interno di una trama aggiungendo un'intestazione (*Header*) e spesso una coda (*Trailer*).
2. **Accesso al Canale (*Link Access / MAC*)**:
   - Coordina l'accesso a un mezzo trasmissivo condiviso (broadcast) evitando collisioni tra nodi concorrenti.
3. **Consegna Affidabile (*Reliable Delivery*)**:
   - Garantisce il transito esente da perdite attraverso conferme e ritrasmissioni locali.
   - **Nota di Progettazione**: essenziale su collegamenti wireless rumorosi e soggetti a frequenti interferenze (Wi-Fi, 4G/5G); solitamente assente su cavi in rame e fibra ottica ad bassissimo tasso di errore per evitare overhead ridondante con TCP.
4. **Rilevamento e Correzione degli Errori (*Error Detection & Correction*)**:
   - Meccanismi a livello di bit per rilevare ed eventualmente correggere alterazioni provocate dal rumore elettromagnetico.

---

## Dove Risiede il Livello di Collegamento?

A differenza dei livelli superiori (Trasporto e Applicazione, interamente software nel sistema operativo), il livello di collegamento è implementato da una combinazione di **hardware e software**:

```
+---------------------------------------------------------+
|     Sistema Operativo (Kernel Space) - CPU Principale   |
|     - Driver della Scheda di Rete (NIC Driver)          |
|     - Gestione Indirizzi IP, ARP, Code di Trasmissione  |
+---------------------------------------------------------+
                            |
                 [ Bus di Sistema: PCIe ]
                            v
+---------------------------------------------------------+
| Scheda di Rete (NIC - Network Interface Controller)     |
| - Controller di Livello 2 (Framing, MAC, CRC Hardware)   |
| - Ricetrasmettitore di Livello 1 Fisico (PHY)           |
+---------------------------------------------------------+
```

- L'elaborazione del framing e il calcolo del CRC vengono eseguiti direttamente nei circuiti ASIC della scheda di rete alla velocità della luce (*Line Rate*).

---

## Tecniche di Delimitazione della Trama (*Framing Methods*)

Il livello fisico trasmette un flusso ininterrotto di bit o segnali elettrici. Come fa il ricevitore a identificare dove inizia e dove finisce una trama?  
Esistono 4 metodi fondamentali:

1. **Conteggio dei Byte (*Byte Count*)**:
   - Il primo byte della trama specifica la lunghezza complessiva dei byte contenuti.
   - **Criticità**: se un singolo bit di errore altera il campo conteggio, il ricevitore perde l'allineamento con tutte le trame successive (*Desincronizzazione Catastrofica*). Metodo non usato nei protocolli moderni.
2. **Byte Stuffing (Inserimento di Byte di Escape)**.
3. **Bit Stuffing (Inserimento di Bit a Zero)**.
4. **Violazioni di Codifica del Livello Fisico (*Coding Violations*)**.

---

## Byte Stuffing (Riempimento di Byte)

Utilizzato nei protocolli orientati ai byte (es. PPP su collegamenti seriali):
- La trama inizia e finisce con un byte speciale riservato chiamato **`FLAG`** (es. `0x7E`).
- **Problema**: cosa succede se il file trasferito contiene al suo interno un byte identico a `FLAG`? Il ricevitore penserebbe prematuramente che la trama sia finita!
- **Soluzione (*Stuffing*)**: il mittente inserisce un byte di escape speciale (**`ESC`**, `0x7D`) immediatamente prima di ogni byte `FLAG` o `ESC` presente nei dati applicativi.
- Il ricevitore rimuove il byte di `ESC` (*Un-stuffing*) e ripristina i dati originali.

```
 Dati Originali:      [ A ] [ FLAG ] [ B ]
 Dopo Byte Stuffing:  [ FLAG ] [ A ] [ ESC ] [ FLAG ] [ B ] [ FLAG ]
                                     ^^^^^^^^^^^^^^^
                                 Byte di FLAG neutralizzato
```

---

## Bit Stuffing (Riempimento di Bit)

Utilizzato nei protocolli moderni orientati ai bit (es. standard HDLC, Frame Relay):
- Il delimitatore di inizio e fine trama è la sequenza fissa a 8 bit **`01111110`** (ovvero uno `0`, seguito da **sei bit `1`**, seguiti da uno `0`).
- **Regola lato Trasmettitore**:
  - Ogni volta che il trasmettitore incontra nei dati una sequenza di **cinque bit `1` consecutivi**, inserisce automaticamente un bit **`0`** forzato:
    $$\mathtt{11111} \xrightarrow{\text{Bit Stuffing}} \mathtt{11111\mathbf{0}}$$
- **Regola lato Ricevitore**:
  - Se il ricevitore legge cinque bit `1` consecutivi seguiti da uno `0`, rimuove lo `0` e ripristina la sequenza originale.
  - Se dopo cinque `1` legge un altro `1`, verifica se si tratta del delimitatore di fine trama (`01111110`) o di un errore di canale.

---

## Violazioni di Codifica del Livello Fisico (*Coding Violations*)

- Molte tecnologie di livello fisico (come la codifica **Manchester** in Ethernet a 10 Mbps o le codifiche **4B/5B** e **8B/10B** a Gigabit) impiegano alfabeti di linea ridondanti:
  - Ad esempio, in 4B/5B vengono mappati blocchi di 4 bit di dati in sequenze fisiche da 5 bit, lasciando alcune combinazioni di segnale non assegnate a nessun dato valido.
- **Funzionamento**:
  - Si utilizzano tali **simboli fisici non validi (*Coding Violations*)** come segnali inequivocabili di inizio trama (*Preamble*) o delimitatore di fine trama.
  - **Vantaggio Straordinario**: non richiede alcuno stuffing né a livello di byte né a livello di bit; l'efficienza trasmissiva dei dati è pari al 100%.

---

## Rilevamento e Correzione degli Errori: Bit di Parità

Per rilevare alterazioni di bit causate dal rumore di linea:

1. **Bit di Parità Semplice**:
   - Si aggiunge 1 singolo bit al blocco di $d$ bit dati per rendere il conteggio complessivo dei bit `1` sempre pari (*Parità Pari*) o dispari (*Parità Dispari*).
   - **Limite**: rileva unicamente un numero dispari di errori. Se due bit si invertono contemporaneamente, l'errore non viene rilevato!
2. **Parità Bidimensionale (*Two-Dimensional Parity*)**:
   - I dati vengono disposti in una matrice di $n$ righe e $m$ colonne.
   - Si calcola un bit di parità per ogni riga e un bit di parità per ogni colonna:
     - Consente non solo di rilevare ma di **correggere localmente un singolo errore di bit** (individuando l'incrocio tra la riga e la colonna con parità errata).
     - Rileva qualsiasi combinazione di 2 errori di bit.

---

## Controllo di Ridondanza Ciclico: il CRC (*Cyclic Redundancy Check*)

Il **CRC** è il meccanismo di error-checking più potente e ampiamente diffuso nelle reti moderne (impiegato in Ethernet, Wi-Fi, HDLC):
- Si basa sull'**Aritmetica Modulo 2**: le operazioni di addizione e sottrazione coincidono con l'operatore logico **XOR bit a bit** (senza riporti o prestiti).
- **Elementi del Protocollo**:
  - Dati applicativi: sequenza $D$ di $d$ bit.
  - Generatore polinomiale concordato: sequenza $G$ di $r + 1$ bit (con il bit più a sinistra pari a 1).

### Algoritmo lato Trasmettitore:
1. Aggiunge $r$ zeri in coda ai dati $D$ (moltiplica per $2^r$): $D \cdot 2^r$.
2. Esegue la divisione modulo 2 di $D \cdot 2^r$ per il generatore $G$, ottenendo un resto $R$ di $r$ bit:
   $$R = \text{Resto}\left( \frac{D \cdot 2^r}{G} \right)$$
3. Trasmette sul link la trama composta da $\langle D,\ R \rangle$ ($d + r$ bit).

---

## Verifica del CRC lato Ricevente e Standard Industriali

### Algoritmo lato Ricevitore:
- Il ricevitore riceve la sequenza di bit della trama e la divide modulo 2 per il generatore noto $G$:
  $$\text{Se } \text{Resto}\left(\frac{\text{Trama Ricevuta}}{G}\right) = 0 \implies \text{Trama Integra (Nessun errore rilevato)}$$
- Se il resto è diverso da zero, si è verificata una corruzione nei bit: la trama viene scartata.

### Standard Internazionali di Generatori CRC:
- **CRC-8** / **CRC-16**: impiegati in protocolli industriali e USB.
- **CRC-32 (Standard IEEE 802.3 Ethernet)**:
  - Polinomio generatore a 33 bit ($r = 32$).
  - Garantisce il rilevamento al 100% di tutti gli errori singoli e doppi, di tutti gli errori con numero dispari di bit invertiti e di qualsiasi raffica di errori (*Burst Error*) di lunghezza fino a 32 bit.

---

## Distanza di Hamming e Codici a Correzione d'Errore (ECC)

La **Distanza di Hamming** tra due parole binarie è il numero minimo di bit in cui esse differiscono:
- Se un codice trasforma $n$ bit di dati in parole di codice (*Codewords*) di $n + k$ bit, la distanza minima di Hamming del codice ($d_{\text{min}}$) determina le sue capacità matematiche:
  1. **Rilevamento degli Errori**: per rilevare fino a $e$ errori di bit, la distanza minima deve essere:
     $$d_{\text{min}} \ge e + 1$$
  2. **Correzione degli Errori**: per correggere fino a $t$ errori di bit, la distanza minima deve soddisfare:
     $$d_{\text{min}} \ge 2t + 1$$
- I codici di Hamming a correzione automatica (*Forward Error Correction - FEC*) consentono al ricevitore di ripristinare i dati corrotti senza dover richiedere una ritrasmissione al mittente, risultando cruciali nei collegamenti satellitari o deep-space con RTT elevatissimo.
