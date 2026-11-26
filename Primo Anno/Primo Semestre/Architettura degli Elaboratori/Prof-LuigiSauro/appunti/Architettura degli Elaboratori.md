# Architettura degli Elaboratori — Dispense Complete

> Dispense del corso (Prof. Luigi Sauro) digitalizzate con OCR AI locale (Chandra OCR 2 Q8_0), formule LaTeX e schemi circuitali estratti

---

<!-- Pagina 2 -->

# Rappresentazione dell'informazione

## L'informazione

Come vengono rappresentati in macchina gli interi, i relativi e altri tipi di dato, come i caratteri? Per far questo è necessario introdurre il concetto di informazione:

- L'informazione è un qualunque insieme di segnali che condizionano l'evoluzione di un sistema. Ad esempio, in un termostato, il segnale è rappresentato dalla temperatura dell'ambiente che è in grado di veicolare un'informazione che spegne o accende la caldaia.
- Bisogna stare attenti, però, a non rendere troppo generico il concetto di informazione, associandolo ad un qualsiasi evento che modifichi l'evoluzione di un sistema. Così facendo, infatti, un qualsiasi fenomeno fisico e naturale rientrerebbe in questa definizione.
- Ci si rende conto, allora, che la definizione di informazione non è direttamente legata alla modifica dell'evoluzione di un sistema o alla nozione di segnale, ma che sono necessarie più definizioni per poter evidenziare tutti i suoi particolari aspetti (nozione primitiva). Non si ha, quindi, un'unica definizione omnicomprensiva ma un insieme di tanti concetti chiari e precisi.
- Un'alternativa potrebbe essere quella di restringere il contesto nel quale definire "l'informazione", e cercare in domini più specifici una definizione più esauriente: è proprio questo il nostro caso, in quanto andremo a considerare l'informazione come la memorizzazione dei tipi di dato che usualmente si utilizzano nei linguaggi di programmazione, come int, float, string.

## Alfabeti, parole, linguaggi

Un alfabeto A è un insieme finito e distinguibile di segni (la parola segno è un concetto primitivo, e, a seconda del contesto li chiameremo lettere, cifre, simboli, caratteri).

Una parola è una sequenza finita di simboli presi da un certo alfabeto A.

Infine, indicheremo con  $A^*$  l'insieme di tutte le possibili parole generabili da un dato alfabeto A, cioè l'insieme di tutte le possibili sequenze finite di caratteri di quell'alfabeto.

Un linguaggio su un alfabeto A è un qualsiasi sottoinsieme dell'insieme  $A^*$  (insieme di parole).

Ad esempio, nel linguaggio "italiano", di tutte le parole generabili dai 21 caratteri dell'alfabeto italiano, solo alcune hanno senso compiuto, come "cane" o "porta", a differenza di "door" che non rientra in questo linguaggio.

## Codifica, decodifica

Le parole di un linguaggio L sono solo una sequenza finita di caratteri di un certo alfabeto, che non hanno alcun senso finché non si ha un modo per interpretarle. Quindi, per fare in modo che le parole abbiano un significato, è necessario effettuare una codifica, ovvero associare ad elementi di un certo insieme di interesse le parole del nostro linguaggio L. Ad esempio, prendiamo il concetto di "cane": una possibile codifica è quella di associarlo ad una parola nel linguaggio "inglese", ovvero la parola "dog".

Quindi, una codifica di D è una funzione totale F da un insieme D (l'insieme degli oggetti da codificare) all'insieme L (il linguaggio di riferimento). Allora:

- Se F non è suriettiva (almeno una parola non è associata ad alcun oggetto da codificare), la codifica si dice RIDONDANTE;
- Se F non è iniettiva (due oggetti da codificare hanno la stessa codifica nel linguaggio), la codifica si dice AMBIGUA;
- Se F non è ambigua e non è ridondante allora F è iniettiva e suriettiva e, quindi, è una funzione biettiva, da cui possiamo ricavare la funzione inversa da L a D, detta DECODIFICA di D.

Se indichiamo con ND la cardinalità di D e con NL la cardinalità di L:

- Se  $NL > ND$  allora la codifica è RIDONDANTE;
- Se  $ND > NL$  allora la codifica è AMBIGUA;

Ci sono altre proprietà da tener conto quando si vuole codificare un insieme:

- Economicità: il numero di simboli utilizzati per unità di informazione (minore è il numero di simboli, più efficiente è la sua memorizzazione nel calcolatore);
- Semplicità nelle operazioni di codifica e decodifica;
- Semplicità nelle operazioni da eseguire sull'informazione codificata (ad esempio, operazioni aritmetiche su insiemi numerici)

---

<!-- Pagina 3 -->

# Rappresentazione dei numeri naturali

## Il sistema decimale

(Una parola tra apici indica una stringa. Ad esempio, il numerale "4456" è inteso come sequenza di cifre, a differenza di 4456 che è inteso come numero). Una codifica ovvia per la rappresentazione dei numeri naturali è il sistema di numerazione decimale (base 10), che utilizza le cifre da 0 a 9. In tale sistema (posizionale), a ogni cifra della parola è assegnato un "peso" differente a seconda della posizione che assume nella sequenza (ogni cifra è moltiplicata per  $10^c$ , dove  $c$  rappresenta la posizione della cifra nella parola). In particolare, la prima cifra della parola rappresenta la cifra più significativa, mentre l'ultima rappresenta la cifra meno significativa.

Quindi, in generale, un numerale  $c_{m-1} \dots c_1 c_0$  è così rappresentato in base 10:

$$
\sum_{i=0}^{m-1} c_i \times 10^i
$$

Il sistema decimale è, quindi, una codifica posizionale in base 10. Tuttavia, non è l'unica:

- I babilonesi utilizzavano un **sistema sessagesimale** (base 60);
- Esiste anche il **sistema ottale** (base 8) con simboli da 0 a 7;
- Il calcolatore utilizza un **sistema binario** (base 2, solo due cifre: "0" e "1");
- Per rappresentare gli indirizzi di memoria di un calcolatore si utilizza il **sistema esadecimale** (base 16) con simboli da '0' a '9' e da 'A' a 'F'.

## Sistemi di numerazione in base b

Quindi, come sono codificati i numeri in basi diverse da quella decimale? L'alfabeto consiste di un insieme di  $b$  simboli da 0 a  $b-1$ , dove  $b$  rappresenta la base ( $b > 1$ ).

La codifica di un numerale  $c_{m-1} \dots c_1 c_0$  in base  $b$  è analoga alla codifica di un numerale in base 10:

$$
\sum_{i=0}^{m-1} c_i \times b^i
$$

Per indicare un numerale scritto in una certa base  $b$ , si utilizza un pedice sulla cifra meno significativa del numerale, ad esempio:  $1001_2$  (base 2)  $\neq 1001_{10}$  (base 10).

La lunghezza di un generico numerale  $n$  rispetto ad una certa base  $b$  è il numero di cifre che occorrono per rappresentare il numerale  $n$  nella base  $b$ . Al crescere della base, ogni cifra viene moltiplicata per una base sempre più grande, quindi si raggiungono numeri più grandi molto più velocemente, e quindi sono necessarie meno cifre per rappresentarli (**tanto più grande è la base  $b$ , tanto più piccola è la lunghezza  $n$** ).

## Valore massimo rappresentabile

Nel sistema decimale il valore massimo rappresentabile è  $V_{\max} = 10^m - 1$ , dove  $m$  è il numero di cifre preso in considerazione (ad esempio con 2 cifre,  $V_{\max} = 99$ ).

In un sistema di numerazione in una generica base  $b$ , il valore massimo rappresentabile  $V_{\max}$  si ottiene concatenando  $m$  volte la cifra più alta del sistema di riferimento, che quindi corrisponde a:

$$
V_{\max} = b^m - 1
$$

## Cifre necessarie per rappresentare un numero $n$

Dato un valore  $n$ , quante cifre  $m$  sono necessarie per rappresentarlo in una certa base  $b$ ?

Il numero di cifre  $m$  necessarie a rappresentare  $n$  deve essere tale che:

$$
b^m - 1 \geq n
$$

Questo perché altrimenti non ho considerato abbastanza cifre. Se  $n$  fosse più grande di  $b^m - 1$ , ci vorrebbero più  $m$  cifre per rappresentare  $n$ .

$$
b^m \geq n + 1
$$

$$
m \geq \log_b(n + 1)
$$

Dato che  $m$  è un numero naturale (mentre il logaritmo è una funzione reale) e che cerchiamo il più piccolo numero  $m$  tale che  $m \geq \log_b(n + 1)$  (non un qualunque  $m$  che rispetti questa condizione), allora  $m$  deve essere uguale al tetto di  $\log_b(n + 1)$ , cioè l'approssimazione intera per eccesso:

$$
m = \lceil \log_b(n + 1) \rceil
$$

Oppure, lo stesso valore di  $m$  può essere ottenuto dal pavimento di  $\log_b(n)$ , cioè l'approssimazione intera per difetto (per qualsiasi base  $b$  e qualsiasi numero  $n$ , questi due valori sono uguali):

$$
m = \lfloor \log_b(n) \rfloor + 1
$$

---

<!-- Pagina 4 -->

Dimostrazione  $\lfloor \log_b(n+1) \rfloor = \lfloor \log_b(n) \rfloor + 1, \forall b, n \in \mathbb{N}$

- Sia  $x = \log_b(n)$  e  $y = \log_b(n+1)$ . Essendo il logaritmo una funzione strettamente monotona crescente, è chiaro che  $x < y$ ;
- Supponiamo, ora, due casi:

1. Supponiamo, per ipotesi, che ci sia un numero intero  $m$  tale per cui  $x$  e  $y$  siano compresi tra  $m$  e  $m+1$ , cioè  $m \leq x < y \leq m+1$ . Allora, da questa disuguaglianza vediamo che il pavimento di  $x$  è uguale a  $m$ , invece, il tetto di  $y$  è uguale a  $m+1$ . La tesi è soddisfatta;
2. Ragioniamo per assurdo, negando l'ipotesi del punto precedente. Supponiamo che ci sia un numero intero  $h$  tale per cui valga la seguente disuguaglianza:  $x < h < y$ . Consideriamo, a questo punto  $b^x < b^h < b^y$  (essendo anche l'esponenziazione una funzione monotona strettamente crescente, la disuguaglianza rimane la stessa). Sostituiamo i termini  $b^x$  e  $b^y$  con  $b^{\log_b(n)}$  e  $b^{\log_b(n+1)}$  e il termine  $b^h$  con  $k$ , un generico numero naturale.

Da questo, risulta che la disuguaglianza è la seguente:  $n < k < n+1$ . Assurdo.

### Relazione fra basi diverse

Il numero  $m$  di cifre necessarie per rappresentare un certo numero  $n$  diminuisce al crescere della base  $b$ . Di quanto diminuisce il numero di cifre fra una base e l'altra, cioè, qual è la relazione, dato un certo numero  $n$ , tra il numero di cifre  $m_a$  per rappresentare  $n$  nella base  $a$  e il numero di cifre  $m_b$  per rappresentare  $n$  nella base  $b$ ?

Per definizione, il numero  $m$  di cifre di un numero  $n$  in una base  $c$  è  $\log_c(n)$  (per grandi  $n$ , si può approssimare senza inserire  $+1$ ), quindi:

$$
m_a \cong \log_a(n)
$$

$$
m_b \cong \log_b(n)
$$

Ricordando le regole per il cambiamento di base dei logaritmi (dalla base  $a$  alla base  $b$ ):

$$
\log_a(n) = \log_b(a) * \log_b(n)
$$

$$
m_a \cong \log_a(n) = \log_a(b) * \log_b(n) \cong \log_a(b) * m_b
$$

Quindi, il rapporto fra le due lunghezze  $m_a$  e  $m_b$  è un rapporto di proporzione, in cui il fattore di proporzione è proprio  $\log_a(b)$

### Codifica ottimale

Come abbiamo già visto, maggiore è la base, minore è il numero di cifre necessarie a rappresentare un numero, quindi, la codifica in quella base è più economica in termini di lunghezza.

Perché i calcolatori utilizzano la base più piccola (base 2) fra quelle ammissibili ( $b \geq 2$ )?

Anche se, avendo una base maggiore si occupa meno spazio in memoria, bisogna ricordare che non si deve solo tener conto della lunghezza della codifica, ma anche che tali basi hanno alfabeti più grandi. Questi corrispondono, in un calcolatore, a più cifre  $b$  della base che devono essere rappresentate mediante differenti stati fisici. Infatti, i calcolatori, essendo macchine elettroniche, utilizzano il potenziale elettrico (volt) per rappresentare questi stati. Quindi, si hanno meno cifre nella codifica, ma si ha un sistema molto più complicato fisicamente, composto da tanti livelli del potenziale elettrico per rappresentare le diverse cifre della base.

Allora, per ottenere una codifica ottimale, è necessario minimizzare il costo di rappresentazione di questi stati. Una possibile nozione di costo di una codifica, che tiene conto di questo fattore è la seguente (il numero di cifre di un numero moltiplicato per il numero di stati utili a rappresentarlo):

$$
b * m_b \cong b * \log_b(n)
$$

Da questa nozione, è possibile dimostrare che il valore di  $b$  che minimizza il costo di una codifica è il numero di Nepero  $e \cong 2.7$ , quindi le basi intere che più si avvicinano a tale valore sono 2 e 3.

---

<!-- Pagina 5 -->

### Cambiamento di base

Dato un numero  $n$  rappresentato in base  $a$ , qual è la sua rappresentazione in base  $b$ ? L'algoritmo che ci permette di far ciò è detto delle "divisioni successive" e consiste nel dividere ripetutamente il numero  $n$  (espresso in base  $a$ ) per la base  $b$ , finché il quoziente non risulti essere uguale a 0. Il numerale che rappresenta il numero  $n$  in base  $b$  è la sequenza dei resti (compresi tra 0 e  $b-1$ ) di tutte le divisioni (partendo dall'ultima fino alla prima).

Dato che non siamo molto allenati nella divisione in altri sistemi di numerazione, è possibile facilitare la codifica da base "a" a base "b" suddividendola in due step:

1. Prima di tutto, codifichiamo il numero  $n$ , rappresentato in base  $a$ , alla base 10;
2. Dopodiché, codifichiamo il numero  $n$ , rappresentato in base 10, alla base  $b$ .

### Codifica binaria ed esadecimale

(Comunemente, nei linguaggi di programmazione un numerale esadecimale viene indicato con il prefisso 0x)

I componenti digitali ed elettronici del nostro calcolatore operano in codice binario. Nonostante la codifica in binario sia ottimale per il calcolatore, i numeri codificati in base 2 sono molto lunghi e poco human-friendly: si potrebbe pensare, allora, di codificare tali numeri in base 10. C'è, però, un problema:

- Sostanzialmente, dato che il 10 non è una potenza del 2, l'algoritmo delle divisioni successive per il cambiamento di base risulta essere poco agevole e poco veloce.

Proprio per evitare tale problema, si utilizza una codifica in esadecimale, per codificare le parole in binario troppo lunghe in numerali in base 16 molto più brevi.

Il vantaggio di codificare i numeri da base 2 a base 16 sta nel fatto che  $16 = 2^4$ , quindi:

- DA BINARIO AD ESADECIMALE: 4 bit di un numerale in base 2 corrispondono ad una cifra in base 16 (aggiungendo anche eventuali 0 non significativi);
- DA ESADECIMALE A BINARIO: una cifra di un numerale in base 16 corrisponde a 4 bit del numerale in base 2 (aggiungendo anche eventuali 0 non significativi).

### Rappresentazione dei registri

In un computer, dato che una cifra esadecimale codifica 4 bit:

- una parola di 8 bit, detta byte, viene codificata da 2 cifre esadecimali (per la rappresentazione del tipo di dato "char" in c);
- 4 byte, cioè 32 bit, sono codificati da 8 cifre esadecimali (per la rappresentazione del tipo di dato "int" in c);
- 8 byte, cioè 64 bit, sono codificati da 16 cifre esadecimali (per la rappresentazione del tipo di dato "long" in c).

Il contenuto (sequenza di bit) di un registro in macchina o di una cella di memoria ecc. è espresso in un linguaggio human-friendly in esadecimale.

### Numeri con parole di lunghezza fissa

All'interno della struttura elettronica di un calcolatore, i bit delle parole sono memorizzati all'interno dei registri, cioè delle sequenze di bit fissate. Nei calcolatori moderni, questi registri sono tipicamente composti o da 32 o da 64 bit (dipende dall'architettura). Quindi, con una parola è possibile rappresentare solo un numero finito di naturali, appunto perché i registri possiedono una sequenza di bit finita in cui è possibile memorizzarli (ad esempio, con parole di 64 bit si possono rappresentare solo i naturali da 0 a  $2^{64}-1$ ). L'intervallo di numeri finiti naturali rappresentabili è detto "range".

Ogni numero è rappresentato in memoria in un registro con lo stesso numero di cifre binarie, che è proprio la lunghezza fissata di quel registro (eventualmente, nella rappresentazione si aggiungono 0 non significativi).

### Overflow (o trabacco)

Operazioni come l'addizione o la moltiplicazione possono produrre numeri troppo grandi per essere rappresentati in un registro. Supponiamo di voler eseguire  $1024^2$  in un registro di 16 bit.

$1024^2 = 2^{10} * 2^{10} = 2^{20} > 2^{16}-1 \rightarrow$  Non può essere rappresentato  $\rightarrow$  Overflow.

---

<!-- Pagina 6 -->

Sostanzialmente, la macchina sulla quale operiamo utilizza dei registri il cui numero di bit è troppo piccolo per rappresentare i risultati di alcune operazioni. Quindi, dopo che è avvenuto un overflow, il risultato dell'operazione che si va a leggere nel registro non è valido.

### Somma in binario

La somma di due numeri in binario si esegue in maniera analoga alla somma di due numeri in decimale (l'unica differenza è che l'unico riporto è 1). Nell'operazione di somma si ottiene un overflow quando si ha un riporto dopo la somma dei bit più significativi (praticamente, si ha bisogno di un bit in più per rappresentare il risultato).

### Moltiplicazione in binario

La moltiplicazione di due numeri in binario si esegue in maniera analoga alla moltiplicazione di due numeri in decimale (l'unica differenza è che l'unico riporto è 1). Nell'operazione di moltiplicazione si ottiene un overflow quando sono necessari più bit per rappresentare il risultato.

## Rappresentazione di numeri interi

(Nei linguaggi di programmazione, i tipi di dato permettono alla macchina di interpretare correttamente il contenuto di un registro. Ad esempio, un unsigned int '1111' è l'intero naturale 15, mentre un int '1111' è l'intero relativo -7)

Come si rappresentano in macchina i numeri relativi (cioè numeri positivi, negativi e lo zero)? Dato che i registri hanno una lunghezza fissata, è necessario capire come rappresentare (in un numero di bit finiti) sia il valore assoluto di un numero, sia il suo segno.

Le principali rappresentazioni di numeri interi sono:

- **RAPPRESENTAZIONE CON SEGNO.** Supposto che abbiamo un registro di lunghezza  $m$ , in tale rappresentazione il bit più significativo è adibita a rappresentare il segno del numero intero (per convenzione: 0 rappresenta il segno +, 1 rappresenta il segno -). Le rimanenti  $m-1$  cifre sono utilizzate per rappresentare il valore assoluto del numero intero secondo la codifica dei numeri naturali studiata finora, quindi, in una generica base  $b$ , è possibile rappresentare un range di valori da  $-(b^{m-1} - 1)$  a  $0 + (b^{m-1} - 1)$  (in registri di lunghezza 4 il più grande numero rappresentabile è  $0111_2 = 7$ , mentre il più piccolo numero rappresentabile è  $1111_2 = -7$ ). Quindi, lo zero ha due possibili rappresentazioni: 0000 e 1000. Lo svantaggio di questa rappresentazione sta nella difficoltà di eseguire l'addizione e la sottrazione, in quanto è sempre necessario controllare il segno e i valori assoluti degli operandi per determinare il segno del risultato ( $0010 + 0001 = 0011 \rightarrow$  operandi positivi  $\rightarrow$  risultato positivo,  $1100 + 0011 = 1001 \rightarrow$  primo op. negativo, secondo op. positivo, valore assoluto del primo maggiore del secondo  $\rightarrow$  risultato negativo).
- **COMPLEMENTO ALL'INTERVALLO**, detta anche **COMPLEMENTO A DUE**. Questa è il tipo di rappresentazione utilizzato dai calcolatori moderni come pc, tablet e smartphone per codificare i numeri interi. Questo tipo di rappresentazione è stata sviluppata cercando di risolvere i principali difetti della rappresentazione con segno.

<table border="1"><tr><td>$-2^{m-1}$</td><td>$2^{m-2}$</td><td>...</td><td>$2^1$</td><td>$2^0$</td></tr></table>

Questa rappresentazione è analoga alla rappresentazione senza segno (i vari bit hanno come peso una potenza di due con esponenti successivi da 0 a  $m-1$ ), con la differenza che il bit più significativo è moltiplicato per un peso pari a  $-2^{m-1}$ . Da ciò si può dedurre che:

- Lo zero ha un'unica rappresentazione, cioè  $0 \dots 0$ ;
- Il range di numeri rappresentabili, dal più piccolo al più grande è:  $[-2^{m-1}, 2^{m-1} - 1]$ .
- Il numero negativo più grande rappresentabile è il seguente:

$$
\begin{array}{|c|c|c|c|c|} \hline 1 & 0 & \dots & 0 & 0 \\ \hline \end{array} \quad 1 \cdot (-2^{m-1}) + 0 + \dots + 0
$$

- Il numero positivo più grande rappresentabile è il seguente:

$$
\begin{array}{|c|c|c|c|c|} \hline 0 & 1 & \dots & 1 & 1 \\ \hline \end{array} \quad 0 \cdot (-2^{m-1}) + 1 \cdot (2^{m-2}) + \dots + 1 \cdot 2^0
$$

---

<!-- Pagina 7 -->

In questa rappresentazione, per rappresentare l'opposto di un numero si deve invertire ogni cifra, dopodiché sommare 1 (ad esempio,  $2 = 0010 \rightarrow -2 = 1101 + 0001 = 1110$ ). Non è, però, possibile rappresentare l'opposto di  $-2^{m-1}$ , in quanto i numeri positivi si fermano a  $2^{m-1} - 1$  (servirebbe un bit in più).

La somma si esegue in modo analogo alla somma nella rappresentazione senza segno. Bisogna ricordare, però, che il riporto di 1 bit finale non è indice di overflow (ad esempio:  $-7 + 7 = 1000 + 0111 = 0000_2 = 0$  con riporto 1, ma lo 0 è rappresentato correttamente nel range di valori). Quindi, sommare un numero negativo con un numero positivo non genera overflow, ma avviene solo nel caso in cui entrambi gli operandi sono positivi (MSB = 0) oppure negativi (MSB = 1) e il risultato ha segno opposto (che è una contraddizione).

Per estendere un numero da una rappresentazione con un certo numero di bit ad una rappresentazione con più bit, quello che occorre è riprodurre verso sinistra il valore del bit più significativo (ad esempio,  $-4 = 1100$  in 4 bit =  $1111\ 1100$  in 8 bit).

**BINARY CODED DECIMAL.** Una codifica dei numeri naturali decimali molto più intuitiva rispetto alla codifica in codice binario (che utilizza l'algoritmo delle divisioni successive) è la codifica BCD. Questo tipo di codifica è principalmente utilizzato come codice di I/O per mostrare a video qualcosa espresso in macchina in codice binario (non è assolutamente un codice con il quale è possibile eseguire operazioni aritmetiche).

Sostanzialmente, le 10 cifre decimali da 0 a 9 si codificano in una sequenza di bit. Essendo 10 le cifre da codificare, sono necessarie parole di 4 bit per poterle codificare tutte. Siccome abbiamo a disposizione  $2^4 = 16$  possibili combinazioni, allora la codifica BCD risulta essere ridondante, in quanto il numero di parole binarie è maggiore del numero di cifre da codificare (questo avviene per tutte le codifiche in cui il numero di oggetti da codificare non è una potenza di due).

Infine, per poter codificare tutti quei numeri naturali a più cifre è necessario mettere in sequenza le codifiche delle cifre che compongono quel numero (giustapposizione):

$$
23 = 0010\ 0011_{\text{BCD}} \neq 00100011_2 = 35
$$

Inoltre, in una somma in BCD non bisogna considerare i pesi delle singole cifre, in quanto il risultato si ottiene concatenando le codifiche delle cifre che compongono il risultato stesso.

$$
1000_{\text{BCD}} + 0011_{\text{BCD}} = 8 + 3 = 11 = 0001\ 0001_{\text{BCD}} \neq 1011_2
$$

## Rappresentazione di numeri con virgola

### Sistema di numerazione decimale

Vediamo come in macchina vengono approssimati i numeri reali. Consideriamo un numero con virgola nel sistema di numerazione decimale: questo ha una parte intera, in cui le cifre sono moltiplicate per potenze di 10 con esponente positivo, ed una parte con cifre decimali, in cui le cifre sono moltiplicate per potenze di 10 con esponente negativo.

$$
c_{m-1} c_{m-2} \dots c_0, c_{-1} \dots c_{-k} = c_{m-1} \cdot 10^{m-1} + c_{m-2} \cdot 10^{m-2} + \dots + c_0 \cdot 10^0 + c_{-1} \cdot 10^{-1} + \dots + c_{-k} \cdot 10^{-k}
$$

Da ciò, possiamo dedurre che un numero con virgola in base  $b$  è rappresentato nel sistema decimale dalla seguente sommatoria ( $m$  è il numero di cifre intere,  $k$  è il numero di cifre decimali):

$$
\sum_{i=-k}^{m-1} c_i \times b^i
$$

### Cambiamento di base per numeri con virgola

Per il cambiamento di un numero  $x$  da una base 'a' ad una base 'b' si procede separatamente per la parte intera e la parte frazionaria:

- PER LA PARTE INTERA si procede con l'algoritmo delle divisioni successive della parte intera del numero  $x$  per la base  $b$ ;
- PER LA PARTE FRAZIONARIA il procedimento è "inverso" al precedente. Si moltiplica la parte frazionaria di  $x$  per  $b$ : la parte intera del risultato, compreso tra 0 e  $b-1$ , una volta convertito in base  $b$ , costituisce la prima cifra frazionaria del numero  $x$  in base  $b$ . Dopodiché, si procede

---

<!-- Pagina 8 -->

iterativamente finché la parte frazionaria del risultato della moltiplicazione è 0 oppure si raggiunge il numero di cifre frazionarie desiderate (precisione).

Esempio: convertiamo in binario  $0,625_{10}$

#### PARTE INTERA

Lo 0 in base 10 corrisponde a 0 in base 2  
(non c'è bisogno di applicare l'algoritmo delle divisioni successive)

#### PARTE DECIMALE

Si prende la parte frazionaria del numero  $x$  e lo si moltiplica per la base 2 fino a quando la parte frazionaria è uguale a 0:

$$
0,625 * 2 = 1,250 \rightarrow c_1 = 1
$$

$$
0,250 * 2 = 0,500 \rightarrow c_2 = 0
$$

$$
0,500 * 2 = 1,000 \rightarrow c_3 = 1
$$

L'algoritmo di conversione termina e il risultato è:  $0,625_{10} = 0,101_2$

#### Rappresentazione in virgola fissa e mobile

Per rappresentare i numeri con virgola in macchina esistono varie strategie. Vedremo in seguito due tipologie di rappresentazione:

1. **RAPPRESENTAZIONE IN VIRGOLA FISSA**. Dato un registro la cui lunghezza è una parola di  $m$  bit, si suddivide questa parola in due porzioni: i primi  $h$  bit sono dedicati alla codifica della parte intera, invece, i rimanenti  $m-h$  bit sono dedicati alla codifica della parte frazionaria. Cioè, si sceglie a priori quanti bit dedicare alla parte intera e quanti a quella frazionaria. Sostanzialmente, è proprio questo lo svantaggio della rappresentazione in virgola fissa. La conseguenza è che non si possono né rappresentare numeri molto grandi, né rappresentare numeri molto precisi (per calcoli astronomici o finanziari potrebbero servire più bit per la parte intera, a differenza dei calcoli fisici nel quale è richiesta una maggior precisione, e, quindi, più bit per la parte frazionaria).
2. **RAPPRESENTAZIONE IN VIRGOLA MOBILE** (utilizzata dai calcolatori odierni). Per ovviare agli svantaggi dati dalla rappresentazione in virgola fissa, è stato studiato un tipo di rappresentazione diverso, detto rappresentazione in virgola mobile. Essa sfrutta una rappresentazione dei numeri reali secondo un formato ben preciso, cioè:

$$
x = (-1)^s * m * b^e
$$

- $s$  determina il segno di  $x$ :  $s = 0 \rightarrow (-1)^0 = 1 \rightarrow x$  è positivo,  $s = 1 \rightarrow (-1)^1 = -1 \rightarrow x$  è negativo;
- $m$  è detto mantissa;
- $e$  è detto esponente (esponenti positivi  $\rightarrow$  numeri molto grandi, esponenti negativi  $\rightarrow$  numeri molto vicini allo 0).

Un numero reale è, quindi, rappresentato dalla tripla  $(s, m, e)$ . Questa rappresentazione, però, non è univoca (ad esempio, in base 10,  $(0, 3467, -2)$  e  $(0, 0.3467, 2)$  rappresentano lo stesso numero  $x$ , cioè 34.67). Quindi, per ovviare a questo problema, bisogna scegliere un'unica rappresentazione prefissata, la rappresentazione scientifica, nel quale il valore della mantissa (parte intera) è:

$$
1 \leq m < b
$$

In base 2 si ha che la mantissa può assumere un unico valore, infatti:  $1 \leq m < 2 \rightarrow m = 1$ . Ciò significa che nella rappresentazione scientifica in base 2, la mantissa avrà sempre parte intera 1 ed è inutile, quindi, conservare in memoria quest'informazione (sottintesa).

La differenza principale tra le due rappresentazioni è che, mentre nella rappresentazione in virgola fissa tutti i valori rappresentabili hanno la stessa precisione (sia numeri molto grandi che quelli molto vicini allo 0), nella rappresentazione in virgola mobile si ha una precisione variabile, che è molto grande per tutti i valori rappresentabili vicini allo 0 e molto più piccola per i valori che si avvicinano man mano all'infinito (ciò vuol dire che è possibile rappresentare sia numeri piccolissimi con precisione elevata, sia numeri grandissimi con precisione meno affidabile).

#### Standard IEEE 754

Lo standard adottato oggigiorno da tutte le macchine per rappresentare in virgola mobile i numeri reali è lo "Standard IEEE 754" (IEEE sta per Institute of Electrical and Electronics Engineering ed è un consorzio che definisce nei vari ambiti dell'informatica, fisica, ingegneria elettronica, ecc. degli standard, proprio come fa W3C, che stabilisce degli standard nell'ambito dei protocolli web).

---

<!-- Pagina 9 -->

Questo standard prevede quattro diversi formati:

1. **Tipo semplice, precisione singola** (variabili di tipo "float" in c). I numeri rappresentati secondo questo formato sono conservati in parole di 32 bit:
   - Il MSB è adibito alla rappresentazione del segno;
   - 8 bit dedicati a rappresentare l'esponente;
   - I 23 bit rimanenti sono dedicati a rappresentare la parte frazionaria della mantissa (la parte intera è sempre uguale a 1).
2. **Tipo semplice, precisione doppia** (variabili di tipo "double" in c). I numeri rappresentati secondo questo formato sono conservati in parole di 64 bit:
   - Il MSB è adibito alla rappresentazione del segno;
   - 11 bit dedicati a rappresentare l'esponente;
   - I 52 bit rimanenti sono dedicati a rappresentare la parte frazionaria della mantissa (la parte intera è sempre uguale a 1).
3. **Tipo esteso, precisione singola;**
4. **Tipo esteso, precisione doppia;**

Dato che nello standard IEEE 754 il bit più significativo è dedicato alla rappresentazione del segno, la parte frazionaria della mantissa rappresenterà sempre un valore positivo ed è, quindi, codificato mediante la rappresentazione senza segno, a differenza dell'esponente (che ha un segno diverso rispetto a quello della mantissa) che viene codificato mediante la rappresentazione polarizzata.

### Rappresentazione polarizzata dell'esponente

Per la rappresentazione dell'esponente nello standard IEEE 754, si è notato che la rappresentazione in complemento a 2 è svantaggiosa nello studiare l'aritmetica dei numeri in virgola mobile (i numeri in binario con il MSB = 1, sono negativi, mentre i numeri in binario con il MSB = 0, sono positivi, e, sostanzialmente, "non si segue l'ordine della codifica in binario naturale").

Si è cercato, allora, di realizzare una rappresentazione un po' diversa, detta "polarizzata":

- Supposto di avere  $k$  bit associati all'esponente, il massimo esponente rappresentabile è:

$$
P = 2^{k-1} - 1 \quad P \text{ è detto fattore di polarizzazione}
$$

- Il valore  $e$  (compreso tra 0 e  $2^k - 1$ ) codifica l'esponente polarizzato  $e' = e - P$ ;
- Esempio:  $k = 3, P = 2^{3-1} - 1 = 3$  e il valore 'e' deve essere compreso tra 0 e  $2^3 = 7$ . Allora:

<table border="1">
<tbody>
<tr>
<td>$e = 0 \rightarrow e' = -3$</td>
<td>$e = 2 \rightarrow e' = -1$</td>
<td>$e = 4 \rightarrow e' = 1$</td>
<td>$e = 6 \rightarrow e' = 3$</td>
</tr>
<tr>
<td>$e = 1 \rightarrow e' = -2$</td>
<td>$e = 3 \rightarrow e' = 0$</td>
<td>$e = 5 \rightarrow e' = 2$</td>
<td>$e = 7 \rightarrow e' = 4$</td>
</tr>
</tbody>
</table>

La rappresentazione polarizzata è, allora, utile per far corrispondere a valori crescenti di 'e' esponenti crescenti, partendo da quelli negativi fino a quelli positivi, cosa che, nella rappresentazione in complemento a 2 non avviene (non si mantiene l'ordine naturale della codifica in binario).

### Eccezioni dello Standard IEEE 754

Riassumendo, ad ogni numero  $x$  è associata la tripla  $(s, m, e)$  che lo definisce nel modo seguente:

$$
x = (-1)^s \cdot 1.m \cdot 2^{e-P}
$$

- Il bit  $s$  è dedicato alla rappresentazione del segno di  $x$ ;
- La mantissa  $m$  adotta la rappresentazione scientifica ed ha parte intera sempre uguale ad 1;
- L'esponente  $e'$  è rappresentato mediante la rappresentazione polarizzata.

In questo tipo di rappresentazione, andando a moltiplicare  $1, m$  e  $2^{e-P}$  si ottiene sempre un numero diverso da zero. Per poter risolvere questo ed altri problemi, lo standard IEEE 754 considera delle eccezioni, delle configurazioni particolari che, per convenzione, rappresentano lo zero o altri numeri.

<table border="1">
<thead>
<tr>
<th></th>
<th>$e = 0$ (0000 0000<sub>2</sub>)</th>
<th>$e = 1 \dots 254$<br/>rappresentazioni naturali</th>
<th>$e = 255$ (1111 1111<sub>2</sub>)</th>
</tr>
</thead>
<tbody>
<tr>
<td>$m = 0$</td>
<td>$(-1)^s \cdot 0$</td>
<td>$(-1)^s \cdot 1,0 \cdot 2^{e-127}$</td>
<td>$(-1)^s \cdot \infty$</td>
</tr>
<tr>
<td>$m \neq 0$</td>
<td>$(-1)^s \cdot 0,m \cdot 2^{-126}$</td>
<td>$(-1)^s \cdot 1,m \cdot 2^{e-127}$</td>
<td>NAN (indefinito)</td>
</tr>
</tbody>
</table>

---

<!-- Pagina 10 -->

- Se la mantissa è uguale a 0 e l'esponente ha tutti i bit uguali a 0, allora la rappresentazione è 0 (indipendentemente dal valore del bit del segno);
- Se la mantissa è uguale a 0 e l'esponente ha tutti i bit uguali a 1, allora la rappresentazione è  $+\infty$  se il bit del segno è 0, oppure  $-\infty$  se il bit del segno è 1;
- Se la mantissa è diversa da 0 e l'esponente ha tutti i bit uguali a 0, allora la rappresentazione di un numero x non è più:

$$
(-1)^s * 1, m * 2^{e-127} \text{ (con 8 bit dedicati all'esponente polarizzato)}
$$

ma:

$$
(-1)^s * 0, m * 2^{-126}
$$

per riuscire a rappresentare numeri ancora più piccoli. Con la rappresentazione naturale si moltiplica 1, m per  $2^{-127}$ , ottenendo, così, sempre un numero più grande di  $2^{-127}$ . Invece, cambiando rappresentazione e utilizzando 0, m, si riesce a rappresentare anche numeri fino ad una parte frazionaria con 149 bit ( $2^{23} * 2^{-126} = 2^{-149}$ );

- Se la mantissa è diversa da 0 e l'esponente ha tutti i bit uguali a 1, per convenzione si ha il valore indefinito NaN (Not a Number, si utilizza nel linguaggio c in divisioni per 0, ad esempio).

### Operazioni in virgola mobile

Supponiamo di avere due numeri  $n_1$  e  $n_2$  rappresentati in virgola mobile dalle triple  $(s_1, m_1, e_1)$  e  $(s_2, m_2, e_2)$ .

1. La moltiplicazione ha per risultato un numero rappresentato dalla tripla  $(s, m, e)$  in cui:

- $s = 0$  se  $s_1 = s_2$ , cioè  $n_1$  e  $n_2$  sono concordi,  $s = 1$  se  $s_1 \neq s_2$ , cioè  $n_1$  e  $n_2$  sono discordi;
- La mantissa  $m$  è uguale al prodotto delle mantisse di  $n_1$  e  $n_2$  ( $m = m_1 * m_2$ );
- L'esponente 'e' è uguale alla somma degli esponenti di  $n_1$  e  $n_2$  ( $e = e_1 + e_2$ );

Di solito, dopo l'operazione, è necessario normalizzare il risultato secondo la rappresentazione scientifica.

1. La divisione si esegue in modo analogo alla moltiplicazione, solo che la mantissa è uguale al quoziente delle mantisse di  $n_1$  e  $n_2$  ( $m = m_1 / m_2$ ) e l'esponente 'e' è uguale alla differenza degli esponenti di  $n_1$  e  $n_2$  ( $e = e_1 - e_2$ ).

1. L'addizione e la sottrazione sono operazioni più complesse, poiché, prima di eseguirle, è necessario rendere uguali gli esponenti dei numeri  $n_1$  e  $n_2$ . Per far ciò, occorre eseguire degli scorrimenti delle mantisse che possono far perdere delle cifre significative (dato che i bit della mantissa sono fissati), attraverso l'approssimazione per eccesso o per difetto.

- Esempio: effettuare la somma tra  $n_1 = 1,3435 * 10^3$  e  $n_2 = 1,9970 * 10^5$  con 4 cifre della mantissa. Prima di tutto bisogna portare l'esponente di  $n_1$  da 3 a 5:

$$
n_1 = 1,3435 * 10^3 \rightarrow n_1 = 0,013435 * 10^5
$$

Dato che le cifre della mantissa sono 4, arrotondiamo per difetto il valore della mantissa di  $n_1$ , ottenendo così:

$$
n_1 = 0,0134 * 10^5
$$

La somma dei due numeri  $n_1$  e  $n_2$  è:  $2,0104 * 10^5$  (invece di  $2,010435 * 10^5$ ).

### Rappresentazione dei caratteri alfa-numerici

I registri di un calcolatore non sono utilizzati solo per conservare parole binarie che decodificano numeri interi o reali, ma, ad esempio, nei linguaggi di programmazione sono presenti anche tipi di dato (char) utilizzati per codificare caratteri alfabetici, caratteri numerici, segni di punteggiatura e altri simboli particolari. Esistono vari tipi di codifiche per rappresentare questi caratteri:

- Codifica ASCII a 7 bit (1968);
- Codifica ASCII a 8 bit (1980);
- Codifica Unicode a 21 bit (1991). La codifica di un carattere tramite Unicode ha il seguente formato: U+ (cifre esadecimali);
- Codifica UTF-8 è una codifica di caratteri Unicode a lunghezza variabile da 1 a 4 byte, retrocompatibile con ASCII e utilizzato come standard nei linguaggi XML e HTML (1992). Il primo byte di un carattere indica quanto è lunga la sequenza di bit.

---

<!-- Pagina 11 -->

<table border="1">
<thead>
<tr>
<th>Primo byte</th>
<th>Byte totali a disposizione</th>
<th>Bit rimanenti per la codifica del carattere</th>
</tr>
</thead>
<tbody>
<tr>
<td>0xxx xxxx</td>
<td>1 = 8 bit</td>
<td>7 (8-1 bit)</td>
</tr>
<tr>
<td>110x xxxx</td>
<td>2 = 16 bit</td>
<td>11 (16-3-2 bit)</td>
</tr>
<tr>
<td>1110 xxxx</td>
<td>3 = 24 bit</td>
<td>16 (24-4-2-2 bit)</td>
</tr>
<tr>
<td>1111 0xxx</td>
<td>4 = 32 bit</td>
<td>21 (32-5-2-2-2 bit)</td>
</tr>
</tbody>
</table>

Per convenzione, tutti i byte successivi hanno come primi due bit 10.

## Algebra di Boole e reti combinatorie

Per poter studiare l'architettura di un calcolatore elettronico non partiremo dallo studio degli elettroni (equazioni di Maxwell o leggi di Kirchhoff), bensì da un livello di astrazione più alto. Infatti, per un computer scientist la fisica che sottende l'architettura di un calcolatore ha una rilevanza secondaria poiché maggiormente interessato alla struttura logica e al funzionamento astratto di un calcolatore, ma anche a come lavorano le sue più piccole componenti (elettronica digitale).

Come abbiamo visto finora, un calcolatore è una macchina che manipola e memorizza informazioni rappresentate (secondo varie modalità in base al tipo di informazione) in codice binario.

Le porte logiche sono i mattoni fondamentali che costituiscono un calcolatore. Sostanzialmente, sono dei circuiti digitali che realizzano delle operazioni. Prendono uno o più input (generalmente indicati con le prime lettere maiuscole dell'alfabeto) e restituiscono un output (indicato con le ultime lettere dell'alfabeto). Gli input/output sono rappresentati fisicamente da dei pin circuitali, e possono assumere sia valore 0 che 1, proprio come le variabili booleane (a livello logico).

### Porte logiche

Prima di tutto bisogna sapere che, algebricamente parlando, le funzioni che realizzano le porte logiche sono descritte mediante le tabelle di verità, ovvero una tabella nel quale a sinistra si trovano tutte le possibili combinazioni degli n input (dato che l'input può assumere solo due valori le possibili combinazioni sono  $2^n$ ), invece a destra si trova l'output corrispondente.

Le principali porte logiche sono:

- PORTA NOT: restituisce in output il complemento dell'input. Il simbolo grafico utilizzato per indicare questa porta è il seguente:

![Diagram of a NOT gate. It is a triangle pointing to the right. The input is labeled '1 input' and 'A' at the left vertex. The output is labeled 'Y' at the ri...](images/p011_fig01.png)

Il simbolo algebrico che indica la porta NOT è il seguente:  $Y = \bar{A}$

La tabella di verità che descrive la porta NOT è la seguente:

<table border="1">
<thead>
<tr>
<th>A</th>
<th>Y</th>
</tr>
</thead>
<tbody>
<tr>
<td>0</td>
<td>1</td>
</tr>
<tr>
<td>1</td>
<td>0</td>
</tr>
</tbody>
</table>

→ OUTPUT OPPOSTO ALL' INPUT.

Sostanzialmente, Y è uguale a 1 se e solo se A non è uguale a 1.

- PORTA AND: restituisce in output la congiunzione degli input. Il simbolo grafico utilizzato per indicare questa porta è il seguente:

![Diagram of an AND gate. It is a D-shaped symbol pointing to the right. The inputs are labeled '2 inputs' and 'A' and 'B' at the left side. The output is labe...](images/p011_fig02.png)

---

<!-- Pagina 12 -->

Il simbolo algebrico che indica la porta AND è il seguente:  $Y = AB$  (moltiplicazione)

La tabella di verità che descrive la porta AND è la seguente:

<table border="1">
<thead>
<tr>
<th>A</th>
<th>B</th>
<th>Y</th>
</tr>
</thead>
<tbody>
<tr>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>0</td>
<td>1</td>
<td>0</td>
</tr>
<tr>
<td>1</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>1</td>
<td>1</td>
<td>1</td>
</tr>
</tbody>
</table>

→ moltiplicare

Sostanzialmente, Y è uguale a 1 se e solo se A e B sono contemporaneamente uguali a 1.

- PORTA OR: restituisce in output la **disgiunzione degli input**. Il simbolo grafico utilizzato per indicare questa porta è il seguente:

![Hand-drawn symbol for an OR gate. It shows a D-shaped symbol with two inputs labeled A and B on the left and one output labeled Y on the right. A handwritten...](images/p012_fig01.png)

Il simbolo algebrico che indica la porta OR è il seguente:  $Y = A + B$

La tabella di verità che descrive la porta OR è la seguente:

<table border="1">
<thead>
<tr>
<th>A</th>
<th>B</th>
<th>Y</th>
</tr>
</thead>
<tbody>
<tr>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>0</td>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td>1</td>
<td>0</td>
<td>1</td>
</tr>
<tr>
<td>1</td>
<td>1</td>
<td>1</td>
</tr>
</tbody>
</table>

→ SOMMA

Sostanzialmente, Y è uguale a 1 se e solo se A è uguale a 1 e B è uguale a 0, B è uguale a 1 e A è uguale a 0, oppure entrambi sono uguali a 1.

- PORTA XOR o EXCLUSIVE OR, PORTA NAND e PORTA NOR:

### XOR

![Hand-drawn symbol for an XOR gate. It shows a D-shaped symbol with two inputs labeled A and B on the left and one output labeled Y on the right. A handwritte...](images/p012_fig02.png)

### NAND

![Hand-drawn symbol for a NAND gate. It shows a D-shaped symbol with two inputs labeled A and B on the left and one output labeled Y on the right. A handwritte...](images/p012_fig03.png)

### NOR

![Hand-drawn symbol for a NOR gate. It shows a D-shaped symbol with two inputs labeled A and B on the left and one output labeled Y on the right. A handwritten...](images/p012_fig04.png)

Per quanto riguarda la porta XOR, Y è uguale a 1 se e solo se solo uno tra A e B è uguale a 1, ovvero quando  $A \neq B$ . La porta XOR può essere ottenuta utilizzando solo porte AND, OR e NOT:

![Logic circuit diagram for an XOR gate using AND, OR, and NOT gates. Input A and B are connected to two NOT gates. The outputs of these NOT gates are connecte...](images/p012_fig05.png)

A è diverso da B se e solo se  $A = 1$  e  $B = 0$  oppure  $A = 0$  e  $B = 1$ . Questa proposizione, si sintetizza in logica booleana in un OR di due sottoespressioni: la prima è  $A \cdot \bar{B}$  e la seconda è  $\bar{A} \cdot B$ .

---

<!-- Pagina 13 -->

Invece, la porta **NAND** restituisce 1 se e solo se almeno uno tra A e B è uguale a 0. Si ottiene l'output complementando l'output di una normale porta AND (identificato dal pallino dopo la porta), quindi mettendo in serie una porta AND ed una porta NOT.

Infine, la porta **NOR** restituisce 1 se e solo se A e B sono contemporaneamente uguali a 0. Anche in questo caso si ottiene l'output complementando l'output di una normale porta OR (identificato dal pallino dopo la porta), quindi mettendo in serie una porta OR ed una porta NOT.

- **PORTA XNOR**: restituisce il **complemento dell'output** di una porta **XOR**. Il simbolo grafico utilizzato per indicare questa porta è il seguente:

### XNOR

![Symbol for an XNOR gate, which is a D-shaped symbol with a small circle at the output. Two inputs, A and B, enter from the left, and the output Y exits from...](images/p013_fig01.png)

Il simbolo algebrico che indica la porta XNOR è il seguente:  $Y = \overline{A \oplus B}$

La tabella di verità che descrive la porta XNOR è la seguente:

<table border="1"><thead><tr><th>A</th><th>B</th><th>Y</th></tr></thead><tbody><tr><td>0</td><td>0</td><td>1</td></tr><tr><td>0</td><td>1</td><td>0</td></tr><tr><td>1</td><td>0</td><td>0</td></tr><tr><td>1</td><td>1</td><td>1</td></tr></tbody></table>

*output comple  
mentare  
da 0 ne 1  
da 1*

**SOMMA**

Sostanzialmente, Y è uguale a 1 se e solo se A è uguale a B (doppia implicazione algebrica).

- **PORTE LOGICHE A PIÙ INGRESSI**: a tutte le porte logiche appena studiate è anche possibile **estendere il numero di ingressi**. In questo caso, ad ogni combinazione di tutti gli input corrisponde un solo output. Esso non è altro che il risultato dell'operazione della funzione descritta dalla porta logica tra tutti gli input (ad esempio un AND a 4 ingressi esegue la moltiplicazione tra i 4 input, così come un OR a 4 ingressi esegue la "somma" tra i 4 input).

Fin ad ora **abbiamo studiato** una descrizione funzionale delle principali porte logiche, ovvero abbiamo descritto la **relazione** che c'è **tra gli ingressi e l'uscita** di una porta logica. Queste porte logiche, però, **corrispondono** a degli **elementi circuitali** integrati nel nostro calcolatore.

Quindi, come fanno questi circuiti digitali a realizzare le porte logiche?

I valori che assumono gli I/O di una porta logica **sono rappresentati dal potenziale elettrico**:

- Il valore **logico 0** è rappresentato da un valore di potenziale elettrico di 0V (ground);
- Il valore **logico 1** è rappresentato da un valore di potenziale elettrico  $V_{dd}$  (dal generatore o dalla corrente passante per il trasformatore). Con l'avvento di cellulari e altri dispositivi portatili, il valore  $V_{dd}$  è passato da 5V a valori minori di 1,5V per evitare di consumare corrente molto velocemente.

I valori assunti dal potenziale elettrico, essendo una grandezza fisica continua, **crescono o decrescono in maniera continua** nel tempo. Ciò significa che mentre dal punto di vista **logico** un input o un output assume valore 0 o 1, dal punto di vista **fisico** non è possibile assicurarsi che il valore del potenziale elettrico sia esattamente GRD o  $V_{dd}$  con una precisione infinita, ma bisogna **considerare** che assumeranno dei **valori prossimi** a questi ultimi, in quanto ogni circuito digitale è soggetto a un **rumore** (dipende dalla struttura fisica dei componenti, da campi elettromagnetici esterni) che può alterare i valori nominali su cui operiamo. Quindi, si considera che il valore di un ingresso o di un'uscita è uguale a 0 o 1 se il valore di potenziale è compreso in un certo **range di tolleranza**

$$
0 \rightarrow GRD - V_{OL} \text{ e } 1 \rightarrow V_{OH} - V_{DD}
$$

È necessario che il valore del potenziale elettrico cresca o decresca in modo continuo il più velocemente possibile dal range alto a quello basso (e viceversa) per un corretto funzionamento di un circuito digitale (il tempo di transizione può essere trascurato, altrimenti è detto circuito analogico).

---

<!-- Pagina 14 -->

## Funzioni booleane

Le tabelle di verità delle porte logiche **descrivono delle funzioni booleane** in cui i valori degli argomenti in ingresso possono essere solo 0 o 1 (ogni combinazione può essere vista come una parola di bit). In generale, le porte logiche hanno  $n$  ingressi ed una sola uscita che, quindi, corrispondono ad una funzione booleana il cui dominio è una  $n$ -tupla di valori 0 e 1 (prodotto cartesiano dell'insieme  $\{0,1\}^n$  volte) e il cui codominio è l'insieme  $\{0,1\}$ :

$$
f: \{0,1\}^N \rightarrow \{0,1\}
$$

Se ho  $N$  variabili in ingresso, quante funzioni booleane esistono? La risposta è  $2^{2^N}$ . Dobbiamo considerare che una generica funzione booleana, nella tabella di verità, è rappresentata come una sequenza di bit. Se si hanno  $N$  variabili in ingresso, la lunghezza di questa parola è pari a  $2^N$  (ovvero il numero di combinazioni dell'input) e ogni bit può assumere valore 0 o 1, quindi il numero di combinazioni delle parole in output possibili è  $2^{2^N}$ .

### Funzioni booleane di 2 variabili (combinazioni input $2^2 = 4$ , funzioni booleane $2^4 = 16$ )

<table border="1">
<thead>
<tr>
<th>A</th>
<th>B</th>
<th>0</th>
<th>1</th>
<th>2</th>
<th>3</th>
<th>4</th>
<th>5</th>
<th>6</th>
<th>7</th>
<th>8</th>
<th>9</th>
<th>10</th>
<th>11</th>
<th>12</th>
<th>13</th>
<th>14</th>
<th>15</th>
</tr>
<tr>
<th></th>
<th></th>
<th>Funzione costante Y = 0</th>
<th>AND $Y = A\bar{B}$</th>
<th>$Y = \bar{A}B$</th>
<th>$Y = A$</th>
<th>$Y = \bar{A}B$</th>
<th>$Y = B$</th>
<th>XOR</th>
<th>OR</th>
<th>NOR</th>
<th>XNOR</th>
<th>$Y = \bar{B}$</th>
<th>$Y = \overline{AB}$<br/>($A + \bar{B}$)</th>
<th>$Y = \bar{A}$</th>
<th>$Y = \overline{AB}$<br/>($\bar{A} + B$)</th>
<th>NAND</th>
<th>Funzione costante Y = 1</th>
</tr>
</thead>
<tbody>
<tr>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td>1</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
</tr>
</tbody>
</table>

## Circuiti digitali

Abbiamo visto che la singola **porta XOR viene sintetizzata** da una struttura circuitale più complessa di **diverse porte AND, OR e NOT**. Una struttura di questo tipo è detta **rete combinatoria** (una sottoclasse dei più generici circuiti digitali).

Un circuito digitale è una **rete che elabora segnali discreti 0 e 1**. **A prescindere dalla sua configurazione interna**, può essere vista come una **black-box** che:

- ha **uno o più ingressi**;
- ha **uno o più output**;
- Una **specifica funzionale** che **descrive** (per ogni output e per tutte le combinazioni di ingressi) **la relazione tra gli input e l'output**;
- Una **specifica temporale** che **descrive il ritardo temporale** che intercorre affinché la **configurazione dei segnali dell'input** si propaghi nella rete e generi un certo **output** (i ritardi dipendono dalle singole porte logiche). Un elettronico deve essere in grado, allora, di costruire dei circuiti che non accumulino troppo ritardo, altrimenti il sistema è lento (la principale conseguenza è che la frequenza di clock della CPU non può mai essere inferiore ai ritardi accumulati dalle componenti).

La struttura interna di un circuito digitale è **costituita da elementi e nodi**:

- Un **elemento** è proprio un **circuito digitale** (una porta logica o una rete combinatoria più complessa);
- Un **nodo** è una **connessione che trasporta il segnale da un elemento all'altro**. Distinguiamo tre tipi di nodi in un circuito digitale:
  1. Un nodo di **input** è una connessione che riceve un segnale dal mondo esterno;
  2. Un nodo di **output** è una connessione che riporta un segnale al mondo esterno;
  3. Un nodo **interno** è un nodo che connette l'output di un elemento con l'input di un altro elemento;

---

<!-- Pagina 15 -->

I circuiti digitali si suddividono in **due macrocategorie**:

1. **RETI COMBINATORIE**: sono dei circuiti in cui, istante per istante, i valori degli output dipendono esclusivamente dai valori correnti degli input e non da quello che è successo precedentemente nel circuito (per questo sono anche dette **reti senza memoria**);
2. **RETI SEQUENZIALI**: sono dei circuiti in cui i valori degli output dipendono sia dai valori correnti degli input sia dai valori precedenti degli input, che condizionano il circuito a memorizzare un certo stato (per questo sono anche dette **reti con memoria**).

Data una certa configurazione di un circuito digitale, è facile **stabilire** se esso è una rete combinatoria grazie a delle **regole** elencate di seguito:

- Ogni elemento è esso stesso una rete combinatoria;
- Ogni nodo che non è un input non può connettere gli output di più elementi, cioè **deve connettere l'output di un unico elemento**;
- Il circuito **non deve contenere cicli**, cioè il segnale deve passare solo una volta in ogni nodo interno;

### **Da espressione booleana a tabella di verità**

Il calcolo di una tabella di verità a partire da un'espressione booleana è molto semplice: bisogna prima **calcolare le tabelle di verità di tutte le sottoespressioni**, da quelle più semplici fino a quelle che compongono l'espressione iniziale. In particolare, **un'espressione booleana corrisponde ad un'unica tabella di verità**.

### **Da tabella di verità a espressione booleana**

Siccome **più espressioni boleano diverse possono avere la stessa tabella di verità**, il **passaggio da tabella a espressione non è univoco**, ma ci sono infiniti modi di scrivere la stessa espressione. Però, data una tabella di verità, esistono delle **forme canoniche** per ricavare una delle sue possibili espressioni corrispondenti:

- **LA FORMA SOP** (somma di prodotti);
- **LA FORMA POS** (prodotto di somme);

Prima di poter descrivere queste forme canoniche, occorre dare alcune **definizioni preliminari**:

- **LITTERALE**: una variabile booleana (positiva o negata);
- **IMPLICANTE**: prodotto di letterali (AND);
- **MINTERMINE**: dato un insieme K di variabili boleano, un mintermine di K è un implicante che comprende tutte le variabili boleano di K (positive o negate). Il **numero di possibili mintermini** di un insieme K di cardinalità N è  $2^N$  (ad esempio  $K = \{A, B\} \rightarrow AB, \bar{A}B, A\bar{B}, \bar{A}\bar{B}$ );
- **MAXTERMINE**: dato un insieme K di variabili boleano, un maxtermine di K è una **somma di letterali** che comprende tutte le variabili boleano di K (positive o negate);
- **ORDINE DI PRECEDENZA DEGLI OPERATORI**: **not  $\rightarrow$  and  $\rightarrow$  or**

### **La forma SOP**

La forma canonica **SOP** (somma di prodotti di letterali) è un formato di scrittura di un'espressione booleana a partire da una tabella di verità. **Ogni riga della tabella di verità corrisponde ad un mintermine**, che viene enumerato proprio come la riga della tabella in cui si trova.

Per scrivere un'espressione booleana in questa forma canonica, **si effettua l'OR di tutti i mintermini che nella tabella di verità corrispondono ad un output pari a 1**. Ad esempio:

<table border="1"><thead><tr><th>A</th><th>B</th><th>Y</th><th>mintermine</th><th>nome del mintermine</th></tr></thead><tbody><tr><td>0</td><td>0</td><td>0</td><td>$\bar{A}\bar{B}$</td><td>$m_0$</td></tr><tr><td>0</td><td>1</td><td>1</td><td>$\bar{A}B$</td><td>$m_1$</td></tr><tr><td>1</td><td>0</td><td>0</td><td>$A\bar{B}$</td><td>$m_2$</td></tr><tr><td>1</td><td>1</td><td>1</td><td>$AB$</td><td>$m_3$</td></tr></tbody></table>

$$
Y = \bar{A}B + AB
$$

oppure

$$
Y = \sum (m_1, m_3)
$$

(l'output è espresso come somma di prodotti)

---

<!-- Pagina 16 -->

### La forma POS

La forma canonica **POS** (prodotto di somme di litterali) è la forma duale di quella SOP. Ogni riga della tabella di verità corrisponde ad un maxtermine, che viene enumerato proprio come la riga della tabella in cui si trova (ad esempio, con N litterali si hanno  $2^N$  maxtermini, enumerati da 0 a  $N-1$ ). I maxtermini non sono altro che i duali dei mintermini, cioè hanno un unico 0 che corrisponde ad una sola combinazione degli input. Anche la costruzione della forma POS è duale rispetto a quella della forma SOP, infatti, si effettua l'AND di tutti i maxtermini che nella tabella di verità corrispondono ad un output pari a 0. Ad esempio:

<table border="1">
<thead>
<tr>
<th>A</th>
<th>B</th>
<th>Y</th>
<th>maxtermine</th>
<th>nome del maxtermine</th>
</tr>
</thead>
<tbody>
<tr>
<td>0</td>
<td>0</td>
<td>0</td>
<td>$A + B$</td>
<td>$M_0$</td>
</tr>
<tr>
<td>0</td>
<td>1</td>
<td>1</td>
<td>$A + \bar{B}$</td>
<td>$M_1$</td>
</tr>
<tr>
<td>1</td>
<td>0</td>
<td>0</td>
<td>$\bar{A} + B$</td>
<td>$M_2$</td>
</tr>
<tr>
<td>1</td>
<td>1</td>
<td>1</td>
<td>$\bar{A} + \bar{B}$</td>
<td>$M_3$</td>
</tr>
</tbody>
</table>

$$
Y = (A + B) * (\bar{A} + B)
$$

oppure

$$
Y = \prod(M_0, M_2)
$$

(l'output è espresso come prodotto di somme)

Il maxtermine corrispondente ad una **combinazione degli input** è la somma tra i **litterali negati** (quando la variabile è uguale a 1) e i **litterali positivi** (quando la variabile è uguale a 0), esattamente il duale di come sono definiti i mintermini.

In generale, quando (in una tabella di verità) **il numero di output uguali a 1 è minore del numero di output uguali a 0**, conviene rappresentare la funzione in forma SOP.

Al contrario, quando il numero di output uguali a 0 è minore del numero di output uguali a 1, conviene rappresentare la funzione in forma POS.

Ovviamente, quando il numero di **output uguali a 0** è pressappoco uguale al numero di output uguali a 1, la lunghezza delle forme SOP e POS si equivalgono.

### Algebra di Boole

Come abbiamo già visto, una funzione booleana può essere espressa in infiniti modi diversi (forma SOP, forma POS, ecc.). Esistono delle **tecniche** che è possibile utilizzare per poter **semplificare** il più possibile un'espressione booleana (proprio come si fa con le espressioni algebriche). Per far ciò è necessario introdurre l'**algebra di Boole**: essa è un'algebra astratta che si applica in diversi contesti come l'elettronica, l'insiemistica e alla logica booleana, una logica che **permette di capire** se un **ragionamento** è corretto, a partire da alcune **proposizioni**, tramite delle regole ben precise. Nella logica booleana, le variabili booleane corrispondono a delle proposizioni che possono assumere valore **VERO (1)** oppure **FALSO (0)**, invece gli **operatori** corrispondono alle preposizioni coordinanti (e, o, non). Proprio per questo motivo l'algebra di Boole vien e principalmente utilizzata per descrivere e operare sui circuiti elettronici, è alla base della componentistica di un calcolatore, e con tutte le sue caratteristiche, assiomi e teoremi complessi è possibile descrivere delle proprietà che consentono di semplificare velocemente le espressioni booleane.

### Assiomi dell'algebra di Boole

<table border="1">
<thead>
<tr>
<th></th>
<th>Assioma</th>
<th></th>
<th>Assioma duale<br/>(ottenuto invertendo operatori e valori)</th>
<th>Descrizione</th>
</tr>
</thead>
<tbody>
<tr>
<td>A1</td>
<td>$B = 0 \text{ se } B \neq 1$</td>
<td>A1'</td>
<td>$B = 1 \text{ se } B \neq 0$</td>
<td>I litterali possono assumere esclusivamente solo valore 0 o 1</td>
</tr>
<tr>
<td>A2</td>
<td>$\bar{0} = 1$</td>
<td>A2'</td>
<td>$\bar{1} = 0$</td>
<td>Tabella di verità della porta NOT</td>
</tr>
<tr>
<td>A3</td>
<td>$0 * 0 = 0$</td>
<td>A3'</td>
<td>$1 + 1 = 1$</td>
<td>Tabella di verità delle porte AND/OR</td>
</tr>
<tr>
<td>A4</td>
<td>$1 * 1 = 1$</td>
<td>A4'</td>
<td>$0 + 0 = 0$</td>
<td>Tabella di verità delle porte AND/OR</td>
</tr>
<tr>
<td>A5</td>
<td>$0 * 1 = 1 * 0 = 0$</td>
<td>A5'</td>
<td>$1 + 0 = 0 + 1 = 1$</td>
<td>Tabella di verità delle porte AND/OR</td>
</tr>
</tbody>
</table>

---

<!-- Pagina 17 -->

### Teoremi ad una variabile

A partire dagli assiomi dell'algebra di Boole è possibile introdurre dei primi semplici teoremi:

<table border="1">
<thead>
<tr>
<th></th>
<th>Teorema</th>
<th></th>
<th>Teorema duale<br/>(ottenuto invertendo operatori e valori)</th>
<th>Nome</th>
</tr>
</thead>
<tbody>
<tr>
<td>T1</td>
<td>$B * 1 = B$</td>
<td>T1'</td>
<td>$B + 0 = B$</td>
<td>Identità</td>
</tr>
<tr>
<td>T2</td>
<td>$B * 0 = 0$</td>
<td>T2'</td>
<td>$B + 1 = 1$</td>
<td>Elemento neutro<br/>(la dimostrazione deriva direttamente dagli assiomi A3, A5)</td>
</tr>
<tr>
<td>T3</td>
<td>$B * B = B$</td>
<td>T3'</td>
<td>$B + B = B$</td>
<td>Idempotenza<br/>(la dimostrazione deriva direttamente dagli assiomi A3, A4)</td>
</tr>
<tr>
<td>T4</td>
<td>$\overline{\overline{B}} = B$</td>
<td>T4'</td>
<td>$\overline{\overline{B}} = B$</td>
<td>Involuzione<br/>(la dimostrazione deriva direttamente dall'assioma A2)</td>
</tr>
<tr>
<td>T5</td>
<td>$B * \overline{B} = 0$</td>
<td>T5'</td>
<td>$B + \overline{B} = 1$<br/>(anche detto principio del terzo escluso)</td>
<td>Complemento<br/>(la dimostrazione deriva direttamente dagli assiomi A2, A5)</td>
</tr>
</tbody>
</table>

### Dimostrazione di T1

Dall'assioma A1 sappiamo che il valore di B o è 0 oppure è 1. Quindi, la dimostrazione si suddivide in due casi:

- Supponiamo  $B = 1 \rightarrow B * 1 = 1 * 1 =$  (per l'assioma A4)  $= 1 = B$ ;
- Supponiamo  $B = 0 \rightarrow B * 1 = 0 * 1 =$  (per l'assioma A5)  $= 0 = B$ ;

### Dimostrazione di T1'

Dall'assioma A1 sappiamo che il valore di B o è 0 oppure è 1. Quindi, la dimostrazione si suddivide in due casi:

- Supponiamo  $B = 1 \rightarrow B + 0 = 1 + 0 =$  (per l'assioma A5')  $= 1 = B$ ;
- Supponiamo  $B = 0 \rightarrow B + 0 = 0 + 0 =$  (per l'assioma A4')  $= 0 = B$ ;

### Teoremi a più variabili

<table border="1">
<thead>
<tr>
<th></th>
<th>Teorema</th>
<th>Teorema duale<br/>(ottenuto invertendo operatori e valori)</th>
<th>Nome</th>
</tr>
</thead>
<tbody>
<tr>
<td>T6</td>
<td>$BC = CB$</td>
<td>$B + C = C + B$</td>
<td>Commutatività</td>
</tr>
<tr>
<td>T7</td>
<td>$(BC) * D = B * (CD)$</td>
<td>$(B + C) + D = B + (C + D)$</td>
<td>Associatività</td>
</tr>
<tr>
<td>T8</td>
<td>$B * (C + D) = BC + BD$<br/>(distributività del prodotto rispetto alla somma)</td>
<td>$B + CD = (B + C) * (B + D)$<br/>(distributività della somma rispetto al prodotto)</td>
<td>Distributività</td>
</tr>
<tr>
<td>T9</td>
<td>$B * (B + C) = B$</td>
<td>$B + BC = B$</td>
<td>Covering</td>
</tr>
<tr>
<td>T10</td>
<td>$BC + \overline{B}C = B$</td>
<td>$(B + C) * (B + \overline{C}) = B$</td>
<td>Combining</td>
</tr>
<tr>
<td>T11</td>
<td>$BC + \overline{B}D + CD = BC + \overline{B}D$</td>
<td>$(B + C) * (\overline{B} + D) * (C + D) =$<br/>$(B + C) * (\overline{B} + D)$</td>
<td>Consensus</td>
</tr>
</tbody>
</table>

I teoremi T6, T7 e T8 sono analoghi alle proprietà di commutatività, associatività e distributività del prodotto rispetto alla somma (e viceversa) nell'aritmetica semplice, a differenza dei teoremi T9, T10, T11 che sono specifici dell'algebra di Boole.

Esistono principalmente tre diversi metodi per dimostrare l'equivalenza di due espressioni:

1. PERFECT INDUCTION: dimostrare che due espressioni sono equivalenti vale a dire che corrispondono alla stessa tabella di verità. Ad esempio, dimostriamo il teorema T6 (commutatività):

$$
T6 \rightarrow BC = CB
$$

<table border="1">
<thead>
<tr>
<th>B</th>
<th>C</th>
<th>BC</th>
<th>CB</th>
</tr>
</thead>
<tbody>
<tr>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
</tr>
</tbody>
</table>

(le due operazioni di AND sono uguali)

---

<!-- Pagina 18 -->

Dimostriamo ora il teorema T9 (covering):

$$
T9 \rightarrow B * (B + C) = B
$$

<table border="1">
<thead>
<tr>
<th>B</th>
<th>C</th>
<th>$B + C$</th>
<th>$B * (B + C)$</th>
</tr>
</thead>
<tbody>
<tr>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>0</td>
<td>1</td>
<td>1</td>
<td>0</td>
</tr>
<tr>
<td>1</td>
<td>0</td>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
</tr>
</tbody>
</table>

(la prima e l'ultima colonna sono uguali)

Infine, dimostriamo il teorema T11 (consensus):

$$
T11 \rightarrow BC + \bar{B}D + CD = BC + \bar{B}D
$$

<table border="1">
<thead>
<tr>
<th>B</th>
<th>C</th>
<th>D</th>
<th>$BC + \bar{B}D + CD$</th>
<th>$BC + \bar{B}D$</th>
</tr>
</thead>
<tbody>
<tr>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>0</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>0</td>
</tr>
<tr>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>0</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>1</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
</tr>
</tbody>
</table>

(le ultime due colonne sono uguali)

La tecnica della perfect induction è molto semplice e utile per dimostrare teoremi a poche variabili. Il suo svolgimento diventa molto più laborioso al crescere del numero di variabili, in quanto il numero di combinazioni degli input nella tabella di verità cresce esponenzialmente.

2. **PROOF TEORETICO:** è un approccio nel quale, di volta in volta, si utilizzano assiomi e teoremi precedentemente dimostrati per dimostrare nuovi teoremi. Supponiamo di aver già dimostrato i teoremi da T1 a T8 e cerchiamo di dimostrare il teorema T9 (covering):

$$
T9 \rightarrow B * (B + C) = B
$$

Applichiamo T8 (distributività)  $\rightarrow B * (B + C) = BB + BC$

Applichiamo T3 (idempotenza)  $\rightarrow BB + BC = B + BC$

Applichiamo T8 (distributività)  $\rightarrow B + BC = B * (1 + C)$

Applichiamo T2 (el. neutro)  $\rightarrow B * (1 + C) = B * 1$

Applichiamo T1 (identità)  $\rightarrow B * 1 = B$

Proviamo, ora, a dimostrare il teorema T10 (combining):

$$
T10 \rightarrow (B * C) + (B * \bar{C}) = B
$$

Applichiamo T8 (distributività)  $\rightarrow (B * C) + (B * \bar{C}) = B * (C + \bar{C})$

Applichiamo T5' (complemento)  $\rightarrow B * (C + \bar{C}) = B * 1$

Applichiamo T1 (identità)  $\rightarrow B * 1 = B$

Infine, proviamo a dimostrare il teorema T11 (consensus):

$$
T11 \rightarrow BC + \bar{B}D + CD = BC + \bar{B}D
$$

Applichiamo T10 (combining)  $\rightarrow BC + \bar{B}D + CD = BC + \bar{B}D + (CDB + CDB\bar{B})$

Applichiamo T6 (commutatività)  $\rightarrow BC + \bar{B}D + (CDB + CDB\bar{B}) = BC + BCD + \bar{B}D + \bar{B}CD$

Applichiamo T7 (associatività)  $\rightarrow BC + BCD + \bar{B}D + \bar{B}CD = (BC + BCD) + (\bar{B}D + \bar{B}CD)$

Applichiamo T8 (distributività)  $\rightarrow (BC + BCD) + (\bar{B}D + \bar{B}CD) = (B + BD) * C + (\bar{B} + \bar{B}C) * D$

Applichiamo T9' (covering)  $\rightarrow (B + BD) * C + (\bar{B} + \bar{B}C) * D = BC + \bar{B}D$

3. **PER CASI RILEVANTI** è possibile sfruttare una combinazione delle due precedenti modalità, quindi, bisogna sia conoscere i teoremi fondamentali sia utilizzare le espressioni booleane risultanti per effettuare un check nelle tabelle di verità (solo su casi rilevanti e non per tutte le combinazioni possibili).

---

<!-- Pagina 19 -->

Ad esempio, consideriamo il teorema T11  $\rightarrow BC + \bar{B}D + CD = BC + \bar{B}D$ .

Vediamo che le due espressioni hanno in comune la sottoespressione  $BC + \bar{B}D$ , quindi possiamo considerare la seguente situazione:

$$
E = BC + \bar{B}D + CD \text{ e } F = BC + \bar{B}D. \text{ Allora: } E = F + CD.
$$

Quindi, possiamo distinguere due casi:

- Se  $F = 1$  allora  $E = 1$ ;
- Bisogna dimostrare che se  $E = 1$  allora  $F = 1$ .

Notiamo che  $E = 1$  se e solo se almeno uno dei tre implicanti  $BC, \bar{B}D, CD$  ritorna 1. In particolare, si deve dimostrare che  $CD$  è superfluo nell'espressione: così facendo, infatti, se  $CD = 1$  allora sicuramente almeno uno tra  $BC, \bar{B}D$  è uguale a 1 e la dimostrazione termina.

Come dimostrare che  $CD$  è superfluo?

Supponiamo che  $CD = 1$ . Per definizione  $C = 1$  e  $D = 1$  e quindi se  $B = 0 \rightarrow \bar{B}D = 1$  e  $BC = 0$ , altrimenti se  $B = 1 \rightarrow \bar{B}D = 0$  e  $BC = 1$ . In entrambi i casi, uno dei due implicanti è uguale a 1.

### Altri teoremi fondamentali

#### 1. Sostituzione di sottoespressioni

Data un'espressione booleana  $E$  che contiene una sottoespressione  $E_1$  e sapendo che tale espressione  $E_1$  è uguale ad un'altra espressione  $E_2$ , allora  $E$  è uguale a  $E'$  dove  $E'$  è un'espressione che sintetizza la stessa funzione booleana di  $E$ , ma sostituendo la sottoespressione  $E_1$  con la sottoespressione  $E_2$  (teorema valido anche nell'aritmetica).

Ad esempio, per il teorema T11 (consensus) sappiamo che:

$$
BC + \bar{B}D + CD = BC + \bar{B}D
$$

dove  $BC + \bar{B}D + CD$  rappresenta  $E_1$ , mentre  $BC + \bar{B}D$  rappresenta  $E_2$ . Allora nell'espressione:

$$
(BC + \bar{B}D + CD) * (FD + A)
$$

possiamo sostituire  $E_1$  con  $E_2$  ed ottenere quindi

$$
(BC + \bar{B}D) * (FD + A)
$$

che rappresenta la stessa funzione booleana dell'espressione precedente.

#### 2. Sostituzione di variabili booleane

Sapendo che due espressioni  $E_1$  e  $E_2$  sono uguali, allora saranno sicuramente uguali anche due espressioni  $E'_1$  e  $E'_2$  ottenute sostituendo una variabile booleana con una qualsiasi espressione  $E$ .

Ad esempio, supponiamo che:

$$
A = A\bar{B} + AB
$$

Allora possiamo sostituire nella seguente espressione questa sottoespressione che corrisponde alla variabile booleana  $A$ :

$$
A\bar{D}\bar{C}\bar{B} + A\bar{D}\bar{C}B = A\bar{B} + AB * (\bar{D}\bar{C} + \bar{D}\bar{C}) = A * (\bar{D}\bar{C} + \bar{D}\bar{C}) = A\bar{D}\bar{C}
$$

#### 3. Negazione di un'espressione

Se due espressioni  $E_1$  e  $E_2$  sono uguali, allora anche le loro negate  $\bar{E}_1$  e  $\bar{E}_2$  sono uguali

#### Teorema di De Morgan

<table border="1"><thead><tr><th></th><th>Teorema</th><th>Teorema duale<br/>(ottenuto invertendo operatori e valori)</th><th>Nome</th></tr></thead><tbody><tr><td>T12</td><td>$\bar{A_0 A_1 A_2 \dots} = \bar{A_0} + \bar{A_1} + \bar{A_2} + \dots$</td><td>$\bar{A_0} + \bar{A_1} + \bar{A_2} + \dots = \overline{A_0 * A_1 * A_2 * \dots}$</td><td>Teorema di De Morgan</td></tr></tbody></table>

- La negata di un prodotto di litterali è uguale alla somma dei litterali negati;
- La negata di una somma di litterali è uguale al prodotto dei litterali negati;

Dal punto di vista circuitale la porta NAND corrisponde ad una porta OR i cui ingressi sono stati negati e, dualmente, la porta NOR corrisponde ad una porta AND i cui ingressi sono stati negati. Dai teorema di De Morgan deriva direttamente il principio di dualità con il quale ricaviamo tutti gli assiomi e i teoremi duali già studiati.

---

<!-- Pagina 20 -->

I teoremi di De Morgan possono essere usati per ridurre una generica espressione  $E$  in forma SOP/POS senza «passare» per la tabella di verità:

- Si devono applicare ripetutamente i teoremi di De Morgan per spingere le negazioni dentro la struttura della formula fino ad avere dei literali;
- Se si vuole ottenere la forma SOP si applica ripetutamente il teorema della distributività dell'AND rispetto all'OR;
- Altrimenti, se si vuole ottenere la forma POS si applica ripetutamente il teorema della distributività dell'OR rispetto all'AND.

Inoltre, i teoremi di De Morgan consentono anche di ricavare la forma POS di un'espressione booleana a partire dalla sua forma SOP (e viceversa):

- Supponiamo di avere la tabella di verità di una funzione booleana.

<table border="1"><thead><tr><th>A</th><th>B</th><th>Y</th><th>$\bar{Y}$</th><th>mintermine</th></tr></thead><tbody><tr><td>0</td><td>0</td><td>0</td><td>1</td><td>$\bar{A}\bar{B}$</td></tr><tr><td>0</td><td>1</td><td>0</td><td>1</td><td>$\bar{A}B$</td></tr><tr><td>1</td><td>0</td><td>1</td><td>0</td><td>$A\bar{B}$</td></tr><tr><td>1</td><td>1</td><td>1</td><td>0</td><td>$AB$</td></tr></tbody></table>

- Creiamo la forma SOP della funzione booleana negata prendendo i mintermini che corrispondono all'output della funzione negata uguale a 0.

$$
\bar{Y} = \bar{A}\bar{B} + \bar{A}B
$$

- A questo punto neghiamo nuovamente la funzione booleana (sia la prima che la seconda espressione).

$$
\bar{\bar{Y}} = \overline{\bar{A}\bar{B} + \bar{A}B} = \overline{\bar{A}\bar{B}} * \overline{\bar{A}B} = (A + B) * (A + \bar{B})
$$

che è proprio uguale all'espressione nel caso in cui avessimo preso i maxtermini della funzione in corrispondenza dell'output negato uguale a 0.

### Completezza degli operatori

Tutte le funzioni booleane sono del tipo  $f: \{0,1\}^N \rightarrow \{0,1\}$  e possono essere sintetizzate in espressioni booleane secondo la forma canonica SOP/POS. Dato che la forma SOP/POS utilizza solo gli operatori AND, OR e NOT, questo vuol dire che questo insieme di operatori è completo, cioè che ogni funzione booleana può essere espressa mediante combinazioni di questi tre soli operatori. In particolare, per le leggi di De Morgan:

- L'operatore AND può essere espresso in termini delle porte OR e NOT ( $AB = \overline{\bar{A} + \bar{B}}$ );

- L'operatore OR può essere espresso in termini delle porte AND e NOT ( $A + B = \overline{\bar{A}\bar{B}}$ );

Questo vuol dire che l'insieme di operatori {AND, OR, NOT} è completo ma non è il più piccolo, in quanto anche con gli insiemi di operatori {AND, NOT} e {OR, NOT} si possono rappresentare tutte le funzioni booleane (si dimostra facilmente che questi sono insiemi completi minimali perché {AND}, {OR} e {NOT} da soli non sono completi).

### Schemi circuitali

Ad ogni espressione booleana corrisponde un circuito combinatorio. In particolare, le espressioni booleane in forma SOP hanno un formato dello schema circuitale corrispondente ben preciso:

- **PRIMO LIVELLO:** un OR finale che ha in ingresso l'output di un certo numero di sottoespressioni;
- **SECONDO LIVELLO:** queste sottoespressioni sono degli AND, i cui ingressi sono positivi o negati a seconda dell'espressione booleana (grazie all'utilizzo di porte NOT).

Proprio per questo motivo, le reti combinatorie che derivano da espressioni booleane in forma SOP sono dette "LOGICHE A DUE LIVELLI".

---

<!-- Pagina 22 -->

### Vantaggi delle forme SOP/POS

Supponiamo di avere un circuito che lavora con tanti altri circuiti e che restituisce l'output dopo un lungo periodo di tempo: dato che questo circuito ha un delay molto lungo, non si potrà avere una frequenza di clock veloce (tempo in cui i dispositivi elettronici si aggiornano), perché la frequenza non può scendere sotto il valore di questo delay critico. Quindi, uno dei vantaggi della forma SOP/POS è che ha uno schema circuitale molto regolare e dei ritardi omogenei, cioè tutti gli input seguono lo stesso percorso, passando per due porte (AND e OR) o tre porte (NOT, AND e OR) in cascata. Ciò significa che il ritardo che intercorre tra gli ingressi e l'output è pari alla somma dei ritardi di una porta AND e di una porta OR (perché il ritardo della porta NOT può essere trascurato).

### Semplificazione delle espressioni booleane

Il vantaggio principale della semplificazione delle espressioni booleane è, sostanzialmente, dato che ad una espressione booleana corrisponde un circuito digitale, l'utilizzo di meno porte logiche.

Alcuni teoremi per semplificare un'espressione booleana sono:

- Il T8 e T8' (distributività);
- Il T9 (covering); *principio della POS*
- Il T10 (combining): da questo teorema sappiamo che  $P\bar{B} + PB = P$  per ogni implicante  $P$ . Da questo teorema si può dedurre che un implicante è detto *implicante primo* se non può essere combinato con altri implicanti per ottenere un nuovo implicante con meno letterali. Da questo diremo che un'espressione SOP è minimale se e solo se tutti i suoi implicanti sono primi.

Quindi, la minimizzazione di un'espressione booleana punta a ridurre al minimo il numero di implicanti e il numero di letterali per ogni implicante.

Altri teoremi, invece, permettono di "complicare" temporaneamente l'espressione per ottenere poi la massima semplificazione. Questi sono:

- "EXPANSION"  $\rightarrow P = P\bar{A} + PA$  oppure  $A = A + AP$ ;
- Il T3 (idempotenza)  $\rightarrow A = A + A$  oppure  $A = A * A$ ;
- Il teorema della semplificazione  $\rightarrow P\bar{A} + A = P + A$  oppure  $PA + \bar{A} = P + \bar{A}$

### Proof teorico del teorema della semplificazione

$$
PA + \bar{A} = P + \bar{A}
$$

Applichiamo T9' (covering) per complicare temporaneamente l'espressione:

$$
PA + \bar{A} = PA + (\bar{A} + \bar{A}P)
$$

Applichiamo T6 e T6' (commutatività):

$$
PA + (\bar{A} + \bar{A}P) = PA + P\bar{A} + \bar{A}
$$

Applichiamo T8 (distributività):

$$
PA + P\bar{A} + \bar{A} = P * (A + \bar{A}) + \bar{A}
$$

Applichiamo T5' (complemento):

$$
P * (A + \bar{A}) + \bar{A} = P + \bar{A}
$$

$$
P\bar{A} + A = P + A
$$

Applichiamo T9' (covering) per complicare temporaneamente l'espressione:

$$
P\bar{A} + A = P\bar{A} + (A + AP)
$$

Applichiamo T6 e T6' (commutatività):

$$
P\bar{A} + (A + AP) = P\bar{A} + PA + A
$$

Applichiamo T8 (distributività):

$$
P\bar{A} + PA + A = P * (\bar{A} + A) + A
$$

Applichiamo T5' (complemento):

$$
P * (\bar{A} + A) + A = P + A
$$

---

<!-- Pagina 23 -->

### Circuito a priorità

![Schematic diagram of a Priority Circuit. It shows four input lines on the left labeled A3, A2, A1, and A0 from top to bottom. On the right, there are four ou...](images/p023_fig01.png)

Un circuito a priorità è un tipo di circuito che viene utilizzato per assegnare una certa risorsa condivisa da più richiedenti in un certo ordine di priorità. Ad esempio:

Abbiamo quattro richiedenti con priorità  $3 > 2 > 1 > 0$ .

Nel circuito, gli input  $A_3, A_2, A_1, A_0$  rappresentano le richieste della risorsa (ad esempio se  $A_1 = 1$ , allora il richiedente 1 sta facendo richiesta di questa risorsa; se, invece  $A_1 = 0$ , allora il richiedente 1 non sta facendo richiesta di risorse).

Gli output  $Y_3, Y_2, Y_1, Y_0$  rappresentano a chi viene assegnata la risorsa.

Di volta in volta, solo uno di essi sarà uguale a 1, mentre tutti gli altri saranno uguali a 0.

La tabella di verità di questo circuito a priorità è la seguente:

<table border="1">
<thead>
<tr>
<th>$A_3$</th>
<th>$A_2$</th>
<th>$A_1$</th>
<th>$A_0$</th>
<th>$Y_3$</th>
<th>$Y_2$</th>
<th>$Y_1$</th>
<th>$Y_0$</th>
</tr>
</thead>
<tbody>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td></tr>
<tr><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
</tbody>
</table>

Ogni output è uguale a 1 se e solo se:

- l'input corrispondente è uguale a 1;
- l'input corrispondente ha la priorità su tutti gli altri input.

Ad esempio, alla 8ª riga gli input  $A_2, A_1, A_0$  sono tutti uguali a 1, ma siccome il richiedente 2 ha la priorità sui richiedenti 1 e 0, solo l'input  $Y_2$  è uguale a 1 e, quindi, tutti gli altri output sono uguali a 0 poiché si può assegnare solo una risorsa alla volta.

Nella tabella di verità, inoltre, si possono notare i valori "don't cares", cioè quegli input che, a prescindere dal loro valore, non contano (ad esempio, quando  $A_3 = 1$ , il richiedente 3 ha la priorità sugli altri richiedenti e, quindi, a prescindere dal valore degli altri input, sarà comunque l'output  $Y_3$  ad essere uguale a 1 e tutti gli altri output uguali a 0).

Quindi, dopo aver introdotto la nozione di valore "don't cares" (X) è possibile semplificare graficamente la tabella di verità:

<table border="1">
<thead>
<tr>
<th>$A_3$</th>
<th>$A_2$</th>
<th>$A_1$</th>
<th>$A_0$</th>
<th>$Y_3$</th>
<th>$Y_2$</th>
<th>$Y_1$</th>
<th>$Y_0$</th>
</tr>
</thead>
<tbody>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td></tr>
<tr><td>0</td><td>0</td><td>1</td><td>X</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>X</td><td>X</td><td>0</td><td>1</td><td>0</td><td>0</td></tr>
<tr><td>1</td><td>X</td><td>X</td><td>X</td><td>1</td><td>0</td><td>0</td><td>0</td></tr>
</tbody>
</table>

Sintetizzare una tabella di verità con valori "don't cares" ci permette di costruire circuiti digitali molto più semplici rispetto a quelli che si sarebbero ottenuti da tabella di verità più lunghe (sostanzialmente, l'utilizzo dei valori "don't cares" ci permette di evitare di sintetizzare tutte le porte AND che hanno lo stesso output).

![Logic circuit diagram showing three AND gates. The inputs are labeled A3, A2, A1, and A0. The first AND gate has inputs A3, A2, and A1, with output Y3. The s...](images/p023_fig02.png)

appuntioncristastudenti.com

---

<!-- Pagina 24 -->

### Bubble pushing

Utilizzando delle logiche multilivello con più porte NAND e NOR, a volte risulta difficile capire quale funzione booleana sta sintetizzando il circuito in questione. Quindi, per comprendere più facilmente il funzionamento di un circuito di questo tipo, si può utilizzare la tecnica del bubble pushing, ovvero si possono applicare ricorsivamente le leggi di De Morgan partendo dall'output e procedendo a ritroso (passando per le porte NAND e NOR) fino agli input, cercando di fare in modo che ogni nodo o non abbia alcuna negazione o abbia una doppia negazione che si può eliminare. Attraverso questa tecnica si possono ottenere dei circuiti che rispettano la logica multilivello delle forme SOP/POS.

### Valori illegali

Un valore illegale è un valore assunto dell'output quando il nodo di output connette più output di altri elementi (ad esempio, un output che connette gli output di due porte NOT). Quindi, quello che succede dal punto di vista fisico è che il valore potenziale dell'output potrebbe:

- essere stabile ma indeterminato (potrebbe essere 0 o 1 ma senza una determinatezza);
- oscillare tra il valore GRD e  $V_{DD}$ ;
- avere un valore intermedio non interpretabile con 0 o 1.

In generale, questi stati causano una forte dissipazione di energia, in quanto si mettono in corto circuito due potenziali differenti (il circuito si brucia).

### Stati di alta impedenza e buffer tri-state

Nella logica booleana ogni nodo può assumere valore 0 o 1, però, dal punto di vista implementativo, è importante definire uno stato di alta impedenza  $Z$  floating, ovvero uno stato durante il quale non c'è passaggio di corrente (come se due parti di un circuito fossero scollegate). Per realizzare questo stato di alta impedenza si utilizzano dei buffer tri-state, dei buffer un po' diversi di quelli compresi nella trattazione della logica booleana. I buffer tri-state sono dotati di un ingresso  $\bar{E}$  detto inibitore o abilitatore dello stato di impedenza. Esistono due tipi di buffer tri-state:

- LOGICA POSITIVA: quando  $\bar{E} = 0$ , allora  $Y$  è nello stato di alta impedenza  $Z$ ; quando  $\bar{E} = 1$ , allora  $Y$  assume lo stesso valore dell'input;
- LOGICA NEGATA: quando  $\bar{E} = 1$  allora  $Y$  è nello stato di alta impedenza  $Z$ ; quando  $\bar{E} = 0$  allora  $Y$  assume lo stesso valore dell'input.

I buffer tri-state sono molto utili per consentire a più componenti condivise su un unico bus di fare in modo da (quando una sola componente invia dei segnali sul bus) scollegare tutte le altre componenti che altrimenti influenzerebbero il segnale, immettendo, quindi, degli stati illegali.

### Mappe di Karnaugh

Le mappe di Karnaugh sono un metodo per semplificare espressioni booleane in forma SOP. Questa tecnica utilizza le stesse proprietà e gli stessi teoremi già studiati per la semplificazione di espressioni booleane, attraverso uno schema grafico ben preciso. Il teorema principale utilizzato per semplificare un'espressione calcolata da una mappa di Karnaugh è il T9 (combining):

$$
AB + \bar{A}\bar{B} = A
$$

La semplificazione è eseguita nel seguente modo:

- Si scrive in forma matriciale la tabella di verità di una data funzione booleana:

<table border="1">
<thead>
<tr>
<th>A</th>
<th>B</th>
<th>C</th>
<th>Y</th>
</tr>
</thead>
<tbody>
<tr><td>0</td><td>0</td><td>0</td><td>1</td></tr>
<tr><td>0</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>0</td></tr>
</tbody>
</table>

<table border="1">
<thead>
<tr>
<th rowspan="2">Y</th>
<th rowspan="2">C</th>
<th colspan="4">AB</th>
</tr>
<tr>
<th>00</th>
<th>01</th>
<th>11</th>
<th>10</th>
</tr>
</thead>
<tbody>
<tr>
<td rowspan="2">0</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>1</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
</tbody>
</table>

<table border="1">
<thead>
<tr>
<th rowspan="2">Y</th>
<th rowspan="2">C</th>
<th colspan="4">AB</th>
</tr>
<tr>
<th>00</th>
<th>01</th>
<th>11</th>
<th>10</th>
</tr>
</thead>
<tbody>
<tr>
<td rowspan="2">0</td>
<td>0</td>
<td>$\bar{A}\bar{B}\bar{C}$</td>
<td>$\bar{A}\bar{B}C$</td>
<td>$\bar{A}BC$</td>
<td>$\bar{A}\bar{B}\bar{C}$</td>
</tr>
<tr>
<td>1</td>
<td>$\bar{A}\bar{B}C$</td>
<td>$\bar{A}BC$</td>
<td>$ABC$</td>
<td>$\bar{A}\bar{B}C$</td>
</tr>
</tbody>
</table>

---

<!-- Pagina 25 -->

- In questa forma matriciale (siccome si hanno tre variabili) le quattro colonne corrispondono alle configurazioni delle variabili A e B, invece le due righe corrispondono alle configurazioni della variabile C;
- Il valore di una cella della matrice corrisponde al valore dell'output della riga della tabella di verità corrispondente;
- Ogni cella della matrice rappresenta un mintermine. L'espressione in forma SOP di questa funzione è data dalla somma dei mintermini il cui valore nella cella è pari a 1. In questo esempio:

$$
Y = \bar{A}\bar{B}\bar{C} + \bar{A}\bar{B}C = \bar{A}\bar{B}(\bar{C} + C) = \bar{A}\bar{B}
$$

- Graficamente, quest'operazione può essere migliorata andando a selezionare celle della mappa di Karnaugh contigue il cui valore è 1. Nell'esempio, andando a selezionare queste due celle contigue, l'unica cosa che differisce (tra le due celle) è il valore di C (prima 0 e poi 1). Mettendo a fattor comune i valori costanti (combining), C può essere eliminata dall'espressione.

<table border="1">
<tr>
<td></td>
<td></td>
<th colspan="4">AB</th>
</tr>
<tr>
<td></td>
<th>C</th>
<th>00</th>
<th>01</th>
<th>11</th>
<th>10</th>
</tr>
<tr>
<th rowspan="2">Y</th>
<th>0</th>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<th>1</th>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
</table>

### Proprietà delle mappe di Karnaugh

Le mappe di Karnaugh rispettano alcune proprietà:

- **GRAY CODE:** le configurazioni delle variabili non sono disposte secondo la numerazione crescente, ma in modo tale che ogni singola configurazione differisce dalla successiva solo per il cambiamento di valore di una variabile (in modo da utilizzare il teorema del combining);
- **STRUTTURA TOROIDALE:** nella mappa di Karnaugh, tutte le celle sul bordo destro sono adiacenti alle celle sul bordo sinistro e tutte le celle sul bordo inferiore sono adiacenti alle celle sul bordo superiore (come se si potesse vedere la K-map su una ciambella);
- **BOLLA:** i raggruppamenti di celle contigue il cui valore è 1 sono anche detti "bolle";
- **Ad ogni bolla** nella mappa di Karnaugh corrisponde un unico implicante nell'espressione booleana, data dalle variabili il cui valore rimane costante;

Inoltre, le regole che occorre utilizzare per minimizzare una forma SOP utilizzando le K-map:

- **Utilizzare il minimo numero di bolle** in modo da ottenere un'espressione booleana con il numero minimo di implicanti e, per ogni implicante, il numero minimo di litterali;
- **Le bolle devono contenere solo celle** della mappa di Karnaugh contigue il cui valore è 1, quindi, prendendo solo i mintermini per cui la funzione è vera;
- **Le bolle possono contenere solo un numero di celle pari ad una potenza di 2**, in quanto ogni bolla deve considerare alcune variabili fisse e per le altre considerare tutte le possibili combinazioni;
- **Ogni bolla deve essere il più grande possibile;**
- **Una cella della mappa di Karnaugh può essere inclusa in più bolle diverse**, se questo serve a minimizzare ancora di più la forma SOP;
- **A partire da un'unica K-map, in base a come si raggruppano le bolle, si possono sintetizzare più forme minime di una espressione SOP.**

### Display a 7 segmenti

![Diagram of a 7-segment display decoder and its output segments.](images/p025_fig01.png)

---

<!-- Pagina 26 -->

Un display a 7 segmenti è un circuito combinatorio che prende in ingresso la codifica Binary Coded Decimal delle cifre del sistema decimale (ha 4 input di ingresso perché la codifica BCD utilizza 4 bit per rappresentare le cifre del sistema decimale) e ritorna in uscita 7 output, tanti quanto i segmenti del display. La tabella di verità di un display a 7 segmenti è la seguente:

<table border="1">
<thead>
<tr>
<th>Decimale</th>
<th>$D_3 D_2 D_1 D_0$</th>
<th>$S_a$</th>
<th>$S_b$</th>
<th>$S_c$</th>
<th>$S_d$</th>
<th>$S_e$</th>
<th>$S_f$</th>
<th>$S_g$</th>
</tr>
</thead>
<tbody>
<tr>
<td>0</td>
<td>0000</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>0</td>
</tr>
<tr>
<td>1</td>
<td>0001</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>2</td>
<td>0010</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>1</td>
</tr>
<tr>
<td>3</td>
<td>0011</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
</tr>
<tr>
<td>4</td>
<td>0100</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td>5</td>
<td>0101</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td>6</td>
<td>0110</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td>7</td>
<td>0111</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>8</td>
<td>1000</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td>9</td>
<td>1001</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td>altro</td>
<td>altro</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
</tbody>
</table>

Per costruire un circuito minimale è necessario semplificare tutte le forme SOP di tutte queste tabelle di verità (vediamo ad esempio la minimizzazione di  $S_a$  e  $S_b$ ):

![Karnaugh map for Sa. The map is a 4x4 grid with columns labeled D3:2 (00, 01, 11, 10) and rows labeled D1:0 (00, 01, 11, 10). The grid contains 1s at ](images/p026_fig01.png)

(Karnaugh map for Sa. The map is a 4x4 grid with columns labele...)

(Karnaugh map for Sb. The map is a 4x4 grid with columns labele...)

In queste mappe di Karnaugh abbiamo due variabili codificate lungo le righe e due variabili codificate lungo le colonne (entrambe le coppie di variabili utilizzano il codice di Gray). Per semplificare la funzione booleana corrispondente a  $S_a$  (lo stesso vale anche per  $S_b$ ):

- Bisogna scrivere 0 o 1 nella cella corrispondente alla combinazione che restituisce 0 o 1 nella tabella di verità;
- Cercare di utilizzare il numero minimo di bolle più ampie possibile (la dimensione deve sempre essere una potenza di 2) e facendo in modo che le bolle ricoprano solo valori 1 contigui;
- Ognuna di queste bolle corrisponde ad un implicante, quindi, non ci resta che scrivere la forma SOP equivalente di questa minimizzazione, ovvero:

$$
S_a = \overline{D_3} D_1 + \overline{D_3} D_2 \overline{D_0} + \overline{D_3} \overline{D_2} \overline{D_1} + \overline{D_2} \overline{D_1} \overline{D_0}
$$

$$
S_b = \overline{D_3} \overline{D_2} + \overline{D_2} \overline{D_1} + \overline{D_3} D_1 \overline{D_0} + \overline{D_3} \overline{D_1} \overline{D_0}
$$

---

<!-- Pagina 27 -->

## Valore di output "don't care" nelle K-maps

Come già visto nel circuito a priorità, i valori don't care in input sono utilizzati nel caso in cui l'output non dipende dal valore di questi ultimi (per avere una rappresentazione più succinta). Allo stesso modo, si possono avere anche dei valori don't care in output, proprio come accade nel circuito di un display a 7 segmenti, dove, per le configurazioni non utilizzate, il valore di output è irrilevante. Quindi, è possibile aggiornare la K-map degli output di un display a 7 segmenti:

![Two K-maps for 7-segment displays S_a and S_b. S_a K-map: Rows 00, 01, 11, 10; Columns 00, 01, 11, 10. Values: (00,00)=1, (00,01)=0, (00,11)=X, (00,10)=1; (0...](images/p027_fig01.png)

- Alle configurazioni in input corrispondenti a valori come 10, 11, 12, 13, 14, 15 che non devono essere rappresentati in un display a 7 segmenti si associa il valore don't care X;
- Così facendo, i valori don't care ci permettono di costruire bolle più grandi e, quindi, minimizzare ancora di più la forma SOP dell'espressione booleana corrispondente all'output:

$$
S_a = D_3 + D_2 D_0 + \overline{D_2} \overline{D_0} + D_1
$$

$$
S_b = \overline{D_2} + D_1 D_0 + \overline{D_1} \overline{D_0}
$$

## Esempio K-map - Trovare la forma minima SOP della seguente espressione utilizzando la K-map.

$$
[(C + D) * (A \oplus B)] + \overline{A} \overline{B} C + \overline{A} \overline{B} \overline{C}
$$

Questa espressione, dato che già è una forma SOP, è vera quando almeno uno dei termini è vero. Quindi, esaminiamo l'espressione termine per termine e vediamo a cosa corrisponde nella K-map:

<table border="1">
<thead>
<tr>
<th>TERMINE $\overline{A} \overline{B} C$<br/>(il valore della variabile D è indifferente)</th>
<th>TERMINE $\overline{A} \overline{B} \overline{C}$<br/>(il valore della variabile D è indifferente)</th>
<th>TERMINE $[(C + D) * (A \oplus B)]$</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<table border="1">
<tr><th colspan="2">AB</th><th>00</th><th>01</th><th>11</th><th>10</th></tr>
<tr><th>CD</th><th></th><th></th><th></th><th></th><th></th></tr>
<tr><td>00</td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>01</td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>11</td><td></td><td></td><td></td><td></td><td>1</td></tr>
<tr><td>10</td><td></td><td></td><td></td><td></td><td>1</td></tr>
</table>
</td>
<td>
<table border="1">
<tr><th colspan="2">AB</th><th>00</th><th>01</th><th>11</th><th>10</th></tr>
<tr><th>CD</th><th></th><th></th><th></th><th></th><th></th></tr>
<tr><td>00</td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>01</td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>11</td><td></td><td>1</td><td></td><td></td><td>1</td></tr>
<tr><td>10</td><td></td><td>1</td><td></td><td></td><td>1</td></tr>
</table>
</td>
<td>
<p>Per le porte AND, è più conveniente ragionare quando la sottoespressione è falsa, cioè quando almeno uno dei due termini è falso. Il termine $A \oplus B$ è falso quando $A = B$, invece $C + D$ è falsa quando entrambi C e D sono uguali a 0.</p>
</td>
</tr>
<tr>
<th>TERMINE $A \oplus B$</th>
<th>TERMINE $C + D$</th>
<th>K-map finale</th>
</tr>
<tr>
<td>
<table border="1">
<tr><th colspan="2">AB</th><th>00</th><th>01</th><th>11</th><th>10</th></tr>
<tr><th>CD</th><th></th><th></th><th></th><th></th><th></th></tr>
<tr><td>00</td><td></td><td>0</td><td></td><td>0</td><td></td></tr>
<tr><td>01</td><td></td><td>0</td><td></td><td>0</td><td></td></tr>
<tr><td>11</td><td></td><td>1</td><td></td><td>0</td><td>1</td></tr>
<tr><td>10</td><td></td><td>1</td><td></td><td>0</td><td>1</td></tr>
</table>
</td>
<td>
<table border="1">
<tr><th colspan="2">AB</th><th>00</th><th>01</th><th>11</th><th>10</th></tr>
<tr><th>CD</th><th></th><th></th><th></th><th></th><th></th></tr>
<tr><td>00</td><td></td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>01</td><td></td><td>0</td><td></td><td>0</td><td></td></tr>
<tr><td>11</td><td></td><td>1</td><td></td><td>0</td><td>1</td></tr>
<tr><td>10</td><td></td><td>1</td><td></td><td>0</td><td>1</td></tr>
</table>
</td>
<td>
<table border="1">
<tr><th colspan="2">AB</th><th>00</th><th>01</th><th>11</th><th>10</th></tr>
<tr><th>CD</th><th></th><th></th><th></th><th></th><th></th></tr>
<tr><td>00</td><td></td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>01</td><td></td><td>0</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>11</td><td></td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>10</td><td></td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
</table>
</td>
</tr>
<tr>
<td colspan="3" style="text-align: center;">Raggruppamento delle celle in bolle<br/>(sintetizzare la forma SOP minima)</td>
</tr>
<tr>
<td colspan="3">
<table border="1">
<tr><th colspan="2">AB</th><th>00</th><th>01</th><th>11</th><th>10</th></tr>
<tr><th>CD</th><th></th><th></th><th></th><th></th><th></th></tr>
<tr><td>00</td><td></td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>01</td><td></td><td>0</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>11</td><td></td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>10</td><td></td><td>1</td><td>1</td><td>0</td><td>1</td></tr>
</table>
</td>
</tr>
</tbody>
</table>

La forma SOP finale è, quindi, la seguente:  $Y = \overline{A} \overline{C} + \overline{B} C + \overline{A} B D + \overline{A} \overline{B} D$

---

<!-- Pagina 28 -->

### Multiplexer (selettore di linea)

Un multiplexer è una rete combinatoria il cui valore dell'output è uguale al valore dell'input indicato dal selettore. In un multiplexer ci sono:

- $2^N$  linee di input;
- Un'unica linea di output Y;
- N selettori (variabili booleane) che consentono di indicare quale di queste  $2^N$  linee di input è selezionata nell'uscita Y.

### Multiplexer 2:1

Il simbolo circuitale di un multiplexer 2:1 (2 linee di ingresso, 1 output) è il seguente:

![Circuit symbol for a 2:1 multiplexer. It is a trapezoidal shape with a selection input S at the top. Two data inputs, D0 and D1, are on the left, labeled 0 a...](images/p028_fig01.png)

Per vedere come funziona un multiplexer (non è altro che un circuito combinatorio) occorre scrivere la tabella di verità dell'output Y:

<table border="1">
<thead>
<tr>
<th>S</th>
<th>D<sub>1</sub></th>
<th>D<sub>0</sub></th>
<th>Y</th>
</tr>
</thead>
<tbody>
<tr><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>1</td></tr>
</tbody>
</table>

→ la tabella di verità corrisponde alla seguente mappa di Karnaugh

![Karnaugh map for a 2:1 multiplexer. The vertical axis is S (0, 1) and the horizontal axis is D1:0 (00, 01, 11, 10). The map shows four cells with 1s at (S=0,...](images/p028_fig02.png)

$$
Y = D_0 \bar{S} + D_1 S
$$

Questa espressione booleana relativa ad un multiplexer 2:1 può essere sintetizzata in forma SOP mediante:

Un circuito combinatorio

![Combinational logic circuit for a 2:1 multiplexer. It uses two AND gates and one OR gate. The top AND gate takes inputs D0 and NOT S. The bottom AND gate tak...](images/p028_fig03.png)

Buffer tri-state

![Tri-state buffer circuit for a 2:1 multiplexer. It consists of two tri-state buffers, T0 and T1. Input D0 is connected to T0, and input D1 is connected to T1...](images/p028_fig04.png)

Quando  $S=0$ , essendo T1 in logica positiva, allora D1 è scollegato da Y, invece quando  $S=1$ , essendo T0 in logica negativa, allora D0 è scollegato da Y.

### Multiplexer 4:1

Esistono anche multiplexer 4:1, cioè multiplexer con 4 linee di ingresso ed un'unica linea di uscita.

Dato che il numero di ingressi è  $2^2$ , allora, il numero di selettori è 2 (cioè  $\log_2(4)$ ).

---

<!-- Pagina 29 -->

![Circuit symbol for a 4-to-1 multiplexer with select lines S1:0, data lines D0-D3, and output Y.; Combinational network diagram showing a 4-to-1 multip](images/p029_fig01.png)

<table border="1">
<thead>
<tr>
<th>Simbolo circuitale</th>
<th>Rete combinatoria</th>
<th>Buffer tri-state<br/>(lo stato di alta impedenza è dato dal prodotto dei selettori $S_1 S_0$)</th>
<th>Multiplexer 2:1</th>
</tr>
</thead>
<tbody>
<tr>
<td>
(Circuit symbol for a 4-to-1 multiplexer with select lines S1:0...)
</td>
<td>
(Combinational network diagram showing a 4-to-1 multiplexer imp...)
</td>
<td>
(Diagram of a tri-state buffer array. Four buffers are shown, e...)
</td>
<td>
(Diagram of a 2-to-1 multiplexer implemented with two 2-to-1 mu...)
</td>
</tr>
</tbody>
</table>

### Sintetizzare funzioni booleane con i multiplexer

Un aspetto importante dei multiplexer è la possibilità di sintetizzare delle funzioni booleane, utilizzando le variabili booleane della funzione come selettori del multiplexer. Ad esempio, si può sintetizzare la funzione AND tra A e B con un multiplexer 4:1 nel seguente modo (siccome abbiamo 2 selettori, allora le linee di ingresso sono 4):

<table border="1">
<thead>
<tr>
<th>A</th>
<th>B</th>
<th>Y</th>
</tr>
</thead>
<tbody>
<tr>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>0</td>
<td>1</td>
<td>0</td>
</tr>
<tr>
<td>1</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>1</td>
<td>1</td>
<td>1</td>
</tr>
</tbody>
</table>

![Figura pagina 29](images/p029_fig02.png)

Ogni linea di ingresso corrisponde a una configurazione delle variabili selettrici A e B. Bisogna vedere la tabella di verità:

- nelle configurazioni per cui  $Y = 0$ , le linee di ingresso hanno il valore di potenziale GRD;

- nelle configurazioni per cui  $Y = 1$ , le linee di ingresso hanno il valore di potenziale  $V_{DD}$

![Diagram of a 4-to-1 multiplexer with select lines A and B, and data lines 00, 01, 10, 11. The 00, 01, and 10 lines are connected to ground (GRD), and the 11...](images/p029_fig03.png)

È anche possibile utilizzare un multiplexer con  $2^{M-1}$  ingressi (o anche meno) per sintetizzare una funzione booleana a M variabili:

- Le prime  $M-1$  variabili (o anche meno) sono utilizzate come selettori, quindi si va a suddividere la tabella di verità in sottogruppi in cui i selettori stessi hanno lo stesso valore (esempio sottostante);
- Le linee di ingresso sono poste al valore potenziale GRD (0) oppure al valore potenziale  $V_{DD}$  (1), oppure alle altre variabili rimaste (positive o negate).

Ad esempio, vediamo come sintetizzare la funzione AND tra A e B con un multiplexer 2:1:

<table border="1">
<thead>
<tr>
<th>A</th>
<th>B</th>
<th>Y</th>
</tr>
</thead>
<tbody>
<tr>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>0</td>
<td>1</td>
<td>0</td>
</tr>
<tr>
<td>1</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>1</td>
<td>1</td>
<td>1</td>
</tr>
</tbody>
</table>

  

<table border="1">
<thead>
<tr>
<th>A</th>
<th>Y</th>
</tr>
</thead>
<tbody>
<tr>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>1</td>
<td>B</td>
</tr>
</tbody>
</table>

![Figura pagina 29](images/p029_fig04.png)

Scegliamo la variabile A come seletttrice e l'altra variabile B può andare in ingresso positiva o negativa.

Per  $A=0 \rightarrow Y=0$  (non dipende dal valore di B).

Per  $A=1 \rightarrow Y=B$ , quindi  $Y=1$  solo quando sia A che B sono uguali a 1.

![Diagram of a 2-to-1 multiplexer with select line A and data lines 0 and 1. The 0 line is connected to ground (GRD), and the 1 line is connected to B. The out...](images/p029_fig05.png)

---

<!-- Pagina 30 -->

Vediamo come sintetizzare la funzione XOR tra A e B con un multiplexer 2:1:

<table border="1">
<thead>
<tr>
<th>A</th>
<th>B</th>
<th>Y</th>
<th>A</th>
<th>Y</th>
</tr>
</thead>
<tbody>
<tr>
<td>0</td>
<td>0</td>
<td>0</td>
<td rowspan="2">0</td>
<td rowspan="2">B</td>
</tr>
<tr>
<td>0</td>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td>1</td>
<td>0</td>
<td>1</td>
<td rowspan="2">1</td>
<td rowspan="2">$\bar{B}$</td>
</tr>
<tr>
<td>1</td>
<td>1</td>
<td>0</td>
</tr>
</tbody>
</table>

Scegliamo la variabile A come seletttrice e l'altra variabile B può andare in ingresso positiva o negata.

Per  $A=0 \rightarrow Y=B$ .

Per  $A=1 \rightarrow Y=\bar{B}$

![Diagram of a 2:1 multiplexer. The select line is labeled A. The data inputs are labeled 0 and 1, with the input to 1 being labeled B-bar. The output is label...](images/p030_fig01.png)

### Decoder

Il decoder è un elemento circuitale con N linee di ingresso e  $2^N$  linee di uscita. In un decoder, per ogni configurazione degli input solo l'output che corrisponde alla codifica degli ingressi può essere uguale a 1, mentre gli altri devono essere uguali a 0.

![Symbol for a 2:4 Decoder. It shows a rectangular block with inputs A1 and A0 on the left and four outputs Y3, Y2, Y1, Y0 on the right. The block is la](images/p030_fig02.png)

<table border="1">
<thead>
<tr>
<th>Simbolo</th>
<th>Tabella di verità</th>
<th>Schema circuitale</th>
</tr>
</thead>
<tbody>
<tr>
<td>
(Symbol for a 2:4 Decoder. It shows a rectangular block with in...)
</td>
<td>
<table border="1">
<thead>
<tr>
<th>$A_1$</th>
<th>$A_0$</th>
<th>$Y_3$</th>
<th>$Y_2$</th>
<th>$Y_1$</th>
<th>$Y_0$</th>
</tr>
</thead>
<tbody>
<tr>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
</tr>
<tr>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
</tr>
<tr>
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>1</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
</tbody>
</table>
</td>
<td>
(Circuit diagram of a 2:4 decoder. It shows two inputs A1 and A...)
</td>
</tr>
</tbody>
</table>

### Sintetizzare funzioni booleane con un decoder

Ogni linea di uscita corrisponde ad un mintermine in corrispondenza biunivoca con le configurazioni degli ingressi. Quindi, anche i decoder permettono di sintetizzare delle funzioni booleane:

- Si prende la funzione booleana;
- Si calcolano tutti i mintermini;
- Si vede nella tabella di verità dove la funzione è uguale a 1. Le linee di uscita (mintermini) che rispettano questa proprietà sono inseriti come input in una porta OR. Così facendo si ottiene l'espressione booleana corrispondente in forma SOP.

Un decoder ha una funzione molto importante all'interno di un calcolatore, in quanto è adibito alla gestione degli indirizzi di memoria. Cioè, è l'elemento circuitale che, dato un indirizzo di memoria, permette di andare a leggere o scrivere nella locazione di memoria corrispondente all'indirizzo. Ad esempio (nella figura), il decoder gestisce una memoria composta di soli 4 byte. Se la configurazione in input è 00, allora si va a leggere o scrivere nel byte  $Y_0$  (lo stesso vale per le altre tre configurazioni).

---

<!-- Pagina 32 -->

## Circuiti sequenziali

Prima di tutto bisogna capire qual è la differenza tra un circuito combinatorio ed uno sequenziale:

- In un circuito **combinatorio** l'output dipende solo dal valore corrente dall'input (con i dovuti ritardi dovuti al sistema fisico) e, per questo, sono detti *circuiti senza memoria*;
- In un circuito **sequenziale** l'output dipende sia dai valori correnti dell'input, ma anche dai suoi valori precedenti, cioè dalla storia che ha interessato questo circuito. Ecco perché si dice che i circuiti sequenziali *hanno memoria*;

Lo stato interno di un circuito sequenziale è un'informazione che rappresenta la "memoria" di un circuito, cioè tiene traccia dei valori precedenti dell'input (storia del circuito), ed è necessaria, insieme ai valori di input, per prevedere il comportamento del circuito stesso. Lo stato interno di un circuito è memorizzato da alcune componenti detti **LATCHES** e **FLIP-FLOP**.

I circuiti sequenziali si distinguono in **due macrocategorie**:

- **CIRCUITI SEQUENZIALI SINCRONI**: sono circuiti sequenziali in cui lo stato interno del circuito si aggiorna in modo sincrono con un clock esterno (frequenza di clock dei computer). All'interno di un calcolatore vi è il clock che, quindi, sincronizza lo stato di tutte le componenti del circuito (almeno quelle della CPU). Un circuito sequenziale sincrono ha una topologia ben precisa:
  - Circuiti combinatori che descrivono come evolve il sistema;
  - Banchi di flip-flop, detti registri, che servono a memorizzare lo stato interno del sistema.Alcuni esempi di circuiti sequenziali sincroni sono gli *automati di Mealy* e gli *automati di Moore*.
- **CIRCUITI SEQUENZIALI ASINCRONI**: sono circuiti sequenziali in cui lo stato interno non è pilotato da un clock esterno, ma si evolve in maniera asincrona rispetto ad altri sistemi ed altre componenti.

Un aspetto peculiare dei sistemi sequenziali (che li rende più complessi rispetto ai circuiti combinatori) è che questi, per mantenere memoria degli stati precedenti, sono retroazionati (sistemi con feedback). Nei circuiti combinatori, l'informazione (intesa come potenziale alto o potenziale 0 dell'input) si propaga dall'input verso l'output senza cicli, cioè senza che un nodo sia riportato indietro ad un nodo precedente. Invece, nei circuiti con retroazione i segnali di output sono riportati verso gli input, o più in generale, il segnale di un nodo viene riportato su un nodo precedente (il concetto di retroazione costituisce i fondamenti della cibernetica, cioè lo studio di sistemi in cui vi sono fenomeni di retroazione).

La memoria di un circuito (che influenzerà il comportamento futuro del sistema) è memorizzata in un suo stato interno. Per poter memorizzare fisicamente tale stato interno sono necessarie alcune componenti circuitali fondamentali (ne esistono anche altre come RAM e ROM che studieremo più avanti).

### Circuito bistabile

Un circuito bistabile è un circuito sequenziale composto da 2 porte NOT  $I_1$  e  $I_2$  retroazionate, in quanto l'output della porta  $I_1$  è riportato come input nella porta  $I_2$ . La stessa topologia può essere rappresentata in due modi diversi:

![Diagram of a simple linear bistable circuit. It consists of two NOT gates, labeled I2 and I1. The output of I2 is connected to the input of I1, and the outpu...](images/p032_fig01.png)

Il secondo circuito ha due output  $Q$  e  $\bar{Q}$  che hanno sempre valori opposti. Questo sistema ha solo due possibili configurazioni, in base a come è inizializzato il sistema:

---

<!-- Pagina 33 -->

1. Il sistema è inizializzato ponendo  $Q = 0 \rightarrow$  passando per la porta  $I_2 \rightarrow \bar{Q} = 1 \rightarrow$  passando per la porta  $I_1 \rightarrow Q = 0$ . Quindi, questa configurazione è consistente, cioè  $Q$  non oscilla perché è sempre 0 anche dopo esser passato per le due porte NOT (lo stesso anche per  $\bar{Q} = 1$ );
2. La configurazione opposta vede l'inizializzazione di  $Q = 1 \rightarrow$  passando per la porta  $I_2 \rightarrow \bar{Q} = 0 \rightarrow$  passando per la porta  $I_1 \rightarrow Q = 1$ . Anche questo sistema è coerente per lo stesso motivo precedente.

Dato che le due configurazioni possibili sono coerenti, allora si può dire che questo è un sistema che memorizza un bit 0 o 1 (in base al valore di  $Q$ ), ma non ci sono input per poter pilotare questo circuito (si può solo inizializzare il valore di  $Q$ ). Sostanzialmente, il circuito bistabile è una memoria di un solo valore costante.

### SR Latch

È un circuito sequenziale composto da due input  $S$  (set) e  $R$  (reset) e due output  $Q$  e  $\bar{Q}$ . Graficamente, il valore di  $Q$  corrisponde all'input  $R$ , invece il valore di  $\bar{Q}$  corrisponde all'input  $S$ . Poi, vi sono due porte NOR  $N_1$  e  $N_2$  i cui ingressi sono i seguenti:

- Per la porta NOR  $N_1$ , il primo ingresso corrisponde all'input  $R$ , mentre il secondo ingresso corrisponde all'output  $\bar{Q}$  dell'altra porta NOR  $N_2$ ;
- Per la porta NOR  $N_2$ , il primo ingresso corrisponde all'input  $S$ , mentre il secondo ingresso corrisponde all'output  $Q$  dell'altra porta NOR  $N_1$ .

![Circuit diagram of an SR Latch. It consists of two NOR gates, N1 and N2. Input R is connected to the top input of N1, and its output Q is connected to](images/p033_fig01.png)

<table border="1">
<thead>
<tr>
<th>Circuito sequenziale</th>
<th>Simbolo</th>
<th>Tabella di verità</th>
</tr>
</thead>
<tbody>
<tr>
<td>
(Circuit diagram of an SR Latch. It consists of two NOR gates,...)
</td>
<td>
(Symbol for an SR Latch. It is a rectangle with 'R' and 'Q' on...)
</td>
<td>
<table border="1">
<thead>
<tr>
<th>Case</th>
<th>S</th>
<th>R</th>
<th>Q</th>
<th>$\bar{Q}$</th>
</tr>
</thead>
<tbody>
<tr>
<td>IV</td>
<td>0</td>
<td>0</td>
<td>$Q_{prev}$</td>
<td>$\bar{Q}_{prev}$</td>
</tr>
<tr>
<td>I</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
</tr>
<tr>
<td>II</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
</tr>
<tr>
<td>III</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>0</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>

Analizziamo il comportamento di un SR LATCH mediante le 4 possibili combinazioni degli input:

1. $S = 1, R = 0$  (SET di  $Q$  a 1): l'operazione NOR di  $S=1$  con qualsiasi altro valore è sicuramente uguale a  $\bar{Q} = 0$  (l'output della porta NOR è la negazione dell'output di una porta OR). Riportando  $\bar{Q} = 0$  nell'ingresso dell'altra porta NOR, l'operazione NOR di  $R=0$  e  $\bar{Q} = 0$  è uguale a  $Q = 1$ . Questa configurazione è stabile (dopo il delay delle porte logiche, i valori dell'output si stabilizzano a  $\bar{Q} = 0$  e  $Q = 1$ ).
2. $S = 0, R = 1$  (RESET di  $Q$  a 0): rispetto alla precedente configurazione si ottengono valori simmetrici dell'output. L'operazione NOR di  $R=1$  con qualsiasi altro valore è sicuramente  $Q = 0$ . Riportando  $Q = 0$  nell'ingresso dell'altra porta NOR, l'operazione NOR di  $S=0$  e  $Q = 0$  è  $\bar{Q} = 1$ . Anche questa configurazione è stabile (dopo il delay delle porte logiche, i valori dell'output si stabilizzano a  $\bar{Q} = 1$  e  $Q = 0$ ).
3. $S = 0, R = 0$  (MANTIENE MEMORIA DI  $Q_{prev}$ ): per studiare questa configurazione è necessario fare delle ipotesi sul valore precedente di  $Q$ . Quindi, indichiamo con  $Q_{prev}$  il valore precedente di  $Q$  prima che i due input  $S$  e  $R$  si aggiornino a 0.
   - Supponiamo  $Q_{prev} = 0$ : l'operazione NOR tra  $Q=0$  e  $S=0$  dà come risultato  $\bar{Q} = 1$ . Dato che  $Q$  e  $\bar{Q}$  hanno valori opposti e sono stabili, allora questo stato è coerente;
   - Supponiamo  $Q_{prev} = 1$ : l'operazione NOR tra  $Q=1$  e  $S=0$  dà come risultato  $\bar{Q} = 0$ . Dato che  $Q$  e  $\bar{Q}$  hanno valori opposti e sono stabili, allora anche questo stato è coerente.
    Quindi, in questa configurazione, quando  $Q_{prev} = 0$ , allora  $Q=0$ , e, quando  $Q_{prev} = 1$ , allora  $Q=1$ .
4. $S = 1, R = 1$  (STATO NON VALIDO): l'operazione NOR di  $S=1$  con qualsiasi altro valore è sicuramente uguale a  $\bar{Q} = 0$ . Riportando  $\bar{Q} = 0$  nell'ingresso dell'altra porta NOR, l'operazione NOR di  $R=1$  e  $\bar{Q} = 0$  è uguale a  $Q = 0$ . Quindi, con questa combinazione degli input il sistema è nella configurazione  $\bar{Q} = 0$  e  $Q = 0$ , quindi il sistema è in uno stato non valido perché non è vero che  $\bar{Q} \neq NOT Q$ .

---

<!-- Pagina 34 -->

### Analisi di un SR Latch

(Questo è il caso particolare in cui gli input  $S = R = 1$  scendono contemporaneamente a  $S = R = 0$ . È anche la prova che uno stato oscillante è molto frequente in un circuito sequenziale)

Supponiamo che ad un istante  $t_0$  il valore di  $S = R = 1$ . Dopo un delay  $\delta$  delle porte logiche (nella maggior parte dei casi pari a 2ms), il valore di  $Q$  sarà 0 e il valore di  $\bar{Q} = 0$ . Supponiamo, ora, che in un istante  $t_1$  i valori  $S$  e  $R$  diventino contemporaneamente uguali a 0. Dopo un certo delay  $\delta$ :

- Si ottiene  $\bar{Q} = 1$  (risultato dell'operazione NOR tra  $S=0$  e  $Q=0$ ), quindi  $\bar{Q} = 1$  è retroazionato nella porta NOR insieme a  $R = 0$ ;
- Si ottiene  $Q = 1$  (risultato dell'operazione NOR tra  $R=0$  e  $\bar{Q} = 1$ ), quindi  $Q = 1$  è retroazionato nella porta NOR insieme a  $S = 0$ ;

Quindi, da un punto di vista puramente teorico siamo passati dalla combinazione di input  $S = R = 1$  con configurazione  $Q = 0$  e  $\bar{Q} = 0$  all'istante  $t_0 + \delta$  alla combinazione di  $S = R = 0$  con configurazione  $Q = 1$  e  $\bar{Q} = 1$  all'istante  $t_1 + \delta$ . Dopo un altro delay  $\delta$  si ritornerà alla configurazione  $Q = 0$  e  $\bar{Q} = 0$  (per i risultati delle operazioni NOR con ingressi retroazionati) e il sistema comincia così ad oscillare.

In realtà, le due porte logiche (da un punto di vista fisico) non avranno un delay uguale, ma uno molto molto simile. Proprio per questo motivo, gli output non vengono retroazionati contemporaneamente e, quindi, dopo un po' di oscillamenti, il sistema si stabilizza in uno stato che è impredicibile (dipende dalle caratteristiche delle componenti, molto difficili da prevedere).

SR Latch: verificare qual è l'output di  $Q$

![Timing diagram for an SR Latch showing signals S, R, and Q. S and R are inputs, and Q is the output. The diagram shows three distinct phases: 1. S and R are...](images/p034_fig01.png)

Inizialmente  $S = R = 0$ , quindi il sistema è in uno stato di memoria. Dato che non si conosce il valore di potenziale, lo si indica con questo doppio stato (ovviamente può essere 0 o 1). Subito dopo  $S=1$  e  $R=0$ , quindi il sistema si trova nello stato di SET, cioè  $Q=1$  (dopo un piccolo ritardo). Quando poi  $S$  passa da 1 a 0, il sistema si trova nuovamente nello stato di memoria ( $S=0$  e  $R=0$ ), quindi  $Q$  continua a mantenere il suo valore precedente. Dopodiché, dato che  $S=0$  e  $R=1$ , il sistema si trova in uno stato di RESET, cioè  $Q=0$  (dopo un piccolo ritardo). Il valore di output  $Q$  mantiene questo stato fino a quando l'input  $S$  ritorna a 1, portando il sistema in uno stato di SET. La prossima configurazione degli input è  $S=1$  e  $R=1$ , ovvero lo STATO NON VALIDO, in cui sia  $Q$  sia  $\bar{Q}$  assumono valore 0. Il valore 0 dell'output  $Q$  si mantiene anche quando le configurazioni degli input passano a  $S=0$  e  $R=1$  (RESET) e anche quando si ritorna nello STATO NON VALIDO. L'output  $Q$  torna a 1, infine, quando  $S=1$  e  $R=0$  nello stato di SET e si mantiene nello stato di memoria finale  $S=0$  e  $R=0$ .

---

<!-- Pagina 35 -->

## D Latch

![Symbol for D Latch: a rectangle with CLK on top, D on the left, and Q and Q-bar on the right.; Circuit diagram of a D Latch: an SR Latch with an inver](images/p035_fig01.png)

<table border="1">
<thead>
<tr>
<th>Simbolo</th>
<th>Circuito sequenziale</th>
<th>Tabella di verità</th>
</tr>
</thead>
<tbody>
<tr>
<td>(Symbol for D Latch: a rectangle with CLK on top, D on the left...)</td>
<td>(Circuit diagram of a D Latch: an SR Latch with an inverter on...)</td>
<td>
<table border="1">
<thead>
<tr>
<th>CLK</th>
<th>D</th>
<th>$\bar{D}$</th>
<th>S</th>
<th>R</th>
<th>Q</th>
<th>$\bar{Q}$</th>
</tr>
</thead>
<tbody>
<tr>
<td>0</td>
<td>X</td>
<td>$\bar{X}$</td>
<td>0</td>
<td>0</td>
<td>$Q_{prev}$</td>
<td>$\bar{Q}_{prev}$</td>
</tr>
<tr>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
</tr>
<tr>
<td>1</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>

Per evitare lo stato non valido di un SR Latch, è stato sviluppato il **D Latch**. Un D Latch è un **sistema sequenziale** che ha 2 input (**D e CLK**) e 2 output (**Q e  $\bar{Q}$** ):

- L'input **D** è l'input vero e proprio;
- L'input **CLK** (clock) è un input che **controlla quando l'output cambia o meno**. In particolare, abbiamo due casi:
  - **TRASPARENTE**: se **CLK=1**, allora il valore dell'input D passa fino a Q (dopo un certo ritardo);
  - **OPACO**: se **CLK=0**, allora Q mantiene il suo valore precedente. Quindi, in questo caso, il sistema è in uno stato in cui memorizza il valore di Q (indipendentemente da D).
- L'output Q ha sempre valore opposto all'output  $\bar{Q}$  (non è più presente lo stato non valido).

## D Flip-Flop

Un D Latch è un sistema sequenziale che ha 2 input (D e CLK) e 2 output (Q e  $\bar{Q}$ ). Il comportamento di un D Flip-Flop è nettamente diverso da quello di un D Latch perché nel transiente in cui il valore di CLK passa da 0 a 1, il sistema è trasparente e, quindi, il valore di D passa direttamente a Q (dopo un certo ritardo). In tutti gli altri stati, Q mantiene memoria del suo stato precedente. In altre parole, il valore di Q cambia solo durante la transizione da 0 a 1 di CLK.

Queste componenti sono dette **edge-triggered** perché non sono pilotate da un valore ma da una transizione di CLK da 0 a 1 (fronte di salita).

![Symbol for D Flip-Flop: a rectangle with a clock symbol on top, D on the left, and Q and Q-bar on the right.; Circuit diagram of a D Flip-Flop: two D ](images/p035_fig02.png)

<table border="1">
<thead>
<tr>
<th>Simbolo<br/>(completo o semplice)</th>
<th>Circuito sequenziale</th>
</tr>
</thead>
<tbody>
<tr>
<td>(Symbol for D Flip-Flop: a rectangle with a clock symbol on top...)</td>
<td>(Circuit diagram of a D Flip-Flop: two D Latches, L1 and L2, co...)</td>
</tr>
</tbody>
</table>

Un D Flip-Flop è costituito da due D Latch che sono controllati da due clock complementari (opposti), cioè da un clock che entra positivo nel D Latch L2 ed entra negativo nel D Latch L1. Quindi, proprio come accade nei D Latch:

- Se **CLK=0**, L1 è trasparente e L2 è opaco. Dato che L1 è trasparente, il valore di D passa direttamente in N1, che, però, non passa nel D Latch L2 proprio perché L2 è opaco, quindi L2 è nello stato in cui Q continua a mantenere memoria del suo stato precedente;
- Se **CLK=1**, si ha la situazione opposta, ovvero L1 è opaco e L2 è trasparente. Quindi, il valore di N1 passa fino a Q, invece il valore di D non passa attraverso L1 e nemmeno attraverso N1.

Ecco spiegato perché il valore di D passa fino a Q solo durante la transizione di CLK da 0 a 1: quando L1 è trasparente (CLK=0) le modifiche di D sono riportate in N1 (e si fermano perché L2 è opaco) e quando CLK passa da 0 a 1 allora il valore di N1 si riporta in Q, poi però questo valore non è più alterato perché le modifiche di D non passano per L1 (L1 è opaco).

---

<!-- Pagina 36 -->

## Differenze tra D latches e D Flip-Flop

![Timing diagram showing CLK and D signals. CLK is a periodic square wave. D is a signal that changes value arbitrarily between 0 and 1, independent of the CLK...](images/p036_fig01.png)

In questo esempio abbiamo un input **D che cambia valore tra 0 e 1 senza uno schema regolare**, a differenza dell'input **CLK che varia il suo valore tra 0 e 1 in modo periodico**. Andiamo a vedere i due comportamenti diversi del D Latch e del D Flip-Flop:

Analisi del D Latch:

![Timing diagram for a D Latch. CLK is a periodic square wave. D is an arbitrary signal. Q (latch) follows D only when CLK is high. When CLK is low, Q holds th...](images/p036_fig02.png)

Quando **CLK=0** sappiamo che il D Latch è **opaco** e quindi il valore **Q (latch) mantiene memoria dello stato precedente** (in questo esempio non sappiamo qual è. Non si trova contemporaneamente a 0 e 1).

Nell'intervallo di tempo in cui **CLK=1**, il D Latch è **trasparente**, quindi, dopo un certo ritardo (si vede dalla distanza tra i cambiamenti di D e Q), il valore di D si riporta in Q ( $D=0 \rightarrow Q=0$ ).

![Timing diagram for a D Latch showing the delay. When CLK is high, Q (latch) follows D with a small time delay. When CLK is low, Q (latch) holds the value it...](images/p036_fig03.png)

Allo stesso modo, quando **D diventa uguale a 1**, sempre dopo un certo ritardo, anche **Q diventa uguale a 1**, proprio perché il sistema è ancora **trasparente** (CLK è ancora uguale a 1).

Dopodiché, **CLK diventa 0** e, quindi, il circuito è opaco. Ciò vuol dire che **Q (latch) mantiene memoria dello stato precedente**, cioè 1.

![Timing diagram for a D Latch showing multiple updates. When CLK is high, Q (latch) follows D. When CLK is low, Q (latch) holds the value. The diagram shows t...](images/p036_fig04.png)

Quando il clock ritorna a 1, il D Latch è di nuovo **trasparente**. Allora, **inizialmente Q (latch) mantiene il suo valore perché D=1**. Subito dopo, però, il valore di D passa a 0, e con esso, anche Q (latch) si aggiorna a 0 (il sistema è trasparente e Q segue il fronte d'onda di D). Inoltre, **c'è un ulteriore aggiornamento (sempre mentre CLK=1)** quando D passa al valore 1 e, di conseguenza, anche il valore di Q è 1. Infine, si può notare che siccome il sistema è diventato opaco, anche se D cambia valore, l'output **Q (latch) mantiene memoria del valore precedente**, cioè 1.

---

<!-- Pagina 37 -->

### Analisi del D Flip-Flop:

![Timing diagram for a D flip-flop. It shows three signals: CLK (clock), D (data input), and Q (flop) (output). The CLK signal is a square wave. The D signal i...](images/p037_fig01.png)

Come già studiato, il valore di D passa fino a Q solo durante il fronte di salita di CLK, cioè durante la transizione di CLK da 0 a 1. Gli unici cambiamenti di valore dell'output Q (flop) sono, appunto, quando vi è la presenza di un fronte di salita, che, per essere precisi, sono due (passaggio del valore  $D = 0 \rightarrow Q(\text{flop}) = 0$  e passaggio del valore  $D = 1 \rightarrow Q(\text{flop}) = 1$ ).

### Registri: multi-bit Flip-Flop

Un flip-flop memorizza un singolo valore di output Q, un singolo bit 0 o 1. Invece, se si vuole memorizzare più valori è possibile utilizzare dei **MULTI-BIT FLIP-FLOP**, ovvero dei registri costituiti da tanti flip-flop connessi in parallelo e pilotati da un unico clock, ognuno dei quali memorizza un bit. Nell'esempio, si vede un registro dotato di 4 ingressi  $D_{3:0}$  e 4 uscite  $Q_{3:0}$  che permette di memorizzare una parola di 4 bit. Il registro continua a memorizzare la sua parola di 4 bit mentre il valore di CLK non si trova sul fronte di salita, ovvero nell'istante in cui il valore di CLK passa da 0 a 1. Appena il sistema diventa trasparente, i valori  $D_{3:0}$  diventano i valori correnti della parola  $Q_{3:0}$ .

![Diagram of a 4-bit register. It consists of four D flip-flops stacked vertically. Each flip-flop has a D input and a Q output. The inputs are labeled D3, D2,...](images/p037_fig02.png)

### Enabled Flip-Flops

![Symbol for an enabled flip-flop. It is a rectangle with a clock triangle at the top. Inside, there is a 'D' on the left and a 'Q' on the right. At the](images/p037_fig03.png)

<table border="1">
<thead>
<tr>
<th>Simbolo</th>
<th>Circuito sequenziale</th>
</tr>
</thead>
<tbody>
<tr>
<td>
(Symbol for an enabled flip-flop. It is a rectangle with a cloc...)
</td>
<td>
(Circuit diagram of an enabled flip-flop. It shows a multiplexe...)
</td>
</tr>
</tbody>
</table>

Un enabled flip-flop è una variante del D Flip-Flop ed ha 3 ingressi: i due input CLK e D come nei normali flip-flop e, in più, l'ingresso EN riservato all'abilitatore.

- Se  $EN=1$ , l'enabled flip-flop si comporta come un D Flip-Flop semplice (infatti l'ingresso 1 del multiplexer è direttamente collegato a D). Se CLK passa da 0 a 1 il valore che viene dato in input al D Flip-Flop per aggiornare l'output Q è D (comportamento normale);

---

<!-- Pagina 38 -->

- Se  $EN=0$ , indipendentemente dal valore di  $CLK$ , il flip-flop mantiene memoria dello stato precedente (infatti l'ingresso 0 del multiplexer è direttamente collegato a  $Q$ ). Se  $CLK$  passa da 0 a 1, il valore che viene dato in input al D Flip-Flop per aggiornare l'output  $Q$  è  $Q$  stesso, quindi ecco perché con  $EN=0$  il sistema mantiene memoria.

### Resettable Flip-Flops

![Symbol for a resettable flip-flop. It shows a rectangular block with 'D' and 'Q' inside. A triangle symbol at the top indicates a clock input. A line ](images/p038_fig01.png)

<table border="1">
<thead>
<tr>
<th>Simbolo<br/>(completo o semplice)</th>
<th>Circuito sequenziale<br/>(flip-flop resettabile sincrono)</th>
</tr>
</thead>
<tbody>
<tr>
<td>
(Symbol for a resettable flip-flop. It shows a rectangular bloc...)
</td>
<td>
(Circuit diagram of a synchronous resettable flip-flop. It show...)
</td>
</tr>
</tbody>
</table>

Un resettable flip-flop è una **variante** del D Flip-Flop ed ha **3 ingressi**: i due input  $CLK$  e  $D$  come nei normali flip-flop e, in più, l'ingresso  $RESET$ . I flip-flop resettabili sono tali per cui:

- Se  $RESET=1$ , allora il valore di  $Q$  viene resettato a 0;
- Se  $RESET=0$ , allora il flip-flop si comporta come un normale D Flip-Flop.

Inoltre, i flip-flop resettabili possono essere suddivisi in **due categorie**:

- **SYNCRONI**: il reset è pilotato dal clock, quindi il reset avviene solo quando il clock è nel fronte di salita (passa da 0 a 1 e ovviamente  $RESET$  deve essere uguale a 1);
- **ASINCRONI**: indipendentemente dal clock, se  $RESET=1$ , allora  $Q$  si resetta a 0.

### Settable Flip-Flops

![Symbol for a settable flip-flop. It shows a rectangular block with 'D' and 'Q' inside. A triangle symbol at the top indicates a clock input. A line labeled '...](images/p038_fig02.png)

Un settable flip-flop è una **variante** del D Flip-Flop ed ha **3 ingressi**: i due input  $CLK$  e  $D$  come nei normali flip-flop e, in più, l'ingresso  $SET$ . Hanno una topologia duale rispetto ai resettable flip-flop.

- Se  $SET=1$ , allora il valore di  $Q$  viene settato a 1;
- Se  $SET=0$ , allora il flip-flop si comporta come un normale D Flip-Flop.

### Criticità nella logica sequenziale

Circuito astabile:

Il circuito astabile è costituito da tre porte NOT, di cui l'output dell'ultima è retroazionato nell'ingresso della prima porta NOT. Analizziamo il suo comportamento:

![Circuit diagram of an astable circuit. It consists of three NOT gates connected in series. The output of the first NOT gate is labeled 'Y', the output of the...](images/p038_fig03.png)

Supponiamo che  $X = 1$ : dopo un certo ritardo, il valore di  $Y$  (la negata di  $X$ ) sarà 0 e dopo un altro ritardo, il valore di  $Z$  (la negata di  $Y$ ) sarà 1 ed infine, dopo un altro piccolo ritardo, il valore di  $X$  diventerà 0 (conseguentemente  $Y=1$  e  $Z=0$  e, successivamente  $X$  ritorna a 1). Il comportamento di questo circuito è tale per cui,  $X$  partendo da 1, dopo 3  $\delta$  ( $\delta$  è il ritardo delle porte NOT) assume il valore 0 e dopo altri 3  $\delta$  ritorna a 1 (comportamento simile al clock, infatti il segnale degli output forma un'onda quadra periodica).

Questo tipo di circuito è detto **ASINCRONO**, in quanto l'output è retroazionato in maniera diretta, cioè non pilotato da un clock esterno.

---

<!-- Pagina 39 -->

Alternativa asincrona al D Latch (CLK 1 → 0 entra in stato oscillatorio):

<table border="1">
<thead>
<tr>
<th>CLK</th>
<th>D</th>
<th>$Q_{prev}$</th>
<th>Q</th>
</tr>
</thead>
<tbody>
<tr>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>0</td>
<td>0</td>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>0</td>
<td>1</td>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
</tr>
<tr>
<td>1</td>
<td>1</td>
<td>0</td>
<td>1</td>
</tr>
<tr>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
</tr>
</tbody>
</table>

$$
Q = \overline{CLK} \cdot D + \overline{CLK} \cdot Q_{prev}
$$

![Logic circuit diagram of an asynchronous D latch. It consists of two AND gates (N1 and N2) and one OR gate. N1 has inputs D and CLK (active low). N2 has inpu...](images/p039_fig01.png)

Analizziamo il comportamento teorico di questo circuito tramite la tabella di verità:

- La formula per ottenere l'output è:  $Q = \overline{CLK} \cdot D + \overline{CLK} \cdot Q_{prev}$ ;
- Sostanzialmente, il comportamento è quello di un D Latch, infatti:
  - Se  $\overline{CLK}=1$ , allora il sistema è trasparente e il valore di D passa direttamente in Q;
  - Se  $\overline{CLK}=0$ , allora il sistema è opaco e il valore di Q mantiene memoria del suo stato precedente (indipendentemente dal valore di D);

Analizziamo il comportamento diacronico (nel tempo), in quanto tutte le porte inducono dei ritardi:

- Il caso in cui D=1 e CLK=1 è un caso stabile, poiché il valore dell'output Q è uguale a 1 (dato dall'OR tra  $\overline{CLK} \cdot D$  e  $\overline{CLK} \cdot Q_{prev}$ ), che, retroazionato nella porta AND insieme a  $\overline{CLK}$ , non conta, perché  $\overline{CLK} = 0$ ;

![Logic circuit diagram showing the stable state. Inputs: D=1, CLK=1, Q_prev=1. The output Q is 1. The diagram shows the signal levels at each gate output: N1=...](images/p039_fig02.png)

- Supponiamo che a un certo istante  $t_0$  il valore di CLK passi da 1 a 0 (fronte di discesa): questo caso è identico al precedente, solo che il valore di CLK è uguale a 0 e ci vuole del tempo prima che quest'informazione si propaghi per tutto il circuito.

![Logic circuit diagram showing the transition at time t0. Input CLK changes from 1 to 0. The output Q remains 1 because the propagation delay through the NOT...](images/p039_fig03.png)

- Dopo un certo ritardo, all'istante  $t_1$ , l'informazione che CLK è diventato 0 comincia a propagarsi nel circuito secondo un certo ordine (prima per la porta NOT e AND a cui CLK è direttamente collegato come ingresso).

![Logic circuit diagram showing the transition at time t1. Input CLK is now 0. The output Q is still 1. The diagram shows the signal levels: N1=0, N2=0, and th...](images/p039_fig04.png)

- Nell'istante successivo  $t_2$ , questa nuova configurazione si propaga attraversando altre porte, ovvero: nella porta OR tra N1=0 e N2=0, l'output è Q=0; nella porta AND tra  $\overline{CLK}$  e  $Q_{prev}$  l'output N2=1. In particolare, il valore Q=0 è retroazionato in  $Q_{prev}=0$  (le operazioni avvengono tra i valori all'istante  $t_1$  e gli output sono i valori all'istante  $t_2$ ).

---

<!-- Pagina 40 -->

![Logic circuit diagram for a D flip-flop. It consists of two AND gates (N1 and N2) and one OR gate. N1 is labeled N1 = CLK.D and N2 is labeled N2 = CLK.Q_prev...](images/p040_fig01.png)

- Infine, si può notare che dall'istante  $t_2$  all'istante  $t_3$  i valori degli output si ripetono, cioè sono uguali a quelli dell'istante  $t_1$ , infatti l'AND tra  $\overline{CLK}$  e  $Q_{prev}$  risulta essere uguale a 0 e l'OR tra  $N1$  e  $N2$  risulta essere  $Q=1$  che viene retroazionato in  $Q_{prev}=1$  (le operazioni avvengono tra i valori all'istante  $t_2$  e gli output sono i valori all'istante  $t_3 = t_1$ ). Il sistema, ha, quindi, un andamento oscillante del valore  $Q$  che ripete sempre le stesse configurazioni degli istanti  $t_1$  e  $t_2$ .

Proprio per questo motivo, l'analisi del comportamento fisico di un circuito sequenziale non può essere ridotto al solo studio dell'espressione booleana che il circuito realizza (tramite la tabella di verità), ma deve anche comprendere lo studio del suo comportamento diacronico (soprattutto se ci troviamo in una logica sequenziale asincrona nel quale i cicli possono mettere il sistema in uno stato oscillante, perché i ritardi si propagano in maniera differente tra le varie porte logiche).

### Logiche sequenziali sincrone

Le criticità delle logiche sequenziali asincrone spiegate sopra sono il motivo per cui un calcolatore elettronico non può essere realizzato in questo modo (il processore non può gestire ritardi diversi delle porte e stati oscillanti in un sistema così complesso). Proprio per questo motivo, i calcolatori elettronici sono sistemi costruiti secondo delle logiche sequenziali sincrone.

Sostanzialmente, una logica sequenziale sincrona è una logica sequenziale che evita la retroazione diretta dell'output (perché potrebbe causare delle criticità). Per ottenere una logica di questo tipo è necessario interporre nel ciclo di retroazione un registro (banco di D Flip-Flop) che legge l'input solo nella fase del fronte di salita del clock.

Esempio CPU del computer: supponiamo che la frequenza del clock sia più lenta dei ritardi accumulati lungo tutto un certo circuito. I registri, che si interpongono in un ciclo di retroazione, permettono al sistema di essere sincronizzato con il clock, cioè gli stati interni dei registri in questione si aggiornano solo quando il clock è sul fronte di salita.

In una logica combinatoria, l'output è una specifica funzione booleana dei suoi soli ingressi.

Invece, in una logica sequenziale sincrona:

- l'output è una specifica funzione booleana  $F$  dei suoi ingressi e dello STATO CORRENTE DEI REGISTRI DEL SISTEMA;
- il PROSSIMO STATO DEI REGISTRI DEL SISTEMA è un'altra specifica funzione booleana  $G$  dei suoi ingressi e dello stato corrente dei registri del sistema.

Quindi, in generale, per la progettazione di un circuito sequenziale sincrono:

- Ogni registro determina un insieme finito di stati  $S_0 S_1 \dots S_{n-1}$  del sistema, ovvero tutte le possibili configurazioni che possono assumere i suoi diversi registri;
- I cambiamenti di stato del sistema sono determinati solo dalle transizioni sul fronte di salita del clock, ciò significa che il sistema è sincronizzato con il clock;

---

<!-- Pagina 41 -->

- Bisogna seguire delle specifiche regole di composizione:
  - Ogni elemento è un registro o un circuito combinatorio (ci deve essere almeno un registro, altrimenti il circuito sarebbe una rete combinatoria);
  - Tutti i registri devono essere sincronizzati dallo stesso clock;
  - Ogni retroazione, cioè un cammino ciclico, deve contenere almeno un registro;

Esistono diversi tipi di circuiti che implementano una logica sequenziale sincrona. I principali sono:

- Finite State Machine (FSM) → automi di Moore e automi di Mealy: sono dei circuiti in cui vi è una retroazione gestita da dei registri;
- Pipelines: sono circuiti in cui si hanno logiche combinatorie seguite da registri, che a loro volta sono seguiti da altre logiche combinatorie e così via in maniera sequenziale. Supponiamo che i ritardi delle logiche combinatorie siano più piccoli del periodo di clock: le pipeline consentono di mantenere una stabilità dei valori di prossimo stato lungo delle sequenze di logiche combinatorie. Lo schema circuitale è il seguente:

![Diagram of a pipeline circuit. It shows a sequence of three stages. Each stage consists of a combinatorial logic block (represented by a rounded rectangle wi...](images/p041_fig01.png)

In questa pipeline, ogni circuito combinatorio corrisponde ad una certa fase. È necessario aspettare che una certa fase processi il suo output prima di passare alla fase successiva (proprio per questo motivo, il circuito è sincronizzato dal clock). Nel frattempo che una fase processa un certo token, la fase precedente ha in ingresso il token precedente e può iniziare a computare il nuovo output, creando così una catena di montaggio.

Un D Flip-Flop è il più semplice circuito sequenziale sincrono. Il valore di Q rappresenta lo STATO CORRENTE, invece il valore di D rappresenta il valore di PROSSIMO STATO. Infatti, quando il valore del clock passa da 0 a 1 (fronte di salita), dato che i registri leggono i valori in ingresso, il valore di D del prossimo stato sostituisce il valore di Q dello stato corrente.

---

<!-- Pagina 43 -->

# Finite State Machine

Una Finite State Machine è un circuito sequenziale sincrono in cui vi è una retroazione gestita da registri. Sono caratterizzate:

- Da registri (costituiti da uno o più D Flip-Flop in parallelo) pilotati dal fronte di salita di un clock. Quando il valore del clock passa da 0 a 1, il valore del prossimo stato del registro viene letto e diventa il nuovo valore dello stato corrente del registro;
- Due logiche combinatorie:
  1. NEXT STATE LOGIC: una logica combinatoria adibita al calcolo del prossimo stato;
  2. OUTPUT LOGIC: una logica combinatoria adibita al calcolo degli output.

In base al tipo di OUTPUT LOGIC presente nella Finite State Machine, distinguiamo:

## 1. AUTOMI DI MOORE:

![Diagram of a Moore Finite State Machine. It consists of three main blocks: 'next state logic', a 'CLK' (clock) block, and 'output logic'. The 'next state log...](images/p043_fig01.png)

Il valore di prossimo stato è funzione sia dello stato corrente sia degli input del sistema; L'output è funzione solo dello stato corrente del sistema;

## 2. AUTOMI DI MEALY:

![Diagram of a Mealy Finite State Machine. It consists of three main blocks: 'next state logic', a 'CLK' (clock) block, and 'output logic'. The 'next state log...](images/p043_fig02.png)

Il valore di prossimo stato è funzione sia dello stato corrente sia degli input del sistema; L'output è funzione sia dello stato corrente sia degli input del sistema.

### Proprietà delle macchine a stati finiti

In una macchina a stati finiti, supponiamo che il sistema possa transitare dallo stato  $S_0$  ad altri stati  $S_1 \dots S_i \dots S_M$ . Queste transizioni da uno stato all'altro sono regolate da delle espressioni booleane  $E_1 \dots E_i \dots E_M$ . Un automa, allora, soddisfa delle proprietà:

1. Una qualunque combinazione degli input del sistema pilota la transizione del sistema stesso in un qualche stato. Quindi, per ogni configurazione degli input, almeno una di queste espressioni deve essere verificata (altrimenti il sistema non transiterebbe). Data una configurazione degli input  $\rightarrow E_1 + \dots + E_i + \dots + E_M = 1$  (la configurazione degli input deve verificare almeno una delle espressioni del sistema);
2. Gli automi di Moore e di Mealy sono macchine deterministiche, cioè una configurazione degli input non può verificare più espressioni diverse contemporaneamente, altrimenti permetterebbe al sistema di transitare in più stati diversi. Quindi, data una combinazione degli input  $\rightarrow E_i * E_j = 0$  (per ogni coppia di espressioni diverse);

appuntiofficina student

---

<!-- Pagina 44 -->

### Esempio di Moore Finite State Machine

![Diagram of a Moore Finite State Machine with three states: S0, S1, and S2. S0 is the initial state with output Q=0. S1 has output Q=0. S2 has output Q=1. Tra...](images/p044_fig01.png)

Questa è una Moore Finite State Machine perché l'output  $Q$  dipende solo dallo stato corrente del sistema e non dalle sue transizioni. Abbiamo due input  $A$  e  $B$  e un solo output  $Q$ .

Gli stati dell'automa sono i seguenti:

- STATO  $S_0 \rightarrow Q=0$ ;
- STATO  $S_1 \rightarrow Q=0$ ;
- STATO  $S_2 \rightarrow Q=1$ ;

Per analizzare il comportamento di un automa di Moore è necessario ipotizzare delle sequenze di valori degli input  $A$  e  $B$  che rappresentino tutte le possibili combinazioni nel tempo del sistema, ad esempio (leggere gli input  $\rightarrow$  determinare il prossimo stato  $\rightarrow$  determinare il valore di  $Q$ ):

<table border="1">
<thead>
<tr>
<th>stato corrente</th>
<th>$S_0$</th>
<th>$S_0$</th>
<th>$S_0$</th>
<th>$S_0$</th>
<th>$S_1$</th>
<th>$S_2$</th>
<th>$S_0$</th>
<th>$S_0$</th>
<th>$S_1$</th>
<th>$S_2$</th>
<th>$S_0$</th>
<th>$S_0$</th>
</tr>
</thead>
<tbody>
<tr>
<td>$A$</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>$B$</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
</tr>
<tr>
<td>$Q$</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>next state</td>
<td>$S_0$</td>
<td>$S_0$</td>
<td>$S_0$</td>
<td>$S_1$</td>
<td>$S_2$</td>
<td>$S_0$</td>
<td>$S_0$</td>
<td>$S_1$</td>
<td>$S_2$</td>
<td>$S_0$</td>
<td>$S_0$</td>
<td>$S_0$</td>
</tr>
</tbody>
</table>

In questo sistema, quindi, l'output  $Q$  è uguale a 1 se e solo se il valore  $A=1$  seguito da  $B=1$ . Dopodiché, il sistema torna allo stato di reset e ricerca nuove sequenze  $A=1$  e dopo  $B=1$ .

![Diagram of a Mealy Finite State Machine with three states: S0, S1, and S2. S0 is the initial state with output Q=0. S1 has output Q=0. S2 has output Q=1. Tra...](images/p044_fig02.png)

### Esempio di Mealy Finite State Machine

Questo è un esempio di automa di Mealy perché l'output del sistema (indicato dal valore nella transizione dopo lo slash) non dipende solo dallo stato corrente del sistema, ma anche direttamente dagli input  $A$  e  $B$  (la combinazione di input e stato corrente determina l'output e il prossimo stato).

Analizziamo il comportamento di questo automa:

- STATO  $S_0$ :
  - Se  $A=0$ , allora il sistema restituisce output 0 e rimane nello stato  $S_0$ ;
  - Se  $A=1$ , allora il sistema restituisce output 1 e passa nello stato  $S_1$ ;
- STATO  $S_1$ :
  - Se  $B=0$ , allora il sistema restituisce output 0 e ritorna nello stato  $S_0$ ;
  - Se  $B=1$ , allora il sistema restituisce output 0 e passa nello stato  $S_2$ ;
- STATO  $S_2$ :
  - Se  $A=1$  e  $B=1$ , allora il sistema restituisce output 1 e rimane nello stato  $S_2$ ;
  - Se almeno uno tra  $A$  e  $B$  è uguale a 0, allora il sistema restituisce output 0 e passa nello stato  $S_2$ ;

Questo sistema traccia le sequenze di valori  $A=1$  e successivamente  $B=1$ . Se, poi, i valori di  $A$  e  $B$  rimangono entrambi 1 ( $A*B=1$ ), allora il sistema rimane nello stato  $S_2$  e continua a dare come output il valore 1. Supponiamo di avere, ad esempio, una sequenza di valori per  $A$  e  $B$  di questo tipo (si legge il valore dell'input e lo stato corrente  $\rightarrow$  si determina l'output e il prossimo stato):

<table border="1">
<thead>
<tr>
<th>stato corrente</th>
<th>$S_0$</th>
<th>$S_1$</th>
<th>$S_2$</th>
<th>$S_2$</th>
</tr>
</thead>
<tbody>
<tr>
<td>$A$</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td>$B$</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td>output</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td>next state</td>
<td>$S_1$</td>
<td>$S_2$</td>
<td>$S_2$</td>
<td>$S_2$</td>
</tr>
</tbody>
</table>

---

<!-- Pagina 45 -->

## Esempio di implementazione di una Moore FSM: semaforo

Descrizione sensori e luci dei semafori:

![Diagram of a four-way intersection with sensors and lights. Academic Avenue (horizontal) has sensors TA and lights LA. Bravado Boulevard (vertical) has senso...](images/p045_fig01.png)

Il semaforo mostrato in figura ha **due sensori**:

- $T_A$  per la gestione del traffico sulla Academic Avenue;
- $T_B$  per la gestione del traffico sulla Bravado Boulevard.

**Entrambi i sensori restituiscono TRUE se e solo se c'è traffico** sulla strada dove gestiscono il traffico. Le luci del semaforo posto sulla Academic Avenue sono indicate con  $L_A$ , invece le luci di quello sulla Bravado Boulevard sono indicate con  $L_B$ .

Descrizione del sistema tramite black box:

![Black box diagram of a Traffic Light Controller. It has inputs TA, TB, CLK, and Reset, and outputs LA and LB.](images/p045_fig02.png)

Guardando questo sistema **come una black box**, quindi **senza interessarci**, per il momento, del suo funzionamento interno, la logica che gestisce questo sistema può essere la seguente:

- Gli **input** del sistema sono i due sensori  $T_A$  e  $T_B$  che inviano 1 se c'è traffico sulla strada, 0 altrimenti. Altri input sono **CLK** (dato che è un circuito sequenziale sincrono) e **RESET** che resettta il sistema in un certo stato iniziale;
- La logica per gestire le luci del traffico è indicata con Traffic Light Controller;
- Gli **output** del sistema sono i valori delle luci  $L_A$  e  $L_B$ .

Descrizione del Traffic Light Controller mediante **diagramma di transizione degli stati**:

Il Traffic Light Controller può essere descritto mediante un **DIAGRAMMA DI TRANSIZIONE DEGLI STATI**, per indicare tutti i possibili stati del sistema e le transizioni tra essi:

- **STATO  $S_0$** : in questo stato il semaforo dell'**Academic Avenue è verde**, invece il semaforo della **Bravado Boulevard è rosso**. Questo stato, inoltre, **rappresenta lo stato di Reset**;
- **STATO  $S_1$** : in questo stato il semaforo dell'**Academic Avenue è giallo**, invece il semaforo della **Bravado Boulevard è rosso**;
- **STATO  $S_2$** : in questo stato il semaforo dell'**Academic Avenue è rosso**, invece il semaforo della **Bravado Boulevard è verde**;
- **STATO  $S_3$** : in questo stato il semaforo dell'**Academic Avenue è rosso**, invece il semaforo della **Bravado Boulevard è giallo**;

---

<!-- Pagina 46 -->

![State transition diagram for a traffic light system. It consists of four states: S0 (LA: green, LB: red), S1 (LA: yellow, LB: red), S2 (LA: red, LB: green),...](images/p046_fig01.png)

Il passaggio da uno stato all'altro è determinato dai valori dei sensori  $T_A$  e  $T_B$ : partendo dallo stato  $S_0$ , se il sensore  $T_A$  è uguale a 1, cioè il sensore sta rivelando traffico sull'Academic Avenue, allora il sistema rimane nello stato  $S_0$ . Invece, se il sensore  $T_A$  è uguale a 0, allora il sistema passa allo stato  $S_1$ . A questo punto, a prescindere dai valori dei sensori, il sistema passa allo stato  $S_2$ . Nello stato  $S_2$  se il sensore  $T_B$  è uguale a 1, cioè il sensore sta rivelando traffico sulla Bravado Boulevard, allora il sistema rimane nello stato  $S_2$ . Invece, se il sensore  $T_B$  è uguale a 0, allora il sistema passa allo stato  $S_3$ . Anche questo stato, a prescindere dai valori dei sensori, effettua direttamente il passaggio del sistema allo stato  $S_0$ .

L'utilizzo dei semafori (a livello elettronico) è molto frequente all'interno di un calcolatore. Ad esempio, i sistemi operativi per gestire come più operazioni (task) in pseudo-parallelismo ottengono delle risorse utili al loro funzionamento (accesso alle periferiche) utilizzano i semafori, che bloccano l'accesso alle risorse a un task per darne l'accesso ad un altro e viceversa.

Da notare che, il diagramma di transizione così implementato, non rappresenta un comportamento idoneo di un semaforo in ambito elettronico. Supponiamo che la Academic Avenue sia una strada sempre trafficata: dato che c'è sempre traffico, il sensore  $T_A$  non sarà mai 0 e, quindi, il sistema non passa mai agli stati successivi (il semaforo  $L_A$  è sempre verde, invece  $L_B$  è sempre rosso).

Ci sono due grandi problemi con i semafori che impediscono il continuo della computazione:

- **STARVATION**: il sistema produce dei casi di starvation quando si dà sempre una risorsa ad un task e mai ad altri;
- **DEADLOCK**: il sistema produce dei casi di deadlock quando si rimane nello stato in cui non si dà più accesso alle risorse ad alcun task (ad esempio, rosso a tutti i semafori).

Implementazione del Traffic Light Controller:

Per prima cosa, bisogna scrivere una tabella di transizione. Quest'operazione si divide in più fasi:

1. Nella prima fase, gli stati  $S_0$   $S_1$   $S_2$   $S_3$  si considerano ancora come stati astratti. La tabella di transizione è la seguente:

<table border="1">
<thead>
<tr>
<th>Stato corrente<br/>S</th>
<th>Input<br/>$T_A$</th>
<th>Input<br/>$T_B$</th>
<th>Prossimo stato<br/>S'</th>
</tr>
</thead>
<tbody>
<tr>
<td>$S_0$</td>
<td>0</td>
<td>X</td>
<td>$S_1$</td>
</tr>
<tr>
<td>$S_0$</td>
<td>1</td>
<td>X</td>
<td>$S_0$</td>
</tr>
<tr>
<td>$S_1$</td>
<td>X</td>
<td>X</td>
<td>$S_2$</td>
</tr>
<tr>
<td>$S_2$</td>
<td>X</td>
<td>0</td>
<td>$S_3$</td>
</tr>
<tr>
<td>$S_2$</td>
<td>X</td>
<td>1</td>
<td>$S_2$</td>
</tr>
<tr>
<td>$S_3$</td>
<td>X</td>
<td>X</td>
<td>$S_0$</td>
</tr>
</tbody>
</table>

---

<!-- Pagina 47 -->

2. Per continuare l'implementazione di questo controller, è necessario **codificare gli stati** (gli stati interni del sistema sono codificati all'interno di un registro). Dato che abbiamo **4 possibili stati**, servono **2 bit** ( $2^2 = 4$  stati codificabili). Quindi, la tabella di transizione viene modificata nella seguente:

<table border="1">
<thead>
<tr>
<th>Stato S</th>
<th>Codifica</th>
<th>1° bit stato corrente S<sub>1</sub></th>
<th>2° bit stato corrente S<sub>0</sub></th>
<th>Input T<sub>A</sub></th>
<th>Input T<sub>B</sub></th>
<th>1° bit prossimo stato S'<sub>1</sub></th>
<th>2° bit prossimo stato S'<sub>0</sub></th>
</tr>
</thead>
<tbody>
<tr>
<td>S<sub>0</sub></td>
<td>00</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>X</td>
<td>0</td>
<td>1</td>
</tr>
<tr>
<td>S<sub>1</sub></td>
<td>01</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>X</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>S<sub>2</sub></td>
<td>10</td>
<td>0</td>
<td>1</td>
<td>X</td>
<td>X</td>
<td>1</td>
<td>0</td>
</tr>
<tr>
<td>S<sub>3</sub></td>
<td>11</td>
<td>1</td>
<td>0</td>
<td>X</td>
<td>0</td>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td></td>
<td></td>
<td>1</td>
<td>0</td>
<td>X</td>
<td>1</td>
<td>1</td>
<td>0</td>
</tr>
<tr>
<td></td>
<td></td>
<td>1</td>
<td>1</td>
<td>X</td>
<td>X</td>
<td>0</td>
<td>0</td>
</tr>
</tbody>
</table>

3. Una volta completata la tabella di transizione, è possibile descrivere le varie espressioni booleane che identificano la logica combinatoria di prossimo stato. Ogni bit che identifica il prossimo stato è conservato in un D Flip-Flop diverso (in un unico registro), quindi la next state logic deve avere due output:

$$
S'_1 = S_1 \oplus S_0
$$

$$
S'_0 = \overline{S_1 S_0 T_A} + S_1 \overline{S_0 T_B} \quad (\text{essendo una forma SOP, interessa solo il valore dell'output uguale a 1})
$$

4. Analizziamo il comportamento dell'output, cioè il valore delle luci del semaforo. Dato che ogni semaforo può assumere tre valori per le luci, sono necessari 2 bit ( $2^2 = 4$  stati, uno è ridondante):

<table border="1">
<thead>
<tr>
<th>Output</th>
<th>Codifica</th>
<th>Stato S</th>
<th>Codifica</th>
<th>1° bit stato corrente S<sub>1</sub></th>
<th>2° bit stato corrente S<sub>0</sub></th>
<th>1° bit output L<sub>A1</sub></th>
<th>2° bit output L<sub>A2</sub></th>
<th>1° bit output L<sub>B1</sub></th>
<th>2° bit output L<sub>B2</sub></th>
</tr>
</thead>
<tbody>
<tr>
<td>Verde</td>
<td>00</td>
<td>S<sub>0</sub></td>
<td>00</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
</tr>
<tr>
<td>Giallo</td>
<td>01</td>
<td>S<sub>1</sub></td>
<td>01</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>0</td>
</tr>
<tr>
<td>Rosso</td>
<td>10</td>
<td>S<sub>2</sub></td>
<td>10</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td></td>
<td></td>
<td>S<sub>3</sub></td>
<td>11</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
</tr>
</tbody>
</table>

5. Una volta completata la tabella degli output con le relative codifiche, è possibile descrivere le varie espressioni booleane che identificano la logica combinatoria degli output:

$$
L_{A1} = S_1; L_{A2} = \overline{S_1 S_0}
$$

$$
L_{B1} = \overline{S_1}; L_{B2} = S_1 S_0
$$

6. Infine, vediamo a quale circuito corrisponde il controller. Esso si divide in: una logica combinatoria di prossimo stato (studiata attraverso le espressioni booleane della tabella di transizione al punto 3); un registro che memorizza il valore dello stato corrente; una logica combinatoria di output (studiata con le espressioni booleane nella tabella al punto precedente).

![Circuit diagram of a traffic light controller. It consists of three main sections: 'next state logic', 'state register', and 'output logic'. The 'next state...](images/p047_fig01.png)

---

<!-- Pagina 48 -->

![Timing diagram for a Moore FSM showing 10 clock cycles. The diagram tracks signals CLK, Reset, TA, TB, and state/output variables S'1:0, S1:0, LA1:0, and LB1...](images/p048_fig01.png)

CLK rappresenta il ciclo di clock che determina le varie transizioni del sistema da uno stato all'altro.

Poi, ci sono i valori di RESET, TA e TB che determinano quali transizioni avverranno. Inizialmente:

- **CICLO 1**: quando RESET=0 non si conosce lo stato del sistema, in quanto questo è in uno stato che dipende dalla storia precedente). In modo asincrono rispetto al clock, RESET passa da 0 a 1, impostando lo stato corrente del sistema a S0. Da questo stato sappiamo che LA1:0 è 00 che rappresenta il semaforo verde della Academic Avenue e LB1:0 è 10 che rappresenta il semaforo rosso della Bravado Boulevard. Inoltre, la logica combinatoria di prossimo stato prepara il valore 00 dei bit S'1:0 (dato che TA=1);
- **CICLO 2**: TA è ancora uguale a 1, quindi il sistema si trova nella stessa situazione precedente;
- **CICLO 3**: TA è ancora uguale a 1, il sistema persiste ancora nello stato S0;
- **CICLO 4**: durante questo ciclo TA passa da 1 a 0. Questo significa che la logica combinatoria di prossimo stato prepara i valori 01 per i bit S'1:0 (i valori dello stato corrente saranno aggiornati solo al prossimo ciclo di clock, poiché il registro è sincronizzato con il clock);
- **CICLO 5**: lo stato corrente si aggiorna, passando da S0 a S1. Ciò significa che la logica combinatoria di output modifica i valori delle luci dei semafori. In particolare, i valori dei bit LA1:0 passano da 00 a 01 (il semaforo della Ac. Avenue passa da verde a giallo). Contemporaneamente, la logica combinatoria di prossimo stato prepara i valori 10 per i bit S'1:0, indipendentemente dai valori degli input;
- **CICLO 6**: il prossimo stato calcolato al ciclo 5 diventa, ora, lo stato corrente. In questo stato, la logica di output (dopo un piccolo ritardo) aggiorna le luci dei semafori della Academic Avenue da giallo a rosso (i valori dei bit LA1:0 passano da 01 a 10) e della Bravado Boulevard da rosso a verde (i valori dei bit LB1:0 passano da 10 a 00);
- **CICLO 7**: il valore di TB passa da 1 a 0, quindi la logica combinatoria di prossimo stato computa i nuovi valori dei bit S'1:0, che sono 11 (rappresenta lo stato S3);
- **CICLO 8**: il valore dello stato corrente si aggiorna a S3 e con esso anche il semaforo della Bravado Boulevard che passa da verde a giallo (i valori dei bit LB1:0 passano da 00 a 01). Inoltre, dato che il sistema si trova nello stato S3, la logica combinatoria di prossimo stato prepara imposta i valori dei bit S'1:0 a 00, indipendentemente dai valori degli input;
- **CICLO 9**: il valore dello stato corrente si aggiorna a S0 e con esso anche i semafori della Bravado Boulevard che passa da giallo a rosso (i valori dei bit LB1:0 passano da 01 a 10) e della Academic Avenue che passa da rosso a verde (i valori dei bit LA1:0 passano da 10 a 00);
- **CICLO 10**: nell'ultimo ciclo di quest'analisi, il valore di TA passa da 1 a 0, quindi la logica combinatoria di prossimo stato prepara i bit S'1:0 a 01 (rappresentano lo stato S1) che saranno poi aggiornati al prossimo ciclo di clock (che non viene trattato in quest'analisi).

---

<!-- Pagina 49 -->

## Encoding degli stati

L'encoding degli stati di una FSM è l'operazione nel quale si codifica ogni stato identificato nel diagramma di transizione. Esistono due tipi di codifiche:

1. **ENCODING BINARIO**: è un encoding molto succinto, nel quale ogni stato viene codificato secondo l'enumerazione binaria (ad esempio, se si devono codificare 4 stati si utilizzano 2 bit, in modo che le loro possibili combinazioni siano  $2^2 = 4$ . I registri, quindi, codificano parole binarie di 2 bit: 00, 01, 10, 11).
2. **ENCODING ONE-HOT**: è un encoding in cui solo un bit per volta del registro può essere uguale a 1. Ad esempio, se si devono codificare 4 stati si utilizzano 4 bit. I registri, perciò, devono utilizzare più D Flip-Flop per memorizzare queste parole binarie: 0001, 0010, 0100, 1000 (solo un bit per volta è uguale a 1). Il principale svantaggio di questa codifica è l'utilizzo di un gran numero di flip-flop per la realizzazione di registri, nel caso in cui si hanno molti stati da codificare (in un calcolatore elettronico, i registri memorizzano parole al più di 32 o di 64 bit). Però, quando si devono codificare pochi stati, questo tipo di codifica è molto vantaggiosa perché spesso corrisponde ad una maggiore semplicità delle logiche combinatorie.

## Confronto tra Moore FSM e Mealy FSM

Per confrontare e analizzare le prestazioni di un automa di Moore e un automa di Mealy, supponiamo di volere un automa che ritorni 1 quando, dato un solo input, questo input ha avuto nei due stati precedenti una configurazione 01 (a ogni battere del clock, l'input assume valore 0 o 1). In tutte le altre configurazioni, l'output deve essere 0. Ad esempio:

<table border="1">
<tr>
<td>INPUT</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>1</td>
</tr>
<tr>
<td>OUTPUT</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
</tr>
</table>

Automa di Moore:

In un automa di Moore, è possibile considerare 3 stati per avere un funzionamento di questo genere:

1. **STATO S2**: in questo stato l'output è 1 poiché il sistema ha appena tracciato una sequenza 01 dell'input. Inoltre, in questo stato, la minima distanza al prossimo goal (prossimo output uguale a 1) è sicuramente 2 (perché si deve leggere di nuovo la sequenza 01 dell'input);

I prossimi due stati esaminano i casi in cui l'output è 0, ma la distanza per ottenere il goal è diversa:

1. **STATO S0**: il sistema si trova in questo stato quando l'input è 1. La distanza è sicuramente maggiore o uguale a 2 perché la sequenza di valori da leggere è 01;
2. **STATO S1**: il sistema si trova in questo stato quando l'input è 0. La distanza al prossimo goal è sicuramente maggiore o uguale a 1 perché il prossimo valore letto potrebbe essere 1, e, a quel punto, il sistema deve restituire 1 perché è stata letta la sequenza 01.

Quindi, la tabella si aggiorna in questo modo (leggere gli input → determinare il prossimo stato → determinare il valore dell'output):

<table border="1">
<tr>
<td>STATO</td>
<td>S<sub>0</sub></td>
<td>S<sub>1</sub></td>
<td>S<sub>1</sub></td>
<td>S<sub>2</sub></td>
<td>S<sub>0</sub></td>
<td>S<sub>1</sub></td>
<td>S<sub>1</sub></td>
<td>S<sub>1</sub></td>
<td>S<sub>2</sub></td>
<td>S<sub>1</sub></td>
<td>S<sub>2</sub></td>
<td>S<sub>0</sub></td>
<td>S<sub>1</sub></td>
<td>S<sub>2</sub></td>
</tr>
<tr>
<td>INPUT</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>1</td>
</tr>
<tr>
<td>OUTPUT</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
</tr>
</table>

Il diagramma di transizione della Moore FSM è il seguente:

![State transition diagram for a Moore FSM. It has three states: S0 (labeled 0), S1 (labeled 0), and S2 (labeled 1). Transitions are: S0 to S0 on input 1; S0 t...](images/p049_fig01.png)

appuntiofficinstudenti.com

---

<!-- Pagina 50 -->

Per continuare l'analisi di quest'automata di Moore, si deve scrivere la tabella di transizione ed eseguire l'encoding degli stati:

<table border="1">
<thead>
<tr>
<th>Stato<br/>S</th>
<th>Codifica</th>
<th>1° bit stato<br/>corrente<br/>$S_1$</th>
<th>2° bit stato<br/>corrente<br/>$S_0$</th>
<th>Input<br/>A</th>
<th>1° bit next<br/>state<br/>$S'_1$</th>
<th>2° bit next<br/>state<br/>$S'_0$</th>
<th>Output</th>
</tr>
</thead>
<tbody>
<tr>
<td>$S_0$</td>
<td>00</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
</tr>
<tr>
<td>$S_1$</td>
<td>01</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>$S_2$</td>
<td>10</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
</tr>
<tr>
<td></td>
<td></td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td></td>
<td></td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td></td>
<td></td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
</tr>
</tbody>
</table>

I tre stati del sistema di Moore devono essere codificati mediante 2 bit ( $2^2=4$  stati codificabili di cui uno è ridondante). Quindi, la funzioni boleanne che realizzano la logica combinatoria di prossimo stato (deve computare i bit a uno a uno perché i registri sono composti da tanti D Flip-Flop quanti sono i bit da memorizzare) e quella di output sono rappresentate mediante le seguenti espressioni boleanne:

- L'espressione booleana che restituisce  $S'_1=1$  è:

$$
S'_1 = S_0 A \text{ (dato che non consideriamo l'encoding 11, il valore 0 di } S_1 \text{ può essere considerato come un valore DONT' CARES)}
$$

- L'espressione booleana che restituisce  $S'_0=1$  è (in forma SOP):

$$
S'_0 = \bar{A}
$$

- La logica combinatoria di output, invece, utilizza questa espressione booleana per calcolare l'output (solo in funzione dello stato corrente):

$$
Y = S_1 \text{ (proprio come prima, non si inserisce } \bar{S}_0 \text{ perché non esiste la codifica 11)}
$$

Il circuito che realizza l'automata di Moore che restituisce output 1 quando legge sequenze 01 dell'input è il seguente:

![Circuit diagram of a Moore automaton. It features two D flip-flops, S1 and S0. Input A is connected to the D input of S1. Input A is also connected to the D...](images/p050_fig01.png)

---

<!-- Pagina 51 -->

Automa di Mealy:

Grazie all'automa di Mealy si ha una maggiore flessibilità, in quanto l'output dipende sia dall'input letto sia dallo stato corrente. Quindi, è possibile considerare anche solo 2 stati:

1. STATO  $S_0$ : Quando il sistema si trova in questo stato la distanza dal goal è  $\geq 2$ . Quindi:
   - se l'input letto è 1, allora l'output è 0 e la *next state logic* calcola lo stato  $S_0$ ;
   - se l'input letto è 0, allora l'output è 0 e la *next state logic* calcola lo stato  $S_1$  (la distanza dal goal diminuisce);
2. STATO  $S_1$ : quando il sistema si trova in questo stato, la distanza dal goal è  $\geq 1$ . Quindi:
   - se l'input letto è 1, allora l'output è 1 e la *next state logic* calcola lo stato  $S_0$ ;
   - se l'input letto è 0, allora l'output è 0 e la *next state logic* calcola lo stato  $S_1$ ;

Il diagramma di transizione di questo automa di Mealy è il seguente (input/output sulle transizioni):

![State transition diagram for a Mealy automa. It shows two states, S0 and S1. Transitions are labeled with input/output pairs. From S0: input 1 leads to S0 wi...](images/p051_fig01.png)

Ad esempio (leggere il valore dell'input e lo stato corrente → si determina l'output e il prossimo stato):

<table border="1">
<thead>
<tr>
<th>STATO INPUT</th>
<th>$S_0$</th>
<th>$S_0$</th>
<th>$S_1$</th>
<th>$S_1$</th>
<th>$S_0$</th>
<th>$S_0$</th>
<th>$S_1$</th>
<th>$S_1$</th>
<th>$S_1$</th>
<th>$S_0$</th>
<th>$S_1$</th>
<th>$S_0$</th>
<th>$S_0$</th>
<th>$S_1$</th>
</tr>
</thead>
<tbody>
<tr>
<th>OUTPUT</th>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
</tr>
<tr>
<th>NEXT STATE</th>
<td>$S_0$</td>
<td>$S_1$</td>
<td>$S_1$</td>
<td>$S_0$</td>
<td>$S_0$</td>
<td>$S_1$</td>
<td>$S_1$</td>
<td>$S_1$</td>
<td>$S_0$</td>
<td>$S_1$</td>
<td>$S_0$</td>
<td>$S_0$</td>
<td>$S_1$</td>
<td>$S_0$</td>
</tr>
</tbody>
</table>

Per continuare l'analisi di quest'automa di Moore, si deve scrivere la tabella di transizione ed eseguire l'encoding degli stati:

<table border="1">
<thead>
<tr>
<th>Stato S</th>
<th>Codifica</th>
<th>Stato corrente S</th>
<th>Input</th>
<th>Next State S'</th>
<th>Output</th>
</tr>
</thead>
<tbody>
<tr>
<td>$S_0$</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
</tr>
<tr>
<td>$S_1$</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td></td>
<td></td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
</tr>
<tr>
<td></td>
<td></td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>1</td>
</tr>
</tbody>
</table>

I due stati dell'automa di Mealy possono essere codificati con un solo bit ( $2^1=2$  stati codificabili):

Quindi, la funzioni booleane che realizzano la logica combinatoria di prossimo stato e di output sono rappresentate mediante le seguenti espressioni booleane (entrambe le funzioni hanno come argomenti gli input e lo stato corrente):

- $S' = \bar{A}$
- $Y = S * A$

Il circuito che realizza l'automa di Mealy che restituisce output 1 quando legge sequenze 01 dell'input è il seguente:

![Circuit diagram for a Mealy automa. It uses a D flip-flop with inputs CLK, S0, and S1 (labeled S'0). The S1 input is connected to the inverted input A via a...](images/p051_fig02.png)

appuntioncinastudenti.com

---

<!-- Pagina 52 -->

## Differenze tra automa di Moore e automa di Mealy: vantaggi e svantaggi

Le differenze tra un automa di Moore e un automa di Mealy che restituiscono 1 allo stesso modo, cioè quando il sistema legge in input una sequenza di valori 01, si notano non solo nel numero diverso di stati o del circuito sequenziale finale, ma anche nella loro evoluzione nel tempo.

![Timing diagram for a Moore Machine. It shows CLK, Reset, Input A, State S, and Output Y over 11 clock cycles. The state sequence is S0, S1, S2, S1, S2, S0, S...](images/p052_fig01.png)

![Timing diagram for a Mealy Machine. It shows CLK, Reset, Input A, State S, and Output Y over 11 clock cycles. The state sequence is S0, S1, S0, S1, S0, S1, S...](images/p052_fig02.png)

CLK rappresenta il ciclo di clock che determina le varie transizioni dei sistemi da uno stato all'altro. Poi, ci sono i valori di RESET e dell'input A che determinano quali transizioni avverranno. Il comportamento sul battere del clock è simile tra i due automi:

- La macchina di Mealy è implementata in modo da riuscire ad anticipare gli output della macchina di Moore, perché il valore di A è dato in input alla logica combinatoria di output che non è sincronizzata con il clock (cambiamento asincrono dell'output);
- Nella macchina di Moore, si deve aspettare il prossimo ciclo di clock per aggiornare lo stato corrente e, di conseguenza, anche l'output (cambiamento sincrono dell'output). Inoltre i ritardi dovuti agli elementi presenti nelle due logiche combinatorie sono molto omogenei.

Il vantaggio principale dell'automata di Moore è che è meglio sincronizzato rispetto ad un automa di Mealy, dove la logica combinatoria di output non è sincronizzata con il clock. Invece, il vantaggio principale dell'automata di Mealy è che, in molti casi, sono necessari meno stati per ottenere uno stesso funzionamento tramite un automa di Moore.

Analizziamo il comportamento dei due automi durante i vari cicli di clock:

- **CICLO 1:** quando RESET=0 non si conosce lo stato dei sistemi, in quanto dipende dalla loro storia precedente. In modo asincrono rispetto al clock, RESET passa da 0 a 1, impostando lo stato corrente dei due sistemi a S0. Finché il valore di RESET è 1, i due sistemi permangono nello stato S0, senza leggere l'input A;
- **CICLO 2:** il valore di RESET è ancora 1, i sistemi si trovano ancora allo stato corrente S0 e l'input A è ancora influente sulle logiche combinatorie delle due macchine. Durante questo ciclo, RESET passa da 1 a 0, quindi le macchine iniziano a leggere l'input A;
- **CICLO 3:** al battere del clock A=0, quindi entrambe le macchine passano allo stato S1 e restituiscono 0. Però, la macchina di Mealy, quando A passa da 0 a 1 (dopo un piccolo ritardo) calcola il prossimo stato S0 e restituisce 1 come output.
- **CICLO 4:** la macchina di Moore si trova allo stato S1. Al battere del clock legge A=1, aggiorna il suo stato a S2 e restituisce 1 come output. Invece, la macchina di Mealy si trova allo stato S1. Al battere del clock legge A=1, aggiorna il suo stato a S0 e restituisce 0 come output.

Il funzionamento è più o meno simile per tutti i seguenti cicli di clock.

---

<!-- Pagina 53 -->

## Fattorizzazione di una FSM

La fattorizzazione di una FSM è un'operazione che consiste nel suddividere una FSM complessa in tante FSM più semplici che interagiscono tra loro, in modo da semplificare la costruzione di una FSM (ad esempio, un programma complesso che viene diviso in tante sottoprocedure che comunicano tra loro).

Supponiamo di voler espandere l'esempio dei semafori sull'Academic Avenue e sulla Bravado Boulevard, aggiungendo la gestione del passaggio di eventuali parate sulla Br. Blvd. al Traffic Light Controller. Consideriamo altri due input aggiuntivi P e R:

- Se  $P=1$ , allora c'è una parata sulla Br. Blvd (modalità Parade) e il semaforo su questa strada rimane verde fintantoché continua ad esserci una parata;
- Se  $R=1$ , allora il sistema lascia la modalità "Parata" e ritorna al suo funzionamento finora studiato.

Un'implementazione di una FSM non fattorizzata di questo tipo, vista tramite una black box, può essere la seguente:

![Diagram of a non-factored FSM Controller. It is a single rectangular block labeled 'Controller FSM'. On the left, there are four input arrows labeled P, R, T...](images/p053_fig01.png)

Questa unica FSM non fattorizzata ha come input P e R che rappresentano la modalità Parata e modalità Regolare e  $T_A$  e  $T_B$  che sono i sensori del traffico dei semafori. Gli output  $L_A$  e  $L_B$  pilotano i colori delle luci dei rispettivi semafori.

Un'implementazione di una FSM fattorizzata di questo tipo, invece, è la seguente:

![Diagram of a factored FSM Controller. It shows two separate rectangular blocks, 'Mode FSM' and 'Lights FSM', enclosed in a dashed box labeled 'Controller FSM...](images/p053_fig02.png)

Il controller FSM è diviso in due FSM separate:

1. **MODE FSM**: ha due input P e R ed un solo bit di output M che rappresenta la modalità in cui si trova il controller (Parata o Regolare);
2. **LIGHTS FSM**: ha tre input e due output. Gli input  $T_A$  e  $T_B$  sono i sensori del traffico dei due semafori, invece M imposta la modalità del controller. Gli output  $L_A$  e  $L_B$  pilotano i colori delle luci dei rispettivi semafori.

Il diagramma delle transizioni degli stati di una Moore FSM non fattorizzata per sintetizzare il funzionamento di questo controller è il seguente:

![State transition diagram for a Moore FSM Controller. It consists of 7 states: S0, S1, S2, S3, S4, S5, and S7. Each state is a circle containing the current l...](images/p053_fig03.png)

---

<!-- Pagina 54 -->

Per comprendere meglio questo diagramma di transizione, è possibile suddividerlo in due grosse aree che corrispondono alle due modalità di funzionamento Parata e Regolare:

1. **MODALITÀ REGOLARE:** se non si considerano le transizioni da una modalità all'altra, quest'area rappresenta una FSM molto simile a quella studiata in precedenza (ovviamente si aggiunge l'implicante  $\bar{P}$  perché non si deve passare alla modalità Parata). In qualunque stato si trova il sistema, appena l'input  $P=1$ , il sistema, invece di continuare la transizione in quest'area, passa allo stato corrispondente nella seconda area (ad esempio: stato corrente =  $S_0 \rightarrow P=1$  e  $T_A=0 \rightarrow$  prossimo stato =  $S_4$ ).
2. **MODALITÀ PARATA:** anche qui, il funzionamento del sistema è molto simile a quello studiato in precedenza, solo che ad ogni transizione si aggiunge l'implicante  $\bar{R}$  se si vuole rimanere nella modalità Parata, altrimenti si ha l'implicante  $R$  se si vuole tornare alla modalità Regolare. L'unico stato che si comporta in maniera differente è  $S_6$ , poiché se  $R$  continua ad essere 0, significa che si vuole continuare a rimanere nella modalità Parata e, quindi, il semaforo della Br. Blvd. deve continuare a rimanere verde. Anche qui, In qualunque stato si trova il sistema, appena l'input  $R=1$ , il sistema passa allo stato corrispondente nella prima area (ad esempio: stato corrente =  $S_6 \rightarrow R=1$  e  $T_B=0 \rightarrow$  prossimo stato =  $S_3$ ).

La fattorizzazione consente di dividere il sistema in due Moore FSM molto più semplici che comunicano tra loro grazie all'input  $M$ . Quindi, i diagrammi delle transizioni degli stati delle Moore FSM per sintetizzare il funzionamento di questo controller sono due e sono i seguenti:

![Diagram of LIGHTS FSM showing four states: S0 (L_A: green, L_B: red), S1 (L_A: yellow, L_B: red), S2 (L_A: red, L_B: green), and S3 (L_A: red, L_B: ye](images/p054_fig01.png)

<table border="1">
<thead>
<tr>
<th>LIGHTS FSM</th>
<th>MODE FSM</th>
</tr>
</thead>
<tbody>
<tr>
<td>
(Diagram of LIGHTS FSM showing four states: S0 (L_A: green, L_B...)
<p style="text-align: center;">Lights FSM</p>
<p>Questo automa di Moore è simile a quello già studiato in precedenza, perché $S_0$, $S_1$ e $S_3$ si comportano in modo analogo, ma in $S_2$, alla logica combinatoria di prossimo stato, si aggiunge l'implicante $M$:</p>
<ul>
<li>• Se $M + T_B = 1$, allora il sistema rimane nello stato $S_2$ (o il sistema è in modalità Parata o c'è traffico su Br. Blvd.);</li>
<li>• Se $\overline{M} * \overline{T_B} = 1$, allora il sistema transita nello stato $S_3$ (se il sistema è in modalità Regolare e non c'è traffico su Br. Blvd.).</li>
</ul>
</td>
<td>
(Diagram of MODE FSM showing two states: S0 (M: 0) and S1 (M: 1...)
<p style="text-align: center;">Mode FSM</p>
<p>Questo automa di Moore ha solo due stati $S_0$ e $S_1$ che corrispondono alla modalità Regolare, rappresentato dall'output $M=0$, e la modalità Parata, rappresentato dall'output $M=1$.</p>
</td>
</tr>
</tbody>
</table>

appunti...ff...in...astudenti.com

---

<!-- Pagina 55 -->

## Progettazione di una FSM

Per progettare una FSM è importante seguire questi precisi step:

1. IDENTIFICARE gli input e gli output;
2. ABOZZARE un diagramma di transizione degli stati;
3. Per la MACCHINA DI MOORE:
   - Scrivere una tabella di transizione degli stati (tabella di verità della logica di prossimo stato);
   - Scrivere una tabella degli output (tabella di verità della logica di output).
4. Per la MACCHINA DI MEALY:
   - Scrivere un'unica tabella per la transizione degli stati e gli output (tabella di verità della logica di prossimo stato e della logica di output).
5. CODIFICARE gli stati della FSM (questa scelta influenza le prestazioni dell'hardware);
6. SCRIVERE le espressioni booleane che rappresentano le funzioni sintetizzate dalla next state logic e output logic;
7. ABOZZARE uno schema del circuito finale (con logica combinatoria di prossimo stato e di output e i registri).

## Parallelismo

Un concetto molto importante nello studio delle logiche e dei circuiti sequenziali è il parallelismo. Sostanzialmente, esistono due tipi di parallelismo:

1. PARALLELISMO SPAZIALE: si duplica l'hardware di un sistema per poter eseguire più task allo stesso tempo (un esempio è un processore costituito da più core, che sono repliche di un modello di CPU).
2. PARALLELISMO TEMPORALE: un singolo task viene suddiviso in più fasi e tutte le fasi sono eseguite con delle pipeline.

Le principali definizioni associate allo studio del parallelismo di un sistema sono:

- **TOKEN**: per token si intende un gruppo di input che deve essere processato per ottenere un output significativo (interno al circuito delle pipeline o finale);
- **LATENZA**: per latenza si intende l'intervallo di tempo che occorre ad un token per poter essere processato e, quindi, ottenere l'output. Per migliorare il valore della latenza è necessario migliorare la logica con cui una certa macchina o automa è realizzato;
- **THROUGHPUT**: per throughput si intende il numero di output prodotti in un'unità di tempo. Per migliorare il valore del throughput, è possibile introdurre in un sistema il parallelismo (infatti più macchine in parallelo producono più output in un'unità di tempo);

Ad esempio, supponiamo che Ben voglia cucinare delle torte. La latenza, cioè il tempo necessario a preparare e cucinare una torta (che rappresenta l'output) è 20min, cioè 1/3h. Il throughput, cioè il numero di output in un'unità di tempo (supponiamo in un'ora) è:  $1/\text{latenza} = 1/(1/3) = 3 \text{ torte/h}$ .

A questo punto, supponiamo di voler migliorare il throughput di questo sistema implementando e mettendo a confronto il parallelismo spaziale e il parallelismo temporale:

- **Parallelismo spaziale**: Ben chiede aiuto ad Alyssa per preparare e cucinare le torte utilizzando due forni. In questo caso, la latenza è la stessa (1/3h per torta), mentre il throughput raddoppia perché ci sono due persone ( $2 * 1/(1/3) = 6 \text{ torte/h}$ ).

![Diagram illustrating Spatial Parallelism in a kitchen scenario. The vertical axis is labeled 'Spatial Parallelism' and lists four trays: Tray 1, Tray 2, Tray...](images/p055_fig01.png)

---

<!-- Pagina 56 -->

- **Parallelismo temporale:** Ben prepara e cucina le torte da solo utilizzando un solo forno, però, mentre la torta è in forno, ne comincia a preparare un'altra e poi la cucina appena si libera il forno e così via. Sostanzialmente, costruisce una catena di montaggio (pipeline). In questo caso, la latenza è sempre la stessa (1/3h per torta), ma il throughput diventa:

$$
\frac{4}{65} * 60 \cong 3,7 \text{ torte/h} \quad (\text{numero di torte preparate in un'ora sapendo che si possono preparare 4 torte in 65 minuti})
$$

![Timeline diagram showing temporal parallelism for three trays (Tray 1, Tray 2, Tray 3) over 50 minutes. Ben 1 works on Tray 1, Ben 2 on Tray 2, and Ben 3 on...](images/p056_fig01.png)

![Handwritten state transition diagram for a 2-bit register. States are S0 (X=0, Y=0), S1 (X=0, Y=1), S2 (X=1, Y=0), and S3 (X=1, Y=1). Transitions are labeled...](images/p056_fig02.png)

*errore per - prima: NO FORME SOP  
non devo scrivere le variabili  
di input.*

<table border="1">
<thead>
<tr>
<th>$S_i$</th>
<th>$S_1$</th>
<th>$S_0$</th>
</tr>
</thead>
<tbody>
<tr>
<td>$S_0$</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>$S_1$</td>
<td>0</td>
<td>1</td>
</tr>
<tr>
<td>$S_2$</td>
<td>1</td>
<td>0</td>
</tr>
<tr>
<td>$S_3$</td>
<td>1</td>
<td>1</td>
</tr>
</tbody>
</table>

<table border="1">
<thead>
<tr>
<th></th>
<th>$S_1$</th>
<th>$S_0$</th>
<th>$AB$</th>
<th>$S_1$</th>
<th>$S_0$</th>
</tr>
</thead>
<tbody>
<tr>
<td></td>
<td>0</td>
<td>0</td>
<td>0 0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>$S_0$</td>
<td>0</td>
<td>0</td>
<td>0 1</td>
<td>1</td>
<td>0</td>
</tr>
<tr>
<td></td>
<td>0</td>
<td>0</td>
<td>1 0</td>
<td>0</td>
<td>1</td>
</tr>
<tr>
<td></td>
<td>0</td>
<td>0</td>
<td>1 1</td>
<td>0</td>
<td>1</td>
</tr>
<tr>
<td></td>
<td>0</td>
<td>1</td>
<td>0 0</td>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td>$S_1$</td>
<td>0</td>
<td>1</td>
<td>0 1</td>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td></td>
<td>0</td>
<td>1</td>
<td>1 0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td></td>
<td>0</td>
<td>1</td>
<td>1 1</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td></td>
<td>1</td>
<td>0</td>
<td>0 0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>$S_2$</td>
<td>1</td>
<td>0</td>
<td>0 1</td>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td></td>
<td>1</td>
<td>0</td>
<td>1 0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td></td>
<td>1</td>
<td>0</td>
<td>1 1</td>
<td>1</td>
<td>1</td>
</tr>
</tbody>
</table>

<table border="1">
<tbody>
<tr>
<td></td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
</tr>
<tr>
<td></td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
</tr>
<tr>
<td>$S_3$</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
</tr>
<tr>
<td></td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>1</td>
</tr>
</tbody>
</table>

---

<!-- Pagina 57 -->

![State transition diagram for a 2-bit register. States are S0 (x=1, y=0), S1 (x=0, y=0), and S2 (x=1, y=1). Transitions: S0 to S0 on RESET; S0 to S1 on A=1; S...](images/p057_fig01.png)

<table border="1">
<thead>
<tr>
<th></th>
<th>S1</th>
<th>S0</th>
</tr>
</thead>
<tbody>
<tr>
<th>S0</th>
<td>0</td>
<td>0</td>
</tr>
<tr>
<th>S1</th>
<td>0</td>
<td>1</td>
</tr>
<tr>
<th>S2</th>
<td>0</td>
<td>0</td>
</tr>
</tbody>
</table>

<table border="1">
<thead>
<tr>
<th>S1</th>
<th>S0</th>
<th>A</th>
<th>S1'</th>
<th>S0'</th>
</tr>
</thead>
<tbody>
<tr>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
</tr>
<tr>
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
</tr>
<tr>
<td>0</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>0</td>
</tr>
<tr>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>1</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>0</td>
</tr>
<tr>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>1</td>
<td>1</td>
<td>1</td>
<td></td>
<td></td>
</tr>
</tbody>
</table>

---

<!-- Pagina 58 -->

## Circuiti aritmetici e memorie

In questo capitolo esamineremo più nel dettaglio tutte le componenti interne ai nostri calcolatori elettronici moderni, cioè i circuiti utilizzati per costruire i mattoni fondamentali di un calcolatore.

**Circuiti aritmetici:** sono l'implementazione delle operazioni aritmetiche che un calcolatore può eseguire, come le somme, le differenze, i prodotti, le divisioni, gli shifts e i comparisons.

### 1-bit Adders: Half adder

I più semplici circuiti aritmetici sono i 1-BIT ADDERS, che permettono di calcolare la somma tra due numeri binari composti da una sola cifra binaria. L'half adder è un circuito aritmetico con due input, A e B, e due output, S e  $C_{OUT}$ :

- S restituisce la somma di A e B:  $S = A \oplus B$ ;
- $C_{OUT}$  restituisce il riporto della somma tra A e B:  $C_{OUT} = AB$ ;

![Symbol for a 1-bit half adder: a trapezoid with inputs A and B at the top, a carry-in C_out on the left, a plus sign in the middle, and an output S at](images/p058_fig01.png)

<table border="1">
<thead>
<tr>
<th colspan="3">Simbolo</th>
<th colspan="4">Tabella di verità</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="3">
(Symbol for a 1-bit half adder: a trapezoid with inputs A and B...)
</td>
<td>A</td>
<td>B</td>
<td>$C_{out}$</td>
<td>S</td>
</tr>
<tr>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>1</td>
</tr>
<tr>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td colspan="3"></td>
<td colspan="4">
$S = A \oplus B$<br/>
$C_{out} = AB$
</td>
</tr>
</tbody>
</table>

### 1-bit Adders: Full adder

Il full adder è un circuito aritmetico costruito come l'estensione di un half adder (di solito è utilizzato nei multi-bit adder per calcolare la somma tra cifre binarie con n bit, in quanto ha in ingresso anche il riporto della somma delle cifre precedenti). Ha tre input, A, B, e  $C_{IN}$  e due output, S e  $C_{OUT}$ :

- L'input  $C_{IN}$  rappresenta il riporto tra la somma delle (i-1)-esime cifre dei numeri binari, che si andrà a sommare con A e B per calcolare la i-esima cifra della somma tra due numeri binari.
- S restituisce la somma di A e B e  $C_{IN}$ :  $S = A \oplus B \oplus C_{IN}$ ;
- $C_{OUT}$  restituisce il riporto della somma tra A e B e  $C_{IN}$ :  $C_{OUT} = AB + AC_{IN} + BC_{IN}$ ;

![Symbol for a 1-bit full adder: a trapezoid with inputs A and B at the top, a carry-in C_in on the right, a carry-out C_out on the left, a plus sign in](images/p058_fig02.png)

<table border="1">
<thead>
<tr>
<th colspan="5">Simbolo</th>
<th colspan="6">Tabella di verità</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="5">
(Symbol for a 1-bit full adder: a trapezoid with inputs A and B...)
</td>
<td>$C_{in}$</td>
<td>A</td>
<td>B</td>
<td>$C_{out}$</td>
<td>S</td>
<td colspan="3"></td>
</tr>
<tr>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td colspan="3"></td>
</tr>
<tr>
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td colspan="3"></td>
</tr>
<tr>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td colspan="3"></td>
</tr>
<tr>
<td>0</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td colspan="3"></td>
</tr>
<tr>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td colspan="3"></td>
</tr>
<tr>
<td>1</td>
<td>0</td>
<td>1</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td colspan="3"></td>
</tr>
<tr>
<td>1</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td colspan="3"></td>
</tr>
<tr>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td>1</td>
<td colspan="3"></td>
</tr>
<tr>
<td colspan="5"></td>
<td colspan="6">
$S = A \oplus B \oplus C_{in}$<br/>
$C_{out} = AB + AC_{in} + BC_{in}$
</td>
</tr>
</tbody>
</table>

### Multi-bit Adders

I multi-bit adder sono dei circuiti aritmetici che permettono di calcolare la somma tra due numeri binari composti da N bit. Sono anche detti CPAs, ovvero Carry Propagate Adders, in quanto il riporto della somma di due cifre è riportato nella somma delle due cifre successive. Dal punto di vista circuitale hanno tre input e due output:

- Gli input A e B sono le parole binarie di N bit da sommare (in genere 32 o 64 bit);
- L'input  $C_{IN}$  rappresenta il riporto della somma di eventuali numeri precedenti;
- L'output S porta in uscita il valore della somma tra A, B e  $C_{IN}$  (composto da N bit);
- L'output  $C_{OUT}$  rappresenta il riporto finale della somma tra A, B e  $C_{IN}$ .

Esistono due tipi di multi-bit adders:

- RIPPLE-CARRY ADDERS: semplici con prestazioni poco efficienti;
- CARRY-LOOKAHEAD ADDERS: complessi con prestazioni molto efficienti.

![Symbol for a multi-bit adder: a trapezoid with inputs A and B at the top, each labeled with 'N' indicating N bits. A carry-in C_in is on the right, and a car...](images/p058_fig03.png)

---

<!-- Pagina 59 -->

## Ripple-Carry Adders

![Diagram of a ripple-carry adder chain. It shows four full adders in series. The first adder takes inputs A31, B31, and C30, producing S31 and C31. The second...](images/p059_fig01.png)

Un ripple-carry adder che somma due parole binarie di  $N$  bit è, sostanzialmente, una catena di  $N$  "full adder". Quindi, la somma tra due parole binarie di  $N$  bit avviene cifra per cifra e i riporti finali  $C_{OUT}$  di tutte queste somme sono riportati nei full adder successivi nell'input  $C_{IN}$ . Il principale vantaggio dell'utilizzo del ripple-carry adder è che è molto intuitivo (rappresenta proprio i passaggi che si fanno per una somma bit a bit), ma lo svantaggio principale è che è un sistema lento, infatti il ritardo generato da un ripple-carry adder è pari a:

$$
N * t_{FA}
$$

dove  $t_{FA}$  rappresenta il ritardo per ottenere l'output di un singolo full adder e  $N$  è il numero di full adder messi in sequenza per sommare parole binarie di  $N$  bit.

## Carry-lookahead Adders VEDERE VIDEO

Un carry-lookahead adder è un altro tipo di CPA nel quale il circuito è suddiviso in tanti blocchi (ad esempio, un 32-bit adder può essere suddiviso in 8 blocchi di 4 bit) che riescono a determinare velocemente il riporto non appena si conosce il valore degli input  $C_{IN}$ ,  $A$  e  $B$  grazie alla seguente considerazione:

<table border="1">
<thead>
<tr>
<th>$C_{IN}$</th>
<th>$A$</th>
<th>$B$</th>
<th>$C_{OUT}$</th>
<th>$S$</th>
</tr>
</thead>
<tbody>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>0</td><td>1</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>0</td><td>1</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td></tr>
</tbody>
</table>

- Nei casi in cui  $A=0$  e  $B=0$ , a prescindere dal valore di  $C_{IN}$ ,  $C_{OUT}=0$ ;
- Nei casi in cui  $A=0$  e  $B=1$ ,  $C_{OUT}=C_{IN}$ ;
- Nei casi in cui  $A=1$  e  $B=0$ ,  $C_{OUT}=C_{IN}$ ;
- Nei casi in cui  $A=1$  e  $B=1$ , a prescindere dal valore di  $C_{IN}$ ,  $C_{OUT}=1$ .

Quindi, è possibile semplificare la tabella di verità nel modo seguente:

<table border="1">
<thead>
<tr>
<th>$C_{i-1}$</th>
<th>$A_i$</th>
<th>$B_i$</th>
<th>$C_i$</th>
<th></th>
</tr>
</thead>
<tbody>
<tr><td>0</td><td>0</td><td>0</td><td>0</td><td rowspan="2">(C<sub>i</sub>=0 in entrambi i casi)</td></tr>
<tr><td>1</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>0</td><td>0</td><td>1</td><td>0</td><td rowspan="2">(Propagate)</td></tr>
<tr><td>1</td><td>0</td><td>1</td><td>1</td></tr>
<tr><td>0</td><td>1</td><td>0</td><td>0</td><td rowspan="2">(Propagate)</td></tr>
<tr><td>1</td><td>1</td><td>0</td><td>1</td></tr>
<tr><td>0</td><td>1</td><td>1</td><td>1</td><td rowspan="2">(Generate)</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>1</td></tr>
</tbody>
</table>

Da questa nuova semplificazione della tabella di verità, è possibile definire due funzioni:

- **GENERATE**: il bit  $i$ -esimo  $C_i$  produce un riporto ( $C_i=1$ ) se e solo se  $A_i$  e  $B_i$  sono entrambi uguali a 1. L'espressione booleana della funzione  $G$  è la seguente:  $G_i = A_i * B_i$ ;
- **PROPAGATE**: il bit  $i$ -esimo  $C_i$  produce un riporto ( $C_i=1$ ) quando  $C_{i-1}$  si propaga in  $C_i$ , ovvero se e solo  $A_i=1$  oppure  $B_i=1$ . L'espressione booleana della funzione  $P$  è la seguente:  $P_i = A_i + B_i$  (ovviamente  $C_{i-1}$  deve essere uguale a 1, per questo si aggiunge l'AND);

---

<!-- Pagina 60 -->

Quindi, l'espressione booleana per identificare quando una somma ha un riporto, cioè quando  $C_{OUT}=1$ , è la seguente:

$$
C_i = A_i B_i + (A_i + B_i) * C_{i-1} = G_i + P_i * C_{i-1}
$$

Finora abbiamo esaminato il caso delle funzioni Generate e Propagate solo per singole cifre binarie i-esime. Adesso è necessario estendere queste funzioni a blocchi di K bit, dal bit i-esimo al bit (i+k-1)-esimo (che è proprio il funzionamento del carry-lookahead adder).

Per vedere come  $C_{i+k-1}$  si comporta in funzione di  $C_{i-1}$ , supponiamo un esempio in cui abbiamo un blocco di K = 4 bit. Dobbiamo esaminare qual è il valore di  $C_{i+3}$  in funzione del valore di  $C_{i-1}$ .

<table border="1">
<thead>
<tr>
<th></th>
<th>$C_{i+3}$</th>
<th>$C_{i+2}$</th>
<th>$C_{i+1}$</th>
<th>$C_i$</th>
<th>$C_{i-1}$</th>
</tr>
</thead>
<tbody>
<tr>
<td>Carry IN</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
</tr>
<tr>
<td>A</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
</tr>
<tr>
<td>B</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
</tr>
<tr>
<td>Somma</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
</tr>
</tbody>
</table>

Partendo dai primi bit del blocco rosso, si vede che tutte le somme bit a bit corrispondono ad una funzione Propagate. Allora, il bit di  $C_{i-1}$  si propagherà fino al bit  $C_{i+3}$ . Quindi, se tutte le coppie bit a bit rispettano l'espressione booleana della funzione Propagate, allora il valore del bit  $C_{i-1}$  si propaga per tutto il blocco (sia se è 0, sia se è 1).

Se nel blocco di 4 bit, c'è una combinazione che rispetta l'espressione booleana della funzione Generate, allora il riporto successivo è sicuramente 1 (si propaga fino alla fine del blocco solo se dopo sono presenti tutte funzioni Propagate). Al contrario, se nel blocco di 4 bit c'è una combinazione A=0 e B=0, allora il riporto successivo è sicuramente 0 (si propaga fino alla fine del blocco solo se dopo sono presenti tutte funzioni Propagate). In entrambi questi casi, il valore del riporto finale non dipende dal valore del riporto iniziale.

Quindi, in generale (per un blocco di K bit dal bit i-esimo al bit j-esimo):

- Propagate:  $P_{i:j} = P_i P_{i-1} \dots P_j$
- Generate:  $G_{i:j} = G_i + P_i * (G_{i-1} + P_{i-1} * (\dots (G_{j+1} + P_{j+1} * G_j)))$
- Riporto finale (si ottiene o per generazione o per propagazione del riporto precedente al blocco i-j):  $C_i = G_{i:j} + P_{i:j} * C_{j-1}$

Per eseguire un addizione con il carry-lookahead adder si devono seguire questi 3 passaggi:

1. Calcolare tutti i  $G_i$  e  $P_i$  (bit per bit);
2. Calcolare G e P per i singoli blocchi di K bit;
3. Il riporto  $C_{in}$  si propaga nei blocchi di K bit mediante la logica Propagate/Generate studiata al punto 2.

---

<!-- Pagina 61 -->

Ad esempio, nel caso di somme di parole binarie di 32 bit, è possibile suddividere le parole in 8 blocchi da 4 bit. Ogni blocco è costruito mediante il seguente circuito:

![Diagram of a 4-bit CLA Block and its internal ripple-carry adder structure.](images/p061_fig01.png)

- Le parole binarie sono suddivise in blocchi da 4 bit;
- Ogni blocco è costituito da un ripple-carry adder di 4 full adder, che calcola le somme bit a bit di ogni bit del blocco;
- Inoltre, si ha il circuito combinatorio che corrisponde alle espressioni booleane per blocchi di 4 bit delle funzioni Propagate/Generate, utilizzate per vedere come si comporta il riporto finale in funzione di quello iniziale ( $C_{OUT} = G_{3,0} + P_{3,0} * C_{IN}$ ).

Il vantaggio principale di un carry-lookahead adder, nonostante la presenza di un ripple-carry adder all'interno di ogni blocco, è la sua caratteristica di riuscire a calcolare il valore del riporto finale di ogni blocco di K bit. In questo esempio, l'adder non deve calcolare 32 riporti (uno per ogni somma bit a bit come avviene nel ripple-carry), ma solo 8, cioè uno per ogni blocco. Questa caratteristica lo rende molto più rapido di un ripple-carry adder, infatti il ritardo generato da un carry-lookahead adder è pari a:

$$
t_{CLA} = t_{PG} + t_{PG\_block} + \left(\frac{N}{k} - 1\right) * t_{AND\_OR} + k * t_{FA}
$$

- $t_{PG}$ : ritardo impiegato dall'adder per generare  $P_i$  e  $G_i$ ;
- $t_{PG\_block}$ : ritardo impiegato dall'adder per generare  $P_{i,j}$  e  $G_{i,j}$  (questi due tempi appena elencati sono sommati solo una volta al ritardo finale di un CLA, perché tutti i blocchi dell'adder lavorano in parallelo);
- $t_{AND\_OR}$ : ritardo che occorre per propagare  $C_{IN}$  fino a  $C_{OUT}$ , dopo aver calcolato  $P_{i,j}$  e  $G_{i,j}$ , attraverso la logica a due livelli composta dalla porta AND e la porta OR. Questo singolo ritardo deve essere moltiplicato per  $\frac{N}{k} - 1$ , ovvero il numero di blocchi meno 1;
- $k * t_{FA}$ : il tempo necessario affinché un singolo full adder calcoli il valore corretto di  $S$  moltiplicato per  $k$  (per indicare il numero di full adder presenti in ogni blocco).

Ad esempio, mettiamo a confronto i tempi di calcolo di un ripple-carry adder a 32 bit e di un carry-lookahead adder a 32 bit con blocchi di 4 bit in una somma tra due parole binarie di 32 bit (supponiamo che il delay di un full adder è di 300ps e il ritardo di una porta a 2 input è di 100ps):

- $T_{RIPPLE}$ :  $N * t_{FA} = 32 * 300ps = 9600ps = 9,6ns$
- $T_{CLA}$ :  $t_{CLA} = t_{PG} + t_{PG\_block} + \left(\frac{N}{k} - 1\right) * t_{AND\_OR} + k * t_{FA} = 100ps + 6 * 100ps + 7 * 300ps + 4 * 300ps = 3300ps = 3,3ns$ .

---

<!-- Pagina 62 -->

### Sottrattore

Nella rappresentazione in complemento a 2, per sottrarre un numero ad un altro è necessario complementare il secondo operando, ovvero invertire il valore di ogni singolo bit di questo numero e poi sommare 1. Quindi, l'implementazione di questo circuito aritmetico è la seguente:

![Symbol for a subtractor: two inputs A and B with 'N' bars, a minus sign inside a trapezoid, and an output Y with an 'N' bar.; Implementation of a subt](images/p062_fig01.png)

<table border="1">
<thead>
<tr>
<th>Simbolo</th>
<th>Implementazione</th>
</tr>
</thead>
<tbody>
<tr>
<td>
(Symbol for a subtractor: two inputs A and B with 'N' bars, a m...)
</td>
<td>
<p>(multi-bit adder con secondo operando negativo e riporto iniziale $C_N=1$)</p>
(Implementation of a subtractor: a multi-bit adder with inputs...)
</td>
</tr>
</tbody>
</table>

### Comparatore di uguaglianza (esempio con parole binarie di 4 bit)

Un comparatore di uguaglianza controlla se due parole binarie A e B sono uguali. L'implementazione di questo circuito aritmetico è la seguente:

![Symbol for a 4-bit equality comparator: two inputs A and B with '4' bars, an equals sign inside a rectangle, and an output 'Equal'.; Implementation of](images/p062_fig02.png)

<table border="1">
<thead>
<tr>
<th>Simbolo</th>
<th>Implementazione</th>
</tr>
</thead>
<tbody>
<tr>
<td>
(Symbol for a 4-bit equality comparator: two inputs A and B wit...)
<p>Equal è uguale 1 se e solo se le due parole binarie sono uguali cifra per cifra, altrimenti risulta essere uguale a 0.</p>
</td>
<td>
(Implementation of a 4-bit equality comparator: four XNOR gates...)
<p>La porta logica XNOR restituisce 1 se e solo se le due cifre binarie nella stessa posizione sono uguali. Gli output delle porte XNOR sono dati in ingresso ad una porta AND. Quindi, le due parole binarie sono uguali se e solo se tutte le porte XNOR restituiscono 1.</p>
</td>
</tr>
</tbody>
</table>

### Comparatore completo a 1 bit

Un comparatore completo a 1 bit compara i valori di due bit in ingresso A e B e restituisce tre output:  $A > B$ ,  $A = B$ ,  $A < B$ . Esaminiamo l'implementazione e la tabella di verità di questo circuito aritmetico:

![Implementation of a 1-bit comparator: two AND gates for A-barB-bar and A-barB-bar, and an OR gate for A=B.](images/p062_fig03.png)

<table border="1">
<thead>
<tr>
<th>Tabella di verità</th>
<th>Implementazione</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<table border="1">
<thead>
<tr>
<th>A</th>
<th>B</th>
<th>$A &gt; B$</th>
<th>$A = B$</th>
<th>$A &lt; B$</th>
</tr>
</thead>
<tbody>
<tr>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>0</td>
</tr>
<tr>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
</tr>
<tr>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>1</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>0</td>
</tr>
</tbody>
</table>
</td>
<td>
<p>(come visto prima, l'OR negativo si può sostituire con una porta XNOR degli ingressi A e B)</p>
(Implementation of a 1-bit comparator: two AND gates for A-barB...)
</td>
</tr>
</tbody>
</table>

---

<!-- Pagina 63 -->

### Comparatore completo a 4 bit

Nei moderni calcolatori elettronici, per comparare parole binarie di 4 bit (come in quest'esempio) si esegue la differenza tra le due parole e si va a controllare se il risultato è maggiore di 0, uguale a oppure minore di 0. Da un punto di vista più intuitivo, però, si potrebbe costruire un comparatore completo a 4 bit attraverso questo circuito:

![Circuit diagram of a 4-bit complete comparator. It consists of four 1-bit comparators (C0, C1, C2, C3) and four 1-bit AND gates (D0, D1, D2, D3). Each 1-bit...](images/p063_fig01.png)

Le black box  $C_3$   $C_2$   $C_1$  e  $C_0$  rappresentano dei comparatori completi a 1 bit, che controllano se le singole cifre (nella stessa posizione) sono uguali, sono l'una minore dell'altra o viceversa. Ad esempio, se la cifra più significativa di A è maggiore della cifra più significativa di B, allora  $C_3$  restituisce 1 sull'output ">" e 0 sugli altri due output.

Esaminando il circuito, si può notare che la porta AND  $D_3$  dà come risultato 1 (supponendo che  $A_4=B_4 = 1$ ,  $A_4 > B_4 = 0$  e  $A_4 < B_4 = 0$ ), che, riportato come ingresso nella porta OR finale, restituisce  $A > B = 1$ . Dato che gli altri due output di  $C_3$  sono uguali a 0, tutte le altre porte AND dei comparatori successivi bit a bit saranno 0 e, quindi risulta che l'output ( $A=B$ ) = 0 e che l'output  $A < B = 0$ .

### Comparatore completo a 12 bit

Un comparatore completo a 12 bit è composto da 3 comparatori completi a 4 bit in serie.

![Circuit diagram of a 12-bit complete comparator. It consists of three 4-bit comparators (Comp.0, Comp.1, Comp.2) connected in series. Comp.0 takes inputs A11...](images/p063_fig02.png)

---

<!-- Pagina 64 -->

### ALU (Arithmetic Logic Unit)

L'ALU è una componente del processore di un calcolatore elettronico adibita all'esecuzione di operazioni aritmetiche e logiche tra interi rappresentati in complemento a due, come la somma, la differenza, l'AND e l'OR bit a bit.

In generale, una ALU ha in input due parole binarie di N bit in ingresso, A e B e due bit che permettono di decidere quale operazione deve essere effettuata sugli ingressi, ovvero i bit ALUControl. La codifica è la seguente: Somma → 00, Differenza → 01, AND → 10, OR → 11.

Inoltre, una ALU ha in output:

- **RESULT**: una parola binaria di N bit che rappresenta il risultato dell'operazione eseguita tra A e B.
- **ALUFlags**: N=1 indica che il risultato è negativo; Z=1 indica che il risultato è 0; C=1 indica il riporto finale del sommatore; V=1 indica che il sommatore produce un overflow.

![Schematic symbol for an ALU. It shows a trapezoidal shape with inputs A and B (each N bits) at the top, and a control input ALUControl (2 bits) on the right....](images/p064_fig01.png)

È costituita da due zone:

- **ZONA GIALLA**: in questa zona si trovano gli operatori, ovvero:

- L'OR bit a bit tra A e B;
- L'AND bit a bit tra A e B;
- La somma tra A e B è realizzata mediante un sommatore (tipicamente carry-lookahead);
- La sottrazione tra A e B è realizzata mediante lo stesso sommatore, ma con l'ingresso di B complementato. L'ALU decide se complementare o meno la parola binaria B in base al valore del bit meno significativo dell'ALUControl, che è utilizzato come selettore di un multiplexer.

Quindi, tutte le operazioni aritmetiche e logiche sono eseguite in parallelo dall'ALU e i risultati vanno in ingresso ad un multiplexer. L'output Result sarà uguale solo ad uno di questi quattro ingressi ed è scelto in base al valore dei selettori ALUControl.

- **ZONA VERDE**: qui si trova il circuito necessario al calcolo dei quattro valori dei flag:

- **Flag N**: è uguale a 1 se e solo se il bit più significativo di Result è uguale 1;
- **Flag Z**: è uguale a 1 se e solo se l'AND bit a bit tra tutti i bit negati di Result restituisce 1;
- **Flag C**: è uguale a 1 se e solo se l'AND tra  $C_{OUT}$  (riporto finale dell'adder) e  $ALUControl_1$  è uguale a 1 (l'ALU sta eseguendo una somma o una sottrazione se e solo se  $ALUControl = 00$  oppure  $01$ );
- **Flag V**: è uguale a 1 se e solo se la somma di due numeri con lo stesso segno produce un numero di segno opposto (rappresentazione in complemento a 2). Quindi,  $V=1$  se e solo se:

1. Si sta eseguendo una somma o una sottrazione ( $ALUControl_1 = 1$ );
2. Il bit più significativo dell'input A e della somma tra A e B è diverso ( $A \oplus Sum_{N-1}$ );
3. Lo XNOR a tre vie ( $A_{N-1} \oplus B_{N-1} \oplus ALUControl_0$ ) restituisce 1 se e solo se gli input sono tutti 0 (A e B hanno lo stesso segno in una somma - 000) oppure c'è un numero pari di 1 in ingresso (A e B hanno lo stesso segno in una somma - 110 - oppure A e B hanno segno diverso in una sottrazione - 011 e 101).

---

<!-- Pagina 65 -->

## Shifters

Gli shifters sono delle componenti circuitali che consentono di **traslare i bit verso destra o sinistra di un registro**. Esistono diverse tipologie di shifters:

1. **LOGICAL SHIFTERS**: trasla i bit verso sinistra o destra **riempiendo gli spazi vuoti con degli 0**. Ad esempio,  $10101100 \gg 2 = 00101011$ , oppure  $10101100 \ll 2 = 10110000$ ;
2. **ARITHMETIC SHIFTERS**: si comporta come il logical shifters per quanto riguarda la traslazione di bit verso sinistra, invece per quanto riguarda la traslazione di bit verso destra, riempie gli spazi vuoti con il bit più significativo. Ad esempio,  $10111001 \gg 3 = 11110111$ . L'arithmetic shifter è detto così perché è in grado di eseguire la moltiplicazione ( $A \ll N = A \cdot 2^N$ ) e la divisione ( $A \gg N = A / 2^N$ ) di una parola binaria di un registro per una potenza di 2. Ad esempio:  $00001 \ll 2 = 00100$  ( $1 \cdot 2^2 = 4$ ) oppure  $10000 \gg 2 = 11100$  ( $-16 / 2^2 = -4$ );
3. **ROTATOR**: ruota i bit all'interno di un registro in modo circolare, in modo tale che "i bit che escono da un lato, rientrano dall'altro". Ad esempio,  $11001001 \text{ ROR } 3 = 00111001$  oppure  $11001001 \text{ ROL } 3 = 01001110$ .

Logical Shifters (rotazione a destra per registri di 4 bit)

![Symbol for Logical Shifter: A 4-bit input A3:0 enters a block labeled 'shamt1:0' with a '2' on top, and a 4-bit output Y3:0 exits.](images/p065_fig01.png)

Arithmetic Shifters (rotazione a destra per registri di 4 bit)

![Symbol for Arithmetic Shifter: A 4-bit input A3:0 enters a block labeled 'shamt1:0' with a '2' on top, and a 4-bit output Y3:0 exits.](images/p065_fig02.png)

---

<!-- Pagina 66 -->

### Counters

I contatori sono dispositivi utilizzati, appunto, per **contare e incrementare**, ad ogni clock, il suo valore di un'unità. Inoltre, consentono di realizzare alcune componenti microarchitetturali come il Program Counter.

Simbolo

![Symbol for a counter. It is a rectangle with a clock input (CLK) at the top, a reset input (Reset) at the bottom, and an N-bit output (Q) on the right side.](images/p066_fig01.png)

Implementazione

![Implementation of a counter using a register and an adder. A register (r) has a clock input (CLK) and a reset input (Reset). Its input is the sum of its curr...](images/p066_fig02.png)

CLK: il counter è sincronizzato con il clock;

Reset: per resettare il valore di Q a 0;

N: il counter utilizza registri di N bit (ad esempio, con 3 bit a disposizione, conta da 000 a 111 ciclicamente)

Il registro memorizza il valore corrente del counter (può essere resettato in modo asincrono dall'input Reset) e ad ogni fronte di salita del clock, il registro aggiorna il suo stato corrente con il prossimo stato che non è altro che la somma dello stato corrente + 1 (questo valore proviene dall'adder). Ovviamente, il ritardo generato dall'adder deve essere inferiore alla frequenza del clock.

### Shift Registers (convertitore da seriale a parallelo)

Gli shift registers sono delle componenti composte da un clock, un input seriale  $S_{in}$ , un output seriale  $S_{out}$  e N output paralleli  $Q_{(N-1):0}$ . Ad ogni fronte di salita del clock, un nuovo bit viene traslato nell'ingresso  $S_{in}$  (in modo seriale, cioè un bit per volta). Questo tipo di shift register è anche detto convertitore da seriale a parallelo, in quanto l'input che è uno stream seriale di bit, viene restituito, dopo N cicli di clock, in un output parallelo Q composto da N bit.

Simbolo

![Symbol for a shift register. It is a rectangle with a clock input (CLK) at the top, a serial input (S_in) at the bottom left, a serial output (S_out) at the...](images/p066_fig03.png)

Implementazione

![Implementation of a shift register using a pipeline of registers. A series of registers are connected in a pipeline. The first register has a clock input (CL...](images/p066_fig04.png)

È composto da un insieme di registri, pilotati dallo stesso clock, messi in pipeline.

![Diagram showing the operation of a shift register over four clock cycles. The input S_in is a stream of bits: 0, 1, 0, 1. The output S_out is the same stream...](images/p066_fig05.png)

Ad esempio, supponiamo di avere uno stream di ingresso in  $S_{in}$  01011 (e così via). Dopo un primo ciclo di clock, il valore 1 (01011) passa e diventa il valore a valle del primo registro, invece il valore 1 (01011) si troverà prima del primo registro. Al secondo ciclo di clock, il valore 1 (01011) passa e diventa il valore a valle del secondo registro, invece il valore 1 (01011) si troverà a valle del primo registro e così via per tutti i bit seguenti. Quindi, dopo un numero N di cicli di clock, i valori dello stream di input  $S_{in}$  sono passati lungo tutte le uscite  $Q_0, Q_1, Q_2, \dots, Q_{N-1}$ , convertendosi così in una sequenza parallela di valori. Quindi, dopo N cicli di clock, questo convertitore ha trasformato l'andamento seriale nel tempo di  $S_{in}$ , in unico valore multi-bit da poter leggere in parallelo.

Un esempio di utilizzo di un convertitore da seriale a parallelo è la lettura da tastiera: infatti, quando si scrive da tastiera, l'elaboratore deve riuscire a memorizzare (in uno shift register che funge da buffer di input) ed elaborare tutti i tasti che vengono battuti ed inviati attraverso un canale seriale (non immediatamente, la sincronia tra sistema e periferica dovrebbe essere eccezionale).

SCHEDA DI RETE

---

<!-- Pagina 67 -->

## Memory Arrays

I registri costruiti grazie ai D Flip-Flop sono un tipo di memoria che immagazzinano solo una piccola quantità di dati. Invece, i memory arrays possono memorizzare una quantità di dati enormemente più grande. Un dato di M bit viene letto/scritto in memoria ad un unico indirizzo composto da N bit.

![Diagram of a memory array showing its address and data inputs, and a detailed view of its internal structure.](images/p067_fig01.png)

In generale, un memory array ha un ingresso "Address" di  $N$  bit che indica a quale indirizzo di memoria mi sto riferendo per leggere o scrivere un dato e una linea di input/output di  $M$  bit "Data" che indica proprio il dato in output che si deve leggere oppure il dato in input che si deve scrivere, in un certo indirizzo di memoria.

In un moderno calcolatore elettronico, la più piccola unità memorizzabile è un byte, cioè 8 bit, quindi  $M=8$ , invece  $N$ , cioè il numero di bit che rappresentano un certo indirizzo, è di 32 o 64 bit.

Quindi, le memorie possono essere considerate come degli array bidimensionali. Con  $N$  bit di ingresso per gli indirizzi e  $M$  bit di ingresso per i dati si hanno  $2^N$  righe, dette parole, e  $M$  colonne. Quindi, l'array contiene  $2^N$  parole di  $M$  bit ciascuna, ognuna identificata da uno specifico indirizzo.

![Diagram of a memory cell showing its internal structure with wordline and bitline connections.](images/p067_fig02.png)

Ogni singola cella di memoria dell'array è una specifica componente circuitale che memorizza un solo bit. Ad ognuna di esse, è collegata:

- **WORDLINE:** serve ad indicare a quale parola ci si sta riferendo, cioè ad ogni indirizzo corrisponde una singola riga e, quindi, una singola wordline;
- **BITLINE:** consente di scrivere o leggere, lungo una data parola, un singolo bit sulla colonna corrispondente.

Dal punto di vista circuitale, quando la wordline di una certa parola è uguale a 1 (il valore del potenziale elettrico è HIGH), significa che è abilitata la lettura/scrittura per quella parola, ed il valore memorizzato all'interno di un singolo bit è dato dal valore della bitline corrispondente. Invece, quando la wordline è uguale a 0, significa che non è abilitata la lettura/scrittura per quella parola (i bit continuano a mantenere memoria del loro valore) e, quindi, le bitline corrispondenti ai singoli bit devono essere in uno stato di alta impedenza (come se la bitline fosse scollegata dal bit della cella di memoria).

Sostanzialmente, la wordline agisce come un abilitatore per la lettura/scrittura di un dato in una certa parola della memoria. Affinché la memoria funzioni correttamente, solo una wordline per volta può essere abilitata ed è abilitata proprio quella wordline corrispondente all'indirizzo di memoria in cui si vuole leggere/scrivere. Un funzionamento del genere si realizza mediante l'utilizzo di un decoder (nell'esempio  $N=2$  e  $M=3$ , in totale 4 parole di 3 bit).

---

<!-- Pagina 68 -->

![Diagram of a 2:4 Decoder interfaced with a memory array. The decoder has an 'Address' input with 2 bits. It has four outputs labeled wordline0, wordline1, wo...](images/p068_fig01.png)

I due bit in ingresso al decoder abilitano solo uno dei possibili output del decoder stesso, che, quindi, corrisponde all'attivazione di una singola wordline (tutte le altre uscite del decoder non sono abilitate e, quindi, è come se tutte le altre bitline fossero scollegate).

### Tipi di memorie

Esistono, principalmente, due categorie di memorie:

- **RANDOM ACCESS MEMORY (RAM)**: la memoria RAM è anche detta **memoria volatile** che significa, sostanzialmente, che i dati memorizzati al suo interno **sono persi quando il sistema viene spento**. Essa costituisce la memoria primaria e centrale di un elaboratore. In una RAM, il tempo di accesso ad una parola è lo stesso indipendentemente dall'indirizzo (a differenza dell'accesso sequenziale su nastro oppure l'accesso a dati in un HDD);
- **READ ONLY MEMORY (ROM)**: la memoria ROM è anche detta **memoria non volatile**, che significa, sostanzialmente, che i dati memorizzati al suo interno continuano ad essere memorizzati anche quando il sistema viene spento (ad esempio, gli HDD e gli SSD sono memorie ROM). "Read only" indica che le vecchie memorie venivano scritte bruciando dei fusibili, che, una volta bruciati, non era più possibile modificabili. Ad oggi, ovviamente, non è più così.

Le operazioni di lettura e scrittura sono più veloci in una RAM rispetto in una ROM, dove la lettura è relativamente veloce ma la scrittura o è lenta o non è possibile.

Inoltre, esistono due tipi di memorie RAM che si differenziano per le componenti circuitali utilizzate:

### Dynamic RAM (DRAM)

Utilizzano le capacità per memorizzare un bit (es. di utilizzo: memoria centrale di un calcolatore).

![Diagram illustrating the DRAM cell structure. On the left, a simplified schematic shows a 'wordline' connected to a 'stored bit' box, which is connected to a...](images/p068_fig02.png)

Sostanzialmente, in una DRAM, la black box "stored bit" è realizzata mediante un transistor cMOS e una capacità che scarica a terra (potenziale elettrico 0). Un cMOS funziona come un interruttore (corto circuito): quando la wordline è uguale a 1, la capacità è direttamente collegata alla bitline; invece, quando la wordline è uguale a 0, la capacità è scollegata dalla bitline che, quindi, si trova in uno stato di alta impedenza Z (come se l'interruttore fosse aperto).

---

<!-- Pagina 69 -->

In particolare, se la wordline è uguale a 1 e la bitline è uguale a 0, non c'è differenza di potenziale e la capacità tende a scaricarsi, cioè ad avere valore 0. Se, invece, la wordline è uguale a 1 e la bitline è uguale a 1, la capacità può essere vista come un contenitore che, quando passa corrente, aumenta la differenza di potenziale al suo interno fino a raggiungere il valore nominativo  $V_{DD}$  che corrisponde al bit memorizzato 1.

Tuttavia, quando la capacità raggiunge il suo massimo potenziale e la bitline torna a 0, il bit continua a mantenere memoria del suo valore, ma non per un tempo indefinito. Infatti, il valore del potenziale della capacità comincia a scendere pian piano fino a tornare a 0. Quindi, per risolvere questo difetto è necessario, di tanto in tanto, ricaricare la capacità (refresh). Questa è una delle caratteristiche fondamentali di una DRAM.

Nel tempo, le memorie DRAM si sono evolute e, attualmente, le memorie centrali dei nostri calcolatori sono delle DOUBLE DATA RATE SYNCHRONOUS DRAM (DDRSDRAM). In questo nuovo tipo di memoria DRAM sincronizzata con il clock, le operazioni di lettura e scrittura avvengono sia nel fronte di salita che nel fronte di discesa del clock. Così facendo, viene raddoppiata la velocità teorica massima di trasferimento dei dati.

### Static RAM (SRAM)

Utilizzano gli inverteri per memorizzare un bit (es. di utilizzo: memorie cache a rapido accesso).

![Diagram illustrating the SRAM cell structure and its operation. The left side shows a simplified schematic of a memory cell with a wordline, a bitline, and a...](images/p069_fig01.png)

In ogni cella di memoria di una parola, la bitline viene sdoppiata in due ingressi i cui valori sono sempre l'uno l'opposto dell'altro. Una cella di memoria di una SRAM utilizzata per memorizzare un singolo bit è composta da una wordline, 2 transistor CMOS e, infine, due inverteri accoppiati in topologia inversa, cioè che l'output di uno diventa l'input dell'altro e viceversa.

Quando la wordline è 0, proprio come nel circuito della DRAM, i due transistor CMOS si comportano come fossero due interruttori aperti, e ciò significa che la bitline e il suo coniugato sono scollegati dalla cella di memoria (circuito monostabile, persiste nel suo stato e mantiene memoria del suo valore precedente). Invece, quando la wordline è 1 significa che la cella di memoria è collegata alla bitline e al suo coniugato e, quindi, è possibile memorizzare un nuovo valore nella cella. In particolare, il bit memorizzato è 1 se la bitline è 1, altrimenti è 0 (il circuito, in entrambi i casi, è stabile).

Le memorie DRAM, in generale, sono più lente delle memorie SRAM (a loro volta sono più lente dei D Flip-Flop), in quanto è necessario aspettare che la differenza di potenziale nella capacità si alzi fino al valore  $V_{DD}$ . Un altro difetto delle memorie DRAM è che è necessario un refresh periodico per memorizzare un dato per lunghi periodi di tempo, inducendo così ad un maggior consumo di energia. D'altro canto, però, le memorie DRAM sono molto più economiche delle memorie SRAM e dei D Flip-Flop, perché utilizzano un solo transistor per cella di memoria (le SRAM ne utilizzano 6 e i D Flip-Flop circa 20).

---

<!-- Pagina 70 -->

## Read Only Memory (ROM)

Sono delle memorie in cui, ogni cella di memoria che memorizza un singolo bit è costituita dalla connessione diretta tra wordline e bitline. Se il valore di una wordline è uguale a 1, il valore della bitline, allora (come se ci fosse un interruttore), è riportato nella cella di memoria. Il contenuto di una memoria ROM può essere rappresentato, principalmente, in 2 modi:

### Rappresentazione del contenuto:

1. Dot-notation
2. Array di valori

![Diagram of a 2:4 Decoder ROM array. A 2-bit address (Address) is connected to a 2:4 Decoder. The decoder outputs are connected to four horizontal lines (word...](images/p070_fig01.png)

### Implementazione:

1. Con logica combinatoria
2. Con fusibili

![Diagram of a 2:4 Decoder ROM array implemented with fuses. A 2-bit address (Address) is connected to a 2:4 Decoder. The decoder outputs are connected to four...](images/p070_fig02.png)

La memoria ROM può essere vista come un circuito che realizza varie funzioni di output, ad esempio:

$$
Data_2 = A_1 \oplus A_0 - Data_1 = \overline{A_1} + A_0 - Data_0 = \overline{A_1} \overline{A_0}
$$

Non è assolutamente un modo economico per realizzare un'unica funzione booleana, ma è sicuramente una buona alternativa per realizzare più funzioni booleane insieme. Quindi, le memorie ROM sono anche dette Lookup Tables, proprio perché è possibile guardare i singoli output (data) in funzione degli ingressi (indirizzo).

### Address Data

<table border="1">
<tr>
<td>11</td>
<td>0</td>
<td>1</td>
<td>0</td>
</tr>
<tr>
<td>10</td>
<td>1</td>
<td>0</td>
<td>0</td>
</tr>
<tr>
<td>01</td>
<td>1</td>
<td>1</td>
<td>0</td>
</tr>
<tr>
<td>00</td>
<td>0</td>
<td>1</td>
<td>1</td>
</tr>
</table>

↑  
depth

← width

![Diagram of a bit cell containing 0. It shows a wordline connected to a transistor and a bitline connected to a resistor (fuse). The transistor is open, and t...](images/p070_fig03.png)

![Diagram of a bit cell containing 1. It shows a wordline connected to a transistor and a bitline connected to a resistor (fuse). The transistor is open, but t...](images/p070_fig04.png)

## Fuse Programmable ROM

Un altro metodo (vecchio) per realizzare una memoria ROM, è attraverso l'utilizzo di fusibili. Quando la wordline è uguale a 1 e il fusibile è intatto, il valore memorizzato nella cella di memoria è 0 (si comporta come un corto circuito che scarica a terra), invece, quando il fusibile è bruciato, il valore memorizzato è 1. Se la wordline è uguale a 0, il transistor si comporta come un interruttore aperto che scollega la bitline dal fusibile, in modo tale che continui a conservare memoria.

appunticlienti@studenti.com

---

<!-- Pagina 71 -->

## Logic Arrays

Proprio come le memorie, anche le porte logiche possono essere organizzate in array, in modo da realizzare una qualunque funzione booleana. Ci sono principalmente due tipi di logic arrays:

1. PROGRAMMABLE LOGIC ARRAYS (PLA): può realizzare solo circuiti combinatori tramite una logica a due livelli in forma SOP. È composto dagli input positivi e negati, un AND array che permette di produrre gli implicanti a partire dagli input, e un OR array nel quale confluiscono tutti gli implicanti.

![Symbol for a PLA: A block labeled 'AND Array' with 'Inputs' and 'M' above it, connected to a block labeled 'OR Array' with 'Outputs' and 'P' below it. The co...](images/p071_fig01.png)

1. FIELD PROGRAMMABLE GATE ARRAYS (FPGA): può realizzare sia circuiti sequenziali sia combinatori attraverso un array di porte logiche riprogrammabili. Inoltre, possono implementare una logica multilivello (le PLA solo logiche a due livelli).

---

<!-- Pagina 73 -->

# Microarchitettura

## Definizione di Architettura e Microarchitettura

In questo capitolo studieremo gli aspetti salienti di una microarchitettura di una CPU ARM. Prima di tutto, capiamo la differenza tra architettura e microarchitettura:

- **ARCHITETTURA** (set di istruzioni): un'architettura rappresenta la logica di un calcolatore dal punto di vista del programmatore. Quindi, è una rappresentazione astratta di un calcolatore definita attraverso un set di istruzioni e operandi che costituiscono il linguaggio macchina. Al linguaggio macchina di un certo tipo di architettura (sequenze di cifre binarie) corrisponde un linguaggio assembly (codifica di queste sequenze di bit), un linguaggio più facilmente interpretabile da un uomo. Esistono diverse tipi di architetture, tra le quali ricordiamo ARM, x86, ecc.
- **MICROARCHITETTURA** (disposizione delle componenti): una microarchitettura definisce la disposizione specifica delle componenti interne al processore, come, ad esempio, l'ALU, i multiplexer, le FSM e le memorie. Quindi, rappresenta la topologia necessaria all'implementazione di un'architettura. Ad esempio, INTEL e AMD realizzano diverse microarchitetture per l'implementazione della medesima architettura, cioè la x86.

## L'architettura ARM (ARM7)

Sviluppatrice negli anni '80 dalla Advanced RISC Machines, ad oggi conta circa 10MLD di processori venduti, soprattutto in tablet e smartphone (circa il 75% della popolazione mondiale utilizza prodotti equipaggiati con processori ARM). La progettazione di un'architettura ARM segue quattro principi:

1. **REGULARITY SUPPORTS SIMPLICITY**: la regolarità favorisce la semplicità. Per esaminare questo principio, supponiamo quest'esempio:

<table border="1"><thead><tr><th>Linguaggio di alto livello</th><th></th><th>Codice ARM Assembly</th></tr></thead><tbody><tr><td>$a = b + c;$</td><td>→</td><td>ADD a, b, c</td></tr><tr><td>$a = b - c;$</td><td>→</td><td>SUB a, b, c</td></tr></tbody></table>

ADD e SUB è la keyword mnemonica che indica l'istruzione da eseguire. I due operandi sorgente sono il secondo e il terzo argomento, invece il risultato viene memorizzato in un registro che corrisponde alla variabile 'a' (operando destinazione).

Con questo principio, quindi, si intende proprio la regolarità che viene mantenuta durante la definizione di un set di istruzioni (p.e. posizione fissa degli operandi). Inoltre, ogni istruzione è rappresentata da una parola di 32 bit, anche se ne potrebbero servire di meno: questo, ancora una volta, indica la regolarità delle istruzioni e una maggiore facilità nella codifica e gestione in linguaggio macchina.

1. **MAKE THE COMMON CASE FAST**: le istruzioni più frequenti sono le più veloci. Con questo principio si intende che nell'architettura ARM ci sono solo istruzioni semplici e veloci da eseguire, che vengono ripetute frequentemente all'interno di un programma. Ad esempio:

<table border="1"><thead><tr><th>Linguaggio di alto livello</th><th></th><th>Codice ARM Assembly</th></tr></thead><tbody><tr><td>$a = b + c - d;$</td><td>→</td><td>ADD t, b, c<br/>SUB a, t, d</td></tr></tbody></table>

Istruzioni complesse corrispondono a più istruzioni codificate in ARM Assembly.

L'istruzione in linguaggio di alto livello viene codificata in ARM Assembly mediante due istruzioni semplici e separate (che utilizzano un registro per il valore intermedio 't').

---

<!-- Pagina 74 -->

Codificando poche e semplici istruzioni, anche la microarchitettura corrispondente risulta essere più facile da implementare. Per questo motivo, l'architettura ARM è un Reduced Instruction Set Computer (RISC), a differenza dell'architettura x86 che è un Complex Instruction Set Computer (CISC: molte istruzioni complesse).

3. **SMALLER IS FASTER**: poche componenti implicano maggiore velocità. Con questo principio si intende che i dati sono memorizzati direttamente nell'istruzione da eseguire. Quindi, le istruzioni in linguaggio macchina contengono non solo la tipologia di istruzione da eseguire, ma anche gli indirizzi dei dati sui quali eseguire l'istruzione oppure, a volte, gli *immediates*, ovvero delle costanti numeriche. Inoltre, questi dati sono anche memorizzati all'interno della CPU nei registri. ARM7 utilizza un register file composto da 16 registri a 32-bit, proprio come la dimensione delle istruzioni (l'accesso è molto più veloce in un piccolo registro rispetto che in una grande memoria). Tutte le istruzioni operano esclusivamente sui registri (tranne quelle operazioni che devono leggere/scrivere dati in memoria centrale) come p.e. ADD e SUB.

4. **GOOD DESIGN DEMANDS GOOD COMPROMISES**: una buona progettazione richiede alcuni compromessi. Al fine di massimizzare la semplicità dell'architettura ARM, sarebbe preferibile avere un unico formato per ogni istruzione. Ovviamente, questo renderebbe troppo piccolo il set di istruzioni. Quindi, con questo principio si intende che i primi tre principi appena elencati sono fondamentali, però, in alcuni casi, è meglio accettare dei compromessi. Nello specifico, il compromesso scelto da ARM è quello di avere 3 possibili formati di istruzione: DATA-PROCESSING (operazioni aritmetiche e logiche eseguite sui registri), MEMORY (lettura/scrittura di dati in memoria), BRANCH (istruzioni di salto che permettono di regolare il flusso di un programma: if-else, while, chiamate a funzione).

### Il processore

Un processore general-purpose, a livello astratto, è, sostanzialmente, un automa a stati finiti che esegue delle istruzioni allocate in memoria. Uno stato del sistema è definito dai valori e istruzioni contenuti nelle locazioni di memoria. In generale, per memoria si intendono tutti i registri, la memoria centrale e quella di massa. Invece, se ci si riferisce al solo processore, per memoria si intende tutti i registri contenuti in quella determinata microarchitettura.

Ogni istruzione definisce in che modo il sistema deve passare al prossimo stato. Quindi, ad ogni fronte di salita del clock, l'esecuzione di una istruzione comporta un aggiornamento di tutti i registri della CPU, ma anche, eventualmente, una modifica ai dati della memoria centrale o quella di massa. In particolare, tutto il sistema è sincronizzato da un unico clock e tutti gli indirizzi in cui andare a leggere/scrivere un dato in memoria, gli indirizzi che indicano i registri interni alla CPU e l'aggiornamento di tutti i registri devono essere settati prima del fronte del clock, cioè tutti i ritardi generati dalla componentistica interna al sistema devono essere più brevi del ciclo di clock (ovviamente se i ritardi sono maggiori del ciclo di clock, i registri non si aggiornano correttamente).

![Diagramma di un automa a stati finiti (FSM) che rappresenta un processore. Sono mostrati tre stati: Stato 1, Stato 2 e Stato 3. Ogni stato è rappresentato da...](images/p074_fig01.png)

Come detto prima, solo dal punto di vista astratto il calcolatore e il suo processore possono essere considerati un automa a stati finiti. Facendo un esempio reale, una memoria RAM al giorno d'oggi ha una capacità di qualche GB: sapendo che 1GB è uguale a  $2^{10^{10}}$  configurazioni delle possibili celle di memoria, dovrebbero esserci almeno  $2^{10^{10}}$  stati di questo automa (IMPOSSIBILE!).

---

<!-- Pagina 75 -->

### Microarchitetture a ciclo singolo

In questa particolare tipologia di microarchitettura, un'intera istruzione viene eseguita in un unico ciclo di clock. I principali pro e contro di questa microarchitettura sono:

<table border="1"><thead><tr><th>Pro</th><th>Contro</th></tr></thead><tbody><tr><td><ul><li>- Maggiore facilità nella comprensione;</li><li>- La Control Unit è più semplice;</li><li>- Non richiede stati non architetturali (tutti gli stati interni sono descrivibili con istruzioni in linguaggio macchina).</li></ul></td><td><ul><li>- Il periodo del clock deve essere maggiore rispetto all'istruzione più lenta (altrimenti l'esecuzione dell'istruzione non è completata correttamente);</li><li>- La memoria dei dati e la memoria delle istruzioni è separata (non è un tipo di microarchitettura realizzato realmente).</li></ul></td></tr></tbody></table>

### Microarchitetture a ciclo multiplo

In questa particolare tipologia di microarchitettura, un'intera istruzione è eseguita in più cicli di clock di breve durata.

<table border="1"><thead><tr><th>Pro</th><th>Contro</th></tr></thead><tbody><tr><td><ul><li>- Riuso delle componenti;</li><li>- Istruzioni diverse possono avere una durata variabile (le istruzioni non sono vincolate ad essere eseguite in un unico ciclo di clock);</li><li>- Non è richiesta una separazione logica della memoria dei dati e delle istruzioni</li></ul></td><td><ul><li>- Richiede stati interni che non sono descrivibili a livello architettonico (in linguaggio assembly);</li><li>- In alcuni casi, un'istruzione deve essere eseguita completamente prima di poter eseguire la successiva.</li></ul></td></tr></tbody></table>

### Microarchitetture con pipeline

Questa particolare tipologia di microarchitettura è un'ottimizzazione delle microarchitetture sopra elencate che ne migliora le performance. Ogni istruzione è suddivisa in varie sottoistruzionei: fetch, esecuzione e store. Queste fasi sono eseguite in pipelining, cioè mentre si esegue il fetch di un'istruzione, contemporaneamente è in atto l'esecuzione dell'istruzione precedente e lo store dell'istruzione ancora precedente.

<table border="1"><thead><tr><th>Pro</th><th>Contro</th></tr></thead><tbody><tr><td><ul><li>- Esegue più istruzioni in pipelining (ovviamente, per ogni istruzione, si esegue contemporaneamente solo una fase diversa per volta).</li><li>- Accede a dati e registri allo stesso tempo;</li></ul></td><td><ul><li>- La logica di controllo è molto complessa;</li><li>- Richiede una strutturazione in pipelining dei registri che rende l'intera microarchitettura più complessa.</li></ul></td></tr></tbody></table>

### Benchmark e misura delle prestazioni

Le performance di un dato processore e della sua microarchitettura interna si misurano tramite un'analisi sperimentale, cioè si eseguono diverse tipologie di programmi e se ne misurano le performance. Questo set di programmi da eseguire, detto BENCHMARK, deve essere abbastanza eterogeneo per misurare le prestazioni generali di un processore, oppure molto specifico se si vuole misurare le prestazioni specifiche di alcune task. Ad esempio, nel 2006, fu realizzato un benchmark costituito da programmi scritti in C e C++, come:

- programmi di "spam assassin" per la rilevazione di anomalie all'interno di testi;
- programmi di compressione di dati e video;
- programmi di compilazione di programmi;
- programmi di ottimizzazione combinatoria e path finding (percorso migliore da un punto all'altro);
- programmi di intelligenza artificiale (giochi da tavolo);
- programmi per la biologia, calcolo fisico e quantistico;

Invece, per eseguire un'analisi più teorica delle prestazioni di una CPU, è possibile calcolare il tempo di esecuzione di un programma mediante la seguente formula:

---

<!-- Pagina 76 -->

$$
\text{Tempo di esecuzione} = \# \text{Istruzioni} * \left( \frac{\text{cicli}}{\text{istruzione}} \right) * \left( \frac{\text{secondi}}{\text{ciclo}} \right)
$$

dove  $\frac{\text{cicli}}{\text{istruzione}}$  indica il numero di cicli per eseguire un'istruzione (CPI) e  $\frac{\text{secondi}}{\text{ciclo}}$  indica la durata in secondi di un singolo ciclo di clock (CLOCK PERIOD). Un altro fattore importante è l'inverso del numero di cicli per istruzione, ovvero il numero di istruzioni eseguite in un ciclo  $\frac{\text{istruzioni}}{\text{ciclo}} \text{ (IPC)}$ . Inoltre, la frequenza di clock corrisponde all'inverso del periodo di clock, ovvero  $\frac{\text{cicli}}{\text{secondo}}$ .

### Ciclo di vita delle istruzioni

In generale, l'esecuzione di un'istruzione è suddivisa in quattro fasi:

1. **FETCH**: in questa prima fase si recupera un'istruzione dalla memoria RAM e la si memorizza in un registro apposito della CPU;
2. **DECODE**: questa è la fase in cui si procede alla decodifica dell'istruzione, in modo da capire qual è la tipologia di istruzione da eseguire, prendere gli operandi e salvarli nei registri, ecc.;
3. **EXECUTE**: questa fase è principalmente realizzata dall'ALU, che esegue p. e. la somma di due registri per poi memorizzarne il risultato durante l'ultima fase;
4. **STORE**: come detto prima, in questa fase si memorizza il risultato dell'esecuzione dell'istruzione o in un registro interno alla CPU o direttamente in memoria centrale.

### Design di una microarchitettura

Una microarchitettura è costituita da due macrocomponenti che dialogano e interagiscono tra loro:

1. **DATAPATH** (32-bit, come le istruzioni): contiene tutte quelle strutture circuitali come memorie, registri, ALU e multiplexer utili alla gestione del flusso dei dati durante l'esecuzione di un'istruzione nella CPU;
2. **CONTROL UNIT**: riceve l'istruzione corrente e, di conseguenza, modifica e istruisce il datapath su come eseguire un'istruzione, poiché istruzioni differenti gestiscono flussi di dati differenti (p.e. modifica dei selettori dei multiplexer, segnali di abilitazione in lettura/scrittura dei registri).

### Elementi di stato di una microarchitettura a ciclo singolo

Gli elementi fondamentali di una microarchitettura sono:

1. **PROGRAM COUNTER**: sebbene faccia logicamente parte dei 16 registri interni al register file, il program counter è implementato come un registro a 32-bit a parte. Il suo output PC indica l'indirizzo in memoria dell'istruzione che si deve eseguire (istruzione corrente), invece, il suo input PC' indica l'indirizzo dell'istruzione successiva. Quindi, durante il fronte di salita del clock l'indirizzo dell'istruzione corrente si aggiorna, diventando quello che era l'indirizzo successivo.
2. **REGISTER FILE**: contiene i 16 registri a 32-bit indicati con R0, R1, ..., R15 di cui dispone una microarchitettura ARM. Dal punto di vista logico e fisico, tutti questi registri non hanno alcuna differenza, però, a livello di programmazione assembly svolgono funzioni differenti. In particolare, R13 è detto STACK POINTER, R14 è detto LINK REGISTER (entrambi utili per la gestione delle chiamate a funzione) e R15 è direttamente collegato al PROGRAM COUNTER.

![Diagram of a Program Counter (PC) flip-flop. It is a rectangular block with a clock input (CLK) at the top. On the left, there is an input labeled PC' with a...](images/p076_fig01.png)

![Diagram of a Register File. It is a rectangular block with a clock input (CLK) at the top. On the left, there are four address inputs labeled A1, A2, A3, and...](images/p076_fig02.png)

CAP. SUCC.

---

<!-- Pagina 77 -->

Per quanto riguarda gli input e gli output ci sono:

<table border="1"><thead><tr><th>Input</th><th>Output</th></tr></thead><tbody><tr><td><ul><li>- L'input <b>CLK</b> sincronizza l'intero file register con il clock di sistema;</li><li>- <b>A1, A2 e A3</b> sono ingressi a 4 bit che rappresentano gli indirizzi di registro, quindi indicano a quali registri si riferisce l'istruzione (utilizzano 4 bit proprio perché si devono indirizzare 16 registri diversi). In particolare, <b>A1 e A2</b> rappresentano due indirizzi del file register, utilizzati per memorizzare gli operandi di un'istruzione. Invece, <b>A3</b> rappresenta l'indirizzo del registro nel file register sul quale andare a scrivere il risultato di un'istruzione;</li><li>- <b>WD3</b> (Written Data) porta in ingresso al file register il contenuto da scrivere nel registro identificato dall'indirizzo nell'ingresso A3;</li><li>- <b>WE3</b> (Write Enable) è un abilitatore alla scrittura, ovvero se è uguale a 1 consente di sovrascrivere i valori contenuti nel registro indicato da A3 con i valori in ingresso a WD3, altrimenti la scrittura nel file register non è abilitata.</li></ul></td><td><ul><li>- <b>RD1 e RD2</b> (Read Data) riportano in uscita il contenuto del registro evidenziato dall'indirizzo nell'ingresso A1 e A2, rispettivamente.</li></ul></td></tr></tbody></table>

3. **STATUS REGISTER**: è un registro di 4 bit che memorizza i flag N, Z, C, V forniti dall'ALU. Questo registro viene principalmente utilizzato per l'esecuzione di istruzioni condizionate. Nelle implementazioni moderne, per regolarità, questo registro è inglobato in un registro a 32 bit che memorizza anche altri tipi di flag gestiti dal OS per gestire p.e. gli interrupt e il multitasking.

![Diagram of a Status Register. It is a vertical rectangle with a small inverted triangle at the top. On the left and right sides, there are two lines each, wi...](images/p077_fig01.png)

4. **INSTRUCTION MEMORY**: è quella parte di memoria centrale adibita alla memorizzazione delle istruzioni. Ha un input a 32-bit che corrisponde all'indirizzo in cui è memorizzata l'istruzione corrente di cui fare il fetch, quindi quest'ingresso è direttamente collegato all'output del program counter. L'output, invece, ritorna proprio l'istruzione a 32-bit memorizzata nell'indirizzo dato in ingresso.

![Diagram of an Instruction Memory block. It is a rectangle with 'Instruction Memory' written inside. On the left side, there is an input labeled 'A' with a sl...](images/p077_fig02.png)

5. **DATA MEMORY**: è quella parte di memoria centrale adibita alla memorizzazione dei dati. Ovviamente, si può accedere a questi dati sia in lettura sia in scrittura, rispettivamente attraverso delle operazioni di load o di store. Gli input del data memory sono:

- 'A' porta in ingresso un indirizzo a 32-bit che indica l'indirizzo in memoria in cui andare a leggere/scrivere il dato;
- In un'operazione di lettura l'ingresso **WE** (Write Enable) è 0, quindi la scrittura non è permessa. Invece, se l'ingresso **WE** è 1, allora si sta eseguendo un'operazione di scrittura e, ovviamente, la scrittura in memoria è permessa;
- L'input **WD** (Written Data) porta in ingresso al data memory il contenuto da scrivere nella locazione di memoria identificata dall'indirizzo indicato dall'input A (solo quando WE=1).

![Diagram of a Data Memory block. It is a rectangle with 'Data Memory' written inside. On the left side, there is an input labeled 'A' with a slash and '32' be...](images/p077_fig03.png)

L'unico output del data memory è l'output **RD** (Read Data) che restituisce in uscita il contenuto del registro all'indirizzo dato in ingresso al data memory (solo quando WE=0). Le operazioni di lettura/scrittura nel data memory avvengono solo durante il fronte di salita del clock.

---

<!-- Pagina 78 -->

Per facilitare la comprensione del datapath e del funzionamento della Control Unit di un microprocessore, studieremo solo un insieme limitato di istruzioni:

- Data-processing: ADD, SUB, AND e ORR (sono con registri e immediates, senza shifts);
- Istruzioni di memoria come LDR e STR (con positive immediate offset);
- Istruzioni di salto B (cioè il Branch).

### Gestione degli indirizzi di memoria

In memoria, la più piccola unità memorizzabile è un byte, costituito da 8 bit. Poiché nella microarchitettura che stiamo studiando i registri sono fatti da 32-bit, il contenuto di un'istruzione è costituito da 4 byte, ovvero proprio 32 bit. Quindi, l'incremento da un indirizzo all'altro (p.e. nel program counter) avviene di 4 byte in 4 byte, proprio perché ogni parola è costituita da 4 byte. (p.e. gli indirizzi si scrivono in hex: 00000000 → 00000004 → 00000008 → 0000000C → ...).

### Istruzione MOV

L'istruzione MOV serve a impostare il valore di un certo registro con un certo valore (equivale all'inizializzazione di una variabile in un linguaggio di alto livello).

### Istruzione di memoria: LOAD

L'istruzione di LOAD permette di leggere un certo dato in memoria e lo memorizza in un certo registro. Il codice mnemonico nel linguaggio ARM Assembly è LDR (sta per Load Register). Per esaminare il funzionamento di un'operazione di LOAD, facciamo un esempio:

```
MOV R2, #0
LDR R3, [R2, #8]
```

Per il principio della regolarità, quest'operazione utilizza sempre e solo due argomenti:

- Il primo argomento R3 (con indirizzo 0011 nel file register) indica il registro nel quale memorizzare il dato che si va a leggere in memoria;
- Il secondo argomento [R2, #8], composto da un registro e una costante, indica l'indirizzo del dato in memoria che si deve andare a leggere. Questo indirizzo è dato dalla somma del contenuto nel registro R2 con l'offset #8 (costante rappresentata in decimale).

Il risultato dell'operazione è il caricamento nel registro R3 del dato memorizzato all'indirizzo (R2+8 = 0+8 = 8).

Dopo il LOAD → R3 = 0x01EE2842

Esistono anche altri formati per l'esecuzione di LDR, p.e.:

- LDR R0, [R1, R2]. Il secondo argomento è composto da due registri. Quindi, si devono recuperare le parole contenute nei registri R1 e R2, sommarle per poi capire l'indirizzo del dato da leggere e memorizzare in R0;
- LDR R0, [R1, R2, LSL #2]. In questo caso, il secondo argomento è composto da due registri, R1 e R2: al contenuto del registro R2 deve essere applicato un Logical Shift Left di 2. Quindi, l'indirizzo del dato da leggere e memorizzare in R0 è dato dalla somma del contenuto di R1 con il contenuto del registro R2 moltiplicato per  $2^2=4$ .

<table border="1"><thead><tr><th>Word address</th><th>Data</th><th>Word number</th></tr></thead><tbody><tr><td>00000010</td><td>C D 1 9 A 6 5 B</td><td>Word 4</td></tr><tr><td>0000000C</td><td>4 0 F 3 0 7 8 8</td><td>Word 3</td></tr><tr><td>00000008</td><td>0 1 E E 2 8 4 2</td><td>Word 2</td></tr><tr><td>00000004</td><td>F 2 F 1 A C 0 7</td><td>Word 1</td></tr><tr><td>00000000</td><td>A B C D E F 7 8</td><td>Word 0</td></tr></tbody></table>

Width = 4 bytes

---

<!-- Pagina 79 -->

### **Istruzione di memoria: STORE**

L'istruzione di STORE permette di scrivere un certo dato in memoria. Il codice mnemonico nel linguaggio ARM Assembly è STR (che sta per STore Register). Per il principio di regolarità, il formato dell'istruzione STR è uguale a quello dell'istruzione LDR. L'unica differenza è il diverso utilizzo degli argomenti: mentre nell'istruzione LDR il primo argomento funge da registro destinazione (dove viene caricato il dato letto in memoria), nell'istruzione STR il primo argomento è il registro sorgente (dove prendere il dato da scrivere in memoria). Per esaminare il funzionamento di un'operazione di STORE, facciamo un esempio:

Memorizza il valore di R7 nella parola di memoria 21.

```
MOV R5, #0
STR R7, [R5, #0x54]
```

Analogamente all'istruzione LDR, anche quest'operazione utilizza sempre e solo due argomenti, di cui il secondo può essere scritto tramite notazioni diverse (p.e. un registro e una costante, due registri, due registri, di cui il secondo con operazione di shift):

- Il primo argomento R7 (con indirizzo 0111 nel file register) indica il registro dove recuperare il dato che si va a scrivere in memoria all'indirizzo indicato dal secondo argomento;
- Il secondo argomento [R5, #0x54], composto da un registro e una costante, indica l'indirizzo di memoria dove scrivere il dato contenuto in R7. Questo indirizzo è dato dalla somma dell'indirizzo contenuto in R5 con l'offset #0x54 (costante rappresentata in esadecimale). La parola di memoria 21 ha come indirizzo  $4 * 21 = 84_{10} = 0x54_{16}$  (ogni parola è composta da 4 byte, per questo si moltiplica per 4). La somma tra l'indirizzo contenuto in R5 (cioè #0) e la costante #0x54 è proprio #0x54, quindi il dato contenuto in R7 sarà scritto in memoria all'indirizzo 0x54 (WORD 21).

Esistono anche altri formati per l'istruzione LDR, p.e.:

- STR R1, [R0, R2]. Il secondo argomento è composto da due registri. Quindi, si devono recuperare gli indirizzi contenuti in R0 e R2, sommarli per poi capire l'indirizzo di memoria nel quale scrivere il dato memorizzato in R1;
- STR R0, [R1, R2, LSL #1]. In questo caso, il secondo argomento è composto da due registri, R1 e R2: al contenuto del registro R2 deve essere applicato un Logical Shift Left di 1. Quindi, l'indirizzo in cui scrivere il dato memorizzato in R0 è dato dalla somma dell'indirizzo contenuto in R1 con l'indirizzo contenuto in R2 moltiplicato per  $2^1 = 2$ .

---

<!-- Pagina 80 -->

### Istruzioni di memoria: LDRB e STRB

Esistono alcune varianti delle istruzione LDR e STR che sono LDRB e STRB. Poiché la più piccola unità memorizzabile è un byte (ci sono anche alcuni tipi di dato costituiti solo da 8 bit p.e. "char"), allora tramite l'istruzione LDRB è possibile effettuare il caricamento in un registro di un singolo byte di memoria e, analogamente, con l'istruzione STRB è possibile memorizzare un byte contenuto in un registro nella memoria.

Abbiamo già visto che gli indirizzi hanno un intervallo di 4 byte perché le parole binarie conservate in memoria sono di 32 bit. All'interno di una singola parola, però, i singoli byte possono essere indirizzati in due modi diversi:

1. **BIG-ENDIAN** (IBM PowerPC): la numerazione dei byte inizia dal byte meno significativo. In una parola di 32 bit, il byte più significativo è indirizzato con 0, mentre quello meno significativo è indirizzato con 3;
2. **LITTLE-ENDIAN** (Intel x86): la numerazione dei byte inizia dal byte più significativo. Questa è una rappresentazione abbastanza naturale poiché il byte meno significativo (LSB) si trova sulla destra, e spostandosi verso sinistra si arriva al byte più significativo (MSB).

La microarchitettura ARM è neutrale rispetto alla scelta della tipologia di indirizzamento dei singoli byte in una parola, in quanto dipende da chi implementa la microarchitettura (ovviamente, un set di istruzioni che funziona con una macchina big-endian restituisce un risultato diverso se lavora su una little-endian).

Esempio di istruzione LDRB (supponiamo che R2 vale 0 (0x00000000)) – lo stesso vale per STRB

**LDRB R7, [R2, #9]**

Quest'istruzione legge il byte all'indirizzo di memoria ( $R2 + 9 = 0 + 9 = 9$ ) e lo memorizza in R7.

<table border="1"><thead><tr><th colspan="5">Big-Endian</th><th colspan="5">Little-Endian</th></tr></thead><tbody><tr><td>Byte Address</td><td>8</td><td>9</td><td>A</td><td>B</td><td>Word Address</td><td></td><td></td><td></td><td></td></tr><tr><td>Data Value</td><td>23</td><td>45</td><td>67</td><td>89</td><td>0</td><td></td><td></td><td></td><td></td></tr><tr><td></td><td>MSB</td><td></td><td></td><td>LSB</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td colspan="5">Risultato: all'indirizzo 9 della word 0 si trova il dato 0x00000045. Dato che il registro R7 memorizza 32 cifre binarie, il dato corrisponde in binario a 0000 0000 0000 0000 0000 0000 0010 0101.</td><td colspan="5">Risultato: all'indirizzo 9 della word 0 si trova il dato 0x00000067. Dato che il registro R7 memorizza 32 cifre binarie, il dato corrisponde in binario a 0000 0000 0000 0000 0000 0000 0110 0111.</td></tr></tbody></table>

### Codifica in linguaggio macchina delle istruzioni ARM Assembly

Effettuiamo il passaggio dall'ARM Assembly, che utilizza mnemonici human-readable, al linguaggio macchina, che è un linguaggio computer-readable. Ogni istruzione nell'architettura ARM viene codificata con una parola di 32 bit nelle quali sono presenti tutte le informazioni per capire quali sono gli operandi, che tipo di istruzione si sta eseguendo, e così via.

Come già detto, l'architettura ARM suddivide le istruzioni assembly in tre macrocategorie: data-processing, memory e branching. Queste tre categorie di istruzioni hanno formati diversi ma molto simili. In particolare, istruzioni appartenenti alla stessa categoria hanno lo stesso identico formato.

---

<!-- Pagina 81 -->

## Codifica delle istruzioni di memoria

![Diagram of ARM instruction format for memory operations. The instruction is divided into several fields: COND (31-28), OP (27-26), FUNCT (25-20), Rn (19-16),...](images/p081_fig01.png)

- **COND 31-28:** sono quattro bit che descrivono una condizione e sono utilizzati al fine di gestire il flusso di dati di un programma (p.e. if-else);
- **OP 27-26:** sono due bit che definiscono il codice dell'operazione, cioè definisce a quale macrocategoria di istruzioni appartiene questa parola binaria. A seconda di questi due bit, i seguenti bit saranno interpretati in maniera differente. Il codice affinché questa parola sia interpretata come un'istruzione di memoria è 012;

ARM fornisce tre tipi di indicizzazione:

- **OFFSET:** con questo tipo di indicizzazione, l'indirizzo di memoria in cui andare a leggere/scrivere un dato è dato dalla somma dei registri (o registro e costante) e il valore contenuto nel base address rimane invariato;
- **PRE-INDEX:** si indica con un '!' finale. Con questo tipo di indicizzazione, si calcola l'indirizzo di memoria in cui andare a leggere/scrivere un dato e lo si salva nel base address (utile p.e. per la lettura di elementi nella colonna di una matrice);
- **POST-INDEX:** si indica sintatticamente includendo solo il base address tra le parentesi quadre. Con questo tipo di indicizzazione, l'indirizzo di memoria in cui andare a leggere/scrivere un dato è contenuto solo nel base address. Dopo, il contenuto del base address viene aggiornato con la somma del suo contenuto con il contenuto di un altro registro o una costante.
- **FUNCT 25-20:** sono sei bit riservati alla descrizione di alcune funzionalità. Ogni bit ha una specifica funzione:

- **I:** questo bit indica se gli ultimi 12 bit della parola, che rappresentano l'offset, corrispondono ad una costante ( $\bar{I} = 0$ ) oppure al contenuto di un registro, eventualmente da shiftare ( $\bar{I} = 1$ );
- **U:** indica se l'offset rappresentato negli ultimi 12 bit deve essere addizionato ( $U=1$ ) o sottratto ( $U=0$ ) al base address;
- **P:** è il bit più significativo nella codifica del tipo di indicizzazione utilizzato;
- **W:** è il bit meno significativo nella codifica del tipo di indicizzazione utilizzato;

<table border="1">
<thead>
<tr>
<th>P</th>
<th>W</th>
<th>Tipo di indicizzazione</th>
</tr>
</thead>
<tbody>
<tr>
<td>0</td>
<td>0</td>
<td>Post-index</td>
</tr>
<tr>
<td>0</td>
<td>1</td>
<td>Non supportato</td>
</tr>
<tr>
<td>1</td>
<td>0</td>
<td>Offset</td>
</tr>
<tr>
<td>1</td>
<td>1</td>
<td>Pre-index</td>
</tr>
</tbody>
</table>

- **L:** codifica il tipo di istruzione di memoria. Se  $L=0$ , allora è un'istruzione di store; se  $L=1$  allora è un'istruzione di load;
- **B:** indica se l'istruzione di memoria è di tipo semplice o di tipo BYTE. Se  $B=0$ , si sta leggendo/scrivendo in memoria un'intera parola; se  $B=1$ , si sta leggendo/scrivendo in memoria un solo BYTE.

<table border="1">
<thead>
<tr>
<th>L</th>
<th>B</th>
<th>Tipo di istruzione</th>
</tr>
</thead>
<tbody>
<tr>
<td>0</td>
<td>0</td>
<td>STR</td>
</tr>
<tr>
<td>0</td>
<td>1</td>
<td>STRB</td>
</tr>
<tr>
<td>1</td>
<td>0</td>
<td>LDR</td>
</tr>
<tr>
<td>1</td>
<td>1</td>
<td>LDRB</td>
</tr>
</tbody>
</table>

---

<!-- Pagina 82 -->

Per il principio della regolarità, le istruzioni di memoria utilizzano sempre due registri, uno come destinazione (nelle operazioni di load) oppure come sorgente (nelle operazioni di store), e l'altro o per calcolare l'indirizzo di memoria dove leggere il dato da salvare nel registro destinazione (load) oppure per calcolare l'indirizzo di memoria dove scrivere il dato contenuto nel registro sorgente (store).

- **RN 19-16**: sono quattro bit utilizzati per identificare l'indirizzo del registro base address nel register file (sarebbe il registro del secondo argomento dell'istruzione in ARM Assembly);
- **RD 15-12**: sono quattro bit utilizzati per identificare l'indirizzo del registro sorgente (store) o destinazione (load) nel register file (sarebbe il 1° argomento dell'istruzione in ARM Assembly);
- **SRC2 11-0**: sono 12 bit utilizzati per rappresentare o un registro, eventualmente shiftato, o una costante (immediate). Distinguiamo, allora, questi due casi:
  - Se  $\bar{I} = 1$ , allora i 12 bit di SRC2 sono a loro volta suddivisi in:
    - **SHAMT5 11-7**: sono cinque bit utilizzati per indicare la quantità di shift da eseguire;
    - **SH 6-5**: sono due bit utilizzati per codificare il tipo di shift da eseguire;

<table border="1">
<thead>
<tr>
<th>SH</th>
<th>Tipo di shift</th>
</tr>
</thead>
<tbody>
<tr>
<td>00</td>
<td>LSL (&lt;&lt;)</td>
</tr>
<tr>
<td>01</td>
<td>LSR (&gt;&gt;)</td>
</tr>
<tr>
<td>10</td>
<td>ASR (&gt;&gt;&gt;)</td>
</tr>
<tr>
<td>11</td>
<td>ROR</td>
</tr>
</tbody>
</table>

- **BIT 4**: è uno 0 fisso;
- **RM 3-0**: questi 4 bit indicano l'indirizzo del registro nel register file il cui contenuto è da shiftare.

2. Se  $\bar{I} = 0$ , allora i 12 bit sono tutti utilizzati per la costante (offset, immediate). Questo significa che è possibile avanzare, a partire dall'indirizzo contenuto nel base address, di  $2^{12}$  bit, che rappresentano  $2^{10}$  parole. Quindi, se è necessario avanzare di un offset maggiore, si è obbligati ad utilizzare un'operazione di shift.

Vediamo degli esempi:

### STR R11, [R5], #-26

- Il campo **COND** è  $1110_2$  perché questa è un'istruzione incondizionata;
- Il campo **OP** è 01 perché questa è un'istruzione di memoria;
- Il campo  $\bar{I} = 0$  perché gli ultimi 12 bit devono essere interpretati come una costante;
- I campi **PW=002** perché il tipo di indicizzazione è post-index (parentesi quadre solo sul b.a.);
- Il campo **U=0** perché la costante deve essere sottratta al base address;
- I campi **LB=002** perché l'istruzione di memoria è uno store di un'intera parola binaria.

<table border="1">
<thead>
<tr>
<th colspan="4">COND</th>
<th colspan="4">OP</th>
<th colspan="4">I</th>
<th colspan="4">P</th>
<th colspan="4">U</th>
<th colspan="4">B</th>
<th colspan="4">W</th>
<th colspan="4">L</th>
<th colspan="4">BASE ADDRESS</th>
<th colspan="4">SORGENTE</th>
<th colspan="12">COSTANTE</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td><td>1</td><td>1</td><td>0</td>
<td>0</td><td>1</td>
<td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td>
<td>0</td><td>1</td><td>0</td><td>1</td>
<td>1</td><td>0</td><td>1</td><td>1</td>
<td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>1</td><td>0</td><td>1</td><td>0</td>
</tr>
<tr>
<td>31</td><td>30</td><td>29</td><td>28</td>
<td>27</td><td>26</td>
<td>25</td><td>24</td><td>23</td><td>22</td><td>21</td><td>20</td>
<td>19</td><td>18</td><td>17</td><td>16</td>
<td>15</td><td>14</td><td>13</td><td>12</td>
<td>11</td><td>10</td><td>9</td><td>8</td><td>7</td><td>6</td><td>5</td><td>4</td><td>3</td><td>2</td><td>1</td><td>0</td>
</tr>
</tbody>
</table>

### LDR R3, [R4, R5]

- Il campo **COND** è  $1110_2$  perché questa è un'istruzione incondizionata;
- Il campo **OP** è 01 perché questa è un'istruzione di memoria;
- Il campo  $\bar{I} = 1$  perché gli ultimi 12 bit devono essere interpretati come un registro;
- I campi **PW=102** perché il tipo di indicizzazione è offset;
- Il campo **U=1** perché il contenuto del registro deve essere addizionato al base address;
- I campi **LB=102** perché l'istruzione di memoria è un load di un'intera parola binaria.

<table border="1">
<thead>
<tr>
<th colspan="4">COND</th>
<th colspan="4">OP</th>
<th colspan="4">I</th>
<th colspan="4">P</th>
<th colspan="4">U</th>
<th colspan="4">B</th>
<th colspan="4">W</th>
<th colspan="4">L</th>
<th colspan="4">BASE ADDRESS</th>
<th colspan="4">DESTINAZIONE</th>
<th colspan="4">SHAMT</th>
<th colspan="4">SH</th>
<th colspan="4">REGISTRO</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td><td>1</td><td>1</td><td>0</td>
<td>0</td><td>1</td>
<td>1</td><td>1</td><td>1</td><td>0</td><td>0</td><td>1</td>
<td>0</td><td>1</td><td>0</td><td>0</td>
<td>0</td><td>0</td><td>1</td><td>1</td>
<td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td><td>0</td><td>1</td>
</tr>
<tr>
<td>31</td><td>30</td><td>29</td><td>28</td>
<td>27</td><td>26</td>
<td>25</td><td>24</td><td>23</td><td>22</td><td>21</td><td>20</td>
<td>19</td><td>18</td><td>17</td><td>16</td>
<td>15</td><td>14</td><td>13</td><td>12</td>
<td>11</td><td>10</td><td>9</td><td>8</td><td>7</td><td>6</td><td>5</td><td>4</td>
<td>3</td><td>2</td><td>1</td><td>0</td>
</tr>
</tbody>
</table>

---

<!-- Pagina 83 -->

## STR R9, [R1, R3, LSL #2]

- Il campo COND è 11102 perché questa è un'istruzione incondizionata;
- Il campo OP è 01 perché questa è un'istruzione di memoria;
- Il campo  $\bar{I} = 1$  perché gli ultimi 12 bit devono essere interpretati come un registro;
- I campi  $PW = 10_2$  perché il tipo di indicizzazione è offset;
- Il campo  $U = 1$  perché il contenuto del registro deve essere addizionato al base address;
- I campi  $LB = 00_2$  perché l'istruzione di memoria è uno store di un'intera parola binaria.

<table border="1">
<thead>
<tr>
<th colspan="4">COND</th>
<th colspan="2">OP</th>
<th colspan="2">I</th>
<th colspan="2">P</th>
<th colspan="2">U</th>
<th colspan="2">B</th>
<th colspan="2">W</th>
<th colspan="2">L</th>
<th colspan="4">BASE ADDRESS</th>
<th colspan="4">SORGENTE</th>
<th colspan="4">SHAMT</th>
<th colspan="2">SH</th>
<th colspan="4">REGISTRO</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td><td>1</td><td>1</td><td>0</td>
<td>0</td><td>1</td>
<td>1</td><td>1</td>
<td>1</td><td>0</td>
<td>0</td><td>0</td>
<td>0</td><td>0</td>
<td>0</td><td>0</td>
<td>0</td><td>0</td>
<td>0</td><td>0</td>
<td>0</td><td>1</td>
<td>0</td><td>0</td>
<td>0</td><td>1</td>
<td>0</td><td>0</td>
<td>0</td><td>0</td>
<td>0</td><td>1</td>
<td>1</td>
</tr>
<tr>
<td>31</td><td>30</td><td>29</td><td>28</td>
<td>27</td><td>26</td>
<td>25</td><td>24</td>
<td>23</td><td>22</td>
<td>21</td><td>20</td>
<td>19</td><td>18</td>
<td>17</td><td>16</td>
<td>15</td><td>14</td>
<td>13</td><td>12</td>
<td>11</td><td>10</td>
<td>9</td><td>8</td>
<td>7</td><td>6</td>
<td>5</td><td>4</td>
<td>3</td><td>2</td>
<td>1</td><td>0</td>
</tr>
</tbody>
</table>

### Datapath delle istruzioni di memoria

Dopo aver visto come si codifica un'istruzione di memoria dell'ARM Assembly in linguaggio macchina, il prossimo passo è quello di studiare il datapath di un'istruzione di memoria. Non andremo a studiarle tutte, ma solo uno specifico set, tra cui:

- **LDR Rd, [Rn, imm12]**: caricamento di un'intera parola della memoria, identificata dall'indirizzo  $(Rn+imm12)$  tramite indirizzamento offset, in un registro destinazione Rd;
- **STR Rd, [Rn, imm12]**: operazione di scrittura di un'intera parola contenuta nel registro sorgente Rd all'indirizzo di memoria  $(Rn+imm12)$ ;

Datapath LDR Rd, [Rn, imm12]

![Detailed datapath diagram for LDR Rd, (Rn, imm12). It shows the Program Counter (PC) with a 2-to-1 multiplexer (PCSrc) selecting between the current PC and P...](images/p083_fig01.png)

1. Si parte dal program counter che al fronte di salita del clock (in una microarchitettura a ciclo singolo, l'esecuzione di un'intera istruzione deve durare meno di un ciclo di clock) manda in output l'indirizzo a 32 bit della prossima istruzione da eseguire;
2. Questo indirizzo entra nell'input A dell'Instruction Memory. La memoria recupera a quell'indirizzo l'istruzione codificata in linguaggio macchina e, dopo, la riporta in output nell'output RD. A questo punto l'istruzione è rappresentata nel datapath dall'etichetta Instr;
3. I bit Instr19:16 rappresentano l'indirizzo del registro che contiene il base address. Questi bit sono collegati all'input A1 del register file. Il contenuto del registro identificato dall'indirizzo dato in input viene riportato nell'output RD1;
4. I bit Instr11:0 rappresentano l'offset, definito come una costante (immediate) rappresentata da 12 bit. Per poterlo addizionare al base address che è costituito da 32 bit, è necessario estendere questi 12 bit fino ad avere una parola binaria di 32 bit (si aggiungono 0 non significativi). Per farlo, occorre immettere in input questi 12 bit in "Extend" che restituisce poi ExtImm (ExtImm31:12=0 e ExtImm11:0=Instr11:0);
5. Per ottenere l'indirizzo di memoria in cui leggere il dato da salvare nel registro, occorre sommare/sottrarre (in base al bit U) l'offset ExtImm al base address RD1, immettendoli come

---

<!-- Pagina 84 -->

input dell'ALU, rispettivamente in  $SrcB$  e  $SrcA$  (se  $U=1$ , allora  $ALUControl = 00$  per effettuare la somma, altrimenti  $ALUControl = 01$  per effettuare una differenza);

1. L'output che restituisce l'ALU è l'indirizzo che identifica il dato da leggere nella memoria, quindi, per effettuare questa lettura, l'output è in ingresso al Data Memory all'input A (address);
2. Questa operazione di lettura restituisce come output il valore che in memoria corrisponde all'indirizzo passato nell'input A;
3. Infine, l'output del Data Memory deve essere scritto nel registro destinazione  $Rd$ , identificato dai bit  $Instr_{15:12}$  che rappresentano proprio il suo indirizzo nel register file (dati in input al register file all'ingresso A3). Per completare quest'operazione di scrittura, l'output RD del Data Memory viene dato in input all'ingresso  $WD3$  del register file, che aggiorerà il valore del registro  $Rd$  al prossimo fronte di salita del clock (fine del ciclo) se e solo se il flag  $RegWrite$  è uguale a 1 (abilitazione alla scrittura nel file register);
4. In seguito, il program counter deve passare all'istruzione successiva, che ha come indirizzo nell'Instruction Memory la somma tra l'indirizzo corrente e 4 (in modo tale da passare alla parola di 32 bit successiva). Il risultato di questa somma, cioè l'indirizzo dell'istruzione successiva, va nell'input PC' del program counter e diventerà la prossima istruzione corrente solo al prossimo fronte di salita del clock (fine del ciclo attuale);

Il contenuto del registro  $R15$  del register file è il valore dello stato corrente del program counter sommato a 8. Non appena si aggiorna il clock conterrà l'indirizzo dell'istruzione successiva a quella corrente. Ad esempio, supponiamo che  $PC'$  è un certo valore  $X \rightarrow PC$  è  $X - 4 \rightarrow PC + 4$  è  $X$ , cioè  $PC' \rightarrow PC + 8$  è  $X + 4$ , che sarà memorizzato in  $R15$  solo al prossimo ciclo di clock, cioè quando si deve eseguire l'istruzione all'indirizzo  $X$  (quello che era  $PC'$ , quindi  $R15$  contiene l'istruzione prossima).

Inoltre, dato che la microarchitettura ARM è uno Stored Program Paradigm, potrebbe succedere che la prossima istruzione letta è proprio il dato identificato dall'indirizzo nel Data Memory calcolato a partire dal base address e l'offset (rappresenta un valore che può assumere il PC). In questo caso, si è nella situazione in cui il registro puntato dall'indirizzo nell'ingresso A3 e il registro  $R15$  del register file hanno lo stesso contenuto. Quindi, proprio per questo motivo, c'è anche la possibilità che questo valore sia riportato direttamente nell'ingresso del program counter (prima dell'input c'è un multiplexer con selettore il flag  $PCSrc$ ).

Datapath STR Rd,  $[Rn, imm12]$

![Circuit diagram of the ARM datapath for the STR Rd instruction. It shows the Instruction Memory, Register File, ALU, and Data Memory. The Program Counter (PC...](images/p084_fig01.png)

I primi 5 punti sono uguali all'analisi del datapath dell'istruzione LDR Rd,  $[Rn, imm12]$ .

1. L'output che restituisce l'ALU è l'indirizzo di memoria in cui si andrà a scrivere il contenuto del registro sorgente  $Rd$ . Quindi, per effettuare questa scrittura, l'output è in ingresso al Data Memory all'input A (address);
2. Come detto prima, all'indirizzo di memoria indicato nell'input A si deve andare a scrivere il contenuto del registro sorgente  $Rd$ . Per far ciò, occorre collegare i bit  $Instr_{15:12}$  ad  $A2$ , in modo che il register file restituisca nell'output  $RD2$  il contenuto del registro indicato dall'indirizzo in

---

<!-- Pagina 85 -->

input. Questo contenuto è, quindi, direttamente collegato all'input WD del Data Memory. Ovvivamente, il valore del flag MemWrite, che abilita la scrittura in memoria, deve essere 1;

8. Poiché il registro Rd è il registro sorgente e non la destinazione, questo significa che non si deve andare a scrivere niente nel register file e, quindi, il flag RegWrite deve essere 0.

Come si nota dalle immagini, i datapath di queste due istruzioni non sono separati ma devono coesistere insieme contemporaneamente. Quindi, comunque il Data Memory restituisce nell'output ReadData il contenuto della memoria all'indirizzo indicato nell'input, però, dato che in questo caso si sta eseguendo un'operazione STR e il flag RegWrite = 0, il registro identificato dall'indirizzo nell'ingresso A3 (cioè i bit Instr15:12) non sarà sovrascritto con questi valori.

### Istruzioni di data-processing

<table border="1">
<thead>
<tr>
<th>Mnemonic</th>
<th>Descrizione</th>
<th>Argomenti</th>
<th>Effetto</th>
</tr>
</thead>
<tbody>
<tr>
<td>(assegnazione)<br/>MOV</td>
<td>Muove un valore di 32 bit</td>
<td>MOV Rd, n</td>
<td>Rd = n</td>
</tr>
<tr>
<td>MVN</td>
<td>Muove un valore di 32 bit complementato bit a bit</td>
<td>MVN Rd, n</td>
<td>Rd = ~n</td>
</tr>
<tr>
<td>(operazioni aritmetiche)<br/>ADD</td>
<td>Esegue la somma di due operandi</td>
<td>ADD Rd, Rn, n</td>
<td>Rd = Rn + n</td>
</tr>
<tr>
<td>ADC</td>
<td>Somma 2 operandi e somma anche il riporto memorizzato nello status register</td>
<td>ADC Rd, Rn, n</td>
<td>Rd = Rn + n + C</td>
</tr>
<tr>
<td>SUB</td>
<td>Esegue la differenza tra due operandi</td>
<td>SUB Rd, Rn, n</td>
<td>Rd = Rn - n</td>
</tr>
<tr>
<td>SBC</td>
<td>Esegue la differenza tra due operandi e poi somma il riporto - 1</td>
<td>SBC Rd, Rn, n</td>
<td>Rd = Rn - n + C - 1</td>
</tr>
<tr>
<td>RSB</td>
<td>Esegue la differenza tra i due operandi invertiti di posto</td>
<td>RSB Rd, Rn, n</td>
<td>Rd = n - Rn</td>
</tr>
<tr>
<td>RSC</td>
<td>Esegue la differenza tra i due operandi invertiti di posto e poi somma il riporto - 1</td>
<td>RSC Rd, Rn, n</td>
<td>Rd = n - Rn + C - 1</td>
</tr>
<tr>
<td>(operazioni logiche)<br/>AND</td>
<td>Esegue l'AND tra due valori di 32 bit</td>
<td>AND Rd, Rn, n</td>
<td>Rd = Rn AND n</td>
</tr>
<tr>
<td>ORR</td>
<td>Esegue l'OR tra due valori di 32 bit</td>
<td>ORR Rd, Rn, n</td>
<td>Rd = Rn OR n</td>
</tr>
<tr>
<td>EOR</td>
<td>Esegue lo XOR tra due valori di 32 bit</td>
<td>EOR Rd, Rn, n</td>
<td>Rd = Rn XOR n</td>
</tr>
<tr>
<td>BIC</td>
<td>Utile per mascherare dei bit (uguali a 0), effettuando l'AND tra il primo operando e il secondo operando negato bit a bit</td>
<td>BIC Rd, Rn, n</td>
<td>Rd = Rn AND (NOT n)</td>
</tr>
<tr>
<td>(operazioni di comparazione)<br/>CMP</td>
<td>Effettua la sottrazione tra il primo e il secondo operando, dopodiché aggiorna i valori dei flags nello status register con i valori ALUFlags uscenti dall'ALU</td>
<td>CMP Rd, n</td>
<td>Rd - n</td>
</tr>
<tr>
<td>CMN</td>
<td>Effettua la somma tra il primo e il secondo operando, dopodiché aggiorna i valori dei flags nello status register con i valori ALUFlags uscenti dall'ALU</td>
<td>CMN Rd, n</td>
<td>Rd + n</td>
</tr>
<tr>
<td>TST</td>
<td>Esegue l'AND bit a bit tra il primo e il secondo operando, dopodiché aggiorna i valori dei flags nello status register con i valori ALUFlags uscenti dall'ALU</td>
<td>TST Rd, n</td>
<td>Rd AND n</td>
</tr>
<tr>
<td>TEQ</td>
<td>Esegue lo XOR bit a bit tra il primo e il secondo operando, dopodiché aggiorna i valori dei flags nello status register con i valori ALUFlags uscenti dall'ALU</td>
<td>TEQ Rd, n</td>
<td>Rd XOR n</td>
</tr>
<tr>
<td>(operazioni di moltiplicazione)<br/>MUL</td>
<td>Esegue la moltiplicazione tra due operandi di 32 bit e restituisce un risultato a 32 bit</td>
<td>MUL Rd, Rm, Rs</td>
<td>Rd = Rm * Rs<br/>(risultato a 32 bit)</td>
</tr>
<tr>
<td>MLA</td>
<td>Esegue la moltiplicazione tra i primi due operandi, dopodiché somma al risultato il terzo operando</td>
<td>MLA Rd, Rm, Rs, Rn</td>
<td>Rd = (Rm * Rs) + Rn</td>
</tr>
<tr>
<td>UMULL</td>
<td>Esegue una moltiplicazione senza segno tra due operandi di 32 bit e restituisce un risultato a 64 bit, quindi sono necessari due registri per conservare il risultato</td>
<td>UMULL Rd, Rm, Rs, Rn</td>
<td>{Rd, Rn} = Rm * Rs<br/>(senza segno)</td>
</tr>
<tr>
<td>SMULL</td>
<td>Esegue una moltiplicazione con segno tra due operandi di 32 bit e restituisce un risultato a 64 bit, quindi sono necessari due registri per conservare il risultato</td>
<td>SMULL Rd, Rm, Rs, Rn</td>
<td>{Rd, Rn} = Rm * Rs<br/>(con segno)</td>
</tr>
</tbody>
</table>

---

<!-- Pagina 86 -->

### Istruzioni logiche: esempi

<table border="1">
<tr>
<td></td>
<td>R1 0100 0110 1010 0001 1111 0001 1011 0111</td>
<td></td>
</tr>
<tr>
<td></td>
<td>R2 1111 1111 1111 1111 0000 0000 0000 0000</td>
<td></td>
</tr>
<tr>
<td>AND R3, R1, R2</td>
<td>R3 0100 0110 1010 0001 0000 0000 0000 0000</td>
<td>(dove nel secondo operando ci sono 1, porta nel risultato i valori del primo operando, altrimenti 0)</td>
</tr>
<tr>
<td>ORR R4, R1, R2</td>
<td>R4 1111 1111 1111 1111 1111 0001 1011 0111</td>
<td></td>
</tr>
<tr>
<td>EOR R5, R1, R2</td>
<td>R5 1011 1001 0101 1110 1111 0001 1011 0111</td>
<td></td>
</tr>
<tr>
<td>BIC R6, R1, R2</td>
<td>R6 0000 0000 0000 0000 1111 0001 1011 0111</td>
<td>(dove nel secondo operando ci sono 0, porta nel risultato i valori del primo operando, altrimenti 0)</td>
</tr>
<tr>
<td>MVN R7, R2</td>
<td>R7 0000 0000 0000 0000 1111 1111 1111 1111</td>
<td></td>
</tr>
</table>

Come si può notare da questa tabella, le istruzioni **AND** e **BIC** operano in maniera speculare, e sono entrambe utili per mascherare dei bit. Ad esempio, se si vuole mascherare tutti i byte eccetto quello meno significativo:

- AND 0xF234012F, 0x0000002F = 0x0000002F
- BIC 0xF234012F, 0xFFFFF00 = 0x0000002F

L'istruzione **ORR**, invece, è utile per combinare i campi di bit. Ad esempio, se si vuole combinare 0xF2340000 e 0x000012BC:

- ORR 0xF2340000, 0x000012BC = 0xF23412BC

### Istruzioni di shifting: esempi

In ARM Assembly le operazioni di shifting utilizzano i seguenti mnemonici:

- **LSL Rd, Rn, n:** per memorizzare in Rd il Logical Shift Left di n posizioni del registro Rn (equivalente alla moltiplicazione per  $2^n$ );
- **LSR Rd, Rn, n:** per memorizzare in Rd il Logical Shift Right di n posizioni del registro Rn;
- **ASR Rd, Rn, n:** per memorizzare in Rd l'Arithmetic Shift Right di n posizioni del registro Rn (equivalente alla divisione per  $2^n$ );
- **ROR Rd, Rn, n:** per memorizzare in Rd la rotazione di n bit a destra del registro Rn (una rotazione a sinistra di n bit corrisponde ad una rotazione a destra di  $(32 - n)$  bit);

<table border="1">
<tr>
<td></td>
<td>R8 0000 1000 0001 1100 0001 0110 1110 0111</td>
</tr>
<tr>
<td></td>
<td>R6 0000 0000 0000 0000 0000 0000 0001 0100</td>
</tr>
<tr>
<td>LSL R4, R8, R6 (si prende il contenuto di R6)</td>
<td>R4 0110 1110 0111 0000 0000 0000 0000 0000</td>
</tr>
<tr>
<td>ROR R5, R8, R6 (si prende il contenuto di R6)</td>
<td>R5 1100 0001 0110 1110 0111 0000 1000 0001</td>
</tr>
<tr>
<td>ASR R2, R5, #3</td>
<td>R8 0000 0001 0000 0011 1000 0010 1101 1100</td>
</tr>
</table>

### Codifica delle istruzioni di data-processing

![Diagram showing the instruction format for data-processing instructions. The instruction is divided into three main parts: Data-processing, Immediate, and Re...](images/p086_fig01.png)

---

<!-- Pagina 87 -->

- **COND 31-28**: sono quattro bit che descrivono una condizione e sono utilizzati al fine di gestire il flusso di dati di un programma (p.e. if-else);
- **OP 27-26**: sono due bit che definiscono il **codice dell'operazione**, cioè definisce a quale macrocategoria di istruzioni appartiene questa parola binaria. A seconda di questi due bit, i seguenti bit saranno interpretati in maniera differente. Il codice affinché questa parola sia interpretata come un'istruzione di **data-processing** è 002;
- **FUNCT 25-20**: sono sei bit riservati alla **descrizione di alcune funzionalità**:
  - **I**: questo bit indica se gli ultimi 12 bit della parola, che rappresentano l'offset, corrispondono ad una **costante (I=1)** oppure al **contenuto di un registro**, eventualmente da **shiftare (I=0)**;
  - **CMD**: indica il **tipo di operazione di data-processing** da eseguire (p.e. ADD → 0100, SUB → 0010, AND → 0000, ORR → 1100, EOR → 0001);
  - **S**: ogni operazione di data-processing prevede l'utilizzo dell'ALU, che sicuramente darà in output i valori degli ALUFlags. Se **S=0**, i valori degli ALUFlags **non saranno memorizzati** nello status register; se **S=1**, i valori degli ALUFlags saranno memorizzati nello status register. Nel linguaggio ARM Assembly, il valore del bit S lo si capisce dalla presenza o meno del suffisso S.
- **RN 19-16**: sono quattro bit utilizzati per **identificare l'indirizzo del registro sorgente**, ovvero il primo operando;
- **RD 15-12**: sono quattro bit utilizzati per **identificare l'indirizzo del registro destinazione**;
- **SRC2 11-0**: sono 12 bit utilizzati per **rappresentare o un registro**, eventualmente shiftato, o una **costante (immediate)**. Distinguiamo, allora, questi **tre casi**:
  - **FORMATO IMMEDIATE (I = 1)**: gli ultimi 12 bit corrispondono ad un immediate. A differenza del formato delle istruzioni di memoria, in questo formato c'è un'ulteriore suddivisione:
    - **imm8 7-0**: rappresentano il **valore assoluto della costante**;
    - **rot 11-8**: rappresenta la **quantità moltiplicata per 2 di bit da ruotare a destra del valore di imm8 all'interno di una parola di 32 bit**.
     Quindi la costante a 32 bit è uguale a: **imm8 ROR (rot * 2)**. Ad esempio, con imm8 = 1000 1111 e rot = 0010, la costante a 32 bit è uguale a: 1111 0000 0000 0000 0000 0000 1000. Sostanzialmente, invece di riuscire a rappresentare come massima costante il numero  $2^{12}-1 = 4095$ , con questo metodo si rinuncia ad una maggior precisione (solo 8 bit impostabili) al fine di avere un range di valori maggiore (sia numeri grandi che piccoli);
  - **FORMATO IMMEDIATE-SHIFTED REGISTER (I = 0)**: in questo formato, si utilizza come secondo operando un registro (eventualmente da shiftare con il valore di una costante):
    - **Shamt5 11-7**: sono cinque bit utilizzati per **indicare la quantità di shift da eseguire**;
    - **Sh 6-5**: sono due bit utilizzati per **codificare il tipo di shift da eseguire (sopra elencati)**;
    - **BIT 4**: è uno **0 fisso**;
    - **Rm 3-0**: questi 4 bit indicano l'indirizzo del registro nel register file il cui contenuto è da shiftare.
- 3. **FORMATO REGISTER-SHIFTED REGISTER (I = 0)**: in questo formato, si utilizza come secondo operando un registro (eventualmente da shiftare con il valore contenuto in un registro):
  - **Rs 11-8**: questi 4 bit indicano l'indirizzo del registro nel register file il cui contenuto è utilizzato per shiftare Rm.;
  - **BIT 7**: è un bit **fisso uguale a 0**;
  - **Sh 6-5**: sono due bit utilizzati per **codificare il tipo di shift da eseguire (sopra elencati)**;
  - **BIT 4**: è un bit **fisso uguale a 1**;
  - **Rm 3-0**: questi 4 bit indicano l'indirizzo del registro nel register file il cui contenuto è da shiftare.

appantiofficirastudenti.com

---

<!-- Pagina 88 -->

Vediamo degli esempi:

### ADD R0, R1, #42

- Il campo COND è  $1110_2$  perché questa è un'istruzione incondizionata;
- Il campo OP è 00 perché questa è un'istruzione di data-processing;
- Il campo I = 1 perché gli ultimi 12 bit corrispondono ad una costante;
- Il campo CMD =  $0100_2$  perché si deve eseguire un'addizione;
- Il campo S = 0 perché non si devono aggiornare i flag nello status register (ADD non ha il suffisso S);

<table border="1">
<thead>
<tr>
<th colspan="4">COND</th>
<th colspan="2">OP</th>
<th>I</th>
<th colspan="4">CMD</th>
<th>S</th>
<th colspan="4">SORGENTE</th>
<th colspan="4">DESTINAZIONE</th>
<th colspan="4">rot</th>
<th colspan="4">imm8</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td><td>1</td><td>1</td><td>0</td>
<td>0</td><td>0</td>
<td>1</td>
<td>0</td><td>1</td><td>0</td><td>0</td>
<td>0</td>
<td>0</td><td>0</td><td>0</td><td>1</td>
<td>0</td><td>0</td><td>0</td><td>0</td>
<td>0</td><td>0</td><td>0</td><td>0</td>
<td>0</td><td>0</td><td>1</td><td>0</td>
<td>1</td><td>0</td><td>1</td><td>0</td>
</tr>
<tr>
<td>31</td><td>30</td><td>29</td><td>28</td>
<td>27</td><td>26</td>
<td>25</td>
<td>24</td><td>23</td><td>22</td><td>21</td>
<td>20</td>
<td>19</td><td>18</td><td>17</td><td>16</td>
<td>15</td><td>14</td><td>13</td><td>12</td>
<td>11</td><td>10</td><td>9</td><td>8</td>
<td>7</td><td>6</td><td>5</td><td>4</td>
<td>3</td><td>2</td><td>1</td><td>0</td>
</tr>
</tbody>
</table>

### SUB R2, R3, #0xFF0

- Il campo COND è  $1110_2$  perché questa è un'istruzione incondizionata;
- Il campo OP è 00 perché questa è un'istruzione di data-processing;
- Il campo I = 1 perché gli ultimi 12 bit corrispondono ad una costante;
- Il campo CMD =  $0010_2$  perché si deve eseguire una sottrazione;
- Il campo S = 0 perché non si devono aggiornare i flag nello status register (SUB non ha il suffisso S);
- #0xFF0 non può essere rappresentato con 8 bit. Quindi, per far ciò occorre ruotare a destra l'immediate di 8 bit  $1111\ 1111$  di 28 posizioni, cioè  $rot=14$  ( $0000\ 0000\ 0000\ 0000\ 0000\ 0000\ 1111\ 1111$  → dopo la rotazione →  $0000\ 0000\ 0000\ 0000\ 0000\ 1111\ 1111\ 0000 = 0x00000FF0$ ).

<table border="1">
<thead>
<tr>
<th colspan="4">COND</th>
<th colspan="2">OP</th>
<th>I</th>
<th colspan="4">CMD</th>
<th>S</th>
<th colspan="4">SORGENTE</th>
<th colspan="4">DESTINAZIONE</th>
<th colspan="4">rot</th>
<th colspan="4">imm8</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td><td>1</td><td>1</td><td>0</td>
<td>0</td><td>0</td>
<td>1</td>
<td>0</td><td>0</td><td>1</td><td>0</td>
<td>0</td>
<td>0</td><td>0</td><td>1</td><td>1</td>
<td>0</td><td>0</td><td>1</td><td>0</td>
<td>1</td><td>1</td><td>1</td><td>0</td>
<td>1</td><td>1</td><td>1</td><td>1</td>
<td>1</td><td>1</td><td>1</td><td>1</td>
</tr>
<tr>
<td>31</td><td>30</td><td>29</td><td>28</td>
<td>27</td><td>26</td>
<td>25</td>
<td>24</td><td>23</td><td>22</td><td>21</td>
<td>20</td>
<td>19</td><td>18</td><td>17</td><td>16</td>
<td>15</td><td>14</td><td>13</td><td>12</td>
<td>11</td><td>10</td><td>9</td><td>8</td>
<td>7</td><td>6</td><td>5</td><td>4</td>
<td>3</td><td>2</td><td>1</td><td>0</td>
</tr>
</tbody>
</table>

### ADD R5, R6, R7

- Il campo COND è  $1110_2$  perché questa è un'istruzione incondizionata;
- Il campo OP è 00 perché questa è un'istruzione di data-processing;
- Il campo I = 0 perché gli ultimi 12 bit corrispondono al formato immediate-shifted register;
- Il campo CMD =  $0100_2$  perché si deve eseguire un'addizione;
- Il campo S = 0 perché non si devono aggiornare i flag nello status register (ADD non ha il suffisso S);

<table border="1">
<thead>
<tr>
<th colspan="4">COND</th>
<th colspan="2">OP</th>
<th>I</th>
<th colspan="4">CMD</th>
<th>S</th>
<th colspan="4">SORGENTE</th>
<th colspan="4">DESTINAZIONE</th>
<th colspan="4">shamt5</th>
<th colspan="2">sh</th>
<th colspan="2">Rm</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td><td>1</td><td>1</td><td>0</td>
<td>0</td><td>0</td>
<td>0</td>
<td>0</td><td>1</td><td>0</td><td>0</td>
<td>0</td>
<td>0</td><td>1</td><td>1</td><td>0</td>
<td>0</td><td>1</td><td>0</td><td>1</td>
<td>0</td><td>0</td><td>0</td><td>0</td>
<td>0</td><td>0</td>
<td>0</td><td>0</td>
<td>1</td><td>1</td>
</tr>
<tr>
<td>31</td><td>30</td><td>29</td><td>28</td>
<td>27</td><td>26</td>
<td>25</td>
<td>24</td><td>23</td><td>22</td><td>21</td>
<td>20</td>
<td>19</td><td>18</td><td>17</td><td>16</td>
<td>15</td><td>14</td><td>13</td><td>12</td>
<td>11</td><td>10</td><td>9</td><td>8</td>
<td>7</td><td>6</td>
<td>5</td><td>4</td>
<td>3</td><td>2</td>
<td>1</td><td>0</td>
</tr>
</tbody>
</table>

### ORR R9, R5, R3, LSR #2

- Il campo COND è  $1110_2$  perché questa è un'istruzione incondizionata;
- Il campo OP è 00 perché questa è un'istruzione di data-processing;
- Il campo I = 0 perché gli ultimi 12 bit corrispondono al formato immediate-shifted register;
- Il campo CMD =  $1100_2$  perché si deve eseguire un OR bit a bit;
- Il campo S = 0 perché non si devono aggiornare i flag nello status register;

<table border="1">
<thead>
<tr>
<th colspan="4">COND</th>
<th colspan="2">OP</th>
<th>I</th>
<th colspan="4">CMD</th>
<th>S</th>
<th colspan="4">SORGENTE</th>
<th colspan="4">DESTINAZIONE</th>
<th colspan="4">shamt5</th>
<th colspan="2">sh</th>
<th colspan="2">Rm</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td><td>1</td><td>1</td><td>0</td>
<td>0</td><td>0</td>
<td>0</td>
<td>1</td><td>1</td><td>0</td><td>0</td>
<td>0</td>
<td>0</td><td>1</td><td>0</td><td>1</td>
<td>1</td><td>0</td><td>0</td><td>1</td>
<td>0</td><td>0</td><td>0</td><td>1</td>
<td>0</td><td>1</td>
<td>0</td><td>0</td>
<td>0</td><td>1</td>
</tr>
<tr>
<td>31</td><td>30</td><td>29</td><td>28</td>
<td>27</td><td>26</td>
<td>25</td>
<td>24</td><td>23</td><td>22</td><td>21</td>
<td>20</td>
<td>19</td><td>18</td><td>17</td><td>16</td>
<td>15</td><td>14</td><td>13</td><td>12</td>
<td>11</td><td>10</td><td>9</td><td>8</td>
<td>7</td><td>6</td>
<td>5</td><td>4</td>
<td>3</td><td>2</td>
<td>1</td><td>0</td>
</tr>
</tbody>
</table>

---

<!-- Pagina 89 -->

## EOR R8, R9, R10, ROR R12

- Il campo COND è  $1110_2$  perché questa è un'istruzione incondizionata;
- Il campo OP è 00 perché questa è un'istruzione di data-processing;
- Il campo I = 0 perché gli ultimi 12 bit corrispondono al formato register-shifted register;
- Il campo CMD =  $0001_2$  perché si deve eseguire un XOR bit a bit;
- Il campo S = 0 perché non si devono aggiornare i flag nello status register;

<table border="1" style="width: 100%; text-align: center; border-collapse: collapse;">
<thead>
<tr>
<th colspan="4">COND</th>
<th colspan="2">OP</th>
<th>I</th>
<th colspan="4">CMD</th>
<th>S</th>
<th colspan="4">SORGENTE</th>
<th colspan="4">DESTINAZIONE</th>
<th colspan="4">Rs</th>
<th colspan="4">sh</th>
<th colspan="4">Rm</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td><td>1</td><td>1</td><td>0</td>
<td>0</td><td>0</td>
<td>0</td>
<td>0</td><td>0</td><td>0</td><td>1</td>
<td>0</td>
<td>1</td><td>0</td><td>0</td><td>1</td>
<td>1</td><td>0</td><td>0</td><td>0</td>
<td>1</td><td>1</td><td>0</td><td>0</td>
<td>0</td><td>1</td><td>1</td><td>1</td>
<td>1</td><td>0</td><td>1</td><td>0</td>
</tr>
<tr>
<td>31</td><td>30</td><td>29</td><td>28</td>
<td>27</td><td>26</td>
<td>25</td>
<td>24</td><td>23</td><td>22</td><td>21</td>
<td>20</td>
<td>19</td><td>18</td><td>17</td><td>16</td>
<td>15</td><td>14</td><td>13</td><td>12</td>
<td>11</td><td>10</td><td>9</td><td>8</td>
<td>7</td><td>6</td><td>5</td><td>4</td>
<td>3</td><td>2</td><td>1</td><td>0</td>
</tr>
</tbody>
</table>

## ROR R1, R2, #23

- R1 è il registro destinazione in cui deve essere memorizzato il contenuto di R2 ruotato a destra di 23 bit (il campo dell'indirizzo del registro sorgente non viene utilizzato e, quindi, è  $0000_2$ );
- Questo tipo di istruzioni ha sempre e solo due operandi e l'operando sorgente non è utilizzato;
- Il campo COND è  $1110_2$  perché questa è un'istruzione incondizionata;
- Il campo OP è 00 perché questa è un'istruzione di data-processing;
- Il campo I = 0 perché gli ultimi 12 bit corrispondono al formato con registro;
- Il campo CMD =  $1101_2$  perché si deve eseguire una rotazione a destra (questo codice è utilizzato per tutti i tipi di shift);
- Il campo S = 0 perché non si devono aggiornare i flag nello status register;

<table border="1" style="width: 100%; text-align: center; border-collapse: collapse;">
<thead>
<tr>
<th colspan="4">COND</th>
<th colspan="2">OP</th>
<th>I</th>
<th colspan="4">CMD</th>
<th>S</th>
<th colspan="4">SORGENTE</th>
<th colspan="4">DESTINAZIONE</th>
<th colspan="4">shamt5</th>
<th colspan="4">sh</th>
<th colspan="4">Rm</th>
</tr>
</thead>
<tbody>
<tr>
<td>1</td><td>1</td><td>1</td><td>0</td>
<td>0</td><td>0</td>
<td>0</td>
<td>1</td><td>1</td><td>0</td><td>1</td>
<td>0</td>
<td>0</td><td>0</td><td>0</td><td>0</td>
<td>0</td><td>0</td><td>0</td><td>1</td>
<td>1</td><td>0</td><td>1</td><td>1</td>
<td>1</td><td>1</td><td>0</td>
<td>0</td><td>0</td><td>1</td><td>0</td>
</tr>
<tr>
<td>31</td><td>30</td><td>29</td><td>28</td>
<td>27</td><td>26</td>
<td>25</td>
<td>24</td><td>23</td><td>22</td><td>21</td>
<td>20</td>
<td>19</td><td>18</td><td>17</td><td>16</td>
<td>15</td><td>14</td><td>13</td><td>12</td>
<td>11</td><td>10</td><td>9</td><td>8</td>
<td>7</td><td>6</td><td>5</td><td>4</td>
<td>3</td><td>2</td><td>1</td><td>0</td>
</tr>
</tbody>
</table>

### Datapath delle istruzioni di data-processing

Dopo aver visto come si codifica un'istruzione di data-processing in linguaggio macchina, il prossimo passo è quello di studiare il suo datapath. Non andremo a studiarlo per tutte le istruzioni, ma solo per quelle operazioni che già esegue l'ALU, ovvero: **ADD, SUB, AND, ORR**.

![Detailed datapath diagram for data-processing instructions. It shows the flow from the Instruction Memory (A, RD) to the Register File (A3, WD3, R15), then t...](images/p089_fig01.png)

I primi 3 punti sono uguali all'analisi del datapath dell'istruzione LDR Rd, [Rn, imm12].

1. Le istruzioni di data-processing utilizzano degli immediate a 8 bit (e non a 12 bit come nelle istruzioni di memoria). Proprio per questo motivo, l'extender deve avere un selettore ImmSrc che, quando è uguale a 0 estende i bit Instr7:0 fino a 32 bit (caso di istruzioni di data-processing); invece, quando è uguale a 1 estende i bit Instr11:0 fino a 32 bit (caso di istruzioni di memoria);
2. Quando abbiamo un'istruzione di data-processing, il dato che si deve memorizzare nel registro identificato dai bit Instr15:12 nell'ingresso A3 del register file non è un contenuto del Data

---

<!-- Pagina 90 -->

Memory, ma è proprio il risultato dell'operazione restituito dall'ALU. Per differenziare questi due casi, si inserisce un multiplexer 2:1 con selettore MemToReg:

- Se MemToReg = 0, allora Result è uguale al risultato dell'operazione restituito dall'ALU (istruzione di data-processing);
- Se MemToReg = 1, allora Result è uguale al contenuto del Data Memory identificato dall'indirizzo restituito come risultato dell'operazione dell'ALU (istruzione di memoria);

6. In un'operazione STR, l'indirizzo del registro il cui contenuto corrisponde al secondo operando lo si recupera dai bit Instr15:12. Invece, in un'istruzione di data-processing l'indirizzo del registro il cui contenuto corrisponde al secondo operando è dato dai bit Instr3:0 (formato immediate-shifted register oppure register-shifted register). Per questo motivo, è necessaria l'implementazione di un multiplexer 2:1 con selettore RegSrc con i seguenti valori:

- Se RegSrc = 0, allora l'indirizzo del secondo operando lo si recupera dai bit Instr3:0 (istruzione di data-processing);
- Se RegSrc = 1, allora l'indirizzo del secondo operando lo si recupera dai bit Instr15:12 (istruzione di memoria);

7. In un'istruzione di data processing, abbiamo distinto due casi: nel primo caso, il secondo operando è un immediate identificato dai bit Instr7:0 che passa per l'extender; nel secondo caso, il secondo operando è il contenuto di un registro identificato dall'indirizzo nei bit Instr3:0. Quindi, per distinguere questi due casi occorre implementare un multiplexer 2:1 con selettore ALUSrc prima dell'ingresso SrcB dell'ALU:

- Se ALUSrc = 0, allora il secondo operando è il contenuto del registro identificato dall'indirizzo in ingresso al register file (istruzione di data-processing formato register);
- Se ALUSrc = 1, allora il secondo operando corrisponde alla parola binaria di 32 bit in output all'extender (istruzione di data-processing formato immediate);
- (per semplicità, non si considera il formato register-shifted register).

8. A seconda del campo CMD nei bit Instr24:21, i flag ALUControl assumono valori diversi, in particolare: ADD → ALUControl = 002, SUB → ALUControl = 012, AND → ALUControl = 102, ORR → ALUControl = 112.

### Esecuzione condizionata delle istruzioni

Senza la possibilità di modificare il flusso di esecuzione di un programma, non sarebbe possibile realizzare tutti quei costrutti presenti in un linguaggio di alto livello, come if-else, while, e così via.

Per gestire il flusso di dati e di istruzioni di un programma, ARM utilizza dei condition flags per indicare sotto quali condizioni una certa istruzione deve essere eseguita. Questi condition flags sono identificati da un codice di 4 bit (p.e. 11102 corrisponde all'esecuzione incondizionata), dove ogni bit corrisponde al valore di una ALUFlag memorizzata all'interno del Current Program Status Register, che sono aggiornati dopo l'esecuzione di specifiche istruzioni come le istruzioni con il suffisso S (p.e. ADDS e SUBS) oppure le istruzioni CMP e TST. Ad esempio:

#### CMP R5, R6

- Esegue la differenza tra i contenuti di R5 e R6;
- Non salva il risultato, ma aggiorna i valori dei flag nel CPSR:
  - Se il risultato è uguale a 0, allora Z = 1 (R5 e R6 sono uguali);
  - Se il risultato è negativo, allora N = 1 (R6 è maggiore di R5);
  - Se la differenza riporta un carry, allora C = 1;
  - Se la differenza causa un overflow, allora V = 1 (operandi stesso segno → risultato segno diverso);

appuntofotocopia

---

<!-- Pagina 91 -->

Un'istruzione può essere eseguita condizionalmente in base ai valori che assumono i condition flags nel CPSR. In particolare, in assembly, l'esecuzione condizionata di un'istruzione è determinata dalla presenza di un suffisso dopo il mnemonico di un'istruzione, detto *condition mnemonic*.

Ogni condition mnemonic è identificato da un codice di 4 bit che corrisponde proprio ai valori dei 4 bit dei conditions flag, e sono utilizzati nei 4 bit più significativi di ogni istruzioni (campo COND).

<table border="1">
<thead>
<tr>
<th>Bit del campo COND</th>
<th>Condition mnemonic</th>
<th>Descrizione</th>
<th>Logica dei condition flag</th>
</tr>
</thead>
<tbody>
<tr>
<td>0000</td>
<td>EQ</td>
<td>I contenuti dei due registri sono uguali (Z=1)</td>
<td>Z</td>
</tr>
<tr>
<td>0001</td>
<td>NE</td>
<td>I contenuti dei due registri non sono uguali (Z=0)</td>
<td>$\bar{Z}$</td>
</tr>
<tr>
<td>0010</td>
<td>CS / HS<br/>(Carry Set / Higher Same)</td>
<td>Il contenuto del primo registro è maggiore o uguale del secondo (rappr. senza segno)</td>
<td>C</td>
</tr>
<tr>
<td>0011</td>
<td>CC / LO<br/>(Carry Clear / Lower)</td>
<td>Il contenuto del primo registro è strettamente minore del secondo (rappr. senza segno)</td>
<td>$\bar{C}$</td>
</tr>
<tr>
<td>0100</td>
<td>MI</td>
<td>Il risultato è negativo (N = 1)</td>
<td>N</td>
</tr>
<tr>
<td>0101</td>
<td>PL</td>
<td>Il risultato è positivo oppure zero (N = 0)</td>
<td>$\bar{N}$</td>
</tr>
<tr>
<td>0110</td>
<td>VS<br/>(oVerflow Set)</td>
<td>Il risultato causa overflow (V = 1)</td>
<td>V</td>
</tr>
<tr>
<td>0111</td>
<td>VC<br/>(oVerflow Clear)</td>
<td>Il risultato non causa overflow (V = 0)</td>
<td>$\bar{V}$</td>
</tr>
<tr>
<td>1000</td>
<td>HI<br/>(unsigned Higher)</td>
<td>Il contenuto del primo registro è strettamente maggiore del secondo (rappr. senza segno)</td>
<td>$\bar{Z}C$</td>
</tr>
<tr>
<td>1001</td>
<td>LS<br/>(unsigned Lower / Same)</td>
<td>Il contenuto del primo registro è minore o uguale del secondo (rappr. senza segno)</td>
<td>Z OR $\bar{C}$</td>
</tr>
<tr>
<td>1010</td>
<td>GE</td>
<td>Il contenuto del primo registro è maggiore o uguale del secondo (rappr. in compl. a 2)</td>
<td>$\overline{N \oplus V}$</td>
</tr>
<tr>
<td>1011</td>
<td>LT</td>
<td>Il contenuto del primo registro è strettamente minore del secondo (rappr. in compl. a 2)</td>
<td>$N \oplus V$</td>
</tr>
<tr>
<td>1100</td>
<td>GT</td>
<td>Il contenuto del primo registro è strettamente maggiore del secondo (rappr. in compl. a 2)</td>
<td>$Z(\overline{N \oplus V})$</td>
</tr>
<tr>
<td>1101</td>
<td>LE</td>
<td>Il contenuto del primo registro è minore o uguale del secondo (rappr. in compl. a 2)</td>
<td>Z OR $(N \oplus V)$</td>
</tr>
<tr>
<td>1110</td>
<td>AL (oppure niente)</td>
<td>Esecuzione incondizionata</td>
<td>Nessuna</td>
</tr>
</tbody>
</table>

Quindi, un'istruzione sarà eseguita se e solo se l'espressione booleana associata al mnemonico restituisce TRUE in base ai valori dei condition flags memorizzati nei 4 bit più significativi del CPSR.

Vediamo un esempio (supponiamo che R5 = 17 e R9 = 23):

```
CMP R5, R9
SUBEQ R1, R2, R3
ORRMI R4, R0, R9
```

L'istruzione CMP esegue la differenza tra R5 e R9, ovvero  $17 - 23 = -6$  (senza salvare il risultato) e aggiorna i 4 bit più significativi del CPSR nel seguente modo: N = 1, Z = 0, C = 0, V = 0. In base ai nuovi valori assunti dai bit NZCV, esaminiamo l'esecuzione delle istruzioni seguenti:

- SUBEQ R1, R2, R3 non sarà eseguita perché Z = 0 (R5 non è uguale a R9);
- ORRMI R4, R0, R9 sarà eseguita perché N = 1 (il risultato di R5 - R9 è negativo);

---

<!-- Pagina 92 -->

## Istruzioni di branching

Un programma esegue le varie istruzioni in sequenza, incrementando il Program Counter di 4 byte per volta (perché ogni istruzione è costituita da 32 bit) in modo da puntare all'istruzione successiva. Le istruzioni di branching permettono di modificare il valore del Program Counter. Nei linguaggi di alto livello, le istruzioni di branching corrispondono a costrutti come Go-To oppure chiamate a funzione e così via. In ARM ci sono due istruzioni di branching:

- **SIMPLE BRANCH (B)**: sono utilizzati per realizzare istruzioni di controllo come if-else, while, for;
- **BRANCH AND LINK (BL)**: sono utilizzati per realizzare istruzioni di chiamata a funzione;

In un programma scritto in codice **ARM Assembly**, i programmatori utilizzano delle etichette per indicare blocchi di istruzioni. Quando il codice ARM Assembly viene tradotto in linguaggio macchina, le etichette sono tradotte in indirizzi corrispondenti alle istruzioni che ne fanno parte.

## Codifica delle istruzioni di branching

![Figura pagina 92](images/p092_fig01.png)

- **COND 31-28**: sono quattro bit che descrivono una condizione e sono utilizzati al fine di gestire il flusso di dati di un programma (p.e. if-else);
- **OP 27-26**: sono due bit che definiscono il codice dell'operazione, cioè definisce a quale macrocategoria di istruzioni appartiene questa parola binaria. A seconda di questi due bit, i seguenti bit saranno interpretati in maniera differente. Il codice affinché questa parola sia interpretata come un'istruzione di branching è 102;
- **FUNCT 25-24**: sono due bit riservati alla descrizione di alcune funzionalità:
  - BIT 25: è un bit fisso al valore 1;
  - L: indica se l'istruzione è un branch semplice (L = 0) oppure è un branch and link (L = 1);
- **IMM24 23-0**: i restanti 24 bit rappresentano il valore, rappresentato in complemento a due, che specifica la posizione dell'istruzione relativamente all'indirizzo PC+8 (memorizzato in R15). Le operazioni di branch utilizzano sempre e solo un unico operando immediato di 24 bit.

Durante l'esecuzione di un'istruzione, il registro R15 che ancora deve essere aggiornato contiene il valore dell'istruzione successiva. Quando si ha un'istruzione BL, il valore dell'indirizzo di ritorno alla funzione chiamante, che sarebbe l'indirizzo della prossima istruzione memorizzato in R15, viene memorizzato nel registro R14, detto proprio Link Register (in modo da tornare indietro alla funzione chiamante dopo aver terminato l'esecuzione di un altro blocco di istruzioni).

Dopo aver memorizzato l'indirizzo di R15 in R14, si esegue un'istruzione B all'indirizzo dell'etichetta della subroutine che si vuole eseguire e, una volta terminata la sua esecuzione, il ritorno alla funzione chiamante si esegue riprendendo l'indirizzo memorizzato in R14 (istruzione successiva alla chiamata a funzione) e ripristinandolo in R15 (in modo che quest'istruzione sia eseguita come successiva) tramite un'istruzione MOV PC, LR (oppure MOV R15, R14).

## Datapath delle istruzioni di branching

![Detailed datapath diagram for ARM instructions. It shows the flow from the Program Counter (PC) through an Instruction Memory to the ALU and Register File. T...](images/p092_fig02.png)

---

<!-- Pagina 93 -->

I primi 2 punti sono uguali all'analisi del datapath dell'istruzione LDR Rd, [Rn, imm12].

3. Il signed immediate a 24 bit nel campo Instr23:0 (rappresentato in complemento a due) che passa nell'Extend deve essere moltiplicato per 4 ed esteso ad una parola di 32 bit. La logica dell'Extend, quindi, necessita di un'ulteriore modalità identificata dal codice 10 del flag ImmSrc (passa da 1 bit a 2 bit, in quanto è necessario codificare 3 modalità):

<table border="1"><thead><tr><th>ImmSrc</th><th>ExtImm (output)</th><th>Descrizione</th></tr></thead><tbody><tr><td>00</td><td>0000 0000 0000 0000 0000 0000 Instr<sub>7:0</sub></td><td>Immediate di 8 bit unsigned per un'istruzione di data-processing</td></tr><tr><td>01</td><td>0000 0000 0000 0000 0000 0000 Instr<sub>11:0</sub></td><td>Immediate di 12 bit unsigned per un'istruzione di memoria</td></tr><tr><td>10</td><td>[6 volte Instr<sub>23</sub>] Instr<sub>23:0</sub> 00</td><td>Signed immediate di 24 bit in rapp. in complemento a due da moltiplicare per 4 tramite LSL 2 (l'estensione in complemento a due prevede la copia del bit più significativo)</td></tr></tbody></table>

4. In questo datapath, i valori dei flag sono i seguenti:

- Il valore di RD1 è l'indirizzo contenuto in R15, perché, a partire da questo indirizzo, si deve sommare il signed immediate a 32 bit per ottenere l'indirizzo del blocco di istruzioni da eseguire. Per far ciò occorre aggiungere un multiplexer 2:1 con selettore RegSrc prima dell'ingresso RD1: se RegSrc = 0 allora RA1 è l'indirizzo nel register file corrispondente ai bit Instr19:16; se RegSrc=1 allora RA1 è l'indirizzo del registro R15 nel register file;
- Il valore di ImmSrc è 10, perché la logica di Extend deve eseguire la modalità di estensione di un signed immediate a 24 bit;
- Il valore di ALUSrc è 1, perché l'operando è sempre un'immmediate proveniente da Extend;
- I bit dei selettori ALUControl sono 00 perché l'ALU deve eseguire la somma tra l'indirizzo nel registro R15 e il signed immediate a 32 bit restituito dall'Extend;
- Il valore di MemtoReg è 0 perché deve essere direttamente l'output dell'ALU a proseguire e non una parola conservata nel Data Memory;
- Il valore PCSrc è 1 perché in un'istruzione di branching si vuole che il prossimo indirizzo dell'istruzione da eseguire sia proprio il risultato dell'ALU;
- Infine, il valore di RegWrite è 0 perché non si deve sovrascrivere il valore di alcun registro (R15 è aggiornato direttamente dal Program Counter);

```
MOVE R0, R5
// R1 = 0x23
LOOP
SUBS
```

```
INT R0 = 8;
DO NOT R1 = 1;
WHILE (R0 != 0) {
    R1 = R1 << 1;
    R0 -= 2;
}
PRINT ("%i.d", R1);
```

---

<!-- Pagina 94 -->

## Control Unit di un processore a ciclo singolo

È l'unità adibita all'impostazione e al calcolo di tutti i valori corretti dei selettori dei multiplexer e degli abilitatori. Quindi, il datapath (per il set di istruzioni studiate) completo di un processore a ciclo singolo è il seguente:

![Detailed schematic diagram of a single-cycle processor datapath. It shows the Control Unit with its internal registers (PC, RA1, RA2, R15) and multiplexers....](images/p094_fig01.png)

La Control Unit è a sua volta suddivisa in due blocchi principali:

1. DECODER;
2. CONDITIONAL LOGIC;

![Schematic diagram of the Control Unit's internal structure. It shows a Decoder block that takes inputs Cond3,0, ALUFlags3,0, Op1,0, Funct5,0, and Rd3,0. The...](images/p094_fig02.png)

### Decoder

Il decoder genera alcuni segnali di flusso nel datapath in base alla struttura dell'istruzione e in base al tipo di operazione (campo OP), ai campi FUNCT (diversi nelle tre macrocategorie di istruzioni) e al campo Rd, cioè il registro di destinazione indicato nell'istruzione.

Il decoder della Control Unit (di questo specifico set di istruzioni) agisce in questo modo:

- **DETERMINA** il tipo di istruzione (data-processing con immediate o registro, memoria, branching) in base agli input **COND**, **OP** e **FUNCT**;
- **GENERA** i segnali giusti per gli output che hanno controllo diretto del datapath (p.e.: MemToReg, ALUSrc, ImmSrc, RegSrc, ALUControl);
- **GENERA** dei segnali di output MemW e RegW che vanno direttamente in input alla conditional logic. Questi due segnali diventeranno, poi, i segnali di output MemWrite e RegWrite se e solo se la condizione dell'istruzione è soddisfatta dai flag di stato del CPSR;
- **GENERA** l'output FlagW1,0, composto da due bit, che indica come e quando le ALUFlags devono essere aggiornate nel CPSR. In particolare:
  - FlagW1 abilita l'aggiornamento dei flag **N** e **Z**;
  - FlagW0 abilita l'aggiornamento dei flag **C** e **V**;

---

<!-- Pagina 95 -->

- Per le operazioni ADDS, SUBS, CMP e così via che aggiornano tutti e quattro i flag NZCV:  $\text{FlagW}_{1:0}=11_2$ ;
- Per le operazioni logiche che aggiornano solo i flag N e Z (perché, ovviamente, sono operazioni che non restituiscono carries oppure causano overflow):  $\text{FlagW}_{1:0}=10_2$ ;
- Tutte le altre operazioni alle quali non è permessa la modifica degli ALUFlags:  $\text{FlagW}_{1:0}=00_2$ .

- GENERA internamente dei segnali Branch e ALUOp, utilizzati rispettivamente per indicare se l'istruzione è di branching o data-processing.

La logica del decoder può essere sviluppata tramite le tabelle di verità, in quanto esso non è altro che una logica combinatoria. Il decoder è suddiviso a sua volta in altri 3 blocchi:

![Block diagram of the instruction decoder. It shows three main components: PC Logic, Main Decoder, and ALU Decoder. PC Logic receives Rd3,0 and outputs PCS. M...](images/p095_fig01.png)

1. **MAIN DECODER:** è una logica combinatoria adibita alla generazione di tutti gli output visti in precedenza. Alcuni di questi (Branch e ALUOp) sono in ingresso agli altri due blocchi PC Logic e ALU Decoder, che, insieme ad altri input (FUNCT4:0 e Rd3:0), sono adibiti alla generazione di altri output specifici, come PCS, ALUControl1:0 e FlagW1:0;

<table border="1">
<thead>
<tr>
<th>Op</th>
<th>Func<sub>5</sub></th>
<th>I Func<sub>0</sub> L</th>
<th>Istruzione</th>
<th>Branch</th>
<th>MemToReg</th>
<th>MemW</th>
<th>ALUSrc</th>
<th>ImmSrc<sub>1:0</sub></th>
<th>RegW</th>
<th>RegSrc<sub>1:0</sub></th>
<th>ALUOp</th>
</tr>
</thead>
<tbody>
<tr>
<td>00</td>
<td>0</td>
<td>X</td>
<td>Dp Reg</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>XX</td>
<td>1</td>
<td>00</td>
<td>1</td>
</tr>
<tr>
<td>00</td>
<td>1</td>
<td>X</td>
<td>Dp Imm</td>
<td>0</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>00</td>
<td>1</td>
<td>X0</td>
<td>1</td>
</tr>
<tr>
<td>01</td>
<td>X</td>
<td>0</td>
<td>STR Imm</td>
<td>0</td>
<td>X</td>
<td>1</td>
<td>1</td>
<td>01</td>
<td>0</td>
<td>10</td>
<td>0</td>
</tr>
<tr>
<td>01</td>
<td>X</td>
<td>1</td>
<td>LDR Imm</td>
<td>0</td>
<td>1</td>
<td>0</td>
<td>1</td>
<td>01</td>
<td>1</td>
<td>X0</td>
<td>0</td>
</tr>
<tr>
<td>10</td>
<td>X</td>
<td>X</td>
<td>B</td>
<td>1</td>
<td>0</td>
<td>0</td>
<td>1</td>
<td>10</td>
<td>0</td>
<td>X1</td>
<td>0</td>
</tr>
</tbody>
</table>

1. **ALU DECODER:** è una logica combinatoria adibita alla generazione degli output ALUControl1:0 e FlagW1:0, a partire dagli ingressi ALUOp (provienne dal main decoder) e i campi CMD e S di un'istruzione di data-processing (FUNCT4:0). Il circuito combinatorio interno all'ALU Decoder soddisfa la seguente tabella di verità:

<table border="1">
<thead>
<tr>
<th>ALUOp</th>
<th>FUNCT<sub>4:1</sub> (CMD)</th>
<th>FUNCT<sub>0</sub> (S)</th>
<th>Operazione</th>
<th>ALUControl<sub>1:0</sub></th>
<th>FlagW<sub>1:0</sub></th>
</tr>
</thead>
<tbody>
<tr>
<td>0</td>
<td>X</td>
<td>X</td>
<td>Non è un'operazione di data-processing</td>
<td>00 (somma di base address e offset)</td>
<td>00</td>
</tr>
<tr>
<td rowspan="8">1</td>
<td rowspan="2">0100</td>
<td>0</td>
<td>ADD</td>
<td>00</td>
<td>00</td>
</tr>
<tr>
<td>1</td>
<td>ADDS</td>
<td></td>
<td>11</td>
</tr>
<tr>
<td rowspan="2">0010</td>
<td>0</td>
<td>SUB</td>
<td>01</td>
<td>00</td>
</tr>
<tr>
<td>1</td>
<td>SUBS</td>
<td></td>
<td>11</td>
</tr>
<tr>
<td rowspan="2">0000</td>
<td>0</td>
<td>AND</td>
<td>10</td>
<td>00</td>
</tr>
<tr>
<td>1</td>
<td>ANDS</td>
<td></td>
<td>10</td>
</tr>
<tr>
<td rowspan="2">1100</td>
<td>0</td>
<td>ORR</td>
<td>11</td>
<td>00</td>
</tr>
<tr>
<td>1</td>
<td>ORRS</td>
<td></td>
<td>10</td>
</tr>
</tbody>
</table>

---

<!-- Pagina 96 -->

3. **PC LOGIC**: la logica di Program Counter deve generare l'output PCS che è dato in ingresso alla logica condizionale. Se la condizione dell'istruzione è soddisfatta allora  $PCSrc = PCS$ , altrimenti  $PCSrc = 0$  ( $PCSrc$  è il selettore che indica se l'indirizzo della prossima istruzione è  $PC+4$  oppure proviene dal risultato dell'ALU).  $PCS = 1$  se e solo se è rispettata la seguente condizione:

$$
PCS = ((Rd == 15) \text{ AND } \text{RegW}) \text{ OR } \text{Branch}
$$

$PCS = 1$  (l'indirizzo della prossima istruzione è risultato dell'ALU) se e solo se  $\text{Branch} = 1$  (si sta eseguendo un'istruzione di branching) oppure se vale la prima condizione, cioè se in un'istruzione di data-processing (indicato dal fatto che  $\text{RegW} = 1$ ), il registro di destinazione è  $R15$  (contiene, clock dopo clock, l'indirizzo dell'istruzione successiva) e, quindi, si effettua un "salto".

### Conditional Logic

È una logica combinatoria il cui compito è quello di verificare se l'eventuale condizione dell'istruzione è soddisfatta. Ha come ingressi i quattro bit del campo COND dell'istruzione eseguita, i quattro bit correnti delle ALUFlags presi direttamente dal CPSR e altri input che derivano direttamente dal Decoder, cioè  $\text{FlagW}_{1:0}$ ,  $PCS$ ,  $\text{RegW}$  e  $\text{MemW}$ . I tre output di questo blocco sono  $\text{MemWrite}$  che abilita la scrittura in memoria,  $\text{RegWrite}$  che abilita la scrittura nel register file e  $PCSrc$  che indica se il prossimo indirizzo è  $PC+4$  oppure un altro. Se la condizione dell'istruzione è soddisfatta allora l'istruzione ha effetto ("viene eseguita"), altrimenti l'esecuzione di questa istruzione non deve avere effetto. Per far ciò, i tre output sono "forzati" al valore 0, in modo che la prossima istruzione si trova a  $PC+4$ , e non è abilitata la scrittura in memoria e nel register file (il processore "comunque esegue" l'istruzione, ma non se ne vedono i risultati perché la scrittura non è abilitata). La struttura interna della conditional logic è la seguente:

![Diagram of the Conditional Logic block showing two states: CondEx = 1 (condition satisfied) and CondEx = 0 (condition not satisfied).](images/p096_fig01.png)

Il blocco della conditional logic verifica se l'istruzione deve essere eseguita o meno, in base all'espressione booleana associata al campo COND dell'istruzione e ai valori correnti dei flag NZCV nel CPSR. Come detto prima, se l'istruzione "non deve essere eseguita" i valori degli output di questo blocco sono forzati a 0.

Inoltre, la logica condizionale, sempre se e solo se la condizione è soddisfatta, aggiorna i valori dei flag N e Z se  $\text{FlagW}_1 = 1$  e aggiorna i valori dei flag C e V se  $\text{FlagW}_0 = 1$ . Il circuito che permette l'aggiornamento dei valori dei flag N, Z, C, V è un circuito sequenziale sincronizzato con il clock, in quanto il blocco Condition Check ha come ingressi i valori dei flag per verificare la condizione nel campo COND e, a sua volta, se la condizione è verificata i valori dei flag possono essere aggiornati in base all'istruzione eseguita (dipende dal valore di  $\text{FlagW}_{1:0}$ ).

---

<!-- Pagina 97 -->

Dimostriamo perché, nella rappresentazione in compl. a 2, i condition mnemonic GE, LT, GT e LE devono rispettare le seguenti espressioni booleane dei flag N, Z, C, V del CPSR:

<table border="1">
<tr>
<td>$A \geq B$</td>
<td>GE</td>
<td>Il contenuto del primo registro è maggiore o uguale del secondo</td>
<td>$\overline{N \oplus V}$</td>
</tr>
<tr>
<td>$A &lt; B$</td>
<td>LT</td>
<td>Il contenuto del primo registro è strettamente minore del secondo</td>
<td>$N \oplus V$</td>
</tr>
<tr>
<td>$A &gt; B$</td>
<td>GT</td>
<td>Il contenuto del primo registro è strettamente maggiore del secondo</td>
<td>$\overline{Z} * (\overline{N \oplus V})$</td>
</tr>
<tr>
<td>$A \leq B$</td>
<td>LE</td>
<td>Il contenuto del primo registro è minore o uguale del secondo</td>
<td>$Z \text{ OR } (\overline{N \oplus V})$</td>
</tr>
</table>

Partiamo da  $A < B$ : l'espressione booleana  $N \oplus V$  descrive proprio  $A < B$ , ovvero  $A - B < 0$ , perché:

- L'istruzione CMP effettua la differenza  $A - B$ :
  - se non è stato generato alcun overflow, vuol dire che il risultato è corretto (non è un valore errato) e che  $V = 0$ . Se  $V = 0$ , allora deve essere rispettata la condizione  $A - B < 0$ , cioè il risultato della differenza è negativo e, quindi,  $N = 1$ ;
  - se è stato generato un overflow, allora  $V = 1$ .  $A - B < 0$  è verificata se e solo se  $A$  e  $(-B)$  hanno lo stesso segno (continuano a rimanere sottozero), cioè  $A$  è negativo e  $B$  è positivo nella differenza, invece nella somma,  $A$  e  $\sim B + 1$  hanno segno negativo e il risultato è positivo, cioè  $N = 0$  (se  $A$  fosse positivo e  $(-B)$  pure, il risultato sarebbe qualcosa maggiore di 0);

Da questa dimostrazione, si verificano facilmente tutte le altre condizioni:

- $A \leq B$  aggiunge la condizione che i valori  $A$  e  $B$  possono essere uguali, ovvero la loro differenza è 0. L'espressione booleana è quindi un OR tra  $Z$  e  $N \oplus V$ ;
- $A > B$  è l'esatto opposto di  $A \leq B$ , quindi basta applicare la legge di De Morgan:  $\overline{Z + (N \oplus V)} = \overline{Z} * (\overline{N \oplus V})$ ;
- $A \geq B$  è l'esatto opposto di  $A < B$ , quindi, l'espressione booleana è  $\overline{N \oplus V}$ , cioè la negata di  $N \oplus V$ ;

Dimostriamo perché, nella rappresentazione senza segno, i condition mnemonic CC / HS, CC / LO, HI e LS devono rispettare le seguenti espressioni booleane dei flag N, Z, C, V del CPSR:

<table border="1">
<tr>
<td>$A \geq B$</td>
<td>CS / HS</td>
<td>Il risultato dell'operazione ha riportato un carry</td>
<td>$C$</td>
</tr>
<tr>
<td>$A &lt; B$</td>
<td>CC / LO</td>
<td>Il risultato dell'operazione NON ha riportato un carry</td>
<td>$\overline{C}$</td>
</tr>
<tr>
<td>$A &gt; B$</td>
<td>HI</td>
<td>Il contenuto del primo registro è strettamente maggiore del secondo</td>
<td>$\overline{Z} C$</td>
</tr>
<tr>
<td>$A \leq B$</td>
<td>LS</td>
<td>Il contenuto del primo registro è minore o uguale del secondo</td>
<td>$Z \text{ OR } \overline{C}$</td>
</tr>
</table>

Nella rappresentazione senza segno, il complemento di una parola binaria lo si ottiene effettuando la sottrazione bit a bit una parola composta solo da 1 e la parola che si vuole complementare:

Ad esempio:  $10001110_2 \rightarrow 11111111_2 - 10001110_2 = 01110001_2$ , cioè  $2^N - 1 - B$ .

Quindi, per effettuare la differenza tra  $A$  e  $B$ , proprio come nella rapprr. in compl. a due, si deve sommare  $A$  con  $\sim B + 1$ , ottenendo così:  $A + (\sim B + 1) = A + 2^N - B$ .

- $A < B$  è verificata dalla condizione  $\overline{C}$  perché  $A + 2^N - B$  non genera un carry se e solo se  $A + 2^N - B \leq 2^N - 1$  perché se il primo valore fosse più grande sicuramente ci sarebbe un carry out rispetto al massimo numero rappresentabile con  $N$  bit. Da questa disequazione si ricava  $A + 1 \leq B$ , cioè se e solo  $A < B$ ;
- $A \geq B$  è l'esatto opposto di  $A < B$ , quindi l'espressione booleana che verifica questa condizione è la negata di  $\overline{C}$ , cioè  $C$ ;
- $A \leq B$  aggiunge la condizione che i valori  $A$  e  $B$  possono essere uguali, ovvero la loro differenza è 0. L'espressione booleana è quindi un OR tra  $\overline{C}$  e  $Z$ ;
- $A > B$  è l'esatto opposto di  $A \leq B$ , quindi basta applicare la legge di De Morgan:  $\overline{Z \text{ OR } \overline{C}} = \overline{Z} C$ ;

---

<!-- Pagina 98 -->

## Analisi delle prestazioni di un processore a ciclo singolo

Ogni singola istruzione in un processore a ciclo singolo impiega un intero ciclo di clock per la sua esecuzione, quindi il numero di cicli per istruzione CPI è 1. Vediamo un esempio di istruzione LDR:

![Detailed schematic diagram of a single-cycle processor architecture for an LDR instruction. The diagram shows the flow of data and control signals through va...](images/p098_fig01.png)

<table border="1">
<thead>
<tr>
<th>Element</th>
<th>Parameter</th>
<th>Delay (ps)</th>
</tr>
</thead>
<tbody>
<tr>
<td>Register clk-to-Q</td>
<td>$t_{pcq}$</td>
<td>40</td>
</tr>
<tr>
<td>Register setup</td>
<td>$t_{setup}$</td>
<td>50</td>
</tr>
<tr>
<td>Multiplexer</td>
<td>$t_{mux}$</td>
<td>25</td>
</tr>
<tr>
<td>ALU</td>
<td>$t_{ALU}$</td>
<td>120</td>
</tr>
<tr>
<td>Decoder</td>
<td>$t_{dec}$</td>
<td>70</td>
</tr>
<tr>
<td>Memory read</td>
<td>$t_{mem}$</td>
<td>200</td>
</tr>
<tr>
<td>Register file read</td>
<td>$t_{RFread}$</td>
<td>100</td>
</tr>
<tr>
<td>Register file setup</td>
<td>$t_{RFsetup}$</td>
<td>60</td>
</tr>
</tbody>
</table>

Si parte dal Program Counter che carica un nuovo indirizzo al fronte di salita del clock ( $t_{pcq\_PC}$ ). L'Instruction Memory legge l'indirizzo dato in ingresso dal PC e ritorna in output la parola di 32 bit che rappresenta l'istruzione da eseguire ( $t_{mem}$ ). Il Main Decoder, interno alla Control Unit, ritorna in output  $RegSrc_0 = 0$  sulla base del campo  $OP = 01$  dell'istruzione LDR ( $t_{dec}$ ). Questo output funge da selettore al multiplexer che sceglie il campo  $Rn$  (base address) che è inviato nell'ingresso  $RA1$  del register file ( $t_{mux}$ ). Il register file legge tale indirizzo e restituisce in output all'uscita  $RD1$  il contenuto del registro che viene inviato come ingresso  $SrcA$  dell'ALU ( $t_{RFread}$ ). Nel frattempo, il campo  $imm12$  viene esteso all'interno dell'Extend -  $t_{ext}$  - (ha come modalità 01 per l'estensione di immediate provenienti da istruzioni di memoria) e viene inviato all'ingresso  $SrcB$  dell'ALU tramite un multiplexer che ha come selettore il flag  $ALUSrc = 1$  proveniente dal Main Decoder -  $t_{mux}$  - (il calcolo dei due operandi è eseguito in parallelo). A questo punto, l'ALU somma i due ingressi  $SrcA$  e  $SrcB$  per trovare l'indirizzo dal quale prendere il dato in memoria ( $t_{ALU}$ ). Il Data Memory legge quest'indirizzo dato in input dall'ALU e ne restituisce il contenuto ( $t_{mem}$ ), che deve passare per un multiplexer il cui selettore è il flag  $MemToReg = 1$  proveniente dal Main Decoder ( $t_{mux}$ ). Infine, l'output di quest'ultimo multiplexer, Result, può essere scritto nel registro identificato dall'indirizzo nei 4 bit nel campo  $Rd$  dell'istruzione solo al prossimo ciclo di clock ( $WE3 = 1$  in modo da abilitare la scrittura nel register file) -  $t_{RFsetup}$ .

Il tempo del ciclo di clock è dato dalla seguente formula:

$$
T_c = t_{pcq\_PC} + t_{mem} + t_{dec} + \max[t_{mux} + t_{RFread}; t_{ext} + t_{mux}] + t_{ALU} + t_{mem} + t_{mux} + t_{RFsetup}
$$

Comunque, nella maggior parte delle implementazioni, l'ALU, le memorie e il register file sono nettamente più lenti rispetto alla maggior parte delle componenti circuitali. Quindi, la formula si semplifica così (il tempo  $t_{ext} + t_{mux}$  non viene considerato;  $t_{mem}$  e  $t_{mux}$  sono raggruppati):

$$
T_c = t_{pcq\_PC} + 2t_{mem} + t_{dec} + t_{RFread} + t_{ALU} + 2t_{mux} + t_{RFsetup} = 840ps
$$

In particolare, altre istruzioni seguono percorsi differenti che potrebbero essere più veloci. In qualunque caso, il ciclo di clock deve essere costante e abbastanza lungo da "accontentare" la più lenta delle istruzioni, dato che ci troviamo in una logica sequenziale sincrona.

Ad esempio, qual è il tempo di esecuzione di un programma con 100 miliardi di istruzioni in un processore a ciclo singolo? Secondo l'equazione:

$$
\text{Tempo di esecuzione} = \# \text{istruzioni} \times \left( \frac{\text{cicli}}{\text{istruzione}} \right) \times \left( \frac{\text{secondi}}{\text{ciclo}} \right) = 100 \times 10^9 \times 1 \times 840 \times 10^{-12} \text{sec} = 84 \text{sec}
$$

---

<!-- Pagina 99 -->

## Processore a ciclo multiplo

Il processore a ciclo singolo ha tre limiti molto importanti:

1. **SEPARAZIONE DELLE MEMORIE:** nel processore a ciclo singolo, la memoria dei dati e la memoria delle istruzioni sono separate poiché in un unico ciclo si devono gestire entrambi;
2. **INEFFICIENZA TEMPORALE:** il ciclo di clock deve essere lungo quanto l'istruzione più lenta (LDR), sprecando, così, tempo anche per le istruzioni molto veloci (data-processing e branching);
3. **DUPLICAZIONE DELLE COMPONENTI:** è necessaria l'implementazione di più componenti uguali come, p.e. un'ALU per l'esecuzione di istruzioni e altre due ALU per il Program Counter.

Il processore a ciclo multiplo rimuove queste debolezze suddividendo una singola istruzione in tante piccole sezioni, ognuna eseguita ad un ciclo di clock grazie all'implementazione di "stati non architettonici", ovvero registri che memorizzano il valore corrente di un output e che viene aggiornato ad ogni ciclo di clock. Queste quattro fasi sono: **FETCH, DECODE, EXECUTE, STORE**. I vantaggi principali di un processore a ciclo multiplo, quindi, sono:

1. **Utilizza una sola memoria comune** per le istruzioni e i dati. Infatti, l'istruzione viene letta in un ciclo, mentre i dati sono letti o scritti nei cicli seguenti (non c'è conflitto);
2. **Istruzioni meno complesse**, che, quindi, sono suddivise in più step, richiedono un minor numero di cicli di clock per eseguite completamente, evitando, così, sprechi di tempo;
3. **È possibile utilizzare un'unica ALU** per gestire i prossimi stati del Program Counter e i calcoli richiesti da tutte le tipologie di istruzioni (devono essere effettuati in cicli di clock differenti).

Il datapath di questo tipo di processore è implementato tramite una sorta di pipeline, nel quale le varie fasi in cui è suddivisa un'istruzione sono eseguite, ciclo dopo ciclo, in maniera incrementale. Anche in questo caso, non considereremo tutte le istruzioni dell'ARM Assembly, ma solo un set specifico, tra cui:

- Istruzioni di memoria come LDR e STR (con immediate offset positivo);
- Istruzioni di data-processing come ADD, SUB, AND, ORR (con modalità di indirizzamento da registro oppure da immediate senza shift);
- Istruzioni di branching come B.

### Datapath LDR

![Detailed schematic diagram of the LDR datapath. It shows the Program Counter (PC) connected to a memory block (Instr / Data Memory) via a multiplexer (MUX) c...](images/p099_fig01.png)

### FETCH: caricamento dell'istruzione

1. Si parte dal Program Counter che contiene l'indirizzo dell'istruzione corrente. Il contenuto di quest'indirizzo nella memoria Istruzioni / Dati è proprio l'istruzione da eseguire;
2. La memoria restituisce in output l'istruzione a 32 bit che, subito dopo, viene memorizzata in un registro che ha come abilitatore il flag IRWrite (Instruction Register) che abilita proprio la scrittura in questo registro. L'inserimento di questo registro nel datapath permette di eseguire il fetch dell'istruzione in un singolo clock;
3. Il registro Instruction Register si aggiorna al successivo ciclo di clock e l'istruzione ha l'etichetta Instr;

---

<!-- Pagina 100 -->

#### DECODE: recupero degli operandi dell'istruzione

1. Il passo seguente è quello di recuperare il primo operando (base address) dell'istruzione LDR. Esso verrà memorizzato nel registro A, in quanto la prossima fase dell'esecuzione sarà eseguita al successivo ciclo di clock;
2. Nel frattempo, il secondo operando di 12 bit (immediate) deve essere esteso nell'Extend con altri 20 zeri per arrivare ad una parola di 32 bit (modalità specificata dal flag ImmSrc). A differenza del primo operando, questo non è memorizzato in un registro perché il campo imm12 di Instr rimane costante (non cambia durante la competa esecuzione dell'istruzione);

#### EXECUTE: l'ALU esegue la somma degli operandi, il cui risultato è memorizzato nel registro Data

1. Una volta che sono stati identificati gli operandi SrcA e SrcB, l'operazione che deve eseguire l'ALU in questa istruzione LDR è una somma (ALUControl = 00) al fine di identificare l'indirizzo nel quale andare a recuperare il dato da scrivere nel registro destinazione;
2. Il risultato dell'ALU è memorizzato nel registro ALUOut, in modo che le fasi di questa istruzione siano eseguite in pipeline (prima FETCH, poi DECODE e nel frattempo un altro FETCH, ecc.);
3. La fase successiva è quella di recuperare in memoria il dato all'indirizzo calcolato dall'ALU. In un processore a ciclo multiplo si utilizza la stessa memoria per le istruzioni e per i dati. È, quindi, necessario un multiplexer 2:1 con selettore il flag AdrSrc per identificare da dove proviene l'indirizzo in ingresso Adr:
   - Nella fase di FETCH, AdrSrc = 0 per prendere l'indirizzo della prossima istruzione dal PC;
   - Nella fase di STORE, AdrSrc = 1 per prendere l'indirizzo del dato da leggere/scrivere direttamente dal risultato dell'ALU.

Quindi, in fasi differenti dell'esecuzione di un'istruzione, la Control Unit deve dare valori differenti ai flag per controllare correttamente il flusso dei dati.

1. A questo punto, AdrSrc = 1, quindi, la memoria restituisce in output il dato memorizzato all'indirizzo in ingresso (provienne dall'ALU) e viene memorizzato nel registro Data. Ovviamente, IRWrite = 0 perché non si deve memorizzare il dato nell'Instruction Register ma nel registro Data.

#### STORE: memorizzazione dei dati nel registro destinazione

1. Infine, i dati immagazzinati nel registro Data non sono dati direttamente in ingresso all'input WD3 del register file, ma passano prima per un multiplexer, nel quale si seleziona se il dato da scrivere nel registro destinazione proviene dalla memoria (p.e. in un'istruzione LDR il flag ResultSrc è 01) oppure proviene direttamente dall'ALU (p.e. in un'istruzione di data-processing il flag ResultSrc è 00). Ovviamente, solo durante quest'ultima fase, il flag RegWrite deve essere impostato a 1 per abilitare la scrittura nel Register File;

#### FETCH: aggiornamento del Program Counter

1. Uno dei vantaggi del processore a ciclo multiplo è quello che sfrutta la stessa ALU sia per operazioni aritmetiche e così via, sia per il calcolo dell'indirizzo della prossima istruzione PC+4. Il Program Counter va direttamente in ingresso ad un multiplexer il cui selettore ALUSrcA seleziona se l'output proviene dal PC oppure dal Register File e, allo stesso tempo, un multiplexer con selettore ALUSrcB seleziona se l'output è 4, se proviene dal Register File oppure dall'Extend. Quindi:

- Durante la fase di FETCH, per calcolare PC+4, ALUSrcA = 1 e ALUSrcB = 10, in modo che l'ALU sommi PC e 4 e l'output restituito sia memorizzato nel registro ALUOut;
- Durante la successiva fase di DECODE, si ripete la stessa identica situazione, però il valore corrente di PC è PC+4, che, sommato a 4, diventa PC+8. Questo valore calcolato dall'ALU, non viene memorizzato nel registro ALUOut, ma passa direttamente per il multiplexer in cui il selettore ResultSrc = 10 e viene memorizzato direttamente in R15;
- Nella fase di EXECUTE, i valori dei flag devono essere impostati correttamente dalla Control Unit al fine di eseguire propriamente l'istruzione corrente;

---

<!-- Pagina 101 -->

## Datapath STR

![Datapath diagram for the STR instruction. It shows the flow of data from the Register File to memory. The Register File (A1, A2, A3, WD3, R15) provides addre...](images/p101_fig01.png)

La fasi di FETCH, DECODE e EXECUTE sono identiche a quelle di un'istruzione LDR.

1. Rispetto ad un'istruzione LDR, la funzionalità principale di un'istruzione STR è quello di prendere il contenuto di un secondo registro dal Register File e scriverlo in memoria. L'indirizzo di tale registro è specificato nei bit Instr15:12 che sono direttamente connessi all'ingresso A2 del Register File;
2. Il contenuto del registro sorgente identificato dai bit nel campo Rd è memorizzato nel registro WriteData e all'inizio della fase di EXECUTE, mentre viene calcolato dall'ALU l'indirizzo di memoria in cui salvare il dato, l'output WriteData va nell'ingresso WD della memoria;

## STORE: memorizzazione dei dati nella memoria

1. In questa fase, il dato in input all'ingresso WD della memoria deve essere scritto all'indirizzo specificato all'input A della memoria (passa attraverso il multiplexer con selettore AdrSrc = 1). Ovviamente, il flag MemWrite = 1 per abilitare la scrittura in memoria.

Durante le fasi di FETCH e DECODE i valori di PC+4 e PC+8 in R15 vengono aggiornati allo stesso modo come descritto sopra.

## Datapath per istruzioni di data-processing

![Datapath diagram for data-processing instructions. It is similar to the STR datapath but includes a multiplexer for the ALU's second operand (SrcB). The mult...](images/p101_fig02.png)

La fase di FETCH è uguale a quella di un'istruzione LDR.

## DECODE: recupero degli operandi dell'istruzione

1. Il passo seguente è quello di recuperare il primo operando dal campo Rn dell'istruzione e recuperare il secondo operando o dagli ultimi 8 bit del campo imm8, oppure dagli ultimi 4 bit del campo Rm. Per implementare correttamente l'indirizzamento da registro, occorre aggiungere un multiplexer 2:1 che invia nell'ingresso RD2 del Register File l'indirizzo del registro del secondo operando:

- Se RegSrc = 0, allora si sta eseguendo un'istruzione con indirizzamento da registro e l'indirizzo del registro del secondo operando si trova ai bit Instr3:0 (campo Rm);

---

<!-- Pagina 102 -->

- Se  $RegSrc = 1$ , allora si sta eseguendo un'istruzione STR e l'indirizzo del registro sorgente è ai bit  $Instr_{15:12}$  (campo Rd).

5. Nel frattempo, se l'istruzione di data processing è a indirizzamento da immediate, allora il secondo operando di 8 bit (immediate) deve essere esteso nell'Extend con altri 24 zeri per arrivare ad una parola di 32 bit (modalità specificata dal flag ImmSrc);

**EXECUTE:** l'ALU esegue l'operazione richiesta dall'istruzione

**STORE:** memorizzazione dei dati nel registro destinazione

6. Il risultato restituito dall'ALU, che deve essere memorizzato nel Register File al registro destinazione identificato dall'indirizzo nel campo Rd dell'istruzione, si trova in ALUOut, passa per il multiplexer con selettore  $ResultSrc = 00$ , entra nell'ingresso WD3 e aggiorna il contenuto del registro destinazione poiché  $RegWrite = 1$ ;

Come per i casi precedenti, durante le fasi di FETCH e DECODE, l'ALU aggiorna prima PC a PC+4 e poi memorizza PC+8 in R15.

### Datapath per istruzioni di branching

![Detailed datapath diagram for branching instructions. It shows the PC, Instruction Memory, Register File, ALU, and various multiplexers. The PC is incremente...](images/p102_fig01.png)

L'hardware del processore è ormai completo. L'unico pezzo che manca è un multiplexer 2:1 con selettore  $RegSrc$ , che, durante la fase di DECODE, permette di selezionare l'ingresso 1 con input 15 se si deve eseguire una istruzione di branch. Nella fase successiva di EXECUTE, al primo operando  $SrcA$ , ovvero PC+8 proveniente da R15, sarà sommata una parola di 32 bit proveniente dall'Extend che corrisponde all'offset di 24 bit del campo imm24 nell'istruzione stessa. Quindi, nella successiva fase di STORE, il risultato contenuto in ALUOut prosegue fino al Program Counter, che potrà essere aggiornato poiché l'abilitatore  $PCWrite = 1$ .

### Control Unit di un processore a ciclo multiplo

![Control unit diagram for a multi-cycle processor. It shows the Control Unit block with various control signals and their connections to the datapath components.](images/p102_fig02.png)

---

<!-- Pagina 103 -->

Quindi, proprio come nel processore a ciclo singolo, la Control Unit, in base ai campi COND, OP e FUNCT dell'istruzione:

- Calcola i valori giusti di tutti i flag in ogni fase dell'istruzione;
- Controlla se la destinazione è un registro o il Program Counter;
- Memorizza e aggiorna i valori dei flag nel CPSR;

Anche in un processore a ciclo multiplo, la Control Unit è suddivisa in Decoder e Conditional Logic.

Dato che la memoria centrale è utilizzata sia come Instruction Memory, sia come Data Memory, il valore di MemWrite, nelle differenti fasi dell'esecuzione di un'istruzione, deve essere impostato correttamente dalla CU (p.e. Fetch STR → MemWrite = 0, oppure Store STR → MemWrite = 1). A differenza del processore a ciclo singolo, nel quale, dato che l'istruzione era eseguita in un unico ciclo di clock, tutti i valori dei flag erano impostati una sola volta (dopo un certo ritardo), nel processore a ciclo multiplo, in ogni diversa fase dell'esecuzione di un'istruzione, la Control Unit deve impostare valori diversi (per fasi diverse) in tutti i flag.

![Detailed block diagram of the Control Unit architecture. It shows the Main FSM, PC Logic, ALU Decoder, and Instruction Decoder. The Main FSM has inputs Rd3,0...](images/p103_fig01.png)

### Decoder

La principale differenza tra la Control Unit di un processore a ciclo singolo e la Control Unit di un processore a ciclo multiplo è l'implementazione del Main Decoder. Esso, infatti, non può più essere implementato tramite un circuito combinatorio, ma deve essere implementato tramite un circuito che, in base allo stato in cui si trova l'esecuzione, restituisce dei valori in output diversi. Questa è proprio la definizione di una FSM di Moore che produce una sequenza di valori di controllo adatti per i flag ad ogni fase dell'istruzione.

![State transition diagram for the Main Decoder FSM. It consists of 9 states: S0 (Fetch), S1 (Decode), S2 (MemAdr), S3 (MemRead), S4 (MemWB), S5 (MemWrite), S6...](images/p103_fig02.png)

---

<!-- Pagina 104 -->

**COND**, per verificare quali sono gli stati del Main Decoder e quali sono gli output da restituire in base allo stato, occorre considerare il data flow del processore (solo per istruzioni LDR e STR), per vedere in ogni fase quali sono i valori dei flag che deve restituire il decoder:

**STATO S0: FETCH.** Indipendentemente dai valori di input, il primo stato di questa Moore FSM è lo stato S0. Inoltre, questo è anche lo stato di RESET.

- **AdrSrc = 0** perché l'indirizzo dell'istruzione da eseguire proviene dal Program Counter;
- **IRWrite = 1** perché la parola di 32 bit dell'istruzione da eseguire deve essere memorizzata nell'Instruction Register;
- **AGGIORNAMENTO DI PC A PC+4: ALUSrcA = 1** per prendere il valore del *Program Counter*;
- **ALUSrcB = 10** perché al valore di PC si deve sommare 4;
- **ALUOp = 0** perché non si sta eseguendo un'istruzione di Data Processing;
- **ResultSrc = 10** perché il risultato dell'ALU, ovvero PC+4, deve andare direttamente in R15;
- **NextPC = 1** è l'output che deve passare prima per la logica condizionale e indica se l'indirizzo della prossima istruzione è PC+4;

**STATO S1: DECODE.** Indipendentemente dai valori degli input, a partire dallo stato S0, si passa a questo stato S1.

- **ALUOp = 0** perché non si sta eseguendo un'istruzione di Data Processing;
- **ALUSrcA = 1** per prendere il valore corrente del Program Counter, cioè PC+4;
- **ALUSrcB = 10** perché al valore di PC+4 si deve sommare 4;
- **ResultSrc = 10** perché il risultato dell'ALU, ovvero PC+8, deve andare direttamente in R15;

**STATO S2: EXECUTE** (calcolo dell'indirizzo di memoria in cui leggere/scrivere il dato). La logica di prossimo stato ha come input il campo OP dell'istruzione uguale a 01 (istruzione di memoria).

- **ALUSrcA = 0** perché si deve recuperare il contenuto del registro indicato dal base address;
- **ALUSrcB = 01** perché al contenuto del base address si deve sommare l'immediate offset;
- **ALUOp = 0** perché non si sta eseguendo un'istruzione di Data Processing (l'ALU decoder restituisce ALUControl = 00 in modo da eseguire la somma nell'ALU);

**STATO S3: EXECUTE** (si utilizza l'indirizzo calcolato dall'ALU per leggere il dato in memoria). La logica di prossimo stato ha come input il bit FUNCT0 = 1 che indica l'esecuzione di un'istruzione LDR.

- **ResultSrc = 00** perché si deve recuperare l'indirizzo calcolato dall'ALU dal registro ALUOp;
- **AdrSrc = 1** perché l'indirizzo nell'ingresso A della memoria proviene dal registro ALUOut e non dal Program Counter;

**STATO S4: STORE.** Indipendentemente dai valori degli input, a partire dallo stato S3, si passa a questo stato S4 e si prosegue con la fase di STORE di un LDR.

- **ResultSrc = 01** perché il contenuto memorizzato nel registro Data deve essere memorizzato nel Register File al registro indicato dall'indirizzo nel campo Rd dell'istruzione;
- **RegW = 1** perché deve essere abilitata la scrittura nel Register File (questo output passa prima nella logica condizionale e, se e solo se la condizione è verificata, RegWrite = 1);
- L'esecuzione dell'istruzione LDR è completata e, quindi, indipendentemente dagli input, si ritorna allo stato S0, cioè il FETCH della prossima istruzione;

**STATO S5: STORE** (si utilizza l'indirizzo calcolato dall'ALU per scrivere il dato in memoria). La logica di prossimo stato ha come input il bit FUNCT0 = 0 che indica l'esecuzione di un'istruzione STR.

- **ResultSrc = 00** perché si deve recuperare l'indirizzo calcolato dall'ALU dal registro ALUOp;
- **AdrSrc = 1** perché l'indirizzo nell'ingresso A della memoria proviene dal registro ALUOut e non dal Program Counter;
- **MemW = 1** perché deve essere abilitata la scrittura in memoria (questo output passa prima nella logica condizionale e, se e solo se la condizione è verificata, MemWrite = 1);
- L'esecuzione dell'istruzione STR è completata e, quindi, indipendentemente dagli input, si ritorna allo stato S0, cioè il FETCH della prossima istruzione.

Gli stati che descrivono come la Control Unit deve restituire gli output dei flag al datapath per istruzioni di Data Processing e Branch (S6, S7, S8, S9) sono molto simili agli stati precedenti.

---

<!-- Pagina 105 -->

### **Analisi delle prestazioni di processore a ciclo multiplo**

Rispetto ad un processore a ciclo singolo, dove il numero di CPI è sempre lo stesso per ogni istruzione, ovvero 1, in un processore a ciclo multiplo istruzioni diverse hanno un numero di CPI diverso. In particolare, un'istruzione di Branch viene eseguita in 3 cicli di clock, le istruzioni di data-processing e di store sono eseguite in 4 cicli, mentre un'istruzione di load è eseguita in 5 cicli.

Quindi, in questo caso, l'analisi delle prestazioni di un processore a ciclo multiplo non dipende solo dal numero di istruzioni e dai ritardi che occorrono ai circuiti combinatori e componenti circuitali per eseguire un'intera istruzione (come visto nel processore a ciclo singolo), ma anche da come sono distribuite le istruzioni da eseguire.

Nel benchmark SPECINT2000, dove si ha il 25% di LDR, il 10% di STR, il 13% di B e il 52% di istruzioni di data-processing, il numero medio di cicli per istruzioni è dato da:

$$
CPI_{medio} = (perc.B) * (cicli B) + (perc.STR + perc.DP) * (cicli STR e DP) + (perc.LDR) * (cicli LDR) =
$$

$$
CPI_{medio} = 0.13 * 3 + (0.52 + 0.10) * 4 + 0.25 * 5 = 0.39 + 2.48 + 1.25 = 4.12
$$

In un processore a ciclo multiplo, in ogni ciclo di clock si esegue una fase diversa dell'istruzione che coinvolgono sempre l'ALU e una lettura/scrittura in memoria oppure nel Register File. Sapendo che il Register File è più veloce della memoria e che una scrittura in memoria è più veloce di una lettura, è possibile identificare due path critici che hanno il tempo del ciclo di clock più lungo:

1. Dal Program Counter al multiplexer ALUSrcA, proseguendo con il risultato dell'ALU che passa per il multiplexer ResultSrc, fino al registro R15 del Register File e all'ingresso A della memoria;
2. Dal registro ALUOut, il cui contenuto passa per i multiplexer ResultSrc e ADR, utili alla lettura in memoria del dato che viene poi salvato nel registro Data.

Questo tempo di ciclo di clock è pari a:

$$
T_c = t_{PCq} + 2t_{mux} + \max[t_{ALU} + t_{mux}; t_{mem}] + t_{setup} = 40 + 2 * 25 + 200 + 50 = 340ps
$$

- $t_{PCq}$  è il tempo per caricare un indirizzo di memoria nel Program Counter;
- $t_{mux}$  è il tempo che occorre ad un multiplexer per selezionare il valore in ingresso da restituire;
- $t_{mem}$  è il tempo che occorre alla memoria per restituire l'istruzione a partire dall'indirizzo dato in input dal PC nella fase di FETCH;
- Sempre nella fase di FETCH, contemporaneamente alla lettura in memoria, avviene il calcolo di PC+4 che impiega un tempo pari a  $t_{ALU} + t_{mux}$ . Il tempo maggiore tra i due è quello da sommare a tutti gli altri valori nella formula (nella formula è stato scelto  $t_{mem}$ );
- $t_{setup}$  è il tempo che occorre alla Control Unit per impostare tutti i valori dei flag ad ogni ciclo.

Riproponendo lo stesso esempio, il tempo impiegato da un processore a ciclo multiplo per l'esecuzione di un programma con 100 miliardi di istruzioni è (maggiore):

$$
T. di esecuzione = \#istruzioni \times \left( \frac{cicli}{istruzione} \right) \times \left( \frac{secondi}{ciclo} \right) = 100 \times 10^9 \times 4.12 \times 340 \times 10^{-12} sec = 140,08 sec
$$

### **Considerazioni finali**

Abbiamo visto che il tempo per eseguire un programma di 100 miliardi di istruzioni è di 84 secondi grazie ad un processore a ciclo singolo e di 140 secondi grazie ad un processore a ciclo multiplo. Da un lato, nel processore a ciclo multiplo i tempi di setup della Control Unit si ripetono ad ogni fronte di salita del clock, a differenza del processore a ciclo singolo in cui questo tempo si calcola una volta per ogni istruzione, ovvero una volta per ogni ciclo. D'altro canto, però, uno dei grandi vantaggi del processore a ciclo multiplo è l'utilizzo di una singola memoria per le istruzioni e per i dati (più realistico e più flessibile, soprattutto per il multitasking), ma anche la suddivisione delle istruzioni in quattro fasi principali in modo da poterle eseguire in pipeline. La Control Unit pilota dei semafori per arrestare o meno l'esecuzione di queste fasi, p.e.:

- È inutile eseguire il calcolo di PC+4 se la prossima istruzione è un branch;
- Bisogna aspettare che ADD R0, R1, R2 completi la sua esecuzione prima di eseguire SUB R4, R0, R6, altrimenti il valore contenuto in R0 sarebbe quello precedente alla fase di STORE dell'ADD.

Questo tipo di problemi sono principalmente risolti nelle microarchitetture di processori con pipeline.

---

<!-- Pagina 107 -->

# Architettura

Per poter descrivere a pieno la microarchitettura ARM, abbiamo dovuto per forza introdurre alcuni concetti connessi all'architettura come:

- Definizione
- Linguaggio ARM Assembly e codifica delle principali istruzioni in linguaggio macchina
  - Istruzioni di Memoria
  - Istruzioni di Data-processing
  - Istruzioni di Branching
- Indirizzamento degli operandi da registri o da costanti (immediates)

Per riassumere brevemente, ricordiamo che i registri del Register File sono fisicamente equivalenti, ma, dal punto di vista logico hanno il seguente uso:

<table border="1"><thead><tr><th>Nome del registro</th><th>Utilizzo</th></tr></thead><tbody><tr><td>R0</td><td>Variabile temporanea che può anche non essere salvata in memoria<br/>Argomento di una chiamata a funzione<br/>Valore di ritorno di una funzione</td></tr><tr><td>R1-R3</td><td>Argomento di una chiamata a funzione<br/>Valore di ritorno di una funzione</td></tr><tr><td>R4-R11</td><td>Saved Variables: variabili utilizzate per conservare i valori precedenti di variabili passate in una funzione, prima che siano sovrascritti</td></tr><tr><td>R12</td><td>Variabile temporanea che può anche non essere salvata in memoria</td></tr><tr><td>R13</td><td>Stack Pointer (SP)</td></tr><tr><td>R14</td><td>Link Register (LR)</td></tr><tr><td>R15</td><td>Program Counter (PC)</td></tr></tbody></table>

È possibile definire le costanti tramite l'istruzione in ARM Assembly MOV:

- Dato che MOV è un'istruzione di data-processing, questa permette di definire solo costanti a 8 bit perché il campo imm8 in un'istruzione DP è costituito da 8 bit (MOV R1, #0x45);
- L'istruzione MOV può anche essere utilizzata per copiare il contenuto di un registro in un altro registro (MOV R7, R9);
- Se c'è la necessità di memorizzare costanti che richiedono un numero di bit maggiore a 8 per poter essere rappresentate, in ARM Assembly si utilizzano le istruzioni MOV (con rotazione a destra della costante) e ORR (bit a bit). Ad esempio:

<table border="1"><thead><tr><th>Codice C</th><th>Codice ARM Assembly</th></tr></thead><tbody><tr><td>int a = 0x7EDC8765</td><td>MOV R0, #0x7E000000<br/>ORR R0, R0, #0xDC0000<br/>ORR R0, R0, #0x8700<br/>ORR R0, R0, #0x65</td></tr></tbody></table>

- Esecuzione condizionata delle istruzioni

---

<!-- Pagina 108 -->

### Istruzioni condizionali in ARM Assembly

Le istruzioni condizionali come if, if-else, e switch-case sono utilizzate nei linguaggi di programmazione di alto livello per riuscire a controllare il flusso di esecuzione di un programma. Vediamo come si traducono questi costrutti di alto livello in ARM Assembly.

#### If e If-else

Un'istruzione If permette di eseguire o meno un blocco di istruzioni, detto if block, se e solo se si rispetta la condizione dettata dall'if stesso. Ad esempio:

<table border="1"><thead><tr><th>Codice C</th><th>Codice ARM Assembly</th></tr></thead><tbody><tr><td><pre>if (i == j)
    f = g + h;

f = f - i;</pre></td><td><pre>; R0 = f, R1 = g, R2 = h, R3 = i, R4 = j

CMP R3, R4 ; aggiorna i flag del CPSR con R3-R4
BNE L1 ; se i ≠ j, non eseguire l'if block
ADD R0, R1, R2 ; f = g + h (if block)

L1
SUB R0, R0, R3 ; f = f - i</pre><p>In questo caso, si utilizza un'istruzione di branch condizionata per passare al blocco if (etichettata da un mnemonico). La condizione che viene verificata è l'opposta da quella dichiarata nel linguaggio di alto livello.</p></td></tr><tr><td><pre>if (i == j)
    f = g + h;

f = f - i;</pre></td><td><pre>; R0 = f, R1 = g, R2 = h, R3 = i, R4 = j

CMP R3, R4 ; aggiorna i flag del CPSR con R3-R4
ADDEQ R0, R1, R2 ; se i = j, allora esegui l'if block f = g + h
SUB R0, R0, R3 ; f = f - i</pre><p>Questa alternativa è preferibile perché l'if block è composto da una sola istruzione. Nel caso di più istruzioni, invece, è preferibile l'utilizzo di un branch (p.e. if annidati).</p></td></tr><tr><td><pre>if (i == j)
    f = g + h;

else
    f = f - i;

...</pre></td><td><pre>; R0 = f, R1 = g, R2 = h, R3 = i, R4 = j

CMP R3, R4 ; aggiorna i flag del CPSR con R3-R4
BNE L1 ; se i ≠ j, allora non eseguire l'if block
ADD R0, R1, R2 ; f = g + h (if block)
BL2 ; dato che è stato eseguito l'if block, non eseguire l'else block

L1
SUB R0, R0, R3 ; f = f - i

L2
...</pre></td></tr><tr><td><pre>if (i == j)
    f = g + h;

else
    f = f - i;

...</pre></td><td><pre>; R0 = f, R1 = g, R2 = h, R3 = i, R4 = j

CMP R3, R4 ; aggiorna i flag del CPSR con R3-R4
ADDEQ R0, R1, R2 ; se i = j, allora esegui l'if block f = g + h
SUBNE R0, R0, R3 ; se i ≠ j, allora esegui l'else block f = f - i</pre><p>Anche in questo caso, dato che l'if block e l'else block sono costituiti da un'unica istruzione, è preferibile non utilizzati i branch, ma direttamente delle istruzioni condizionate.</p></td></tr></tbody></table>

---

<!-- Pagina 109 -->

### While

Le istruzioni iterative permettono di eseguire un blocco di codice ripetutamente in base ad una specifica condizione. Ad esempio:

<table border="1">
<thead>
<tr>
<th>Codice C</th>
<th>Codice ARM Assembly</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<pre>//determina l'esponente x
//tale che 2^x = 128 (x = 7)

int pow = 1;
int x = 0;

while (pow != 128){
    pow = pow * 2;
    x = x + 1;
}

...</pre>
</td>
<td>
<pre>; R0 = pow, R1 = x
MOV R0, #1 ; pow = 1 (non è necessario l'utilizzo di ORR)
MOV R1, #0 ; x = 0

WHILE
    CMP R0, #128 ; aggiorna il flag del CPSR con R0-128
    BEQ DONE ; se pow = 128, allora non eseguire il while

    LSL R0, R0, #1 ; se pow ≠ 128, allora moltiplica "pow" per 2 tramite un LSL
    ADD R1, R1, #1 ; dopodiché aumenta il valore di x di 1
    B WHILE ; ripeti il while

DONE
...</pre>
<p>Il blocco <b>while</b> è etichettato dal mnemonico <b>WHILE</b>. Si utilizza un'istruzione di <b>branch</b> condizionata per uscire dal ciclo e un'istruzione di <b>branch</b> incondizionata per ripetere il while. Anche in questo caso, la condizione che viene verificata è l'opposta da quella dichiarata nel linguaggio di alto livello.</p>
</td>
</tr>
</tbody>
</table>

### For

L'istruzione for è un'istruzione iterativa che permette di eseguire un blocco di istruzioni un certo numero di volte prestabilito. Ha il seguente formato:

```
for (inizializzazione; condizione; operazione del ciclo)
    blocco di istruzioni
```

- **INIZIALIZZAZIONE**: operazione eseguita prima che il ciclo for inizi;
- **CONDIZIONE**: condizione di continuazione che deve essere verificata all'inizio di ogni ciclo. Se è vera, allora il ciclo prosegue, altrimenti si interrompe;
- **OPERAZIONE DEL CICLO**: operazione eseguita al termine di ogni ciclo;
- **BLOCCO DI ISTRUZIONI**: il blocco di istruzioni che deve essere eseguito ad ogni ciclo, finché la condizione è verificata.

<table border="1">
<thead>
<tr>
<th>Codice C</th>
<th>Codice ARM Assembly</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<pre>//somma dei primi 9
//numeri naturali

int sum = 0;

for (int i = 9; i != 0; i = i - 1)
    sum = sum + i;

...</pre>
</td>
<td>
<pre>; R0 = i, R1 = sum
MOV R0, #1 ; i = 1
MOV R1, #0 ; sum = 0

FOR
    CMP R0, #10 ; aggiorna il flag del CPSR con R0-10
    BEQ DONE ; se i = 10, allora non eseguire il for

    ADD R1, R1, R0 ; se i ≠ 10, allora esegui la somma tra "sum" e 'i'
    ADD R0, R0, #1 ; esegui l'operazione del ciclo i = i - 1
    B FOR ; ripeti il ciclo for

DONE
...</pre>
</td>
</tr>
</tbody>
</table>

---

<!-- Pagina 110 -->

```
//somma dei primi 9
//numeri naturali

int sum = 0;

for (int i = 9; i != 0; i = i - 1)
    sum = sum + i;
```

...

```
; R0 = i, R1 = sum
MOV R0, #9; i = 9
MOV R1, #0; sum = 0
```

FOR

```
ADD R1, R1, R0; eseguis la somma tra "sum" e 'i'
SUBS R0, R0, #1; esegui l'operazione del ciclo i = i - 1 e aggiorna i
flag del CPSR
```

```
BNE FOR; se i ≠ 0, allora ripeti il ciclo for
```

...

In ARM Assembly, i loop decrescenti fino a 0 sono più efficienti in quanto richiedono un numero minore di istruzioni per essere codificati. Come si può notare, non è presente l'istruzione "BEQ DONE" che termina il ciclo e non è presente l'istruzione CMP che è sostituita dall'istruzione SUBS, che aggiorna i flag di stato e il valore di 'i' contemporaneamente.

### Arrays in ARM Assembly

Un array è un tipo di dato composto che permette di accedere ad un certo set di dati omogenei (stesso tipo). È caratterizzato da un indice che consente l'accesso al singolo elemento dell'array e da una dimensione che corrisponde al numero di possibili elementi memorizzabili in esso. A basso livello, un array è definito da un base address, ovvero l'indirizzo del primo elemento dell'array e tutti gli altri elementi sono raggiungibili a partire proprio dal base address (p.e. base address di scores[0] = 0x14000000 → indirizzo di scores[3] = 0x1400000C dato che l'array è composto da parole di 32 bit, cioè 4 byte). Esaminiamo l'algebra dei puntatori a basso livello:

<table border="1">
<thead>
<tr>
<th>Codice C</th>
<th>Codice ARM Assembly</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<pre>int array[5];
array[0] = array[0] * 8;
array[1] = array[1] * 8;</pre>
</td>
<td>
<pre>; R0 = array base address, R1 = variabile temporanea
MOV R0, #0x60000000; questo è l'indirizzo di base dell'array (primo
elemento) dato dal sistema operativo
LDR R1, [R0]; carica il dato dall'indirizzo di memoria R0 nel registro dest. R1
LSL R1, R1, 3; moltiplica per 8 il contenuto di R1
STR R1, [R0]; memorizza il dato del registro sorg. R1 nell'indirizzo di memoria R0
LDR R1, [R0, #4]; carica il dato dall'indirizzo di memoria R0+4 (prossimo
elemento dell'array) nel registro dest. R1
LSL R1, R1, 3; moltiplica per 8 il contenuto di R1
STR R1, [R0, #4]; memorizza il dato del registro sorg. R1 nell'indirizzo di
memoria R0+4
(ATTENZIONE: in questo esempio non si è inizializzato l'array, quindi
ciò che si va a moltiplicare per 8 è un valore sporco). Nel caso in cui
l'array è di tipo char, il compilatore utilizza la funzione LDRB e STRB,
dato che il tipo char utilizza parole di 8 bit, cioè 1 byte.</pre>
</td>
</tr>
</tbody>
</table>

---

<!-- Pagina 111 -->

```
int array[200];
int i;
for (i=199;i>=0;i=i-1)
    array[i] = array[i] * 8
```

; R0 = array base address, R1 = i

**MOV R0, #0x60000000**; questo è l'indirizzo di base dell'array (primo elemento) dato dal sistema operativo

**MOV R1, #199**; **inizializzazione di i**

**FOR**

**LDR R2, [R0, R1, LSL #2]**; **caricamento dall'indirizzo di memoria dato dalla somma di R0 + R1 * 4 nel registro destinazione R2**

**LSL R2, R2, #3**; **moltiplicazione di R2 per 8**

**STR R2, [R0, R1, LSL #2]**; **memorizzazione del contenuto del registro sorgente R2 all'indirizzo di memoria dato dalla somma di R0 + R1 * 4 nel registro destinazione R2**

**SUBS R1, R1, #1**; **il valore di i decrementa di 1 e si aggiornano i flag di stato**

**BPL FOR**; **continua ad eseguire il ciclo se la differenza tra i e l è positiva o uguale a 0 (PL = Plus / Positive or zero)**

### Chiamate a funzione in ARM Assembly

Nei linguaggi di alto livello, spesso si utilizzano le funzioni per rendere il programma più modulare, robusto e leggibile. Le funzioni hanno sia input, detti argomenti, che un solo output, detto valore di ritorno. In particolare, **distinguiamo**:

- **CALLER**: la funzione dal quale si chiama un'altra funzione. Il compito del caller è quello di passare gli argomenti al callee e, poi, eseguire un "jump" al callee;
- **CALLEE**: la funzione che viene chiamata da un'altra funzione. Il compito del callee è quello di eseguire la funzione chiamata, dopodiché ritornare un risultato al caller, ed infine ritornare al punto dell'esecuzione in cui il caller ha chiamato il callee. Inoltre, **non deve ASSOLUTAMENTE sovrascrivere i saved register R4-R11 e le porzioni di memoria usate dal caller.**

In ARM Assembly, la chiamata a funzione avviene tramite un'istruzione di *branch and link* (BL), ovvero un'istruzione di branch che **permette di eseguire un'istruzione ad un indirizzo diverso da PC+4** che, però, esegue anche la memorizzazione del corrente PC+4 nel registro R14 (Link Register). Una volta terminata l'esecuzione del callee, si ritorna al caller tramite l'istruzione **MOV PC, LR**.

In ARM Assembly, per convenzione, le funzioni callee utilizzano i registri R0-R3 come argomenti e il registro R0 come valore di ritorno (**se servono più di quattro argomenti si utilizza lo stack**).

<table border="1">
<thead>
<tr>
<th>Codice C</th>
<th>Codice ARM Assembly</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<pre>
void main(){
    int y;
    y = sum(42, 7);
    ...
} → CALLER

int sum(int a, int b){
    return a+b;
} → CALLEE
</pre>
</td>
<td>
<p><b>Indirizzo:</b></p>
<p><b>; R2 = y</b></p>
<p><b>MAIN</b></p>
<p>0x00000200 <b>MOV R0, #42</b></p>
<p>0x00000204 <b>MOV R1, #7</b></p>
<p>0x00000208 <b>BL SUM</b></p>
<p>0x0000020C <b>MOV R2, R0</b></p>
<p><b>SUM</b></p>
<p>0x00401020 <b>ADD R3, R0, R1</b></p>
<p>0x00401024 <b>MOV R0, R3</b></p>
<p>0x00401028 <b>MOV PC, LR</b></p>
<p>...</p>
</td>
</tr>
</tbody>
</table>

---

<!-- Pagina 112 -->

```
int main() {
    int y;
    y = diffofsums(2, 3, 4, 5);
    ...
} → CALLER

int diffofsums(int f, int g, int h, int i){
    int result;
    result = (f + g) - (h + i);
    return result;
} → CALLEE
```

<table border="0">
<tr>
<td>Indirizzo:</td>
<td></td>
</tr>
<tr>
<td></td>
<td>; R4 = y, R0 = f, R1 = g, R2 = h, R3 = i</td>
</tr>
<tr>
<td>0x00000200</td>
<td>MOV R0, #2; <b>inizializzazione dei parametri</b></td>
</tr>
<tr>
<td>0x00000204</td>
<td>MOV R1, #3</td>
</tr>
<tr>
<td>0x00000208</td>
<td>MOV R2, #4</td>
</tr>
<tr>
<td>0x0000020C</td>
<td>MOV R3, #5</td>
</tr>
<tr>
<td>0x00000210</td>
<td>BL DIFFOFSUMS; <b>chiamata a funzione e salvataggio di 0x00000214</b></td>
</tr>
<tr>
<td>0x00000214</td>
<td>MOV R4, R0; <b>salvataggio del valore di ritorno (R0) in y (R4)</b></td>
</tr>
<tr>
<td>...</td>
<td></td>
</tr>
<tr>
<td>0x00401020</td>
<td><b>DIFFOFSUMS</b></td>
</tr>
<tr>
<td>0x00401024</td>
<td>ADD R8, R0, R1; R8 = f + g</td>
</tr>
<tr>
<td>0x00401028</td>
<td>ADD R9, R2, R3; R9 = h + i</td>
</tr>
<tr>
<td>...</td>
<td>SUB R4, R8, R9; R4 = (f+g) - (h+i)</td>
</tr>
<tr>
<td></td>
<td>MOV R0, R4; <b>il valore di ritorno è salvato in R0</b></td>
</tr>
<tr>
<td></td>
<td>MOV PC, LR; <b>il valore 0x00000214 nel registro LR viene copiato in PC in modo tale che sia la prossima istruzione da eseguire</b></td>
</tr>
</table>

Questo tipo di traduzione a basso livello delle chiamate a funzione ha un difetto: la funzione callee DIFFOFSUMS utilizza, per eseguire i calcoli temporanei, i registri saved variables (R4-R11), ovvero quei registri che la funzione caller non vuole essere modificati dalla funzione callee, e quindi, non sta rispettando l'obbligo dato dalla funzione caller. Per evitare questa situazione, la funzione callee dovrebbe usare lo stack della memoria per memorizzare temporaneamente i valori dei registri saved variables (push) prima di andare a modificarli e, quindi, ripristinare questi valori prima di ritornare alla funzione chiamante (pop). Ovviamente, questo stack di memoria deve essere conservato in una porzione di memoria che non è già utilizzata da altre funzioni.

## Stack

Lo stack è una porzione di memoria centrale adibita al salvataggio e al ripristino di informazioni utilizzate da una funzione, in particolare i valori dei registri Saved Variables. Lo stack è organizzato come una struttura Last-In-First-Out (LIFO), ovvero una pila. Le operazioni che è possibile eseguire sullo stack sono:

- PUSH: permette di inserire nuovi elementi nello stack, quindi espande la dimensione in memoria della pila (expands);
- POP: permette di recuperare elementi dallo stack, quindi contrae la dimensione in memoria della pila (contracts).

Il primo elemento della pila, detto testa, rappresenta il dato memorizzato nello stack più recentemente. Ogni funzione che alloca spazio per espandere lo stack, deve, prima che la funzione ritorni il suo valore, deallocare tutto lo spazio che allocato precedentemente.

Nell'architettura ARM, il registro R13 Stack Pointer (SP) è adibito, per convenzione, a puntare alla testa della pila, ovvero conserva l'indirizzo in memoria centrale di tale dato. In particolare, lo Stack Pointer utilizza un indirizzamento "decrescente", ovvero inizia l'indirizzamento da indirizzi di memoria alti e, poi, per espandere lo stack, decrementa il valore degli indirizzi.

Quindi, per risolvere il difetto della funzione DIFFOFSUMS (utilizza registri Saved Variables), si seguono questi passi specifici:

PC+4

appuntiementi studenti.com

---

<!-- Pagina 113 -->

1. **Allocare** spazio in memoria per memorizzare i valori di uno più registri, tramite un'operazione di SUB SP, SP #of, poiché lo stack pointer utilizza un indirizzamento "decrescente" (#of = offset). Lo stack frame è la porzione di memoria adibita alla memorizzazione di valori da parte del callee.
2. **Memorizzare** i valori dei registri (che serviranno successivamente per la funzione) **nello stack**, attraverso un'operazione di STR Rs, [SP, #of] (Rs = Registro sorgente, #of = offset);
3. **Eseguire** la funzione utilizzando i registri (il loro valore originale è stato salvato nello stack);
4. **Ripristinare** i valori originali dei registri che sono salvati nello stack, grazie ad un'operazione di LDR Rd, [SP, #of] (Rd = Registro destinazione, of = offset);
5. **Deallocare** lo stack frame del callee, con un'operazione di ADD SP, SP #of (#of = l'offset è lo stesso di quello usato nell'istruzione SUB);
6. **Effettuare** il ritorno alla funzione caller utilizzando l'istruzione MOV PC, LR.

<table border="1">
<thead>
<tr>
<th>Codice C</th>
<th>Codice ARM Assembly</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<pre>int main() {
    int y;
    y = diffofsums(2, 3, 4, 5);
    ...
} → CALLER</pre>
</td>
<td>
<p>Indirizzo:</p>
<pre>
; R4 = y
MAIN
0x00000200  MOV R0, #2 ; inizializzazione dei parametri
0x00000204  MOV R1, #3
0x00000208  MOV R2, #4
0x0000020C  MOV R3, #5
0x00000210  BL DIFFOFSUMS ; chiamata a funzione e
                          salvataggio di 0x00000214</pre>
</td>
</tr>
<tr>
<td>
<pre>int diffofsums(int f, int g, int h, int i){
    int result;
    result = (f + g) - (h + i);
    return result;
} → CALLEE</pre>
</td>
<td>
<pre>
0x00000214  MOV R4, R0 ; salvataggio del valore di
                          ritorno (R0) in y (R4)
...

DIFFOFSUMS
0x00401020  SUB SP, SP, #12
0x00401024  STR R4, [SP]
0x00401028  STR R8, [SP, #4]
0x0040102C  STR R9, [SP, #8]
0x00401030  ADD R8, R0, R1 ; R8 = f + g
0x00401034  ADD R9, R2, R3 ; R9 = h + i
0x00401038  SUB R4, R8, R9 ; R4 = (f+g) - (h+i)
0x0040103C  MOV R0, R4 ; il valore di ritorno è salvato in R0
0x00401040  LDR R9, [SP, #8]
0x00401044  LDR R8, [SP, #4]
0x00401048  LDR R4, [SP]
0x0040104C  ADD SP, SP, #12
0x00401050  MOV PC, LR ; il valore 0x00000214 nel
                          registro LR viene copiato in PC in modo tale
                          che sia la prossima istruzione da eseguire
...
</pre>
</td>
</tr>
</tbody>
</table>

Così facendo, la funzione DIFFOFSUMS modifica e ritorna solo il valore di R0, mentre i valori dei registri R4, R8, R9, dopo esser stati usati come variabili temporanee, sono stati ripristinati al loro valore originale (cioè i valori precedenti alla chiamata a funzione del caller).

![Diagram showing memory stack frames before, during, and after a function call. It illustrates the allocation of a stack frame, the saving of registers R4, R8...](images/p113_fig01.png)

appuntiofcinastudenti.com

---

<!-- Pagina 114 -->

L'architettura ARM suddivide i registri in *preserved* e *nonpreserved*:

- **PRESERVED**: sono quei registri che **possono essere modificati liberamente dalla funzione chiamante**. È compito della funzione chiamata (callee-saved) salvare i valori di questi registri, in modo che il callee rispetti l'obbligo di non modificare i registri usati dal caller. I registri preserved sono:
  - Saved Variables R4-R11 (utilizzate per memorizzare variabili locali);
  - Link Register R14 (nel caso in cui ci sono più chiamate a funzione innestate, bisogna sempre sapere il valore dell'indirizzo di memoria a cui ritornare);
  - Stack Pointer R13;
  - Tutte le locazioni in memoria centrale con indirizzo superiore allo Stack Pointer (in modo da non modificare lo stack di altre funzioni);
- **NONPRESERVED**: sono quei registri che **possono essere modificati liberamente dalla funzione chiamata**. È compito della funzione chiamante (caller-saved) salvare i valori di questi registri, se si vuole che non siano modificati. I registri nonpreserved sono:
  - Registro R12 (temporaneo);
  - Registri R0-R3 (argomenti);
  - Current Program Status Register;
  - Tutte le locazioni in memoria centrale con indirizzo inferiore allo Stack Pointer;

**Pop e Push** LI USIAMO PER NON SPORCAR E I VALORI

Tutte queste operazioni di STR e LDR da parte della funzione callee al fine di memorizzare i valori dei registri preserved nello stack pointer sono delle routine molto presenti in un programma in ARM Assembly. Proprio per questo motivo, esistono delle istruzioni "leggermente più di alto livello" che consentono di riassumere in un'unica istruzione i LDR e STR nello stack pointer: POP e PUSH. Queste istruzioni prendono come argomenti uno o più registri da inserire (push) o estrarre (pop) nello/dallo stack pointer e sono tradotte in linguaggio macchina in tante istruzioni singole di STR e LDR con base address SP quanti sono i registri argomenti della funzione pop/push.

### Chiamate a funzioni innestate

<table border="1"><thead><tr><th>Codice C</th><th>Codice ARM Assembly</th></tr></thead><tbody><tr><td><pre>int F1 (int a, int b){
    int i, x;
    x = (a+b) * (a-b);
    for (i=0; i &lt; a; i++){
        x = x + F2 (b+i);
    }
    return x;
} → funzione NONLEAF, una
funzione che a sua volta
chiamata un'altra funzione</pre></td><td><pre>; R0 = a, R1 = b, R4 = i, R5 = x ; R0 = p, R4 = r
F1                                F2
    PUSH { R4, R5, LR }          PUSH { R4 }
    ADD R5, R0, R1               ADD R4, R0, #5
    SUB R12, R0, R1              ADD R0, R4, R0
    MUL R5, R5, R12              POP { R4 }
    MOV R4, #0                   MOV PC, LR

FOR
    CMP R4, R0
    BGE RETURN
    PUSH { R0, R1 }
    ADD R0, R1, R4
    BL F2
    ADD R5, R5, R0
    POP { R0, R1 }
    ADD R4, R4, #1
    B FOR

RETURN
    MOV R0, R5
    POP { R4, R5, LR }
    MOV PC, LR</pre></td></tr></tbody></table>

---

<!-- Pagina 115 -->

## Analisi del codice

Supponiamo che  $R0 = a$ ,  $R1 = b$ ,  $R4 = i$ , e  $R5 = x$ . Dato che  $R4$  e  $R5$  sono Saved Variables, la prima cosa che bisogna fare è un PUSH di questi due elementi nello stack pointer per salvare i loro valori originali e, quindi, poterli utilizzare per i calcoli successivi.

Inoltre, nell'operazione di PUSH, la funzione chiamata  $F1$  deve anche salvare il valore di LR. Questo perché sicuramente la funzione  $F1$  è stata chiamata da un'altra funzione (p.e. main) tramite un BL e, siccome la funzione  $F1$  è a sua volta la funzione chiamante di  $F2$  (quindi, LR dovrà essere aggiornato), è necessario che in questo PUSH  $F1$  salvi anche il valore originale di LR prima di "sporcarlo con altri valori". Infatti, le istruzioni BL utilizzano sempre lo stesso registro LR. È necessario salvare questo valore al fine di non perdere il punto di ritorno alla funzione chiamante. Dopodiché, si prosegue con l'esecuzione della funzione  $F1$  con  $R5=a+b$  e  $R12=a-b$  ed infine  $R5=R5*R12$  che corrisponde proprio all'istruzione " $x = (a+b) * (a-b)$ " nel linguaggio di alto livello. In particolare,  $R12$  non è un registro preserved, quindi non è compito della funzione chiamata provvedere al suo salvataggio in memoria (ma, eventualmente, della funzione chiamante).

Prima di iniziare le istruzioni corrispondenti al ciclo FOR di alto livello, si deve inizializzare  $i = 0$  tramite l'istruzione MOV  $R4, \#0$ . Quindi, si esegue l'istruzione in linguaggio assembly della condizione di continuazione, ovvero CMP  $R4, R0$ . Se quest'istruzione, aggiornando i flag di stato restituisce che  $R4 \geq R0$  (si verifica l'istruzione opposta, cioè  $\overline{N} \oplus \overline{V}$ ), allora non eseguire le istruzioni del ciclo, ma quelle dell'etichetta RETURN tramite l'istruzione BGE RETURN, dove abbiamo:

- la copia del valore temporaneo di  $x$  ( $R5$ ) nel valore di ritorno  $R0$ ;
- il ripristino dei valori precedenti di  $R4$ ,  $R5$ , LR tramite un'istruzione di POP;
- il ritorno alla funzione caller di  $F1$  grazie all'istruzione MOV PC, LR.

Nel caso opposto, non si esegue l'istruzione di branch e si prosegue con le istruzioni del ciclo. La prima istruzione è un PUSH  $\{ R0 \}$ :

- Siccome  $R0$  (non preserved) è l'unico registro adibito alla memorizzazione del valore di ritorno, la funzione chiamante vuole salvare il suo valore in modo tale che, quando viene chiamata la funzione  $F2$ , questa possa utilizzarlo per il suo valore di ritorno e senza che il valore precedente di  $R0$  sia "sporcato" (in  $F1$ :  $R0 = a$  è utilizzato per la condizione di continuazione);

Quindi, si prosegue con l'esecuzione delle istruzioni del ciclo effettuando  $R0 = b+i$  che deve essere passato come argomento della funzione  $F2$  (ovviamente  $R0$  può essere modificato perché il suo valore precedente è stato già salvato nello stack pointer). Quindi, l'istruzione successiva, un BL incondizionato, permette di passare all'esecuzione delle istruzioni all'etichetta  $F2$  e di salvare in LR il valore dell'indirizzo dell'istruzione successiva di  $F1$  (l'indirizzo dell'istruzione successiva nella funzione chiamante di  $F1$  è stato salvato nello stack pointer, quindi è possibile sovrascrivere LR).

La funzione  $F2$  utilizza come registri per variabili temporanee  $R0$  e  $R4$ .  $R0$  è stato già salvato nello stack pointer e viene utilizzato in  $F2$  proprio come argomento della funzione passato da  $F1$ . Invece,  $R4$  deve essere salvato nello stack pointer da parte della funzione chiamata  $F2$  con un PUSH (per evitare di sovrascrivere il suo valore precedente, ovvero 'i') prima di poterlo utilizzare come variabile per calcoli temporanei. Ovviamente, effettua le istruzioni richieste (due ADD) memorizzando il valore finale in  $R0$  che deve essere utilizzato come valore di ritorno della funzione. Quindi, ripristina il valore precedente di  $R4$  (cioè 'i') grazie ad un pop dallo stack pointer. La prossima istruzione da eseguire (ovvero  $R5 = x + F2(b+i)$ ) è quella successiva al BL, il cui indirizzo è indicato in LR. Quindi, per ritornare alla funzione chiamante  $F1$ , si utilizza l'istruzione MOV PC, LR.

Le ultime istruzioni da eseguire sono:

- il ripristino del precedente valore di  $R0$  che è stato sporcato durante l'esecuzione di  $F2$  tramite un'operazione di POP dallo stack pointer;
- l'operazione di incremento di  $i$ , ovvero ADD  $R4, R4, \#1$ ;
- un branch B alle istruzioni dell'etichetta FOR.

---

<!-- Pagina 116 -->

## Funzioni ricorsive in ARM Assembly

<table border="0">
<thead>
<tr>
<th style="text-align: center;">Codice C</th>
<th colspan="3" style="text-align: center;">Codice ARM Assembly</th>
</tr>
</thead>
<tbody>
<tr>
<td>//il fattoriale di n è una<br/>//produttoria da 1 a n<br/><code>int factorial(int n){<br/>    if (n ≤ 1) {<br/>        return 1;<br/>    }<br/>    else {<br/>        return (n * factorial(n-1));<br/>    }<br/>}</code></td>
<td style="vertical-align: top;">Indirizzo: ; R0 = n<br/><b>FACTORIAL</b><br/>0x8500     <b>PUSH {R0, LR} ; inserisci nello stack pointer i valori di n e Link Register (per conservare l'indirizzo di ritorno ad ogni chiamata ricorsiva)</b></td>
<td colspan="2"></td>
</tr>
<tr>
<td></td>
<td style="vertical-align: top;">0x8504     <b>CMP R0, #1 ; esegue la differenza R0-1 e aggiorna i flags</b><br/>0x8508     <b>BGT ELSE ; se R0 &gt; 1 (cond. opposta al linguaggio di alto livello), allora esegui il blocco else, altrimenti esegui il blocco if</b></td>
<td colspan="2"></td>
</tr>
<tr>
<td></td>
<td style="vertical-align: top;">0x850C     <b>MOV R0, #1 ; ritorna 1 in R0 (valore di ritorno)</b><br/>0x8510     <b>ADD SP, SP, #8 ; dealloca spazio nello stack pointer</b></td>
<td colspan="2"></td>
</tr>
<tr>
<td></td>
<td style="vertical-align: top;">0x8514     <b>MOV PC, LR ; ritorna alla funzione chiamante</b><br/><b>ELSE</b></td>
<td colspan="2"></td>
</tr>
<tr>
<td></td>
<td style="vertical-align: top;">0x8518     <b>SUB R0, R0, #1 ; decrementa il valore di n che deve essere passato come argomento</b><br/>0x851C     <b>BL FACTORIAL ; effettua una chiamata ricorsiva all'etichetta FACTORIAL salvando l'indirizzo della prossima istruzione in LR</b></td>
<td colspan="2"></td>
</tr>
<tr>
<td></td>
<td style="vertical-align: top;">0x8520     <b>POP {R1, LR} ; dopo aver terminato la ricorsione ripristina il valore di R0 in R1 e LR</b><br/>0x8524     <b>MUL R0, R1, R0 ; il valore di ritorno n (R0) è uguale a n * factorial(n-1), il cui valore è stato ripristinato da memoria</b></td>
<td colspan="2"></td>
</tr>
<tr>
<td></td>
<td style="vertical-align: top;">0x8528     <b>MOV PC, LR ; ritorna alla funzione chiamante</b></td>
<td colspan="2"></td>
</tr>
</tbody>
</table>

![Diagram showing stack pointer (SP) and link register (LR) values at different points in a recursive function call. The diagram is divided into three sections...](images/p116_fig01.png)

1. **BEFORE CALL:** Inizialmente, l'indirizzo di memoria a cui punta SP è BEFF0FF0, il valore di R0 è il numero n di cui si vuole ottenere il fattoriale e LR memorizza l'indirizzo di memoria dell'istruzione successiva alla chiamata a factorial nel caller;
2. **DURING CALL:** La prima istruzione da eseguire è PUSH {R0, LR}, quindi vengono memorizzati in memoria il valore attuale di LR (indirizzo dell'istruzione successiva nel caller) e R0 = 3. Dato che  $3 > 1$ , allora si esegue il blocco else dove  $R0 = R0 - 1 = 2$  e si richiama la funzione factorial(n-1) con il BL che aggiorna il valore di LR a 0x8520 (cioè l'istruzione successiva, POP). A questo punto R0 = 2 e LR = 0x8520 vengono memorizzati nello stack pointer con l'operazione di PUSH e, dato che  $2 > 1$ , allora si esegue di nuovo il blocco else dove  $R0 = R0 - 1 = 1$  e si richiama la funzione factorial(n-1) con il BL che aggiorna il valore di LR a 0x8520 (essendo una funzione ricorsiva, LR è aggiornato sempre allo stesso valore, ma comunque deve essere salvato nello stack pointer).

---

<!-- Pagina 117 -->

Ovviamente, come prima si esegue il PUSH dei valori correnti di  $R0 = 1$  e  $LR = 0x8520$  nelle locazioni di memoria in basso rispetto allo stack pointer, però, dato che  $1 \neq 1$ , allora non viene eseguito il blocco else, ma il blocco if. Qui viene ritornato in  $R0$  il valore 1, si dealloca lo spazio di memoria dallo stack pointer (tramite l'operazione ADD) e si ritorna alla funzione chiamante tramite l'istruzione MOV PC, LR che permette di eseguire, come prossima istruzione, quell'istruzione memorizzata all'indirizzo in LR, cioè  $0x8520$ ;

1. **AFTER CALL:** Viene eseguita l'istruzione POP che ripristina il valore di  $R0 = 2$  in  $R1$  e l'indirizzo di memoria della prossima istruzione da eseguire in LR ( $0x8520$ ). Il valore del prodotto tra  $R1=2$  e  $R0=1$  viene memorizzato in  $R0$  come valore di ritorno e tramite l'istruzione MOV PC, LR si esegue, come prossima istruzione, quell'istruzione memorizzata all'indirizzo in LR, cioè  $0x8520$  (ripristinato dal POP). Ricorsivamente, si ripristinano i valori di  $R0 = 3$  in  $R1$  e LR (indirizzo dell'istruzione successiva alla chiamata del chiamante di factorial) grazie all'istruzione POP. Il valore del prodotto tra  $R1=3$  e  $R0=2$  (valore di ritorno del secondo passo) viene memorizzato in  $R0$  come valore di ritorno e tramite l'istruzione MOV PC, LR si ritorna alla funzione chiamante di factorial.

Come abbiamo visto, lo stack di memoria ha un indirizzamento tipicamente discendente (lo Stack Pointer punta all'indirizzo più basso e l'espansione della pila avviene verso indirizzi più bassi). ARM, però, concede anche la possibilità di implementare stack ascendenti, ovvero da indirizzi bassi ad alti, dove lo stack pointer punta all'indirizzo più alto. Queste due modalità di implementazione dello stack dipendono dalle ARM Application Binary Interface (ABI), che comprendono questo aspetto ma anche tutte le altre convenzioni che definiscono un modo standard per l'utilizzo logico dei registri, il passaggio degli argomenti e così via da parte dei differenti compilatori.

---

<!-- Pagina 119 -->

## Le memorie

In un'architettura Von Neumann, costituita da processore e memoria unica sia per dati che istruzioni, il canale di comunicazione tra il processore e la memoria è un punto critico del sistema, detto collo di bottiglia. Nel tempo, grazie alle evoluzioni dell'architettura si è riusciti a costruire memorie sempre più capienti e processori sempre più veloci, ma la velocità d'accesso alla memoria non cresce così rapidamente come la frequenza di clock di un processore.

Il vero problema non è che non sia possibile costruire memorie veloci. Ad esempio, i registri interni alla CPU sono memorie in grado di memorizzare parole di 32 bit e sono molto veloci. Questi registri, però, sono molto costosi da realizzare. Quindi il vero problema della differenza di prestazioni tra CPU e memorie risiede nel fatto che le prestazioni di una memoria sono direttamente proporzionali al loro costo. Esaminiamo questi grafici:

![Line graph showing the evolution of CPU and memory performance from 1980 to 2010. The y-axis is logarithmic, representing Performance from 1 to 100,000. The...](images/p119_fig01.png)

<table border="1">
<thead>
<tr>
<th></th>
<th>Technology</th>
<th>Price / GB</th>
<th>Access Time (ns)</th>
<th>Bandwidth (GB/s)</th>
</tr>
</thead>
<tbody>
<tr>
<td>Cache</td>
<td>SRAM</td>
<td>$5,000</td>
<td>0.5</td>
<td>25+</td>
</tr>
<tr>
<td>Main Memory</td>
<td>DRAM</td>
<td>$7</td>
<td>10-50</td>
<td>10</td>
</tr>
<tr>
<td rowspan="2">Virtual Memory</td>
<td>SSD</td>
<td>$0.40</td>
<td>20,000</td>
<td>0.5</td>
</tr>
<tr>
<td>HDD</td>
<td>$0.05</td>
<td>5,000,000</td>
<td>0.75</td>
</tr>
</tbody>
</table>

Evoluzione delle performance CPU / memorie Rapporto velocità / capienza e prezzo delle memorie

Per ovviare a questo problema, gli ingegneri hanno studiato, sviluppato e implementato nel tempo uno schema detto "gerarchia di memorie", nel quale si combinano:

- Una memoria piccola ma estremamente veloce (la cache, con tecnologia SRAM);
- Una memoria centrale dell'ordine di decine di GB ma tre volte più lenta rispetto alla cache (DRAM);
- Una memoria molto grande dell'ordine di centinaia di GB o addirittura TB, ma molto più lenta rispetto alla cache (memoria virtuale o memoria di massa, sviluppata con tecnologia a stato solido oppure attraverso un disco rigido).

Il motivo principale per cui si è deciso nel tempo di migliorare e implementare questo schema della gerarchia di memorie è che si è dimostrato che la maggior parte del tempo di esecuzione di una CPU è impegnato sempre dall'eseguire le stesse istruzioni, procedure e funzioni, che spesso si trovano in indirizzi di memoria contigui (p.e. inizializzazione di un array tramite cicli for).

Questa proprietà è detta LOCALITÀ DEI RIFERIMENTI e si manifesta in due modi:

- LOCALITÀ TEMPORALE: rappresenta la probabilità che un'istruzione appena eseguita sia eseguita nuovamente in un certo range di tempo (una sola istruzione);
- LOCALITÀ SPAZIALE: rappresenta la probabilità che istruzioni con indirizzi di memoria contigui siano eseguite in un certo intervallo di tempo (più istruzioni con indirizzi contigui).

Riassumendo, attraverso una gerarchia di memorie si ottengono contemporaneamente sia i benefici di avere una memoria capiente sia i benefici di avere tempi di accesso veloce.

- I dati e le istruzioni a cui si accede più spesso sono memorizzati nella memoria cache, memorie costruite con tecnologia SRAM direttamente sul chip del processore (in modo da eliminare tutti i ritardi dovuti ai trasferimenti di dati). È anche possibile suddividere il livello della memoria cache in due livelli, detti memoria cache L1 e memoria cache L2;
- Una collezione maggiore di altri dati e istruzioni a cui si accede occasionalmente sono memorizzati nella memoria centrale, costruita con tecnologia DRAM;
- Tutti i dati e le istruzioni rimanenti che non è possibile memorizzare nella memoria centrale e a cui si accede raramente sono memorizzati nella memoria di massa (memoria virtuale).

---

<!-- Pagina 120 -->

In particolare, l'idea è quella di interporre tra la memoria centrale e la CPU una memoria piccola ma estremamente veloce, ovvero la memoria cache, che contiene tutte quelle istruzioni e dati che interessano maggiormente l'elaborazione (in virtù dei due principi di località). Inoltre, la CPU comunica tramite lo stesso protocollo sia con la memoria centrale sia con la memoria cache (come se, durante un'operazione di load, non sapesse che esiste una gerarchia di memorie ma sta solo richiedendo un dato ad un certo indirizzo), grazie alla presenza di un cache controller. Ecco perché la memoria cache è anche detta "memoria di schermo" (trad. letterale dall'Inglese).

Le operazioni svolte dalla memoria cache sono operazioni che fanno largo uso dei principi di località. Quando la CPU richiede un certo dato in memoria, controlla prima se il dato è in memoria cache:

- **CACHE HIT**: se il dato è in memoria cache, allora non si fa alcuna richiesta nella memoria centrale. Quindi, il dato viene inviato direttamente alla CPU;
- **CACHE MISS**: se il dato non è in memoria cache, allora il cache controller reindirizza la richiesta nella memoria centrale dove si va a ricercare il dato e, tramite specifici protocolli, lo si invia sia direttamente alla CPU sia alla cache. In particolare, non si invia solo il dato che è stato richiesto, ma rispettando il principio della località spaziale vengono inviati alla memoria cache anche altri dati con indirizzi contigui (effettuare trasferimenti di un blocco di indirizzi contigui in cui è presente il dato all'indirizzo richiesto).

Quando la cache è piena e la CPU richiede una parola che non è presente nella cache, il cache controller deve decidere quale blocco della cache debba essere rimosso al fine di memorizzare questo nuovo blocco (nel quale è contenuta la parola richiesta dalla CPU). L'insieme di regole in base alle quali viene fatta questa scelta costituisce l'algoritmo di sostituzione.

#### **Gestione di un cache hit**

Se il dato richiesto dalla CPU viene trovato nella memoria cache, allora si ha un cache hit.

- In un'operazione di lettura, il dato viene trovato nella memoria cache e, quindi, viene riportato alla CPU per le sue elaborazioni. Il cache controller non reindirizza alcuna richiesta alla memoria centrale che, perciò, non viene proprio coinvolta;
- In un'operazione di scrittura, cioè nel caso si deve scrivere un dato, si può procedere in 2 modi:
  1. **WRITE-THROUGH**: la locazione della memoria cache e la locazione della memoria centrale sono entrambe aggiornate. Il dato viene scritto sia nella memoria cache che nella memoria centrale in virtù del principio di località temporale (potrebbe servire nuovamente in un breve tempo). Questa modalità è molto semplice da realizzare ma poco efficiente in quanto il dato potrebbe essere riscritto più volte nella memoria centrale (sappiamo che la scrittura in memoria principale è più lenta della scrittura in memoria cache);
  2. **WRITE-BACK**: si aggiorna solo la locazione di memoria nella cache e le si associa un dirty bit (D) al blocco a cui appartiene per indicare se una sua parola è stata aggiornata (D = 1) o meno (D = 0). Non appena il blocco in cui si trova la locazione interessata viene rimosso dalla memoria cache (per l'algoritmo di sostituzione), allora si riscrive in memoria centrale questo blocco con la parola aggiornata. Quindi si evitano tutte le operazioni di scrittura inutili del write-through, però, comunque può risultare ridondante perché si scrive in memoria centrale un intero blocco anche se una sola parola è stata aggiornata.

#### **Gestione di un cache miss**

Se il dato richiesto dalla CPU non viene trovato nella memoria cache, allora si ha un cache miss. Il cache controller, quindi reindirizza la richiesta alla main memory.

- In un'operazione di lettura, il blocco di parole contenente la parola richiesta deve essere copiato dalla memoria centrale alla memoria cache. In questo caso ci sono due possibilità:
  1. Dopo aver scritto l'intero blocco nella memoria cache, la parola richiesta di quel blocco viene inviata alla CPU;

---

<!-- Pagina 121 -->

2. **LOAD-THROUGH o EARLY RESTART**: la parola letta nella memoria centrale viene direttamente inviata alla CPU e, allo stesso tempo, il blocco di cui ne fa parte viene copiato nella memoria cache. Questa seconda tipologia di protocollo è più efficiente perché i tempi di accesso sono più rapidi, però il cache controller che gestisce la comunicazione tra CPU e gerarchia delle memorie ha una complessità maggiore.

- In un'operazione di scrittura, si ha un **write miss** quando l'accesso in scrittura è fallito perché la parola indirizzata non è nella cache. Anche in questo caso ci sono 2 alternative:
  1. **WRITE-THROUGH**: le informazioni sono scritte direttamente in memoria centrale;
  2. **WRITE-BACK**: il blocco contenente la parola indirizzata viene prima caricata nella cache, e poi aggiornata con le nuove informazioni. Il blocco di cui fa parte la parola indirizzata viene riscritto nella memoria centrale solo quando viene rimosso dalla memoria cache.

### **Prestazioni di una gerarchia di memorie**

La percentuale di hit, detto Hit Rate, è dato dal rapporto del numero di hit, cioè il numero di volte che un dato è stato trovato, sul numero di accessi totali effettuati in memoria.

$$
\text{Hit Rate} = \frac{\# \text{hits}}{\# \text{accessi in memoria}}
$$

La percentuale di miss, detto Miss Rate, è dato dal rapporto del numero di miss, cioè il numero di volte che un dato non è stato trovato, sul numero di accessi totali effettuati in memoria.

$$
\text{Miss Rate} = \frac{\# \text{miss}}{\# \text{accessi in memoria}}
$$

Dato che la somma di cache hit e cache miss dà proprio come risultato il numero totale di accessi in memoria, allora è possibile calcolare questi due valori anche con le seguenti formule:

$$
\text{Miss Rate} = 1 - \text{Hit Rate}; \quad \text{Hit Rate} = 1 - \text{Miss Rate}
$$

Per misurare le prestazioni della memoria si utilizza l'indice **AMAT (Average Memory Access Time)** che rappresenta il tempo medio per il processore di accedere ai dati in memoria, ovvero il tempo medio di esecuzione di un'istruzione di memoria (si misura in cicli di clock).

$$
\text{AMAT} = t_{\text{cache}} + MR_{\text{cache}} [t_{\text{MM}} + MR_{\text{MM}} (t_{\text{VM}})]
$$

- $t_{\text{cache}}$ : il tempo che intercorre per interrogare la cache;
- $t_{\text{MM}}$ : il tempo che intercorre per interrogare la memoria centrale. L'accesso alla memoria centrale, però, non avviene sempre, ma solo quando avviene un cache miss, cioè solo una percentuale di volte pari al numero Miss Rate;
- $MR_{\text{cache}}$ : percentuale di miss della cache;
- $t_{\text{VM}}$ : quando avviene un cache miss, non è detto che il dato che ha richiesto la CPU si trovi in memoria centrale. Questo dato rappresenta proprio il tempo che intercorre per recuperare il dato dalla memoria virtuale che, proprio come prima, non avviene sempre, ma solo quando si ha un miss nella main memory;
- $MR_{\text{MM}}$ : percentuale di miss della memoria centrale;

Ad esempio, supponiamo di avere un programma che esegue 2000 operazioni di load e store. 1250 dei dati richiesti dalla CPU sono nella memoria cache, mentre i restanti sono disponibili in altri livelli della gerarchia di memorie. Quindi, l'Hit Rate è  $1250/2000 = 0.625$ , invece il Miss Rate è  $750/2000 = 0.375$  (che è anche uguale a  $1 - \text{Hit Rate} = 1 - 0.625 = 0.375$ ).

Proseguendo l'esempio precedente, supponiamo di avere un processore e due livelli di memoria: cache e memoria principale. Il tempo per accedere alla cache è:  $t_{\text{cache}} = 1 \text{ ciclo di clock}$ . Il tempo per accedere alla memoria principale è:  $t_{\text{MM}} = 100 \text{ cicli di clock}$ . L'AMAT è il seguente:

$$
\text{AMAT} = t_{\text{cache}} + MR_{\text{cache}} * t_{\text{MM}} = 1 + 0.375 * 100 = 1 + 37.5 = 38.5 \text{ cicli di clock}
$$

---

<!-- Pagina 122 -->

### Terminologia delle memorie cache

- **CAPACITÀ C**: numero di parole memorizzabili nella cache;
- **BLOCK SIZE b**: il numero di parole in un singolo blocco. Maggiore è il block size b, migliore è la località spaziale;
- **NUMERO DI BLOCCHI B = C/b**: il numero di blocchi di cui è costituita la memoria cache è dato dal rapporto tra la sua capacità C e la grandezza di ogni singolo blocco b;
- **NUMERO DI SET S = B/N**: un set è un insieme di blocchi della memoria cache identificati da un unico indirizzo. Questo tipo di corrispondenza è detto *mapping*. La memoria cache è organizzata in un numero S di set, ognuno dei quali può contenere uno o più blocchi. Il numero S è dato dal rapporto tra il numero totale di blocchi nella memoria cache B e il numero di blocchi in un singolo set, cioè il grado di associatività N;
- **GRADO DI ASSOCIATIVITÀ N**: indica il numero di blocchi in un set.

Esistono tre tipologie di mapping:

<table border="1">
<thead>
<tr>
<th>Nome</th>
<th>Grado di associatività N<br/>(numero di blocchi per ogni set)</th>
<th>Numero di Set S = B / N</th>
</tr>
</thead>
<tbody>
<tr>
<td>Direct Mapped Cache</td>
<td>1</td>
<td>B</td>
</tr>
<tr>
<td>N-Way Set Associative Cache</td>
<td>$1 &lt; N &lt; B$</td>
<td>B / N</td>
</tr>
<tr>
<td>Fully Associative Cache</td>
<td>B</td>
<td>1</td>
</tr>
</tbody>
</table>

### Direct Mapped Cache

Una Direct Mapped Cache ha il grado di associatività 1, quindi un blocco per ogni set. Quindi, il numero di set è proprio pari al numero di blocchi. Per capire meglio il funzionamento di questo tipo di memoria cache, supponiamo quest'esempio:

![Diagram illustrating Direct Mapped Cache mapping. It shows a 2^30-Word Main Memory and a 2^3-Word Cache. The Main Memory is divided into 2^30 blocks, each 4...](images/p122_fig01.png)

La memoria cache ha una capacità di C=8 parole e ogni blocco ha una grandezza di b=1 parola. Poi, la memoria cache ha S=8 set, ognuno dei quali contiene un singolo blocco. Nella memoria centrale, tutti gli indirizzi (espressi in codice binario) hanno i bit meno significativi uguali a 0 perché sono indirizzi contigui di parole costituite da 4 byte. I successivi  $\log_2 8 = 3$  bit mappano direttamente l'indirizzo della memoria centrale con la parola nella memoria cache. Quindi, tutti gli indirizzi della memoria centrale che hanno questi 3 bit uguali saranno mappati nella memoria cache alla stessa parola (p.e. gli indirizzi della memoria centrale 0x00000004, 0x00000024 e 0xFFFFFE4 sono tutti mappati nel set 1 (001) della memoria cache).

---

<!-- Pagina 123 -->

L'hardware del cache controller di una Direct Mapped Cache è il seguente:

![Diagram of a Direct Mapped Cache Controller. A Memory Address is split into three fields: Tag (bits 27-31), Set (bits 3-4), and Byte Offset (bits 0-2). The T...](images/p123_fig01.png)

L'indirizzo della main memory è suddiviso in tre porzioni:

1. **BYTE OFFSET 00**: indica che gli indirizzi sono word-aligned, ovvero vanno di 32 bit in 32 bit.
2. **SET 4-2**: indica  $\log_2 8 = 3$  bit che rappresentano gli indirizzi dei set della memoria cache nel quale devono essere mappati gli indirizzi della memoria centrale.
3. **TAG 31-5**: indica i rimanenti bit dell'indirizzo di memoria.

Quindi, la cache ha la seguente organizzazione:

- **DATA** a 32 bit: il dato contenuto in quello specifico set;
- **TAG** a 27 bit: sono i 27 bit più significativi del memory address;
- **V** a 1 bit: è un bit di validità che indica se il dato in quel set è significativo ( $V=1$ ) o meno ( $V=0$ ).

Un'istruzione in ARM Assembly di load legge i bit nel campo SET dell'indirizzo di memoria identifica il set della memoria cache nel quale potrebbe essere presente il dato da ricercare. Controlla se il bit di validità  $V=1$  e se i bit del campo TAG nell'indirizzo di memoria corrispondono ai bit del campo TAG nel set. In questo caso si ha un cache hit e il campo DATA di 32 bit dal set della memoria cache sono inviati al processore, altrimenti si ha un cache miss e il cache controller deve reindirizzare la richiesta alla main memory.

Esempio:

![Diagram of the Direct Mapped Cache showing the mapping of memory address 00...00 001 00 to Set 1. The Tag is 00...00, the Set is 001, and the Byte Off](images/p123_fig02.png)

<table border="1">
<thead>
<tr>
<th>Codice in ARM Assembly</th>
<th>Direct Mapped Cache</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<pre>MOV R0, #5
MOV R1, #0
LOOP
CMP R0, #0
BEQ DONE
LDR R2, [R1, #4] → LDR R2, [0x4]
LDR R3, [R1, #12] → LDR R2, [0xC]
LDR R4, [R1, #8] → LDR R2, [0x8]
SUB R0, R0, #1
B LOOP
DONE
...</pre>
</td>
<td>
(Diagram of the Direct Mapped Cache showing the mapping of memo...)
<table border="1">
<thead>
<tr>
<th>V</th>
<th>Tag</th>
<th>Data</th>
<th>Set</th>
</tr>
</thead>
<tbody>
<tr><td>0</td><td></td><td></td><td>Set 7 (111)</td></tr>
<tr><td>0</td><td></td><td></td><td>Set 6 (110)</td></tr>
<tr><td>0</td><td></td><td></td><td>Set 5 (101)</td></tr>
<tr><td>0</td><td></td><td></td><td>Set 4 (100)</td></tr>
<tr><td>1</td><td>00...00</td><td>mem[0x00...0C]</td><td>Set 3 (011)</td></tr>
<tr><td>1</td><td>00...00</td><td>mem[0x00...08]</td><td>Set 2 (010)</td></tr>
<tr><td>1</td><td>00...00</td><td>mem[0x00...04]</td><td>Set 1 (001)</td></tr>
<tr><td>0</td><td></td><td></td><td>Set 0 (000)</td></tr>
</tbody>
</table>
<p>Alla prima esecuzione delle istruzioni LDR, la memoria cache non dispone dei dati relativi al programma (3 cache miss obbligatori) e, quindi, bisogna scrivere i dati della memoria centrale in quella cache rispettivamente ai set 1, 3 e 2 e i bit di validità V diventano 1. Alle prossime esecuzioni del LOOP, i dati vengono trovati e si ha un cache hit. Dunque, il miss rate è $3 / 15 = 20\%$.</p>
</td>
</tr>
</tbody>
</table>

---

<!-- Pagina 124 -->

```
MOV R0, #5
MOV R1, #0
LOOP
  CMP R0, #0
  BEQ DONE
  LDR R2, [R1, #0x4]
  LDR R3, [R1, #0x24]
  SUB R0, R0, #1
  B LOOP
DONE
...
```

Questo codice indica che le istruzioni dell'etichetta LOOP saranno eseguite 5 volte. Dato che ci sono 2 istruzioni LDR, in totale saranno effettuati 10 accessi in memoria.

Memory Address      Tag      Set      Byte Offset  
                          00...01    001    00

<table border="1">
<thead>
<tr>
<th>V</th>
<th>Tag</th>
<th>Data</th>
<th></th>
</tr>
</thead>
<tbody>
<tr><td>0</td><td></td><td></td><td>Set 7 (111)</td></tr>
<tr><td>0</td><td></td><td></td><td>Set 6 (110)</td></tr>
<tr><td>0</td><td></td><td></td><td>Set 5 (101)</td></tr>
<tr><td>0</td><td></td><td></td><td>Set 4 (100)</td></tr>
<tr><td>0</td><td></td><td></td><td>Set 3 (011)</td></tr>
<tr><td>0</td><td></td><td></td><td>Set 2 (010)</td></tr>
<tr><td>1</td><td>00...00</td><td>mem[0x00_04]<br/>mem[0x00_24]</td><td>Set 1 (001)</td></tr>
<tr><td>0</td><td></td><td></td><td>Set 0 (000)</td></tr>
</tbody>
</table>

L'indirizzo di memoria 0x4 e 0x24 hanno lo stesso campo SET, quindi sono entrambi mappati al set 1 della memoria cache. La prima istruzione LDR ritorna un cache miss obbligatorio poiché il dato del programma non è ancora presente nella memoria cache. Dato che i due indirizzi delle istruzioni di load sono mappati allo stesso set, quando si esegue la seconda istruzione di load, nel set 1 è presente il dato dell'indirizzo 0x4. I due tag non corrispondono, si ha un cache miss e si deve recuperare dalla memoria centrale il dato all'indirizzo 0x24. La stessa situazione si ha, poi, quando l'istruzione di load successiva ricerca nel set 1 della memoria cache il dato corrispondente all'indirizzo 0x4. Dunque, si ha un miss rate di  $10 / 10 = 100\%$  (miss di conflitto).

### N-Way Set Associative Cache

Per ovviare a questi problemi di cache miss obbligatori e cache miss di conflitto sono state sviluppate le N-Way Set Associative Cache, dove in un unico set non c'è un unico blocco, bensì N blocchi ( $1 < N < B$ ). Nell'esempio precedente, implementando questa tipologia di memoria cache è possibile memorizzare sia il dato all'indirizzo 0x4 sia il dato all'indirizzo 0x24 nello stesso set, riducendo il numero di cache miss di conflitto. Supponendo che il grado di associatività  $N=2$ , lo schema di una memoria N-Way Set Associative Cache è il seguente:

![Diagram of an N-Way Set Associative Cache with N=2. The Memory Address is split into Tag (28 bits), Set (2 bits), and Byte Offset (00). The Set bits select b...](images/p124_fig01.png)

---

<!-- Pagina 125 -->

Ogni set della memoria cache è identificato da un unico indirizzo a 2 bit, dato che i set sono 4. I bit meno significativi dell'indirizzo di memoria sono sempre 00 perché gli indirizzi contigui sono word-aligned, il campo SET è di 2 bit (già spiegato) e i bit rimanenti del TAG sono, quindi, 28. Una memoria cache di questo tipo restituisce un cache hit se e solo se il bit di validità  $V=1$  e se i TAG corrispondono per almeno una way. Il dato che deve essere restituito proviene proprio dalla way che restituisce un cache hit: questo controllo è implementato mediante un multiplexer con selettore Hit, che seleziona il dato della Way 1 se c'è un cache hit sulla Way 1, altrimenti seleziona il dato della Way 0 se c'è un cache hit sulla Way 0. Questo tipo di memoria cache restituisce un cache miss nel caso opposto, cioè se in entrambe le Ways i tag non coincidono oppure se  $V=0$ .

In particolare, il multiplexer restituisce sempre i dati associati a una delle due way:

- se si ha un cache hit, cioè Hit = 1, allora il dato viene inviato alla CPU;
- se si ha un cache miss, cioè Hit = 0, allora il cache controller provvede a inviare la richiesta alla main memory senza considerare il dato che ha restituito la cache.
- Esempio:

<table border="1">
<thead>
<tr>
<th>Codice in ARM Assembly</th>
<th colspan="6">N-Way Set Associative Cache</th>
</tr>
</thead>
<tbody>
<tr>
<td>MOV R0, #5</td>
<td colspan="3">Way 1</td>
<td colspan="3">Way 0</td>
</tr>
<tr>
<td>MOV R1, #0</td>
<td>V</td>
<td>Tag</td>
<td>Data</td>
<td>V</td>
<td>Tag</td>
<td>Data</td>
</tr>
<tr>
<td>LOOP</td>
<td>0</td>
<td></td>
<td></td>
<td>0</td>
<td></td>
<td></td>
</tr>
<tr>
<td>CMP R0, #0</td>
<td>0</td>
<td></td>
<td></td>
<td>0</td>
<td></td>
<td></td>
</tr>
<tr>
<td>BEQ DONE</td>
<td>1</td>
<td>00...00</td>
<td>mem[0x00...24]</td>
<td>1</td>
<td>00...10</td>
<td>mem[0x00...04]</td>
</tr>
<tr>
<td>LDR R2, [R1, #0x4]</td>
<td>0</td>
<td></td>
<td></td>
<td>0</td>
<td></td>
<td></td>
</tr>
<tr>
<td>LDR R3, [R1, #0x24]</td>
<td colspan="6">Set 3<br/>Set 2<br/>Set 1<br/>Set 0</td>
</tr>
<tr>
<td>SUB R0, R0, #1</td>
<td colspan="6"></td>
</tr>
<tr>
<td>B LOOP</td>
<td colspan="6"></td>
</tr>
<tr>
<td>DONE</td>
<td colspan="6"></td>
</tr>
<tr>
<td>...</td>
<td colspan="6"></td>
</tr>
<tr>
<td colspan="7">Questo codice indica che le istruzioni dell'etichetta LOOP saranno eseguite 5 volte. Dato che ci sono 2 istruzioni LDR, in totale saranno effettuati 10 accessi in memoria.</td>
</tr>
</tbody>
</table>

Utilizzando una memoria cache di  $C=8$  parole con grado di associatività  $N=2$ , la percentuale di miss di conflitto scende dal 100% di una Direct Mapped Cache al 20% poiché i primi 2/10 accessi sono cache miss obbligatori dove i dati vengono recuperati dalla memoria centrale (non ci sono ancora dati del programma nella memoria cache) e, quindi, scritti nella memoria cache, rispettivamente nella Way 0 e nella Way 1. I rimanenti 8/10 accessi sono tutti cache hit, perché un'istruzione recupera il dato dalla Way 0 e l'altra istruzione recupera il dato dalla Way 1, eliminando tutti i miss di conflitto.

### Fully Associative Cache

Una memoria cache di tipo Fully Associative è costituita da un unico set con  $B$  Ways, dove  $B$  indica il numero di blocchi della memoria. Un indirizzo di memoria può mappare un qualsiasi blocco di quest'unico set. Il vantaggio principale di questa tipologia di memoria è che tende ad avere un miss rate molto basso rispetto ad altri tipi di memoria cache con la stessa capacità. Di contro, però, implementa un hardware molto più complesso rispetto agli altri tipi di memoria cache, in quanto sono necessari tanti comparatori di TAG quanti sono i blocchi nel set e richiede un multiplexer  $B:1$  (quindi, è un tipo di memoria cache efficiente per capacità piccole).

<table border="1">
<thead>
<tr>
<th>Way 7</th>
<th>Way 6</th>
<th>Way 5</th>
<th>Way 4</th>
<th>Way 3</th>
<th>Way 2</th>
<th>Way 1</th>
<th>Way 0</th>
</tr>
</thead>
<tbody>
<tr>
<td>V</td>
<td>Tag</td>
<td>Data</td>
<td>V</td>
<td>Tag</td>
<td>Data</td>
<td>V</td>
<td>Tag</td>
<td>Data</td>
</tr>
<tr>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
</tbody>
</table>

(nell'immagine non sono mostrati i comparatori, il multiplexer e l'indirizzo di memoria)

---

<!-- Pagina 126 -->

### Come sfruttare la località spaziale?

Essenzialmente, per sfruttare la località spaziale in una memoria cache bisogna aumentare il block size, ovvero il numero di parole memorizzabili in un singolo blocco. In questo esempio di Direct Mapped Cache è possibile notare che  $C=8$ ,  $b=4$ ,  $B = C/b = 2$  e  $S=2$ . Infatti, ogni set è costituito da un solo blocco (identificato da un TAG) che, a sua volta, può memorizzare quattro parole con indirizzi contigui.

![Diagram of a Direct Mapped Cache showing the mapping from Memory Address to Cache. The Memory Address is split into Tag (bits 27-5), Set (bit 4), Block Offse...](images/p126_fig01.png)

L'indirizzo di memoria viene così suddiviso:

- BYTE OFFSET 0-1 (00): sono bit che indicano che gli indirizzi sono word-aligned, ovvero vanno di 32 bit in 32 bit;
- BLOCK OFFSET 2-3: identifica a quale parola del blocco ci si sta riferendo ( $2^2=4$  parole indirizzabili). Questi due bit sono anche utilizzati come selettori del multiplexer per restituire in output proprio la parola di quel blocco che ha richiesto la CPU.
- SET 4: questo bit indica a quale set della memoria cache ci si sta riferendo ( $2^1=2$  set indirizzabili);
- TAG 5-31: sono i bit rimanenti dell'indirizzo di memoria, indicano se in un set è presente la parola richiesta dalla CPU attraverso la comparazione del campo TAG della memoria cache.

Quindi, quando si richiede un dato che non è presente nella memoria cache, invece di trasportare dalla memoria centrale solo la parola richiesta, se ne trasporta un intero blocco (in questo caso di 4 parole) in modo da aumentare la località spaziale e il valore del miss rate.

![Diagram of a Direct Mapped Cache showing the mapping from Memory Address to Cache. The Memory Address is split into Tag (bits 27-5), Set (bit 4), Bloc](images/p126_fig02.png)

<table border="1">
<thead>
<tr>
<th>Codice in ARM Assembly</th>
<th>Direct Mapped Cache</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<pre>MOV R0, #5
MOV R1, #0
LOOP
CMP R0, #0
BEQ DONE
LDR R2, [R1, #4] → LDR R2, [0x4]
LDR R3, [R1, #12] → LDR R2, [0xC]
LDR R4, [R1, #8] → LDR R2, [0x8]
SUB R0, R0, #1
B LOOP
DONE
...</pre>
<p>Questo codice indica che le istruzioni dell'etichetta LOOP saranno eseguite 5 volte. Dato che ci sono 3 istruzioni LDR, in totale saranno effettuati 15 accessi in memoria.</p>
</td>
<td>
(Diagram of a Direct Mapped Cache showing the mapping from Memo...)
<p>In questo tipo di memoria, all'esecuzione della prima istruzione di load si ha un cache miss perché ancora non sono stati caricati i dati del programma in memoria cache. Il cache controller, quindi, effettua una richiesta in memoria centrale, però, invece di trasferire una singola parola, viene trasferito un intero blocco di parole dall'indirizzo 0x0 all'indirizzo 0xC. Così facendo, le prossime istruzioni di load non daranno un cache miss obbligatorio, in quanto i dati sono già stati trasferiti in blocco. L'implementazione di blocchi più grandi riducono i miss obbligatori da 3 a 1 (su 15 accessi) grazie alla località spaziale.</p>
</td>
</tr>
</tbody>
</table>

---

<!-- Pagina 127 -->

### **Bit di validità**

Il bit di validità è un bit di controllo che indica se il dato di uno specifico blocco della memoria cache è significativo o meno per il programma correntemente in esecuzione. Con dato significativo ( $V = 1$ ) si intende che quel dato in memoria interessa all'esecuzione del programma corrente e non a programmi eseguiti precedentemente -  $V = 0$  - (p.e. dopo un context switch).

Non è da confondere con il bit di modifica, ovvero un bit che indica se un blocco significativo è stato modificato, ed è utile per vedere quali blocchi modificati nella cache devono essere aggiornati nella memoria centrale.

### **Direct Memory Access – DMA**

La gerarchia di memorie è usualmente costituita da 3 livelli:

- La memoria cache, una SRAM costruita direttamente sul chip del processore;
- La memoria centrale, una DRAM (anche detta memoria fisica);
- La memoria di massa, un disco a stato solido oppure un disco rigido (anche detta memoria virtuale).

Lo scambio di dati, quindi, non avviene solo tra memoria cache e memoria centrale come visto finora, ma anche tra memoria centrale e memoria virtuale - swap - (p.e. primo avvio di un programma che deve essere caricato dalla memoria virtuale). Il DMA è proprio quel meccanismo che permette la comunicazione tra memoria centrale e memoria virtuale. In particolare, questo scambio di dati e questo meccanismo viene effettuato tramite un controllo diretto della scheda madre che, quindi, non coinvolge la CPU.

Esistono varie soluzioni per la gestione del DMA che utilizza, principalmente, un bus della scheda madre. Si può dare la priorità al trasferimento di dati del bus e, quindi, la CPU deve aspettare che si liberi prima di poterlo utilizzare per le sue elaborazioni. Oppure si può dare la priorità alla CPU e sarà, quindi, il trasferimento di dati da memoria centrale a virtuale e viceversa ad aspettare che la CPU non richieda l'accesso al bus.

### **Il problema della coerenza della cache**

Tutte le operazioni che intercorrono tra memoria cache, centrale e virtuale (in parte anche gestite dall'OS) creano un problema detto della "coerenza della cache", ovvero che i dati tra memoria cache e memoria centrale devono sempre essere aggiornati allo stesso modo (coerenza) in modo da non trasferire, poi, dati obsoleti nella memoria virtuale.

- GESTIONE DEL VALID BIT: dopo che è stato effettuato un passaggio di dati dalla memoria virtuale alla memoria centrale è possibile che siano stati sovrascritti dei dati in memoria centrale che erano in copia nella memoria cache. Dato che la memoria cache è una "finestra della main memory", è obbligatorio che ci sia una coerenza tra i dati presenti nella memoria cache e nella memoria centrale, gestita dal valore del bit di validità, che, indica se un blocco di dati è significativo o meno (i dati sovrascritti che sono ancora in copia nella memoria cache devono avere  $V = 0$  ad indicare che il blocco è obsoleto e che potrà essere sovrascritto).
- SVUOTAMENTO (FLUSH): Durante un'operazione di swap tra memoria centrale e memoria virtuale, il DMA deve controllare se la memoria cache attua una politica di write-back (nel quale un blocco dati si aggiorna solo in memoria cache e ad esso è associato un bit di modifica). Se è così, allora il DMA deve prima forzare un trasferimento dei dati aggiornati dalla memoria cache alla memoria centrale e poi proseguire con lo swap tra memoria centrale e memoria virtuale (altrimenti si passerebbero dati non aggiornati).

### **Algoritmi di sostituzione**

Quando la memoria cache è piena e si deve caricare un nuovo blocco di dati nella memoria cache, si possono distinguere due casi:

1. Se c'è un blocco con bit di validità  $V = 0$ , quindi non è un blocco significativo per il programma correntemente in esecuzione, allora il nuovo blocco che si deve caricare in memoria cache lo si sostituisce semplicemente al blocco con  $V = 0$  (per definizione può essere sovrascritto);

---

<!-- Pagina 128 -->

2. Se tutti i blocchi presenti in memoria cache sono significativi per il programma in esecuzione, cioè  $V = 1$ , allora se si vuole memorizzare un nuovo blocco richiesto dalla CPU si utilizza un algoritmo di sostituzione.

Considerando sia il principio di località temporale che quello spaziale, l'algoritmo di sostituzione maggiormente utilizzato nelle memorie cache è l'algoritmo LRU (Least Recently Used) che permette di sovrascrivere il blocco utilizzato meno recentemente con il nuovo blocco proveniente dalla memoria centrale (infatti i blocchi - spaziale - utilizzati più recentemente hanno maggior probabilità di essere riutilizzati di nuovo - temporale).

L'algoritmo di sostituzione LRU gestisce i blocchi da quelli più recentemente utilizzati a quelli meno tramite una graduatoria. I bit che indicano la posizione in graduatoria di un blocco vengono aggiornati in un cache hit o in cache miss nel modo seguente:

- Se il dato richiesto dalla CPU è presente nella memoria cache, si ha un cache hit e i bit del suo contatore in graduatoria sono posti a 0 dato che, a questo punto, è il blocco utilizzato più recentemente. Tutti gli altri contatori con valori inferiori sono incrementati di 1, mentre gli altri rimangono invariati;
- Se il dato richiesto dalla CPU non è presente nella memoria cache, si ha un cache miss e si aprono due possibilità:
  1. È possibile che ci sia un blocco il cui bit di validità  $V = 0$ . Questo blocco viene sostituito con quello proveniente dalla memoria centrale e il suo contatore viene aggiornato a 0, mentre tutti gli altri sono incrementati di 1;
  2. Se tutti i blocchi hanno il bit di validità  $V = 1$ , allora si utilizza l'algoritmo di sostituzione. Il blocco il cui contatore indica che è quello meno recentemente utilizzato viene riportato in memoria centrale e sostituito con quello nuovo proveniente dalla memoria centrale. Il suo contatore, quindi, diventa 0 e, come prima, tutti gli altri contatori sono incrementati di 1.

Questo algoritmo di sostituzione funziona in modo efficace per la maggior parte di schemi di memoria cache. Comunque, per migliorare ulteriormente le sue prestazioni è stato sviluppato ed inserito nell'algoritmo stesso un piccolo fattore di casualità (cioè una volta su 50, il blocco da sostituire è scelto in modo casuale). L'algoritmo di sostituzione più semplice è quello che sceglie sempre in modo casuale il blocco da sostituire (ovviamente, è poco efficiente nella maggior parte dei casi). Altri algoritmi anche migliori sotto certi punti di vista, invece, richiedono l'implementazione di hardware di controllo più complessi che, quindi, peggiorano le prestazioni globali del sistema.

### ***Tipi di cache miss e confronti***

In una memoria cache, come abbiamo già visto, è possibile avere diversi tipi di miss:

- **COMPULSORY**: sono quei miss obbligatori quando si accede per la prima volta ad un dato di un nuovo programma che sicuramente non è presente in memoria cache;
- **CAPACITY**: è un miss che deriva direttamente dalla capacità di una memoria cache poiché, avendo delle dimensioni limitati, non può memorizzare allo stesso tempo tutti i dati d'interesse;
- **CONFLICT**: sono miss che derivano dal fatto che due o più indirizzi devono essere mappati nello stesso set, ma non ci sono abbastanza blocchi per memorizzare i dati a cui puntano allo stesso tempo.

Inoltre, il **MISS PENALTY** è il tempo che intercorre affinché si possa recuperare un blocco di dati da un livello inferiore della gerarchia di memorie.

---

<!-- Pagina 129 -->

![Graph showing Miss Rate per Type vs Cache Size (KB) for 1-way, 2-way, 4-way, and 8-way caches. The miss rate decreases as cache size increases, with higher a...](images/p129_fig01.png)

Questo grafico mostra l'andamento del miss rate al crescere della capacità della memoria cache per questi quattro tipi di set-associative cache con grado di associatività diverso. Se aumenta la capacità della cache, è possibile memorizzare più parole e, ovviamente, il miss rate decresce. In particolare, c'è una differenza di miss rate sostanziosa tra cache con grado di associatività 1 e 2, dopodiché questa differenza non è più tanto significativa quando si passa da 2 a 4. Ciò significa che non conviene complicare l'hardware con troppi comparatori (p.e. il vantaggio tra 4-way set

associative cache e fully associative cache a 8 way è poco significativo).

Questo grafico mostra l'andamento del miss rate in funzione del block size di 4 memorie cache con capacità diverse (4K, 16K, 64K, 256K). In questo caso l'andamento è un po' particolare:

- inizialmente, aumentando il block size, il miss rate diminuisce per via della diminuzione di miss obbligatori (raggiungendo un punto minimo per il principio di località spaziale);
- poi, però, aumentando ancora il block size, il miss rate invece di diminuire comincia a risalire perché la capacità  $C$  di una memoria cache è data dal prodotto  $S \cdot N \cdot b$ , quindi all'aumentare del block size, il numero di set deve diminuire aumentando il numero di miss di conflitto.

![Graph showing Miss Rate vs Block Size for 4K, 16K, 64K, and 256K caches. The miss rate generally decreases with increasing block size, then increases again f...](images/p129_fig02.png)

### Frazionamento della memoria in moduli

Dato che la memoria centrale è più lenta della memoria cache e, a sua volta, la memoria virtuale è più lenta della memoria centrale, si è pensato nel tempo di sviluppare un metodo per aumentare il throughput (quantità di dati trasferiti in un'unità di tempo) di dati di una memoria, cercando di far lavorare più moduli della stessa memoria in parallelo. Esistono, principalmente, due tipologie di frazionamento in moduli delle memorie e dipende da come sono distribuiti gli indirizzi:

1. Nella prima tipologia di frazionamento, i primi 'K' bit ( $K \text{ bit} = 2^K \text{ moduli}$ ) più significativi di un indirizzo di memoria identificano, tramite l'utilizzo di un decoder, il modulo di destinazione della memoria centrale nel quale è presente l'indirizzo richiesto. Gli altri 'm' bit meno significativi fungono da offset e indicano dove è presente il dato all'interno del modulo. In questa tipologia di frazionamento, gli indirizzi contigui sono tutti localizzati all'interno di un unico modulo. Quindi, quando si ha un cache miss e si richiede un intero blocco di indirizzi contigui dalla memoria centrale, è solo un modulo per volta a lavorare (il parallelismo non viene attuato);

![Diagram of memory module addressing. It shows an address divided into 'N° modulo' (K bits) and 'Indirizzo nel modulo' (m bits). The 'N° modulo' bits are used...](images/p129_fig03.png)

---

<!-- Pagina 130 -->

2. Nella seconda tipologia di frazionamento, si suddividono gli indirizzi di memoria in moduli tramite un metodo detto "INTERLACCIAMENTO DELLA MEMORIA" (speculare rispetto al 1°). Infatti, i 'K' bit meno significativi dell'indirizzo identificano, tramite l'utilizzo di un decoder, il modulo di destinazione della memoria centrale nel quale è presente l'indirizzo richiesto. Gli altri 'm' bit più significativi fungono da offset e indicano dove è presente il dato all'interno del modulo. In questa tipologia di frazionamento, gli indirizzi contigui sono tutti localizzati in moduli diversi (un blocco di dati è distribuito orizzontalmente). Quindi, quando si ha un cache miss e si richiede un intero blocco di indirizzi contigui dalla memoria centrale, più moduli lavorano parallelamente.

![Diagram illustrating the memory interleaving technique. An address is split into 'Indirizzo nel modulo' (m bits) and 'N° modulo' (k bits). The 'N° modulo' bi...](images/p130_fig01.png)

### Gerarchia delle memorie: cache multi-livello

Come abbiamo visto, all'aumentare della capacità di una memoria cache diminuisce il miss rate, ma anche la sua velocità. Ecco perché i sistemi più moderni usano almeno due livelli di cache (oppure tre). La ricerca di un dato richiesto dalla CPU funziona sempre allo stesso modo:

- prima si ricerca il dato nella memoria cache L1, più piccola e veloce;
- se si ha un cache miss, allora si procede alla ricerca del dato nella memoria cache L2, con capacità maggiore e, perciò, più lenta della prima;
- Nel caso in cui si ha un cache miss anche al secondo tentativo, il cache controller reindirizza la richiesta di ricerca del dato alla memoria centrale (oppure ad un terzo livello, se disponibile).

Esistono diversi modi per organizzare questa gerarchia delle memorie cache. In particolare:

1. **INCLUSIVA**: nella memoria L2 sono disponibili tutti i dati presenti in L1 (allo stesso modo anche L3 contiene tutti i dati di L2). Per mantenere la coerenza, in questo tipo di gerarchia si attua una politica di write-through, cioè: quando vengono aggiornati i dati in L1, si riportano le modifiche anche al livello L2.
   - Quando si ha un cache miss in L1 e un cache hit in L2, il blocco di dati viene copiato da L2 a L1 (eventualmente, tramite un algoritmo di sostituzione, un dato non significativo in L1 passa a L2 e il dato richiesto viene copiato da L2 a L1).
   - Quando si ha un cache miss in entrambi i livelli di cache, il blocco di dati richiesto viene copiato dalla memoria centrale in entrambi i livelli L1 e L2;
2. **ESCLUSIVA**: nella memoria L2 sono presenti solo i dati di copy back di L1 (victim cache), cioè che durante un'operazione di sostituzione in L1 il blocco di dati sostituito passa in L2. Uno dei vantaggi di questa tipologia di gerarchia è che la capacità complessiva è data dalla somma di tutte le capacità delle singole memorie cache, a differenza della prima tipologia nel quale la capacità complessiva è data solo dalla capacità dell'ultimo livello poiché ogni livello superiore è contenuto in quello inferiore ( $L1 \subset L2 \subset L3$ ). Dato che l'ordine di grandezza tra un livello di

---

<!-- Pagina 131 -->

cache e l'altro non è molto grande (circa 10x) il guadagno tra la gerarchia inclusiva e quella esclusiva non è molto significativo.

- Quando si ha un cache miss in L1 e un cache hit in L2, il blocco di dati presente in L2 viene passato in L1 e sostituisce il blocco meno recentemente utilizzato di L1;
- Quando si ha un cache miss in entrambi i livelli di cache, il blocco di dati viene recuperato dalla memoria centrale e viene passato direttamente in L1, andando a sostituire il blocco di dati secondo l'algoritmo di sostituzione scelto (p.e. LRU).

### ***Gerarchia delle memorie: cache condivise***

Negli elaboratori più moderni con più processori e per ognuno di essi più core, non è raro vedere che, all'interno di unico processore, ogni core dispone del proprio livello di memoria cache L1, mentre il livello di memoria cache L2 viene condiviso tra più core. Uno dei principali vantaggi di questa implementazione è che nella programmazione multi-threading consente di utilizzare in maniera più efficiente dati condivisi. Il multi-threading è una forma di programmazione concorrente in cui diversi flussi di dati dello stesso programma (thread) sono eseguiti parallelamente sui core, che però condividono uno stesso spazio di memoria a cui possono accedere (ovvero il livello cache L2). Inoltre, riduce il traffico di dati sul front-side bus, ovvero l'interfaccia di comunicazione tra memoria centrale e memorie cache.

### ***Gerarchia delle memorie: la memoria virtuale***

La memoria virtuale (o memoria di massa) rappresenta l'ultimo livello della gerarchia delle memorie ed è rappresentata o da un disco a stato solido oppure da un disco rigido magnetico.

Agli inizi dell'informatica la memoria centrale era dell'ordine di pochi MB, le memorie di massa non erano ancora largamente utilizzate e, di conseguenza, gli OS dovevano essere molto succinti. In particolare, l'esecuzione di un singolo programma (nella maggior parte dei casi) prevedeva l'inserimento di più floppy disk, ognuno dei quali conteneva una specifica parte del programma. Quindi, prima si dovevano salvare i risultati parziali in indirizzi specifici della memoria centrale e, poi, all'esecuzione della parte di programma successiva, si dovevano recuperare questi dati. Ovviamente, ne deriva che la programmazione era complicatissima.

Oggi questi problemi non contano più in quanto i programmi sono interamente memorizzati nelle memorie di massa e le memorie centrali sono abbastanza grandi da riuscire a gestire anche l'esecuzione di più programmi contemporaneamente. Inoltre, il problema dei riferimenti dei risultati parziali viene direttamente gestito dal sistema operativo, che permette di avere una coerenza tra memoria centrale e virtuale tramite una tecnica di paginazione che traduce gli indirizzi della memoria virtuale in indirizzi fisici della memoria centrale. Dato che lo spazio di indirizzamento della memoria virtuale è molto più grande dello spazio degli indirizzi di una memoria centrale, per poter effettuare queste traduzioni è necessaria una look-up table.

Inoltre, l'OS ha le seguenti funzioni per la gestione tra memoria virtuale e fisica:

- assegna degli spazi liberi della memoria fisica ai segmenti del programma in esecuzione installato sul disco rigido, in modo da gestire efficientemente lo spazio disponibile in memoria centrale (anche utilizzando spazi non continui per questi segmenti);
- durante l'esecuzione di programmi di grandi dimensioni per il quale lo spazio della memoria centrale potrebbe risultare non sufficiente, l'OS effettua operazioni di swapping per i segmenti e dati che riguardano il programma stesso, ovvero effettua un passaggio temporaneo dalla memoria centrale alla memoria di massa, anche tramite il DMA che non coinvolge la CPU. Dato che i tempi di swap sono maggiori rispetto ai tempi del passaggio di dati tra memoria centrale e memoria virtuale (anche per i principi di località) non vengono trasferiti di volta in volta singoli dati ma interi blocchi (detti pagine di memoria), p.e. nel caso di miss di dati nella memoria centrale che devono, quindi, essere recuperati dalla memoria di massa.

---

<!-- Pagina 132 -->

### Caratteristiche e terminologia delle memorie virtuali

- I programmi devono poter accedere a qualunque dato nella memoria virtuale. Proprio per questo motivo utilizzano degli indirizzi virtuali che specificano le locazioni della memoria virtuale;
- La memoria centrale conserva solo un sottoinsieme dei dati più recentemente utilizzati della memoria virtuale. Gli indirizzi virtuali sono tradotti in indirizzi fisici della memoria centrale attraverso un mapping (address translation). Si potrebbe dire che la memoria centrale si comporta come una cache per la memoria virtuale;

![Diagram illustrating the mapping from Virtual Addresses to Physical Addresses and Physical Memory. Virtual Addresses are shown in a box on the left, and Phys...](images/p132_fig01.png)

- Le memorie virtuali utilizzano termini diversi per riferirsi agli stessi concetti utilizzati anche nello studio delle cache. Questi sono:

<table border="1">
<thead>
<tr>
<th>Terminologia memoria cache</th>
<th>Terminologia memoria virtuale</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>Block</b><br/>(decine di byte)</td>
<td><b>Page</b><br/>(decine di kilobyte)</td>
</tr>
<tr>
<td><b>Block Size</b></td>
<td><b>Page Size</b><br/>(dimensione delle pagine, cioè dei segmenti trasferiti da VM a MM)</td>
</tr>
<tr>
<td><b>Block Offset</b></td>
<td><b>Page Offset</b></td>
</tr>
<tr>
<td><b>Miss</b><br/>(non si trova il dato in cache)</td>
<td><b>Page Fault</b><br/>(non si trova il dato in memoria centrale)</td>
</tr>
<tr>
<td><b>Tag</b></td>
<td><b>Virtual Page Number</b></td>
</tr>
<tr>
<td></td>
<td><b>Address Translation</b><br/>(traduzione che determina l'indirizzo fisico associato ad un indirizzo virtuale)</td>
</tr>
<tr>
<td></td>
<td><b>Page Table</b><br/>(tabella in cui sono memorizzate le traduzioni tra indirizzi fisici e virtuali)</td>
</tr>
</tbody>
</table>

- Ogni programma ha il suo spazio di indirizzi nel quale può operare assegnatogli dall'OS. Altri programmi non possono andare ad operare sui tali indirizzi virtuali. Quando un programma cerca di operare su uno spazio di indirizzi che è al di fuori dello spazio ad esso associato, si ha un'interruzione forzata dell'esecuzione del programma detta SEGMENTATION FAULT.

![Diagram showing the translation of a Virtual Address into a Physical Address. The Virtual Address is split into a 19-bit VPN and a 12-bit Page Offset. The 19...](images/p132_fig02.png)

Ad esempio, supponiamo di avere una memoria virtuale di  $2\text{GB}=2^{31}$  byte = gli indirizzi sono di 31 bit significativi, una memoria centrale di  $128\text{MB}=2^{27}$  byte = gli indirizzi sono di 27 bit significativi, e ogni pagina ha una dimensione di  $4\text{KB}=2^{12}$  byte. Ciò vuol dire che i 12 bit meno significativi dell'indirizzo virtuale rappresentano il Page Offset, cioè dove è memorizzato l'indirizzo virtuale all'interno di una pagina. Invece, i 19 bit rimanenti rappresentano il Virtual Page Number, cioè il numero della pagina nel quale è memorizzato tale indirizzo. Poiché la memoria centrale ha uno spazio con indirizzi di 27 bit e

anch'essa è organizzato in pagine, i 12 bit meno significativi rappresentano sempre il Page Offset, invece i 15 bit rimanenti rappresentano il Physical Page Number, cioè il numero di pagine fisiche della memoria principale. Questo numero deve essere tradotto correttamente a partire dal VPN a 19 bit.

---

<!-- Pagina 133 -->

![Diagram showing the mapping between Virtual Memory and Physical Memory. Virtual Memory is divided into Virtual Page Numbers (7FFF to 0000) and Virtual Addres...](images/p133_fig01.png)

Questo schema rappresenta la traduzione tra la memoria virtuale e fisica sopra descritte. Ogni coppia di indirizzi all'interno di una riga rappresentano il primo e l'ultimo indirizzo della pagina.

In entrambe le memorie, le ultime 3 cifre esadecimali ( $4\text{KB} = 2^{12} \text{ byte} = \text{offset di 12 bit}$ ) rappresentano il Page Offset. Nella memoria virtuale si hanno a disposizione 5 cifre esadecimali (la cifra più significativa arriva a 7 perché si hanno 19 bit a disposizione per il VPN) per numerare tutte le pagine virtuali. Nella memoria fisica si hanno a disposizione 4 cifre esadecimali (la cifra più significativa arriva a 7 perché si hanno 15 bit a disposizione per il PPN) per numerare tutte le pagine fisiche. Attraverso la traduzione, p.e. la pagina virtuale 7FFFD è mappata nella pagina fisica 0000, oppure la pagina virtuale 7FFFC è mappata nella pagina fisica 0001.

**Esercizio:**

Qual è l'indirizzo fisico dell'indirizzo in memoria virtuale 0x247C? Il VPN di quest'indirizzo è 00002 che viene mappato alla pagina fisica con PPN 7FFF (si capisce dalla freccia nell'immagine), quindi l'indirizzo nella memoria fisica è 0x7FFF47C (47C rimane lo stesso perché è il Page Offset).

### Traduzione degli indirizzi: Memory Management Unit

Il compito di tradurre indirizzi fisici in virtuali e viceversa è determinato da un sistema logico interno al chip del processore detto Memory Management Unit (anche dal sistema operativo che gestisce le pagine tra memoria fisica e virtuale).

### Traduzione degli indirizzi: Page Table

![Diagram showing the Page Table mechanism. A virtual address 0x0002 is split into a 19-bit VPN (00002) and a 12-bit Page Offset (47C). The VPN is used to inde...](images/p133_fig02.png)

Il mapping tra VPN e PPN è memorizzato in una tabella, contenente tante entry quante sono le pagine virtuali. In ogni riga si ha il PPN associato al VPN e un bit di validità V.

La Page Table dell'esempio precedente è questa qui a sinistra. Dato un indirizzo virtuale:

- Prima di tutto si identifica il VPN;
- Se V = 1 alla riga corrispondente nella page table, allora vuol dire che la pagina è localizzata nella main memory;
- L'indirizzo interno alla pagina della memoria centrale è dato dal Page Offset che è lo stesso tra indirizzo virtuale e fisico;
- Se il bit di validità V = 0 nell'entry corrispondente al VPN, allora vuol dire che la pagina non è attualmente localizzata nella memoria principale. Si deve recuperare la pagina dalla memoria virtuale (lo swap avviene tramite DMA), memorizzarla nella memoria centrale e aggiornare la look-up table con il nuovo valore

del PPN, in modo tale da effettuare la traduzione e recuperare tutti gli indirizzi richiesti.

apuntibfciastudenti.com

---

<!-- Pagina 134 -->

### Translation Lookaside Buffer (TLB)

Poiché la memoria virtuale ha una capacità molto più grande della memoria centrale, è chiaro che la memoria virtuale è costituita da molte pagine e, di conseguenza, si hanno molte entry nella page table (una per ogni pagina virtuale). Proprio per questo motivo, la page table è conservata nella main memory.

Quindi, le operazioni di load/store richiedono due accessi alla memoria centrale:

1. **TRADUZIONE:** prima si deve accedere alla page table conservata nella memoria centrale, confrontare il VPN dell'indirizzo virtuale con il VPN nella page table e se il bit di validità  $V = 1$  si recupera il PPN dell'indirizzo fisico;
2. **OPERAZIONE:** il secondo accesso è quello vero e proprio al dato che si trova all'indirizzo fisico calcolato durante la traduzione.

Questa modalità con doppio accesso in memoria, ovviamente, dimezza le prestazioni di una memoria centrale.

Fortunamente, gli accessi alla page table hanno una grande località temporale e spaziale:

- **TEMPORALE:** la probabilità che la CPU richieda un indirizzo nella stessa pagina;
- **SPAZIALE:** la probabilità che la CPU richieda un blocco di indirizzi contigui nella stessa pagina.

Entrambi questi principi sono dovuti al fatto che le pagine della memoria virtuale contengono molti più indirizzi dei blocchi della memoria cache.

Proprio per questi principi, si è pensato di implementare una piccola memoria cache nel quale il processore possa conservare le ultime entry della page table che ha letto, in modo tale che possa rileggerle velocemente senza accedere alla page table in memoria centrale. Questa piccola memoria è proprio il "Translation Lookaside Buffer", chiamata così perché il processore è in grado di "guardare oltre" (looks-aside) nel TLB prima di ricercare la traduzione dell'indirizzo virtuale nella page table.

![Diagram of a TLB (Translation Lookaside Buffer) showing the translation process. A virtual address (0x00002) is split into a 19-bit Virtual Page Number and a...](images/p134_fig01.png)

Un TLB è una memoria fully associative cache che tipicamente contiene dalle 16 alle 512 entries. Ogni entry del TLB conserva un VPN e il PPN associato. Il processore accede al TLB usando un VPN:

- Se si ha un TLB Hit, allora la memoria restituisce il PPN associato al VPN in ingresso;
- Se se ha un TLB Miss, allora il processore deve necessariamente leggere il PPN dalla page table.

Altre caratteristiche fondamentali del TLB, dovute alla sua progettazione, sono:

- È abbastanza piccola in modo da potervi accedere in meno di un ciclo di clock;
- Ha un Hit Rate maggiore del 99% perché è una memoria fully associative cache con qualche centinaio di entry (la percentuale di miss di conflitto è bassissima);
- Grazie ad essa è possibile diminuire il numero di accessi in memoria centrale e aumentare le prestazioni del processore durante operazioni di load/store.
