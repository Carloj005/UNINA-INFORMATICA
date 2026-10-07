---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezione 05: Il Livello di Applicazione — Messaggi HTTP, Cookie e Caching

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Formato dei Messaggi HTTP

Il protocollo HTTP definisce due tipologie di messaggi scritti in testo ASCII leggibile:
1. **Messaggio di Richiesta (*HTTP Request Message*)**: inviato dal client al server.
2. **Messaggio di Risposta (*HTTP Response Message*)**: inviato dal server al client.

Entrambi condividono una struttura a blocchi:
- Una **riga iniziale** (Request line o Status line).
- Una sequenza di **righe di intestazione (*Header Lines*)**.
- Una **riga vuota** obbligatoria (`\r\n` / CRLF) che separa gli header dal corpo.
- Un **corpo dell'entità (*Entity Body*)** facoltativo.

---

## Formato del Messaggio di Richiesta HTTP

```http
GET /somedir/page.html HTTP/1.1\r\n
Host: www.someschool.edu\r\n
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)\r\n
Accept-Language: it,en;q=0.9\r\n
Connection: keep-alive\r\n
\r\n
[Corpo del messaggio opzionale, es. parametri POST]
```

1. **Riga di Richiesta (*Request Line*)**:
   - `Metodo` (es. `GET`, `POST`)
   - `URL / Percorso` della risorsa richiesta
   - `Versione HTTP` (es. `HTTP/1.1`)
2. **Righe di Intestazione (*Header Lines*)**:
   - `Host`: indica il nome di dominio del server (obbligatorio in HTTP/1.1 per il virtual hosting).
   - `User-Agent`: identifica il browser e il sistema operativo del client.
   - `Connection: keep-alive`: richiede di mantenere aperta la connessione TCP.

---

## I Metodi HTTP

- **`GET`**: richiede una risorsa al server. Non include body nella richiesta; eventuali parametri viaggiano codificati nella query string dell'URL (`?q=reti&anno=3`).
- **`POST`**: invia dati al server (es. invio di un form HTML, credenziali di login). I dati viaggiano all'interno dell'**Entity Body**.
- **`HEAD`**: analogo a `GET`, ma richiede al server di restituire **esclusivamente gli header**, omettendo il corpo dell'oggetto. Utilizzato per testare la validità dei link o controllare se una risorsa è stata modificata senza scaricarla.
- **`PUT`**: carica o sovrascrive completamente una risorsa all'URL specificato sul server.
- **`DELETE`**: cancella la risorsa specificata dall'URL sul server.

---

## Formato del Messaggio di Risposta HTTP

```http
HTTP/1.1 200 OK\r\n
Date: Wed, 07 Oct 2026 12:00:00 GMT\r\n
Server: Apache/2.4.52 (Ubuntu)\r\n
Last-Modified: Mon, 05 Oct 2026 09:30:00 GMT\r\n
Content-Length: 6821\r\n
Content-Type: text/html; charset=UTF-8\r\n
Connection: keep-alive\r\n
\r\n
<!DOCTYPE html><html><head>...[Dati HTML effettivi]
```

1. **Riga di Stato (*Status Line*)**:
   - Versione del protocollo (`HTTP/1.1`)
   - **Codice di Stato (*Status Code*)**: intero a 3 cifre (es. `200`)
   - **Frase di Stato (*Reason Phrase*)**: descrizione leggibile (es. `OK`)
2. **Header di Risposta**:
   - `Last-Modified`: data e ora dell'ultima modifica della risorsa.
   - `Content-Length`: dimensione del corpo in byte.
   - `Content-Type`: tipo MIME del contenuto (`text/html`, `image/jpeg`, `application/json`).

---

## I Codici di Stato HTTP (*Status Codes*)

I codici di stato a 3 cifre sono suddivisi in 5 classi:

- **1xx (Informativi)**: richiesta ricevuta, elaborazione in corso (`100 Continue`).
- **2xx (Successo)**: richiesta ricevuta, compresa e accettata con successo.
  - `200 OK`: risorsa trovata e allegata nel corpo.
- **3xx (Reindirizzamento)**: sono necessarie ulteriori azioni dal client.
  - `301 Moved Permanently`: la risorsa ha un nuovo URL permanente (indicato in `Location:`).
  - `304 Not Modified`: la copia in cache è ancora valida (nessun body trasmesso).
- **4xx (Errore del Client)**: richiesta sintatticamente errata o non autorizzata.
  - `400 Bad Request`: messaggio malformato.
  - `401 Unauthorized` / `403 Forbidden`: autenticazione richiesta o accesso negato.
  - `404 Not Found`: la risorsa richiesta non esiste sul server.
- **5xx (Errore del Server)**: il server non è riuscito a soddisfare una richiesta valida.
  - `500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`.

---

## Sperimentare HTTP "a Mano" con Netcat (`nc`)

È possibile inviare comandi HTTP direttamente da terminale senza usare il browser:

```bash
nc www.google.it 80
```
Digitando manualmente:
```http
GET / HTTP/1.1
Host: www.google.it

```
*(Premendo INVIO due volte)*

Il server risponderà visualizzando la riga di stato (es. `HTTP/1.1 200 OK`), tutte le righe di header e il corpo HTML del documento.

---

## Mantenere lo Stato in un Protocollo Stateless: I Cookie

- Poiché HTTP è **Stateless**, per abilitare servizi come carrelli della spesa, login persistenti, preferenze utente e profilazione sono stati introdotti i **Cookie (RFC 6265)**.
- **I 4 componenti della tecnologia dei Cookie**:
  1. **Header nella risposta HTTP**: il server invia `Set-Cookie: id_utente=12345; Path=/; Secure`.
  2. **Memorizzazione lato client**: il browser memorizza il cookie associato al dominio.
  3. **Header nelle richieste HTTP successive**: per ogni successiva visita a quel dominio, il browser include automaticamente `Cookie: id_utente=12345`.
  4. **Database di sessione sul server**: il server usa l'identificativo ricevuto per recuperare lo stato dell'utente dal proprio database.

---

## Flusso Operativo dei Cookie: Esempio di E-Commerce

```
Client (Browser)                                    Server (es. Amazon)
      |                                                     |
      | --- 1. Richiesta HTTP ordinaria ------------------> |
      |                                                     | Crea ID nel DB (es. 1678)
      | <-- 2. Risposta HTTP con Set-Cookie: id=1678 ------ |
      |                                                     |
Memorizza cookie (amazon.com, id=1678)                      |
      |                                                     |
      | --- 3. Nuova richiesta con Cookie: id=1678 -------> |
      |                                                     | Riconosce l'utente 1678
      | <-- 4. Risposta personalizzata -------------------- | (carrello, storico, login)
```

> Se l'utente cancella i dati del browser o i cookie a metà navigazione, l'identificativo viene perso: il server non potrà più associare le richieste successive a quella sessione.

---

## Web Caching e Proxy Server

- Un **Web Cache (o Proxy Server)** è un'entità di rete che soddisfa le richieste HTTP per conto dell'origin server, memorizzando copie degli oggetti recentemente richiesti.
- **Come funziona**:
  1. Il browser invia la richiesta HTTP al Proxy Server locale.
  2. Se l'oggetto è presente nella cache (*Cache Hit*), il proxy lo restituisce **immediatamente** al client.
  3. Se l'oggetto non è presente (*Cache Miss*), il proxy contatta l'origin server, riceve l'oggetto, ne salva una copia locale e lo inoltra al client.
- Il Proxy Server agisce **sia da server** (verso i client della rete locale) **sia da client** (verso gli origin server su Internet).

---

## Perché Usare i Web Cache?

1. **Riduzione dei Tempi di Risposta (*Latency Reduction*)**:
   - La cache si trova tipicamente nella rete locale (LAN), vicinissima al client: le risposte vengono servite in millisecondi anziché attendere il tragitto transoceanico.
2. **Drammatica Riduzione del Traffico sul Link di Accesso**:
   - Il collegamento in fibra dell'azienda o dell'università verso l'ISP non viene intasato da richieste ripetute per gli stessi contenuti (es. video virali, aggiornamenti software).
3. **Distribuzione Globale del Carico (*Content Delivery Networks - CDN*)**:
   - Reti geografiche di cache distribuite in tutto il mondo (Cloudflare, Akamai) che avvicinano i contenuti agli utenti finali per conto dei grandi siti web.

---

## Il Problema della Coerenza della Cache: GET Condizionale

Se la cache memorizza una copia di un file, come può essere sicura che l'oggetto non sia stato modificato sull'origin server nel frattempo?  
HTTP risolve questo problema tramite il meccanismo del **GET Condizionale (*Conditional GET*)**:

1. Il proxy o il browser memorizza l'oggetto assieme all'header ricevuto originariamente:  
   `Last-Modified: Wed, 01 Oct 2026 14:00:00 GMT`
2. Quando l'oggetto viene richiesto nuovamente, la cache invia all'origin server una richiesta con l'header:
   ```http
   GET /logo.png HTTP/1.1
   Host: www.sito.it
   If-Modified-Since: Wed, 01 Oct 2026 14:00:00 GMT
   ```

---

## Risposta al GET Condizionale: Risparmio di Banda

- **Caso 1: L'oggetto NON è stato modificato**:
  - Il server risponde con un messaggio leggerissimo privo di corpo:
    ```http
    HTTP/1.1 304 Not Modified
    Date: Wed, 07 Oct 2026 12:00:00 GMT
    ```
  - La cache riutilizza la propria copia locale e la serve al client.
  - **Risparmio enorme**: zero byte di dati trasferiti sulla rete!

- **Caso 2: L'oggetto È stato modificato**:
  - Il server risponde con `HTTP/1.1 200 OK`, allega la nuova versione dell'oggetto e aggiorna la data `Last-Modified`.
- In alternativa alle date, HTTP supporta gli **ETag (*Entity Tags*)**: codici hash univoci del file inviati con `If-None-Match: "xyz123"`.

---

## Proxy Server e Connessioni Sicure HTTPS

- Con la diffusione universale di **HTTPS (crittografia TLS end-to-end)**:
  - I dati scambiati tra client e server sono cifrati: un proxy intermedio trasparente **non può più leggere gli URL specifici né memorizzare in chiaro gli oggetti**.
- **HTTPS Tunneling (Metodo `CONNECT`)**:
  - Il client invia al proxy una richiesta speciale: `CONNECT www.sito.it:443 HTTP/1.1`.
  - Il proxy stabilisce un tunnel TCP cieco verso il server e si limita a inoltrare i bit cifrati avanti e indietro, senza poter ispezionare il traffico.
- Nelle reti moderne il caching dei contenuti cifrati viene effettuato direttamente dalle **CDN** autorizzate dai proprietari del dominio mediante certificati TLS dedicati.

---

## Sintesi della Lezione

- I messaggi HTTP hanno una struttura testuale semplice e rigorosa: **Riga iniziale**, **Header**, **Riga vuota**, **Body**.
- I metodi principali (`GET`, `POST`, `HEAD`, `PUT`, `DELETE`) definiscono le azioni sulle risorse.
- I **Codici di stato** informano il client sull'esito della richiesta (200 OK, 301/304, 404, 500).
- I **Cookie** permettono di introdurre il concetto di sessione e stato all'interno di un protocollo nativamente Stateless.
- Il **Web Caching** e il **GET Condizionale (`If-Modified-Since`)** sono pilastri architetturali per garantire scalabilità globale e tempi di risposta istantanei.
- Nella prossima lezione analizzeremo la posta elettronica e il protocollo **SMTP**!
