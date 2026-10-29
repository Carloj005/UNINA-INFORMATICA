---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezione 06: Il Livello di Applicazione — Posta Elettronica e Protocollo SMTP

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Architettura della Posta Elettronica (*E-mail*)

La posta elettronica è una delle applicazioni più storiche, diffuse e critiche di Internet.  
L'architettura del sistema email si basa su **tre componenti principali**:

1. **User Agent (MUA - *Mail User Agent*)**:
   - L'applicazione utilizzata dall'utente per leggere, comporre, inviare e organizzare le email (es. Thunderbird, Apple Mail, Outlook, app Gmail).
2. **Mail Server (MTA - *Mail Transfer Agent*)**:
   - Il cuore dell'infrastruttura. Ogni utente fa riferimento a un mail server del proprio dominio (es. `@unina.it`, `@gmail.com`).
   - Contiene la **casella postale (*Mailbox*)** che ospita i messaggi ricevuti per ciascun utente.
   - Mantiene una **coda dei messaggi in uscita (*Message Queue*)** per le email inviate ma non ancora recapitate.
3. **Protocolli di Rete**:
   - **SMTP**: per il trasferimento e l'inoltro delle email.
   - **POP3 / IMAP / HTTP**: per l'accesso e il download della posta da parte dell'utente.

---

## Perché Non si Invia la Posta Direttamente da Utente a Utente?

- Se Alice inviasse un'email direttamente al computer di Bob senza passare dai mail server:
  - Il computer di Bob dovrebbe essere **acceso 24 ore su 24**, connesso a Internet e dotato di un **indirizzo IP pubblico fisso**.
  - Se Bob fosse offline o in viaggio, il messaggio andrebbe irrimediabilmente perso.
- **I Mail Server risolvono questo problema**:
  - Il mail server del destinatario è una macchina sempre attiva (*always-on*), pronta a ricevere posta a qualsiasi ora e a conservarla nella casella postale di Bob fino al momento della sua lettura.
  - Se il server di destinazione è temporaneamente irraggiungibile, il server del mittente ritenta l'invio periodicamente (es. ogni 30 minuti per diversi giorni) mantenendo il messaggio nella propria coda.

---

## Il Protocollo SMTP (*Simple Mail Transfer Protocol*)

- Definito originariamente nella RFC 821 e aggiornato nella **RFC 5321**.
- Utilizza il protocollo di trasporto **TCP sulla porta standard 25** (o porta sicura 587/465 con TLS).
- È un **protocollo di tipo Push**:
  - L'host che possiede il messaggio (*client SMTP*) contatta attivamente il server ricevente (*server SMTP*) per \"spingere\" (*push*) il messaggio verso la destinazione.
- **Fasi della comunicazione**:
  1. Handshake di presentazione tra client e server.
  2. Trasferimento del messaggio (mittente, destinatari, corpo).
  3. Chiusura della connessione.
- I comandi e le risposte viaggiano in formato testo ASCII leggibile a 7 bit.

---

## Scenario di Invio Email: Alice Invia a Bob

```
   +---------------+                      +---------------+
   | Alice (User)  |                      |  Bob (User)   |
   +---------------+                      +---------------+
           |                                      ^
    1. SMTP|o HTTP                         4. IMAP|o HTTP
           v                                      |
   +---------------+      2. SMTP         +---------------+
   |  Mail Server  | ===================> |  Mail Server  |
   | di Alice      |  (porta TCP 25)      | di Bob        |
   | (coda messaggi|                      | (casella Bob) |
   +---------------+                      +---------------+
```

1. Alice redige il messaggio nel suo User Agent e preme *Invia*. Il suo client invia il messaggio al **suo mail server** via SMTP.
2. Il mail server di Alice inserisce il messaggio nella coda.
3. Il client SMTP del server di Alice apre una connessione TCP sulla porta 25 verso il **mail server di Bob** (trovato interrogando il DNS) e trasferisce il messaggio via SMTP.
4. Il server di Bob deposita il messaggio nella casella postale riservata a Bob.
5. Quando Bob avvia il proprio client, recupera l'email dal suo server usando **IMAP** o **POP3**.

---

## Esempio di Dialogo Interattivo SMTP

```smtp
S: 220 mail.bob.com ESMTP Postfix
C: HELO mail.alice.com
S: 250 Hello mail.alice.com, pleased to meet you
C: MAIL FROM: <alice@alice.com>
S: 250 2.1.0 Sender Ok
C: RCPT TO: <bob@bob.com>
S: 250 2.1.5 Recipient Ok
C: DATA
S: 354 End data with <CR><LF>.<CR><LF>
C: From: alice@alice.com
C: To: bob@bob.com
C: Subject: Progetto Reti di Calcolatori
C: 
C: Ciao Bob, ti invio la bozza delle slide di Reti.
C: A presto, Alice.
C: .
S: 250 2.0.0 Ok: queued as 4A7B21C
C: QUIT
S: 221 2.0.0 Bye
```

---

## Dettagli del Protocollo SMTP

- **Comando `HELO` / `EHLO`**: presentazione iniziale del client al server.
- **`MAIL FROM:`**: specifica la busta di invio (*Envelope Sender*) per eventuali notifiche di mancata consegna.
- **`RCPT TO:`**: specifica il destinatario. Può essere ripetuto più volte per destinatari multipli.
- **`DATA`**: avvia la trasmissione del contenuto effettivo del messaggio.
- **Terminatore del corpo del messaggio**:
  - Il client segnala la fine del corpo inviando una riga contenente esclusivamente un **singolo punto** preceduto e seguito da CRLF (`\r\n.\r\n`).
- **Codici di Risposta**:
  - `220`: Servizio pronto
  - `250`: Comando eseguito con successo
  - `354`: Inizio invio dati
  - `221`: Chiusura servizio

---

## Formato del Messaggio di Posta (RFC 5322)

Il contenuto trasmesso dopo il comando `DATA` possiede una struttura ben definita:

```
From: alice@alice.com\r\n
To: bob@bob.com\r\n
Subject: Argomento dell'email\r\n
Date: Wed, 07 Oct 2026 12:30:00 +0200\r\n
\r\n
Corpo effettivo del messaggio in testo...
```

- **Attenzione alla distinzione**:
  - Gli header `From:` e `To:` all'interno del corpo del messaggio sono visualizzati all'utente finale dal programma di posta.
  - I comandi `MAIL FROM:` e `RCPT TO:` del protocollo SMTP formano invece la **busta esterna (*Envelope*)** utilizzata dai server per instradare l'email.

---

## Confronto Diretto: HTTP vs SMTP

| Caratteristica | HTTP | SMTP |
| :--- | :--- | :--- |
| **Direzione del Flusso** | **Pull**: il client \"tira\" le informazioni dal server su richiesta | **Push**: il mittente \"spinge\" le informazioni verso il server ricevente |
| **Tipo di Dati** | Qualsiasi tipo binario (immagini, video, audio, JSON) | Testo ASCII a 7 bit (richiede codifica base64/MIME per file e caratteri speciali) |
| **Incapsulamento Oggetti** | Ogni oggetto web è restituito in un messaggio di risposta separato | Tutti gli allegati e testi sono aggregati in un unico messaggio multipart |
| **Porta TCP Predefinita** | Porta `80` (o `443` HTTPS) | Porta `25` (inoltro server) o `587` (invio client) |

---

## Protocolli di Accesso alla Posta (*Mail Access Protocols*)

Perché l'utente finale Bob non può usare semplicemente SMTP per scaricare i messaggi dal suo server?
- **SMTP è esclusivamente un protocollo Push**: è progettato per trasferire email verso chi le riceve, non per consentire a un utente di interrogare la propria mailbox e \"tirare giù\" (*pull*) i messaggi!
- Per scaricare o consultare la posta dalla propria casella si utilizzano **protocolli di accesso dedicati**:
  1. **POP3 (*Post Office Protocol version 3*)**
  2. **IMAP (*Internet Message Access Protocol*)**
  3. **HTTP / Webmail**

---

## POP3 (*Post Office Protocol - Version 3*)

- Definito nella **RFC 1939**, porta TCP standard **110** (o 995 con SSL/TLS).
- Protocollo estremamente semplice, compatto e **Stateless**:
  - La sessione prevede 3 fasi: Autenticazione (`USER`, `PASS`), Transazione (`LIST`, `RETR`, `DELE`) e Aggiornamento (`QUIT`).
- **Due modalità operative**:
  - **Download and Delete**: scarica i messaggi sul computer locale e li cancella dal server.
  - **Download and Keep**: scarica una copia locale lasciando i messaggi sul server.
- **Limite fondamentale**:
  - Non supporta la sincronizzazione multi-dispositivo. Se un utente legge o sposta un messaggio da telefono, la modifica non si riflette sul computer portatile!

---

## IMAP (*Internet Message Access Protocol*)

- Definito nella **RFC 3501**, porta TCP standard **143** (o 993 con SSL/TLS).
- Protocollo moderno, potente e **Stateful**:
  - I messaggi rimangono **permanentemente memorizzati sul server**.
  - Consente di creare e gestire cartelle (*folder/labels*) direttamente sul server.
  - **Sincronizzazione perfetta tra dispositivi multipli**: se Bob legge, contrassegna come importante o sposta un'email in una cartella dallo smartphone, lo stato è immediatamente aggiornato anche sul suo computer.
  - Consente il download parziale dei messaggi (es. scarica solo l'oggetto e il mittente, e scarica gli allegati pesanti solo su richiesta esplicita).

---

## Webmail e Accesso tramite HTTP

- Oggi la maggior parte degli utenti consulta e gestisce la propria posta tramite interfacce Web (Gmail, Outlook.com, Roundcube, Webmail Unina) o app per smartphone.
- In questo scenario:
  - Il client dell'utente comunica con il Web Server del fornitore di posta **tramite HTTP / HTTPS**.
  - Il Web Server si interfaccia internamente con il mail server e con i database di posta.
  - Tra i Mail Server dei diversi domini (es. tra i server di Unina e i server di Google) la posta continua comunque a viaggiare rigorosamente secondo il protocollo **SMTP**!

---

## Sintesi della Lezione

- Il sistema email si articola su tre entità: **User Agent**, **Mail Server** e **Protocolli di comunicazione**.
- **SMTP** è il protocollo cardine per l'invio e il transito tra server di posta:
  - Protocollo di tipo **Push** basato su connessione affidabile **TCP**.
  - Dialogo a comandi testuali ASCII (`HELO`, `MAIL FROM`, `RCPT TO`, `DATA`, `QUIT`).
- Per l'accesso e la lettura della casella postale da parte dell'utente finale si utilizzano protocolli di tipo **Pull**:
  - **POP3**: scaricamento locale semplice, privo di sincronizzazione cartelle.
  - **IMAP**: gestione avanzata, sincronizzazione bidirezionale multi-dispositivo e archiviazione sul server.
  - **HTTP (Webmail)**: interfaccia web universale sopra la posta elettronica.
- Nella prossima lezione analizzeremo il servizio essenziale di traduzione dei nomi in Internet: **il protocollo DNS**!
