# Schema Logico Relazionale – Versione Testuale

---

## UTENTE
- **Chiave primaria:** idUtente
- nome: String
- cognome: String
- email: String (univoca)
- password: String
- dataRegistrazione: DateTime
- ateneoAppartenenza: String
- bio: String (opzionale)
- valutazioneUtente: Float
- statoAccount: StatoAccount (ATTIVO, SOSPESO, RIMOSSO)
- ruolo: RuoloUtente (USER, ADMIN)

## CATEGORIA
- **Chiave primaria:** idCategoria
- nomeCategoria: String
- descrizione: String

## ANNUNCIO
- **Chiave primaria:** idAnnuncio
- **Chiave esterna:** idUtente (pubblicante)
- **Chiave esterna:** idCategoria
- tipoAnnuncio: TipoAnnuncio (VENDITA, SCAMBIO, REGALO)
- statoAnnuncio: StatoAnnuncio (ATTIVO, SCADUTO, RIMOSSO, COMPLETATO)
- dataPubblicazione: DateTime
- dataScadenza: DateTime
- dataCompletamento: DateTime

## MESSAGGIO
- **Chiave primaria:** idMessaggio
- contenutoMessaggio: Testo
- dataInvio: DateTime
- **Chiave esterna:** idUtenteMittente
- **Chiave esterna:** idUtenteDestinatario

## NOTIFICA
- **Chiave primaria:** idNotifica
- tipoNotifica: TipoNotifica
- contenutoNotifica: String
- statoNotifica: StatoNotifica (INVIATA, LETTA)
- dataInvio: DateTime
- dataLettura: DateTime
- **Chiave esterna:** idUtente

## RECENSIONE
- **Chiave primaria:** idRecensione
- testoRecensione: String
- valoreRecensione: Integer
- dataRecensione: DateTime
- **Chiave esterna:** idUtenteRecensore
- **Chiave esterna:** idUtenteRecensito

## OFFERTA VENDITA
- **Chiave primaria:** idOffertaVendita
- statoOfferta: StatoOfferta (INVIATA, ACCETTATA, RIFIUTATA, SCADUTA)
- importo: Float
- dataOfferta: DateTime
- dataAccettazione: DateTime
- dataRifiuto: DateTime
- **Chiave esterna:** idAnnuncio
- **Chiave esterna:** idUtenteOfferente

## REGALO
- **Chiave primaria:** idRegalo
- statoOfferta: StatoOfferta (INVIATA, ACCETTATA, RIFIUTATA, SCADUTA)
- motivazione: String
- dataOfferta: DateTime
- dataAccettazione: DateTime
- dataRifiuto: DateTime
- **Chiave esterna:** idAnnuncio
- **Chiave esterna:** idUtenteOfferente

## OFFERTA SCAMBIO
- **Chiave primaria:** idOffertaScambio
- statoOfferta: StatoOfferta (INVIATA, ACCETTATA, RIFIUTATA, SCADUTA)
- descrizioneOggetti: String
- dataOfferta: DateTime
- dataAccettazione: DateTime
- dataRifiuto: DateTime
- **Chiave esterna:** idAnnuncio
- **Chiave esterna:** idUtenteOfferente

## TRANSAZIONE
- **Chiave primaria:** idTransazione
- dataInizio: DateTime
- dataTermine: DateTime
- statoTransazione: StatoTransazione (IN_CORSO, COMPLETATA, ANNULLATA)
- **Chiave esterna:** idAnnuncio
- **Chiave esterna:** idUtenteAcquirente

## SPEDIZIONE
- **Chiave primaria:** idSpedizione
- tipoSpedizione: String
- statoSpedizione: StatoSpedizione (IN_PREPARAZIONE, IN_VIAGGIO, CONSEGNATA)
- dataPreparazione: DateTime
- dataInViaggio: DateTime
- dataConsegnata: DateTime
- **Chiave esterna:** idTransazione

## AGGIUNGIOGGETTI (per OffertaScambio)
- **Chiave primaria:** idAggiunta
- dataAggiunta: DateTime
- oggettoProposto: String
- **Chiave esterna:** idOffertaScambio

---

## Relazioni principali
- Un Utente può pubblicare più Annunci (1:N)
- Un Annuncio appartiene a una sola Categoria (N:1)
- Un Annuncio può ricevere più Offerte (Vendita, Scambio, Regalo) (1:N)
- Un Utente può inviare e ricevere più Messaggi (N:N)
- Un Utente può ricevere molte Notifiche (1:N)
- Una Transazione è associata a un Annuncio e un Utente (acquirente)
- Una Transazione può avere una Spedizione (1:1 o 1:N)
- Un Utente può lasciare molte Recensioni e riceverne molte (N:N)
- AggiungiOggetti è legato solo alle Offerte di Scambio

---

## Enumerazioni
- TipoAnnuncio: VENDITA, SCAMBIO, REGALO
- RuoloUtente: USER, ADMIN
- StatoAnnuncio: ATTIVO, SCADUTO, RIMOSSO, COMPLETATO
- StatoTransazione: IN_CORSO, COMPLETATA, ANNULLATA
- StatoOfferta: INVIATA, ACCETTATA, RIFIUTATA, SCADUTA
- StatoAccount: ATTIVO, SOSPESO, RIMOSSO
- TipoNotifica: NUOVO_MESSAGGIO, OFFERTA_RICEVUTA, OFFERTA_ACCETTATA, OFFERTA_RIFIUTATA, ecc.
- StatoNotifica: INVIATA, LETTA
- StatoSpedizione: IN_PREPARAZIONE, IN_VIAGGIO, CONSEGNATA