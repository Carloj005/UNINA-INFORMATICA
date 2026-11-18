#include <iostream> // Se questo dà errore, prova: import <iostream>;
#include <vector>
#include <random>

import svolgimenti;
import wrapper;

void run(const std::string& name, Node* T, int a, int b) {
    int res = luglio_2026_ricorsivo(T, a, b);
    std::cout << name << " -> risultato (ricorsivo) = " << res << std::endl;
    
    int res1 = luglio_2026_iterativo(T, a, b);
    std::cout << name << " -> risultato (iterativo) = " << res1 << std::endl;
}

int main() {
    // Caso 1: albero vuoto
    run("1. Albero vuoto", nullptr, 0, 100);

    // Caso 2: nodo singolo dentro range
    {
        Node* T = new Node(50);
        run("2. Nodo singolo dentro range", T, 0, 100);
    }

    // Caso 3: nodo singolo < a
    {
        Node* T = new Node(-10);
        run("3. Nodo singolo fuori range (sotto)", T, 0, 100);
    }

    // Caso 4: nodo singolo > b
    {
        Node* T = new Node(150);
        run("4. Nodo singolo fuori range (sopra)", T, 0, 100);
    }

    // Caso 5: BST "normale" (sx=piccolo, dx=grande) -> dovrebbe fallire
    {
        Node* sx = new Node(30);
        Node* dx = new Node(70);
        Node* T = new Node(50, sx, dx);
        run("5. BST standard (sx<50<dx)", T, 0, 100);
    }

    // Caso 6: albero "speculare" valido (dx=piccolo, sx=grande)
    {
        Node* dx = new Node(30);
        Node* sx = new Node(70);
        Node* T = new Node(50, sx, dx);
        run("6. Albero speculare valido a 2 livelli", T, 0, 100);
    }

    // Caso 7: albero speculare completo a 3 livelli, 7 nodi
    {
        Node* n20 = new Node(20);
        Node* n40 = new Node(40);
        Node* n30 = new Node(30, n40, n20); // sx=40, dx=20
        Node* n60 = new Node(60);
        Node* n80 = new Node(80);
        Node* n70 = new Node(70, n80, n60); // sx=80, dx=60
        Node* root = new Node(50, n70, n30); // sx=70(...), dx=30(...)
        run("7. Albero speculare completo (7 nodi)", root, 0, 100);
    }

    // Caso 8: sbilanciamento di conteggio a livello radice
    {
        Node* B = new Node(20);
        Node* A = new Node(30, nullptr, B); // dx=B
        Node* root = new Node(50, nullptr, A); // dx=A, sx=null
        run("8. Sbilanciamento diretto alla radice (l=2,r=0)", root, 0, 100);
    }

    // Caso 8b: sbilanciamento propagato dal basso (catena di 3 su dx)
    {
        Node* C = new Node(10);
        Node* B = new Node(20, nullptr, C);
        Node* A = new Node(30, nullptr, B);
        Node* sxLeaf = new Node(70);
        Node* root = new Node(50, sxLeaf, A);
        run("8b. Sbilanciamento propagato (catena dx di 3 nodi)", root, 0, 100);
    }

    // Caso 9: chiave duplicata sul lato dx (upper bound inclusivo)
    /*{
        Node* dxDup = new Node(50);
        Node* root = new Node(50, nullptr, dxDup);
        run("9. Duplicato su dx (key==parent.key)", root, 0, 100);
    }*/

    // Caso 9b: chiave duplicata sul lato sx (lower bound inclusivo)
    /*{
        Node* sxDup = new Node(50);
        Node* root = new Node(50, sxDup, nullptr);
        run("9b. Duplicato su sx (key==parent.key)", root, 0, 100);
    }*/

    // Caso 10: range iniziale che esclude la radice
    {
        Node* T = new Node(50);
        run("10. Range iniziale esclude radice", T, 60, 100);
    }

    // Caso 11: albero nullo con range invertito (a>b)
    {
        run("11. Albero nullo, range invertito (a>b)", nullptr, 10, 5);
    }

    // Caso 12: violazione locale (valore ok globalmente, ma viola bound relativo al genitore)
    {
        Node* B = new Node(35); // viola perche' 35 > A.key(30), ma è dentro [0,100] globale
        Node* A = new Node(30, nullptr, B);
        Node* root = new Node(50, nullptr, A);
        run("12. Violazione locale non globale (35 come dx di 30)", root, 0, 100);
    }

    // Caso 13: valori negativi, tutto speculare valido
    {
        Node* n_20 = new Node(-20);
        Node* n_40 = new Node(-40);
        Node* n_30 = new Node(-30, n_40, n_20);
        Node* root = new Node(-50, nullptr, n_30);
        run("13. Valori negativi, speculare valido", root, -100, 0);
    }

    return 0;
}