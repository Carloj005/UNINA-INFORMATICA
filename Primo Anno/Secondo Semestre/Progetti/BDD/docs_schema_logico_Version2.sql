-- UTENTE
CREATE TABLE Utente (
    idUtente INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    cognome VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    dataRegistrazione DATETIME NOT NULL,
    ateneoAppartenenza VARCHAR(100) NOT NULL,
    bio TEXT,
    valutazioneUtente FLOAT DEFAULT 0,
    statoAccount ENUM('ATTIVO', 'SOSPESO', 'RIMOSSO') NOT NULL,
    ruolo ENUM('USER', 'ADMIN') NOT NULL
);

-- CATEGORIA
CREATE TABLE Categoria (
    idCategoria INT PRIMARY KEY AUTO_INCREMENT,
    nomeCategoria VARCHAR(100) NOT NULL,
    descrizione TEXT
);

-- ANNUNCIO
CREATE TABLE Annuncio (
    idAnnuncio INT PRIMARY KEY AUTO_INCREMENT,
    idUtente INT NOT NULL,
    idCategoria INT NOT NULL,
    tipoAnnuncio ENUM('VENDITA', 'SCAMBIO', 'REGALO') NOT NULL,
    statoAnnuncio ENUM('ATTIVO', 'SCADUTO', 'RIMOSSO', 'COMPLETATO') NOT NULL,
    dataPubblicazione DATETIME NOT NULL,
    dataScadenza DATETIME,
    dataCompletamento DATETIME,
    FOREIGN KEY (idUtente) REFERENCES Utente(idUtente),
    FOREIGN KEY (idCategoria) REFERENCES Categoria(idCategoria)
);

-- MESSAGGIO
CREATE TABLE Messaggio (
    idMessaggio INT PRIMARY KEY AUTO_INCREMENT,
    contenutoMessaggio TEXT NOT NULL,
    dataInvio DATETIME NOT NULL,
    idUtenteMittente INT NOT NULL,
    idUtenteDestinatario INT NOT NULL,
    FOREIGN KEY (idUtenteMittente) REFERENCES Utente(idUtente),
    FOREIGN KEY (idUtenteDestinatario) REFERENCES Utente(idUtente)
);

-- NOTIFICA
CREATE TABLE Notifica (
    idNotifica INT PRIMARY KEY AUTO_INCREMENT,
    tipoNotifica VARCHAR(50) NOT NULL,
    contenutoNotifica TEXT NOT NULL,
    statoNotifica ENUM('INVIATA', 'LETTA') NOT NULL,
    dataInvio DATETIME NOT NULL,
    dataLettura DATETIME,
    idUtente INT NOT NULL,
    FOREIGN KEY (idUtente) REFERENCES Utente(idUtente)
);

-- RECENSIONE
CREATE TABLE Recensione (
    idRecensione INT PRIMARY KEY AUTO_INCREMENT,
    testoRecensione TEXT,
    valoreRecensione INT,
    dataRecensione DATETIME NOT NULL,
    idUtenteRecensore INT NOT NULL,
    idUtenteRecensito INT NOT NULL,
    FOREIGN KEY (idUtenteRecensore) REFERENCES Utente(idUtente),
    FOREIGN KEY (idUtenteRecensito) REFERENCES Utente(idUtente)
);

-- OFFERTA VENDITA
CREATE TABLE OffertaVendita (
    idOffertaVendita INT PRIMARY KEY AUTO_INCREMENT,
    statoOfferta ENUM('INVIATA', 'ACCETTATA', 'RIFIUTATA', 'SCADUTA') NOT NULL,
    importo FLOAT NOT NULL,
    dataOfferta DATETIME NOT NULL,
    dataAccettazione DATETIME,
    dataRifiuto DATETIME,
    idAnnuncio INT NOT NULL,
    idUtenteOfferente INT NOT NULL,
    FOREIGN KEY (idAnnuncio) REFERENCES Annuncio(idAnnuncio),
    FOREIGN KEY (idUtenteOfferente) REFERENCES Utente(idUtente)
);

-- REGALO
CREATE TABLE Regalo (
    idRegalo INT PRIMARY KEY AUTO_INCREMENT,
    statoOfferta ENUM('INVIATA', 'ACCETTATA', 'RIFIUTATA', 'SCADUTA') NOT NULL,
    motivazione TEXT,
    dataOfferta DATETIME NOT NULL,
    dataAccettazione DATETIME,
    dataRifiuto DATETIME,
    idAnnuncio INT NOT NULL,
    idUtenteOfferente INT NOT NULL,
    FOREIGN KEY (idAnnuncio) REFERENCES Annuncio(idAnnuncio),
    FOREIGN KEY (idUtenteOfferente) REFERENCES Utente(idUtente)
);

-- OFFERTA SCAMBIO
CREATE TABLE OffertaScambio (
    idOffertaScambio INT PRIMARY KEY AUTO_INCREMENT,
    statoOfferta ENUM('INVIATA', 'ACCETTATA', 'RIFIUTATA', 'SCADUTA') NOT NULL,
    descrizioneOggetti TEXT NOT NULL,
    dataOfferta DATETIME NOT NULL,
    dataAccettazione DATETIME,
    dataRifiuto DATETIME,
    idAnnuncio INT NOT NULL,
    idUtenteOfferente INT NOT NULL,
    FOREIGN KEY (idAnnuncio) REFERENCES Annuncio(idAnnuncio),
    FOREIGN KEY (idUtenteOfferente) REFERENCES Utente(idUtente)
);

-- TRANSAZIONE
CREATE TABLE Transazione (
    idTransazione INT PRIMARY KEY AUTO_INCREMENT,
    dataInizio DATETIME NOT NULL,
    dataTermine DATETIME,
    statoTransazione ENUM('IN_CORSO', 'COMPLETATA', 'ANNULLATA') NOT NULL,
    idAnnuncio INT NOT NULL,
    idUtenteAcquirente INT NOT NULL,
    FOREIGN KEY (idAnnuncio) REFERENCES Annuncio(idAnnuncio),
    FOREIGN KEY (idUtenteAcquirente) REFERENCES Utente(idUtente)
);

-- SPEDIZIONE
CREATE TABLE Spedizione (
    idSpedizione INT PRIMARY KEY AUTO_INCREMENT,
    tipoSpedizione VARCHAR(50) NOT NULL,
    statoSpedizione ENUM('IN_PREPARAZIONE', 'IN_VIAGGIO', 'CONSEGNATA') NOT NULL,
    dataPreparazione DATETIME,
    dataInViaggio DATETIME,
    dataConsegnata DATETIME,
    idTransazione INT NOT NULL,
    FOREIGN KEY (idTransazione) REFERENCES Transazione(idTransazione)
);

-- AGGIUNGIOGGETTI (per OffertaScambio)
CREATE TABLE AggiungiOggetti (
    idAggiunta INT PRIMARY KEY AUTO_INCREMENT,
    dataAggiunta DATETIME NOT NULL,
    oggettoProposto TEXT NOT NULL,
    idOffertaScambio INT NOT NULL,
    FOREIGN KEY (idOffertaScambio) REFERENCES OffertaScambio(idOffertaScambio)
);