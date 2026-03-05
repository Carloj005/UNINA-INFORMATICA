# Dizionario Entità, Relazioni e Vincoli – Unina Swap

## Entità

### UTENTE
- **PK:** idUtente
- nome: String
- cognome: String
- email: String (UNIQUE)
- password: String
- dataRegistrazione: DateTime
- ateneoAppartenenza: String
- bio: String (opzionale)
- valutazioneUtente: Float
- statoAccount: StatoAccount (enum: ATTIVO, SOSPESO, RIMOSSO)
- ruolo: RuoloUtente (enum: USER, ADMIN)

### ANNUNCIO
- **PK:** idAnnuncio
- **FK:** idUtente (pubblicato da)
- tipoAnnuncio: TipoAnnuncio (enum: VENDITA, SCAMBIO, REGALO)
- statoAnnuncio: StatoAnnuncio (enum: ATTIVO, SCADUTO, RIMOSSO, COMPLETATO)
- dataPubblicazione: DateTime
- dataScadenza: DateTime
- dataCompletamento: DateTime
- **FK:** idCategoria

### CATEGORIA
- **PK:** idCategoria
- nomeCategoria: String
- descrizione: String

### MESSAGGIO
- **PK:** idMessaggio
- contenutoMessaggio: Text
- dataInvio: DateTime
- **FK:** idUtenteMittente
- **FK:** idUtenteDestinatario

### NOTIFICA
- **PK:** idNotifica
- tipoNotifica: TipoNotifica (enum)
- contenutoNotifica: String
- statoNotifica: StatoNotifica (enum)
- dataInvio: DateTime
- dataLettura: DateTime
- **FK:** idUtente

### RECENSIONE
- **PK:** idRecensione
- testoRecensione: String
- valoreRecensione: Integer
- dataRecensione: DateTime
- **FK:** idUtenteRecensore
- **FK:** idUtenteRecensito

### OFFERTAVENDITA
- **PK:** idOffertaVendita
- statoOfferta: StatoOfferta (enum)
- importo: Float
- dataOfferta: DateTime
- dataAccettazione: DateTime
- dataRifiuto: DateTime
- **FK:** idAnnuncio
- **FK:** idUtenteOfferente

### REGALO
- **PK:** idRegalo
- statoOfferta: StatoOfferta (enum)
- motivazione: String
- dataOfferta: DateTime
- dataAccettazione: DateTime
- dataRifiuto: DateTime
- **FK:** idAnnuncio
- **FK:** idUtenteOfferente

### OFFERTASCIAMBIO
- **PK:** idOffertaScambio
- statoOfferta: StatoOfferta (enum)
- descrizioneOggetti: String
- dataOfferta: DateTime
- dataAccettazione: DateTime
- dataRifiuto: DateTime
- **FK:** idAnnuncio
- **FK:** idUtenteOfferente

### TRANSAZIONE
- **PK:** idTransazione
- dataInizio: DateTime
- dataTermine: DateTime
- statoTransazione: StatoTransazione (enum)
- **FK:** idAnnuncio
- **FK:** idUtenteAcquirente

### SPEDIZIONE
- **PK:** idSpedizione
- tipoSpedizione: String
- statoSpedizione: StatoSpedizione (enum)
- dataPreparazione: DateTime
- dataInViaggio: DateTime
- dataConsegnata: DateTime
- **FK:** idTransazione

### AGGIUNGIOGGETTI
- **PK:** idAggiunta
- dataAggiunta: DateTime
- oggettoProposto: String
- **FK:** idOffertaScambio

---

## Relazioni e Vincoli

- Un **Utente** può pubblicare molti **Annunci** (1:N).
- Un **Annuncio** appartiene ad una sola **Categoria** (N:1).
- Un **Annuncio** può ricevere molte **Offerte** (Vendita, Scambio, Regalo) (1:N).
- Un **Utente** può inviare e ricevere molti **Messaggi** (N:N).
- Un **Utente** può ricevere molte **Notifiche** (1:N).
- Una **Transazione** è associata ad un Annuncio e un Utente (acquirente).
- Una **Transazione** può avere una **Spedizione** (1:1 o 1:N).
- Un **Utente** può lasciare molte **Recensioni** e riceverne molte (N:N).
- **AggiungiOggetti** è legato solo alle offerte di scambio.

---

## Enumerazioni

- **TipoAnnuncio:** VENDITA, SCAMBIO, REGALO
- **RuoloUtente:** USER, ADMIN
- **StatoAnnuncio:** ATTIVO, SCADUTO, RIMOSSO, COMPLETATO
- **StatoTransazione:** IN_CORSO, COMPLETATA, ANNULLATA
- **StatoOfferta:** INVIATA, ACCETTATA, RIFIUTATA, SCADUTA
- **StatoAccount:** ATTIVO, SOSPESO, RIMOSSO
- **TipoNotifica:** NUOVO_MESSAGGIO, OFFERTA_RICEVUTA, OFFERTA_ACCETTATA, OFFERTA_RIFIUTATA, ecc.
- **StatoNotifica:** INVIATA, LETTA
- **StatoSpedizione:** IN_PREPARAZIONE, IN_VIAGGIO, CONSEGNATA

---