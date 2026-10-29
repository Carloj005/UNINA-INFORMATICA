---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezione 17: Il Livello di Rete — Gestione degli Indirizzi e Protocollo IPv4

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Il Protocollo Internet (IP) e l'Indirizzamento

Il protocollo **IP (*Internet Protocol*)** governa il livello di rete di Internet garantendo la consegna dei dati tra macchine host (*Host-to-Host*):
- Esistono due versioni operative del protocollo:
  - **IPv4**: standard storico dominante, con indirizzi a **32 bit**.
  - **IPv6**: versione moderna a **128 bit**, introdotta per risolvere l'esaurimento degli indirizzi.
- **Che cos'è un Indirizzo IP?**
  - È un identificativo numerico a 32 bit, convenzionalmente rappresentato in **notazione decimale puntata (*Dotted-Decimal*)**:
    $$193.32.216.9 \iff \mathtt{11000001\ 00100000\ 11011000\ 00001001}_2$$
  - Lo spazio di indirizzamento a 32 bit consente un massimo teorico di $2^{32} \approx 4.29 \text{ miliardi}$ di indirizzi unici globali.

> [!IMPORTANT] Indirizzi e Interfacce di Rete
> Un indirizzo IP non è associato all'intero calcolatore in sé, ma alla sua **interfaccia di rete** (la scheda Ethernet o Wi-Fi). Un router con 4 porte fisiche possiede **4 indirizzi IP distinti**, uno per ciascuna interfaccia.

---

## Il Concetto di Sottorete (*Subnet*) e Subnetting

Assegnare indirizzi IP in modo puramente casuale renderebbe le tabelle di instradamento dei router impossibili da gestire e farebbe collassare la rete.

L'indirizzamento IP adotta una **struttura rigidamente gerarchica** (analoga ai prefissi telefonici internazionali e urbani):
- Un indirizzo IP è suddiviso logicamente in due parti:
  1. **Prefisso di Rete (*Network/Subnet ID*)**: identifica la specifica sottorete a cui l'interfaccia appartiene.
  2. **Identificativo dell'Host (*Host ID*)**: identifica la singola interfaccia all'interno di quella specifica sottorete.

```
       Indirizzo IP a 32 bit:
 [-----------------------------------+-------------------------------]
 |    Prefisso di Sottorete (Subnet) |    Identificativo Host (Host) |
 [-----------------------------------+-------------------------------]
```

---

## La Maschera di Sottorete (*Subnet Mask*)

Per stabilire quanti bit appartengono alla sottorete e quanti all'host, a ogni indirizzo IP è associata una **Subnet Mask**:
- È una sequenza binaria a 32 bit formata da una **serie ininterrotta di bit `1` a sinistra**, seguita da una serie di bit `0` a destra:
  $$\text{IP: } 193.32.216.9 \quad\iff\quad \mathtt{11000001\ 00100000\ 11011000\ 00001001}$$
  $$\text{Mask: } 255.255.255.0 \quad\iff\quad \mathtt{11111111\ 11111111\ 11111111\ 00000000}$$
- **Notazione Slash (CIDR)**: la maschera viene sintetizzata indicando il numero di bit a `1` dopo uno slash:
  $$193.32.216.9/24$$
- Per verificare se due host appartengono alla stessa sottorete, si esegue un'operazione di **AND logico bit a bit**:
  $$\text{Subnet ID} = \text{IP} \ \mathbf{AND}\ \text{Subnet Mask}$$

---

## Esempi di Topologie di Sottoreti

```
        Sottorete 223.1.1.0/24                     Sottorete 223.1.2.0/24
   [Host 223.1.1.1]   [Host 223.1.1.2]        [Host 223.1.2.1]   [Host 223.1.2.2]
          \                 /                        \                 /
           \               /                          \               /
          [ Router 1 ] ------------------------------------ [ Router 2 ]
          (223.1.1.4)         Sottorete Punto-a-Punto       (223.1.2.4)
                              Link: 223.1.9.0/24
```

### Regola Fondamentale delle Sottoreti:
- Tutti gli host connessi allo stesso segmento fisico (switch o hub) senza passare da un router appartengono alla **stessa sottorete** e possono comunicare direttamente a livello 2.
- I collegamenti diretti punto-a-punto tra router costituiscono **sottoreti autonome** a sé stanti (solitamente con maschera `/30` o `/31`).
- Per far dialogare host appartenenti a sottoreti diverse, il traffico deve obbligatoriamente attraversare un **Router (*Default Gateway*)**.

---

## Indirizzamento con Classi (*Classful Addressing*) e Limiti Storici

Negli anni '80 lo spazio IPv4 venne suddiviso rigidamente in **classi prefissate**:

| Classe | Bit Iniziali | Maschera Naturale | Reti Disponibili | Host per Rete | Utilizzo Storico |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **A** | `0...` | `/8` (`255.0.0.0`) | 128 | $\approx 16.7\text{ Milioni}$ | Grandi multinazionali, MIT, IBM |
| **B** | `10...` | `/16` (`255.255.0.0`)| 16.384 | $65.534$ | Grandi università e governi |
| **C** | `110...` | `/24` (`255.255.255.0`)| $\approx 2\text{ Milioni}$ | $254$ | Piccole aziende |
| **D** | `1110...` | Non applicabile | - | - | Gruppi Multicast |
| **E** | `1111...` | Non applicabile | - | - | Sperimentale e riservato |

> [!WARNING] Il Problema del Classful Addressing
> Rigidità estrema: un'organizzazione con 500 host non poteva usare una Classe C (max 254), quindi otteneva una Classe B sprecando oltre 65.000 indirizzi IP! Questo causò un rapido esaurimento dello spazio IPv4.

---

## Indirizzamento Senza Classi: CIDR (*Classless InterDomain Routing*)

Introdotto nel 1993 (RFC 1519), il **CIDR (*Classless InterDomain Routing*)** ha eliminato la rigidità delle classi, consentendo di allocare prefissi di lunghezza arbitraria:
- Notazione generale: **`a.b.c.d / x`**, dove $x$ è il numero esatto di bit dedicati alla rete.
- Il numero di host indirizzabili in un blocco con maschera $/x$ è dato da:
  $$\text{Numero Host Utili} = 2^{(32 - x)} - 2$$
  *(Si sottraggono 2 indirizzi riservati: l'indirizzo con tutti zero identifica la rete, mentre quello con tutti uno è l'indirizzo di broadcast).*

### Esempio: Blocco CIDR `/20`
- Prefisso: `200.23.16.0/20`
- Bit dedicati all'host: $32 - 20 = 12\text{ bit}$.
- Indirizzi totali: $2^{12} = 4096$ (4094 host assegnabili).
- Consente a un'azienda di suddividere internamente il proprio blocco in più sottoreti (es. 8 sottoreti `/23` o 16 sottoreti `/24`).

---

## Aggregazione dei Percorsi (*Route Aggregation / Supernetting*)

Il CIDR ha salvato le tabelle di instradamento globali di Internet grazie alla tecnica di **aggregazione dei percorsi**:

```
 ISP Regionale (Annuncia un unico prefisso: 200.23.16.0/20)
       |
       +---> Organizzazione 1 (Subnet 200.23.16.0/23)
       +---> Organizzazione 2 (Subnet 200.23.18.0/23)
       +---> Organizzazione 3 (Subnet 200.23.20.0/23)
       +---> ...
       +---> Organizzazione 8 (Subnet 200.23.30.0/23)
```

- I router dell'Internet backbone vedono e memorizzano **un'unica riga nella tabella di inoltro** (`200.23.16.0/20`) anziché 8 righe separate.
- L'allocazione globale degli indirizzi IP è coordinata da **ICANN / IANA** e delegata ai 5 Registri Regionali (**RIR**): RIPE NCC (Europa), ARIN (Nord America), APNIC (Asia-Pacifico), LACNIC (America Latina) e AFRINIC (Africa).

---

## Formato del Datagramma IPv4

Il pacchetto del livello di rete in Internet è il **Datagramma IPv4**:

```
 0                   15 16                   31
+---------+---------+-----------------------+
| Version |  HLEN   | Type of Service (ToS) | Total Length (16 bit) |
+---------+---------+-----------------------+-----------------------+
|        Identification (16 bit)            | Flags | Frag. Offset  |
+-------------------+-----------------------+-------+---------------+
|    TTL (8 bit)    |    Protocol (8 bit)   | Header Checksum (16 b)|
+-------------------+-----------------------+-----------------------+
|                    Source IP Address (32 bit)                     |
+-------------------------------------------------------------------+
|                  Destination IP Address (32 bit)                  |
+-------------------------------------------------------------------+
| Options (Opzionale, 0-40B) | Dati / Payload di Trasporto (TCP/UDP)|
+-------------------------------------------------------------------+
```

- **Dimensione Minima Header**: **20 byte** (senza opzioni).

---

## Campi dell'Header del Datagramma IPv4

- **Version (4 bit)**: versione del protocollo (`4` per IPv4, `6` per IPv6).
- **Header Length (HLEN, 4 bit)**: lunghezza dell'header in parole da 32 bit (valore minimo = 5, cioè $5 \times 4 = 20\text{ byte}$).
- **Type of Service (ToS / DiffServ, 8 bit)**: indica la priorità del traffico e qualità del servizio (QoS).
- **Total Length (16 bit)**: lunghezza totale del datagramma (header + payload) in byte (max $65.535\text{ byte}$).
- **Time to Live (TTL, 8 bit)**: contatore decrementato di 1 a ogni router (*hop*); quando raggiunge 0, il pacchetto viene scartato per prevenire cicli infiniti (*Routing Loops*), generando un messaggio ICMP *Time Exceeded*.
- **Protocol (8 bit)**: identifica il protocollo di trasporto del payload:
  - `6` = **TCP**, `17` = **UDP**, `1` = **ICMP**.
- **Header Checksum (16 bit)**: controllo di integrità del solo header (ricalcolato a ogni hop poiché il TTL cambia).

---

## Frammentazione e Riassemblaggio dei Datagrammi IPv4

Ogni protocollo di livello di collegamento (Link Layer) ha una dimensione massima di trama trasportabile, nota come **MTU (*Maximum Transmission Unit*)**:
- Ad esempio, **Ethernet ha un'MTU di 1500 byte**.
- Se un router riceve un datagramma di 4000 byte e deve inoltrarlo su un link con MTU di 1500 byte, è costretto a **frammentarlo** in più datagrammi indipendenti.

### I Campi di Controllo della Frammentazione:
1. **Identification (16 bit)**: codice numerico unico condiviso da tutti i frammenti originati dallo stesso datagramma.
2. **Flags (3 bit)**:
   - `DF` (*Don't Fragment*): se impostato a 1, vieta al router di frammentare (se supera l'MTU viene scartato, usato per *Path MTU Discovery*).
   - `MF` (*More Fragments*): impostato a 1 per tutti i frammenti tranne l'ultimo (impostato a 0).
3. **Fragment Offset (13 bit)**: specifica la posizione di inizio dei dati di questo frammento rispetto al datagramma originale, **misurata in unità di blocchi da 8 byte**.

---

## Il Riassemblaggio Finale all'Host di Destinazione

```
 Datagramma Originale: 4000 Byte (20B Header + 3980B Dati) [ID = 422]
                           |
                           v  Router (Link MTU = 1500 Byte)
 +-------------------------------------------------------------------------+
 | Frammento 1: ID=422, DF=0, MF=1, Offset=0    | 20B Header + 1480B Dati  |
 | Frammento 2: ID=422, DF=0, MF=1, Offset=185  | 20B Header + 1480B Dati  |
 | Frammento 3: ID=422, DF=0, MF=0, Offset=370  | 20B Header + 1020B Dati  |
 +-------------------------------------------------------------------------+
                           |
                           v  (Viaggiano indipendentemente nella rete)
                 [ Host di Destinazione ]
            Riassembla il pacchetto integro
```

- **Perché il riassemblaggio avviene solo sull'host finale?**
  - I router intermedi devono elaborare pacchetti a velocità di linea senza sprecare CPU e memoria di buffer.
  - Frammenti differenti possono seguire percorsi di rete completamente disgiunti.
- Se anche un solo frammento va perso lungo la rete, l'intero datagramma originale non può essere riassemblato e viene scartato, costringendo il livello di trasporto (TCP) a ritrasmettere il segmento completo.
