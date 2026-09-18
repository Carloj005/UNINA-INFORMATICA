# Domande con Risposte di Sistemi Operativi (ATTENZIONE SONO POCHE LE DOMANDE QUINDI STUDIATE PERCHÈ NON SONO TUTTE LE POSSIBILI)

**1. Scheduling HDD e importanza del "tocco" all'esterno negli algoritmi Circular**
Negli algoritmi di scheduling del disco come il C-SCAN (Circular SCAN), la testina si muove in una sola direzione servendo le richieste. Quando arriva all'estremo del disco ("tocco all'esterno"), ritorna immediatamente all'inizio senza servire alcuna richiesta durante il viaggio di ritorno. Il "tocco" fino all'ultimo cilindro è fondamentale perché garantisce un tempo di attesa molto più uniforme per tutte le richieste, trattando i cilindri come una lista circolare ed evitando che le tracce centrali vengano servite molto più spesso rispetto a quelle periferiche.

**2. Utilità della TLB, cosa succede senza quest'ultima**
La TLB (Translation Lookaside Buffer) è una cache associativa ad altissima velocità integrata nella MMU che memorizza le traduzioni più recenti degli indirizzi (da pagina logica a frame fisico). 
Senza la TLB, per ogni accesso in memoria da parte della CPU sarebbero necessari **due accessi alla memoria centrale**: il primo per leggere la Tabella delle Pagine (per trovare il frame) e il secondo per accedere al dato reale. Questo dimezzerebbe di fatto le prestazioni del sistema.

**3. Utilità della tabella delle pagine**
La tabella delle pagine è la struttura dati fondamentale per la memoria virtuale e la paginazione. Serve a mappare i numeri di pagina logica (generati dalla CPU) nei corrispondenti numeri di frame fisici (in RAM). Permette a un processo di avere uno spazio di indirizzamento contiguo dal suo punto di vista, anche se fisicamente i suoi dati sono frammentati e sparsi nella memoria RAM.

**4. Struttura della memoria (layout)**
Il layout dello spazio di indirizzamento di un processo in memoria è generalmente diviso in segmenti:
* **Testo (Code):** Il codice binario eseguibile.
* **Dati (Data):** Variabili globali e statiche inizializzate.
* **BSS:** Variabili globali e statiche non inizializzate (impostate a zero).
* **Heap:** Memoria allocata dinamicamente a runtime (es. con `malloc` in C). Cresce verso l'alto.
* **Stack:** Utilizzato per chiamate a funzione, parametri e variabili locali. Cresce verso il basso (verso l'Heap).

**5. Cosa accade in caso di sovrapposizione di stack e heap**
Se l'heap e lo stack crescono al punto da collidere, si verifica un esaurimento della memoria disponibile per il processo. Il sistema operativo, tramite la MMU, rileverà un accesso a un indirizzo di memoria non valido o violazione dei limiti, generando un'eccezione (tipicamente un *Segmentation Fault* o un *Out of Memory error*) e procederà alla terminazione forzata del processo per proteggere il resto del sistema.

**6. Compare and swap, a cosa serve?**
La `Compare and Swap` (CAS) è un'istruzione hardware atomica (non interrompibile). Controlla se il valore in una locazione di memoria è uguale a un valore atteso; se lo è, lo sostituisce con un nuovo valore, altrimenti non fa nulla. Serve come blocco fondamentale per implementare meccanismi di sincronizzazione di alto livello (come gli spinlock e i semafori) e algoritmi *lock-free* in ambienti concorrenti, garantendo la mutua esclusione.

**7. Svantaggio della prelazione**
La prelazione (preemption) comporta un *overhead* prestazionale. Ogni volta che un processo viene prelazionato, il sistema operativo deve eseguire un *Context Switch*: salvare lo stato dei registri (PCB), invalidare e ripopolare la cache (inclusa la TLB) e caricare lo stato del nuovo processo. Inoltre, nei sistemi prelazionabili è obbligatorio l'uso rigoroso di meccanismi di sincronizzazione complessi, poiché un processo può essere interrotto nel mezzo di una sezione critica.

**8. Perché conviene il paging?**
La paginazione (paging) elimina il problema della frammentazione esterna, in quanto ogni frame libero in memoria può essere assegnato a qualsiasi processo ne abbia bisogno, senza necessità che la memoria fisica sia contigua. Inoltre, separa la memoria logica da quella fisica, rendendo possibile implementare la *Memoria Virtuale* (Demand Paging), consentendo di eseguire programmi che sono più grandi della memoria RAM fisicamente disponibile.

**9. Gestione del page fault**
Un page fault avviene quando un processo tenta di accedere a una pagina valida che al momento risiede su disco e non in RAM. 
Fasi: 1) Trap al sistema operativo; 2) Il SO verifica se l'accesso è valido; 3) Cerca un frame libero in RAM (se non c'è, usa un algoritmo di rimpiazzo); 4) Avvia un'operazione di I/O per leggere la pagina dal disco e metterla nel frame; 5) Aggiorna la tabella delle pagine (impostando il bit di validità); 6) Riavvia l'istruzione che ha causato il fault.

**10. Layout delle pagine**
L'indirizzo logico generato dalla CPU in un sistema di paginazione è diviso in due parti:
* **Numero di pagina ($p$):** Utilizzato come indice per cercare nella tabella delle pagine l'indirizzo base del frame.
* **Offset di pagina ($d$):** Lo scostamento all'interno della pagina. Rimane inalterato e viene concatenato all'indirizzo del frame fisico per formare l'indirizzo fisico finale.

**11. Uso del bit di validità**
In ogni riga (entry) della tabella delle pagine, il bit di validità/invalidità indica se la pagina corrispondente è attualmente caricata in memoria centrale (RAM). Se è "valido", l'accesso è consentito. Se è "invalido", la pagina non è in memoria (si trova nello swap su disco) oppure l'indirizzo è illegale; un accesso a questa pagina scatena un *page fault*.

**12. NUMA (architettura)**
NUMA (*Non-Uniform Memory Access*) è un'architettura per sistemi multiprocessore. La memoria RAM è divisa e assegnata a specifici processori (nodi). Un processore può accedere alla memoria locale molto più velocemente rispetto a quanto impiega ad accedere alla memoria remota (la memoria collegata agli altri processori del sistema).

**13. Soft and hard affinity**
L'affinità del processore definisce la tendenza di un processo a rimanere in esecuzione sulla stessa CPU per sfruttare i dati rimasti nella cache L1/L2.
* **Soft Affinity:** Il SO tenta di mantenere il processo sulla stessa CPU, ma non lo garantisce (può spostarlo per bilanciare il carico).
* **Hard Affinity:** Il processo è esplicitamente vincolato (es. tramite *sched_setaffinity* in Linux) a eseguire solo su uno o più core specifici e il SO non può migrarlo altrove.

**14. SRTF vs RR differenza**
* **SRTF (Shortest Remaining Time First):** È la versione prelazionabile del SJF. Sceglie il processo con il tempo residuo di esecuzione più breve. Ottimizza il tempo medio di attesa, ma rischia di causare *starvation* per i processi lunghi.
* **RR (Round Robin):** Assegna a ogni processo una piccola quantità di tempo (quanto o *time slice*). Scaduto il tempo, il processo viene messo in fondo alla coda. È equo (nessuna starvation) ed eccellente per i sistemi interattivi.

**15. Significato di starvation**
La *starvation* (attesa indefinita o inedia) è la situazione in cui un processo pronto per l'esecuzione attende per un tempo indefinito l'assegnazione della CPU (o di altre risorse) perché i meccanismi di scheduling continuano a preferire e assegnare le risorse ad altri processi (ad esempio, a priorità più alta).

**16. User e kernel thread**
* **User Thread:** Gestiti interamente nello spazio utente da una libreria, senza l'intervento del SO. Sono molto veloci da creare e gestire, ma se uno di questi thread si blocca (es. per una system call I/O), il SO blocca l'intero processo (compresi gli altri thread associati).
* **Kernel Thread:** Creati e gestiti direttamente dal SO. Più pesanti da creare per via del context switch in kernel mode, ma permettono vero parallelismo: se un thread si blocca, il kernel può schedulare un altro thread dello stesso processo.

**17. Come il sistema operativo percepisce i thread?**
Dipende dal modello di threading. Se si usano solo *User Threads* (modello molti-a-uno), il SO vede un solo processo monolitico e non ha consapevolezza dei thread al suo interno. Se si usano *Kernel Threads* (modello uno-a-uno o molti-a-molti), il SO percepisce i thread come unità schedulabili distinte (spesso chiamate *Lightweight Processes* in sistemi come Linux, dove processo e thread sono concettualmente simili per lo scheduler).

**18. Bit di modifica**
Il bit di modifica (o *Dirty Bit*) si trova nella tabella delle pagine. Viene settato dall'hardware quando la CPU scrive (modifica) una pagina in memoria. Durante la sostituzione delle pagine, se il dirty bit è impostato, il SO sa che la pagina deve essere prima riscritta su disco (aggiornando la copia nello swap). Se non è settato, significa che la pagina è rimasta in sola lettura, e può essere sovrascritta immediatamente senza fare I/O, risparmiando tempo.

**19. Inversione di priorità**
È un problema di scheduling in cui un processo a priorità alta rimane in attesa di una risorsa (es. un semaforo) detenuta da un processo a priorità bassa, il quale viene però prelazionato da un processo a priorità media. Di fatto, il processo a priorità media ritarda indirettamente quello a priorità alta. Si risolve con il protocollo di **Ereditarietà della priorità** (*Priority Inheritance*).

**20. Variabile di condizione**
È uno strumento di sincronizzazione (usato spesso all'interno dei Monitor) che permette a un thread di sospendere la propria esecuzione finché una determinata condizione logica non si verifica. Fornisce operazioni di `Wait` (il thread si blocca e rilascia il lock) e `Signal` (un altro thread segnala che la condizione si è verificata, risvegliando il thread in attesa).

**21. Funzionamento dello spinlock**
Lo spinlock è un tipo di lock (blocco) basato sull'attesa attiva (*busy waiting*). Se un thread tenta di acquisire un lock già occupato, entra in un ciclo infinito (utilizzando istruzioni atomiche come CAS) verificando in continuazione se il lock si è liberato. Consuma cicli di CPU, ma è utile su sistemi multiprocessore se si prevede che il lock venga rilasciato in tempi brevissimi, evitando così il costoso overhead di un context switch.

**22. Signal and continue / signal and wait**
Riguardano la semantica dei Monitor quando un thread fa una `Signal` su una variabile di condizione:
* **Signal and Continue (Mesa):** Il thread che lancia la signal continua la sua esecuzione. Il thread risvegliato viene messo nella coda dei processi pronti e prenderà possesso del monitor in seguito.
* **Signal and Wait (Hoare):** Il thread che lancia la signal cede immediatamente il controllo del monitor al thread risvegliato e si mette in attesa che quest'ultimo finisca o esca dal monitor.

**23. Monitoring dei frame utilizzati durante la sostituzione nelle pagine**
L'algoritmo perfetto (LRU - *Least Recently Used*) richiederebbe di aggiornare un registro per ogni singolo accesso in memoria, comportando un overhead hardware enorme. Pertanto, il monitoraggio si fa per approssimazione usando un **Bit di Riferimento**. Questo bit viene impostato a 1 dall'hardware ogni volta che la pagina viene letta/scritta. Algoritmi come la "Seconda Scelta" (Clock) scansionano in modo circolare questi bit azzerandoli: se un bit è 0, la pagina non è stata usata di recente e viene sostituita.

**24. Pure demand paging**
La *paginazione su richiesta pura* è l'estremo del demand paging: un processo viene avviato con **nessuna pagina in memoria fisica** (zero frame allocati). La prima istruzione causerà immediatamente un page fault, costringendo il SO a caricare la prima pagina dal disco. Le pagine vengono caricate *solo ed esclusivamente* nel momento in cui vengono effettivamente richiamate dalla CPU.

**25. Come è servita una interruzione**
1. Un dispositivo hardware invia un segnale sulla linea di interrupt.
2. La CPU completa l'istruzione corrente e salva l'indirizzo di ritorno (Program Counter) e lo stato dei registri sullo stack.
3. In base all'ID dell'interruzione, la CPU consulta il *Vettore delle Interruzioni* per trovare l'indirizzo della ISR (Interrupt Service Routine).
4. Esegue l'ISR (il driver o la routine del kernel associata).
5. Esegue un'istruzione speciale (es. `IRET`) che ripristina lo stato salvato e restituisce il controllo al programma interrotto.

**26. Architettura monolitica**
Un SO monolitico inserisce tutte le funzionalità core (gestione della memoria, file system, I/O, driver di periferica, scheduling) all'interno di un unico grande spazio di indirizzamento in kernel-mode (il kernel). Vantaggio: altissime prestazioni poiché i componenti comunicano direttamente. Svantaggio: scarsa affidabilità, perché un errore in un singolo driver può far crashare l'intero sistema operativo.

**27. Come la memoria segregata comunica con il resto**
Poiché i processi hanno spazi di indirizzamento separati e isolati (memoria segregata per sicurezza), non possono leggere/scrivere direttamente l'uno nella memoria dell'altro. Per comunicare si appoggiano all'**IPC** (*Inter-Process Communication*) fornita dal kernel, che include: memorie condivise (*Shared Memory* mappate dalla MMU), passaggio di messaggi (*Message Passing*, Pipe, Socket) o segnali.

**28. Fasi di boot e tipi di disco (domanda da 30)**
**Fasi del Boot:**
1. **Accensione/Firmware:** Il BIOS/UEFI esegue il POST (Power-On Self Test) per controllare l'hardware.
2. **Boot sector:** Il firmware cerca il dispositivo di avvio, legge il primo settore (MBR o tabella GPT) ed esegue il codice trovato (First-stage bootloader).
3. **Bootloader:** Viene caricato il bootloader completo (es. GRUB), che sa come leggere il file system.
4. **Caricamento del Kernel:** Il bootloader carica l'immagine del Kernel in RAM e gli passa il controllo.
5. **Inizializzazione del SO:** Il kernel inizializza le strutture dati, i driver, monta il file system root (`/`) e lancia il primo processo utente (es. `init` o `systemd`), che avvia gli altri servizi.

**Tipi di disco:**
* **HDD (Hard Disk Drive):** Dischi magnetici a rotazione meccanica con testine di lettura/scrittura mobili. Elevata latenza (seek time) ma economici per grandi archiviazione.
* **SSD (Solid State Drive):** Basati su memorie flash NAND, senza parti meccaniche. Accesso istantaneo e transfer rate elevatissimo.
* **NVM/NVMe:** Protocolli e dischi basati su PCIe, progettati per massimizzare il parallelismo delle memorie flash moderne eliminando i colli di bottiglia dei controller SATA.

**29. Condizioni necessarie per un deadlock**
Affinché si verifichi uno stallo mortale (deadlock), devono verificarsi **simultaneamente** le 4 condizioni di Coffman:
1. **Mutua Esclusione:** Le risorse non possono essere condivise (solo un processo alla volta può usare una risorsa).
2. **Hold and Wait (Possesso e attesa):** Un processo possiede almeno una risorsa ed è in attesa di acquisirne altre attualmente detenute da altri.
3. **No Preemption (Nessuna prelazione):** Le risorse non possono essere forzatamente sottratte al processo che le detiene; devono essere rilasciate volontariamente.
4. **Attesa Circolare:** Esiste un ciclo chiuso di processi dove $P_0$ attende $P_1$, $P_1$ attende $P_2$, ..., e $P_n$ attende $P_0$.

**30. Definizione dei seek time**
Il *seek time* (tempo di ricerca) in un disco rigido (HDD) è il tempo impiegato dal braccio meccanico per spostare la testina di lettura/scrittura dalla traccia attuale al cilindro in cui è posizionato il settore desiderato. È la componente preponderante del tempo di latenza di un disco magnetico.

**31. Perché le pagine di grandi dimensioni provocano maggiore overhead?**
Da un lato le pagine grandi riducono l'overhead della tabella delle pagine e i miss nella TLB, ma dall'altro **aumentano drammaticamente la frammentazione interna**: se un processo ha bisogno di pochi KB di memoria e la dimensione della pagina è di 2MB o 1GB, l'intero resto della pagina viene sprecato. Inoltre, se il SO deve eseguire operazioni di swapping su disco (page-in/page-out) e un solo byte cambia, deve scrivere in memoria di massa decine o centinaia di megabyte (overhead di I/O).

**32. Binding indirizzo logico ed ottenimento dell'indirizzo fisico**
Il binding associa i riferimenti simbolici del codice agli indirizzi di memoria reali. Può avvenire a tempo di compilazione (codice assoluto), di caricamento (codice rilocabile) o di esecuzione (binding dinamico). Nei SO moderni si usa il binding a **tempo di esecuzione**: la CPU genera un indirizzo logico. La MMU (hardware) lo intercetta al volo e lo somma al *Registro Base* (in allocazione contigua) oppure interroga la *Tabella delle Pagine* per ottenere il numero di frame, formando l'indirizzo fisico reale inviato al bus della memoria.

**33. Frammentazione interna ed esterna differenze**
* **Frammentazione Interna:** Memoria allocata a un processo ma non utilizzata. Avviene quando l'unità di allocazione (es. la pagina o un blocco fisso) è più grande di ciò che il processo ha richiesto. Lo spazio in eccesso "dentro" il blocco è perso.
* **Frammentazione Esterna:** Avviene con l'allocazione dinamica di dimensioni variabili (o contigua). Nello spazio di memoria ci sono vari "buchi" liberi che nel totale sommano a sufficienza per soddisfare una nuova richiesta, ma poiché non sono adiacenti (contigui), la richiesta viene respinta.

**34. Allocazione contigua e le sue problematiche**
L'allocazione contigua prevede che ogni processo occupi un singolo blocco di celle di memoria consecutive. 
**Problematiche:** Soffre gravemente di *frammentazione esterna*. Diventa difficile trovare un "buco" abbastanza grande per caricare nuovi processi, costringendo il SO a fare "compattazione" della memoria (molto lenta e costosa in termini di tempo di CPU). Inoltre è rigida, rendendo complesso far crescere dinamicamente lo spazio (es. l'heap) di un processo in esecuzione se non ha spazio adiacente libero.

**35. Problema della frammentazione interna nello specifico**
È il difetto congenito della **Paginazione**. Poiché la memoria RAM è divisa in frame di dimensione fissa (es. 4 KB), un processo riceve memoria sempre in multipli interi della dimensione della pagina. Se un processo richiede 9 KB di memoria, il SO deve dargli 3 pagine (12 KB in totale). Gli ultimi 3 KB della terza pagina sono allocati al processo ma inutilizzati, e non potranno mai essere dati a un altro processo. Se ci sono migliaia di processi, la somma dei frammenti finali può portare a un notevole spreco di RAM.

**36. Strutture dati utilizzate nel kernel file system e definizione di quest'ultimo**
Il *File System* è l'astrazione logica creata dal SO per memorizzare, recuperare, gestire e nominare informazioni in modo persistente sui dispositivi di memoria di massa.
Strutture dati in memoria centrale (nel Kernel):
* **Tabella di montaggio (Mount Table):** Traccia i file system attualmente attivi nel sistema.
* **Directory Structure Cache:** Mantiene in RAM i percorsi e le directory usate di recente per accelerare la ricerca.
* **System-wide open-file table:** Una tabella globale che contiene una copia del FCB (File Control Block / inode) e info su ogni file attualmente aperto da qualsiasi processo.
* **Per-process open-file table:** Tabella per ogni singolo processo (i "File Descriptor") che punta alle voci della system-wide table.

**37. Memorizzazione dei file su disco e (continua, indicizzata, concatenata)**
Sono i metodi in cui il SO alloca i blocchi su disco ai file:
* **Allocazione Contigua:** Il file occupa una sequenza ininterrotta di blocchi sul disco. *Pro:* Lette/scritture sequenziali e dirette velocissime. *Contro:* Frammentazione esterna, difficile prevedere quanto far crescere un file.
* **Allocazione Concatenata (Linked):** Ogni file è una lista concatenata di blocchi sparsi nel disco; ogni blocco contiene un puntatore al successivo. *Pro:* Nessuna frammentazione esterna, facile far crescere il file. *Contro:* Accesso diretto pessimo (bisogna leggere i blocchi uno a uno), overhead di memoria per i puntatori, scarsa affidabilità.
* **Allocazione Indicizzata:** Tutti i puntatori ai blocchi di un file vengono riuniti in un solo blocco speciale (blocco indice o *inode*). *Pro:* Ottimo per l'accesso diretto, nessuna frammentazione esterna. *Contro:* Overhead per mantenere in memoria il blocco indice, complicato per file immensi (richiede indici a più livelli).

**38. Differenza tra System Call e normale chiamata a funzione (e Dual Mode)**
Una system call è la richiesta di un servizio al sistema operativo da parte di un processo utente. A differenza di una normale chiamata a funzione che avviene nello spazio di indirizzamento dell'utente, la system call innesca una *trap* (eccezione software) che fa passare la CPU dalla modalità utente (User Mode) alla modalità supervisore (Kernel Mode). Questo garantisce che solo il kernel possa eseguire operazioni privilegiate (come l'accesso all'hardware o alla memoria di altri processi), isolando e proteggendo il sistema da codice malevolo o buggato.

**39. Cos'è il Process Control Block (PCB) e cosa contiene?**
Il PCB è una struttura dati mantenuta dal sistema operativo per ogni processo in esecuzione. Funge da "carta d'identità" del processo e contiene tutte le informazioni necessarie per il suo ripristino dopo un context switch. Include: stato del processo, Program Counter (la prossima istruzione da eseguire), contenuto dei registri della CPU, informazioni di scheduling (es. priorità), limiti di memoria (es. puntatori alla tabella delle pagine) e stato delle risorse I/O (es. la tabella dei file aperti).

**40. Stati di un processo e transizioni principali**
Un processo attraversa tipicamente cinque stati: *New* (appena creato), *Ready* (pronto in coda, aspetta la CPU), *Running* (in esecuzione sulla CPU), *Waiting/Blocked* (sospeso in attesa di un evento, come il completamento di un I/O) e *Terminated*. La transizione da *Running* a *Ready* avviene per prelazione (scade il time-slice). Da *Running* a *Waiting* avviene se il processo richiede un'operazione lenta. Da *Waiting* a *Ready* avviene quando l'operazione attesa è completata.

**41. Problema della Sezione Critica e requisiti per la sua soluzione**
La sezione critica è una porzione di codice in cui un processo accede a dati condivisi (memoria, file) con altri processi. Per evitare incoerenze (*race conditions*), una soluzione valida deve soddisfare tre requisiti: 
1) **Mutua Esclusione:** se un processo è nella sezione critica, nessun altro può entrarvi.
2) **Progresso:** se nessuno è nella sezione critica e ci sono richieste, la scelta su chi entra non può essere rimandata all'infinito.
3) **Attesa Limitata:** ci deve essere un limite al numero di volte che altri processi possono entrare prima che tocchi a un processo in attesa (evitando la *starvation*).

**42. Semafori vs Mutex: qual è la differenza?**
Il *Mutex* (Mutual Exclusion) è un lucchetto binario legato alla "proprietà": solo il thread che lo ha acquisito (bloccato) ha il diritto di sbloccarlo. Serve esclusivamente a proteggere le sezioni critiche.
Il *Semaforo* è un contatore intero gestito dal sistema operativo. Può essere incrementato (Signal) da un thread completamente diverso da quello che lo ha decrementato (Wait). Questa flessibilità lo rende ideale per la **sincronizzazione logica** tra processi (es. segnalare a un consumatore che un produttore ha inserito un dato in un buffer).

**43. Algoritmo del Banchiere (Deadlock Avoidance)**
Mentre la "prevenzione" del deadlock invalida a priori una delle 4 condizioni necessarie, l'"evitamento" (Avoidance) analizza dinamicamente ogni singola richiesta di risorse in tempo reale. L'Algoritmo del Banchiere valuta la richiesta simulandone l'accettazione: se l'assegnazione mantiene il sistema in uno "Stato Sicuro" (ovvero esiste almeno una sequenza garantita che permette a tutti i processi di terminare con le risorse rimanenti), la richiesta viene accettata. Altrimenti, il processo viene messo in attesa.

**44. Anomalie nella sostituzione delle pagine (Anomalia di Belady)**
Logicamente, aumentando il numero di frame fisici (RAM) a disposizione di un processo, il numero di page fault dovrebbe diminuire. Tuttavia, con l'algoritmo di rimpiazzo **FIFO** (First-In, First-Out), può verificarsi l'Anomalia di Belady: per specifiche sequenze di accesso, aumentare la memoria causa paradossalmente un *aumento* del numero di page fault. Algoritmi basati sullo storico degli utilizzi (come LRU) sono immuni a questa anomalia.

**45. Cos'è il Thrashing e come si previene?**
Il *Thrashing* è un collasso totale delle prestazioni in cui il sistema spende quasi tutto il tempo a fare swapping di pagine tra disco e RAM (page-in e page-out) anziché eseguire istruzioni utili. Avviene quando ci sono troppi processi attivi e nessuno ha abbastanza RAM per contenere le pagine essenziali. Si previene con il **Modello del Working Set**, che stima quante pagine un processo sta attivamente usando; se la somma dei *working set* di tutti i processi supera la memoria disponibile, il SO sospende (swappa interamente) uno o più processi per ridare respiro al sistema.

**46. Cos'è il Copy-on-Write (COW)?**
È un'ottimizzazione fondamentale della system call `fork()`. Invece di duplicare immediatamente tutta la memoria del processo padre per creare il figlio (operazione lentissima), il SO mappa le stesse pagine fisiche per entrambi i processi, marcandole in "sola lettura". Solo nel momento in cui uno dei due processi tenta di *scrivere* (modificare) un dato, l'hardware genera un'eccezione e il SO interviene creando una copia isolata di quella singola pagina fisica.

**47. Allocazione della memoria per il Kernel (Buddy System e Slab Allocator)**
A differenza dei processi utente che usano la paginazione, il kernel necessita spesso di blocchi di memoria strettamente contigui e veloci.
* **Buddy System:** Divide la memoria a metà in modo ricorsivo creando blocchi "gemelli" (buddy) di dimensioni potenza di 2. È veloce nell'unire blocchi adiacenti quando vengono liberati, riducendo la frammentazione esterna.
* **Slab Allocator:** Lavora sopra il Buddy System. Pre-alloca "cache" di oggetti di dimensione fissa molto usati dal kernel (es. PCB o inode). Elimina la frammentazione interna ed evita di creare e distruggere continuamente le stesse strutture dati.

**48. Livelli RAID principali (0, 1, 5) e i loro scopi**
Il RAID aggrega più dischi fisici.
* **RAID 0 (Striping):** Distribuisce i dati in parallelo sui dischi. Massime prestazioni, ma se si rompe un disco si perde tutto (nessuna ridondanza).
* **RAID 1 (Mirroring):** Clona gli stessi dati su due dischi. Affidabilità massima (tolleranza al guasto totale di un disco), ma si dimezza lo spazio utile disponibile.
* **RAID 5 (Striping + Parità):** Distribuisce i dati e i blocchi di "parità" su minimo 3 dischi. Ottimo compromesso: tollera la rottura di un disco (i dati mancanti vengono calcolati tramite la parità) sacrificando lo spazio equivalente di un solo disco.

**49. I-node in UNIX (Indice a più livelli)**
Nel file system ext (UNIX/Linux), l'allocazione indicizzata si basa sull'inode, una struttura dati che contiene i metadati del file e i puntatori ai blocchi dati. Per supportare sia file minuscoli che enormi, utilizza un albero sbilanciato: contiene alcuni *puntatori diretti* (per accedere velocemente a file piccoli), un *puntatore indiretto singolo* (che punta a un blocco pieno di puntatori), uno *doppio indiretto* e uno *triplo indiretto*. Questo garantisce un overhead minimo per i file piccoli e grande scalabilità per i database.

**50. Costo del Context Switch (Cambio di Contesto)**
Il Context Switch è puro overhead. I costi diretti derivano dal salvataggio e caricamento dei registri della CPU da e verso i PCB in memoria. Il costo "nascosto" e più pesante deriva dal **decadimento della cache**: i dati, le istruzioni e le voci nella TLB appartengono al processo precedente. Quando il nuovo processo prende il controllo, troverà le cache inutili, subendo numerosi miss iniziali e rallentando drasticamente l'esecuzione nei primissimi cicli.

**51. Direct Memory Access (DMA): cos'è e perché si usa?**
Se la CPU dovesse gestire manualmente il trasferimento di un grosso file dal disco alla RAM, verrebbe interrotta per ogni singolo byte scambiato. Il DMA è un chip hardware specializzato a cui la CPU delega il trasferimento dati massivo. La CPU indica al DMA l'indirizzo di partenza, l'indirizzo di destinazione e la quantità di byte da spostare. Il DMA fa tutto il lavoro in autonomia sul bus di sistema e manda un *singolo* interrupt alla CPU solo a trasferimento totalmente concluso, lasciando la CPU libera di eseguire altri processi nel frattempo.

**52. Problemi classici della sincronizzazione (es. Produttore-Consumatore o Lettori-Scrittori)**
* **Produttore-Consumatore:** Uno o più processi produttori inseriscono dati in un buffer condiviso di dimensione limitata, mentre uno o più consumatori li prelevano. Richiede l'uso di semafori sia per garantire la mutua esclusione nell'accesso al buffer, sia per coordinare il conteggio degli slot vuoti e pieni, evitando che il produttore scriva se il buffer è pieno o che il consumatore legga se è vuoto.
* **Lettori-Scrittori:** Più processi concorrenti devono accedere a una risorsa comune (es. un database). I lettori possono accedere contemporaneamente poiché non modificano i dati, mentre gli scrittori richiedono un accesso esclusivo. La sincronizzazione serve a gestire la precedenza (priorità ai lettori o agli scrittori) evitando corruzioni dei dati o situazioni di starvation.

**53. Completely Fair Scheduler (CFS) in Linux**
Il CFS è lo scheduler di default di Linux per i processi standard. A differenza degli algoritmi tradizionali basati su quanti di tempo fissi e code a priorità statica, il CFS alloca il tempo di CPU basandosi su un modello matematico di "CPU ideale multifunzionale". Tiene traccia del tempo speso in esecuzione da ogni thread attraverso una variabile chiamata *Virtual Runtime* (vruntime). Lo scheduler seleziona sempre il processo con il vruntime più basso. I processi con priorità più alta (valori di *nice* più bassi) vedono il loro vruntime crescere più lentamente, ottenendo così più tempo di calcolo reale.

**54. Virtual File System (VFS)**
Il VFS è un livello di astrazione software implementato all'interno del kernel del sistema operativo. Il suo scopo è separare le chiamate di sistema generiche relative ai file (come `open()`, `read()`, `write()`) dalle implementazioni fisiche e specifiche dei singoli file system (come ext4, FAT32, NTFS o file system di rete). In questo modo, i programmi utente possono interagire con qualsiasi dispositivo di memorizzazione usando un'unica interfaccia standardizzata (API), lasciando al VFS il compito di tradurre i comandi per il driver specifico.

**55. Differenza tra Hard Link e Soft (Symbolic) Link**
* **Hard Link:** È una voce di directory che associa un nome direttamente a un *inode* esistente sul disco. Di fatto, crea un alias per lo stesso identico file fisico. Il file viene rimosso dal disco solo quando l'ultimo hard link ad esso associato viene cancellato (il contatore dei riferimenti scende a zero). Non può collegare file su file system o partizioni differenti.
* **Soft Link (Symlink):** È un file speciale a sé stante, dotato di un proprio inode, il cui contenuto è semplicemente una stringa di testo che rappresenta il percorso (path) verso il file di destinazione. Se il file originale viene rimosso, il soft link rimane ma diventa un puntatore rotto (*dangling pointer*). Può superare i confini di file system e partizioni diverse.

**56. Cos'è un processo Zombie e qual è il ruolo della wait()?**
Un processo viene definito *Zombie* quando ha terminato la sua esecuzione (ha invocato esplicitamente o implicitamente la system call `exit()`), ma la sua entry all'interno della tabella dei processi (nel PCB) è ancora mantenuta dal kernel. Questo accade perché il sistema operativo deve preservare lo stato di uscita del processo finché il processo "padre" non esegue una chiamata a `wait()`. Solo dopo che il padre ha letto tale stato, lo zombie viene definitivamente rimosso dalla memoria. Se il padre muore senza chiamare la `wait()`, i figli zombie vengono adottati dal processo `init` (o `systemd`), che provvede a ripulirli.

**57. Differenza tra comunicazione Interprocesso (IPC) e comunicazione tra Thread**
I processi sono isolati per motivi di sicurezza; pertanto, per scambiarsi dati devono ricorrere a meccanismi di *Inter-Process Communication* (IPC) gestiti dal kernel (come pipe, message passing o shared memory), i quali introducono un certo overhead. I thread dello stesso processo, invece, condividono lo stesso spazio di indirizzamento (memoria globale, heap). Poscono quindi comunicare in modo quasi istantaneo leggendo e scrivendo sulle stesse variabili. Tuttavia, proprio a causa della memoria condivisa, richiedono una sincronizzazione estremamente rigorosa (tramite mutex o semafori) per evitare race conditions.

**58. Cos'è il Livelock e in cosa si differenzia dal Deadlock?**
Entrambi sono fallimenti della proprietà di *liveness* (progresso), ma con dinamiche diverse:
* **Deadlock (Stallo):** I processi coinvolti sono in uno stato di attesa asincrona, completamente bloccati. Non consumano cicli di CPU perché aspettano una risorsa che non verrà mai rilasciata.
* **Livelock:** I processi sono attivi e continuano a eseguire istruzioni sulla CPU, ma cambiano continuamente il proprio stato interno in risposta alle azioni dell'altro. Si genera un ciclo infinito e improduttivo che non permette a nessun processo di fare reali progressi (l'analogia tipica è quella di due persone in un corridoio che provano a schivarsi spostandosi continuamente e sincronizzatamente sullo stesso lato).

**59. Funzionamento hardware degli SSD: memorie Flash NAND e Wear Leveling**
A differenza degli HDD in cui il ritardo è meccanico (seek time), gli SSD si basano su chip a stato solido (Flash NAND). Gli SSD hanno una limitazione strutturale: non possono sovrascrivere direttamente una cella di memoria, ma devono prima cancellare l'intero "blocco" che la contiene prima di poter riscrivere una "pagina". Inoltre, le celle si usurano fisicamente dopo un certo numero di cicli di cancellazione. Per ovviare a ciò, il controller del disco (tramite il Flash Translation Layer - FTL) implementa l'algoritmo di **Wear Leveling**, che rimappa costantemente gli indirizzi logici su quelli fisici per distribuire le scritture in modo uniforme su tutto il disco, evitando la rottura prematura di singole aree.

**60. Meccanismo della Open File Table: perché il SO usa due tabelle distinte?**
Quando un processo esegue la system call `open()`, il sistema operativo non si limita a cercare il file su disco, ma indicizza l'accesso attraverso due strutture dati in memoria:
1) **Tabella dei file aperti di sistema (System-wide):** È globale e contiene una copia dei metadati del file (FCB/inode) e un contatore dei riferimenti (per sapere quanti processi lo stanno usando).
2) **Tabella dei file aperti per-processo:** È privata di ogni singolo processo. Contiene i puntatori alle righe della tabella di sistema e, soprattutto, traccia l'**offset di lettura/scrittura (file pointer)** corrente di *quel* processo. 
Questa separazione permette a due processi distinti di leggere lo stesso identico file in RAM contemporaneamente, ma mantenendo posizioni di lettura (offset) separate e indipendenti.

**61. I Monitor: cosa sono, qual è la loro struttura e come gestiscono la sincronizzazione?**
Un **Monitor** è un'astrazione software di alto livello (introdotta da Hoare nel 1974) che fornisce un meccanismo di sincronizzazione comodo ed efficiente per i processi. A differenza dei semafori, che richiedono al programmatore di inserire manualmente le chiamate `wait` e `signal` (con alto rischio di deadlock o race conditions), il monitor garantisce la **mutua esclusione automatica**: solo un processo alla volta può essere attivo all'interno del monitor.

**Struttura principale:**
* **Dati condivisi**: Le variabili private accessibili solo dalle procedure del monitor.
* **Operazioni/Procedure**: Funzioni pubbliche chiamate dai processi esterni per accedere ai dati.
* **Codice di inizializzazione**: Imposta lo stato iniziale dei dati privati.
* **Coda di accesso (Entry Queue)**: I processi che provano ad accedere al monitor mentre questo è già occupato vengono messi in questa coda di attesa.
* **Variabili di Condizione (Condition Variables)**: Consentono di sospendere i processi in attesa di specifiche condizioni logiche. Le operazioni permesse sono:
  * `x.wait()`: Il processo che la chiama viene sospeso immediatamente e inserito nella coda associata alla condizione `x`, rilasciando il controllo del monitor.
  * `x.signal()`: Riprende l'esecuzione di un processo sospeso sulla coda di `x`. Se non ci sono processi in attesa, l'operazione non ha alcun effetto.

**Semantica di risveglio (Signal and Wait vs Signal and Continue):**
Se un processo $P$ esegue `x.signal()` riattivando un processo $Q$ che era sospeso su `x.wait()`, non possono essere attivi entrambi contemporaneamente nel monitor. Si definiscono due approcci:
* **Signal and Wait (Hoare):** $P$ cede subito il monitor a $Q$ e si sospende in una coda interna (`next`) in attesa che $Q$ esca dal monitor o si blocchi a sua volta.
* **Signal and Continue (Mesa):** $P$ continua l'esecuzione fino al termine della sua procedura all'interno del monitor. $Q$ viene messo in una coda dei pronti per rientrare nel monitor non appena si libererà.

**62. Il problema del Double Caching nel File System e il ruolo della Cache Unificata**
Nei sistemi operativi tradizionali, l'I/O dei file passava per due livelli separati di caching in memoria RAM:
1. **Buffer Cache**: Gestita a basso livello dal kernel per memorizzare i blocchi del dispositivo di memorizzazione di massa (I/O orientato ai blocchi).
2. **Page Cache**: Utilizzata dal sistema di memoria virtuale per memorizzare le pagine di codice e dati dei processi utente (I/O orientato alle pagine, es. per file mappati in memoria tramite `mmap`).

Il **problema del Double Caching (o Double Buffering)** si verifica quando lo stesso file viene aperto contemporaneamente sia tramite chiamate di sistema standard (`read`/`write`) sia tramite mappatura in memoria (`mmap`). I dati devono essere prima letti dal disco e messi nella *buffer cache*, e successivamente copiati nella *page cache* della memoria virtuale per essere accessibili dal processo mappato.

**Conseguenze:**
* **Spreco di memoria RAM**: Lo stesso dato risiede in due aree cache distinte contemporaneamente.
* **Overhead di CPU e I/O**: Copie inutili di dati tra i due buffer.
* **Inconsistenza dei dati**: Se un processo scrive usando `write()` (aggiornando la buffer cache) e un altro legge tramite memoria virtuale (accedendo alla page cache), i due vedranno dati non sincronizzati.

**Soluzione (Buffer Cache Unificata):**
Nei sistemi operativi moderni si adotta una **Cache Unificata (Unified Buffer Cache)**. Il sistema di memoria virtuale e il file system condividono la stessa identica cache. Qualsiasi operazione di lettura, scrittura o mappatura in memoria accede allo stesso set di pagine fisiche gestite dal kernel. Questo elimina la doppia copia di cache, risparmiando RAM e CPU, e garantisce l'assoluta coerenza delle letture e scritture concorrenti.

**63. Struttura a livelli (layers) del File System e relative responsabilità**
Per semplificare la progettazione e ridurre la complessità, l'architettura del File System è strutturata a livelli (layers), dove ogni livello fornisce servizi al livello superiore e si appoggia su quello inferiore:
1. **File System Logico (Logical File System):** Gestisce i metadati del file. È responsabile della struttura delle directory, dei permessi di accesso, della traduzione dei nomi dei file in identificativi interni (*inode numbers*) e del mantenimento dei File Control Block (FCB).
2. **Modulo di Organizzazione dei File (File Organization Module):** Traduce i blocchi logici del file (es. il blocco 3 del file "documento.txt") nei corrispondenti blocchi fisici del disco (es. il settore LBA 5432). Gestisce i metodi di allocazione (contigua, concatenata o indicizzata) e traccia lo spazio libero sul disco.
3. **File System di Base (Basic File System):** Riceve comandi generici per leggere/scrivere blocchi fisici del disco identificati dal loro indirizzo fisico. Gestisce i buffer in memoria RAM che contengono i blocchi del file system e del disco per velocizzare i successivi accessi.
4. **Controllo dei Dispositivi (I/O Control / Device Drivers):** Consiste nei driver hardware e nei gestori delle interruzioni (Interrupt Handlers). Traduce i comandi generici (es. "leggi blocco 120 del disco 1") in comandi hardware a basso livello (scrittura nei registri di controllo del controller del disco, come SATA o NVMe, o comandi DMA).
5. **Dispositivi Fisici (Physical Devices):** L'hardware fisico reale (dischi HDD magnetici, memorie a stato solido SSD o dischi ottici) che esegue fisicamente la memorizzazione magnetica o elettrica dei bit.

**64. Earliest Deadline First (EDF) Scheduling**
**Descrizione:**
L'**Earliest Deadline First (EDF)** è un algoritmo di scheduling **dinamico** utilizzato nei sistemi operativi Real-Time preemptive. A differenza degli algoritmi statici, in EDF le priorità dei task non sono assegnate a priori in base a caratteristiche fisse (come il periodo), ma cambiano continuamente nel tempo durante l'esecuzione del sistema.

* **La Regola Fondamentale:** Lo scheduler seleziona e assegna la CPU al task che ha la **scadenza (deadline) imminente** più vicina. Più la scadenza è vicina, più la priorità del task diventa alta.
* **Analogia (Il Piatto in Scadenza):** Immagina la cucina di un ristorante che deve gestire ordini speciali con tempi di consegna rigidi. La filosofia di EDF impone che *"il piatto che deve essere pronto tassativamente tra 2 minuti ha la priorità assoluta su quello che deve essere pronto tra 10 minuti"*, indipendentemente da chi lo abbia ordinato o dalla frequenza con cui quell'ordine arriva.

**Vantaggi:**
* **Ottimalità teorica:** EDF è un algoritmo teoricamente **ottimale** per sistemi Real-Time a singolo processore con prelazione. Questo significa che se un insieme di task può essere schedulato da un qualsiasi altro algoritmo senza violare le scadenze, EDF ci riuscirà sicuramente.
* **Sfruttamento della CPU:** Può raggiungere un utilizzo della CPU pari al **100%** garantendo al contempo il rispetto di tutte le scadenze.

**Svantaggi:**
* **Complessità di implementazione:** Richiede un monitoraggio costante a runtime di tutte le scadenze e il ricalcolo continuo delle priorità a ogni arrivo di un nuovo task, introducendo un overhead hardware/software maggiore.
* **Comportamento imprevedibile in sovraccarico (Domino Effect):** Se il sistema sperimenta un sovraccarico (anche temporaneo) e un task manca la sua deadline, si può verificare un effetto domino in cui **tutti o quasi tutti i task successivi perderanno la loro scadenza**, rendendo il sistema instabile e imprevedibile.

---

**65. Rate Monotonic (RM) Scheduling**
**Descrizione:**
Il **Rate-Monotonic (RM)** è l'algoritmo di scheduling standard e più comune per i sistemi Real-Time a priorità **statica**. In questo algoritmo, le priorità vengono assegnate ai task prima dell'inizio dell'esecuzione (in fase di design) e rimangono rigorosamente invariate per tutta la durata del ciclo di vita del sistema.

* **La Regola Fondamentale:** RM assegna le priorità basandosi esclusivamente sulla **frequenza di attivazione (Rate)** dei task, che è inversamente proporzionale al loro periodo ($T$). I task con un **periodo più breve** (ovvero quelli che devono essere eseguiti più frequentemente) ricevono una **priorità più alta**.
* **Analogia (L'Ordine Frequente):** Sempre nella nostra cucina, la filosofia di RM impone che *"il cliente abituale che effettua un ordine fisso ogni 5 minuti riceve sempre la priorità rispetto al cliente che ordina un piatto ogni 10 minuti"*. La priorità è legata alla rigidità temporale della frequenza e non cambia mai.

**Vantaggi:**
* **Semplicità e Prevedibilità:** È estremamente semplice da implementare poiché lo scheduler deve solo confrontare valori di priorità fissi. Inoltre, il comportamento del sistema è altamente prevedibile anche in condizioni di stress.
* **Punto di riferimento (Baseline):** Se un set di task con scadenze uguali ai periodi è schedulabile con un algoritmo a priorità statica, è garantito che sia schedulabile con RM, il quale rappresenta l'algoritmo statico ottimale.

**Svantaggi:**
* **Non sempre ottimale per l'utilizzo della CPU:** RM non è flessibile come EDF. Il limite superiore di utilizzo della CPU (bound di Liu e Layland) oltre il quale non è assicurata la schedulabilità decade all'aumentare dei task, stabilizzandosi intorno al **69.3%** ($\ln 2$). Pertanto, potrebbe rifiutare o non riuscire a gestire insiemi di task che l'algoritmo dinamico EDF risolverebbe agevolmente.

