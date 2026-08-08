import re

with open('README.md', 'r') as f:
    content = f.read()

nuova_sezione = """## 📝 Valutazione del Materiale Didattico

La tua opinione è fondamentale per migliorare la qualità del materiale condiviso! 
Se hai utilizzato appunti, dispense o file presenti in questa repository, ti invitiamo a lasciare un feedback sul materiale per un dato **Corso e Professore**.

👉 **[Compila il Form di Valutazione Anonimo](INSERISCI_QUI_IL_LINK_AL_GOOGLE_FORM_PUBBLICO)** 👈

Nel modulo (che è **completamente anonimo**) potrai:
1. Selezionare lo specifico Insegnamento e Professore.
2. Lasciare una valutazione da 1 a 5 sulla qualità e completezza del materiale.
3. Suggerire nei dettagli (campo a risposta libera) cosa migliorare, cosa manca o quali file hai trovato particolarmente utili.

Grazie per il tuo contributo!

"""

# Insert the new section just before "## 🗺️ Mappa ed Edifici" or after "## 🤝 Contribuire".
if '## 🗺️ Mappa ed Edifici' in content:
    content = content.replace('## 🗺️ Mappa ed Edifici', nuova_sezione + '## 🗺️ Mappa ed Edifici')
else:
    content += '\n' + nuova_sezione

with open('README.md', 'w') as f:
    f.write(content)
