/**
 * Google Apps Script per la creazione automatica del Google Form:
 * "UNINA Informatica - Raccolta Domande Esami Orali"
 *
 * COME UTILIZZARLO:
 * 1. Vai su https://script.google.com/
 * 2. Clicca su "Nuovo progetto"
 * 3. Incolla questo codice all'interno dell'editor (sostituendo il contenuto di default)
 * 4. Clicca su "Esegui" (Run) selezionando la funzione 'creaFormDomandeOrali'
 * 5. Concedi le autorizzazioni a Google Drive/Forms quando richiesto
 * 6. Nella scheda "Log di esecuzione" troverai:
 *    - Link pubblico da condividere con gli studenti (da inserire nel README.md)
 *    - Link di modifica del Form per visualizzare le risposte e il foglio Google Sheets
 */

function creaFormDomandeOrali() {
  // 1. Dati dei corsi e relativi docenti (A.A. 2026-2027)
  var coursesData = [
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

  // 2. Creazione del Form
  var form = FormApp.create("UNINA Informatica - Raccolta Domande Esami Orali");

  form.setDescription(
    "Modulo anonimo per la raccolta delle domande degli esami orali del Corso di Laurea Triennale in Informatica (Università degli Studi di Napoli Federico II).\n\n" +
    "Condividere le domande ricevute all'esame orale permette a tutti gli studenti di prepararsi in modo mirato e strategico sugli argomenti più richiesti da ciascun docente, riducendo i tempi di preparazione.\n\n" +
    "🔒 Il modulo è al 100% anonimo: non viene registrato alcun indirizzo email o dato identificativo."
  );

  form.setAllowResponseEdits(false);
  form.setShowLinkToRespondAgain(true);
  form.setCollectEmail(false);

  // 3. Pagina 1: Selezione del Corso
  var courseItem = form.addListItem();
  courseItem.setTitle("1. Seleziona il Corso / Insegnamento");
  courseItem.setHelpText("Scegli la materia di cui vuoi condividere le domande d'esame.");
  courseItem.setRequired(true);

  // Array di sezioni per ciascun corso
  var courseSections = [];

  for (var i = 0; i < coursesData.length; i++) {
    var c = coursesData[i];
    var section = form.addPageBreakItem();
    section.setTitle(c.corso + " (" + c.anno + ")");
    section.setHelpText("Indica il docente con cui hai sostenuto l'esame orale.");

    var profItem = form.addMultipleChoiceItem();
    profItem.setTitle("Docente per " + c.corso);
    profItem.setRequired(true);

    var profChoices = [];
    for (var p = 0; p < c.professori.length; p++) {
      profChoices.push(profItem.createChoice(c.professori[p]));
    }
    profChoices.push(profItem.createChoice("Altro / Docente non presente in elenco"));
    profItem.setChoices(profChoices);

    courseSections.push({
      corso: c.corso,
      anno: c.anno,
      section: section
    });
  }

  // 4. Sezione Finale: Domande d'esame e dettagli
  var finalSection = form.addPageBreakItem();
  finalSection.setTitle("Domande dell'Esame Orale");
  finalSection.setHelpText("Inserisci le domande ricevute ed eventuali dettagli utili.");
  finalSection.setGoToPage(FormApp.PageNavigationType.SUBMIT);

  // Campo domande (Obbligatorio)
  var questionsItem = form.addParagraphTextItem();
  questionsItem.setTitle("Domande ricevute all'esame orale *");
  questionsItem.setHelpText(
    "Elenca dettagliatamente le domande poste, teoremi/dimostrazioni chieste alla lavagna, esercizi orali o argomenti su cui il docente ha insistito."
  );
  questionsItem.setRequired(true);

  // Sessione/Data (Opzionale)
  var sessionItem = form.addTextItem();
  sessionItem.setTitle("Data o Sessione dell'esame (facoltativo)");
  sessionItem.setHelpText("Es: Settembre 2026, Luglio 2025, Sessione Invernale, ecc.");
  sessionItem.setRequired(false);

  // Impressioni / Consigli (Opzionale)
  var tipsItem = form.addParagraphTextItem();
  tipsItem.setTitle("Consigli e impressioni sulla modalità d'esame (facoltativo)");
  tipsItem.setHelpText(
    "Es: clima dell'orale (tranquillo/severo), focus sui dettagli, importanza del progetto, argomenti a sorpresa, ecc."
  );
  tipsItem.setRequired(false);

  // 5. Collegamento navigazione tra le sezioni
  // Ogni sezione corso salta direttamente alla sezione finale delle domande
  for (var k = 0; k < courseSections.length; k++) {
    courseSections[k].section.setGoToPage(finalSection);
  }

  // Collega le scelte del menu a tendina ai rispettivi corsi
  var courseChoices = [];
  for (var j = 0; j < courseSections.length; j++) {
    var cs = courseSections[j];
    var label = cs.corso + " [" + cs.anno + "]";
    courseChoices.push(courseItem.createChoice(label, cs.section));
  }
  courseItem.setChoices(courseChoices);

  // 6. Log degli URL
  Logger.log("=================================================");
  Logger.log("✅ GOOGLE FORM CREATO CON SUCCESSO!");
  Logger.log("Link pubblico per gli studenti (da mettere nel README):");
  Logger.log(form.getPublishedUrl());
  Logger.log("Link di modifica e gestione (Editor / Risposte):");
  Logger.log(form.getEditUrl());
  Logger.log("=================================================");
}
