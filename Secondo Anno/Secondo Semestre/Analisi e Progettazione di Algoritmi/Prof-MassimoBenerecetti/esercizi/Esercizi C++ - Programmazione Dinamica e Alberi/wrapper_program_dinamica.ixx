#include <random>

export module wrapper_program_dinamica;

export struct oggetto
{
	int volume;
	int peso;
	int valore;
} ;

// volumi
export int volume(oggetto obj)
{
	return obj.volume + 3;
}

// Peso C1
export int v1(oggetto obj)
{
	return obj.volume + 2;
}

// Peso C2
export int v2(oggetto obj)
{
	return obj.volume;
}

export int findNastroDisponibile(std::vector<int> nastri, int intervallo)
{
	for (int j = 0; j < nastri.size(); j++)
	{
		if (nastri[j] == intervallo)
			return j;
	}

	return -1;
}