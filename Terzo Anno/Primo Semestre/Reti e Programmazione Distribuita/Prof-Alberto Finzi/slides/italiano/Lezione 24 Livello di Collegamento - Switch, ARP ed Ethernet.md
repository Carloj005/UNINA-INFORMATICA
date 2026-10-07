---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezione 24: Il Livello di Collegamento — Switch, Protocollo ARP ed Ethernet

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Il Principio del Carrier Sense e il Ritardo di Propagazione

Nella lezione precedente abbiamo visto il protocollo **CSMA (*Carrier Sense Multiple Access*)**: un nodo ascolta il canale prima di trasmettere per evitare collisioni.

- Perché le collisioni possono ancora verificarsi in CSMA?  
  **A causa del Ritardo di Propagazione del Segnale Fisico**:
  - I segnali elettrici o ottici si propagano a circa $2 \times 10^8\text{ m/s}$ (circa due terzi della velocità della luce nel vuoto).
  - Se il nodo $A$ inizia a trasmettere al tempo $t_0$, il segnale impiega un tempo finito $\tau$ per raggiungere il nodo $B$.
  - Se il nodo $B$ ascolta il canale a $t_0 + \epsilon$ (con $\epsilon < \tau$), trova il canale ancora libero e trasmette a sua volta!
  - I due segnali si scontrano nello spazio tra $A$ e $B$, generando una **collisione inevitabile**.

---

## CSMA con Rilevamento delle Collisioni: CSMA/CD

Per evitare di sprecare banda continuando a trasmettere una trama già danneggiata da una collisione, lo standard Ethernet classico (IEEE 802.3) adotta **CSMA/CD (*Collision Detection*)**:

1. **Ascolta prima di trasmettere (*Carrier Sense*)**: trasmette solo se il canale è libero.
2. **Ascolta durante la trasmissione (*Collision Detection*)**:
   - La scheda di rete misura costantemente la potenza del segnale sul mezzo trasmissivo durante la trasmissione.
   - Se rileva un'anomalia di tensione (segnale di collisione), **interrompe immediatamente la trasmissione**.
3. **Invio del Segnale di Jamming**:
   - Emette una sequenza di bit di disturbo (*Jamming Signal*) per garantire che tutte le stazioni collegate rilevino chiaramente l'avvenuta collisione.
4. **Algoritmo di Backoff Esponenziale Binario (*Exponential Backoff*)**:
   - Dopo la $k$-esima collisione consecutiva, il nodo sceglie un tempo di attesa casuale nell'intervallo $\{0, 1, 2, \dots, 2^k - 1\}$ tempi di slot prima di riprovare.

---

## Indirizzi Fisici di Livello 2: gli Indirizzi MAC

Ogni interfaccia di rete nel mondo è identificata da un **Indirizzo MAC (*Media Access Control Address*)**:
- Lunghezza fissa di **48 bit (6 byte)**, convenzionalmente rappresentato in cifre esadecimali separate da due punti o trattini:
  $$\mathtt{1A:2F:BB:76:09:AD}$$
- **Struttura dell'Indirizzo MAC**:
  - Primi 24 bit: **OUI (*Organizationally Unique Identifier*)**, codice univoco assegnato dall'IEEE al produttore della scheda (Intel, Broadcom, Realtek).
  - Ultimi 24 bit: numero di serie progressivo dell'interfaccia assegnato dal fabbricante.
- **Caratteristiche Fondamentali**:
  - È un indirizzo **piatto (*Flat*)**: a differenza degli indirizzi IP gerarchici, non cambia mai quando il dispositivo si sposta geograficamente o cambia rete.
  - **Indirizzo di Broadcast MAC**: $\mathtt{FF:FF:FF:FF:FF:FF}$ (tutti i 48 bit a 1).

---

## Il Protocollo ARP (*Address Resolution Protocol*)

Come fa un host $A$ a incapsulare un pacchetto IP destinato all'host $B$ all'interno di una trama Ethernet se conosce solo l'IP di $B$ e non il suo MAC?  
La traduzione dinamica da IP a MAC è svolta dal protocollo **ARP (RFC 826)**.

```
+-----------------------------------------------------------------+
| LIVELLO DI RETE (IP)      ---> Conosce l'indirizzo IP target    |
+-----------------------------------------------------------------+
                                 |  [ Risoluzione ARP ]
                                 v
+-----------------------------------------------------------------+
| LIVELLO LINK (MAC)        ---> Ricava il corrispondente MAC     |
+-----------------------------------------------------------------+
```

- Ogni nodo mantiene in memoria una **Tabella ARP (*ARP Cache*)** contenente mappature temporanee:
  $$\langle \text{Indirizzo IP},\ \text{Indirizzo MAC},\ \text{TTL} \rangle$$
- Il TTL (solitamente 20 minuti) garantisce l'aggiornamento automatico se una scheda di rete viene sostituita.

---

## Ciclo di Funzionamento di ARP nella Stessa Sottorete

Supponiamo che l'Host $C$ (`222.222.222.220`) voglia trasmettere all'Host $A$ (`222.222.222.222`), ma non ha il MAC di $A$ nella propria cache:

1. **Richiesta ARP (*ARP Request*) in Broadcast**:
   - $C$ crea un pacchetto ARP con domanda: *"Chi ha l'IP 222.222.222.222? Comunica il tuo MAC a 222.222.222.220"*.
   - Il pacchetto viene incapsulato in una trama Ethernet con **MAC destinazione di Broadcast** (`FF:FF:FF:FF:FF:FF`).
   - Tutti i nodi della LAN ricevono la trama e la passano al rispettivo modulo ARP.
2. **Risposta ARP (*ARP Reply*) in Unicast**:
   - Solo l'Host $A$ riconosce il proprio IP.
   - $A$ memorizza la corrispondenza di $C$ e risponde inviando una trama Ethernet diretta in **Unicast** specificamente al MAC di $C$:
     *"Sono 222.222.222.222 e il mio MAC è 1A:2F:BB:76:09:AD"*.
3. $C$ salva il MAC nella propria cache ARP e trasmette immediatamente la trama dati.

---

## Risoluzione ARP per Destinazioni Esterne (Fuori Sottorete)

Cosa accade se l'Host $A$ vuole inviare un datagramma a un server web remoto su Internet (`128.119.40.186`)?

- L'Host $A$ esegue l'operazione di AND con la propria subnet mask e capisce che l'IP **non appartiene alla rete locale**.
- **Regola Cruciale**: $A$ non invia mai una richiesta ARP per l'IP del server remoto!
- $A$ invia invece la richiesta ARP per individuare l'indirizzo MAC del proprio **Router Locale (*Default Gateway*)**.
- $A$ incapsula il pacchetto con:
  - **IP Destinazione (Livello 3)**: `128.119.40.186` (il server remoto web finale).
  - **MAC Destinazione (Livello 2)**: il MAC dell'interfaccia LAN del **Router**.
- Il router riceve la trama, estrae il datagramma IP e lo instrada verso la WAN.

---

## Gli Switch di Livello di Collegamento (*Link-Layer Switches*)

Nelle reti locali moderne (LAN switched), gli host non sono collegati a un bus condiviso o a un vecchio hub ripetitore, ma sono connessi a uno **Switch Ethernet**:

- **Isolamento dei Domini di Collisione**:
  - Ogni porta dello switch costituisce un segmento isolato operante in modalità **Full-Duplex**.
  - Le stazioni possono trasmettere e ricevere simultaneamente: **le collisioni sono completamente eliminate!**
- **Dispositivo Plug-and-Play e Trasparente**:
  - Non richiede alcuna configurazione manuale da parte dell'amministratore.
  - Gli host terminali non sanno nemmeno dell'esistenza dello switch (vedono solo la connessione di rete).
- **Tabella di Commutazione (*Switch Table*)**:
  - Mappa le associazioni tra ciascun indirizzo MAC e la specifica porta fisica dello switch:
    $$\langle \text{Indirizzo MAC},\ \text{Porta Fisica Switch},\ \text{TTL} \rangle$$

---

## Meccanismo di Auto-Apprendimento (*Self-Learning*) dello Switch

Lo switch compila e aggiorna la propria tabella automaticamente analizzando il traffico in transito:

```
                      +-------------------+
                      |   SWITCH TABLE    |
                      | MAC A  -> Porta 1 |
                      | MAC B  -> Porta 2 |
                      +-------------------+
                       /        |        \
                   Porta 1   Porta 2   Porta 3
                      |         |         |
                   [Host A]  [Host B]  [Host C]
```

1. Quando una trama arriva sulla Porta 1 con MAC sorgente $A$, lo switch **apprende che $A$ si trova sulla Porta 1** e salva la voce nella tabella.
2. **Inoltro Selettivo (*Filtering & Forwarding*)**:
   - Lo switch esamina il MAC destinatario della trama:
     - **Se il MAC è già presente nella tabella** (es. $B$ su Porta 2): la trama viene inoltrata **esclusivamente sulla Porta 2**.
     - **Se il MAC non è presente (sconosciuto) o è Broadcast**: lo switch esegue il **Flooding**, inviando una copia della trama su tutte le porte attive tranne quella di ingresso.

---

## Formato della Trama Ethernet (Standard IEEE 802.3)

La trama Ethernet trasporta il datagramma IP attraverso il collegamento locale:

```
 0        7 8                  13 14                 19 20   21 22                 ... 1518
+----------+---------------------+---------------------+-------+----------------------+--------+
| Preamble | Destination MAC (6B)| Source MAC (6B)     | Type  | Data Payload (46-1500B)| CRC/FCS|
| (8 Byte) | (es. FF:FF:FF:FF..) | (es. 00:1A:2B:..)   | (2 B) | (Datagramma IPv4/v6) | (4 B)  |
+----------+---------------------+---------------------+-------+----------------------+--------+
```

### I Campi della Trama Ethernet:
- **Preamble (8 byte)**: 7 byte con sequenza alternata `10101010` seguiti da 1 byte `10101011` (*Start Frame Delimiter - SFD*) per agganciare e sincronizzare il clock del ricevitore.
- **Destination & Source MAC (6 byte ciascuno)**: indirizzi fisici dei nodi.
- **Type (EtherType, 2 byte)**: specifica il protocollo del livello superiore incapsulato nel payload (`0x0800` per IPv4, `0x0806` per ARP, `0x86DD` per IPv6).
- **Data Payload**: dimensione minima di **46 byte** (se inferiore viene inserito padding) e massima di **1500 byte** (**MTU standard di Ethernet**).
- **CRC / FCS (4 byte)**: codice di ridondanza ciclico a 32 bit per il controllo di integrità.
