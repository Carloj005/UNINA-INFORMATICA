# Guida allo Studio sul Libro — Reti e Programmazione Distribuita

**Corso:** Reti e Programmazione Distribuita (9 CFU) — Università degli Studi di Napoli Federico II  
**Docente:** Prof. Alberto Finzi  
**Libro di riferimento analizzato:** J. F. Kurose, K. W. Ross, *Reti di calcolatori e Internet. Un approccio top-down* — **8ª edizione italiana** (Pearson, 2022, 711 pagine PDF)  
**Base dell'analisi:** Tutte le 25 presentazioni presenti in `slides/` (aggiornate al 26/11/2026 fino a **Lezione 20** del canale corrente + slide 2024/2025 per la parte finale del programma) e il laboratorio in `esercizi/`.

---

> **⚠️ Regola per la numerazione delle pagine del PDF**
>
> Nel file `Reti di calcolatori e Internet. Un approccio top-down.pdf` la numerazione del lettore PDF **non coincide** con quella stampata sulle pagine:
>
> - **Capitoli 1–6 (in italiano):** `Pagina PDF = Pagina stampata + 22` *(es. Capitolo 1, p. 1 = PDF p. 23)*.
> - **Capitolo 8 (in inglese, integrato dal materiale online):** `Pagina PDF = Pagina stampata − 76` *(es. Sez. 8.1, p. 608 = PDF p. 532)*.
>
> In tutte le tabelle seguenti sono indicati **entrambi i riferimenti** (`Pag. libro` e `Pag. PDF`).

---

## 🔄 Novità introdotte dalle nuove slide aggiornate (Lezioni 17, 19 e 20)

Rispetto alle precedenti versioni 2024/2025 (ex Lez. 13, 14 e 15), il Prof. Finzi ha ampliato in modo sostanziale tre lezioni, portando **in programma nuove parti del Capitolo 3 e approfondimenti del Capitolo 4**:

- **Lezione 17 — TCP Connection Management** *(13 → 34 slide)*: ora copre l'intera **Sez. 3.5.6** fino alla fine, includendo **SYN flood**, **SYN cookies** (p. 213), port scanning con **`nmap`** (pp. 212–214), **`RST`**, **`TIME_WAIT`** (p. 211), *half-close* (`shutdown(SHUT_WR)`), bug `CLOSE_WAIT`, code SYN/accept del kernel e cattura `nc`/`Wireshark`.
- **Lezione 19 — Flow Control & Congestion Control** *(10 → 33 slide)*:
    - **Sez. 3.5.5**: aggiunti **zero-window probes** (p. 208) e **TCP Window Scaling** (limite 64 KB e *Bandwidth-Delay Product*).
    - **Sez. 3.6.1**: ora trattati **tutti e 3 gli scenari** della congestione (buffer infiniti, buffer finiti con ritrasmissioni/timeout prematuri e reti multihop con *congestion collapse*).
    - **Sez. 3.7.1**: ora coperto **integralmente** (`Sending rate ≈ cwnd/RTT`, Slow Start, `ssthresh`, Congestion Avoidance `MSS²/cwnd`, Fast Retransmit & Fast Recovery `cwnd = ssthresh + 3 MSS`, AIMD, Tahoe, Reno e **CUBIC**).
    - **Sez. 3.7.2 *(NUOVA IN PROGRAMMA)*:** **ECN** (RFC 3168, campi IP `ECT`/`CE`, flag TCP `ECE`/`CWR` e negoziazione in handshake) e controllo basato sul ritardo (**TCP Vegas** e **BBR**).
    - **Sez. 3.7.3 *(cenno)*:** dipendenza del throughput dall'RTT tra flussi sullo stesso collo di bottiglia.
- **Lezione 20 — The Network Layer** *(22 → 40 slide)*: approfondimento completo di **Sez. 4.1 e 4.2**, inclusi calcolo hardware dell'inoltro (100 Gbps / 64 B = 5,12 ns), *match-plus-action*, dettagli delle 3 *switching fabric* (memoria `< B/2`, bus, crossbar `2N`), **HOL blocking**, *drop-tail*, dimensionamento buffer **`RTT·C`** e **`RTT·C/√N`**, **Bufferbloat**, formula **WFQ**, **DSCP** e **Net Neutrality**.

---

## 📚 Mappa dettagliata Capitolo per Capitolo

### Capitolo 1 — Reti di calcolatori e Internet
*Copertura: **parziale** (sezioni introduttive + **Sez. 1.6** richiamata in Sicurezza).*

| Sezione | Argomenti trattati | Pag. libro | Pag. PDF | Slide di riferimento |
| :--- | :--- | :---: | :---: | :--- |
| **1.1** (1.1.1–1.1.3) | Che cos'è Internet? Componenti, servizi, protocolli, IETF | 2–8 | 24–30 | Lez. 01, Lez. 02 |
| **1.3.3** | Una rete di reti (ISP, PoP, peering, IXP, gerarchia Tier) | 28–32 | 50–54 | Lez. 01 (s. 35–38) |
| **1.4.4** *(breve)* | Throughput e collegamento collo di bottiglia (*bottleneck link*) | 40–42 | 62–64 | Lez. 01 (s. 17) |
| **1.5** (1.5.1–1.5.2) | Architettura a livelli (TCP/IP, OSI) e incapsulamento | 43–50 | 65–72 | Lez. 02 |
| **1.6** | **Reti sotto attacco** (malware, virus/worm, DoS/DDoS, sniffing, IP spoofing) | 50–53 | 72–75 | **Lez. 25 (s. 4–9)** |
| **1.7** (1.7.1–1.7.5) | Storia delle reti di calcolatori e di Internet | 53–59 | 75–81 | Lez. 01 (s. 7–11) |

- **Da saltare:** `1.2` (pp. 8–19 / PDF 30–41: reti di accesso; opzionale solo una rapida lettura di `1.2.2` pp. 16–18 sui mezzi fisici), `1.3.1–1.3.2` (pp. 19–28 / PDF 41–50: commutazione di pacchetto/circuito in dettaglio), `1.4.1–1.4.3` (pp. 32–40 / PDF 54–62: analisi matematica dettagliata dei ritardi nodali).

---

### Capitolo 2 — Livello di applicazione
*Copertura: **2.1–2.4 completi**; esclusi 2.5, 2.6 e il codice Python di 2.7.*

| Sezione | Argomenti trattati | Pag. libro | Pag. PDF | Slide di riferimento |
| :--- | :--- | :---: | :---: | :--- |
| **2.1** (2.1.1–2.1.6) | Princìpi: architetture C/S e P2P, processi, socket, IP+porta, requisiti e servizi TCP/UDP | 68–80 | 90–102 | Lez. 03 |
| **2.2** (2.2.1–2.2.6) | Web e HTTP: connessioni persistenti/non persistenti, RTT, formato messaggi, metodi, status code, cookie, Web caching/proxy, Conditional GET, HTTP/2 e cenno HTTP/3/QUIC | 80–99 | 102–121 | Lez. 04, Lez. 05 |
| **2.3** (2.3.1–2.3.3) | Posta elettronica: SMTP, formato messaggi, protocolli di accesso (POP3, IMAP, Webmail) | 99–105 | 121–127 | Lez. 06 |
| **2.4** (2.4.1–2.4.3) | DNS: servizi, gerarchia distribuita, query iterative/ricorsive, caching, Resource Record (`A`, `AAAA`, `NS`, `CNAME`, `MX`, `SOA`, `PTR`), formato messaggi | 105–117 | 127–139 | Lez. 07, Lez. 08 |

- **Da saltare / attenzione:**
    - `2.5` (pp. 117–123 / PDF 139–145, *Distribuzione di file P2P / BitTorrent*): **non trattata** nelle slide (BitTorrent compare solo nel syllabus di Lez. 00 e come esempio in Lez. 03 s. 13–14).
    - `2.6` (pp. 123–129 / PDF 145–151, *Streaming video, DASH, CDN*): **esclusa**.
    - `2.7` (pp. 129–139 / PDF 151–161, *Programmazione delle socket*): **NON usare per il codice**, perché il libro usa **Python**, mentre il corso (`Lezioni 09–13` + `esercizi/`) programma in **C con le POSIX/Berkeley Socket**. Utili solo i concetti generali introduttivi a pp. 129–130 *(PDF pp. 151–152)*.

---

### Capitolo 3 — Livello di trasporto
*Copertura: **quasi integrale (3.1–3.7.2 + cenno 3.7.3)** — dopo l'aggiornamento di Lez. 17 e Lez. 19 è il capitolo più completo del corso.*

| Sezione | Argomenti trattati | Pag. libro | Pag. PDF | Slide di riferimento |
| :--- | :--- | :---: | :---: | :--- |
| **3.1** (3.1.1–3.1.2) | Introduzione, relazione tra trasporto e rete, panoramica TCP/UDP | 148–152 | 170–174 | Lez. 14 |
| **3.2** | Multiplexing e demultiplexing (2-tupla UDP, 4-tupla TCP) | 152–159 | 174–181 | Lez. 14 |
| **3.3** (3.3.1–3.3.2) | UDP: struttura dei segmenti e checksum | 159–164 | 181–186 | Lez. 14 |
| **3.4** (3.4.1–3.4.4) | RDT: stop-and-wait (`rdt 1.0–3.0`), pipeline, **Go-Back-N**, **Selective Repeat** | 164–188 | 186–210 | Lez. 15 |
| **3.5.1–3.5.4** | TCP: connessione, struttura segmenti, SEQ/ACK, stima RTT e timeout, RDT, Delayed ACK, Fast Retransmit | 188–206 | 210–228 | Lez. 16 |
| **3.5.5** | Controllo di flusso (`rwnd`, *zero-window probes* a p. 208, *window scaling*) | 206–208 | 228–230 | Lez. 19 |
| **3.5.6** | Gestione della connessione TCP: 3-way handshake, chiusura, `TIME_WAIT`, `RST`, **SYN flood**, **SYN cookies** e **`nmap`** | 208–214 | 230–236 | Lez. 17 *(aggiornata)* |
| **3.6** (3.6.1–3.6.2) | Controllo di congestione: **tutti e 3 gli scenari** (buffer infiniti, finiti, multihop / *congestion collapse*) e approcci end-to-end vs network-assisted | 214–221 | 236–243 | Lez. 19 *(aggiornata)* |
| **3.7.1** | Controllo di congestione TCP classico: `cwnd`, `cwnd/RTT`, Slow Start, `ssthresh`, Congestion Avoidance (AIMD), Fast Recovery, Tahoe, Reno e **CUBIC** | 221–231 | 243–253 | Lez. 19 *(aggiornata)* |
| **3.7.2** | **ECN** (RFC 3168: `ECT`/`CE`, `ECE`/`CWR`) e controllo basato sul ritardo (**TCP Vegas**, **BBR**) | 231–234 | 253–256 | Lez. 19 *(aggiornata)* |
| **3.7.3** *(breve)* | Fairness ed effetto di RTT diversi sullo stesso collo di bottiglia | 234–235 | 256–257 | Lez. 19 (s. 21) |

- **Opzionale:** `3.8` (pp. 236–239 / PDF 258–261: *QUIC*), lettura facoltativa di approfondimento rispetto al cenno su HTTP/3/QUIC in Lez. 04 (s. 33) e Lez. 14 (s. 30, 42).

---

### Capitolo 4 — Livello di rete: il piano dei dati
*Copertura: **4.1–4.3 completi** (con 4.1–4.2 ora aggiornati e approfonditi in Lez. 20); esclusi 4.4 e 4.5.*

| Sezione | Argomenti trattati | Pag. libro | Pag. PDF | Slide di riferimento |
| :--- | :--- | :---: | :---: | :--- |
| **4.1** (4.1.1–4.1.2) | Inoltro vs instradamento, piano dati e piano controllo (distribuito vs SDN centralizzato), servizio best-effort | 252–258 | 274–280 | Lez. 20 *(aggiornata)* |
| **4.2** (4.2.1–4.2.5) | **Interno di un router completo**: porte di ingresso e *longest prefix matching* / *match-plus-action*, 3 *switching fabric* (memoria, bus, crossbar), code e **HOL blocking**, *drop-tail*, dimensionamento buffer (`RTT·C`, `RTT·C/√N`), **Bufferbloat**, scheduling (**FIFO**, **Priority**, **RR**, **WFQ**), **DSCP** e **Net Neutrality** | 258–275 | 280–297 | Lez. 20 *(aggiornata)* |
| **4.3.1** | Formato dei datagrammi IPv4 *(vedi nota sotto sulla frammentazione!)* | 275–278 | 297–300 | Lez. 17 (2024–2025) |
| **4.3.2** | Indirizzamento IPv4: subnetting, subnet mask, classful, CIDR, aggregazione, ottenimento blocco e **DHCP** *(pp. 284–287 / PDF 306–309)* | 278–287 | 300–309 | Lez. 17 (2024–2025), Lez. 18 (2024–2025) |
| **4.3.3** | NAT (Network Address Translation) e blocchi di indirizzi privati | 287–289 | 309–311 | Lez. 18 (2024–2025) |
| **4.3.4** | IPv6: formato datagramma, differenze da IPv4, transizione/tunneling | 289–294 | 311–316 | Lez. 18 (2024–2025) |

- **⚠️ Nota sulla Frammentazione IPv4:** Presente in `Lezione 17 (2024-2025)` (s. 23–25), ma **rimossa in questa 8ª edizione** (a p. 277 il testo rimanda alle edizioni precedenti). Se vuoi studiarla sul libro, la trovi nella 7ª edizione inglese in `libri/Computer Networking a Top-Down Approach 7th Edizione.pdf` (**Sez. 4.3.2, PDF pp. 379–381**).
- **Da saltare:** `4.4` (pp. 294–300 / PDF 316–322: inoltro generalizzato/OpenFlow — il concetto di *match-plus-action* e SDN basta a livello di 4.1.1 e 4.2.1), `4.5` (pp. 300–303 / PDF 322–325: middlebox).

---

### Capitolo 5 — Livello di rete: il piano di controllo
*Copertura: **solo 5.1 e 5.2** (+ breve lettura di supporto 5.6 su ICMP).*

| Sezione | Argomenti trattati | Pag. libro | Pag. PDF | Slide di riferimento |
| :--- | :--- | :---: | :---: | :--- |
| **5.1** | Introduzione al piano di controllo | 309–312 | 331–334 | Lez. 20 (2024–2025) |
| **5.2** (5.2.1–5.2.2) | Algoritmi di instradamento: grafo, **Link-State (Dijkstra)**, **Distance-Vector (Bellman-Ford)**, *Count-to-Infinity*, *Poisoned Reverse*, confronto LS vs DV | 312–325 | 334–347 | Lez. 20 (2024–2025), Lez. 21 |
| **5.6** *(supporto)* | ICMP (`ping` Echo Request/Reply, `Port Unreachable`) | 348–350 | 370–372 | Lez. 18 (2024–2025), Lez. 14, Lez. 26 |

- **Da saltare:** `5.3 OSPF` (pp. 325–329 / PDF 347–351), `5.4 BGP` (pp. 329–338 / PDF 351–360), `5.5 SDN` (pp. 338–347 / PDF 360–369), `5.7 SNMP/NETCONF/YANG` (pp. 350–359 / PDF 372–381).

---

### Capitolo 6 — Livello di collegamento e reti locali
*Copertura: **6.1–6.4.3** (+ 6.7 consigliata come ripasso finale integrato).*

| Sezione | Argomenti trattati | Pag. libro | Pag. PDF | Slide di riferimento |
| :--- | :--- | :---: | :---: | :--- |
| **6.1** (6.1.1–6.1.2) | Introduzione, servizi del livello di collegamento, schede NIC | 366–370 | 388–392 | Lez. 22 (s. 2–9) |
| **6.2** (6.2.1–6.2.3) | Rilevazione/correzione errori: parità 1D/2D, checksum, **CRC** | 370–375 | 392–397 | Lez. 22 (s. 18–26) |
| **6.3.1–6.3.3** | Accesso multiplo: TDMA/FDMA/CDMA, **Slotted ALOHA**, **CSMA**, **CSMA/CD** (backoff esponenziale), Polling e Token-passing | 375–388 | 397–410 | Lez. 23, Lez. 24 (s. 2–4) |
| **6.4.1–6.4.3** | Indirizzi **MAC** e **ARP**, **Ethernet** (struttura frame), **Switch** (self-learning, confronto con router) | 389–407 | 411–429 | Lez. 24 (s. 5–12) |
| **6.7** *(consigliata)* | Retrospettiva: cronaca di una richiesta di una pagina web (riepilogo completo DHCP, DNS, ARP, IP, Ethernet, TCP, HTTP) | 421–426 | 443–448 | Ripasso integrato |

- **Da saltare:** `6.3.4 DOCSIS` (pp. 388–389 / PDF 410–411), `6.4.4 VLAN` (pp. 407–410 / PDF 429–432), `6.5 MPLS` (pp. 410–414 / PDF 432–436), `6.6 Data center` (pp. 414–421 / PDF 436–443).

---

### Capitolo 7 — Wireless and Mobile Networks *(PDF pp. 455–530, in inglese)*
- ❌ **INTERAMENTE ESCLUSO** (non presente in nessuna lezione del corso).

---

### Capitolo 8 — Security in Computer Networks *(in inglese nel PDF)*
*Copertura: **selettiva** (fondamenti, integrità/MAC/CA, autenticazione, TLS/SSL panoramica, Firewall, IDS e DMZ).*

| Sezione | Argomenti trattati | Pag. libro (EN) | Pag. PDF | Slide di riferimento |
| :--- | :--- | :---: | :---: | :--- |
| **8.1** | What Is Network Security? (proprietà di sicurezza; abbinare a **Sez. 1.6**) | 608–610 | 532–534 | Lez. 25 (s. 10), Lez. 26 (s. 2) |
| **8.2** *(solo concetti base)* | Crittografia simmetrica (intro + key exchange) e asimmetrica (intro chiave pubblica/privata) | 610–612, 618–620 | 534–536, 542–544 | Lez. 25 (s. 11–15) *(saltare cifrari storici, DES/AES/CBC pp. 613–618 e matematica RSA pp. 620–624)* |
| **8.3.1–8.3.2** | Cryptographic Hash Functions e **MAC** (`H(m + s)`) | 624–628 | 548–552 | Lez. 25 (s. 17–19) |
| **8.3.3** *(solo parte finale)* | **Public Key Certification** (Certification Authority e certificati) | 632–634 | 556–558 | Lez. 25 (s. 16) *(pp. 628–631 sulle firme digitali opzionali di contesto)* |
| **8.4** | End-Point Authentication (IP spoofing, password, replay/playback attack, **nonce**) | 634–639 | 558–563 | Lez. 26 (s. 3–8) |
| **8.6.1** | Securing TCP Connections: **SSL/TLS — The Big Picture** (handshake, certificato, Master Secret, 4 chiavi, record + MAC + seq) | 644–649 | 568–573 | Lez. 26 (s. 9–13) |
| **8.9** (8.9.1–8.9.2) | **Firewalls** (stateless packet filter, ACL, stateful, application gateway), **IDS/IPS** (signature vs anomaly) e **DMZ** | 667–679 | 591–603 | Lez. 26 (s. 14–24) |

- **Da saltare:** `8.5 Securing E-Mail / PGP` (pp. 639–644 / PDF 563–568), `8.6.2` (pp. 649–651 / PDF 573–575), `8.7 IPsec / VPN` (pp. 651–659 / PDF 575–583), `8.8 Securing Wireless & 4G/5G` (pp. 659–666 / PDF 583–590).

---

### Capitolo 9 — Reti multimediali *(PDF pp. 615–675, in italiano)*
- ❌ **INTERAMENTE ESCLUSO** (non presente in nessuna lezione del corso).

---

## 🗺️ Indice rapido: Slide → Capitoli e Pagine PDF

| Slide del corso | Stato | Sezioni del libro | Pag. PDF |
| :--- | :---: | :--- | :---: |
| `Lezione 00` Introduzione al corso | Aggiornata | Syllabus e struttura corso | — |
| `Lezione 01` Introduction to Computer Networks | Aggiornata | 1.1, 1.3.3, 1.4.4, 1.7 *(+ Tanenbaum)* | 24–30, 50–54, 62–64, 75–81 |
| `Lezione 02` The Internet - Protocols and Layers | Aggiornata | 1.1, 1.5 *(+ Tanenbaum OSI)* | 24–30, 65–72 |
| `Lezione 03` The Application Layer | Aggiornata | 2.1 *(+ FTP da slide)* | 90–102 |
| `Lezione 04` The Application Layer - HTTP | Aggiornata | 2.2.1–2.2.2, 2.2.6 *(+ opz. 3.8 QUIC)* | 102–107, 118–121 |
| `Lezione 05` HTTP Messages and Caching | Aggiornata | 2.2.3–2.2.5 | 107–118 |
| `Lezione 06` SMTP | Aggiornata | 2.3 | 121–127 |
| `Lezione 07` e `Lezione 08` DNS (1–2) | Aggiornate | 2.4 | 127–139 |
| `Lezioni 09–13` Network Programming and Sockets | Aggiornate | Solo intro 2.7 *(codice C da slide + `esercizi/`)* | *(151–152 solo concetti)* |
| `Lezione 14` The Transport Layer | Aggiornata | 3.1, 3.2, 3.3 | 170–186 |
| `Lezione 15` Reliable Data Transfer | Aggiornata | 3.4 | 186–210 |
| `Lezione 16` TCP | Aggiornata | 3.5.1–3.5.4 | 210–228 |
| `Lezione 17` TCP - Connection Management | **Nuova (34 s.)** | 3.5.6 *(+ Two-Army da slide)* | 230–236 |
| `Lezione 19` Flow & Congestion Control | **Nuova (33 s.)** | 3.5.5, 3.6, 3.7.1, 3.7.2 *(+ cenno 3.7.3)* | 228–230, 236–257 |
| `Lezione 20` The Network Layer | **Nuova (40 s.)** | 4.1, 4.2 | 274–297 |
| `Lezione 17 (2024–2025)` Address Management | 2024–2025 | 4.3.1, 4.3.2 *(+ framm. IPv4 7ª ed. PDF 379–381)* | 297–309 |
| `Lezione 18 (2024–2025)` DHCP, LANs, IPv6 | 2024–2025 | 4.3.2 (DHCP), 4.3.3, 4.3.4 *(+ 5.6 ICMP)* | 306–316 *(+ 370–372)* |
| `Lezione 20 (2024–2025)` Control Plane - Routing | 2024–2025 | 5.1, 5.2.2 *(+ Flooding da slide)* | 331–336, 340–347 |
| `Lezione 21` Control Plane - Link-State | 2024–2025 | 5.2.1, confronto LS vs DV | 336–340, 346–347 |
| `Lezione 22` Framing and Error Management | 2024–2025 | 6.1, 6.2 *(+ Framing & Hamming da slide)* | 388–397 |
| `Lezione 23` MAC Sublayer | 2024–2025 | 6.3.1, 6.3.2 (ALOHA, CSMA) | 397–405 |
| `Lezione 24` Random Access, Switches, ARP | 2024–2025 | 6.3.2 (CSMA/CD), 6.3.3, 6.4.1–6.4.3 | 405–410, 411–429 |
| `Lezione 25` Network Security - Fundamentals | 2024–2025 | 1.6, 8.1, 8.2 (base), 8.3.1–8.3.2, 8.3.3 (CA) | 72–75, 532–536, 542–544, 548–552, 556–558 |
| `Lezione 26` Authentication, SSL, Firewalling | 2024–2025 | 8.4, 8.6.1, 8.9 | 558–563, 568–573, 591–603 |

---

## 🧩 Argomenti del corso NON presenti in questo libro (da fare dalle slide)

Le slide integrano Kurose & Ross con materiale da **Stevens** (*Unix Network Programming*) e **Tanenbaum** (*Computer Networks*). Questi contenuti vanno studiati **direttamente dalle slide e dal laboratorio**:

1. **Programmazione Socket in C (`Lezioni 09–13` + `esercizi/`):** API POSIX (`socket`, `bind`, `listen`, `accept`, `connect`, `shutdown`, `sendto`/`recvfrom`, `setsockopt` con `SO_REUSEADDR`, `SO_REUSEPORT`, `SO_RCVTIMEO`, `SO_BROADCAST`, `IP_ADD_MEMBERSHIP`, `fcntl`/`O_NONBLOCK`, `send_all`/`recv_all`, `getaddrinfo`/`gethostbyname`), gestione errori (`ETIMEDOUT`, `ECONNREFUSED`, `ECONNRESET`, `EPIPE`/`SIGPIPE`), server concorrenti (`fork` + `SIGCHLD`, `pthread`, `select`), broadcast e multicast.
2. **Integrazioni teoriche (da Tanenbaum e slide del docente):**

    - **Lez. 01:** Topologie di rete (Bus, Ring, Star, Tree, Mesh, Hybrid), simplex/half-duplex/full-duplex, classificazione PAN/LAN/MAN/WAN, rete GARR.
    - **Lez. 02:** Dettaglio dei 7 livelli ISO/OSI, primitive di servizio, matrice dei 6 tipi di servizio, critica al modello OSI (*due elefanti*).
    - **Lez. 03:** Protocollo **FTP** (connessione controllo porta 21 vs dati porta 20, `vsftpd`).
    - **Lez. 17:** **Problema dei due eserciti** (*Two-Army Problem*), code kernel SYN/accept, diagnosi di `CLOSE_WAIT` con `ss`.
    - **Lez. 19:** **TCP Window Scaling** e *Bandwidth-Delay Product* (in dettaglio numerico).
    - **Lez. 20:** Esempio numerico di **Bufferbloat** e confronto dettagliato RR / WRR / WFQ.
    - **Lez. 17 (2024–2025):** **Frammentazione IPv4** *(oppure nella 7ª ed. inglese a PDF pp. 379–381)*.
    - **Lez. 20 (2024–2025):** **Flooding** (instradamento per inondazione).
    - **Lez. 22:** Metodi di **Framing** (*byte count*, *byte stuffing*, *bit stuffing*, *coding violation*) e **Distanza di Hamming**.

3. **Strumenti pratici e laboratorio:** `Wireshark`/`tshark`, `nc` (netcat), `dig`, `nslookup`, `nmap`, `ss`, `ip`/`ifconfig`, `ping`, `vsftpd`.

---

## 📌 Riepilogo ultra-rapido delle pagine PDF da studiare

| Capitolo | Pagine PDF da leggere | Stato |
| :--- | :--- | :--- |
| **Cap. 1** | `24–30`, `50–54`, `62–64`, `65–81` | Parziale |
| **Cap. 2** | `90–139` *(codice socket C dalle slide 09–13, non 2.7)* | Sezioni 2.1–2.4 |
| **Cap. 3** | `170–257` *(opz. `258–261` su QUIC)* | Quasi completo (3.1–3.7.3) |
| **Cap. 4** | `274–316` *(+ framm. IPv4 da Lez. 17 2024-25 o 7ª ed. PDF `379–381`)* | Sezioni 4.1–4.3 |
| **Cap. 5** | `331–347` *(+ ICMP `370–372`)* | Sezioni 5.1–5.2 (+ 5.6) |
| **Cap. 6** | `388–410`, `411–429` *(+ ripasso finale `443–448`)* | Sezioni 6.1–6.4.3 (+ 6.7) |
| **Cap. 7** | — | **Escluso** |
| **Cap. 8 (EN)** | `532–536`, `542–544`, `548–552`, `556–563`, `568–573`, `591–603` | Selettivo |
| **Cap. 9** | — | **Escluso** |
