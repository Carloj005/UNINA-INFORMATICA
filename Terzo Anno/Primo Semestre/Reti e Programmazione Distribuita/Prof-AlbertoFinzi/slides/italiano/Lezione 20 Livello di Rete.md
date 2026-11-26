---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
style: |
  section {
    font-size: 21px;
    line-height: 1.38;
    padding: 48px 54px 52px 54px;
  }
  h1 { font-size: 1.9em; }
  h2 { font-size: 1.35em; margin-top: 0; margin-bottom: 0.45em; }
  h3 { font-size: 1.08em; margin: 0.4em 0 0.25em 0; }
  p, ul, ol { margin: 0.3em 0; }
  li { margin: 0.18em 0; }
  pre { font-size: 0.72em; line-height: 1.25; padding: 0.55em 0.8em; margin: 0.4em 0; }
  table { font-size: 0.86em; margin: 0.4em 0; }
  th, td { padding: 0.3em 0.55em; }
---

# Reti e Programmazione Distribuita
## Lezione 20: Il Livello di Rete — Architettura e Piano dei Dati
### Best-Effort, Forwarding vs Routing, Interno di un Router, Bufferbloat e Scheduling

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Dal Livello di Trasporto al Livello di Rete

- Il livello di rete realizza la consegna **host-to-host** tra macchine remote attraverso l'infrastruttura di Internet:
  - **Host mittente:** incapsula i segmenti di trasporto in **datagrammi IP** e li immette in rete.
  - **Router intermedi:** inoltrano i datagrammi verso il nodo adiacente successivo (ciascun passaggio è detto **hop**).
  - **Host ricevente:** estrae i segmenti dai datagrammi e li consegna al livello di trasporto.
- A differenza dei livelli Applicazione e Trasporto (presenti solo sugli *end systems*), il livello di rete gira su **ogni host e ogni router** — i router hanno uno **stack protocollare troncato** (solo Livelli 1, 2 e 3).
- A questo livello operano protocolli chiave come **IP, DHCP, NAT, ICMP** e i protocolli di routing.

---

## Modello di Servizio di Internet: il *Best-Effort*

Servizi che un livello di rete *potrebbe* teoricamente offrire:
- Consegna garantita; consegna con ritardo limitato (es. $< 100\text{ ms}$); consegna in ordine; banda minima garantita (es. $1\text{ Mbps}$); sicurezza/cifratura nativa.

- **In realtà Internet offre un unico servizio: *Best-Effort* ("massimo impegno"):**
  - **Nessuna garanzia** di consegna, di ordine, di ritardo massimo o di banda minima.
  - I pacchetti possono essere persi, riordinati o ritardati arbitrariamente.
- **Perché funziona così bene?**
  - La semplicità del nucleo, unita a collegamenti ad alta banda e all'intelligenza negli estremi (TCP/applicazioni), consente anche a servizi esigenti (Netflix, VoIP, videoconferenze) di funzionare su scala planetaria.

---

## Le Due Funzioni dei Router: *Forwarding* vs *Routing*

Un router svolge due compiti su **scale temporali distanti un miliardo di volte**:

| Aspetto | **Forwarding (Piano dei Dati / Data Plane)** | **Routing (Piano di Controllo / Control Plane)** |
| :--- | :--- | :--- |
| **Ambito** | **Locale al singolo router** (da porta in ingresso a porta in uscita) | **Globale di rete** (calcolo dei cammini end-to-end) |
| **Scala temporale** | **Nanosecondi** | **Secondi** |
| **Implementazione** | **Hardware dedicato** (ASIC / silicio) | **Software** (CPU / *Routing Processor*) |

- **Punto di incontro:** la **Forwarding Table** — il piano di controllo la *scrive*, il piano dei dati la *legge* una volta per ogni pacchetto.
- Un router può anche **bloccare** (firewall), **scartare** (TTL scaduto), **duplicare** (multicast) o **modificare** (NAT/ECN) un pacchetto.
- **Conseguenza:** un router inoltra senza conoscere l'intero percorso — sa solo quale suo link sia il prossimo salto.

---

## Piano di Controllo: Distribuito vs Centralizzato (SDN)

Come vengono calcolate e popolate le tabelle di inoltro dei router?

```text
  APPROCCIO DISTRIBUITO (Tradizionale)          APPROCCIO CENTRALIZZATO (SDN)
  +--------+   msg routing   +--------+          +-------------------------+
  |Router A|<--------------->|Router B|          | Remote SDN Controller   |
  | (CP+DP)|                 | (CP+DP)|          | (Data Center / Software)|
  +--------+                 +--------+          +------------+------------+
  Ogni router calcola la propria tabella                | installa regole
                                                 +------+------+------+
                                                 v                    v
                                            [Router A]           [Router B]
```

1. **Distribuito (*Per-Router*):** ogni router esegue un algoritmo di routing e scambia messaggi con gli altri router per costruire la propria tabella locale; nessuno detiene la visione completa da solo.
2. **Centralizzato (*Software-Defined Networking* — SDN):** un controller software remoto e programmabile (in data center ridondati) calcola e distribuisce le regole di inoltro ai router.

---

## Architettura Interna di un Router (4 Componenti)

```text
                    +---------------------------------+
                    |        Routing Processor        |  <-- Control Plane (Software, ms/s)
                    +---------------------------------+
                                     ^
                                     | Bus di gestione (es. PCI)
                                     v
  +--------------+          +-----------------+          +---------------+
  | Input Port 1 | -------> |                 | -------> | Output Port 1 |
  +--------------+          |    SWITCHING    |          +---------------+
  | Input Port 2 | -------> |     FABRIC      | -------> | Output Port 2 |
  +--------------+          |  (Commutazione) |          +---------------+
  | Input Port N | -------> |                 | -------> | Output Port N |
  +--------------+          +-----------------+          +---------------+
```

1. **Input Ports:** terminazione fisica e link-layer, decapsulamento, **lookup nella forwarding table** (copia locale distribuita), invio pacchetti di controllo al *Routing Processor*.
2. **Switching Fabric:** collega fisicamente le porte di ingresso alle porte di uscita.
3. **Output Ports:** memorizzazione nei buffer di uscita, scheduling, incapsulamento L2 e trasmissione fisica.
4. **Routing Processor:** esegue i protocolli di routing, mantiene le tabelle e aggiorna le copie sulle porte.

---

## Perché l'Inoltro Richiede Hardware e Tipologie di Router

- **Vincolo temporale estremo sul piano dati:**
  - Su un link di ingresso da **$100\text{ Gbps}$** con datagrammi minimi da **$64\text{ byte}$**:
    $$t_{\text{budget}} = \frac{64 \times 8\text{ bit}}{100 \times 10^9\text{ bit/s}} = \mathbf{5{,}12\text{ ns}}$$
  - Un router gestisce decine o centinaia di porte in parallelo: **nessun software può operare a queste velocità** $\Rightarrow$ input port, switching fabric e output port sono realizzati in **hardware**; solo il *Routing Processor* usa una normale CPU.
- **Tipologie di router per scala e ruolo:**
  - **Home / Small Business:** poche porte, collegano la LAN domestica/aziendale all'ISP (es. TP-Link Archer).
  - **Edge Routers:** sul confine della rete di un ISP, connettono clienti o altri provider (es. Juniper MX2020: fino a $800 \times 100\text{ GbE}$, capacità **80 Tbps**).
  - **Core Routers:** dorsali ad altissima capacità nel nucleo di Internet (es. Cisco CRS-1).

---

## Tabelle di Inoltro basate su Prefissi IP

- Memorizzare una riga per ogni singolo indirizzo IPv4 richiederebbe fino a **$2^{32}$ righe** (oltre 4 miliardi) — impraticabile!
- **Soluzione:** aggregare indirizzi contigui mediante **prefissi di rete** (i primi $k$ bit fissi identificano il gruppo, i restanti $32 - k$ identificano gli host interni; es. 21 bit fissi $\Rightarrow 2^{11} = 2\,048$ indirizzi in una sola riga!):

| Prefisso di Indirizzi IP (32 bit) | Intervallo Indirizzi | Interfaccia |
| :--- | :--- | :---: |
| `11001000 00010111 00010*** ********` *(21 bit)* | `...00010000 00000000` – `...00010111 11111111` | **0** |
| `11001000 00010111 00011000 ********` *(24 bit)* | `...00011000 00000000` – `...00011000 11111111` | **1** |
| `11001000 00010111 00011*** ********` *(21 bit)* | `...00011001 00000000` – `...00011111 11111111` | **2** |
| `otherwise` *(rotta di default)* | Tutti gli altri indirizzi | **3** |

- Quattro righe sostituiscono 4 miliardi di voci; l'ultima riga (`otherwise`) garantisce sempre un'uscita predefinita.

---

## *Longest Prefix Matching* e Paradigma *Match-plus-Action*

Le righe della tabella possono **sovrapporsi**. Quando un indirizzo IP combacia con più prefissi, vince la **regola del prefisso più lungo (*Longest Prefix Matching*)**:

- Indirizzo di destinazione: `11001000 00010111 00011000 10101010`
  - Match con **Interfaccia 2**: `21 bit` coincidenti.
  - Match con **Interfaccia 1**: `24 bit` coincidenti $\Rightarrow$ **Vince l'Interfaccia 1!**
- **Paradigma *Match-plus-Action*:**
  - Cercare campi nell'header (*Match*) ed eseguire un'operazione (*Action*) è uno schema generale condiviso da molti dispositivi di rete:
    - **Router:** match su IP destinazione $\to$ inoltro sulla porta di uscita.
    - **Switch:** match su MAC destinazione $\to$ inoltro su porta LAN.
    - **Firewall:** match su IP/porte/flag $\to$ consenti o blocca (*drop*).
    - **NAT:** match su IP/porta $\to$ riscrivi indirizzo/porta prima di inoltrare.

---

## Strutture di Commutazione (*Switching Fabric*)

Esistono **3 architetture** principali per trasferire i pacchetti dalle porte di ingresso a quelle di uscita:

1. **Commutazione via Memoria *(primi router)*:**
   - Le porte sono dispositivi di I/O: il pacchetto interrompe la CPU, viene copiato in RAM e poi ricopiato nel buffer di uscita.
   - Attraversa il bus di memoria **due volte**: se la banda di memoria è $B$ pkt/s, il throughput del router è **$< B/2$** (e solo 1 pacchetto alla volta).
   - *Variante moderna:* memorie condivise gestite dall'hardware della line card senza passare dalla CPU centrale.
2. **Commutazione via Bus Condiviso:**
   - La porta di ingresso prepone un'etichetta interna con la porta di uscita e invia direttamente sul bus condiviso (senza CPU); solo la porta destinataria trattiene il pacchetto e rimuove l'etichetta.
   - **1 pacchetto per volta** (limite = velocità del bus, es. backplane da 32 Gbps): semplice ed economico per router aziendali/locali.

---

## Commutazione via Rete di Interconnessione (*Crossbar*)

```text
  Input A --------+--------+--------+
                  |        |        |     (X = crosspoint chiuso)
  Input B --------+---X----+--------+     A -> Y e B -> X procedono
                  |        |        |     SIMULTANEAMENTE in parallelo!
  Input C --------+--------+---X----+
                  v        v        v
                Out X    Out Y    Out Z
```

- **Struttura *Crossbar*:** $2N$ bus che collegano $N$ ingressi a $N$ uscite con un interruttore (*crosspoint*) ad ogni incrocio.
- **Commutazione parallela e *Non-Blocking*:** un pacchetto non viene mai fermato se la sua porta di uscita è libera (es. $A \to Y$ e $B \to X$ avvengono insieme).
- **Limite inevitabile:** se **due porte di ingresso** inviano contemporaneamente verso la **stessa porta di uscita**, una delle due deve comunque attendere in coda all'ingresso!

---

## Dove si Forma l'Accodamento? Velocità della Fabric

Consideriamo un router con $N$ porte di ingresso e $N$ di uscita, tutte di velocità $R_{\text{line}}$, nel caso peggiore in cui tutti i pacchetti siano diretti alla **stessa porta di uscita** (con fabric di velocità $R_{\text{switch}}$):

| Velocità della Fabric | Code in Ingresso | Code in Uscita | Motivazione |
| :--- | :---: | :---: | :--- |
| **$R_{\text{switch}} \ge N \cdot R_{\text{line}}$** | Trascurabili | **Significative** | La fabric svuota subito gli ingressi, ma i pacchetti arrivano all'uscita a ritmo $N \cdot R_{\text{line}} > R_{\text{line}}$ |
| **$R_{\text{line}} < R_{\text{switch}} < N \cdot R_{\text{line}}$** | **Presenti** | **Presenti** | L'ingresso attende la fabric e l'uscita attende il link fisico |
| **$R_{\text{switch}} \approx R_{\text{line}}$** | **Significative** | Trascurabili | I pacchetti si accumulano prima di attraversare la fabric |

> **Principio chiave:** nessuna architettura di *switching fabric* può eliminare l'accodamento; cambia solo **dove** le code si formano.

---

## *Head-of-Line (HOL) Blocking* all'Ingresso

```text
  Input 1: [ Pkt per Out Y (BLOCCATO!) ] [ Pkt per Out X (attende!) ] ---> Out X (contesa!)
  Input 2:                               [ Pkt per Out X (passa)    ] ---> Out Y (LIBERA!)
```

- L'**HOL Blocking** si verifica quando un pacchetto in testa a una coda FIFO di ingresso non può attraversare la fabric perché la sua porta di uscita è occupata da un altro ingresso.
- Poiché la coda di ingresso è servita in ordine FIFO, **tutti i pacchetti dietro di esso restano bloccati**, anche quando le loro porte di uscita (es. Out Y) sono completamente libere!
- Questo fenomeno riduce drasticamente il throughput effettivo del router sotto carico elevato.

---

## Gestione dei Buffer di Uscita e Dimensionamento

Quando i pacchetti giungono a una porta di uscita più velocemente di quanto il link possa trasmettere, si accumulano nel **buffer di uscita** (fino al possibile **overflow**):

- **Politiche di scarto a buffer pieno:**
  - **Drop-tail:** scarta i pacchetti appena arrivati (la più semplice e diffusa).
  - *Altre politiche:* scartare/marcare pacchetti già in coda per fare spazio ai nuovi o segnalare la congestione in anticipo (AQM / ECN).
- **Quanto grande deve essere un buffer?**
  - **Regola storica** (pochi flussi TCP): $B = \text{RTT} \cdot C$ *(es. link 10 Gbps con RTT 250 ms $\Rightarrow 2{,}5\text{ Gbit}$ di buffer)*.
  - **Regola moderna con $N$ flussi TCP indipendenti:**
    $$B = \frac{\text{RTT} \cdot C}{\sqrt{N}}$$
    Nel nucleo di Internet (migliaia di flussi) riduce drasticamente la memoria necessaria!
  - **Più buffer NON è meglio:** buffer sovradimensionati allungano il ritardo di accodamento e rallentano la reazione di TCP (**Bufferbloat**).

---

## *Bufferbloat*: Latenza Persistente senza Guadagno di Banda

**Definizione:** accumulo persistente di pacchetti in buffer sovradimensionati che aumenta drasticamente la latenza anche quando il link è già al 100% di utilizzo.

### Esempio Numerico (Flusso TCP Singolo):
- Router domestico con tempo di trasmissione $10\text{ ms/pkt}$, $\text{RTT}_{\text{base}} = 200\text{ ms}$ (senza coda) e finestra TCP di **25 pacchetti**:
  - A $t = 0$: arriva un burst di **25 pacchetti** nel buffer del router.
  - A $t = 200\text{ ms}$: il router ha già trasmesso **20 pacchetti** (200 ms / 10 ms) e arriva il 1° ACK $\Rightarrow$ il mittente invia subito un nuovo pacchetto.
  - Da quel momento arriva **1 ACK ogni 10 ms**, innescando **1 nuovo pacchetto ogni 10 ms**: il tasso di arrivo eguaglia quello di uscita!
- **Risultato:** **5 pacchetti rimangono permanentemente in coda**, aggiungendo **$+50\text{ ms}$ di latenza costante** senza aumentare minimamente il throughput!

---

## *Packet Scheduling*: FIFO e *Priority Queueing*

Quando più pacchetti attendono alla porta di uscita, uno **scheduler** sceglie il prossimo da trasmettere al termine di ogni trasmissione (decisione *non-preemptive*):

1. **FIFO / FCFS (*First-Come, First-Served*):**
   - Un'unica coda servita rigorosamente in ordine di arrivo.
   - Nessuna differenziazione di traffico; zero configurazione (è il comportamento di default).
2. **Priority Queueing (Accodamento con Priorità):**
   - I pacchetti vengono classificati all'arrivo in **classi di priorità** (es. in base a porte TCP/UDP, IP o campi di priorità IP): traffico di gestione rete o VoIP in alta priorità, traffico utente in bassa priorità.
   - Si trasmette sempre il primo pacchetto (FIFO) della **coda non vuota a priorità più alta**.
   - **Non-preemptive:** una trasmissione già avviata non viene mai interrotta; attenzione al rischio di *starvation* per le classi a bassa priorità.

---

## *Round-Robin* (RR), WRR e *Weighted Fair Queuing* (WFQ)

I pacchetti sono divisi in classi, ma le code non vuote vengono servite **a turno** (*work-conserving*: il link non resta mai inattivo se almeno una coda ha pacchetti):

- **Round-Robin (RR):** serve ciclicamente una coda non vuota alla volta (1 pacchetto per visita).
- **Weighted Round-Robin (WRR):** assegna un peso $w_i$ che determina **quanti pacchetti** la classe $i$ trasmette per ciclo.
- **Weighted Fair Queuing (WFQ):** assegna un peso $w_i$ garantendo una **frazione proporzionale di banda** (tenendo conto anche della dimensione dei pacchetti!). Su un link di capacità $R$:

$$R_i = R \cdot \frac{w_i}{\sum_{j \text{ attive}} w_j}$$

- **Nota chiave:** uno scheduler **decide solo l'ordine** di trasmissione; non crea mai capacità aggiuntiva! *(In Priority i pacchetti ad alta priorità scavalcano quelli a bassa priorità arrivati prima; in RR il turno garantisce equità senza starvation).*

---

## Classificazione del Traffico (DSCP) e *Net Neutrality*

- **Chi decide a quale classe appartiene un pacchetto?**
  - Gli algoritmi di scheduling sono indipendenti dai criteri di classificazione.
  - Gli operatori definiscono politiche basate sui campi dell'header: indirizzi IP, porte TCP/UDP, oppure marcature **DSCP** (*Differentiated Services Code Point*, nell'header IP).
- **Conseguenze etiche e regolatorie — *Net Neutrality* (Neutralità della Rete):**
  - Gli stessi meccanismi di classificazione e scheduling che consentono di dare priorità al traffico real-time possono essere usati dagli ISP per **favorire, rallentare (*throttling*) o bloccare** specifici servizi o concorrenti.
  - Il principio di *Net Neutrality* discute l'equità e i limiti entro cui un ISP dovrebbe poter differenziare il traffico sulla rete pubblica.

---

## Sintesi della Lezione 20

- **Servizio Best-Effort:** il livello di rete non offre garanzie di consegna, ordine o ritardo; l'affidabilità è costruita negli host terminali.
- **Due Piani Separati:** *Forwarding* locale in hardware (nanosecondi) e *Routing* globale in software (secondi), collegati dalla *Forwarding Table*.
- **Prefissi e LPM:** le tabelle aggregano indirizzi per prefisso e applicano il **Longest Prefix Matching** (schema *match-plus-action*).
- **Tre Switching Fabric:** memoria, bus condiviso e *crossbar* (parallela e non bloccante, ma sempre soggetta a contesa verso la stessa uscita).
- **Code, Buffer e Scheduling:** HOL blocking all'ingresso, dimensionamento buffer ($\text{RTT}\cdot C/\sqrt{N}$), fenomeno del **Bufferbloat** e algoritmi di scheduling (**FIFO, Priority, RR, WRR, WFQ**).
