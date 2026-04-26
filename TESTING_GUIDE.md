# 🧪 GUIDA RAPIDA DI TESTING - Gestisci Player

## 🎬 Come testare le nuove funzionalità

### Prerequisiti
- L'app è in esecuzione: `npm run dev`
- Accedi all'app: http://localhost:5174/
- Crea un tavolo con almeno 2 player

---

## TEST 1: Live Update (Zero Latency)
**Obiettivo:** Verificare che il modal aggiorni i dati istantaneamente

### Passaggi:
1. ✅ Crea tavolo con 2 player
2. ✅ Clicca su un player → "Gestisci Player"
3. ✅ Il modal è aperto
4. ✅ **IN PARALLELO**: Dalla schermata principale, aggiungi un buy-in al player via "Aggiungi Buy-in"
5. ✅ **Guarda il modal aperto** → Deve aggiornare ISTANTANEAMENTE
6. ✅ Il totale (€XX) nel header del modal deve aumentare

**Risultato Atteso:** ✨ Nessuna latenza, aggiornamento atomico

---

## TEST 2: Modifica Buy-in
**Obiettivo:** Testare la modifica di un singolo buy-in

### Passaggi:
1. ✅ Player con buy-in: [€20, €30, €50]
2. ✅ Clicca "Gestisci Player"
3. ✅ Clicca [Modifica] su Buy-in #2 (€30)
4. ✅ Input cambiam: scrivi "25"
5. ✅ Clicca [✓ Salva]
6. ✅ Buy-in #2 passa da €30 a €25
7. ✅ Totale header: €20 + €25 + €50 = €95

**Risultato Atteso:** 
- ✨ Buy-in modificato
- ✨ Totale aggiornato
- ✨ Altri buy-in intatti

---

## TEST 3: Riduci Buy-in (Non elimina)
**Obiettivo:** Testare riduzione che mantiene il buy-in

### Passaggi:
1. ✅ Buy-in #1 = €50
2. ✅ Clicca [Riduci]
3. ✅ Input: scrivi "15"
4. ✅ Clicca [✓ Riduci]
5. ✅ Buy-in #1 diventa €35 (non eliminato!)
6. ✅ Verifico il totale

**Risultato Atteso:**
```
€50 - €15 = €35 ✓
Buy-in rimane visibile
Card aggiornata live
```

---

## TEST 4: Riduci Buy-in (Fino a Zero/Eliminazione)
**Obiettivo:** Testare riduzione che elimina il buy-in

### Passaggi:
1. ✅ Buy-in #2 = €20
2. ✅ Clicca [Riduci]
3. ✅ Input: scrivi "25" (più di quanto vale)
4. ✅ Clicca [✓ Riduci]
5. ✅ Buy-in #2 sparisce dalla lista
6. ✅ Numero di buy-in diminuisce
7. ✅ Totale aggiornato (senza quel buy-in)

**Risultato Atteso:**
```
€20 - €25 = -5 → Automaticamente eliminato
Buy-in NON visibile
Card remove dal DOM
```

---

## TEST 5: Elimina Buy-in
**Obiettivo:** Testare eliminazione diretta

### Passaggi:
1. ✅ Player con buy-in: [€20, €30]
2. ✅ Clicca "Gestisci Player"
3. ✅ Clicca [Elimina] su Buy-in #1 (€20)
4. ✅ Buy-in #1 sparisce
5. ✅ Rimane solo Buy-in #2 (€30)
6. ✅ Totale: €30

**Risultato Atteso:**
- ✨ Buy-in rimosso
- ✨ Lista aggiornata
- ✨ Totale ricalcolato

---

## TEST 6: Aggiungi Nuovo Buy-in (Durante Edit)
**Obiettivo:** Aggiungere un nuovo buy-in mentre il modal è aperto

### Passaggi:
1. ✅ Player con buy-in: [€20]
2. ✅ Clicca "Gestisci Player"
3. ✅ Scorri giù sezione "Aggiungi Buy-in"
4. ✅ Input: scrivi "15"
5. ✅ Clicca [+ Aggiungi]
6. ✅ Nuovo buy-in aggiunto alla lista
7. ✅ Ora: [€20, €15]
8. ✅ Totale: €35

**Risultato Atteso:**
```
Modal rimane aperto
Nuova card appare
Input svuota
Totale aggiornato live
```

---

## TEST 7: Multiple Operations (Stress Test)
**Obiettivo:** Testare operazioni multiple in sequenza

### Passaggi:
```
1. Modifica Buy-in #1: €20 → €25
2. Riduci Buy-in #2 di €5
3. Aggiungi nuovo €40
4. Elimina Buy-in #3
5. Modifica di nuovo Buy-in #1: €25 → €30
```

**Verifiche:**
- ✅ Ogni operazione è immediata
- ✅ Totale aggiornato ad ogni passo
- ✅ State rimane coerente
- ✅ Nessun errore console

---

## TEST 8: UI Responsive (Mobile)
**Obiettivo:** Testare responsiveness su dispositivi piccoli

### Passaggi (DevTools):
1. ✅ F12 → Toggle device toolbar
2. ✅ Seleziona "iPhone 12"
3. ✅ Clicca "Gestisci Player"
4. ✅ Modal appare fullscreen
5. ✅ Bottoni sono tocabili (tap-friendly)
6. ✅ Input decimal mode attivo
7. ✅ Scroll fluido

**Verifiche:**
- ✅ Layout non rompe
- ✅ Bottoni rimangono cliccabili
- ✅ Input facili da usare
- ✅ Font leggibile

---

## TEST 9: Activity Log
**Obiettivo:** Verificare che le azioni siano registrate

### Passaggi:
1. ✅ Modifica un buy-in (es. €20 → €25)
2. ✅ Chiudi il modal
3. ✅ Scorri la schermata principale → Activity section
4. ✅ Deve esserci un log tipo: "Corretto buy-in 1 di Marco a € 25.00"

**Verifiche:**
- ✅ Ogni operazione è loggata
- ✅ Timestamp presente
- ✅ Descrizione accurata

---

## TEST 10: Edge Cases

### Case 1: Input Non Valido
```
Input: "abc" → Non è numero
Result: Ignora, no errore crash ✓
```

### Case 2: Input Negativo
```
Input: "-10"
Result: Validazione blocca ✓
```

### Case 3: Input Decimale
```
Input: "10,50" (formato EU)
Result: Convertito a 10.5 ✓
```

### Case 4: Player Senza Buy-in
```
Stato iniziale: buyIns = []
Modal apre: mostra "Nessun buy-in aggiunto"
Aggiungi: €20 → Prima voce aggiunta ✓
```

---

## 🎯 CHECKLIST FINALE

Dopo i test, verifica che:

- [ ] Live update funziona (0 latenza)
- [ ] Modifica singolo buy-in OK
- [ ] Riduci mantiene il buy-in se > 0
- [ ] Riduci elimina se ≤ 0
- [ ] Elimina diretto funziona
- [ ] Aggiungi nuovo buy-in OK
- [ ] Totale sempre corretto
- [ ] Activity log registra tutto
- [ ] Mobile responsive ✓
- [ ] Nessun errore console

---

## 🐛 Se trovi un bug...

1. **Apri console** (F12 → Console)
2. **Prendi screenshot dell'errore**
3. **Nota i passaggi per riprodurlo**
4. **Segnala con dettagli**

---

## 📊 Performance Check

Apri DevTools (F12) → Performance tab:
- [ ] Modifica buy-in < 100ms render
- [ ] Live update < 50ms visibile
- [ ] No memory leaks
- [ ] 60fps smooth scroll

---

## 🎮 Divertiti con i test! 🎰
