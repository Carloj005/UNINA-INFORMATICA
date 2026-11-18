module;

#include <iostream>	
#include <vector>
#include <string>
#include <stack>
#include <unordered_map>
#include <algorithm>

export module programmazione_dinamica;

import wrapper;
import wrapper_program_dinamica;

export int INF = 1000;

#pragma region Algoritmi LeetCode

#pragma region Algoritmi facili

export bool isSubsequence(std::string s, std::string t) {

	int l1 = s.length();
	int l2 = t.length();
	
	if (l1 > l2) return false;

	int c = 0;

	std::string temp;
	int max = l1;

	if (l2 > l1)
	{
		temp = s;
		s = t;
		t = temp;
		max = l2;
	}

	for (int j = 0, k = 0; j < max; )
	{
		if (s[j] == t[k])
		{
			j++;
			k++;
			c++;
		}
		else
		{
			j++;
		}
	}

	return (c == t.size() && (c != 0 || l1 <= l2));

}

export int maxProfit(std::vector<int>& prices) {

	int min = 100000;
	int max = -10000;

	int output = 0;

	for (int j = 0; j < prices.size(); j++)
	{
		if (max < prices[j])
			max = prices[j];

		if (min > prices[j])
			min = prices[j];

		if (max - min <= 0)
		{
			max = -10000;
		}
		else
		{
			if ( output < max - min )
				output = max - min;

			max = -10000;
		}
	}

	return output;
}

export std::vector<int> generatePascal2(int numRows) {
	std::vector<int> a(++numRows);
	
	int** matrix = (int**)malloc(sizeof(int*) * numRows);

	for (int j = 0; j < numRows; j++)
		matrix[j] = (int*)calloc(numRows, sizeof(int) * numRows);

	matrix[0][0] = 1;

	a[0] = matrix[0][0];

	for (int j = 1; j < numRows; j++)
	{
		for (int k = 0; k < numRows; k++)
		{
			matrix[j][k] = matrix[j - 1][k] + ((k - 1 < 0) ? 0 : matrix[j - 1][k - 1]);
		}

		if (j == numRows - 1)
		{
			for (int k = 0; k < numRows; k++)
			{
				if (matrix[j][k] != 0)
					a[k] = (matrix[j][k]);
			}
		}
	}

	return a;
}

export std::vector<std::vector<int>> generatePascal(int numRows) {
	
	std::vector<std::vector<int>> a(numRows);
	std::vector<int> b;

	int** matrix = (int**)malloc(sizeof(int*) * numRows);

	for (int j = 0; j < numRows; j++)
		matrix[j] = (int*)calloc(numRows, sizeof(int) * numRows);

	matrix[0][0] = 1;

	a[0] = { matrix[0][0] };

	for (int j = 1; j < numRows; j++)
	{
		for (int k = 0; k < numRows; k++)
		{
			matrix[j][k] = matrix[j - 1][k] + ((k - 1 < 0) ? 0 : matrix[j - 1][k - 1]);
			
			if ( matrix[j][k] != 0)
				b.push_back(matrix[j][k]);
		}

		a[j] = b;
		b.clear();
	}

	return a;
}

#pragma endregion

#pragma region Algoritmi medi

/*
	Problema del tronco:
	Ho un tronco di lunghezza L e ho dei prezzi P (P1, P2, P3, ..., Pn) che simboleggiano
	il prezzo rispetto ad un taglio n. L'obiettivo è trovare il modo migliore di tagliare
	il tronco per il guadagno massimo possibile.

	Questa è una mia implementazione che funziona. 
	Faccio andare un array da SX verso DX e l'altro
	da DX verso SX facendo in modo che tra loro non si scavalchino e calcolo
	il massimo per ogni taglio.
*/

export int rodCut(int L, std::vector<int> prezzi)
{
	std::vector<int> bestCut(L + 1, 0);

	for (int j = 0; j <= L; j++)
	{
		
		int valoreMassimo = 0;

		for (int k = 0; k <= j; k++)
		{

			if (valoreMassimo < prezzi[j - k] + bestCut[k])
			{
				valoreMassimo = prezzi[j - k] + bestCut[k];
			}

		}

		bestCut[j] = valoreMassimo;
	}
	
	return bestCut[prezzi.size() - 1];
}

/*
	Hai a disposizione un set di monete di diverso valore (ad esempio $\{1, 2, 5\}$) e un importo 
	totale da raggiungere (ad esempio $11$). Hai una fornitura infinita di ciascuna moneta.

	OSS personali: Se approcciassi con uno stile greedy qui farei 5 + 5 + 1 che va bene ma ci sono
	situazioni come ammontare = 12, { 1, 3, 5 } dove se scegliessi quello più grande es. 5 + 5 + 1 + 1
	che non è la scelta migliore, la migliore sarebbe 3 + 3 + 3

	ammontare = 12, { 1, 3, 5 }
	[ 0 0 0 0 0 0 0 0 0 0 0 0 ] (12 zeri)
	[ 1 2 3 4 5 6 7 8 9 10 11 12 ] (se scegliessi tutti tagli da 1)
	[ 0 0 1 0 0 2 0 0 3 0 0 4 ] (tutte monete da 3)
	[ 0 0 0 0 1 0 0 0 0 2 3 4 ] (tutte monete da 5 e poi da 1)

	ammontare = 13, { 1, 3, 5 }
	[ 0 0 0 0 1 0 0 0 0 2 0 0 3 ] ( 5 + 5 + 3 )
	[ 0 0 1 0 0 2 0 0 3 0 0 4 5 ] ( 3 + 3 + 3 + 3 + 1)
	
*/

export int coinChangeProblem(std::vector<int> tagli, int resto)
{

	std::vector<int> DP(resto + 1, 1000);
	DP[0] = 0;

	for (int j = 1; j <= resto; j++)
	{

		for (int k = 0; k < tagli.size(); k++)
		{
			int t = j - tagli[k];

			if ( t < DP[j] && t >= 0)
			{
				DP[j] = DP[j - tagli[k]] + 1;
			}
		}
	}

	return DP[resto];
}

#pragma endregion

#pragma endregion

#pragma region Algoritmi Tabulation

// Ok quindi avevo fatto tutto giusto in realtà, mo devo fare la memorizzazione
export int min_climb_stairs(std::vector<int> scale, int i)
{
	if (i == 0) return scale[i];
	if (i == 1) return scale[i];

	return std::min( min_climb_stairs( scale, i - 1 ), min_climb_stairs(scale, i - 2)) + scale[i];
}

// Implementato perfettamente
export int min_climb_stairs_mem(std::vector<int> scale)
{
	std::vector<int> dp(scale.size() + 1, 0);

	dp[0] = scale[0];
	dp[1] = scale[1];

	for (int j = 2; j < scale.size() + 1; j++)
	{
		dp[j] = std::min( scale[j - 1], scale[j - 2]);
	}

	return dp[scale.size()];
}

export int ladro_ricorsivo(std::vector<int> caseSvaligiare, int i)
{

	if (i == 0) return caseSvaligiare[i];
	if (i == 1) return std::max(caseSvaligiare[i], caseSvaligiare[0]);

	return std::max(ladro_ricorsivo(caseSvaligiare, i - 1), ladro_ricorsivo(caseSvaligiare, i - 2) + caseSvaligiare[i]);

}

std::unordered_map<int, int> a = {};

export int ladro_ricorsivo_memorizzato(std::vector<int> caseSvaligiare, int i)
{
	if (a.find(i) != a.end())
		return a[i];

	if (i == 0)
	{
		a[i] = caseSvaligiare[i];
		return a[i];
	}

	if (i == 1)
	{
		if (caseSvaligiare[i] > caseSvaligiare[0])
		{
			a[i] = caseSvaligiare[i];
			return a[i];
		}
		else
		{
			a[0] = caseSvaligiare[0];
			return a[0];
		}
	}

	return std::max(ladro_ricorsivo_memorizzato(caseSvaligiare, i - 1), ladro_ricorsivo_memorizzato(caseSvaligiare, i - 2) + caseSvaligiare[i]);

}

// Questo parte da 0
export int ladro_iterativo(std::vector<int> caseSvaligiate)
{
	
	std::vector<int> caseS(caseSvaligiate.size() + 1, 0);

	caseS[1] = caseSvaligiate[1];

	for (int i = 2; i < caseSvaligiate.size(); i++)
	{
		caseS[i] = std::max(caseS[i - 1], caseS[i - 2] + caseSvaligiate[i]);
	}

	return caseS[caseSvaligiate.size() - 1];
}

#pragma endregion

#pragma region Algoritmi che non sono riuscito a scrivere

export int generate_pascal_triangle(int r, int c)
{
	if (r == 0 || c == r)
		return 1;

	return generate_pascal_triangle(r - 1, c - 1) + generate_pascal_triangle(r - 1, c);
}

#pragma endregion

#pragma region Algoritmi medi

#pragma region Algoritmi iterativi medi

// RICEVIMENTO: Scritto da me, andrebbe bene?
export std::string iterative_longest_common_subsequence(std::string X, std::string Y)
{
	std::string final = "";

	int i, j;
	i = X.length() - 1;
	j = Y.length() - 1;

	while (i >= 0 || j >= 0)
	{
		if (X[i] == Y[j])
		{
			final += X[i];
			i--;
			j--;
		}
		else
		{
			if (i > j)
			{
				i--;
			}
			else
			{
				j--;
			}
		}
	}

	std::reverse(final.begin(), final.end());

	return final;
}

// Definiamo una struttura per poter restituire sia l'array dei tagli (S) 
// che il guadagno massimo (C[L]) dalla nostra funzione.
export struct RisultatoOttimo {
	std::vector<int> S;      // Memorizza il miglior primo taglio per ogni lunghezza
	int guadagnoMassimo; // Il valore finale ottimo
};

#include <unordered_map>

// HashMap
std::unordered_map<int, int> memo;

int climbStairs(int n) {
	// L'equivalente di `if (n in memo)`
	// find() restituisce un iteratore, se non è uguale a end() significa che esiste
	if (memo.find(n) != memo.end()) {
		return memo[n];
	}

	// Casi base
	if (n == 1) return 1;
	if (n == 2) return 2;

	// Chiamata ricorsiva
	int result = climbStairs(n - 1) + climbStairs(n - 2);

	// Salviamo il risultato nel memo prima di ritornarlo
	memo[n] = result;

	return result;
}

// Dell'algoritmo di sopra non serve per forza una chiamata ricorsiva possiamo osservare che
// calcoliamo l'i-esimo passo a partire da quello precedente e degli altri 2

export int climbStairs_2(int n)
{
	std::vector a(n + 1, 0);

	a[1] = 1;
	a[2] = 2;

	for (int j = 3; j <= n; j++)
	{
		a[j] = a[j - 1] + a[j - 2];
	}

	return a[n];
}

export RisultatoOttimo COptSol(int lunghezzaTronco, const std::vector<int>& valori) {

	// Inizializziamo tutto a 0 perché non sappiamo nulla
	std::vector<int> bestValue(lunghezzaTronco + 1, 0);
	std::vector<int> bestCut(lunghezzaTronco + 1, 0);

	/*
	
		Da questo momento in poi l'idea è: 
		Parto dal 1° taglio fino <= lunghezzaTronco e provo qualsiasi combinazione
		passando dal fatto che la penultima combinazione è la migliore che potessi prendere.
		Avendo la penultima corretta, parto dalla penultima e provo qualsiasi combinazione 
		da i fino alla penultima
	
	*/

	for (int taglio_attuale = 1; taglio_attuale <= lunghezzaTronco; taglio_attuale++) {
		int cut_max_iter = 0;
		int val_max_iter = -1; 

		for (int i_esimo_taglio = 1; i_esimo_taglio <= taglio_attuale; i_esimo_taglio++) {

			/*
			
				La somma delle lunghezze dei due pezzi deve fare sempre t. 
				Pertanto, c'è un rapporto di proporzionalità inversa: 
				più è grande il primo pezzo che tagli, più sarà piccolo il pezzo che ti rimane.
			
			*/

			if (val_max_iter < valori[i_esimo_taglio - 1] + bestValue[taglio_attuale - i_esimo_taglio]) {
				cut_max_iter = i_esimo_taglio;
				val_max_iter = valori[i_esimo_taglio - 1] + bestValue[taglio_attuale - i_esimo_taglio];
			}
		}

		// Salviamo il miglior taglio (S) e il miglior valore (C) per la lunghezza t
		bestCut[taglio_attuale] = cut_max_iter;
		bestValue[taglio_attuale] = val_max_iter;
	}

	// Restituiamo l'array S completo e il valore massimo per L
	return { bestCut, bestValue[lunghezzaTronco] };
}

#pragma endregion

#pragma region Algoritmi ricorsivi medi

// RICEVIMENTO: Qua serviva davvero la formalizzazione matematica perché avevo messo troppi casi base
export std::string longest_common_subsequence(std::string X, std::string Y, int i, int j)
{
	if (i < 0 || j < 0)
		return "";

	if (X[i] == Y[j])
	{
		return longest_common_subsequence(X, Y, i - 1, j - 1) + X[i];
	}
	else
	{
		std::string opzione1 = longest_common_subsequence(X, Y, i - 1, j);

		std::string opzione2 = longest_common_subsequence(X, Y, i, j - 1);

		if (opzione1.length() > opzione2.length())
			return opzione1;
		else
			return opzione2;
	}
}

// RICEVIMENTO: Funziona però è troppo contorto
export std::string original_longest_common_subsequence(std::string X, std::string Y, int i, int j)
{

	if (X[i] == Y[j])

	{

		if (i != 0)

		{

			if (j != 0)

			{

				return longest_common_subsequence(X, Y, i - 1, j - 1) + X[i];

			}

			else

			{

				return longest_common_subsequence(X, Y, i - 1, j) + X[i];

			}

		}

		else

		{

			if (j != 0)

			{

				return longest_common_subsequence(X, Y, i, j - 1) + X[i];

			}

			else

			{

				return std::string(1, X[i]);

			}

		}

	}

	else

	{

		if (i != 0)

		{

			return longest_common_subsequence(X, Y, i - 1, j);

		}

		else

		{

			if (j != 0)

			{

				return longest_common_subsequence(X, Y, i, j - 1);

			}

			else

			{

				return "";

			}

		}

	}

}

// Fatto bene il caso std::max ecc... però devo lavorare di più sui casi base
export int problema_knapsack( int w, int pesi[], int valori[], int i)
{
	/*
	* Codice originale:
		if (i == 0)
			return valori[0];

		if ( w < 0 )
			return -INF;
	*/

	if (i < 0 || w == 0)
		return 0;

	// Se il peso dell'oggetto è maggiore della capacità residua, possiamo solo lasciarlo
	if (pesi[i] > w)
		return problema_knapsack(w, pesi, valori, i - 1);

	return std::max( problema_knapsack( w, pesi, valori, i - 1 ), 
					 problema_knapsack(w - pesi[i], pesi, valori, i - 1) + valori[i]);

}

#pragma endregion

#pragma endregion

#pragma region Algoritmi facili

#pragma region Algoritmi iterativi

// RICEVIMENTO: Come dovevo arrivare ad una soluzione così?
export int iterative_climbStairs_finale(int n)
{
	// Gestione immediata dei casi base
	if (n == 1) return 1;
	if (n == 2) return 2;

	int prev2 = 1; // f(n-2)
	int prev1 = 2; // f(n-1)
	int current = 0; // f(n)

	// Partiamo dal gradino 3 e saliamo fino a n
	for (int i = 3; i <= n; i++)
	{
		// Il gradino attuale è la somma dei due precedenti
		current = prev1 + prev2;

		// Scaliamo i valori per la prossima iterazione
		prev2 = prev1;
		prev1 = current;
	}

	return current;
}

// RICEVIMENTO: Questo approccio funziona bene però, per n = 45 va in loop infinito
export int iterative_climbStairs(int n)
{
	int ret = 0;
	int last = 0;
	bool call = true;

	int n1 = 0;

	std::stack<int> S_n;
	std::stack<int> S_n1;

	while (call || !S_n.empty())
	{
		if (call)
		{
			if (n == 1) 
			{
				call = false;
				last = 1;
				
				S_n1.push(1);

				ret += 1;
			}
			else if (n == 2) 
			{
				call = false;
				last = 2;
				ret += 2;
			}
			else
			{
				S_n.push(n);
				n--;
			}
		}
		else
		{
			n = S_n.top();

			// Algoritmo originale
			if (last == 1)
			{
				n -= 2;
				call = true;
			}
			else if (last == 2)
			{
				n1 = S_n1.top();
				ret += n1;
				S_n1.pop();

			}

			S_n.pop();



			/*
			
				Algoritmo che funziona
			
				n = S_n.top();
				S_n.pop();

				n -= 2;
				call = true;
			*/

		}
	}

	return ret;
}

#pragma endregion

#pragma region Algoritmi ricorsivi

// L'ho risolto facilmente con un pò di debug però la base era corretta, molto facile
export int tronco(int L, std::vector<int> valori, int pos)
{

	if (L == 1)
		return valori[1];

	if (L - pos < 0)
		return 0;

	int l1 = tronco(L - pos, valori, pos) + valori[pos];

	int l2 = tronco(L, valori, pos + 1);
	
	return std::max(l1, l2);
}

// RICEVIMENTO: Non sono riuscito a farlo
export int stringhe_binarie(int n)
{

	if (n == 1) return 2;

	return stringhe_binarie(n - 1) * 1 + stringhe_binarie(n - 1) * 0 + 1;
}

// Miracolosamente ho fatto tutto perfetto tranne 2 sciocchezze sui casi base
// debuggando però ho trovato il problema
export int quadrati_perfetti(int n, int i)
{

	if ( sqrt(n) == n || n == i ) return n;

	if (n < i) return INF;

	int r1 = quadrati_perfetti(n - (i * i), i) + 1;

	int r2 = quadrati_perfetti(n, i + 1);

	return std::min(r1, r2);

}

// Miracolosamente ha funzionato, senza Gemini & Co - Scritto totalmente da solo
export int percorsi_possibili(int i, int j, int m, int n)
{

	if (i == m - 1 && j == n - 1)
		return 1;

	if (i >= m || j >= n)
		return 0;

	return percorsi_possibili(i + 1, j, m, n) + percorsi_possibili(i, j + 1, m, n);
}

// Implementato perfettamente
export int ladro_case(int A[], int i)
{

	if (i == 0)
		return A[0];

	if (i == 1)
		return std::max(A[0], A[1]);

	return std::max(ladro_case(A, i - 1), ladro_case(A, i - 2) + A[i]);
}

// C'ero quasi però mi devo concentrare di più sulla 
// formalizzazione perché era molto simile a ciò che avevo scritto
// La formalizzazione matematica non mi ha dato nessun aiuto per arrivare al problema
export int min_resto(int A[], int i, int j)
{

	if (i == 0)	return 0;

	if (i < 0 || j >= sizeof(A) / sizeof(int)) return 10000;

	return std::min(min_resto(A, i - A[j], j) + 1, min_resto(A, i, j + 1));

}

// Non ho avuto problemi
export int subSequenceMax(int A[], int i)
{

	if (i == 0)
		return A[0];
	
	if (i == 1)
		return std::max(A[0], A[1]);

	return std::max( subSequenceMax(A, i - 1) + A[i], A[i]);
}

// Ok tutto sommato ci ero arrivato solo che avevo sbagliato
// a fare + A[i] solo da 1 parte
export int costo_minimo_climbing_stairs(int A[], int i)
{

	if (i == 0)
		return A[i];
	
	if (i == 1)
		return std::min(A[0], A[1]);

	int r = costo_minimo_climbing_stairs(A, i - 1);

	int r2 = costo_minimo_climbing_stairs(A, i - 2);

	return std::min(r + A[i], r2 + A[i]);
}

// Funziona bene
export int climbStairs_1(int n)
{
	if (n == 1)
		return 1;
	if (n == 2)
		return 2;

	int n_1 = climbStairs(n - 1);
	int n_2 = climbStairs(n - 2);

	return n_1 + n_2;

}

// Non ho avuto problemi, molto facile
export int fibonacci_ricorsivo(int n)
{
	if (n == 0 || n == 1)
		return 1;
	
	return fibonacci_ricorsivo(n - 1) + fibonacci_ricorsivo(n - 2);
}

#pragma endregion

#pragma endregion