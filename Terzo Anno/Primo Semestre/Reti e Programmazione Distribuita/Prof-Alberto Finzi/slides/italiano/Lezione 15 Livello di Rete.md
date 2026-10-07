---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezione 15: Il Livello di Rete — Architettura e Piano Dati (*Data Plane*)

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Dal Livello di Trasporto al Livello di Rete

- Mentre il livello di trasporto realizza una comunicazione logica tra **processi applicativi** (*Process-to-Process*), il **Livello di Rete** è responsabile della consegna fisica tra **macchine host** (*Host-to-Host delivery*):
  - **Host Trasmittente**: riceve i segmenti dal livello di trasporto, li incapsula in **datagrammi IP** e li inietta nel canale.
  - **Nodi Intermedi (Router)**: esaminano i campi di intestazione IP dei datagrammi e li instradano attraverso la rete salto dopo salto (**Hop**).
  - **Host Ricevente**: riceve i datagrammi, estrae i segmenti di trasporto e li passa al protocollo superiore (TCP o UDP).
- I protocolli del livello di rete sono presenti ed eseguiti in **ogni singolo host e in ogni singolo router** della rete globale Internet.

---

## Modello di Servizio della Rete Internet: il Servizio *Best-Effort*

Quali garanzie ideali potrebbe offrire un livello di rete?
- Consegna garantita senza perdite.
- Consegna con ritardo limitato (es. latenza $< 50\text{ ms}$).
- Consegna rigorosamente ordinata dei pacchetti.
- Banda minima garantita per il flusso (es. $10\text{ Mbps}$).
- Sicurezza e cifratura nativa all'origine.

> **Il Modello di Internet: Best-Effort Delivery**  
> L'architettura di rete di Internet offre un **unico e minimale servizio**: il *Best-Effort* (il *"massimo impegno"*).  
> Non garantisce la consegna, non garantisce l'ordine, non offre garanzie di ritardo né di banda minima.  
> Nonostante la semplicità, questo modello minimalista, combinato con l'elevata capacità dei collegamenti fisici moderni e con l'intelligenza di TCP agli estremi (*End-to-End Principle*), ha consentito la scalabilità globale della rete.

---

## Le Due Funzioni Chiave del Livello di Rete: Forwarding e Routing

L'operato dei router si suddivide in due compiti architetturali distinti:

```
+-------------------------------------------------------------------+
| PIANO DI CONTROLLO (Control Plane) - GLOBALE                      |
| Determina il percorso ottimale end-to-end dalla sorgente          |
| alla destinazione (Algoritmi di Routing: OSPF, BGP, SDN)          |
+-------------------------------------------------------------------+
                                 | Calcola e installa la Tabella di Inoltro
                                 v
+-------------------------------------------------------------------+
| PIANO DEI DATI (Data Plane) - LOCALE AL ROUTER                    |
| Trasferisce i pacchetti in arrivo sulla porta di ingresso         |
| alla corretta interfaccia di uscita (Forwarding via Hardware)     |
+-------------------------------------------------------------------+
```

- **Inoltro (*Forwarding*)**: operazione locale, eseguita in **pochi nanosecondi** direttamente in **hardware**.
- **Instradamento (*Routing*)**: processo distribuito o centralizzato su scala di rete, eseguito in **secondi** via **software**.

---

## Architetture del Piano di Controllo: Distribuito vs Centralizzato (SDN)

Come viene popolata la tabella di inoltro (*Forwarding Table*) nei singoli router?

1. **Piano di Controllo Distribuito Tradizionale (Per-Router Control)**:
   - Ogni router ospita un componente software di routing (*Routing Processor*).
   - I router comunicano tra loro scambiandosi messaggi di stato (protocolli OSPF, RIP, BGP) e ciascuno calcola in autonomia la propria tabella locale.
2. **Piano di Controllo Centralizzato (Software-Defined Networking - SDN)**:
   - Un **Remote Controller logico centralizzato** (collocato in un data center ad alta affidabilità) calcola i percorsi ottimali per l'intera rete.
   - Il controller installa direttamente le tabelle di inoltro nei dispositivi fisici attraverso protocolli standard (es. OpenFlow).

---

## Architettura Interna di un Router

Un router moderno ad alte prestazioni è costituito da 4 blocchi funzionali:

```
                     +---------------------------+
                     |    Routing Processor      | (Control Plane - Software)
                     +---------------------------+
                                   ^
                                   | Bus di gestione interno (PCI)
                                   v
+--------------+           +---------------+           +---------------+
| Input Port 1 | --------> |               | --------> | Output Port 1 |
+--------------+           |   SWITCHING   |           +---------------+
| Input Port 2 | --------> |    FABRIC     | --------> | Output Port 2 |
+--------------+           |  (Struttura   |           +---------------+
| Input Port N | --------> | di Commutaz.) | --------> | Output Port N |
+--------------+           +---------------+           +---------------+
(Interfaccia Ingresso)                                  (Interfaccia Uscita)
```

- **Input Ports**: terminazione linea fisica, decapsulamento e lookup indirizzo IP.
- **Routing Processor**: esecuzione demoni di routing e manutenzione tabelle.
- **Switching Fabric**: matrice hardware ad altissima velocità di trasferimento dati.
- **Output Ports**: code di accodamento, scheduling e trasmissione sul link fisico.

---

## Porte di Ingresso e Lookup della Forwarding Table

Quando un datagramma entra da una porta di ingresso:
1. Viene elaborato dal livello fisico e di collegamento.
2. Il router consulta la **Forwarding Table** per decidere l'interfaccia di uscita.
3. Per evitare colli di bottiglia, **ogni singola porta di ingresso possiede una copia in memoria shadow della Forwarding Table**, evitando di interrogare il processore centrale per ogni pacchetto.
4. L'operazione di ricerca in memoria viene velocizzata tramite hardware dedicato: memorie **TCAM (*Ternary Content Addressable Memory*)**, capaci di restituire il risultato del lookup in un singolo ciclo di clock.

```
       [ Bit Link ] ---> [ Livello Fisico ] ---> [ Livello Link ]
                                                       |
                                                       v
                                            [ Lookup Hardware TCAM ]
                                            (Trova porta di uscita)
                                                       |
                                                       v
                                            [ Verso la Switch Fabric ]
```

---

## Longest Prefix Matching (Corrispondenza al Prefisso più Lungo)

Nelle tabelle di inoltro, gli indirizzi IP di destinazione non sono memorizzati singolarmente (sarebbero oltre 4 miliardi di record!), ma sono raggruppati in **prefissi di rete**:

| Prefisso IP di Destinazione | Interfaccia di Uscita |
| :--- | :---: |
| `11001000 00010111 00010*** ********` (21 bit) | **Interfaccia 0** |
| `11001000 00010111 00011000 ********` (24 bit) | **Interfaccia 1** |
| `11001000 00010111 00011*** ********` (21 bit) | **Interfaccia 2** |
| Qualsiasi altro indirizzo (*Default Gateway*) | **Interfaccia 3** |

### Regola del Longest Prefix Match:
Se un indirizzo IP in arrivo corrisponde a più righe della tabella, il router inoltra il pacchetto all'interfaccia associata al **prefisso con il maggior numero di bit coincidenti**:
- Indirizzo Destinazione: `11001000 00010111 00011000 10101010`
- Corrisponde sia all'Interfaccia 1 (24 bit coincidenti) sia all'Interfaccia 2 (21 bit coincidenti).
- **Vince l'Interfaccia 1** (regola più specifica).

---

## Strutture di Commutazione (*Switching Fabric*)

La matrice di commutazione è il cuore che trasporta i pacchetti dalle porte di ingresso a quelle di uscita:

```
  1. COMMUTAZIONE A MEMORIA        2. COMMUTAZIONE A BUS        3. CROSSBAR NETWORK
       (Primi Router)               (Router Domestici/PMI)      (Router Backbone / Core)

      Porte In    Porte Out             Porte In    Porte Out         Porte In    Porte Out
        [In]       [Out]                  [In]       [Out]              [In]       [Out]
         |           ^                     |           ^                 |           ^
         v           |                     +-----+-----+                 +-----+-----+
       +---------------+                         |                             |
       | Memoria Cond. |                   [Bus Condiviso]             [Matrice a Griglia]
       +---------------+                  (1 solo pkt alla volta)      (Commutaz. Parallela)
```

1. **Memoria Condivisa**: pacchetto copiato nella RAM principale della CPU (lenta).
2. **Bus Condiviso**: trasferimento diretto tramite bus interno senza CPU; limitato dalla banda del bus.
3. **Rete di Interconnessione (*Crossbar Fabric*)**: maglia di commutazione con $N \times N$ incroci; consente a più porte di trasmettere contemporaneamente in parallelo senza collisioni.

---

## Problematiche di Accodamento e Head-of-Line (HOL) Blocking

Quando il flusso di pacchetti in ingresso supera la capacità di commutazione o la velocità della linea di uscita, si formano code nei buffer:

- **Accodamento all'Uscita**: si verifica quando più porte di ingresso inviano pacchetti contemporaneamente verso la stessa interfaccia di uscita (*Output Queueing*). Se il buffer si satura, i nuovi pacchetti vengono scartati (**Drop-Tail** o strategie attive come *RED - Random Early Detection*).
- **Accodamento all'Ingresso e Blocco Head-of-Line (HOL)**:
  - Se un pacchetto in testa alla coda dell'interfaccia 1 deve attendere che la porta di uscita $A$ si liberi, **blocca tutti i pacchetti dietro di sé**, anche se questi ultimi sono diretti a un'uscita $B$ completamente libera!

```
 In 1: [ Pkt per Out B ] [ Pkt per Out A ] ---> (Attesa: Out A è occupata!)
                                                (Il pacchetto per Out B rimane bloccato!)
 In 2:                   [ Pkt per Out A ] --->
```

---

## Politiche di Schedulazione dei Pacchetti (*Packet Scheduling*)

Quando una porta di uscita ha più pacchetti in coda, deve decidere l'ordine di trasmissione sul collegamento:

1. **FIFO (*First-In, First-Out*)**:
   - I pacchetti vengono serviti nel rigoroso ordine cronologico di arrivo.
   - Semplice ma non offre alcuna differenziazione di qualità del servizio (QoS).
2. **Accodamento con Priorità (*Priority Queuing*)**:
   - I pacchetti vengono classificati in categorie (es. per porta TCP/UDP o bit ToS/DiffServ).
   - I pacchetti della classe ad alta priorità (es. voce VoIP, videoconferenza) vengono trasmessi sempre prima di quelli a bassa priorità (es. download web o file).
3. **Round-Robin e Weighted Fair Queuing (WFQ)**:
   - Alterna il servizio ciclicamente tra le varie code.
   - In WFQ ciascuna coda ha un peso garantito in percentuale di banda, evitando che una classe affami (*Starvation*) le altre.
