---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezione 00: Introduzione al Corso

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II  
Email: `alberto.finzi@unina.it`

---

## Panoramica del Corso

- **Insegnamento**: Reti e Programmazione Distribuita (*Networks and Distributed Programming*)
- **CFU**: 9
- **Modalità**: Lezioni frontali ed esempi pratici in aula (in italiano)
- **Codice Team**: `rpmzm7k` (la maggior parte delle comunicazioni avverrà su Teams)
- **Modalità d'Esame**:
  - Prova scritta e colloquio orale
  - Date secondo il calendario ufficiale degli esami
- **Libri di Testo Consigliati**:
  - J. Kurose, K. Ross, *Computer Networking: A Top-Down Approach* [Riferimento Principale]
  - A. Tanenbaum, D. Wetherall, *Computer Networks*
  - W. R. Stevens, *Unix Network Programming*
- **Materiale Integrativo**: Slide fornite dal docente (in inglese)

---

## Contatti e Ricevimento

- **Docente**: Prof. Alberto Finzi
- **Dipartimento**: Ingegneria Elettrica e Tecnologie dell'Informazione (DIETI)
- **E-mail / Teams**: `alberto.finzi@unina.it`
- **Sito Docente UNINA**: `https://www.docenti.unina.it/alberto.finzi`
- **Sede di lavoro**:
  - Via Claudio 21, Edificio 1
  - Via Claudio 21, Edificio 5/A (Laboratorio PRISMA)
- **Ricevimento studenti**:
  - Martedì 14:30 – 16:30 (Via Claudio 21, Edificio 1 o via Teams)
  - Su appuntamento via Teams

---

## Orario delle Lezioni

| Giorno | Orario | Aula |
| :--- | :--- | :--- |
| **Martedì** | 12:30 – 14:30 | Via Claudio 21, aula `CL-I-1` |
| **Giovedì** | 14:30 – 16:30 | Via Claudio 21, aula `CL-I-3` |
| **Venerdì** | 14:30 – 16:30 | Via Claudio 21, aula `CL-T-2` |

- **Ricevimento**:
  - Martedì 14:30 – 16:30 (Edificio 1 / Teams)
  - Su appuntamento via Teams

---

## Motivazioni: Perché Studiare le Reti?

- **Viviamo in un mondo interconnesso**:
  - Oltre **6.12 miliardi di persone** utilizzano Internet (73.8% della popolazione mondiale, pur con circa 2.2 miliardi ancora offline) [GWI/DataReportal 2026]
  - L'utente medio trascorre più di **6 ore e mezza al giorno online** [GWI/DataReportal 2025]
- **La maggior parte del software moderno è software di rete**:
  - Web, Cloud computing, Streaming video/audio, Messaggistica, Giochi online, Servizi di IA, Internet of Things (IoT), ecc.
- **Tecnologie dell'Informazione e della Comunicazione (ICT)**:
  - La *comunicazione* è un componente fondamentale dell'informatica moderna.

---

## Obiettivi Formativi

- Introdurre gli elementi fondamentali su cui si basano le **reti di calcolatori** (*Computer Networks*) e **Internet**.
- Fornire concetti e strumenti di base per comprendere, analizzare, progettare e sviluppare reti di calcolatori e applicazioni di rete.
- Comprendere i **protocolli di rete** (*Network Protocols*), con conoscenze sull'infrastruttura e sui dispositivi di rete (*router, switch*).
- Fornire competenze per progettare e sviluppare **applicazioni di rete concorrenti e distribuite** (*Concurrent & Distributed Applications*).
- Comprendere le potenzialità, i limiti, i rischi e le problematiche di **sicurezza delle reti** (*Network Security*).

---

## Prospettiva del Corso

Il corso integra **due prospettive complementari**:

1. **Reti di Calcolatori (*Computer Networking*)**:
   - Come comunicano i computer: protocolli, architetture a livelli, servizi di rete.
2. **Programmazione Concorrente e Distribuita (*Concurrent & Distributed Programming*)**:
   - Come realizzare software che comunica: processi, thread, *socket*, server concorrenti.

> **Obiettivo Globale**: Comprendere sia l'**infrastruttura di comunicazione** sia il **software** che la utilizza.

---

## Programma del Corso: Reti di Calcolatori

- **Introduzione**: obiettivi, storia di Internet, concetti cardine, topologie e tipologie di reti, servizi.
- **Modelli a Livelli**: modello di riferimento ISO/OSI e architettura TCP/IP.
- **Livello di Applicazione (*Application Layer*)**: architetture client-server e peer-to-peer (P2P), protocolli FTP, SSH, struttura URL, HTTP, protocolli email (SMTP, IMAP, POP3), DNS, BitTorrent.
- **Livello di Trasporto (*Transport Layer*)**: UDP e TCP, affidabilità (*Reliable Data Transfer - RDT*), controllo di flusso e congestione.
- **Livello di Rete (*Network Layer*)**: indirizzamento e inoltro (*forwarding*), router, IPv4 e IPv6, DHCP, NAT, instradamento (*routing*).
- **Livello di Accesso / Collegamento (*Data Link + Physical Layer*)**: interfacce di rete, controllo parità e CRC, collisioni (CSMA/CD), ARP, basi di Ethernet.
- **Sicurezza di Rete (*Network Security*)**: attacchi alle reti, crittografia, integrità del messaggio, sicurezza operativa.

---

## Programma del Corso: Programmazione Distribuita

- **Programmazione Concorrente (*Concurrent Programming*)**:
  - Processi e thread
  - Modelli di concorrenza
  - Meccanismi di comunicazione e sincronizzazione
  - Coordinamento di attività concorrenti
- **Programmazione Distribuita (*Distributed Programming*)**:
  - Programmazione di rete con le **Socket** e relative API
  - Protocolli di trasporto UDP e TCP lato applicativo
- **Server Concorrenti (*Concurrent Servers*)**:
  - Progettazione e implementazione di server in grado di gestire client multipli
- **Applicazioni Distribuite (*Distributed Applications*)**:
  - Comunicazione e scambio dati tra servizi di rete
