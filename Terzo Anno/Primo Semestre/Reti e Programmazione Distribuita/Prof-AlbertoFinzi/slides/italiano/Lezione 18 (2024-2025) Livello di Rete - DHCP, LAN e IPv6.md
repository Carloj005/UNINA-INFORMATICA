---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezione 18: Il Livello di Rete — DHCP, Reti Locali (LAN), NAT e IPv6

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Assegnazione degli Indirizzi IP: Statica vs Dinamica

All'interno di una sottorete, ogni interfaccia di rete deve ricevere un indirizzo IP valido, una maschera, un default gateway e l'indirizzo di almeno un server DNS:

1. **Configurazione Manuale (Statica)**:
   - L'amministratore di sistema o l'utente configura manualmente ogni singolo parametro nei file di sistema del dispositivo.
   - Adatta per server fissi, apparati di rete, stampanti condivise.
   - Ingestibile, soggetta a errori umani e conflitti di IP su reti con decine o centinaia di dispositivi mobili (smartphone, portatili).
2. **Configurazione Automatica (Dinamica - Plug-and-Play)**:
   - Il dispositivo richiede e ottiene automaticamente la configurazione non appena si connette fisicamente al cavo o alla rete Wi-Fi.
   - Gestita tramite il protocollo **DHCP (*Dynamic Host Configuration Protocol*)**.

---

## Il Protocollo DHCP (*Dynamic Host Configuration Protocol*)

Definito nella RFC 2131, DHCP opera secondo un'architettura **Client-Server**:
- Funziona su **UDP**: il server ascolta sulla porta **67**, il client sulla porta **68**.
- Permette il riutilizzo dinamico degli indirizzi: un host ottiene un IP in "affitto" temporaneo (**Lease Time**); quando si disconnette, l'IP torna nel pool disponibile per altri host.

### La Procedura di Assegnazione a 4 Fasi (DORA):
1. **Discover (DHCP Discover)**: il nuovo client trasmette in broadcast per scoprire i server DHCP attivi.
2. **Offer (DHCP Offer)**: i server DHCP rispondono proponendo una configurazione IP disponibile.
3. **Request (DHCP Request)**: il client sceglie una delle offerte e ne richiede formalmente l'assegnazione.
4. **Ack (DHCP ACK)**: il server conferma l'assegnazione e avvia il timer di concessione.

---

## Dettaglio del Ciclo di Negoziazione DHCP (DORA)

```
       Nuovo Client                                           Server DHCP
            |                                                      |
            |--- 1. DHCP Discover (Broadcast) -------------------->| UDP Porta 67
            |    Src: 0.0.0.0:68, Dest: 255.255.255.255:67         |
            |    ciaddr: 0.0.0.0, Transaction ID: 654              |
            |                                                      |
            |<-- 2. DHCP Offer (Broadcast o Unicast) --------------| UDP Porta 68
            |    Src: IP_Server:67, Dest: 255.255.255.255:68       |
            |    yiaddr (IP proposto): 192.168.1.105, Lease: 3600s |
            |                                                      |
            |--- 3. DHCP Request (Broadcast) --------------------->|
            |    Conferma accettazione IP: 192.168.1.105           |
            |                                                      |
            |<-- 4. DHCP ACK --------------------------------------|
            |    Parametri finali: IP, Mask, Gateway, DNS          |
```

- **Perché anche il passaggio 3 è in Broadcast?** Per notificare a eventuali altri server DHCP presenti che la loro offerta è stata declinata e possono liberare l'IP proposto.
- **DHCP Relay Agent**: se il server DHCP risiede in una sottorete diversa, il router locale funge da relay, inoltrando le richieste broadcast come pacchetti unicast verso il server remoto.

---

## Comandi di Diagnostica di Rete in Ambiente Linux

I moderni sistemi operativi forniscono utility avanzate per ispezionare la rete:

```bash
# Visualizza le interfacce attive, indirizzi IP e maschere:
ip addr

# Visualizza la tabella di instradamento del kernel (compreso il Default Gateway):
ip route

# Verifica della connettività e latenza verso un host (tramite pacchetti ICMP Echo):
ping 8.8.8.8

# Scansione dei dispositivi attivi all'interno della propria sottorete locale (Ping Sweep):
sudo nmap -sn 192.168.1.0/24
```

- **ICMP (*Internet Control Message Protocol*)**: protocollo di supporto del livello di rete impiegato da `ping` e `traceroute` per scambiarsi messaggi di errore e diagnostica (*Echo Request / Reply*, *Destination Unreachable*, *TTL Exceeded*).

---

## Spazio di Indirizzamento Privato (RFC 1918)

Per preservare l'esaurimento degli indirizzi IPv4 e garantire l'indipendenza gestionale delle reti locali, la IANA ha riservato tre intervalli di **Indirizzi IP Privati**:

| Classe Storica | Blocco CIDR | Intervallo Indirizzi IP | Numero Host |
| :---: | :---: | :---: | :---: |
| **A** | `10.0.0.0/8` | `10.0.0.0` — `10.255.255.255` | $16.777.214$ |
| **B** | `172.16.0.0/12` | `172.16.0.0` — `172.31.255.255` | $1.048.574$ |
| **C** | `192.168.0.0/16` | `192.168.0.0` — `192.168.255.255` | $65.534$ |

### Proprietà Fondamentali degli Indirizzi Privati:
- Sono validi e significativi **solo all'interno della rete locale (LAN)**.
- **Non sono instradabili su Internet**: i router pubblici scartano immediatamente qualsiasi datagramma avente come destinazione un IP privato.
- Possono essere riutilizzati simultaneamente da milioni di case e aziende nel mondo senza alcun conflitto.

---

## Network Address Translation (NAT)

Come possono centinaia di host con indirizzi privati comunicare contemporaneamente con i server della rete Internet pubblica?  
Attraverso il meccanismo del **NAT (*Network Address Translation*)**:

```
 [ RETE LOCALE PRIVATA (10.0.0.0/24) ]             [ INTERNET PUBBLICA ]
 Host A (10.0.0.1:3345) \
                         +--> [ ROUTER NAT ] -----> Web Server (128.119.40.186:80)
 Host B (10.0.0.2:5001) /     IP Pubblico WAN:
                              138.76.29.7
```

### Funzionamento del Router NAT:
1. All'esterno, il router NAT appare a Internet come **un singolo dispositivo** con un solo indirizzo IP pubblico globale (`138.76.29.7`).
2. Quando un host locale invia un pacchetto verso l'esterno, il router NAT:
   - Sostituisce l'IP sorgente privato con il proprio **IP pubblico**.
   - Assegna una **nuova porta sorgente libera**.
   - Memorizza l'associazione nella propria **Tabella di Traduzione NAT**.

---

## La Tabella di Traduzione NAT (*NAT Translation Table*)

Il router NAT tiene traccia di ogni connessione attiva mediante una tabella che mappa coppie (IP sorgente, Porta) private in numeri di porta pubblici:

| Indirizzo e Porta Lato WAN (Internet) | Indirizzo e Porta Lato LAN (Privata) |
| :---: | :---: |
| `138.76.29.7, porta 5001` | `10.0.0.1, porta 3345` |
| `138.76.29.7, porta 5002` | `10.0.0.2, porta 5001` |

### Risposta in Ingresso da Internet:
- Quando il server web risponde a `138.76.29.7:5001`:
  1. Il router consulta la tabella in base alla porta di destinazione `5001`.
  2. Identifica l'host reale `10.0.0.1:3345`.
  3. Riscrive l'IP e la porta di destinazione e inoltra il pacchetto all'interno della LAN.

> [!NOTE] Dibattito Architetturale sul NAT
> - **Vantaggi**: ha ritardato l'esaurimento di IPv4 di oltre 20 anni; sicurezza intrinseca (gli host interni non sono direttamente contattabili dall'esterno).
> - **Critiche**: viola il modello a livelli (un apparato di livello 3 manomette le porte del livello 4); complica i protocolli Peer-to-Peer (*NAT Traversal / STUN*).

---

## Configurazione di una LAN con Router Dual-Homed

Un router tipico che connette una rete locale a Internet possiede due interfacce logiche:
1. **Interfaccia WAN (Esterna)**:
   - Connessa all'ISP (modem fibra/ADSL).
   - Riceve un indirizzo IP pubblico (statico o dinamico dall'operatore).
2. **Interfaccia LAN (Interna)**:
   - Connessa agli switch locali o alla rete Wi-Fi.
   - Indirizzo privato (es. `192.168.1.1/24`), fungendo da **Default Gateway** per tutti i dispositivi interni.
   - Esegue il demone server **DHCP** distribuendo dinamicamente indirizzi nel range `192.168.1.100` – `192.168.1.200`.

```
 Internet (ISP) ---> [ WAN: 151.40.22.10 ] Router [ LAN: 192.168.1.1 ] ---> Switch
                                                                                |
                                     +------------------+-----------------------+
                                     |                  |                       |
                               Host 192.168.1.10  Host 192.168.1.11       Host 192.168.1.12
```

---

## Il Protocollo IPv6

Nei primi anni '90 l'IETF ha avviato lo sviluppo di una nuova versione del protocollo di rete per superare i limiti strutturali di IPv4: **IPv6** (RFC 8200).

### Obiettivi e Vantaggi Chiave di IPv6:
1. **Spazio di Indirizzamento Immensamente Espanso**:
   - Da 32 bit a **128 bit** ($2^{128} \approx 3.4 \times 10^{38}$ indirizzi unici).
   - Sufficiente per assegnare triliardi di indirizzi a ogni millimetro quadrato della superficie terrestre; elimina definitivamente la necessità del NAT!
2. **Header Semplificato a Dimensione Fissa (40 Byte)**:
   - Riduce il tempo di elaborazione dei datagrammi nei router ad altissima velocità.
3. **Migliore Supporto per QoS**: introduzione del campo *Flow Label*.
4. **Nessuna Frammentazione nei Router**: accelerazione drastica dell'inoltro hardware.
5. **Autoconfigurazione Nativa (*SLAAC*)**: configurazione stateless senza necessità di DHCP.

---

## Formato del Datagramma IPv6

L'intestazione IPv6 è stata ripulita e ha una dimensione rigida di **40 byte**:

```
 0                   15 16                   31
+---------+---------+-----------------------+
| Version |  Traffic Class  |        Flow Label (20 bit)    |
+---------+---------+-----------------------+---------------+
|     Payload Length (16 bit)       |  Next Header  |Hop Limit|
+-----------------------------------+---------------+---------+
|                                                             |
|               Source IP Address (128 bit / 16 byte)         |
|                                                             |
+-------------------------------------------------------------+
|                                                             |
|            Destination IP Address (128 bit / 16 byte)       |
|                                                             |
+-------------------------------------------------------------+
|              Payload Dati / Intestazioni di Estensione      |
+-------------------------------------------------------------+
```

---

## Campi dell'Header IPv6

- **Version (4 bit)**: valore costante impostato a `6`.
- **Traffic Class (8 bit)**: equivalente al ToS/DiffServ di IPv4 per gestire la priorità del traffico.
- **Flow Label (20 bit)**: identifica i datagrammi appartenenti allo stesso flusso (es. streaming multimediale real-time), garantendo un trattamento omogeneo.
- **Payload Length (16 bit)**: lunghezza in byte dei dati che seguono i 40 byte dell'header fisso.
- **Next Header (8 bit)**: identifica il protocollo a cui consegnare i dati (TCP, UDP) oppure l'eventuale **Extension Header** successivo (es. opzioni di routing, frammentazione, autenticazione IPSec).
- **Hop Limit (8 bit)**: analogo al TTL di IPv4; decrementato di 1 a ogni router.
- **Source & Destination Addresses (128 bit ciascuno)**: indirizzi di origine e destinazione.

### Cosa è Stato Rimosso Rispetto a IPv4?
- **Nessun Checksum**: elimina il ricalcolo ad ogni router, velocizzando l'inoltro (il controllo di integrità è già svolto a livello 2 e livello 4).
- **Nessuna Frammentazione nei Router**: se il pacchetto supera l'MTU, il router lo scarta e manda un messaggio ICMPv6 *Packet Too Big*. Il mittente frammenta alla sorgente (*Path MTU Discovery*).

---

## Transizione da IPv4 a IPv6

Poiché IPv6 non è retrocompatibile (i router e gli host puramente IPv4 non possono interpretare l'header IPv6), Internet sta affrontando una transizione graduale basata su due meccanismi:

```
 1. DUAL-STACK                           2. TUNNELING
    (I nodi parlano entrambi                (I datagrammi IPv6 viaggiano dentro
     i protocolli)                           pacchetti IPv4 attraverso router legacy)

     +---------------+                       [ IPv6 ] ---> [ Router IPv4 ] ---> [ IPv6 ]
     | Applicazione  |                                            |
     +---------------+                               +-------------------------+
     | IPv4  |  IPv6 |                               | Header IPv4 | Datagr IPv6|
     +---------------+                               +-------------------------+
```

1. **Dual-Stack**: i sistemi operativi moderni implementano contemporaneamente entrambi gli stack di rete, risolvendo sia record DNS di tipo `A` (IPv4) sia `AAAA` (IPv6).
2. **Tunneling**: per attraversare un'infrastruttura di rete intermedia ancora basata su IPv4, il datagramma IPv6 viene incapsulato all'interno del payload di un datagramma IPv4 ordinario e decapsulato all'uscita del tunnel.
