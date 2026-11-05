---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezione 13: Il Livello di Trasporto — Gestione della Connessione TCP (*Connection Management*)

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Il Problema del Consenso nei Canali Inaffidabili

Essendo TCP un protocollo orientato alla connessione (*Connection-oriented*), i due host devono **raggiungere un accordo esplicito sia all'apertura sia alla chiusura** della sessione.

- Se i messaggi scambiati possono essere ritardati, corrotti o persi dalla rete:
  - È estremamente complesso per due entità distribuite raggiungere la certezza che entrambe si trovino nello stesso stato.
  - Una parte della connessione potrebbe considerarsi aperta mentre l'altra è ancora chiusa, o una potrebbe aver liberato le risorse mentre l'altra è bloccata in attesa.
- In informatica teorica, l'impossibilità di raggiungere un accordo perfetto su un canale inaffidabile è formalizzata dal classico **Problema dei Due Eserciti (*Two-Army Problem*)**.

---

## Il Problema dei Due Eserciti (*Two-Army Problem*)

Immaginiamo un esercito Bianco accampato in una valle e due eserciti Blu posizionati sulle due colline opposte:

```
  Colle Ovest                                             Colle Est
 [Esercito Blu 1]                                      [Esercito Blu 2]
         \                                                    /
          \       [ Esercito Bianco (nella valle) ]          /
           \                                                /
            +-----> Messaggero (può essere catturato) <----+
```

- L'esercito Bianco è più numeroso di ciascun esercito Blu preso singolarmente, ma i due eserciti Blu uniti sono più forti del Bianco.
- I Blu vincono **solo se attaccano nello stesso identico momento**; se uno solo attacca, viene annientato.
- Per sincronizzarsi, devono inviare messaggeri attraverso la valle, ma i messaggeri **possono essere catturati** (canale inaffidabile).

---

## Analisi del Problema dei Due Eserciti: Perché l'Accordo Perfetto è Impossibile?

1. **Protocollo a 2 Messaggi (Proposta + Risposta)**:
   - Comandante Blu 1 invia un messaggero: *"Attacchiamo all'alba, d'accordo?"*.
   - Il messaggero passa. Comandante Blu 2 risponde inviando: *"D'accordo!"*.
   - Il messaggero torna sano e salvo a Blu 1.
   - **Blu 1 attaccherà?** No! Blu 1 sa che Blu 2 non ha la certezza che il suo messaggio di conferma sia arrivato. Se il messaggero fosse stato catturato, Blu 1 non attaccherebbe, quindi Blu 2 non oserà attaccare.
2. **Protocollo a 3 Messaggi (Three-Way Handshake)**:
   - Blu 1 invia una conferma della conferma: *"Ho ricevuto il tuo OK"*.
   - Ora è Blu 1 a non sapere se questa terza conferma sia arrivata a Blu 2!
3. **Estensione a $N$ Messaggi**:
   - Qualsiasi protocollo finito lascia sempre l'ultimo mittente nell'incertezza sul recapito dell'ultimo riscontro.

> **Risultato Fondamentale**: Non esiste alcun protocollo a numero finito di messaggi in grado di garantire l'accordo deterministico assoluto su un canale inaffidabile.  
> L'handshake a tre vie di TCP **non è teoricamente infallibile**, ma mitiga il problema in modo pragmatico ed efficace per le reti reali.

---

## Apertura della Connessione TCP: il *Three-Way Handshake*

Per stabilire una connessione, TCP esegue una sequenza a 3 passaggi coordinata dal sistema operativo:

```
         Client TCP                                 Server TCP
             |                                          |
             |--- 1. SYN (Seq = client_isn) ----------->| (Riceve SYN)
             |                                          | Alloca buffer e TCB
             |<-- 2. SYN+ACK (Seq = server_isn, --------|
             |                ACK = client_isn + 1)     |
             |                                          |
    Alloca buffer                                       |
    Stato ESTABLISHED                                   |
             |--- 3. ACK (Seq = client_isn + 1, ------->| (Riceve ACK)
             |            ACK = server_isn + 1)         | Stato ESTABLISHED
             |    [Può contenere Dati Applicativi]      |
```

- **Passaggio 1 (SYN)**: il client propone la connessione e comunica il proprio numero di sequenza iniziale casuale (*ISN*).
- **Passaggio 2 (SYN-ACK)**: il server accetta, conferma l'`ISN` del client e comunica il proprio `ISN`.
- **Passaggio 3 (ACK)**: il client conferma l'`ISN` del server. La connessione è attiva!

---

## Dettaglio dei Tre Segmenti dell'Handshake

### 1. Primo Segmento (Client $\to$ Server: SYN)
- Flag: `SYN = 1`, `ACK = 0`.
- Nessun dato applicativo consentito (*Payload vuoto*).
- `Sequence Number = client_isn` (scelto casualmente per sicurezza contro pacchetti ritardati o spoofing).

### 2. Secondo Segmento (Server $\to$ Client: SYN-ACK)
- Flag: `SYN = 1`, `ACK = 1`.
- `Acknowledgment Number = client_isn + 1` (conferma la ricezione del SYN del client).
- `Sequence Number = server_isn` (ISN casuale scelto dal server).
- Alloca nel kernel i buffer di trasmissione/ricezione e le variabili di stato.

### 3. Terzo Segmento (Client $\to$ Server: ACK)
- Flag: `SYN = 0`, `ACK = 1`.
- `Acknowledgment Number = server_isn + 1` (conferma l'ISN del server).
- `Sequence Number = client_isn + 1`.
- **Può già trasportare dati applicativi** (es. la richiesta HTTP `GET`).

---

## Macchina a Stati Finiti (FSM): Apertura Connessione

```
                  +-----------------------+
                  |        CLOSED         |
                  +-----------------------+
                     /                 \
        listen()    /                   \ connect()
                   v                     v [Invia SYN]
         +----------------+       +----------------+
         |     LISTEN     |       |    SYN_SENT    |
         +----------------+       +----------------+
                 |                         |
       Riceve SYN|               Riceve SYN+ACK
    Invia SYN+ACK|                         | Invia ACK
                 v                         v
         +----------------+       +----------------+
         |    SYN_RCVD    |       |  ESTABLISHED   |
         +----------------+       +----------------+
                 |
       Riceve ACK|
                 v
         +----------------+
         |  ESTABLISHED   |
         +----------------+
```

- **Apertura Passiva (*Passive Open*)**: eseguita dal server invocando `listen()`.
- **Apertura Attiva (*Active Open*)**: eseguita dal client invocando `connect()`.

---

## Vulnerabilità di Sicurezza: l'Attacco SYN Flood

- Quando il server riceve un pacchetto `SYN`, alloca subito risorse di memoria kernel (buffer, descrittori) e rimane nello stato `SYN_RCVD` in attesa dell'ultimo `ACK` (fino a 30–60 secondi di timeout).
- **Attacco SYN Flood (Denial of Service - DoS)**:
  - Un attaccante invia una raffica massiccia di segmenti `SYN` falsificando gli indirizzi IP sorgente (*IP Spoofing*).
  - Il server invia i `SYN-ACK` a indirizzi inesistenti e mantiene allocati i buffer per tutte le connessioni incomplete.
  - La tabella delle connessioni pendenti (*Backlog Queue*) si satura rapidamente: il server non può più accettare connessioni da utenti legittimi!

### Contromisura Standard: **SYN Cookies**
- Il server non alloca memoria all'arrivo del `SYN`.
- Calcola l'`ISN` del server codificando un hash crittografico dell'IP e porta del client con una chiave segreta (**SYN Cookie**).
- Solo quando il client risponde con il terzo `ACK`, il server verifica il cookie e alloca la memoria se autentico.

---

## Chiusura della Connessione TCP: Termine Simmetrico (*Teardown*)

Poiché TCP è una connessione full-duplex indipendente nelle due direzioni, la chiusura è un processo simmetrico a 4 passaggi (*Four-Way Handshake*), gestito mediante il flag **`FIN`**:

```
      Client (Avvia Chiusura)                       Server (Riceve Chiusura)
             |                                                |
  close()    |--- 1. FIN (Seq = u) -------------------------->| (Riceve FIN)
  FIN_WAIT_1 |                                                |
             |<-- 2. ACK (Ack = u + 1) -----------------------| Invia ACK
  FIN_WAIT_2 |                                                | Stato CLOSE_WAIT
             |                                                | (Continua a trasmettere
             |                                                |  eventuali dati residui...)
             |                                                |
             |                                                | close()
             |<-- 3. FIN (Seq = w, Ack = u + 1) --------------| Invia FIN
  TIME_WAIT  |                                                | Stato LAST_ACK
             |--- 4. ACK (Ack = w + 1) ---------------------->|
             |                                                | Stato CLOSED
   (Attesa   |                                                
  2 * MSL)   |                                                
  CLOSED     v                                                
```

---

## Macchina a Stati Finiti (FSM): Chiusura Connessione

### Entità che Avvia la Chiusura (*Active Close* - Tipicamente il Client):
1. **`ESTABLISHED`** $\xrightarrow{\text{close() / Invia FIN}}$ **`FIN_WAIT_1`**
2. **`FIN_WAIT_1`** $\xrightarrow{\text{Riceve ACK}}$ **`FIN_WAIT_2`**
3. **`FIN_WAIT_2`** $\xrightarrow{\text{Riceve FIN / Invia ACK}}$ **`TIME_WAIT`**
4. **`TIME_WAIT`** $\xrightarrow{\text{Attesa } 2 \times \text{MSL}}$ **`CLOSED`**

### Entità che Subisce la Chiusura (*Passive Close* - Tipicamente il Server):
1. **`ESTABLISHED`** $\xrightarrow{\text{Riceve FIN / Invia ACK}}$ **`CLOSE_WAIT`**
2. L'applicazione server consuma gli ultimi byte rimasti ed invoca `close()`.
3. **`CLOSE_WAIT`** $\xrightarrow{\text{close() / Invia FIN}}$ **`LAST_ACK`**
4. **`LAST_ACK`** $\xrightarrow{\text{Riceve ACK finale}}$ **`CLOSED`**

---

## Il Ruolo Cruciale dello Stato `TIME_WAIT`

L'host che avvia la chiusura attiva non passa immediatamente a `CLOSED`, ma sosta nello stato **`TIME_WAIT`** per una durata pari a **$2 \times MSL$** (*Maximum Segment Lifetime*, convenzionalmente tra 60 e 120 secondi).

### Perché lo Stato TIME_WAIT è Indispensabile?
1. **Garantire la Consegna dell'Ultimo ACK**:
   - Se l'ultimo segmento `ACK` inviato dal client va perso sulla rete, il server andrà in timeout e ritrasmetterà il suo segmento `FIN`.
   - Se il client fosse già nello stato `CLOSED`, risponderebbe con un pacchetto `RST`, inducendo un errore anomalo sul server anziché una chiusura pulita.
2. **Spurgare i Segmenti Vecchi dalla Rete (*Old Duplicate Drainage*)**:
   - Evita che pacchetti ritardati appartenenti alla vecchia connessione possano essere recapitati per errore a una nuova connessione creata successivamente sulla stessa quaterna IP/Porta.
   - Trascorsi $2 \times MSL$, qualsiasi segmento disperso nella rete è garantito essere decaduto (*TTL = 0*).
