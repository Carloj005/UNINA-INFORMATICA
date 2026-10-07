---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezione 26: Sicurezza delle Reti di Calcolatori — Autenticazione, SSL/TLS e Firewall

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Il Problema dell'Autenticazione degli Endpoint

L'**Autenticazione degli Endpoint (*End-point Authentication*)** è il processo mediante il quale un'entità di rete (es. Alice) dimostra la propria identità reale a un'altra entità remota (es. Bob) attraverso un canale non sicuro:

- **Perché l'Indirizzo IP non basta?**  
  Un attaccante può falsificare banalmente l'header del datagramma (*IP Spoofing*).
- **Perché una Password Segreta in chiaro non basta?**  
  Un attaccante passivo può intercettarla facilmente mediante *Packet Sniffing*.
- **Perché una Password Cifrata non basta?**  
  Un attaccante non ha bisogno di decifrare la password: può semplicemente registrarla e ri-trasmetterla identica in una sessione successiva, spacciandosi per Alice (**Attacco di Ripetizione / Playback Attack**).

---

## Soluzione agli Attacchi di Ripetizione: il Nonce

Per neutralizzare i Playback Attack, i protocolli crittografici moderni utilizzano un **Nonce** (*Number used Once*):
- È un numero casuale a 64 o 128 bit generato dal ricevitore e valido **una sola volta nella vita**.

### Protocollo di Autenticazione Challenge-Response con Nonce:

```
 Alice (Richiede Accesso)                                 Bob (Verificatore)
       |                                                         |
       |--- 1. "Sono Alice, voglio autenticarmi" --------------->|
       |                                                         | Genera un numero
       |<-- 2. Sfida (Challenge): invia il Nonce casuale R ------| casuale univoco R
       |                                                         |
       | Calcola: Risposta = E_{K_AB}(R)                         |
       |--- 3. Invia Risposta cifrata con la chiave segreta ---->| Decifra con K_AB
       |                                                         | Se il risultato == R:
       |                                                         | Alice è autenticata!
```

> Trudy non può riutilizzare una risposta registrata in precedenza, perché la prossima sessione genererà un valore di $R$ completamente differente.

---

## Protocolli di Canale Sicuro: SSL e TLS

**SSL (*Secure Sockets Layer*)**, standardizzato successivamente dall'IETF con il nome di **TLS (*Transport Layer Security*)**, protegge la comunicazione su canali TCP:

```
+---------------------------------------------------------+
|                  Applicazione (HTTP, SMTP, IMAP)        |
+---------------------------------------------------------+
|        SSL / TLS (Sicurezza Crittografica End-to-End)   |  <--- Socket API Sicuro
+---------------------------------------------------------+       (OpenSSL)
|                  Livello di Trasporto (TCP)             |
+---------------------------------------------------------+
|                  Livello di Rete (IP)                   |
+---------------------------------------------------------+
```

- Quando il protocollo web **HTTP** viene incapsulato sopra SSL/TLS, prende il nome di **HTTPS** (in ascolto standard sulla porta **443**).
- Fornisce in modo trasparente: **Confidenzialità**, **Integrità dei Dati** e **Autenticazione del Server**.

---

## Ciclo di Negoziazione: il TLS Handshake

Prima di scambiare dati applicativi, client e server eseguono una complessa sequenza di accordo crittografico:

```
      Client TLS                                           Server TLS
          |                                                    |
          |--- 1. Connessione TCP Standard (3-way handshake) ->|
          |                                                    |
          |--- 2. ClientHello (Suite crittografiche supportate)|
          |                                                    |
          |<-- 3. ServerHello + Certificato Digitale X.509 ----| (Invia Certificato con
          |                                                    |  Chiave Pubblica K_S+)
          | Verifica Certificato con le CA di fiducia          |
          | Genera Pre-Master Secret (PMS) casuale             |
          |--- 4. Invia PMS cifrato con K_S+ ----------------->| Decifra PMS con K_S-
          |                                                    |
          +---------------- Derivazione Chiavi ----------------+
          | Entrambi calcolano la Master Secret (MS) comune    |
          | e generano 4 chiavi simmetriche di sessione (AES)  |
          |                                                    |
          |<== 5. Canale Cifrato Attivo: Scambio Record SSL == >|
```

---

## Record SSL e Protezione del Flusso Dati

Una volta concordate le chiavi di sessione:
- Il flusso di byte applicativo viene suddiviso in blocchi discreti chiamati **Record SSL**.
- A ciascun blocco viene calcolato un codice di autenticazione crittografico **HMAC** (*Hashed MAC*) concatenando i dati a un numero di sequenza progressivo (per prevenire attacchi di riordinamento o iniezione).
- Il blocco (Dati + HMAC) viene cifrato con la chiave simmetrica di sessione veloce (es. **AES-GCM a 256 bit**) e consegnato al socket TCP sottostante.

```
 Flusso Dati Applicativo: [ Byte Stream ... ]
          |
          v  Frammentazione
 [ Dati Record ] + [ HMAC (Integrità) ]
          |
          v  Cifratura Simmetrica AES
 [ Header SSL ] + [ Payload Cifrato ] ---> Inviato via TCP
```

---

## Difesa Perimetrale: i Firewall

Un **Firewall** è un dispositivo hardware o software posto a presidio della rete che funge da barriera di isolamento tra la rete locale privata e l'Internet pubblica esterna:

```
 [ RETE LOCALE AZIENDALE INTERNA ] <---> [ FIREWALL ] <---> [ INTERNET PUBBLICA ]
                                            |
                                            v Ispeziona e applica le policy:
                                              PASS / DROP
```

### Le Tre Categorie di Firewall:
1. **Packet Filter Tradizionale (Stateless)**: esamina ogni singolo pacchetto in isolamento.
2. **Stateful Packet Filter (Con Ispezione di Stato)**: traccia le sessioni TCP attive.
3. **Application Gateway (Proxy di Livello Applicativo)**: controlla il contenuto semantico dei protocolli.

---

## Packet Filtering Tradizionale (Stateless)

Il packet filter tradizionale viene configurato mediante **Access Control Lists (ACL)** che controllano i singoli campi dell'header:
- Indirizzo IP sorgente e destinazione.
- Porta TCP o UDP sorgente e destinazione.
- Tipo di protocollo (TCP, UDP, ICMP).
- Flag TCP (in particolare il bit `ACK` o `SYN`).

### Esempio di Regole ACL di un Firewall:
| Azione | IP Sorgente | Porta Sorgente | IP Destinazione | Porta Destinazione | Flag |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **ALLOW** | `Any` | `Any` | `192.168.1.10` | `80` (HTTP) | `Any` |
| **ALLOW** | `192.168.1.0/24`| `Any` | `Any` | `Any` | `Any` |
| **DROP**  | `Any` | `Any` | `Any` | `Any` | `Any` *(Default Deny)* |

> [!WARNING] Il Limite dello Stateless Filtering
> Non conosce lo stato delle connessioni. Se consentiamo l'ingresso a pacchetti con flag `ACK=1` per permettere la ricezione delle risposte web, un attaccante esterno può iniettare pacchetti con `ACK=1` fasulli per scavalcare il firewall.

---

## Stateful Packet Filtering (Filtraggio con Ispezione di Stato)

Lo **Stateful Firewall** supera i limiti del filtraggio stateless mantenendo in memoria una **Tabella di Stato delle Connessioni (*State Table*)**:
- Monitora le connessioni TCP analizzando gli handshake a 3 vie (`SYN`, `SYN-ACK`, `ACK`) e le chiusure (`FIN`).
- Se un pacchetto in arrivo dall'esterno non appartiene a una connessione TCP **esplicitamente iniziata da un host interno autorizzato**, viene scartato all'istante!

| IP Sorgente Esterno | Porta Ext | IP Destinazione Interno | Porta Int | Stato Sessione |
| :---: | :---: | :---: | :---: | :---: |
| `142.250.180.3` | `443` | `192.168.1.55` | `54210` | **ESTABLISHED** |

- Rileva e scarta tentativi di scansione di porte, datagrammi fuori sequenza e attacchi SYN flood.

---

## Application Gateway e Sistemi IDS/IPS

### 1. Application Gateway (Proxy a Livello Applicativo)
- Agisce da intermediario completo a livello 7 (es. Proxy HTTP, Server Bastion SSH/Telnet).
- I client interni si connettono al gateway; il gateway autentica l'utente (tramite credenziali), analizza le richieste applicative (es. blocca download di eseguibili `.exe` o URL vietati) e, se autorizzate, inoltra la richiesta all'esterno per conto del client.

### 2. Intrusion Detection & Prevention Systems (IDS / IPS)
- Mentre i firewall controllano solo le intestazioni, gli IDS eseguono la **Deep Packet Inspection (DPI)** esaminando l'intero contenuto del payload alla ricerca di:
  - **Firme di Attacco Note (*Signature-based*)**: firme di exploit, pattern di worm.
  - **Anomalie di Traffico (*Anomaly-based*)**: picchi anomali di traffico statistico.
- Un **IPS** non si limita a generare allarmi per l'amministratore, ma blocca attivamente il flusso malevolo in tempo reale.

---

## Architettura a Zona Demilitarizzata (DMZ)

Nelle reti aziendali non tutti i server richiedono lo stesso livello di protezione:
- I server web, DNS e di posta devono essere accessibili al pubblico globale da Internet.
- I server di database interni e le workstation contengono dati riservati e non devono mai essere esposti.

```
                      [ INTERNET PUBBLICA ]
                                |
                        [ Firewall Esterno ]
                                |
             +------------------+------------------+
             |                                     |
   [ ZONA DMZ (Pubblica) ]             [ Firewall Interno ]
   - Server Web Pubblico (HTTP/S)                  |
   - Server Mail (SMTP)                [ LAN PRIVATA AZIENDALE ]
   - Server DNS Autoritativo           - Database Aziendali (SQL)
                                       - Server Contabilità
                                       - Postazioni di Lavoro (PC)
```

> Se un attaccante su Internet compromette il server web nella DMZ, la seconda barriera del **Firewall Interno** impedisce l'accesso diretto alla rete aziendale privata, salvaguardando i sistemi critici.
