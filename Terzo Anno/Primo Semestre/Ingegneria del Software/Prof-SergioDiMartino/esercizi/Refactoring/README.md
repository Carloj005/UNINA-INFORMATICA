# Esercitazione Refactoring — Movie Rental (Martin Fowler)

Materiale fornito per le lezioni ed esercitazioni di **Ingegneria del Software** (Prof. Sergio Di Martino).

## 📖 Descrizione

Questo progetto implementa il celebre caso di studio didattico del sistema di noleggio film (*Video Store / Movie Rental*) tratto dal libro *"Refactoring: Improving the Design of Existing Code"* di **Martin Fowler**.

Viene utilizzato a lezione e in laboratorio come codice di partenza (*starting point*) per l'individuazione di **bad smell** e l'applicazione sistematica delle tecniche di **refactoring**:
- **Code smells presenti:** *Long Method* (`Customer.statement()`), *Feature Envy*, *Switch Statements* basati su codici di tipo (`priceCode`).
- **Tecniche di refactoring applicabili:** *Extract Method*, *Move Method*, *Replace Temp with Query*, *Replace Type Code with State/Strategy* o *Polymorphism*.
- **Test di regressione:** la suite di test JUnit (`CustomerTest.java`) garantisce che il comportamento esterno del codice rimanga invariato durante e dopo ogni passaggio di refactoring.

## 📁 Struttura

```
Refactoring/
├── README.md
└── src/
    ├── main/java/movierental/
    │   ├── Customer.java   # Gestione cliente, noleggi e calcolo del conto (statement)
    │   ├── Movie.java      # Definizione film e codici prezzo (REGULAR, NEW_RELEASE, CHILDRENS)
    │   └── Rental.java     # Associazione noleggio (film e giorni noleggiati)
    └── test/java/movierental/
        └── CustomerTest.java # Test JUnit 4 di regressione
```

## 🚀 Esecuzione dei Test

I sorgenti possono essere aperti direttamente in qualsiasi IDE Java moderno (**IntelliJ IDEA**, **Eclipse**, **VS Code**):
- Aprire la cartella `Refactoring` come progetto Java.
- Eseguire la classe `CustomerTest` come test JUnit per verificare che la suite sia verde prima e dopo ogni operazione di refactoring.
