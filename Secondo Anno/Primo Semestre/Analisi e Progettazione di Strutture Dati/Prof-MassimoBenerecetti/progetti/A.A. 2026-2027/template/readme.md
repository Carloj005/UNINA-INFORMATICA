# APSD - Template per gli Studenti

Questo archivio contiene gli scheletri delle interfacce e delle classi dei
contenitori, il diagramma discusso a lezione, le funzionalità di supporto e i
`simpletest`. Le utility `apsd/classes/utilities` e i trait in
`apsd/interfaces/traits` sono già implementati.

Le dichiarazioni dei contenitori indicano i parametri generici per nome.
Completate i loro vincoli, le relazioni `extends` e `implements`, i campi, i
costruttori e tutti i metodi indicati dai segnaposto e dal diagramma. I
costruttori riportano anche i parametri, mentre per gli altri metodi è indicato
soltanto il nome. Le sezioni distinguono i metodi propri dagli override
richiesti. Oltre alle lezioni, il diagramma e i test aiutano a ricostruire le
firme e il comportamento.

Il template è intenzionalmente incompleto: `make test` fallirà finché non
saranno state ricostruite le dipendenze necessarie.
`make support` compila soltanto le utility e i trait forniti. Quando il progetto
sarà completo, `make runtest` eseguirà i test distribuiti; sono disponibili
anche `make runtestseq`, `make runtestdeq` e `make runtestcol`.
