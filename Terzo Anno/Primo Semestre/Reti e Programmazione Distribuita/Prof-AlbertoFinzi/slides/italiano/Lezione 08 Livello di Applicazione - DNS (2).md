---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezione 08: Il Livello di Applicazione — DNS (Parte 2)
### Formato dei Messaggi, Strumenti di Diagnosi (`dig`), Risoluzione Inversa e Bilanciamento

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Formato del Messaggio DNS

Le interrogazioni (*query*) e le risposte (*reply*) DNS condividono la stessa struttura fondamentale:

```text
+---------------------------------------------------+
|               Header (12 byte)                    |
+---------------------------------------------------+
|             Question Section                      |
+---------------------------------------------------+
|              Answer Section                       |
+---------------------------------------------------+
|             Authority Section                     |
+---------------------------------------------------+
|            Additional Section                     |
+---------------------------------------------------+
```

- **Header (12 byte):** Contiene un identificatore (*Transaction ID*) per associare query e reply, e i flag di controllo.
- **Question Section:** Il nome richiesto (*QNAME*) e il tipo di record (*QTYPE*).
- **Answer Section:** I Resource Record (RR) che rispondono direttamente alla richiesta.
- **Authority Section:** Server autoritativi responsabili della zona.
- **Additional Section:** Informazioni aggiuntive (es. indirizzi IP dei server di autorità).

---

## I Flag dell'Header DNS

I flag principali nell'header determinano il comportamento della risoluzione:

- **QR (*Query/Response*):** `0` per una query, `1` per una risposta.
- **AA (*Authoritative Answer*):** `1` se il server che risponde è autoritativo per la zona del nome interrogato.
- **RD (*Recursion Desired*):** Impostato dal client se richiede una risoluzione ricorsiva.
- **RA (*Recursion Available*):** Impostato dal server se supporta ed è configurato per offrire ricorsione.
- **RCODE (*Response Code*):** Indica l'esito (es. `NOERROR`, `NXDOMAIN` se il nome non esiste).

---

## Lo Strumento `dig` (Domain Information Groper)

`dig` è il comando standard su sistemi POSIX/Linux per inviare query DNS e ispezionare le risposte a basso livello:

```bash
dig [@server] nome-host [tipo-record] [opzioni]
```

### Opzioni Utili per la Diagnostica:
- `+noall +answer`: Sopprime le sezioni superflue e mostra esclusivamente la sezione *Answer*.
- `+norecurse`: Disabilita il flag *RD* (query iterativa al server specificato).
- `+trace`: Simula il percorso completo di risoluzione gerarchica partendo dai root server.
- `+multiline`: Formatta i record complessi (es. SOA) su più righe leggibili.

---

## Esempio di Query A e Catene CNAME

```bash
$ dig +noall +answer www.mit.edu A
www.mit.edu.             300  IN  CNAME  www.mit.edu.edgekey.net.
www.mit.edu.edgekey.net.  600  IN  CNAME  e9566.dscb.akamaiedge.net.
e9566.dscb.akamaiedge.net. 20  IN  A      23.50.153.111
```

### Struttura della Risoluzione:
- **`www.mit.edu`** è un alias (*CNAME*) gestito dal server DNS del MIT per delegare il traffico.
- Punta all'infrastruttura di Akamai (*Content Delivery Network - CDN*).
- I CNAME possono attraversare diverse zone DNS senza trasferire l'autorità sul dominio originario.
- **TTL Differenziati:** Gli alias cambiano raramente (TTL alti), mentre l'IP della CDN cambia frequentemente (TTL di 20 secondi) per bilanciamento e failover dinamico.

---

## Esercizio: Risoluzione di Alias CNAME

Un utente esegue il comando:
```bash
dig +noall +answer www.university.edu A
```
Il resolver restituisce:
```text
www.university.edu.   300  IN  CNAME  web.provider.net.
web.provider.net.      300  IN  CNAME  node42.network.net.
node42.network.net.    120  IN  A      203.0.113.42
```

### Domande di Verifica per l'Esame:
1. Perché la risposta contiene record CNAME anche se è stato richiesto un record A?
2. Quanti salti di denominazione (*naming hops*) sono coinvolti?
3. Quale hostname ospita fisicamente il record A?
4. Perché la risoluzione si sposta da `.edu` a `.net`?
5. Quali server autoritativi sono responsabili per ciascun record?

---

## Risoluzione Inversa (Reverse DNS) e `in-addr.arpa`

La **risoluzione inversa** mappa un indirizzo IPv4 nel corrispondente nome canonico utilizzando i record **PTR** (*Pointer*).

- Gli indirizzi IP sono invertiti gerarchicamente sotto il dominio speciale `in-addr.arpa`:
  - Indirizzo: `192.0.2.10`
  - Nome DNS: `10.2.0.192.in-addr.arpa`

### Utilizzo con `dig -x`:
```bash
$ dig -x 8.8.8.8 +noall +answer
8.8.8.8.in-addr.arpa.    76757   IN   PTR   dns.google.
```

L'albero parte dalla radice `.`, passa per `arpa.` $\to$ `in-addr.arpa.` $\to$ `8.in-addr.arpa.` fino al nodo foglia.

---

## Record MX (Mail Exchanger)

Il record MX identifica i server di posta responsabili per un dominio:

```bash
$ dig +noall +answer mit.edu MX
mit.edu.    65   IN   MX   100   mit-edu.mail.protection.outlook.com.
```

- **RDATA MX:** Composto da:
  1. **Valore di Preferenza (*Preference*):** Un intero (es. `100`). Un valore **più basso** indica una **priorità più alta**.
  2. **Nome del Mail Server:** Hostname del server SMTP.
- Per inviare email, il client o MTA deve effettuare una successiva query di tipo A o AAAA per ottenere l'IP del mail server:
  ```bash
  dig +noall +answer mit-edu.mail.protection.outlook.com A
  ```

---

## Record NS (Name Server) e Ispezione Pacchetti

I record NS identificano i server autoritativi per una zona:

```bash
$ dig +noall +answer mit.edu NS
mit.edu.    1800   IN   NS   asia2.akam.net.
mit.edu.    1800   IN   NS   use2.akam.net.
```

### Analisi in Wireshark:
1. Filtro di visualizzazione: `dns`
2. **Porta UDP di trasporto:** 53 sia per la query (porta destinazione) che per la risposta (porta sorgente).
3. **Transaction ID:** Un valore a 16 bit generato casualmente dal client, replicato fedelmente dal server nella risposta per prevenire spoofing.

---

## Record SOA (Start of Authority)

Il record SOA descrive i parametri amministrativi e di sincronizzazione della zona:

```bash
$ dig @use2.akam.net mit.edu SOA +multiline
mit.edu.  3600  IN  SOA  use2.akam.net. network-request.mit.edu. (
                         2026102801 ; serial
                         28800      ; refresh (8 hours)
                         7200       ; retry (2 hours)
                         604800     ; expire (1 week)
                         3600       ; minimum TTL (negative caching)
                         )
```

- **MNAME:** Server autoritativo primario (*primary master*).
- **RNAME:** Indirizzo email del responsabile (con il primo `.` al posto di `@`).
- **Serial Number:** Versione del file di zona (aggiornato ad ogni modifica, es. formato `YYYYMMDDnn`).
- **Negative Caching:** Tempo di memorizzazione nella cache delle risposte negative (`NXDOMAIN`).

---

## Attraversamento Iterativo della Gerarchia DNS

Con `dig +norecurse` è possibile simulare manualmente il percorso passo-passo compiuto da un resolver iterativo:

```text
1. Query a un Root Server:
   dig +norecurse @c.root-servers.net hyoka.ofc.kyushu-u.ac.jp A
   -> Nessuna risposta (ANSWER: 0), delega ai server TLD .jp (AUTHORITY: 8)

2. Query al server TLD .jp:
   dig +norecurse @b.dns.jp hyoka.ofc.kyushu-u.ac.jp A
   -> Delega ai server autoritativi di kyushu-u.ac.jp

3. Query al server accademico:
   dig +norecurse @ns2.kyushu-u.ac.jp hyoka.ofc.kyushu-u.ac.jp A
   -> Delega alla sotto-zona ofc.kyushu-u.ac.jp

4. Query al server finale di dipartimento:
   dig +norecurse @ns.jimu.kyushu-u.ac.jp hyoka.ofc.kyushu-u.ac.jp A
   -> Risposta con flag 'aa' (Authoritative Answer): IP 133.5.40.197!
```

---

## Tracciamento Automatico con `dig +trace`

Il comando:
```bash
dig +trace +nodnssec hyoka.ofc.kyushu-u.ac.jp A
```
esegue l'intera catena di risoluzione in una sola istruzione:
1. Contatta i Root Servers (`.`) ottenendo la delega per il TLD `.jp`.
2. Contatta i server autoritativi `.jp` ottenendo la delega per `kyushu-u.ac.jp`.
3. Contatta i server dell'università ottenendo l'indirizzo finale dal server di zona.

> L'opzione `+nodnssec` esclude le firme crittografiche (record RRSIG, DS) rendendo l'output più compatto e leggibile.

---

## Bilanciamento e Disponibilità: Multiple NS vs. Multiple A

| Meccanismo | Tipo Record | Scopo Principale | Funzionamento |
| :--- | :--- | :--- | :--- |
| **DNS Service Availability** | `NS` multipli | Ridondanza e tolleranza ai guasti del servizio DNS | I resolver interrogano server alternativi se uno non risponde |
| **Application Load Distribution** | `A` multipli | Bilanciamento del traffico verso l'applicazione web | Il server DNS ruota ciclicamente l'ordine degli IP (*Round-Robin*) |

```text
Esempio Round-Robin:
1^ Richiesta: IP1, IP2, IP3
2^ Richiesta: IP2, IP3, IP1
3^ Richiesta: IP3, IP1, IP2
```

I client scelgono tipicamente il primo IP restituito, distribuendo il carico su server web replicati.

---

## Riepilogo Concettuale

1. **Nomi per gli utenti, indirizzi per la rete:** Il DNS è il database distribuito che colma questa separazione.
2. **Struttura gerarchica:** Lo spazio dei nomi è un albero; una *zona* è la porzione gestita autonomamente da un'organizzazione.
3. **Tipologie di Record:** `A` (IPv4), `AAAA` (IPv6), `CNAME` (alias), `NS` (server autoritativi), `MX` (posta), `PTR` (risoluzione inversa), `SOA` (parametri di zona).
4. **Iterativo vs Ricorsivo:** Il client interroga tipicamente il resolver locale in modalità ricorsiva; il resolver attraversa la gerarchia in modalità iterativa.
5. **Caching e TTL:** Il meccanismo fondamentale che garantisce la scalabilità globale di Internet.
