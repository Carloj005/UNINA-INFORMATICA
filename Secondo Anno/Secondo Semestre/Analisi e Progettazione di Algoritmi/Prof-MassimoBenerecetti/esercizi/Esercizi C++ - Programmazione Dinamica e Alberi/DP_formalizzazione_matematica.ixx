module;

/*
	Questo file raccoglie tutti gli algoritmi ricorsivi/iterativi per
	il Pattern: "1D DP Lineare Semplice"
*/

#include <iostream>	
#include <vector>
#include <string>
#include <stack>
#include <unordered_map>
#include <algorithm>

export module DP_formalizzazione_matematica;

import wrapper;
import wrapper_program_dinamica;

#pragma region Massima sotto-sequenza

// Scritto da solo, ma non funziona per alcuni array manca tipo 1 unità
export int recursive_max_sum(std::vector<int> vec, int i)
{
	if (i == 0) return vec[0];

	return std::max(vec[i], vec[i] + recursive_max_sum(vec, i - 1));

}

// Scritto senza correzioni, solo un pò di debug avevo dimenticato <= al ciclo
export int iterative_max_sum(std::vector<int> vec)
{
	std::vector<int> a(vec.size() + 1, 0);

	int max = -1000;

	for (int j = 1; j <= vec.size(); j++)
	{

		if (vec[j - 1] + a[j - 1] > a[j])
		{
			a[j] = vec[j - 1] + a[j - 1];
		}

		if (max < a[j])
			max = a[j];
	}

	return max;
}

#pragma endregion

#pragma region Somma di Quadrati Perfetti

// TODO

#pragma endregion