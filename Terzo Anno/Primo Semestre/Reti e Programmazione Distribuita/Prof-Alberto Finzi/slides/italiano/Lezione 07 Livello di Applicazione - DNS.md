---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezione 07: Il Livello di Applicazione — Domain Name System (DNS)

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Il Problema dell'Identificazione degli Host

In Internet un host può essere identificato in due modi:

1. **Nome Mnemonico (*Hostname*)**:
   - Stringhe di caratteri facili da ricordare per gli esseri umani (es. `www.unina.it`, `google.com`, `mail.yahoo.it`).
   - Fornisce pochissime informazioni sulla collocazione geografica o topologica del server nella rete.
2. **Indirizzo IP (*IP Address*)**:
   - Indirizzi numerici a lunghezza fissa: 32 bit per IPv4 (`143.225.161.30`) o 128 bit per IPv6.
   - Struttura rigidamente gerarchica, perfetta per essere elaborata ad altissima velocità dai router per l'inoltro dei pacchetti.

> Serve un sistema di traduzione automatico, globale, trasparente e ad alte prestazioni per convertire i **Nomi Mnemonici** in **Indirizzi IP**: questo sistema è il **DNS (*Domain Name System*)**.

---

## Che cos'è il DNS (*Domain Name System*)?

Definito nelle RFC 1034 e 1035, il DNS è costituito da:

1. Un **database distribuito e gerarchico** memorizzato su una rete globale di server DNS.
2. Un **protocollo di livello applicativo** che consente agli host e ai resolver di interrogare il database per risolvere i nomi.
3. Utilizza **UDP sulla porta 53** per le normali query di risoluzione (basso overhead e velocità), e **TCP sulla porta 53** per risposte che superano i 512 byte o per il trasferimento di zona (*Zone Transfer*).

### Servizi Aggiuntivi Offerti dal DNS:
- **Host Aliasing**: un host con un nome canonico complicato può avere più alias mnemonici semplici (*CNAME*).
- **Mail Server Aliasing**: mapping del dominio email verso il mail server effettivo (*MX Record*).
- **Bilanciamento del Carico (*Load Balancing*)**: un unico nome di dominio può essere associato a un elenco di indirizzi IP differenti (rotazione *Round-Robin*).

---

## Perché Non un Singolo Server DNS Centralizzato?

Un unico supercomputer che contiene tutte le mappature nome-IP del mondo non è praticabile per motivi architetturali:

- **Single Point of Failure**: se il server cade, l'intera Internet mondiale si ferma.
- **Volume di Traffico Ingestibile**: miliardi di query al secondo saturerebbero qualsiasi infrastruttura di banda e CPU.
- **Latenza Geografica Elevata**: un client in Australia che interroga un server centralizzato in Nord America subirebbe ritardi enormi per ogni singolo clic sul web.
- **Manutenzione Impossibile**: il database dovrebbe gestire centinaia di aggiornamenti al secondo per ogni nuovo sito o cambio IP del pianeta.

> **Soluzione Architetturale**: Una base di dati **altamente distribuita, gerarchica e con caching aggressivo**.

---

## La Gerarchia dei Server DNS

Nessun server possiede tutte le mappature. La risoluzione coinvolge tre classi gerarchiche:

```
                      [ Root DNS Servers ]
                               |
       +-----------------------+-----------------------+
       |                       |                       |
 [.com TLD Servers]     [.it TLD Servers]     [.edu TLD Servers]
       |                       |                       |
[google.com Server]     [unina.it Server]       [mit.edu Server]
 (Authoritative)         (Authoritative)         (Authoritative)
```

1. **Root DNS Server**: i server radice mondiali.
2. **Top-Level Domain (TLD) Server**: gestiscono i domini di primo livello (`.com`, `.it`, `.edu`, `.org`).
3. **Authoritative DNS Server**: server autorevoli dell'organizzazione proprietaria del dominio.

---

## 1. I Root DNS Server

- Costituiscono il punto di partenza dell'albero di risoluzione quando un resolver non ha record in cache.
- Esistono **13 indirizzi IP logici per i Root Server** (da `a.root-servers.net` a `m.root-servers.net`).
- In realtà ciascuno di questi 13 indirizzi è replicato in centinaia di copie fisiche distribuite in tutto il mondo attraverso la tecnologia di instradamento **Anycast** (oltre 1500 istanze fisiche globali).
- Rispondono alle query restituendo l'elenco e l'indirizzo IP dei server TLD responsabili per l'estensione richiesta.
- Coordinati da **ICANN (*Internet Corporation for Assigned Names and Numbers*)**.

---

## 2. Server TLD (*Top-Level Domain*) e Server Autorevoli

- **Server TLD (*Top-Level Domain*)**:
  - **gTLD (*Generic TLD*)**: `.com`, `.org`, `.net`, `.edu`, `.gov`, `.info`.
  - **ccTLD (*Country-Code TLD*)**: `.it`, `.uk`, `.de`, `.fr`, `.jp`.
  - Conoscono gli indirizzi dei server autorevoli responsabili dei domini di secondo livello (es. chi gestisce `unina.it`).
- **Server Autorevoli (*Authoritative DNS Servers*)**:
  - Appartengono all'organizzazione proprietaria del dominio (es. l'Università Federico II o il suo registrar).
  - Contengono i record ufficiali definitivi che associano i nomi degli host aziendali ai rispettivi indirizzi IP (es. `www.unina.it` $\rightarrow$ `143.225.161.30`).

---

## Il Local DNS Server e il Resolver

- **Local DNS Server (o Recursive Resolver)**:
  - Non appartiene strettamente alla gerarchia formale, ma è l'entità a cui si rivolgono direttamente i dispositivi degli utenti.
  - Ogni ISP fornisce un Local DNS Server ai propri clienti (assegnato via DHCP).
  - Esistono resolver pubblici globali: `8.8.8.8` (Google DNS), `1.1.1.1` (Cloudflare), `9.9.9.9` (Quad9).
- **Stub Resolver**:
  - Il componente software leggero integrato nel sistema operativo dell'host (es. `systemd-resolved` in Linux su `127.0.0.53`, o la libreria C `getaddrinfo`).
  - Riceve le richieste dalle applicazioni (browser, curl) e le inoltra al Local DNS Server.

---

## Modalità di Risoluzione: Query Iterativa vs Ricorsiva

Quando il Local DNS Server deve risolvere `gaia.cs.umass.edu`:

- **Query Iterativa (*Iterative Query*)**:
  - Il server interpellato risponde dicendo: *\"Io non conosco questo indirizzo, ma ti fornisco l'indirizzo del server DNS successivo a cui puoi chiederlo\"*.
  - È il Local DNS Server che effettua personalmente le richieste a catena: Root $\rightarrow$ TLD $\rightarrow$ Autorevole.
- **Query Ricorsiva (*Recursive Query*)**:
  - Il server interpellato si prende interamente l'onere di risolvere il nome per conto del richiedente, restituendo direttamente il record finale.
  - La query dall'Host al Local DNS Server è **ricorsiva**; le query dal Local DNS Server verso la gerarchia globale sono tipicamente **iterative** per evitare di sovraccaricare i Root Server.

---

## Flusso Completo di Risoluzione dei Nomi

```
Host (Client)                Local DNS                  Root DNS
     |                           |                         |
     | -- 1. Chi è gaia? ------> |                         |
     |                           | -- 2. Chi è gaia? ----> |
     |                           | <-- 3. Chiedi al TLD -- |
     |                           |
     |                           | -------- TLD (.edu) -----
     |                           | -- 4. Chi è gaia? ----> |
     |                           | <-- 5. Chiedi a umass - |
     |                           |
     |                           | ---- Autorevole (umass) -
     |                           | -- 6. Chi è gaia? ----> |
     |                           | <-- 7. IP: 128.119.24.12
     |                           |
     | <-- 8. IP: 128.119.24.12 - |
```

---

## DNS Caching: Il Segreto delle Prestazioni di Internet

- Per evitare di interpellare i Root e i TLD ad ogni singola richiesta, i Local DNS Server applicano un **caching sistematico**:
  - Appena un resolver riceve un record DNS da un server autorevole, **lo salva nella propria memoria cache locale**.
  - Se un altro host nella stessa rete richiede lo stesso nome, il Local DNS Server risponde istantaneamente senza contattare nessun altro server!
- **Time to Live (TTL)**:
  - Ogni record DNS include un campo **TTL** (espresso in secondi, es. 86400 = 24 ore).
  - Trascorso il TTL, il record viene scartato dalla cache per garantire che cambi di indirizzo IP vengano recepiti.
- Nella pratica, gli indirizzi dei server TLD rimangono quasi permanentemente memorizzati nelle cache dei Local DNS, azzerando le chiamate ai Root Server nel traffico quotidiano.

---

## Struttura dei Resource Record (RR)

I record all'interno dei database dei server DNS seguono il formato a 4 campi:

$$(Name, Value, Type, TTL)$$

- **`Name` e `Value`**: il significato dipende dal tipo di record.
- **`TTL`**: tempo di vita della voce nella cache prima della scadenza.
- **`Type`**: la categoria del record.

---

## I Principali Tipi di Record DNS (*RR Types*)

| Tipo | Name | Value | Descrizione e Utilizzo |
| :--- | :--- | :--- | :--- |
| **`A`** | Hostname | Indirizzo IPv4 | Associa un nome host a un indirizzo IPv4 a 32 bit (es. `server.unina.it` $\rightarrow$ `143.225.1.1`). |
| **`AAAA`** | Hostname | Indirizzo IPv6 | Associa un nome host a un indirizzo IPv6 a 128 bit. |
| **`NS`** | Nome Dominio | Hostname DNS | Specifica il server DNS autorevole per quella zona (es. `unina.it` $\rightarrow$ `dns.unina.it`). |
| **`CNAME`** | Nome Alias | Nome Canonico | Associa un alias al vero nome canonico (es. `www.unina.it` $\rightarrow$ `webserver01.unina.it`). |
| **`MX`** | Nome Dominio | Mail Server | Specifica il server di posta elettronica per il dominio (es. `unina.it` $\rightarrow$ `mail.unina.it`). |
| **`PTR`** | Indirizzo IP invertito | Hostname | Risoluzione inversa (*Reverse DNS*): da IP al rispettivo nome host. |
| **`TXT`** | Nome Dominio | Testo arbitrario | Utilizzato per record di sicurezza e autenticazione email (SPF, DKIM, DMARC). |

---

## Formato dei Messaggi DNS

Tutti i messaggi DNS (sia richieste che risposte) condividono un unico formato standard a 12 byte di intestazione più sezioni variabili:

```
+----------------------------------+----------------------------------+
|      Identification (16 bit)     |          Flags (16 bit)          |
+----------------------------------+----------------------------------+
|    Number of Questions (16 bit)  |     Number of Answers (16 bit)   |
+----------------------------------+----------------------------------+
|    Number of Authorities (16 bit)|     Number of Additionals (16 bit)|
+----------------------------------+----------------------------------+
|                     Questions (Sezione Domanda)                     |
+---------------------------------------------------------------------+
|                      Answers (Sezione Risposte)                     |
+---------------------------------------------------------------------+
|                    Authority (Server Autorevoli)                    |
+---------------------------------------------------------------------+
|                     Additional (Informazioni Extra)                 |
+---------------------------------------------------------------------+
```

- **Identification**: numero a 16 bit assegnato dal client per accoppiare risposte e richieste.
- **Flags**: indicano se il messaggio è una Query o Reply (QR bit), se l'interrogazione è ricorsiva (RD bit), se la risposta è autorevole (AA bit).

---

## Strumenti Pratici da Terminale: `nslookup` e `dig`

- **`nslookup`**:
  ```bash
  nslookup www.unina.it
  ```
  Interroga il resolver locale e restituisce l'indirizzo IPv4/IPv6 associato.

- **`dig` (*Domain Information Groper*)**:
  Strumento più avanzato e preciso, visualizza la risposta DNS nel formato raw reale:
  ```bash
  dig www.unina.it
  dig unina.it MX +short
  dig unina.it NS
  ```
  Permette di specificare direttamente quale server DNS interrogare:
  ```bash
  dig @8.8.8.8 www.unina.it A
  ```

---

## Sintesi della Lezione

- Il **DNS** è un'infrastruttura di livello applicativo essenziale per il funzionamento dell'intero ecosistema Internet.
- Risolve l'asimmetria tra la necessità umana di **nomi mnemonici** e l'esigenza architetturale di **indirizzi IP gerarchici**.
- Si basa su una **struttura distribuita e gerarchica** (Root $\rightarrow$ TLD $\rightarrow$ Autorevoli) per garantire affidabilità e scalabilità infinita.
- La **risoluzione iterativa combinata al caching** presso i Local DNS Server riduce al minimo il ritardo percepito dagli utenti e il traffico sui server radice.
- Con questa lezione si conclude l'analisi dei principali protocolli applicativi standard (Web, Email, DNS).
- Nella prossima lezione vedremo come sviluppare **applicazioni di rete personalizzate** tramite la programmazione con le **Socket**!
