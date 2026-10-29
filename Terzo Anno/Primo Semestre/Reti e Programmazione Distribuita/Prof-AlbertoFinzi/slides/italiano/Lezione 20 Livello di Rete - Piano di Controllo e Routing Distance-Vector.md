---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezione 20: Il Livello di Rete — Il Piano di Controllo e Routing Distance-Vector

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## Il Piano di Controllo (*Control Plane*) e gli Algoritmi di Routing

- Ricordiamo che le azioni principali di un router sul piano dati sono:
  - **Inoltro (*Forwarding*)**: trasferimento immediato del pacchetto dall'interfaccia di ingresso a quella di uscita in base alla tabella locale.
  - **Filtraggio o Scarto (*Drop*)**: blocco di pacchetti scaduti o malevoli.
  - **Modifica**: aggiornamento del TTL, riscrittura NAT.
- **Ruolo del Piano di Controllo**:
  - Calcolare e mantenere aggiornate le **Tabelle di Inoltro (*Forwarding Tables*)**.
  - Guidare i pacchetti lungo **cammini ottimali** (*Good Paths*) dalla sorgente alla destinazione attraverso la maglia dei router della rete globale.

---

## L'Approccio Naif: il Flooding (Inondazione)

Il metodo più semplice per instradare pacchetti è il **Flooding**:
- Quando un router riceve un pacchetto su un'interfaccia, lo inoltra in copia su **tutti gli altri collegamenti attivi** (tranne quello da cui è arrivato).
- **Vantaggi**:
  - Nessuna necessità di calcolare o memorizzare tabelle di routing.
  - Se esiste un percorso verso la destinazione, il pacchetto vi arriverà sicuramente lungo il percorso a latenza minima.
- **Svantaggi Gravi**:
  - Esplosione esponenziale dei pacchetti duplicati (*Broadcast Storm*).
  - Consumo totale della banda di rete.
  - Rischio di loop infiniti se non si tracciano gli identificatori dei pacchetti già visti o non si decrementa un contatore TTL.

> Il flooding non è utilizzabile per il routing ordinario, ma trova impiego limitato in casi speciali (es. propagazione iniziale dello stato dei link in OSPF).

---

## Formulazione Matematica della Rete come Grafo

La topologia di una rete di calcolatori viene formalizzata mediante un **Grafo Pesato non Orientato**:
$$G = (N, E)$$
- **$N$ (Insieme dei Nodi)**: rappresenta i **Router** della rete ($|N|$ nodi).
- **$E$ (Insieme degli Archi)**: rappresenta i **Collegamenti Fisici (*Links*)** tra coppie di router adiacenti:
  $$E \subseteq N \times N$$
- A ogni arco $(u, v) \in E$ è associato un **Costo del Link $c(u, v)$**:
  - Il costo può riflettere la distanza geografica, la latenza di propagazione, l'inverso della larghezza di banda o un costo economico monetario.

### Definizione di Cammino a Costo Minimo (*Least-Cost Path*):
Un cammino $p = (x_1, x_2, \dots, x_k)$ ha un costo complessivo pari alla somma dei costi dei singoli archi:
$$\text{Costo}(p) = \sum_{i=1}^{k-1} c(x_i, x_{i+1})$$
L'algoritmo di routing ha l'obiettivo di individuare il cammino $p$ con il valore di $\text{Costo}(p)$ minimo tra qualsiasi coppia di nodi.

---

## Classificazione degli Algoritmi di Routing

Gli algoritmi di instradamento si dividono in due grandi famiglie in base a dove risiede la conoscenza topologica:

```
                          ALGORITMI DI ROUTING
                                    |
          +-------------------------+-------------------------+
          |                                                   |
   DECENTRALIZZATI / DISTRIBUITI                       CENTRALI / GLOBALI
   - Conoscenza puramente locale                       - Conoscenza topologica globale
   - I nodi parlano solo con i vicini                  - Mappa completa dell'intera rete
   - Calcolo iterativo distribuito                     - Calcolo centralizzato
   - Esempio: Distance-Vector (DV)                     - Esempio: Link-State (LS)
              (Algoritmo di Bellman-Ford)                         (Algoritmo di Dijkstra)
```

- **Statici vs Dinamici**: gli algoritmi moderni sono **dinamici**, capaci cioè di ricalcolare automaticamente i percorsi in tempo reale in risposta a guasti di collegamenti o variazioni di carico.

---

## L'Algoritmo Distance-Vector (DV)

L'algoritmo **Distance-Vector (Vettore delle Distanze)** è asincrono, iterativo e completamente decentralizzato:
- Ciascun nodo $x$ mantiene una stima del costo minimo verso ogni possibile destinazione $y \in N$, memorizzata nel vettore:
  $$D_x = [D_x(y) : y \in N]$$
- Si basa sull'**Equazione di Ottimalità di Bellman-Ford**:
  $$\mathbf{d_x(y) = \min_{v \in \text{Vicini}(x)} \{ c(x, v) + d_v(y) \}}$$

### Interpretazione della Formula:
Per andare da $x$ a $y$, il percorso migliore consiste nello scegliere il vicino $v$ che minimizza la somma tra:
1. Il costo immediato per raggiungere il vicino $v$ ($c(x, v)$).
2. Il costo stimato da quel vicino $v$ per raggiungere la destinazione finale $y$ ($d_v(y)$).

---

## Funzionamento Operativo del Distance-Vector

Ciascun nodo $x$:
1. Conosce inizialmente solo il costo dei propri collegamenti diretti verso i vicini immediati: $c(x, v)$. Per tutti gli altri nodi non adiacenti, assume $D_x(y) = \infty$.
2. Invia periodicamente una copia del proprio vettore delle distanze $D_x$ a tutti i suoi **vicini immediati**.
3. Quando un nodo $x$ riceve un nuovo vettore $D_w$ da un vicino $w$:
   - Aggiorna il proprio vettore applicando l'equazione di Bellman-Ford:
     $$D_x(y) \leftarrow \min_v \{ c(x, v) + D_v(y) \}$$
   - Se il costo $D_x(y)$ cambia, $x$ notifica immediatamente i propri vicini inviando il vettore aggiornato.
4. L'algoritmo converge in modo naturale quando non vi sono più variazioni di costo: i vettori calcolati convergono ai cammini minimi reali.

---

## Esempio di Convergenza dei Vettori delle Distanze

Consideriamo una topologia lineare a tre nodi: $u \longleftrightarrow v \longleftrightarrow z$, con costi $c(u, v) = 2$ e $c(v, z) = 3$:

```
 u <----(2)----> v <----(3)----> z
```

1. **Stato Iniziale ($t = 0$)**:
   - $u$ conosce solo $D_u = [u:0,\ v:2,\ z:\infty]$.
   - $v$ conosce solo $D_v = [u:2,\ v:0,\ z:3]$.
   - $z$ conosce solo $D_z = [u:\infty,\ v:3,\ z:0]$.
2. **Primo Scambio di Messaggi ($t = 1$)**:
   - $v$ comunica $D_v$ sia a $u$ che a $z$.
   - $u$ calcola: $D_u(z) = \min \{ c(u, v) + D_v(z) \} = 2 + 3 = 5$.
   - $z$ calcola: $D_z(u) = \min \{ c(z, v) + D_v(u) \} = 3 + 2 = 5$.
3. **Convergenza ($t = 2$)**:
   - Nessun nodo trova cammini più economici: i vettori si stabilizzano e le tabelle di inoltro sono configurate correttamente.

---

## La Dinamica delle Variazioni: Buone Notizie vs Cattive Notizie

Cosa accade quando le condizioni dei collegamenti cambiano nel tempo?

- **Le Buone Notizie Viaggiano Veloci (*Good News Travel Fast*)**:
  - Se il costo di un link diminuisce improvvisamente (es. da 50 a 1), i nodi adiacenti aggiornano subito i propri vettori con costi inferiori.
  - La diminuzione di costo si propaga a cascata e la rete converge a una nuova configurazione ottimale in pochissimi passaggi.
- **Le Cattive Notizie Viaggiano con Estrema Lentezza (*Bad News Travel Slowly*)**:
  - Se un link si guasta o il suo costo aumenta bruscamente, l'algoritmo Distance-Vector può generare **loop di instradamento** che impiegano decine di iterazioni per risolversi.
  - Questo grave difetto strutturale è noto come **Problema del Conteggio all'Infinito (*Count-to-Infinity*)**.

---

## Il Problema del Conteggio all'Infinito (*Count-to-Infinity*)

Consideriamo tre nodi $x, y, z$ in cui il costo del link $x-y$ passa bruscamente da **4 a 60**:

```
        (60) [era 4]
   x ------------------ y
    \                  /
 (50)\                /(1)
      \              /
       +----- z -----+
```

1. Prima del guasto: $D_y(x) = 4$, $D_z(x) = 5$ (passando attraverso $y$).
2. Il costo $c(x, y)$ diventa 60. Il nodo $y$ rileva il peggioramento e ricalcola $D_y(x)$:
   - $y$ esamina le opzioni: link diretto $x$ ($c = 60$) oppure passare attraverso $z$.
   - $y$ vede che l'ultimo vettore annunciato da $z$ diceva $D_z(x) = 5$!
   - $y$ calcola: $D_y(x) = c(y, z) + D_z(x) = 1 + 5 = 6$, credendo erroneamente che $z$ abbia un cammino alternativo verso $x$.
3. $y$ aggiorna il costo a 6 e lo annuncia a $z$.
4. $z$ riceve l'annuncio e calcola: $D_z(x) = c(z, y) + D_y(x) = 1 + 6 = 7$, rimandando il valore a $y$.
5. I due nodi continuano ad incrementare il costo a vicenda ($8, 9, 10, 11\dots$) creando un ciclo continuo finché il valore non supera 60 (o $\infty$).

---

## Soluzione al Count-to-Infinity: Poisoned Reverse

Per prevenire il conteggio all'infinito nei cicli a due nodi, si utilizza la tecnica della **Poisoned Reverse (Inversione Avvelenata)**:

### Regola Operativa:
- Se il nodo $z$ instradava il proprio traffico diretto a $x$ **passando attraverso il nodo $y$**, allora $z$ dichiara a $y$ una distanza infinita:
  $$\text{Annuncio di } z \text{ verso } y: \quad \mathbf{D_z(x) = \infty}$$
- In questo modo, $y$ non sarà mai tentato di deviare il traffico verso $x$ passando per $z$, sapendo che $z$ dipende già da $y$ stesso.
- Quando il link $x-y$ fallisce, $y$ non considera $z$ come alternativa valida e seleziona immediatamente il percorso reale più costoso (o dichiara $x$ irraggiungibile), bloccando il loop sul nascere.

> [!NOTE] Limite del Poisoned Reverse
> L'inversione avvelenata risolve brillantemente i loop tra due nodi direttamente connessi, ma **non risolve i loop che coinvolgono 3 o più nodi** in percorsi ad anello più ampi.  
> Nei protocolli reali (es. RIP), si impone un limite convenzionale all'infinito (fissato a $\infty = 16\text{ hop}$) per forzare l'arresto dei cicli.
