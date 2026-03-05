# UML Ristrutturato – Unina Swap (testuale)

- **Utente**
  - nome, cognome, email, password, dataRegistrazione, ateneoAppartenenza, bio, valutazioneUtente, statoAccount, ruolo
  - <<PK>> idUtente
  - <<1:N>> Annuncio
  - <<1:N>> Messaggio (come mittente/destinatario)
  - <<1:N>> Notifica
  - <<N:N>> Recensione (come recensore/recensito)
  - <<1:N>> OffertaVendita/Regalo/OffertaScambio (come offerente)

- **Categoria**
  - nomeCategoria, descrizione
  - <<PK>> idCategoria
  - <<1:N>> Annuncio

- **Annuncio**
  - tipoAnnuncio, statoAnnuncio, dataPubblicazione, dataScadenza, dataCompletamento
  - <<PK>> idAnnuncio
  - <<FK>> idUtente
  - <<FK>> idCategoria
  - <<1:N>> OffertaVendita/Regalo/OffertaScambio
  - <<1:1>> Transazione

- **Messaggio**
  - contenutoMessaggio, dataInvio
  - <<PK>> idMessaggio
  - <<FK>> idUtenteMittente
  - <<FK>> idUtenteDestinatario

- **Notifica**
  - tipoNotifica, contenutoNotifica, statoNotifica, dataInvio, dataLettura
  - <<PK>> idNotifica
  - <<FK>> idUtente

- **Recensione**
  - testoRecensione, valoreRecensione, dataRecensione
  - <<PK>> idRecensione
  - <<FK>> idUtenteRecensore
  - <<FK>> idUtenteRecensito

- **OffertaVendita**
  - statoOfferta, importo, dataOfferta, dataAccettazione, dataRifiuto
  - <<PK>> idOffertaVendita
  - <<FK>> idAnnuncio
  - <<FK>> idUtenteOfferente

- **Regalo**
  - statoOfferta, motivazione, dataOfferta, dataAccettazione, dataRifiuto
  - <<PK>> idRegalo
  - <<FK>> idAnnuncio
  - <<FK>> idUtenteOfferente

- **OffertaScambio**
  - statoOfferta, descrizioneOggetti, dataOfferta, dataAccettazione, dataRifiuto
  - <<PK>> idOffertaScambio
  - <<FK>> idAnnuncio
  - <<FK>> idUtenteOfferente
  - <<1:N>> AggiungiOggetti

- **Transazione**
  - dataInizio, dataTermine, statoTransazione
  - <<PK>> idTransazione
  - <<FK>> idAnnuncio
  - <<FK>> idUtenteAcquirente
  - <<1:1>> Spedizione

- **Spedizione**
  - tipoSpedizione, statoSpedizione, dataPreparazione, dataInViaggio, dataConsegnata
  - <<PK>> idSpedizione
  - <<FK>> idTransazione

- **AggiungiOggetti**
  - dataAggiunta, oggettoProposto
  - <<PK>> idAggiunta
  - <<FK>> idOffertaScambio

---

## Enumerazioni
- StatoAccount, RuoloUtente, TipoAnnuncio, StatoAnnuncio, StatoTransazione, StatoOfferta, StatoNotifica, StatoSpedizione