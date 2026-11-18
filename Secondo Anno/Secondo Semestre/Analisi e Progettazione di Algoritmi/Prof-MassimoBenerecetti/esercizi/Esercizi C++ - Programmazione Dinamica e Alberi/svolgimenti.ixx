module;

#include <iostream>	
#include <vector>
#include <stack>
#include <algorithm>

export module svolgimenti;

import wrapper;

#pragma region VECCHI test
/*
    std::vector<int> c = { 100,200,300,400,500,600,700,800,900,1000,1100,1200,1300,1400,1500,1600 };

    std::cout << "Ricorsivo: " << ALGO_ricorsivo(c, 0, 15, 1) << std::endl;

    std::cout << "Iterativo: " << ALGO_tecnica_prof(c, 0, 15, 1) << std::endl;

    Node* albero = creaAlberoComplesso();
    int n_test = 2;

    std::cout << "--- TEST ALBERO COMPLESSO ---" << std::endl;

    int ric = luglio_2025_ricorsivo(albero, n_test);
    std::cout << "Risultato Ricorsivo: " << ric << std::endl;

    int ite = luglio_2025_iterativo(albero, n_test);
    std::cout << "Risultato Iterativo: " << ite << std::endl;
 */

 /*
 std::vector<int> c = { 100,200,300,400,500,600,700,800,900,1000,1100,1200,1300,1400,1500,1600 };

 int r1 = marzo_2026_ricorsivo(c, 3, 3, 500);

 int r2 = marzo_2026_ricorsivo(c, 0, 15, 1000);

 int r3 = marzo_2026_ricorsivo(c, 0, 0, 101);

 std::cout << r1 << " " << r2 << " " << r3 << std::endl;

 r1 = marzo_2026_iterativo_1(c, 3, 3, 500);

 r2 = marzo_2026_iterativo_1(c, 0, 15, 1000);

 r3 = marzo_2026_iterativo_1(c, 0, 0, 101);

 std::cout << r1 << " " << r2 << " " << r3 << std::endl;
 */

 /*
 Node* albero = creaAlberoComplesso();

 std::cout << "--- TEST ALBERO COMPLESSO ---" << std::endl;
 int ite = luglio_2024_ricorsivo(albero);
 std::cout << "Risultato Ricorsivo: " << ite << std::endl;

 int ric = luglio_2024_iterativo_originale(albero);
 std::cout << "Risultato Iterativo: " << ric << std::endl;
 */

 /*Node* albero = creaAlberoComplesso();

 std::cout << "--- TEST ALBERO COMPLESSO ---" << std::endl;

 for (int j = -10; j < 10; j++)
 {
     std::cout << "--- TEST ALBERO COMPLESSO ---" << std::endl;

     int ric = luglio_2025_ricorsivo(albero, j);
     std::cout << "Risultato Ricorsivo: " << ric << std::endl;

     int ite = luglio_2025_iterativo_mio(albero, j);
     std::cout << "Risultato Iterativo: " << ite << std::endl;
 }*/

#pragma endregion

export int luglio_2026_ricorsivo(Node* T, int a, int b)
{
    if (T == nullptr) return 0;                        
    if (T->key < a || T->key > b) return -1;           

    int l = luglio_2026_ricorsivo(T->dx, a, T->key);                
    if (l == -1) return -1;                            

    int r = luglio_2026_ricorsivo(T->sx, T->key, b);                
    if (r == -1 || std::abs(l - r) > 1) return -1;      

    return 1 + l + r;                                    
    
}

export int luglio_2026_iterativo(Node* T, int a, int b) {
    std::stack<Node*> S_T;
    std::stack<int> S_b;
    std::stack<int> S_l;

    bool call = true;
    int last = 0;
    int ret = 0;

    while (call || !S_b.empty()) {
        if (call) {
            if (T == nullptr) {
                ret = 0;
                call = false;
                last = b;
            }
            else if (T->key < a || T->key > b) {
                ret = -1;
                call = false;
                last = b;
            }
            else {
                S_T.push(T);
                S_b.push(b);

                b = T->key;
                T = T->dx;
            }
        }
        else {
            T = S_T.top();
            b = S_b.top();

            if (last == T->key) {
                int l = ret;

                if (l == -1) {
                    ret = -1;
                    last = b;
                    S_T.pop();
                    S_b.pop();
                }
                else {
                    S_l.push(l);

                    a = T->key;
                    // 'b' è già stato ripristinato in cima all'else
                    T = T->sx;
                    call = true;
                }
            }
            else {
                int r = ret;
                int l = S_l.top();

                if (r == -1 || std::abs(l - r) > 1) {
                    ret = -1;
                    last = b;

                    S_l.pop();
                    S_T.pop();
                    S_b.pop();
                }
                else {
                    ret = 1 + l + r;
                    last = b;

                    S_l.pop();
                    S_T.pop();
                    S_b.pop();
                }

            }
        }
    }
    return ret;
}

// --- VERSIONE ITERATIVA CON 3 STACK SEPARATI ---
export int giugno_2026_iterativo(Node* T, int i) {
    // Separazione dei 3 stack paralleli
    std::stack<Node*> S_T;
    std::stack<int> S_i;
    std::stack<int> S_a;

    bool call = true;
    int last = -1;
    int ret = 0;

    while (call || !S_T.empty()) {
        if (call) {
            int a = G(i);
            if (T == nullptr) {
                ret = a;
                last = i;
                call = false; // Inizia la risalita
            }
            else {
                // Discesa a SINISTRA: facciamo il push su ciascuno dei 3 stack
                S_T.push(T);
                S_i.push(i);
                S_a.push(a);

                // Aggiorniamo i parametri per il figlio sinistro
                T = T->sx;
                i = 3 * i;
            }
        }
        else {
            // Risalita: leggiamo l'elemento in cima ai 3 stack (equivalente a .top())
            T = S_T.top();
            i = S_i.top();
            int a = S_a.top();

            if (last == 3 * i) {
                // CASO 1: Torniamo dal figlio sinistro
                int a_nuovo = H(ret) + (T->key) * i + a;

                // Aggiorniamo il valore di 'a' per questo livello negli stack.
                // Rimuoviamo il vecchio valore e inseriamo quello aggiornato.
                //S_T.pop(); S_i.pop(); 
                S_a.pop();
                //S_T.push(T); S_i.push(i);
                S_a.push(a_nuovo);

                // Prepariamo i parametri per scendere nel figlio destro
                T = T->dx;
                i = 3 * i + 2;
                call = true;
            }
            else {
                // CASO 2: Torniamo dal figlio destro (oppure il figlio destro non esiste ed è Nil)
                // Rimuoviamo definitivamente il record di attivazione del padre da tutti e 3 gli stack
                S_T.pop();
                S_i.pop();
                a = S_a.top();
                S_a.pop();


                int z = a + ret;
                ret = H(3 * z);

                last = i;
            }
        }
    }
    return ret;
}

export int giugno_2026_ricorsivo(Node* T, int i)
{
    int a = G(i);

    if (T == nullptr)
    {
        return a;
    }
    else
    {
        int z = giugno_2026_ricorsivo(T->sx, 3 * i);
        a = H(z) + T->key * i + a;
        z = a + giugno_2026_ricorsivo(T->dx, 3 * i + 2);
        return H(3 * z);
    }

}

// IMPLEMENTAZIONE FATTA A LEZIONE
export int marzo_2026_iterativo(const std::vector<int>& A, int i, int j, int k)
{
    std::stack<int> Sj, Sk, Sm, Sret;
    bool call = true;

    int m = 0;
    int last = 0;
    int ret = 0;

    while (call || !Sm.empty())
    {

        if (call)
        {
            ret = -1;

            if (i < j)
            {
                m = FUNC(i, j);

                if (A[m] < k)
                {
                    ret = m;
                    call = false;
                    last = m;
                }
                else
                {
                    if (2 * i <= m)
                    {
                        Sj.push(j);
                        Sm.push(m);
                        Sk.push(k);

                        j = m - 1;
                        k = k - 1;

                        // I last devi metterli solo nei casi base
                        //last = i;

                    }

                    if (2 * m <= j)
                    {
                        Sm.push(m);
                        Sret.push(ret);
                        //Sk.push(k);

                        i = m + 1;
                        k = k + 1;
                        //last = m + 1;
                    }

                    else
                    {
                        call = false;
                        last = m;
                    }
                }
            }
            else
            {
                if (A[i] < k)
                {
                    ret = i;
                    call = false;
                    last = m;
                }
            }
        }
        else
        {
            m = Sm.top();

            if (last != m + 1)
            {
                j = Sj.top();
                k = Sk.top();

                if (2 * m <= j)
                {
                    Sret.push(ret);
                    i = m + 1;
                    k = k + 1;
                    call = true;
                }
                else
                {
                    last = m;
                    Sm.push(m);
                    Sj.push(j);
                    Sk.push(k);
                }

            }
            else
            {
                int ret1 = ret;
                ret = Sret.top();
                ret = MAX(ret1, ret);

                last = m;

                Sm.pop();
                Sret.pop();
                Sj.pop();
                Sk.pop();

            }

        }

    }

    return ret;
}

export int marzo_2026_ricorsivo(const std::vector<int>& A, int i, int j, int k) {
    int ret = -1;

    if (i < j) {
        int m = FUNC(i, j);

        if (A[m] < k) {
            ret = m;
        }
        else {
            if (2 * i <= m) {
                ret = marzo_2026_ricorsivo(A, i, m - 1, k - 1);
            }
            if (2 * m <= j) {
                ret = MAX(ret, marzo_2026_ricorsivo(A, m + 1, j, k + 1));
            }
        }
    }
    else {
        if (A[i] < k) {
            ret = i;
        }
    }

    return ret;
}

// IMPLEMENTAZIONE FATTA A LEZIONE
export int luglio_2025_iterativo(Node* T, int n)
{
    std::stack<int> S_n, S_r1, S_m;
    
    std::stack<Node*> S_T;
    
    bool call = true;

    int r1, r2, m, ret, last;
    r1 = r2 = m = ret = -1000000;

    while (call || !S_n.empty())
    {
        if (call)
        {
            int m = G(n);

            if (T != nullptr)
            {
                S_T.push(T);
                S_n.push(n);
                S_m.push(m);

                T = T->dx;
                n = 3 * n;
            }
            else
            {
                call = false;
                last = n;
                ret = H(G(n));
            }
        }
        else
        {
            
            T = S_T.top();
            n = S_n.top();
            m = S_m.top();

            if (last == 3 * n)
            {
                r1 = ret;
                S_r1.push(r1);

                T = T->sx;
                n = 3 * n + 1;
                call = true;

            }
            else
            {
                r2 = ret;

                r1 = S_r1.top();
                m = std::min(m * T->key, r1 * r2);
                ret = H(m);
                last = n;

                S_T.pop();
                S_n.pop();
                S_m.pop();
                S_r1.pop();
            }
        }
    }

    return ret;
}

export int luglio_2025_ricorsivo(Node* T, int n) {
    int m = G(n); 

    if (T != nullptr) { 
        int r1 = luglio_2025_ricorsivo(T->dx, 3 * n);
        int r2 = luglio_2025_ricorsivo(T->sx, 3 * n + 1);
        m = std::min(m * T->key, r1 * r2);
    }

    return H(m);
}

// CORRETTO DAL PROFESSORE
export int giugno_2025_iterativo(Node* T, int n)
{
    std::stack<Node*> S_t;
    std::stack<int>   S_n;

    bool  call = true;
    Node* last = nullptr;
    int   ret = 0;

    int a = 0;

    while (call || !S_t.empty()) {
        if (call) {
            n = G(n);

            if (T != nullptr && T->key > n) {
                S_t.push(T);
                S_n.push(n);

                T = T->dx;
            }
            else {
                last = T;
                call = false;
                ret = n;
            }
        }
        else {
            T = S_t.top();
            n = S_n.top();

            if (last == T->dx) {
                a = ret;
                n = n + a;

                if (T->sx != nullptr) {
                    
                    S_n.top() = n;

                    T = T->sx;

                    call = true;
                }
                else {

                    ret = G(n);
                    
                    a = ret;
                    
                    ret = MAX(n, a);
                    
                    last = T;
                    
                    S_t.pop();
                    S_n.pop();
                }
            }
            else {

                //n = S_n.top();
                //a = S_a.top();
                
                //int b = ret;

                ret = MAX(n, ret);
                
                last = T;

                S_t.pop();
                S_n.pop();
                //S_a.pop();
            }
        }
    }

    return ret;
}

export int giugno_2025_ricorsivo(Node* T, int n)
{
    n = G(n);

    if (T != nullptr && T->key > n)
    {
        int a = giugno_2025_ricorsivo(T->dx, n);
        n = n + a;

        a = giugno_2025_ricorsivo(T->sx, n);
        n = MAX(n, a);
    }

    return n;
}

// CORRETTO DAL PROFESSORE
export int settembre_2024_iterativo(Node* T, int i)
{
    std::stack<Node*> St;

    std::stack<int> Sa, Si;

    bool call = true;

    int a, last, ret;

    while (call || !St.empty())
    {

        if (call)
        {
            a = G(i);

            if (T != nullptr)
            {
                Si.push(i);
                Sa.push(a);
                St.push(T);

                T = T->dx;
                i = 2 * i;

            }
            else
            {
                call = false;
                last = i;
                ret = H(a);
            }
        }
        else
        {
            i = Si.top();
            T = St.top();
            a = Sa.top();

            if (last == 2 * i)
            {
                a = a * ret + T->key;
                
                Sa.pop();
                Sa.push(a);

                T = T->sx;
                i = 2 * i + 1;

                call = true;
            }
            else
            {
                a = a * ret;

                ret = H(a);
                last = i;

                Sa.pop();
                St.pop();
                Si.pop();
            }
        }
    }

    return ret;
}

export int settembre_2024_ricorsivo(Node* T, int i)
{
    int a = G(i);

    if (T != nullptr)
    {
        int z = settembre_2024_ricorsivo(T->dx, 2 * i);

        a = a * z + T->key;

        z = settembre_2024_ricorsivo(T->sx, 2 * i + 1);
        
        a = a * z;

    }

    return H(a);
}

// CORRETTO DAL PROFESSORE
export int luglio_2024_iterativo(Node* T)   
{
    int x;
    int ret;
    int r;

    std::stack<Node*> St;
    std::stack<int> Sx;

    bool call = true;
    Node* last = nullptr;

    while (call || !St.empty())
    {
        if (call)
        {
            r = 1;
            if (T != nullptr)
            {
                x = T->key % 2;

                Sx.push(x);
                St.push(T);

                T = T->dx;
            }
            else
            {
                call = false;
                last = T;
                ret = r;        // caso base: return 1
            }
        }
        else
        {
            T = St.top();
            x = Sx.top();

            if (last == T->dx)
            {
                r = ret;
                x = r + x;       // aggiorna x col risultato da dx

                if (T->sx != nullptr)
                {
                    Sx.pop();
                    Sx.push(x);        // sovrascrive x nello stack
                    T = T->sx;
                    call = true;
                }
                else
                {
                    r = x * r * T->key;
                    ret = r;
                    last = T;
                    St.pop();
                    Sx.pop();
                }
            }
            else    // ritorno da T->sx
            {
                r = x * r * T->key;
                ret = r;
                last = T;
                St.pop();
                Sx.pop();
            }
        }
    }

    return ret;
}

export int luglio_2024_ricorsivo(Node* T)
{
    int r = 1;

    if (T != nullptr)
    {
        int x = T->key % 2;
        r = luglio_2024_ricorsivo(T->dx);
        x = r + x;
        r = luglio_2024_ricorsivo(T->sx);
        r = x * r * T->key;
    }

    return r;
}
