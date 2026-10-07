---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezione 10: Il Livello di Trasporto

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Dal Livello di Applicazione al Livello di Trasporto

- Il **Livello di Trasporto** fornisce una comunicazione logica **Process-to-Process** tra processi applicativi residenti su host differenti.
- I protocolli di trasporto sono eseguiti esclusivamente sui **sistemi terminali (*End Systems*)**:
  - **Lato Trasmittente**: frammenta i messaggi ricevuti dalle applicazioni in **segmenti**, vi appone gli header di trasporto e li passa al livello di rete (*IP*).
  - **Lato Ricevente**: riassembla i segmenti ricevuti dal livello di rete e li consegna al corretto socket dell'applicazione di destinazione.
- I dispositivi intermedi della rete (**Router**) esaminano unicamente i livelli fino al livello 3 (Rete/IP) e sono del tutto trasparenti rispetto agli header di trasporto.

```
+---------------------------------------------------------+
|                  Applicazione (Processi)                |
+---------------------------------------------------------+
                             |  (Messaggi)
                             v
+---------------------------------------------------------+
|             Livello di Trasporto (TCP / UDP)            | <--- Comunicazione Logica
+---------------------------------------------------------+      End-to-End tra Processi
                             |  (Segmenti)
                             v
+---------------------------------------------------------+
|               Livello di Rete (IP Datagram)             | <--- Host-to-Host (Router)
+---------------------------------------------------------+
```

---

## Responsabilità e Servizi del Livello di Trasporto

I protocolli del livello di trasporto (UDP e TCP) forniscono fino a quattro servizi fondamentali:

1. **Consegna Process-to-Process**:
   - Instradamento dei messaggi non semplicemente all'host (gestito da IP), ma al singolo specifico processo applicativo in esecuzione su quell'host.
2. **Controllo dell'Integrità (*Error Checking*)**:
   - Rilevamento di bit alterati durante la trasmissione mediante campi di controllo (**Checksum**).
3. **Trasferimento Dati Affidabile (*Reliable Data Transfer*)**:
   - Garanzia che i byte arrivino a destinazione senza perdite, duplicazioni e nel corretto ordine sequenziale (fornito solo da **TCP**).
4. **Controllo di Flusso e di Congestione (*Flow & Congestion Control*)**:
   - Evita che il trasmettitore sovraccarichi il ricevitore lento (*Controllo di Flusso*) o che saturi i router e i canali della rete Internet (*Controllo di Congestione*).

> **UDP**: fornisce unicamente i primi due servizi (process-to-process e checksum).  
> **TCP**: fornisce tutti e quattro i servizi, garantendo un canale affidabile e regolato.

---

## Consegna Process-to-Process: Multiplexing e Demultiplexing

Su un singolo host possono essere attivi simultaneamente decine di programmi di rete (navigatore web, client email, streaming musicale, terminale remoto).

- **Multiplexing (lato Trasmettitore)**:
  - Raccoglie i dati provenienti dai vari socket applicativi, incapsula ciascun blocco di dati con le informazioni di intestazione (porte sorgente e destinazione) e crea i segmenti da passare al livello IP.
- **Demultiplexing (lato Ricevente)**:
  - Esamina i campi di intestazione del segmento in arrivo, identifica il socket destinatario e consegna i dati al processo corretto.

```
   Processo A (Porta 12000)       Processo B (Porta 80)
             \                         /
              v                       v
      +---------------------------------------+
      |        MULTIPLEXING (Host Sorgente)   |
      +---------------------------------------+
                          | (Segmenti con porte)
                          v  Rete IP
                          |
      +---------------------------------------+
      |       DEMULTIPLEXING (Host Destinaz.) |
      +---------------------------------------+
              /                       \
             v                         v
     Socket Porta 12000          Socket Porta 80
```

---

## Porte e Numeri di Porta (*Port Numbers*)

L'identificativo che distingue i diversi socket all'interno di un host è il **Numero di Porta** (intero a **16 bit**, compreso tra **0 e 65535**):

- **Porte Well-Known (0 – 1023)**:
  - Riservate a protocolli applicativi standard e controllate da **IANA** (*Internet Assigned Numbers Authority*). Sui sistemi Unix richiedono privilegi di root.
- **Porte Registrate (1024 – 49151)**:
  - Assegnate a servizi applicativi specifici e software di terze parti.
- **Porte Dinamiche o Effimere (49152 – 65535)**:
  - Assegnate automaticamente dal sistema operativo ai client per comunicazioni temporanee.

### Principali Porte Well-Known Standard:
| Porta | Protocollo | Servizio Applicativo |
| :---: | :---: | :--- |
| **20 / 21** | FTP | Trasferimento Dati e Controllo File |
| **22** | SSH | Shell Remota Sicura |
| **25** | SMTP | Instradamento Email tra Server |
| **53** | DNS | Risoluzione Nomi di Dominio |
| **80** | HTTP | Navigazione Web non crittografata |
| **110** | POP3 | Scaricamento Email lato Client |
| **143** | IMAP | Gestione e Sincronizzazione Email |
| **443** | HTTPS | Navigazione Web Sicura su TLS/SSL |

---

## Analisi e Ispezione delle Porte: `nmap`

Per scansionare lo stato delle porte su una macchina o su una rete si utilizza il comando di sicurezza **`nmap` (*Network Mapper*)**:

```bash
# Scansione completa delle porte su un indirizzo target:
sudo nmap 192.168.1.1

# Rilevamento dei servizi applicativi e delle versioni attive sulle porte aperte:
sudo nmap -sV 192.168.1.1

# Scansione mirata sulle N porte più frequenti:
sudo nmap --top-ports 20 192.168.1.1
```

### Stati Possibili di una Porta secondo Nmap:
- **`open`**: un'applicazione è in ascolto e accetta connessioni su quella porta.
- **`closed`**: la sonda di test riceve una risposta di rifiuto (nessuna applicazione in ascolto).
- **`filtered`**: un firewall o filtro pacchetti blocca le sonde; impossibile determinare lo stato reale.
- **`unfiltered`**: porta accessibile ma stato indeterminato.

---

## Demultiplexing Senza Connessione: Socket UDP

- Un socket UDP è identificato in modo univoco da una **coppia a 2 elementi (*2-Tuple*)**:
  $$\text{Tuple UDP} = \langle \text{IP Destinazione}, \text{Porta Destinazione} \rangle$$
- Quando un host riceve un segmento UDP:
  - Esamina la **Porta di Destinazione** nell'header UDP.
  - Consegna il segmento direttamente al socket legato a quella porta, **a prescindere dall'IP sorgente o dalla porta sorgente**.
- Due host remoti differenti che inviano pacchetti alla stessa porta UDP di destinazione finiscono nello **stesso identico socket** e vengono letti dallo stesso processo.

```
Host A (IP_A, porta 46428) ----> [IP_B:19157] \
                                               +--> [Unico Socket UDP (Porta 19157) su Host B]
Host C (IP_C, porta 33210) ----> [IP_B:19157] /
```

- La porta e l'IP del mittente servono unicamente al processo ricevente per sapere a chi indirizzare un'eventuale risposta (`recvfrom` popola `cliaddr`).

---

## Demultiplexing Orientato alla Connessione: Socket TCP

- A differenza di UDP, un socket TCP è identificato da una **quaterna a 4 elementi (*4-Tuple*)**:
  $$\text{Tuple TCP} = \langle \text{IP Sorgente}, \text{Porta Sorgente}, \text{IP Destinazione}, \text{Porta Destinazione} \rangle$$
- Quando un segmento TCP arriva all'host di destinazione:
  - Il kernel confronta **tutti e quattro i campi** con le connessioni attive.
  - Il segmento viene smistato al **socket di connessione dedicato specifico**.

```
Host A (IP_A:46428) ------ SYN -----> Welcoming Socket (Porta 80) su Server B
                                              | accept()
                                              v
                              Socket Dedicato 1 <--- Connessione esclusiva con Host A
                              (IP_A:46428 <-> IP_B:80)

Host C (IP_C:46428) ------ SYN -----> Welcoming Socket (Porta 80) su Server B
                                              | accept()
                                              v
                              Socket Dedicato 2 <--- Connessione esclusiva con Host C
                              (IP_C:46428 <-> IP_B:80)
```

> Due client con la stessa porta sorgente (es. `46428`) che contattano lo stesso server web sulla porta `80` **non collidono**, perché i loro IP sorgenti sono diversi!

---

## Architettura dei Server Web Concorrenti

- Nei moderni server Web ad alte prestazioni (Apache, Nginx):
  - Il server mantiene un unico **Welcoming Socket** sulla porta `80` (o `443`).
  - Per ogni nuova connessione accettata via `accept()`, viene istanziato un nuovo socket di connessione dedicato.
  - Per servire più client simultaneamente, il server delega il nuovo socket a:
    - Un **nuovo processo figlio** (modello `fork`).
    - Un **nuovo thread** di un thread pool (modello multithread leggero).
    - Un **ciclo di eventi asincrono non bloccante** (modello Event-Driven basato su `epoll` / `kqueue`).

```
Welcoming Socket (Porta 80) ---> [ Thread Pool ] ---> Worker 1 (Socket Client 1)
                                                 ---> Worker 2 (Socket Client 2)
                                                 ---> Worker 3 (Socket Client 3)
```

---

## Il Protocollo UDP (*User Datagram Protocol*)

Definito nella RFC 768, UDP è un protocollo di trasporto minimalista e leggero:
- **Senza Connessione (*Connectionless*)**: non effettua handshake prima di inviare pacchetti.
- **Nessuno Stato di Connessione (*No Connection State*)**: non traccia numeri di sequenza, acknowledge o finestre di congestione nel kernel.
- **Nessuna Garanzia (*Best-Effort Delivery*)**: i segmenti possono perdersi, arrivare duplicati o fuori sequenza.
- **Overhead Minimo**: aggiunge solo **8 byte** di intestazione, contro i **20 byte minimi** di TCP.

### Perché Utilizzare UDP anziché TCP?
1. **Controllo Applicativo Diretto**: l'applicazione decide esattamente quando e a quale velocità iniettare dati nella rete, senza che TCP limiti il throughput per congestione.
2. **Nessun Ritardo di Connessione**: zero RTT di latenza iniziale (ideale per query veloci come DNS).
3. **Minore Consumo di Memoria sul Server**: nessun descrittore di stato o buffer di ritrasmissione pesante, consentendo a un singolo server di gestire centinaia di migliaia di client attivi contemporaneamente.

---

## Ambiti di Utilizzo di UDP

| Tipologia di Applicazione | Protocollo Applicativo | Protocollo Trasporto | Motivazione della Scelta |
| :--- | :---: | :---: | :--- |
| **Posta Elettronica** | SMTP | TCP | Perdite inaccettabili; affidabilità critica |
| **Navigazione Web** | HTTP/1.1 - HTTP/2 | TCP | Dati testuali e script richiedono integrità |
| **Web Moderno ad Alte Prestazioni** | HTTP/3 | UDP (QUIC) | Affidabilità implementata su UDP per eliminare l'Head-of-Line blocking |
| **Risoluzione Nomi** | DNS | UDP | Query singola veloce; se scade il timeout si ritrasmette |
| **Gestione di Rete** | SNMP | UDP | Deve funzionare anche quando la rete è congestionata |
| **Telefonia VoIP / Streaming Live** | RTP / WebRTC | UDP | La latenza è prioritaria rispetto alle piccole perdite di frame |

> [!WARNING] Il Dilemma delle Applicazioni Multimediali su UDP
> Lo streaming video non controllato su UDP può provocare il collasso della rete: non riducendo il bitrate in presenza di congestione, satura le code dei router provocando il blocco del traffico TCP concorrente (*Starvation*).

---

## Formato del Segmento UDP

L'intestazione UDP è estremamente compatta: ha una dimensione fissa di soli **64 bit (8 byte)** suddivisa in 4 campi da 16 bit:

```
 0                   15 16                   31
+-----------------------+-----------------------+
|  Source Port (16 bit) | Dest Port (16 bit)    |
+-----------------------+-----------------------+
|    Length (16 bit)    |   Checksum (16 bit)   |
+-----------------------+-----------------------+
|                                               |
|           Dati Applicativi (Payload)          |
|                                               |
+-----------------------------------------------+
```

### I 4 Campi dell'Intestazione UDP:
1. **Source Port (16 bit)**: porta del processo mittente.
2. **Destination Port (16 bit)**: porta del processo destinatario sull'host di arrivo.
3. **Length (16 bit)**: lunghezza totale in byte dell'intero datagramma UDP (**Header + Dati**). Valore minimo = 8 byte.
4. **Checksum (16 bit)**: codice di controllo per verificare l'assenza di errori e corruzioni nei bit durante il transito.

---

## Controllo di Integrità: il Checksum UDP

Il **Checksum UDP** a 16 bit fornisce il rilevamento degli errori sui dati trasmessi:

### Algoritmo lato Mittente:
1. Tratta tutti i dati del datagramma UDP (header + payload + pseudo-header IP) come una sequenza di **parole a 16 bit**.
2. Calcola la **somma aritmetica** di tutte le parole a 16 bit.
3. Se la somma genera un trabocco (*Carry bit* o overflow sul 17-esimo bit), tale bit viene ri-sommato al bit meno significativo (**Somma in Complemento a 1**).
4. Calcola il **complemento a 1** (inverte tutti i bit: `0` diventa `1`, `1` diventa `0`) del risultato ottenuto.
5. Inserisce questo valore nel campo *Checksum* del pacchetto.

### Algoritmo lato Ricevitore:
- Somma tra loro tutte le parole a 16 bit ricevute, **incluso il valore di checksum**.
- Se nessun bit è stato alterato, il risultato della somma deve essere composto esclusivamente da bit `1`:
  $$\text{Risultato Atteso} = \mathtt{11111111\ 11111111}_2$$
- Se anche un solo bit è pari a `0`, il pacchetto contiene errori e viene scartato.
