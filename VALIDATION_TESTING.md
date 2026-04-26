# Testing Guide: Validazione Input Numerici

## Panoramica
Questa guida descrive come testare la nuova validazione degli input numerici in tutta l'applicazione Home-Games.

## Cosa è stato implementato

### 1. Utility di Validazione (`src/utils/validation.js`)
- **`validateAmount(value, options)`**: Valida importi come numeri interi positivi
- **`filterNumericInput(value)`**: Filtra input in tempo reale, permettendo solo cifre (0-9)
- **`isValidInteger(value)`**: Controlla se un valore è un intero valido
- Messaggi di errore chiari e user-friendly

### 2. Componenti Aggiornati

#### Setup.jsx
- Input Buy-in per ogni giocatore
- Validazione in tempo reale + validazione al blur
- Messaggi di errore sotto ogni input

#### TableView.jsx
- Input "Aggiungi Buy-in" per giocatori esistenti
- Input "Buy-in iniziale" per nuovi giocatori
- Validazione con messaggi di errore

#### EditPlayerModal.jsx
- Input "Aggiungi Buy-in" (quando non ci sono buy-in)
- Input "Add-on" (modifica buy-in esistente)
- Input "Riduci" (riduzione importo)
- Tutti con validazione e messaggi di errore

#### FinalResults.jsx
- Input "Stack finale" per ogni giocatore
- Validazione migliorata con filtro numerico

## Come Testare

### Test 1: Input Non Validi (Devono Essere Bloccati)

Per ogni input economico nell'app, prova questi valori:

| Input | Risultato Atteso |
|-------|------------------|
| `2.` | ❌ Errore: "Carattere non consentito..." |
| `2,` | ❌ Errore: "Carattere non consentito..." |
| `abc` | ❌ Errore: "Carattere non consentito..." |
| `2a` | ❌ Errore: "Carattere non consentito..." |
| `..` | ❌ Errore: "Carattere non consentito..." |
| `-20` | ❌ Errore: "Carattere non consentito..." |
| `20e` | ❌ Errore: "Carattere non consentito..." |
| ` ` (spazio) | ❌ Errore: "Carattere non consentito..." |
| `€20` | ❌ Errore: "Carattere non consentito..." |
| `1,5` | ❌ Errore: "Carattere non consentito..." |
| `10.50` | ❌ Errore: "Carattere non consentito..." |

### Test 2: Input Validi (Devono Essere Accettati)

| Input | Risultato Atteso |
|-------|------------------|
| `10` | ✅ Accettato |
| `20` | ✅ Accettato |
| `50` | ✅ Accettato |
| `100` | ✅ Accettato |
| `0` | ✅ Accettato (solo dove allowZero: true) |

### Test 3: Comportamento UX

1. **Errore visibile**: Quando inserisci caratteri non validi, deve apparire un messaggio rosso sotto l'input
2. **Colore coerente**: Il bordo dell'input diventa rosso (#f44336)
3. **Messaggio leggibile**: Il testo dell'errore è chiaro e visibile su mobile
4. **Scompare quando corretto**: L'errore scompare quando l'utente corregge l'input
5. **Nessun alert browser**: Non devono comparire alert nativi del browser

### Test 4: Scenari Specifici per Componente

#### Setup del Tavolo
1. Vai alla schermata iniziale
2. Prova a inserire buy-in non validi per i giocatori
3. Verifica che appaiano gli errori
4. Prova a creare il tavolo con buy-in non validi → deve bloccare
5. Correggi gli input → gli errori scompaiono
6. Crea tavolo con valori validi → deve procedere

#### TableView - Aggiungi Buy-in
1. Seleziona un giocatore
2. Clicca "Aggiungi Buy-in"
3. Prova a inserire valori non validi
4. Verifica errore e blocco del pulsante Conferma
5. Inserisci valore valido → deve accettare

#### TableView - Nuovo Player
1. Clicca il pulsante "+" per aggiungere player
2. Prova buy-in non validi
3. Verifica errore
4. Inserisci valore valido → deve aggiungere

#### EditPlayerModal
1. Clicca "Gestisci Player"
2. Prova ad aggiungere buy-in con valori non validi
3. Prova add-on con valori non validi
4. Prova riduzione con valori non validi
5. Verifica che tutti mostrino errori appropriati

#### Conti Finali
1. Vai ai conti finali
2. Prova a inserire stack finali non validi
3. Verifica errori
4. Il pulsante "Procedi" deve essere disabilitato finché ci sono errori

## Verifica Finale

Esegui tutti i test sopra e verifica che:
- [ ] Tutti gli input economici accettano solo numeri interi
- [ ] I messaggi di errore sono chiari e visibili
- [ ] Gli errori scompaiono quando l'input è corretto
- [ ] Non ci sono alert browser nativi
- [ ] L'UX è coerente in tutta l'app
- [ ] Il design è mobile-first e leggibile

## Note Tecniche

- La validazione avviene su due livelli:
  1. **Filtro in tempo reale**: `filterNumericInput()` rimuove caratteri non numerici durante la digitazione
  2. **Validazione al blur**: `validateAmount()` valida il valore completo quando l'input perde il focus

- Gli errori vengono visualizzati con:
  - Bordo rosso sull'input (`.inputError`)
  - Messaggio sotto l'input (`.inputErrorMsg`)
  - Icona ⚠️ prima del messaggio

- I messaggi di errore sono personalizzati per campo (es: "Buy-in giocatore 1", "Stack finale", etc.)