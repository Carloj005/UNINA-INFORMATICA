/**
 * Google Apps Script per AGGIORNARE i Google Form esistenti:
 * 1. "Valutazione Corsi e Docenti - UNINA INFORMATICA"
 * 2. "Valutazione Materiale - UNINA INFORMATICA"
 *
 * PERCHÉ USARE QUESTO SCRIPT?
 * - Aggiorna la struttura direttamente sui Form già esistenti!
 * - I link pubblici (forms.gle) NON CAMBIANO: rimangono identici al 100%.
 * - Implementa la navigazione condizionale a 3 step:
 *   Step 1: Scelta del corso (31 corsi triennali A.A. 2026-2027)
 *   Step 2: Scelta del professore specifico che tiene quel corso
 *   Step 3: Compilazione delle domande/valutazioni
 *
 * COME UTILIZZARLO:
 * 1. Vai su https://script.google.com/
 * 2. Incolla questo script nel tuo progetto
 * 3. Inserisci il FORM_ID dei tuoi due form nelle costanti qui sotto:
 *    (Lo trovi nell'URL quando apri il form in modifica su Drive:
 *     https://docs.google.com/forms/d/QUESTO_E_IL_FORM_ID/edit)
 *    Se lasci la stringa vuota, lo script cercherà automaticamente il form per nome nel tuo Google Drive!
 * 4. Seleziona ed esegui la funzione:
 *    - 'aggiornaFormValutazioneDocenti' per il Form 1
 *    - 'aggiornaFormValutazioneMateriale' per il Form 2
 */

// ============================================================================
// CONFIGURAZIONE: INSERISCI QUI I FORM ID (OPPURE LASCIA VUOTO PER RICERCA AUTOMATICA)
// ============================================================================
var ID_FORM_VALUTAZIONE_DOCENTI = ""; // Es: "1t1xsMvz1jvK8VKdzf_KsZAVbUtLZIn9CuKmYWoIBBBk"
var ID_FORM_VALUTAZIONE_MATERIALE = ""; // Es: "1a2b3c4d5e..."

// Nome esatto dei file su Google Drive (usato solo se l'ID è vuoto)
var NOME_FORM_DOCENTI = "Valutazione Corsi e Docenti - UNINA INFORMATICA";
var NOME_FORM_MATERIALE = "Valutazione Materiale - UNINA INFORMATICA";

// ============================================================================
// DATI CORSI E DOCENTI A.A. 2026-2027
// ============================================================================
var COURSES_DATA = [
  // --- PRIMO ANNO ---
  {
    corso: "Algebra",
    anno: "1° Anno",
    professori: ["Maria Rosaria Celentani", "Giovanni Cutolo", "Mattia Brescia"]
  },
  {
    corso: "Analisi Matematica 1",
    anno: "1° Anno",
    professori: ["Roberto Alicandro", "Daniele Castorina", "Anna Maria Barbagallo", "Francesco Oliva", "Chiara Leone"]
  },
  {
    corso: "Architettura degli Elaboratori",
    anno: "1° Anno",
    professori: ["Silvia Rossi", "Luigi Sauro", "Roberto Prevete"]
  },
  {
    corso: "Basi di Dati",
    anno: "1° Anno",
    professori: ["Mara Sangiovanni", "Silvio Barra", "Andrea Calì"]
  },
  {
    corso: "Programmazione 1",
    anno: "1° Anno",
    professori: ["Roberto Prevete", "Daniel Riccio", "Luigi Sauro", "Francesco Isgrò", "Giuliano Laccetti"]
  },
  {
    corso: "Programmazione Object Oriented",
    anno: "1° Anno",
    professori: ["Sergio Di Martino", "Porfirio Tramontana", "Riccardo Caccavale", "Bernardo Breve"]
  },

  // --- SECONDO ANNO ---
  {
    corso: "Algoritmi e Strutture Dati (Analisi e Prog. Strutture Dati)",
    anno: "2° Anno",
    professori: ["Massimo Benerecetti", "Fabio Mogavero"]
  },
  {
    corso: "Analisi e Progettazione di Algoritmi",
    anno: "2° Anno",
    professori: ["Massimo Benerecetti", "Fabio Mogavero"]
  },
  {
    corso: "Elementi di Informatica Teorica",
    anno: "2° Anno",
    professori: ["Alessandro De Luca", "Aniello Murano"]
  },
  {
    corso: "Fisica Generale 1",
    anno: "2° Anno",
    professori: ["Goffredo Chirco", "Giampiero Esposito", "Gianfranca De Rosa"]
  },
  {
    corso: "Geometria",
    anno: "2° Anno",
    professori: ["Francesca Cioffi", "Marco Trombetti"]
  },
  {
    corso: "Linguaggi di Programmazione 1",
    anno: "2° Anno",
    professori: ["Piero Andrea Bonatti", "Marco Faella"]
  },
  {
    corso: "Metodi Statistici per l'informazione",
    anno: "2° Anno",
    professori: ["Marco Lops", "Mario Tanda"]
  },
  {
    corso: "Sistemi Operativi",
    anno: "2° Anno",
    professori: ["Alberto Finzi", "Walter Balzano"]
  },

  // --- TERZO ANNO ---
  {
    corso: "AI Technologies",
    anno: "3° Anno",
    professori: ["Anna Corazza", "Silvia Rossi"]
  },
  {
    corso: "Ingegneria del Software",
    anno: "3° Anno",
    professori: ["Sergio Di Martino", "Porfirio Tramontana", "Luigi Lucio Libero Starace"]
  },
  {
    corso: "Reti e Programmazione Distribuita",
    anno: "3° Anno",
    professori: ["Alberto Finzi", "Andrea Calì", "Riccardo Caccavale"]
  },
  {
    corso: "Tecniche di Programmazione Avanzata",
    anno: "3° Anno",
    professori: ["Marco Faella"]
  },
  {
    corso: "Tecnologie Web",
    anno: "3° Anno",
    professori: ["Luigi Lucio Libero Starace", "Bernardo Breve"]
  },

  // --- ESAMI A SCELTA ---
  {
    corso: "Algorithm Design (Scelta)",
    anno: "A Scelta",
    professori: ["Massimo Benerecetti"]
  },
  {
    corso: "Calcolo Numerico (Scelta)",
    anno: "A Scelta",
    professori: ["Luisa D'Amore"]
  },
  {
    corso: "Computer Forensics (Scelta)",
    anno: "A Scelta",
    professori: ["Lorenzo Laurato"]
  },
  {
    corso: "Diritto dell'Informatica (Scelta)",
    anno: "A Scelta",
    professori: ["Lucio Franzese"]
  },
  {
    corso: "Economia e Organizzazione Aziendale (Scelta)",
    anno: "A Scelta",
    professori: ["Piccirillo", "Da Definire"]
  },
  {
    corso: "Istituzioni di Matematica II (Scelta)",
    anno: "A Scelta",
    professori: ["Da Definire"]
  },
  {
    corso: "Logics for Computer Science (Scelta)",
    anno: "A Scelta",
    professori: ["Massimo Benerecetti"]
  },
  {
    corso: "Multimedia Information Systems (Scelta)",
    anno: "A Scelta",
    professori: ["Walter Balzano"]
  },
  {
    corso: "Operating Systems for Mobile, Cloud and IoT (Scelta)",
    anno: "A Scelta",
    professori: ["Porfirio Tramontana"]
  },
  {
    corso: "Parallel and Distributed Computing (Scelta)",
    anno: "A Scelta",
    professori: ["Giuliano Laccetti"]
  },
  {
    corso: "Ricerca Operativa / Operation Research (Scelta)",
    anno: "A Scelta",
    professori: ["Paola Festa"]
  },
  {
    corso: "Scientific Computing (Scelta)",
    anno: "A Scelta",
    professori: ["Eleonora Messina"]
  }
];

// ============================================================================
// FUNZIONE HELPER: APRE IL FORM TRAMITE ID O RICERCA SU DRIVE
// ============================================================================
function ottieniForm(idConfigurato, nomeFallback) {
  if (idConfigurato && idConfigurato.trim() !== "") {
    // Se l'utente ha inserito l'ID o un URL completo
    var id = idConfigurato.trim();
    if (id.indexOf("/d/") !== -1) {
      id = id.split("/d/")[1].split("/")[0];
    }
    return FormApp.openById(id);
  }

  // Fallback: cerca per nome nel Google Drive dell'utente
  var files = DriveApp.getFilesByName(nomeFallback);
  if (files.hasNext()) {
    var file = files.next();
    return FormApp.openById(file.getId());
  }

  throw new Error(
    "Impossibile trovare il form '" + nomeFallback + "'. Inserisci il FORM_ID nella variabile all'inizio dello script."
  );
}

// ============================================================================
// 1. AGGIORNA: VALUTAZIONE CORSI E DOCENTI
// ============================================================================
function aggiornaFormValutazioneDocenti() {
  var form = ottieniForm(ID_FORM_VALUTAZIONE_DOCENTI, NOME_FORM_DOCENTI);
  Logger.log("Apro il form: " + form.getTitle() + " (ID: " + form.getId() + ")");

  // Rimuove i vecchi elementi per ricreare la struttura condizionale pulita
  var items = form.getItems();
  for (var i = items.length - 1; i >= 0; i--) {
    form.deleteItem(items[i]);
  }

  form.setDescription(
    "Questo form raccoglie recensioni anonime su corsi e docenti della Laurea Triennale in Informatica dell'Università degli Studi di Napoli Federico II.\n\n" +
    "🔒 Il modulo è al 100% anonimo. I dati raccolti confluiranno nella repository GitHub UNINA-INFORMATICA a beneficio di tutti gli studenti."
  );
  form.setAllowResponseEdits(false);
  form.setShowLinkToRespondAgain(true);
  form.setCollectEmail(false);

  // Pagina 1: Anno Accademico + Scelta Corso
  var itemAA = form.addListItem();
  itemAA.setTitle("Anno Accademico in cui hai seguito il corso")
        .setChoices([
          itemAA.createChoice("2026/2027"),
          itemAA.createChoice("2025/2026"),
          itemAA.createChoice("2024/2025"),
          itemAA.createChoice("Precedente")
        ])
        .setRequired(true);

  var courseItem = form.addListItem();
  courseItem.setTitle("Insegnamento (Corso)")
            .setHelpText("Seleziona il corso che vuoi valutare.")
            .setRequired(true);

  // Sezioni dei singoli corsi
  var courseSections = [];
  for (var j = 0; j < COURSES_DATA.length; j++) {
    var c = COURSES_DATA[j];
    var sec = form.addPageBreakItem();
    sec.setTitle(c.corso + " (" + c.anno + ")");
    sec.setHelpText("Indica il docente con cui hai seguito il corso di " + c.corso);

    var profItem = form.addMultipleChoiceItem();
    profItem.setTitle("Docente del corso")
            .setRequired(true);

    var pChoices = [];
    for (var p = 0; p < c.professori.length; p++) {
      pChoices.push(profItem.createChoice(c.professori[p]));
    }
    pChoices.push(profItem.createChoice("Altro / Non presente / Da specificare"));
    profItem.setChoices(pChoices);

    courseSections.push({
      corso: c.corso,
      anno: c.anno,
      section: sec
    });
  }

  // Sezione Finale: Domande di Valutazione
  var finalSection = form.addPageBreakItem();
  finalSection.setTitle("Valutazione del Corso e del Docente");
  finalSection.setHelpText("Esprimi la tua opinione in merito alla qualità dell'insegnamento e dell'esame.");
  finalSection.setGoToPage(FormApp.PageNavigationType.SUBMIT);

  // 1. Difficoltà Esame
  var itemDiffEsame = form.addScaleItem();
  itemDiffEsame.setTitle("Difficoltà dell'Esame")
               .setHelpText("Da 1 (Molto semplice/Accessibile) a 5 (Estremamente difficile/Tasso di bocciatura elevato).")
               .setBounds(1, 5)
               .setRequired(true);

  // 2. Difficoltà Corso
  var itemDiffCorso = form.addScaleItem();
  itemDiffCorso.setTitle("Difficoltà del Corso e degli Argomenti")
               .setHelpText("Da 1 (Molto semplice/Comprensibile da subito) a 5 (Estremamente ostico/Richiede molto studio).")
               .setBounds(1, 5)
               .setRequired(true);

  // 3. Chiarezza Docente
  var itemChiarezza = form.addScaleItem();
  itemChiarezza.setTitle("Chiarezza ed Esposizione del Docente")
               .setHelpText("Il docente spiega in modo chiaro? (1 = Pessimo/Incomprensibile, 5 = Eccellente/Molto chiaro).")
               .setBounds(1, 5)
               .setRequired(true);

  // 4. Disponibilità Docente
  var itemDisponibilita = form.addScaleItem();
  itemDisponibilita.setTitle("Disponibilità e Cortesia del Docente")
                   .setHelpText("Il docente risponde alle email, fa ricevimento ed è bendisposto verso gli studenti? (1 = Scarsa/Ostile, 5 = Massima disponibilità).")
                   .setBounds(1, 5)
                   .setRequired(true);

  // 5. Utilità Materiale
  var itemMateriale = form.addScaleItem();
  itemMateriale.setTitle("Utilità e Qualità del Materiale Didattico")
               .setHelpText("Le slide, le dispense del professore o i libri consigliati sono stati sufficienti per prepararsi? (1 = Insufficienti/Pessimi, 5 = Ottimi e completi).")
               .setBounds(1, 5)
               .setRequired(true);

  // 6. Modalità d'esame
  var itemModalita = form.addCheckboxItem();
  itemModalita.setTitle("Modalità d'esame")
              .setHelpText("Seleziona le prove previste per superare l'esame (puoi selezionarne più di una).")
              .setChoices([
                itemModalita.createChoice("Scritto (Esercizi/Codice)"),
                itemModalita.createChoice("Scritto (Teoria/Domande a risposta multipla o aperta)"),
                itemModalita.createChoice("Orale obbligatorio"),
                itemModalita.createChoice("Orale facoltativo (es. per confermare/alzare lo scritto)"),
                itemModalita.createChoice("Progetto individuale o di gruppo"),
                itemModalita.createChoice("Homework o prove intercorso (esoneri)")
              ])
              .setRequired(true);

  // 7. Frequenza
  var itemFrequenza = form.addMultipleChoiceItem();
  itemFrequenza.setTitle("La frequenza delle lezioni è fondamentale?")
               .setChoices([
                 itemFrequenza.createChoice("Sì, indispensabile per capire la materia e superare l'esame"),
                 itemFrequenza.createChoice("Consigliata, ma fattibile anche da non frequentante con buon materiale"),
                 itemFrequenza.createChoice("No, si può studiare tranquillamente da soli senza frequentare")
               ])
               .setRequired(true);

  // 8. Tempo medio
  var itemTempo = form.addMultipleChoiceItem();
  itemTempo.setTitle("Tempo medio impiegato per preparare l'esame")
           .setHelpText("Considerando uno studio costante e concentrato.")
           .setChoices([
             itemTempo.createChoice("Meno di 2 settimane"),
             itemTempo.createChoice("2 - 4 settimane"),
             itemTempo.createChoice("1 - 2 mesi"),
             itemTempo.createChoice("Più di 2 mesi")
           ])
           .setRequired(true);

  // 9. Generosità voto
  var itemGenerosita = form.addScaleItem();
  itemGenerosita.setTitle("Generosità del docente nella valutazione / voti")
                 .setHelpText("Il docente premia l'impegno ed è di manica larga o è estremamente esigente? (1 = Molto severo/stretto, 5 = Molto generoso).")
                 .setBounds(1, 5)
                 .setRequired(true);

  // Collegamento navigazione tra le sezioni
  for (var k = 0; k < courseSections.length; k++) {
    courseSections[k].section.setGoToPage(finalSection);
  }

  var courseChoices = [];
  for (var m = 0; m < courseSections.length; m++) {
    var cInfo = courseSections[m];
    var label = cInfo.corso + " [" + cInfo.anno + "]";
    courseChoices.push(courseItem.createChoice(label, cInfo.section));
  }
  courseItem.setChoices(courseChoices);

  Logger.log("=================================================");
  Logger.log("✅ FORM 1 (CORSI E DOCENTI) AGGIORNATO CON SUCCESSO!");
  Logger.log("Link pubblico (invariato): " + form.getPublishedUrl());
  Logger.log("Link modifica: " + form.getEditUrl());
  Logger.log("=================================================");
}

// ============================================================================
// 2. AGGIORNA: VALUTAZIONE MATERIALE DIDATTICO
// ============================================================================
function aggiornaFormValutazioneMateriale() {
  var form = ottieniForm(ID_FORM_VALUTAZIONE_MATERIALE, NOME_FORM_MATERIALE);
  Logger.log("Apro il form: " + form.getTitle() + " (ID: " + form.getId() + ")");

  // Rimuove i vecchi elementi
  var items = form.getItems();
  for (var i = items.length - 1; i >= 0; i--) {
    form.deleteItem(items[i]);
  }

  form.setDescription(
    "Questionario anonimo per raccogliere valutazioni, feedback e consigli sul materiale didattico (slide, appunti, dispense, prove d'esame) dei singoli corsi.\n\n" +
    "🔒 Il modulo è al 100% anonimo. Aiutaci a migliorare la qualità delle risorse condivise su UNINA-INFORMATICA!"
  );
  form.setAllowResponseEdits(false);
  form.setShowLinkToRespondAgain(true);
  form.setCollectEmail(false);

  // Pagina 1: Scelta Corso
  var courseItem = form.addListItem();
  courseItem.setTitle("1. Seleziona il Corso / Insegnamento")
            .setHelpText("Scegli la materia di cui vuoi valutare il materiale didattico.")
            .setRequired(true);

  // Sezioni dei singoli corsi
  var courseSections = [];
  for (var j = 0; j < COURSES_DATA.length; j++) {
    var c = COURSES_DATA[j];
    var sec = form.addPageBreakItem();
    sec.setTitle(c.corso + " (" + c.anno + ")");
    sec.setHelpText("Indica il professore di cui hai consultato o utilizzato il materiale.");

    var profItem = form.addMultipleChoiceItem();
    profItem.setTitle("Docente per " + c.corso)
            .setRequired(true);

    var pChoices = [];
    for (var p = 0; p < c.professori.length; p++) {
      pChoices.push(profItem.createChoice(c.professori[p]));
    }
    pChoices.push(profItem.createChoice("Altro / Non presente in elenco"));
    profItem.setChoices(pChoices);

    courseSections.push({
      corso: c.corso,
      anno: c.anno,
      section: sec
    });
  }

  // Sezione Finale: Voto e Feedback
  var finalSection = form.addPageBreakItem();
  finalSection.setTitle("Valutazione del Materiale Didattico");
  finalSection.setHelpText("Valuta la qualità e completezza del materiale presente sulla repo o fornito per questo corso.");
  finalSection.setGoToPage(FormApp.PageNavigationType.SUBMIT);

  // Voto da 1 a 5
  var itemVoto = form.addScaleItem();
  itemVoto.setTitle("Valutazione complessiva del materiale (1 = Pessimo, 5 = Eccellente)")
          .setHelpText("1 = Molto carente/pieno di errori, 5 = Perfetto, chiaro e completo per preparare l'esame.")
          .setBounds(1, 5)
          .setRequired(true);

  // Feedback aperto
  var itemFeedback = form.addParagraphTextItem();
  itemFeedback.setTitle("Dettagli, consigli o materiale mancante (Opzionale)")
              .setHelpText("Suggerisci cosa manca, cosa andrebbe migliorato o quali file/appunti hai trovato particolarmente utili.");

  // Collegamento navigazione
  for (var k = 0; k < courseSections.length; k++) {
    courseSections[k].section.setGoToPage(finalSection);
  }

  var courseChoices = [];
  for (var m = 0; m < courseSections.length; m++) {
    var cInfo = courseSections[m];
    var label = cInfo.corso + " [" + cInfo.anno + "]";
    courseChoices.push(courseItem.createChoice(label, cInfo.section));
  }
  courseItem.setChoices(courseChoices);

  Logger.log("=================================================");
  Logger.log("✅ FORM 2 (VALUTAZIONE MATERIALE) AGGIORNATO CON SUCCESSO!");
  Logger.log("Link pubblico (invariato): " + form.getPublishedUrl());
  Logger.log("Link modifica: " + form.getEditUrl());
  Logger.log("=================================================");
}
