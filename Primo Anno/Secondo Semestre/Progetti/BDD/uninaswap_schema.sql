-- =============================================================================
-- UninaSwap - Schema Fisico del Database
-- Progettato per PostgreSQL
-- =============================================================================

-- Estensione per la crittografia delle password
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Pulizia dello schema precedente (per riesecuzione dello script)
DROP SCHEMA IF EXISTS uninaswap CASCADE;
CREATE SCHEMA uninaswap;
SET search_path TO uninaswap;

-- =============================================================================
-- 1. Definizione dei Tipi Enumerativi (ENUM)
-- Utilizzati per implementare i vincoli di dominio in modo efficiente.
-- =============================================================================

CREATE TYPE tipo_annuncio AS ENUM ('VENDITA', 'SCAMBIO', 'REGALO');
CREATE TYPE stato_annuncio AS ENUM ('ATTIVO', 'SCADUTO', 'RIMOSSO', 'COMPLETATO');
CREATE TYPE modalita_consegna AS ENUM ('A MANO', 'SPEDIZIONE');
CREATE TYPE stato_offerta AS ENUM ('INVIATA', 'ACCETTATA', 'RIFIUTATA', 'SCADUTA');
CREATE TYPE status_account AS ENUM ('ATTIVO', 'SOSPESO', 'IN_VALIDAZIONE', 'CONGELATO');
CREATE TYPE stato_transazione AS ENUM ('IN_CORSO', 'COMPLETATA', 'ANNULLATA');
CREATE TYPE tipo_notifica AS ENUM ('NUOVO_MESSAGGIO', 'OFFERTA_RICEVUTA', 'OFFERTA_ACCETTATA', 'RECENSIONE_RICEVUTA');
CREATE TYPE tipo_chat AS ENUM ('VENDITA', 'SUPPORTO');

-- =============================================================================
-- 2. Creazione delle Tabelle
-- =============================================================================

-- Tabella CATEGORIA
CREATE TABLE CATEGORIA (
    ID_Categoria SERIAL PRIMARY KEY,
    nomeCategoria VARCHAR(50) NOT NULL UNIQUE,
    descrizione TEXT
);

-- Tabella UTENTE
CREATE TABLE UTENTE (
    ID_Utente SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    cognome VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, -- Memorizza l'hash, non la password in chiaro
    indirizzo VARCHAR(255),
    dataRegistrazione TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    statusAccount status_account NOT NULL DEFAULT 'IN_VALIDAZIONE'
);

-- Tabella ANNUNCIO
CREATE TABLE ANNUNCIO (
    ID_Annuncio SERIAL PRIMARY KEY,
    tipoAnnuncio tipo_annuncio NOT NULL,
    titolo VARCHAR(100) NOT NULL,
    descrizione TEXT,
    prezzo NUMERIC(10, 2) CHECK (prezzo >= 0),
    dataCreazione TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modalitaConsegna modalita_consegna NOT NULL,
    luogoConsegna VARCHAR(255),
    statoAnnuncio stato_annuncio NOT NULL DEFAULT 'ATTIVO',
    dataScadenza TIMESTAMP WITH TIME ZONE,
    ID_Utente_FK INT NOT NULL,
    ID_Categoria_FK INT NOT NULL,

    FOREIGN KEY (ID_Utente_FK) REFERENCES UTENTE(ID_Utente) ON DELETE CASCADE,
    FOREIGN KEY (ID_Categoria_FK) REFERENCES CATEGORIA(ID_Categoria),
    CHECK (dataScadenza IS NULL OR dataScadenza > dataCreazione),
    CHECK ( (tipoAnnuncio = 'VENDITA' AND prezzo > 0) OR (tipoAnnuncio = 'REGALO' AND prezzo = 0) OR (tipoAnnuncio = 'SCAMBIO') )
);

-- Tabella OFFERTA_VENDITA
CREATE TABLE OFFERTA_VENDITA (
    ID_Offerta SERIAL PRIMARY KEY,
    prezzo NUMERIC(10, 2) NOT NULL CHECK (prezzo > 0),
    descrizione TEXT,
    dataOfferta TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    statoOfferta stato_offerta NOT NULL DEFAULT 'INVIATA',
    ID_Annuncio_FK INT NOT NULL,
    ID_Utente_FK INT NOT NULL,

    FOREIGN KEY (ID_Annuncio_FK) REFERENCES ANNUNCIO(ID_Annuncio) ON DELETE CASCADE,
    FOREIGN KEY (ID_Utente_FK) REFERENCES UTENTE(ID_Utente) ON DELETE CASCADE
);

-- Tabella REGALO (gestisce la richiesta per un regalo)
CREATE TABLE REGALO (
    ID_Regalo SERIAL PRIMARY KEY,
    descrizione TEXT,
    dataOfferta TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    statoOfferta stato_offerta NOT NULL DEFAULT 'INVIATA',
    ID_Annuncio_FK INT NOT NULL,
    ID_Utente_FK INT NOT NULL,

    FOREIGN KEY (ID_Annuncio_FK) REFERENCES ANNUNCIO(ID_Annuncio) ON DELETE CASCADE,
    FOREIGN KEY (ID_Utente_FK) REFERENCES UTENTE(ID_Utente) ON DELETE CASCADE
);

-- Tabella OFFERTA_SCAMBIO
CREATE TABLE OFFERTA_SCAMBIO (
    ID_Scambio SERIAL PRIMARY KEY,
    descrizione TEXT,
    dataOfferta TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    statoOfferta stato_offerta NOT NULL DEFAULT 'INVIATA',
    ID_Annuncio_FK INT NOT NULL,
    ID_Utente_FK INT NOT NULL,

    FOREIGN KEY (ID_Annuncio_FK) REFERENCES ANNUNCIO(ID_Annuncio) ON DELETE CASCADE,
    FOREIGN KEY (ID_Utente_FK) REFERENCES UTENTE(ID_Utente) ON DELETE CASCADE
);

-- Tabella OGGETTO_PROPOSTO per le offerte di scambio
CREATE TABLE OGGETTO_PROPOSTO (
    ID_OggettoProposto SERIAL PRIMARY KEY,
    descrizione TEXT NOT NULL,
    immagine VARCHAR(255),
    ID_Scambio_FK INT NOT NULL,

    FOREIGN KEY (ID_Scambio_FK) REFERENCES OFFERTA_SCAMBIO(ID_Scambio) ON DELETE CASCADE
);

-- Tabella TRANSAZIONE
CREATE TABLE TRANSAZIONE (
    ID_Transazione SERIAL PRIMARY KEY,
    dataInizio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    statoTransazione stato_transazione NOT NULL DEFAULT 'IN_CORSO',
    ID_Annuncio_FK INT NOT NULL UNIQUE, -- Una sola transazione per annuncio
    ID_Offerta_Vendita_FK INT UNIQUE,
    ID_Regalo_FK INT UNIQUE,
    ID_Scambio_FK INT UNIQUE,
    ID_Utente_Acquirente_FK INT NOT NULL,
    ID_Utente_Venditore_FK INT NOT NULL,

    FOREIGN KEY (ID_Annuncio_FK) REFERENCES ANNUNCIO(ID_Annuncio),
    FOREIGN KEY (ID_Offerta_Vendita_FK) REFERENCES OFFERTA_VENDITA(ID_Offerta),
    FOREIGN KEY (ID_Regalo_FK) REFERENCES REGALO(ID_Regalo),
    FOREIGN KEY (ID_Scambio_FK) REFERENCES OFFERTA_SCAMBIO(ID_Scambio),
    FOREIGN KEY (ID_Utente_Acquirente_FK) REFERENCES UTENTE(ID_Utente),
    FOREIGN KEY (ID_Utente_Venditore_FK) REFERENCES UTENTE(ID_Utente),
    CHECK (ID_Utente_Acquirente_FK <> ID_Utente_Venditore_FK),
    -- Assicura che solo un tipo di offerta sia collegato
    CHECK (
        (ID_Offerta_Vendita_FK IS NOT NULL AND ID_Regalo_FK IS NULL AND ID_Scambio_FK IS NULL) OR
        (ID_Offerta_Vendita_FK IS NULL AND ID_Regalo_FK IS NOT NULL AND ID_Scambio_FK IS NULL) OR
        (ID_Offerta_Vendita_FK IS NULL AND ID_Regalo_FK IS NULL AND ID_Scambio_FK IS NOT NULL)
    )
);

-- Tabella RECENSIONE
CREATE TABLE RECENSIONE (
    ID_Recensione SERIAL PRIMARY KEY,
    descrizione TEXT,
    valutazione INT NOT NULL CHECK (valutazione BETWEEN 1 AND 5),
    dataCreazione TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ID_Transazione_FK INT NOT NULL,
    ID_Utente_Recensore_FK INT NOT NULL,
    ID_Utente_Recensito_FK INT NOT NULL,

    FOREIGN KEY (ID_Transazione_FK) REFERENCES TRANSAZIONE(ID_Transazione),
    FOREIGN KEY (ID_Utente_Recensore_FK) REFERENCES UTENTE(ID_Utente),
    FOREIGN KEY (ID_Utente_Recensito_FK) REFERENCES UTENTE(ID_Utente),
    UNIQUE (ID_Transazione_FK, ID_Utente_Recensore_FK), -- Un utente può lasciare una sola recensione per transazione
    CHECK (ID_Utente_Recensore_FK <> ID_Utente_Recensito_FK)
);

-- Tabella CHAT
CREATE TABLE CHAT (
    ID_Chat SERIAL PRIMARY KEY,
    dataChatCreazione TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tipoChat tipo_chat NOT NULL,
    ID_Annuncio_FK INT,
    ID_Utente1_FK INT NOT NULL,
    ID_Utente2_FK INT NOT NULL,

    FOREIGN KEY (ID_Annuncio_FK) REFERENCES ANNUNCIO(ID_Annuncio),
    FOREIGN KEY (ID_Utente1_FK) REFERENCES UTENTE(ID_Utente),
    FOREIGN KEY (ID_Utente2_FK) REFERENCES UTENTE(ID_Utente),
    CHECK (ID_Utente1_FK <> ID_Utente2_FK)
);

-- Tabella MESSAGGIO
CREATE TABLE MESSAGGIO (
    ID_Messaggio SERIAL PRIMARY KEY,
    contenutoMessaggio TEXT NOT NULL,
    dataInvio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ID_Chat_FK INT NOT NULL,
    ID_Utente_Mittente_FK INT NOT NULL,

    FOREIGN KEY (ID_Chat_FK) REFERENCES CHAT(ID_Chat) ON DELETE CASCADE,
    FOREIGN KEY (ID_Utente_Mittente_FK) REFERENCES UTENTE(ID_Utente)
);

-- Tabella NOTIFICA
CREATE TABLE NOTIFICA (
    ID_Notifica SERIAL PRIMARY KEY,
    tipoNotifica tipo_notifica NOT NULL,
    contenuto TEXT NOT NULL,
    isLetta BOOLEAN NOT NULL DEFAULT FALSE,
    dataInvio TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ID_Utente_FK INT NOT NULL,

    FOREIGN KEY (ID_Utente_FK) REFERENCES UTENTE(ID_Utente) ON DELETE CASCADE
);

-- Tabella PREFERITI
CREATE TABLE PREFERITI (
    ID_Preferiti SERIAL PRIMARY KEY,
    dataAggiunta TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ID_Utente_FK INT NOT NULL,
    ID_Annuncio_FK INT NOT NULL,

    FOREIGN KEY (ID_Utente_FK) REFERENCES UTENTE(ID_Utente) ON DELETE CASCADE,
    FOREIGN KEY (ID_Annuncio_FK) REFERENCES ANNUNCIO(ID_Annuncio) ON DELETE CASCADE,
    UNIQUE (ID_Utente_FK, ID_Annuncio_FK) -- Un utente non può mettere due volte lo stesso annuncio nei preferiti
);

-- =============================================================================
-- 3. Trigger e Funzioni
-- =============================================================================

-- Funzione per criptare la password prima dell'inserimento/aggiornamento
CREATE OR REPLACE FUNCTION hash_password()
RETURNS TRIGGER AS $$
BEGIN
    -- Genera l'hash solo se la password è stata modificata
    IF NEW.password_hash IS NOT NULL AND NEW.password_hash <> OLD.password_hash THEN
        NEW.password_hash = crypt(NEW.password_hash, gen_salt('bf'));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_hash_password
BEFORE INSERT OR UPDATE ON UTENTE
FOR EACH ROW EXECUTE FUNCTION hash_password();

-- Funzione per verificare che un utente non faccia offerte per i propri annunci
CREATE OR REPLACE FUNCTION check_offerta_proprio_annuncio()
RETURNS TRIGGER AS $$
DECLARE
    id_utente_annuncio INT;
BEGIN
    SELECT ID_Utente_FK INTO id_utente_annuncio FROM ANNUNCIO WHERE ID_Annuncio = NEW.ID_Annuncio_FK;
    IF id_utente_annuncio = NEW.ID_Utente_FK THEN
        RAISE EXCEPTION 'Un utente non può fare un''offerta per un proprio annuncio.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_offerta_vendita
BEFORE INSERT ON OFFERTA_VENDITA
FOR EACH ROW EXECUTE FUNCTION check_offerta_proprio_annuncio();

CREATE TRIGGER trigger_check_offerta_scambio
BEFORE INSERT ON OFFERTA_SCAMBIO
FOR EACH ROW EXECUTE FUNCTION check_offerta_proprio_annuncio();

CREATE TRIGGER trigger_check_offerta_regalo
BEFORE INSERT ON REGALO
FOR EACH ROW EXECUTE FUNCTION check_offerta_proprio_annuncio();


-- Funzione per verificare che l'utente che pubblica l'annuncio sia 'ATTIVO'
CREATE OR REPLACE FUNCTION check_utente_attivo_per_annuncio()
RETURNS TRIGGER AS $$
DECLARE
    stato_utente status_account;
BEGIN
    SELECT statusAccount INTO stato_utente FROM UTENTE WHERE ID_Utente = NEW.ID_Utente_FK;
    IF stato_utente <> 'ATTIVO' THEN
        RAISE EXCEPTION 'L''utente deve avere lo status ''ATTIVO'' per creare un annuncio.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_utente_attivo
BEFORE INSERT ON ANNUNCIO
FOR EACH ROW EXECUTE FUNCTION check_utente_attivo_per_annuncio();


-- Funzione per gestire l'accettazione di un'offerta e creare la transazione
CREATE OR REPLACE FUNCTION accetta_offerta_e_crea_transazione()
RETURNS TRIGGER AS $$
DECLARE
    id_annuncio_relativo INT;
    tipo_annuncio_relativo tipo_annuncio;
    id_utente_venditore INT;
    id_utente_acquirente INT;
BEGIN
    -- Se lo stato dell'offerta diventa 'ACCETTATA'
    IF NEW.statoOfferta = 'ACCETTATA' AND OLD.statoOfferta <> 'ACCETTATA' THEN

        -- Identifica l'annuncio e i dati correlati in base alla tabella del trigger
        IF TG_TABLE_NAME = 'offerta_vendita' THEN
            SELECT ID_Annuncio_FK, ID_Utente_FK INTO id_annuncio_relativo, id_utente_acquirente FROM OFFERTA_VENDITA WHERE ID_Offerta = NEW.ID_Offerta;
        ELSIF TG_TABLE_NAME = 'regalo' THEN
            SELECT ID_Annuncio_FK, ID_Utente_FK INTO id_annuncio_relativo, id_utente_acquirente FROM REGALO WHERE ID_Regalo = NEW.ID_Regalo;
        ELSIF TG_TABLE_NAME = 'offerta_scambio' THEN
            SELECT ID_Annuncio_FK, ID_Utente_FK INTO id_annuncio_relativo, id_utente_acquirente FROM OFFERTA_SCAMBIO WHERE ID_Scambio = NEW.ID_Scambio;
        END IF;

        -- Controlla che non esista già un'offerta accettata per questo annuncio
        IF EXISTS (SELECT 1 FROM TRANSAZIONE WHERE ID_Annuncio_FK = id_annuncio_relativo) THEN
            RAISE EXCEPTION 'Esiste già una transazione per questo annuncio. Impossibile accettare un''altra offerta.';
        END IF;

        -- Recupera i dati dell'annuncio
        SELECT ID_Utente_FK, tipoAnnuncio INTO id_utente_venditore, tipo_annuncio_relativo FROM ANNUNCIO WHERE ID_Annuncio = id_annuncio_relativo;

        -- Crea la transazione
        INSERT INTO TRANSAZIONE (ID_Annuncio_FK, ID_Utente_Acquirente_FK, ID_Utente_Venditore_FK, ID_Offerta_Vendita_FK, ID_Regalo_FK, ID_Scambio_FK)
        VALUES (
            id_annuncio_relativo,
            id_utente_acquirente,
            id_utente_venditore,
            CASE WHEN TG_TABLE_NAME = 'offerta_vendita' THEN NEW.ID_Offerta ELSE NULL END,
            CASE WHEN TG_TABLE_NAME = 'regalo' THEN NEW.ID_Regalo ELSE NULL END,
            CASE WHEN TG_TABLE_NAME = 'offerta_scambio' THEN NEW.ID_Scambio ELSE NULL END
        );

        -- Aggiorna lo stato dell'annuncio a 'COMPLETATO'
        UPDATE ANNUNCIO SET statoAnnuncio = 'COMPLETATO' WHERE ID_Annuncio = id_annuncio_relativo;

        -- Rifiuta automaticamente tutte le altre offerte per lo stesso annuncio
        IF TG_TABLE_NAME = 'offerta_vendita' THEN
            UPDATE OFFERTA_VENDITA SET statoOfferta = 'RIFIUTATA' WHERE ID_Annuncio_FK = id_annuncio_relativo AND ID_Offerta <> NEW.ID_Offerta;
        ELSIF TG_TABLE_NAME = 'regalo' THEN
            UPDATE REGALO SET statoOfferta = 'RIFIUTATA' WHERE ID_Annuncio_FK = id_annuncio_relativo AND ID_Regalo <> NEW.ID_Regalo;
        ELSIF TG_TABLE_NAME = 'offerta_scambio' THEN
            UPDATE OFFERTA_SCAMBIO SET statoOfferta = 'RIFIUTATA' WHERE ID_Annuncio_FK = id_annuncio_relativo AND ID_Scambio <> NEW.ID_Scambio;
        END IF;
        
        -- Invia notifica all'utente che ha fatto l'offerta
        INSERT INTO NOTIFICA (tipoNotifica, contenuto, ID_Utente_FK)
        VALUES ('OFFERTA_ACCETTATA', 'La tua offerta per l''annuncio "' || (SELECT titolo FROM ANNUNCIO WHERE ID_Annuncio = id_annuncio_relativo) || '" è stata accettata!', id_utente_acquirente);

    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_accetta_offerta_vendita
AFTER UPDATE ON OFFERTA_VENDITA
FOR EACH ROW EXECUTE FUNCTION accetta_offerta_e_crea_transazione();

CREATE TRIGGER trigger_accetta_offerta_regalo
AFTER UPDATE ON REGALO
FOR EACH ROW EXECUTE FUNCTION accetta_offerta_e_crea_transazione();

CREATE TRIGGER trigger_accetta_offerta_scambio
AFTER UPDATE ON OFFERTA_SCAMBIO
FOR EACH ROW EXECUTE FUNCTION accetta_offerta_e_crea_transazione();

-- Funzione per verificare che le recensioni siano lasciate solo a transazione completata
CREATE OR REPLACE FUNCTION check_transazione_completata_per_recensione()
RETURNS TRIGGER AS $$
DECLARE
    stato_transazione_recensione stato_transazione;
BEGIN
    SELECT statoTransazione INTO stato_transazione_recensione FROM TRANSAZIONE WHERE ID_Transazione = NEW.ID_Transazione_FK;
    IF stato_transazione_recensione <> 'COMPLETATA' THEN
        RAISE EXCEPTION 'Le recensioni possono essere lasciate solo per transazioni completate.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_recensione
BEFORE INSERT ON RECENSIONE
FOR EACH ROW EXECUTE FUNCTION check_transazione_completata_per_recensione();


-- =============================================================================
-- 4. Popolamento del Database
-- =============================================================================

-- Inserimento Categorie
INSERT INTO CATEGORIA (nomeCategoria, descrizione) VALUES
('Libri di Testo', 'Manuali e testi accademici per corsi universitari.'),
('Materiale Informatico', 'Componenti, periferiche e accessori per computer.'),
('Abbigliamento', 'Vestiti, scarpe e accessori di moda.'),
('Strumenti Musicali', 'Strumenti musicali e attrezzatura audio.');

-- Inserimento Utenti (il gruppo è di 3 membri)
-- La password 'password123' viene hashata dal trigger
INSERT INTO UTENTE (nome, cognome, email, password_hash, indirizzo, statusAccount) VALUES
('Mario', 'Rossi', 'mario.rossi@email.com', 'password123', 'Via Roma 1, Napoli', 'ATTIVO'),
('Luigi', 'Verdi', 'luigi.verdi@email.com', 'password123', 'Via Milano 2, Napoli', 'ATTIVO'),
('Anna', 'Bianchi', 'anna.bianchi@email.com', 'password123', 'Via Torino 3, Napoli', 'ATTIVO');

-- Inserimento Annunci
-- Annuncio di VENDITA da Mario
INSERT INTO ANNUNCIO (tipoAnnuncio, titolo, descrizione, prezzo, modalitaConsegna, luogoConsegna, ID_Utente_FK, ID_Categoria_FK) VALUES
('VENDITA', 'Manuale di Basi di Dati', 'Libro quasi nuovo, usato pochissimo.', 25.00, 'A MANO', 'Complesso Universitario Monte Sant''Angelo', 1, 1);

-- Annuncio di SCAMBIO da Luigi
INSERT INTO ANNUNCIO (tipoAnnuncio, titolo, descrizione, prezzo, modalitaConsegna, luogoConsegna, ID_Utente_FK, ID_Categoria_FK) VALUES
('SCAMBIO', 'Mouse Logitech MX Master 3', 'Scambio mouse ergonomico in ottime condizioni con tastiera meccanica.', NULL, 'A MANO', 'Dipartimento di Informatica', 2, 2);

-- Annuncio di REGALO da Anna
INSERT INTO ANNUNCIO (tipoAnnuncio, titolo, descrizione, prezzo, modalitaConsegna, luogoConsegna, ID_Utente_FK, ID_Categoria_FK) VALUES
('REGALO', 'Giacca invernale taglia M', 'Regalo giacca in buone condizioni.', 0.00, 'SPEDIZIONE', NULL, 3, 3);

-- Annuncio completato per testare le recensioni
INSERT INTO ANNUNCIO (tipoAnnuncio, titolo, descrizione, prezzo, modalitaConsegna, luogoConsegna, statoAnnuncio, ID_Utente_FK, ID_Categoria_FK) VALUES
('VENDITA', 'Chitarra Classica', 'Chitarra da studio, perfetta per iniziare.', 80.00, 'A MANO', 'Conservatorio di San Pietro a Majella', 'COMPLETATO', 1, 4);

-- Inserimento Offerte
-- Luigi fa un'offerta per il libro di Mario
INSERT INTO OFFERTA_VENDITA (prezzo, descrizione, ID_Annuncio_FK, ID_Utente_FK) VALUES
(20.00, 'Posso offrire 20 euro, ritiro domani.', 1, 2);

-- Anna fa un'offerta per il libro di Mario
INSERT INTO OFFERTA_VENDITA (prezzo, descrizione, ID_Annuncio_FK, ID_Utente_FK) VALUES
(25.00, 'Accetto il prezzo, disponibile a ritirarlo subito.', 1, 3);

-- Mario fa una richiesta per la giacca di Anna
INSERT INTO REGALO (descrizione, ID_Annuncio_FK, ID_Utente_FK) VALUES
('Sarei molto interessato alla giacca!', 3, 1);

-- Mario fa un'offerta di scambio per il mouse di Luigi
INSERT INTO OFFERTA_SCAMBIO (descrizione, ID_Annuncio_FK, ID_Utente_FK) VALUES
('Ti offro una tastiera da gaming Razer in cambio.', 2, 1);
INSERT INTO OGGETTO_PROPOSTO (descrizione, ID_Scambio_FK) VALUES
('Tastiera Razer BlackWidow, layout italiano', 1);

-- Popolamento per la transazione già completata
-- Offerta che è stata accettata per l'annuncio della chitarra
INSERT INTO OFFERTA_VENDITA (prezzo, statoOfferta, ID_Annuncio_FK, ID_Utente_FK) VALUES
(80.00, 'ACCETTATA', 4, 3); -- Anna compra la chitarra da Mario
-- Transazione completata
INSERT INTO TRANSAZIONE (statoTransazione, ID_Annuncio_FK, ID_Offerta_Vendita_FK, ID_Utente_Acquirente_FK, ID_Utente_Venditore_FK) VALUES
('COMPLETATA', 4, 3, 3, 1);

-- Inserimento Recensioni (possibile perché la transazione 1 è 'COMPLETATA')
-- Anna recensisce Mario
INSERT INTO RECENSIONE (descrizione, valutazione, ID_Transazione_FK, ID_Utente_Recensore_FK, ID_Utente_Recensito_FK) VALUES
('Venditore gentile e puntuale. Prodotto come da descrizione!', 5, 1, 3, 1);
-- Mario recensisce Anna
INSERT INTO RECENSIONE (descrizione, valutazione, ID_Transazione_FK, ID_Utente_Recensore_FK, ID_Utente_Recensito_FK) VALUES
('Acquirente precisa e affidabile. Ottima comunicazione.', 5, 1, 1, 3);

-- Inserimento Chat e Messaggi
-- Chat tra Mario e Anna per la vendita del libro
INSERT INTO CHAT (tipoChat, ID_Annuncio_FK, ID_Utente1_FK, ID_Utente2_FK) VALUES
('VENDITA', 1, 1, 3);

INSERT INTO MESSAGGIO (contenutoMessaggio, ID_Chat_FK, ID_Utente_Mittente_FK) VALUES
('Ciao Anna, ho visto la tua offerta. Per me va bene 25 euro. Quando saresti disponibile per incontrarci?', 1, 1);
INSERT INTO MESSAGGIO (contenutoMessaggio, ID_Chat_FK, ID_Utente_Mittente_FK) VALUES
('Ciao Mario! Perfetto. Io sarei libera domani pomeriggio a Monte Sant''Angelo.', 1, 3);

-- Inserimento Notifiche (alcune generate dai trigger, altre inserite manualmente)
INSERT INTO NOTIFICA (tipoNotifica, contenuto, ID_Utente_FK) VALUES
('OFFERTA_RICEVUTA', 'Hai ricevuto una nuova offerta per "Manuale di Basi di Dati"', 1);

-- Inserimento Preferiti
-- Anna aggiunge il mouse di Luigi ai preferiti
INSERT INTO PREFERITI (ID_Utente_FK, ID_Annuncio_FK) VALUES
(3, 2);

-- =============================================================================
-- Esempio di utilizzo delle funzioni/procedure
-- =============================================================================

-- Esempio di accettazione di un'offerta: Mario accetta l'offerta di Anna per il libro.
-- Questo triggerà:
-- 1. La creazione di una TRANSAZIONE.
-- 2. L'aggiornamento dello stato dell'ANNUNCIO a 'COMPLETATO'.
-- 3. Il rifiuto automatico dell'altra offerta (quella di Luigi).
-- 4. L'invio di una NOTIFICA ad Anna.

-- UPDATE OFFERTA_VENDITA SET statoOfferta = 'ACCETTATA' WHERE ID_Offerta = 2;

-- SELECT * FROM TRANSAZIONE;
-- SELECT statoAnnuncio FROM ANNUNCIO WHERE ID_Annuncio = 1;
-- SELECT statoOfferta FROM OFFERTA_VENDITA WHERE ID_Offerta = 1;
-- SELECT * FROM NOTIFICA WHERE ID_Utente_FK = 3;


-- =============================================================================
-- Fine dello script.
-- =============================================================================