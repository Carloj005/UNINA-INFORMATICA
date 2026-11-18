export module wrapper;

// Struttura del Nodo dell'albero
export struct Node {
    int key;
    Node* sx, * dx;
    // Il costruttore DEVE inizializzare a nullptr, altrimenti non finisce mai!
    Node(int k) : key(k), sx(nullptr), dx(nullptr) {}
    Node(int k, Node* sx, Node* dx) : key(k), sx(sx), dx(dx) {}
};

export Node* creaAlberoComplesso() {
    // Livello 0: Radice
    Node* root = new Node(2);

    // Livello 1
    root->dx = new Node(3); // Destro
    root->sx = new Node(5); // Sinistro

    // Livello 2 (Figli del nodo DX)
    root->dx->dx = new Node(1); // Estremo destro
    // root->dx->sx resta nullptr per testare l'asimmetria

    // Livello 2 (Figli del nodo SX)
    root->sx->dx = new Node(4);
    root->sx->sx = new Node(6);

    return root;
}


// Funzioni esterne (Esempio: identità o semplici calcoli)
export int G(int n) { return n + 1; }
export int H(int m) { return m * 2; }

// Funzioni esterne (supponiamo siano queste)
export int FUNC(int i, int j) { return i + (j - i) / 2; }
export int MAX(int a, int b) { return (a >= b) ? a : b; }
