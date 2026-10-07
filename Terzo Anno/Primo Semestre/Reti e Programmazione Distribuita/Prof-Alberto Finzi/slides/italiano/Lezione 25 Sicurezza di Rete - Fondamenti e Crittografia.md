---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezione 25: Sicurezza delle Reti di Calcolatori — Fondamenti e Crittografia

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Introduzione alla Sicurezza di Rete

- Internet è stata storicamente concepita (negli anni '70 e '80 come ARPANET) per connettere gruppi di ricercatori accademici e governativi che operavano in un **ambiente di totale fiducia reciproca**.
- Di conseguenza, l'architettura originaria della suite di protocolli TCP/IP **non integrava alcun meccanismo nativo di sicurezza**:
  - I datagrammi IP non autenticano l'indirizzo mittente (aperti allo spoofing).
  - Le password e i messaggi applicativi (come in HTTP, Telnet, FTP) transitavano sul cavo in chiaro.
- Oggi Internet connette miliardi di dispositivi eterogenei per scambi economici, bancari, sanitari e militari critici: la sicurezza è diventata un requisito imprescindibile.

---

## Le Principali Minacce e Tipologie di Attacco

1. **Malware e Botnet**:
   - Software ostile che infetta i calcolatori tramite download, allegati email o exploit di rete.
   - **Virus**: richiede l'interazione umana per diffondersi (es. esecuzione di un file).
   - **Worm**: malware auto-replicante autonomo che scansiona la rete e infetta altri host senza alcun intervento umano.
   - **Botnet**: esercito di computer infetti ("zombie") controllati da remoto da un attaccante (*Command & Control*).
2. **Denial-of-Service (DoS e DDoS)**:
   - Attacchi volti a rendere indisponibile un server o un servizio saturandone la banda o esaurendone le risorse computazionali (es. *SYN Flood*, saturazione DNS).
3. **Packet Sniffing**:
   - Intercettazione passiva dei frame sul cavo o nell'aria mediante schede in modalità promiscua (es. Wireshark).
4. **IP Spoofing**:
   - Falsificazione dell'indirizzo IP mittente per scavalcare filtri o impersonare macchine autorizzate.

---

## I Quattro Pilastri Fondamentali della Sicurezza Informatica

Una comunicazione di rete sicura tra due soggetti legittimi (tradizionalmente Alice e Bob) deve garantire quattro proprietà essenziali:

1. **Confidenzialità (*Confidentiality*)**:
   - Solo il mittente autorizzato e il destinatario legittimo devono poter comprendere il contenuto dei messaggi scambiati. Un intruso intercettatore (*Eavesdropper*) deve poter leggere solo testo incomprensibile.
2. **Integrità del Messaggio (*Message Integrity*)**:
   - Il destinatario deve poter verificare con certezza che i dati ricevuti non siano stati alterati, manomessi o troncati lungo il percorso.
3. **Autenticazione degli Endpoint (*End-point Authentication*)**:
   - Ciascuna delle parti deve poter accertare oltre ogni dubbio la reale identità dell'altra parte (*"Sto parlando veramente con la mia banca?"*).
4. **Non Ripudio (*Non-repudiation*)**:
   - Il mittente non può successivamente negare di aver generato e inviato il messaggio (garantito mediante firme digitali).

---

## I Meccanismi Crittografici: Nozioni Base

La crittografia è lo strumento matematico fondamentale per mascherare i dati:

```
 [ Testo in Chiaro: m ] ---> [ Algoritmo di Cifratura: E ] ---> [ Testo Cifrato: c ]
                                         ^
                                         | Chiave di Cifratura: K_A
                                         
 [ Testo Cifrato: c ]   ---> [ Algoritmo di Decifratura: D ] ---> [ Testo in Chiaro: m ]
                                         ^
                                         | Chiave di Decifratura: K_B
```

- **Principio di Kerckhoffs (Fondamento della Sicurezza Moderna)**:
  - Gli algoritmi crittografici ($E$ e $D$) devono essere **completamente pubblici e noti a tutti**.
  - Tutta la sicurezza del sistema deve risiedere **esclusivamente nella segretezza della chiave numerica utilizzata ($K$)**, non nel presunto segreto dell'algoritmo (*Security through Obscurity* non funziona!).

---

## Crittografia a Chiave Simmetrica (*Symmetric Key Cryptography*)

Nella crittografia simmetrica, mittente e destinatario condividono **la stessa identica chiave segreta ($K$)**:
$$c = E_K(m) \qquad \text{e} \qquad m = D_K(c)$$

- **Tipologie di Cifrari Simmetrici**:
  - **Cifrari a Blocchi (*Block Ciphers*)**: il testo viene diviso in blocchi di dimensione fissa (es. 128 bit) e cifrato blocco per blocco (standard **AES - Advanced Encryption Standard**, DES, 3DES).
  - **Cifrari a Flusso (*Stream Ciphers*)**: i byte vengono cifrati progressivamente combinandosi con una sequenza pseudocasuale (es. ChaCha20, RC4).
- **Pregi**: estremamente veloce e leggero da elaborare in hardware e software.
- **Il Limite Critico: il Problema della Distribuzione delle Chiavi**:
  - Come fanno due calcolatori lontani migliaia di chilometri su Internet a concordare la chiave segreta $K$ senza che un intruso possa intercettarla?

---

## Crittografia a Chiave Pubblica (*Asymmetric Cryptography*)

Introdotta da Diffie ed Hellman nel 1976 e resa operativa dall'algoritmo **RSA** (Rivest, Shamir, Adleman):
- Ogni entità possiede una **coppia complementare di chiavi matematiche**:
  1. **Chiave Pubblica ($K^+$)**: distribuita pubblicamente a chiunque nel mondo.
  2. **Chiave Privata ($K^-$)**: custodita gelosamente in segreto dal proprietario.

```
 Alice (Mittente)                                          Bob (Ricevitore)
       |                                                         |
       |-- 1. Alice cifra con la Chiave Pubblica di Bob (K_B+) ->|
       |      c = E_{K_B+}(m)                                    |
       |                                                         |-- 2. Bob decifra con la sua
       |                                                         |      Chiave Privata (K_B-)!
       |                                                         |      m = D_{K_B-}(c)
```

- **Proprietà Straordinaria**: qualsiasi intruso che intercetti $c$ e conosca la chiave pubblica $K_B^+$ non è in grado di decifrare il messaggio, perché solo la chiave privata $K_B^-$ può invertire la trasformazione!
- **Svantaggio**: computazionalmente molto più lenta (da 100 a 1000 volte) rispetto a AES.

---

## Il Problema del Man-in-the-Middle e i Certificati Digitali

Nella crittografia asimmetrica esiste una vulnerabilità critica: l'attacco **Man-in-the-Middle (MitM)**:
- Se Alice chiede a Bob la sua chiave pubblica, un intruso intermedio Trudy può intercettare la richiesta e inviare ad Alice la **propria chiave pubblica** spacciandosi per Bob!
- Alice cifrerà con la chiave di Trudy: Trudy decifra, legge i dati e ri-cifra con la vera chiave di Bob.

### La Soluzione: Certification Authorities (CA) e Standard X.509
- Per certificare che una chiave pubblica appartenga realmente a un'entità, si utilizzano le **Autorità di Certificazione (*CA - Certification Authorities*)**:
  - La CA emette un **Certificato Digitale** contenente il nome di dominio (es. `google.com`), la sua chiave pubblica e una **firma digitale autentica della CA**.
  - I browser hanno le chiavi pubbliche delle principali CA pre-installate nel sistema e possono convalidare istantaneamente l'autenticità dei server web.

---

## Integrità dei Dati e Funzioni Hash Crittografiche

Per verificare che un file o messaggio non sia stato alterato, si utilizzano le **Funzioni Hash Crittografiche** ($H(m)$):
- Trasformano un messaggio $m$ di lunghezza arbitraria in una stringa di bit a lunghezza fissa (es. 256 bit per **SHA-256**, 128 bit per MD5).

### Proprietà Fondamentali di una Funzione Hash Sicura:
1. **Unidirezionalità (*One-Way Pre-image Resistance*)**: dato un digest hash $h$, è computazionalmente impossibile risalire al messaggio originale $m$ tale che $H(m) = h$.
2. **Resistenza alle Collisioni (*Collision Resistance*)**: è computazionalmente impossibile trovare due messaggi distinti $x \ne y$ tali che $H(x) = H(y)$.

---

## Message Authentication Code (MAC)

Un hash calcolato semplicemente sui dati ($H(m)$) **non protegge da un attaccante attivo**:
- Se Trudy intercetta $m$, può modificarlo in $m'$, ricalcolare $H(m')$ e inoltrarlo a Bob! Bob vedrebbe l'hash coincidente e accetterebbe il messaggio contraffatto.

### La Soluzione: Integrazione di un Segreto Condiviso (MAC)
Per garantire autenticità e integrità contemporaneamente:
1. Alice e Bob condividono preventivamente una stringa segreta comune $s$ (*Shared Secret*).
2. Alice concatena il segreto ai dati e calcola l'hash:
   $$\mathbf{MAC} = \mathbf{H(m + s)}$$
3. Alice trasmette la coppia $\langle m,\ \text{MAC} \rangle$ a Bob.
4. Bob riceve $m$, concatena il proprio segreto $s$ e ricalcola $H(m + s)$. Se il risultato coincide con il MAC ricevuto, ha la certezza matematica che il messaggio è autentico e non manomesso!
- Trudy non conoscendo il segreto $s$ non può falsificare il MAC.
