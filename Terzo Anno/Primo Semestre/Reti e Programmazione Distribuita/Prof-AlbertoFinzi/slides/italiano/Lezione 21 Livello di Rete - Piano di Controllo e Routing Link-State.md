---
marp: true
theme: default
paginate: true
header: "Reti e Programmazione Distribuita - Prof. Alberto Finzi"
footer: "Università degli Studi di Napoli Federico II"
---

# Reti e Programmazione Distribuita
## Lezione 21: Il Livello di Rete — Il Piano di Controllo e Routing Link-State

**Prof. Alberto Finzi**  
Corso di Laurea in Informatica  
Scuola Politecnica e delle Scienze di Base  
Università degli Studi di Napoli Federico II

---

## L'Algoritmo Link-State (LS): Conoscenza Topologica Globale

Mentre il Distance-Vector opera con conoscenza puramente locale, l'approccio **Link-State (Stato dei Collegamenti)** si basa su una filosofia opposta:
- **Tutti i router conoscono l'intera topologia della rete** e i costi di tutti i collegamenti fisici.
- Il funzionamento si articola in due macro-fasi distinte:
  1. **Fase di Annuncio (*Link-State Broadcast*)**: ogni router monitora lo stato dei propri collegamenti diretti e invia pacchetti informativi (**LSP - Link State Packets**) a tutti gli altri router della rete mediante inondazione controllata (*Flooding*). Al termine, ogni nodo dispone dello stesso identico database topologico.
  2. **Fase di Calcolo Locale**: ciascun router esegue in locale l'**Algoritmo di Dijkstra** per calcolare l'albero dei cammini a costo minimo da sé verso tutte le altre destinazioni.

---

## L'Algoritmo di Dijkstra: Formulazione Matematica

Dato il grafo della rete $G = (N, E)$ e un nodo sorgente $u$:
- **$N'$**: insieme dei nodi per i quali il cammino a costo minimo dal nodo sorgente è già stato determinato in via definitiva.
- **$D(v)$**: costo del cammino a costo minimo attualmente noto dalla sorgente $u$ al nodo $v$.
- **$p(v)$**: nodo predecessore immediato di $v$ lungo il cammino minimo attualmente individuato.
- **$c(i, j)$**: costo del link diretto tra il nodo $i$ e il nodo $j$ (posto a $\infty$ se non esiste un arco diretto).

### Inizializzazione:
- $N' = \{u\}$
- Per ogni nodo $v \in N$:
  - Se $v$ è adiacente a $u$: $D(v) = c(u, v)$, $p(v) = u$
  - Altrimenti: $D(v) = \infty$

---

## Pseudocodice dell'Algoritmo di Dijkstra

```text
LinkState(sorgente u):
    N' = {u}
    Per ogni nodo v:
        se v è vicino di u:
            D(v) = c(u, v)
            p(v) = u
        altrimenti:
            D(v) = infinito

    Ripeti finché N' != N:
        Trova w non appartenente ad N' tale che D(w) è minimo
        Aggiungi w ad N'

        Per ogni vicino v di w che non appartiene ad N':
            se D(w) + c(w, v) < D(v) allora:
                D(v) = D(w) + c(w, v)
                p(v) = w
```

> A ogni iterazione, l'algoritmo rende definitivo il costo per il nodo $w$ più vicino non ancora esplorato, e aggiorna le distanze di tutti i suoi vicini non ancora consolidati (*Relaxation*).

---

## Esecuzione Passo-Passo di Dijkstra (Topologia a 6 Nodi)

Consideriamo una rete composta dai nodi $\{u, v, w, x, y, z\}$ con sorgente in $u$:

| Passo | Insieme $N'$ | $D(v), p(v)$ | $D(x), p(x)$ | $D(w), p(w)$ | $D(y), p(y)$ | $D(z), p(z)$ |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| **Iniz.** | $\{u\}$ | **$2, u$** | $1, u$ | $5, u$ | $\infty$ | $\infty$ |
| **1** | $\{u, x\}$ | $2, u$ | - | **$4, x$** | $2, x$ | $\infty$ |
| **2** | $\{u, x, y\}$ | $2, u$ | - | $3, y$ | - | **$4, y$** |
| **3** | $\{u, x, y, v\}$ | - | - | **$3, y$** | - | $4, y$ |
| **4** | $\{u, x, y, v, w\}$ | - | - | - | - | **$4, y$** |
| **5** | $\{u, x, y, v, w, z\}$ | - | - | - | - | - |

- Al termine, il nodo sorgente $u$ ha determinato la distanza ottima e il percorso minimo verso ogni singolo nodo della rete.

---

## Costruzione della Tabella di Inoltro (*Forwarding Table*)

Al termine dell'algoritmo di Dijkstra, il nodo $u$ ottiene l'**Albero dei Cammini Minimi (*Shortest Path Tree*)** radicato in $u$:

```
                 [ u ] (Radice)
                /     \
         (c=2) /       \ (c=1)
              v         v
            [ v ]     [ x ]
                     /     \
              (c=1) /       \ (c=1)
                   v         v
                 [ y ]     [ w ]
                   |
             (c=2) |
                   v
                 [ z ]
```

### Derivazione dell'Interfaccia di Inoltro:
- Per ogni destinazione, $u$ risale i predecessori fino al **primo salto (*Next-Hop*)** collegato direttamente a una delle proprie interfacce fisiche.
- Destinazione $z$: cammino $u \to x \to y \to z \implies$ **Inoltra all'interfaccia verso il link $(u, x)$**.
- Destinazione $v$: cammino diretto $u \to v \implies$ **Inoltra all'interfaccia verso il link $(u, v)$**.

---

## Complessità Computazionale di Dijkstra

La complessità dell'algoritmo dipende dalla struttura dati impiegata per estrarre il nodo a costo minimo ad ogni passo:

1. **Implementazione Standard con Ricerca Lineare**:
   - Ad ogni iterazione $i$ vengono esaminati $|N| - i$ nodi.
   - Numero totale di operazioni:
     $$\sum_{i=1}^{|N|} (|N| - i) = \frac{|N|(|N| - 1)}{2} \implies \mathbf{O(|N|^2)}$$
2. **Implementazione Ottimizzata con Heap / Code con Priorità**:
   - Memorizzando i nodi in una coda con priorità (*Min-Heap* o *Fibonacci Heap*), l'estrazione del minimo e il decremento delle chiavi richiedono tempo logaritmico.
   - Complessità complessiva:
     $$\mathbf{O(|E| + |N|\log|N|)}$$
   - Permette a reti con migliaia di router di eseguire il calcolo in frazioni di secondo.

---

## Confronto Completo: Distance-Vector (DV) vs Link-State (LS)

| Criterio | Distance-Vector (Bellman-Ford) | Link-State (Dijkstra) |
| :--- | :--- | :--- |
| **Conoscenza Topologica** | **Locale**: conosce solo i vicini immediati e le distanze stimate. | **Globale**: conosce la mappa topologica completa della rete. |
| **Complessità dei Messaggi** | **Bassa**: scambi limitati ai soli vicini diretti. | **Elevata**: diffusione broadcast di pacchetti LSP a tutti i router. |
| **Velocità di Convergenza** | **Lenta**: suscettibile a loop e al problema del *Count-to-Infinity*. | **Rapida**: nessun loop di instradamento interno. |
| **Robustezza ai Guasti** | **Minore**: un router malfunzionante può diffondere costi errati a tutta la rete. | **Maggiore**: ogni nodo calcola in autonomia la propria tabella locale. |
| **Protocolli Reali** | **RIP** (*Routing Information Protocol*), EIGRP | **OSPF** (*Open Shortest Path First*), IS-IS |

> Negli Autonomous System aziendali e campus di medie-grandi dimensioni, **OSPF (Link-State)** è il protocollo preferito per la sua rapidità e stabilità.
