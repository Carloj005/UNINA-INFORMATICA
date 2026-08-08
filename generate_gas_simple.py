import os

combinations = set()
for root, dirs, files in os.walk('.'):
    if '.git' in root:
        continue
    parts = root.split(os.sep)
    if parts[-1].startswith('Prof-'):
        prof = parts[-1].replace('Prof-', '').replace('DaDefinire', 'Da Definire')
        # Insert spaces in camel case prof names if needed, but they are already fine.
        import re
        prof = re.sub(r'([a-z])([A-Z])', r'\1 \2', prof)
        course = parts[-2]
        combinations.add(f"{course} - {prof}")

sorted_combinations = sorted(list(combinations))

js_code = """function creaFormSemplice() {
  var form = FormApp.create('Valutazione Materiale - UNINA INFORMATICA');
  form.setDescription('Questionario anonimo per raccogliere dettagli, consigli o idee sul materiale didattico dei singoli corsi. Valuta da 1 a 5 il materiale e lascia un feedback libero.');
  
  // Impostazioni per renderlo completamente anonimo
  form.setCollectEmail(false);
  form.setRequireLogin(false);
  
  var itemCorsoProf = form.addListItem();
  itemCorsoProf.setTitle('Corso e Professore')
               .setHelpText('Seleziona il corso e il professore di cui vuoi valutare il materiale')
               .setRequired(true);
               
  var scelte = [
"""
for combo in sorted_combinations:
    js_code += f"    \"{combo}\",\n"

js_code += """  ];
  itemCorsoProf.setChoiceValues(scelte);
  
  var itemVoto = form.addScaleItem();
  itemVoto.setTitle('Valutazione del materiale (1 = Pessimo, 5 = Eccellente)')
          .setBounds(1, 5)
          .setRequired(true);
          
  var itemFeedback = form.addParagraphTextItem();
  itemFeedback.setTitle('Dettagli, consigli o idee (Opzionale)')
              .setHelpText('Scrivi qui eventuali suggerimenti su cosa manca, cosa migliorare o cosa hai trovato utile.');
              
  Logger.log('Form creato!');
  Logger.log('URL per MODIFICARLO (tienilo per te): ' + form.getEditUrl());
  Logger.log('URL da PUBBLICARE NEL README: ' + form.getPublishedUrl());
}
"""

with open('crea_form_valutazione.js', 'w') as f:
    f.write(js_code)

