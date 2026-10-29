---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezione 01: Introduzione alle Reti di Calcolatori

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Reti di Calcolatori (*Computer Networks*)

> **Rete di calcolatori**: Insieme di dispositivi di calcolo autonomi e interconnessi tra loro.

- I computer interconnessi possono **scambiarsi informazioni**.
- L'informazione viene scambiata per eseguire compiti e fornire servizi.

### Cosa abilitano le reti:
- Accesso a informazioni e servizi remoti
- Comunicazione e collaborazione
- Calcolo distribuito e servizi Cloud
- Media, commercio elettronico e servizi online
- *Internet of Things* (IoT) e sistemi cyber-fisici

> **Networking**: *Il processo di collegare computer tra loro affinché possano condividere informazioni.* (Cambridge Dictionary)

---

## Accesso all'Informazione: Modello Client-Server (1/2)

Nel modello **Client-Server**:
- Un **Client** richiede esplicitamente informazioni o servizi a un **Server** che li ospita.
- Il server è tipicamente sempre attivo (*always-on host*) con un indirizzo IP permanente.
- I client non comunicano direttamente tra loro, ma solo attraverso il server.

---

## Accesso all'Informazione: Modello Client-Server (2/2)

- La comunicazione avviene tramite l'invio di un **messaggio** da parte del processo *client* attraverso la rete verso il processo *server*.
- Il processo client si mette quindi in attesa di un **messaggio di risposta** (*reply/response*).
- Esempi tipici:
  - Navigazione Web (Browser Client ↔ Web Server)
  - Posta elettronica
  - Basi di dati centralizzate

---

## Accesso all'Informazione: Modello Peer-to-Peer (P2P)

Nel modello **Peer-to-Peer (P2P)**:
- **Non ci sono client e server fissi o dedicati**.
- Qualsiasi nodo (*peer*) può agire sia da client che da server (*servent*).
- I nodi comunicano direttamente tra loro per scambiarsi risorse (file, calcolo).
- **Vantaggi**: Elevata scalabilità intrinseca (ogni nuovo peer porta capacità di banda e calcolo).
- **Sfide**: Difficoltà di gestione, sicurezza, localizzazione delle risorse, churn (nodi che entrano ed escono continuamente).
- Esempi: BitTorrent, reti blockchain.

---

## Reti di Calcolatori e Internet

### Internet:
- **Una rete globale di reti interconnesse** (*network of networks*).
- Connette reti eterogenee: reti domestiche (*home*), mobili (*cellular*), aziendali (*enterprise*), data center, ecc.
- Fornisce l'infrastruttura di comunicazione per un'enorme varietà di servizi e applicazioni.

> **Nota**: *Non tutte le reti fanno parte di Internet*. Esistono reti locali, private o isolate (es. reti industriali, SCADA, intranet militari) non collegate a Internet.

---

## Storia di Internet (1/5): Le Origini

- Internet è la più grande rete di calcolatori del mondo.
- L'idea di una "rete universale" fu teorizzata già nei primi anni '60 (es. la *"Galactic Network"* di **J.C.R. Licklider**, 1962).
- Il progetto **ARPANET**, lanciato dall'agenzia ARPA nel 1969, rappresentò il primo grande passo concreto verso questa visione.

---

## Storia di Internet (2/5): ARPANET e Commutazione di Pacchetto

- **ARPA** (*Advanced Research Projects Agency*, Dipartimento della Difesa USA) finanzia lo sviluppo di **ARPANET** (1969).
- **Obiettivo**: connettere centri di ricerca universitari e condividere costose risorse di calcolo.
- **Commutazione di Pacchetto (*Packet Switching*)**: i dati vengono suddivisi in pacchetti e instradati attraverso nodi intermedi.
- Ogni sito utilizzava un computer dedicato chiamato **IMP** (*Interface Message Processor*) per connettere l'host alla rete e inoltrare i pacchetti.
- **Prima connessione**: Ottobre 1969 tra UCLA e Stanford Research Institute (SRI) con il messaggio parziale "LO" (da "LOGIN").
- Rete iniziale a 4 nodi: SRI, UCLA, UCSB e Utah.

---

## Storia di Internet (3/5): Nascita di TCP/IP

- Nel 1974, **Robert Kahn** (ARPA) e **Vinton Cerf** (Stanford) propongono un'architettura per interconnettere reti a commutazione di pacchetto diverse ed eterogenee: **nasce la suite di protocolli TCP/IP**.
- Nel **1983**, ARPANET migra ufficialmente dal vecchio protocollo NCP (*Network Control Protocol*) a **TCP/IP** (1 gennaio 1983, *Flag Day*).
- Nel **1986**, la National Science Foundation lancia **NSFNET**, una dorsale (*backbone*) ad alta velocità basata su TCP/IP che collega i centri di supercalcolo e le università.

---

## Storia di Internet (4/5): Commercializzazione ed Espansione

- Nel **1990**: ARPANET viene ufficialmente dismessa.
- Nel **1995**: Viene dismessa anche la dorsale NSFNET, rimuovendo le restrizioni governative sull'uso commerciale del traffico di rete.
- Internet diventa un'infrastruttura pubblica e commerciale aperta a privati e aziende di tutto il mondo.

---

## Storia di Internet (5/5): Evoluzione Globale

- Dalle prime connessioni universitarie a 56 kbps alle moderne dorsali in fibra ottica da Terabit/s.
- Nascita del **World Wide Web (WWW)** al CERN da parte di Tim Berners-Lee (1989-1991).
- Esplosione di dispositivi mobili, cloud computing, streaming ad altissima definizione e IoT.

---

## Componenti della Rete: Host, Dispositivi e Collegamenti

L'infrastruttura di rete è composta da:

1. **Host (Sistemi Periferici / *End Systems*)**:
   - Dispositivi su cui girano le applicazioni utente: Laptop, PC, Smartphone, Server, Smart TV, sensori IoT.
2. **Dispositivi di Rete (*Network Devices*)**:
   - Dispositivi intermedi per l'instradamento e l'inoltro: **Router**, **Switch**, **Hub**, **Access Point (AP)**.
3. **Collegamenti di Comunicazione (*Communication Links*)**:
   - Mezzi fisici che trasportano i segnali: cavi in rame (doppino telefonico, coassiale), fibra ottica, onde radio wireless, satelliti.

---

## Reti di Calcolatori e Teoria dei Grafi

Le reti di calcolatori condividono la terminologia e i modelli della **teoria dei grafi**:
- **Nodi (*Nodes*)**: i dispositivi collegati nella rete.
- **Archi / Collegamenti (*Links / Channels*)**: le connessioni fisiche o logiche tra i nodi.
- **Cammino (*Path*)**: una sequenza di nodi e collegamenti che unisce una sorgente a una destinazione.
- **Host**: sono i nodi terminali (foglie del grafo), che producono o consumano informazioni.
- **Nodi intermedi**: sono i dispositivi di commutazione e instradamento (*router*, *switch*).

---

## Comunicazione Dati (*Data Communication*)

- **Scopo**: condividere dati e informazioni a distanza tra dispositivi diversi.
- La comunicazione dati è spesso un compromesso (*trade-off*) tra:
  - **Affidabilità (*Reliability*)**: i dati devono essere ricevuti correttamente, senza alterazioni o perdite.
  - **Prestazioni (*Performance*)**: i dati devono essere recapitati entro un tempo ragionevole (latenza e throughput).
- **Telecomunicazioni**: la disciplina che studia la trasmissione di informazioni a distanza.

---

## I 5 Componenti della Comunicazione Dati

Ogni sistema di comunicazione dati si basa su 5 elementi essenziali:

1. **Messaggio (*Message*)**: l'informazione da trasmettere (testo, audio, immagine, video).
2. **Mittente (*Sender*)**: l'entità che invia il messaggio.
3. **Destinatario (*Receiver*)**: l'entità che riceve il messaggio.
4. **Mezzo Trasmissivo (*Transmission Medium*)**: il canale fisico su cui viaggia il segnale (cavo, fibra, aria).
5. **Protocollo (*Protocol*)**: l'insieme di regole e convenzioni concordate che governano la comunicazione tra mittente e destinatario.

---

## Rappresentazione dei Dati e Modalità di Flusso

I dati possono viaggiare secondo tre modalità di flusso:

1. **Simplex (Unidirezionale)**:
   - La comunicazione avviene in una sola direzione (un mittente fisso e un ricevente fisso).
   - Esempio: tastiera 
ightarrow computer, trasmissione radio FM.
2. **Half-Duplex (Bidirezionale Alternata)**:
   - Entrambe le stazioni possono trasmettere e ricevere, ma **non contemporaneamente** (a turno).
   - Esempio: Walkie-talkie.
3. **Full-Duplex (Bidirezionale Simultanea)**:
   - Entrambe le stazioni possono trasmettere e ricevere **nello stesso istante**.
   - Esempio: conversazione telefonica, collegamenti Ethernet moderni.

---

## Metriche di Rete: Velocità, Capacità e Throughput

- **Velocità di trasmissione (*Transmission Rate*)**:
  - La velocità nominale con cui i bit vengono immessi sul collegamento, misurata in **bit/s** (bps, Mbps, Gbps).
- **Capacità del collegamento (*Bandwidth / Capacity*)**:
  - La massima velocità teorica supportata da un collegamento.
  - In un cammino *end-to-end* con più nodi, la capacità massima è limitata dal **collegamento collo di bottiglia** (*bottleneck link*).
- **Throughput effettivo**:
  - Il tasso effettivo di dati trasferiti con successo nell'unità di tempo tra sorgente e destinazione.

---

## Tipologie di Connessione (*Connection Types*)

Gli host possono essere collegati secondo due tipologie fondamentali:

1. **Punto-a-Punto (*Point-to-Point*)**:
   - Collegamento dedicato e riservato tra due soli dispositivi.
   - L'intera capacità del canale è a disposizione dei due estremi.
   - Può essere cablato (*wired*) o senza fili (*wireless*).

2. **Multipunto / Canale Condiviso (*Multipoint / Broadcast*)**:
   - Più dispositivi condividono lo stesso mezzo trasmissivo.
   - La capacità del canale è suddivisa nello spazio o nel tempo tra i vari dispositivi.
   - Richiede protocolli di accesso multiplo per evitare collisioni.

---

## Topologie di Rete (*Network Topologies*)

> La **topologia di rete** definisce la disposizione geometrica e logica con cui nodi e collegamenti sono interconnessi.

Le principali topologie elementari sono:
- **A Bus (*Bus Topology*)**
- **Ad Anello (*Ring Topology*)**
- **A Stella (*Star Topology*)**
- **Ad Albero (*Tree Topology*)**
- **A Maglia (*Mesh Topology*)**
- **Ibrida (*Hybrid Topology*)**

---

## Topologia a Bus (*Bus Topology*)

- Tutti gli host sono collegati a un unico cavo dorsale condiviso (*backbone bus*).
- **Collisioni**: possibili quando due stazioni trasmettono contemporaneamente.

### Vantaggi:
- Semplice da progettare ed economica da realizzare.
- Richiede poco cablaggio; ottima per piccole reti.

### Svantaggi:
- **Single Point of Failure**: la rottura del bus principale isola l'intera rete.
- Difficile individuazione e isolamento dei guasti.
- Prestazioni degradano rapidamente all'aumentare dei nodi.

---

## Topologia ad Anello (*Ring Topology*)

- Ogni host è collegato con link punto-a-punto esattamente a **due nodi adiacenti**, formando un anello chiuso.
- Il segnale viaggia lungo l'anello da dispositivo a dispositivo fino a raggiungere la destinazione (spesso mediante token, es. *Token Ring*).

### Vantaggi:
- Prestazioni più prevedibili rispetto al bus sotto carico elevato.
- Non richiede un controllore centrale.

### Svantaggi:
- L'interruzione dell'anello o il guasto di un singolo nodo può bloccare l'intera rete.
- Aggiunta o rimozione di un nodo richiede la riconfigurazione dell'anello.

---

## Topologia a Stella (*Star Topology*)

- Tutti gli host sono collegati direttamente a un **nodo centrale** (*Hub, Switch o Router*).
- Non esiste un collegamento diretto tra gli host: tutto il traffico attraversa il nodo centrale.

### Vantaggi:
- **Alta affidabilità**: il guasto di un singolo collegamento o host non influenza gli altri.
- Facile da espandere e riconfigurare (basta aggiungere una porta al centro).
- Gestione e diagnostica centralizzate.

### Svantaggi:
- **Single Point of Failure sul centro**: se il dispositivo centrale si guasta, l'intera rete si blocca.
- Richiede una quantità maggiore di cavi rispetto al bus.

---

## Topologia ad Albero (*Tree Topology*)

- I nodi sono disposti in modo **gerarchico**: tipicamente una stella di stelle.
- I nodi di livello superiore controllano o aggregano il traffico dei livelli sottostanti.

### Vantaggi:
- Altamente scalabile e facilmente organizzabile in reparti/dipartimenti.
- I guasti rimangono spesso confinati al singolo sottoalbero isolato.

### Svantaggi:
- I nodi e i collegamenti ai livelli alti della gerarchia diventano colli di bottiglia (*bottlenecks*).
- Se un nodo di livello alto cade, l'intero sottoalbero collegato viene isolato.

---

## Topologia a Maglia (*Mesh Topology*)

I nodi sono collegati direttamente tra loro:
- **Maglia Completa (*Full Mesh*)**: ogni nodo è collegato a ogni altro nodo. Numero di link: .
- **Maglia Parziale (*Partial Mesh*)**: solo alcuni nodi critici sono interconnessi direttamente con collegamenti multipli.

### Vantaggi:
- **Massima robustezza e tolleranza ai guasti**: percorsi alternativi sempre disponibili.
- Nessun punto singolo di fallimento (*no single point of failure*).

### Svantaggi:
- Costi elevatissimi di cablaggio e porte all'aumentare dei nodi.
- Complessità di configurazione e instradamento.

---

## Topologia Ibrida (*Hybrid Topology*)

- Nella pratica reale, le reti non adottano una singola topologia pura, ma combinano più tipologie elementari.
- Esempio classico: **Dorsale a Stella con sottoreti a Bus**, oppure collegamenti ad anello tra switch centrali con periferiche a stella.
- Permette di ottimizzare costi, prestazioni e scalabilità in base alle esigenze dei vari reparti.

---

## Categorie di Reti per Estensione Geografica

Le reti vengono classificate principalmente in base alla loro scala geografica:

1. **PAN** (*Personal Area Network*): raggio di pochi metri (personale).
2. **LAN** (*Local Area Network*): raggio di edifici, campus o uffici (locale).
   - Variante wireless: **WLAN** (*Wireless LAN*).
3. **MAN** (*Metropolitan Area Network*): raggio di una città o area metropolitana.
4. **WAN** (*Wide Area Network*): raggio regionale, nazionale, continentale o globale.

---

## Personal Area Network (PAN)

- Connette dispositivi personali in un raggio d'azione di circa **1 – 10 metri**.
- Pensata per la comunicazione tra dispositivi di uno stesso utente (smartphone, cuffie, smartwatch, portatile).
- Tecnologia wireless dominante: **Bluetooth** (standard IEEE 802.15.1), BLE (*Bluetooth Low Energy*), UWB.
- Basso consumo energetico e semplicità di associazione.

---

## Local Area Network (LAN e WLAN)

- Copre un'area geografica limitata: un'abitazione, un ufficio, un edificio scolastico o un campus universitario.
- **LAN cablata**: tipicamente basata su tecnologia **Ethernet switched** (cavi UTP, standard IEEE 802.3) con velocità da 1 Gbps a 10+ Gbps.
- **WLAN (*Wireless LAN*)**: basata sullo standard **Wi-Fi (IEEE 802.11)** attraverso Access Point.
- Caratterizzata da velocità di trasmissione elevate, basse latenze e tassi di errore molto ridotti.

---

## Reti Domestiche (*Home Networks*) e IoT

- Una particolare tipologia di LAN caratterizzata da un'enorme varietà di dispositivi eterogenei:
  - Computer, smartphone, smart TV, console, elettrodomestici smart, telecamere di sicurezza.
- **Internet of Things (IoT)**: miliardi di piccoli sensori e attuatori connessi in rete.
- **Requisiti fondamentali**:
  - Semplicità di installazione (*Plug and Play*)
  - Sicurezza e privacy
  - Interoperabilità tra marchi e tecnologie differenti
  - Costi contenuti per il consumatore

---

## Metropolitan Area Network (MAN)

- Connette più LAN all'interno di una **stessa area metropolitana o cittadina** (estensione tipica: da 5 a 50 km).
- Spesso utilizzata da municipalità, grandi campus universitari o provider di telecomunicazioni.
- Esempio: reti cittadine in fibra ottica, televisione via cavo (*cable network*) che distribuisce Internet alle abitazioni.
- Fa da ponte tra le reti locali (LAN) e le grandi reti geografiche (WAN).

---

## Wide Area Network (WAN)

- Copre aree geografiche estesissime: interconnette città, nazioni e continenti.
- Gli host remoti comunicano attraverso:
  1. **Linee dedicate in affitto (*Leased lines*)**: circuiti privati punto-a-punto garantiti.
  2. **Internet pubblico**: utilizzando tunnel e VPN crittografate.
  3. **Dorsale privata del provider (*Private ISP Backbone*)**: reti MPLS/fibra del fornitore.
- Si basa su un nucleo di commutazione ad alte prestazioni composto da **router di transito**.

---

## Complessità delle Reti Geografiche (WAN)

- All'aumentare delle dimensioni, la topologia della rete cresce esponenzialmente in complessità.
- Richiede numerosi **nodi di interscambio intermedi** e percorsi ridondati.
- Le WAN globali sono intrinsecamente **eterogenee**: combinano diverse tecnologie di trasmissione (fibra sottomarina, collegamenti satellitari, fasci a microonde).
- Gestiscono problemi critici di instradamento dinamico, tolleranza ai guasti e congestione.

---

## Risorse e Servizi di Rete

Le reti abilitano l'accesso a risorse e servizi remoti:
- **Risorsa di rete (*Network Resource*)**: oggetto o dato a cui si vuole accedere (file, pagina web, video stream, spazio disco, potenza di calcolo).
- **Servizio di rete (*Network Service*)**: funzionalità complessa fornita da un sistema remoto (risoluzione nomi DNS, consegna email, autenticazione, calcolo distribuito).
- Il servizio più fondamentale di tutti è l'**accesso a Internet**, fornito dagli **Internet Service Provider (ISP)**.

---

## Internet Service Provider (ISP)

- Un **ISP** è un'organizzazione che fornisce connettività Internet a utenti privati, aziende e altre istituzioni.
- Operano a diverse scale geografiche e si interconnettono tra loro attraverso:
  - **Transito (*Transit*)**: pagamento per far trasportare il proprio traffico verso il resto del mondo.
  - **Peering**: accordo reciproco gratuito di scambio traffico tra reti di pari livello.
- I punti fisici d'interscambio traffico tra ISP indipendenti sono gli **IXP (*Internet Exchange Points*)**.

---

## Struttura Gerarchica degli ISP: PoP e IXP

Le reti degli ISP sono organizzate gerarchicamente:

- **Point of Presence (PoP)**:
  - Punto fisico in cui l'ISP alloggia router e apparati per collegare clienti o sottoreti locali.
- **Gerarchia geografica degli ISP**:
  - **Tier-3 (Access ISP)**: livello locale/residenziale a cui si connettono gli utenti.
  - **Tier-2 (Regional/National ISP)**: coprono regioni o nazioni, acquistano transito dai Tier-1.
  - **Tier-1 (Global Backbone)**: grandi operatori globali che non pagano transito e formano la dorsale primaria mondiale.
- **Internet Exchange Point (IXP)**:
  - Infrastrutture neutrali condivise dove reti indipendenti si scambiano traffico direttamente riducendo costi e latenza.

---

## Esempio Nazionale: La Rete GARR

- **GARR** (*Gruppo per l'Armonizzazione delle Reti della Ricerca*):
  - È la rete nazionale italiana a banda ultralarga dedicata alla comunità dell'istruzione e della ricerca scientifica.
  - Connette università, enti di ricerca (CNR, INFN, INAF), laboratori e ospedali.
- **Integrazione Internazionale**:
  - GARR è interconnessa direttamente con la rete europea **GÉANT**, garantendo il collegamento ad altissima velocità con le reti accademiche e di ricerca di tutto il mondo.n(n-1)/2n(n-1)/2n(n-1)/2