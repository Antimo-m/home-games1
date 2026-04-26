# 🎨 VISUAL SUMMARY - Nuova Interfaccia "Gestisci Player"

## 📱 Layout Desktop

```
┌─────────────────────────────────────────────────────────────┐
│                        OVERLAY (Dark, Blurred)             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Marco Rossi              Totale: €95                │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │                                                      │   │
│  │ NOME PLAYER                                          │   │
│  │ ┌─────────────────────────────────┐ ┌────────────┐ │   │
│  │ │ Marco Rossi                     │ │    Salva   │ │   │
│  │ └─────────────────────────────────┘ └────────────┘ │   │
│  │                                                      │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │                                                      │   │
│  │ BUY-INS GESTIONE                                     │   │
│  │                                                      │   │
│  │ ┌──────────────────────────────────────────────────┐ │   │
│  │ │ Buy-in #1                              €20       │ │   │
│  │ │ ┌─────────┐ ┌─────────┐ ┌─────────┐             │ │   │
│  │ │ │Modifica │ │ Riduci  │ │Elimina  │             │ │   │
│  │ │ │  (BLU)  │ │ (ARANCIO)│ │ (ROSSO) │             │ │   │
│  │ │ └─────────┘ └─────────┘ └─────────┘             │ │   │
│  │ └──────────────────────────────────────────────────┘ │   │
│  │                                                      │   │
│  │ ┌──────────────────────────────────────────────────┐ │   │
│  │ │ Buy-in #2                              €30       │ │   │
│  │ │ ┌─────────┐ ┌─────────┐ ┌─────────┐             │ │   │
│  │ │ │Modifica │ │ Riduci  │ │Elimina  │             │ │   │
│  │ │ └─────────┘ └─────────┘ └─────────┘             │ │   │
│  │ └──────────────────────────────────────────────────┘ │   │
│  │                                                      │   │
│  │ ┌──────────────────────────────────────────────────┐ │   │
│  │ │ Buy-in #3                              €50       │ │   │
│  │ │ ┌─────────┐ ┌─────────┐ ┌─────────┐             │ │   │
│  │ │ │Modifica │ │ Riduci  │ │Elimina  │             │ │   │
│  │ │ └─────────┘ └─────────┘ └─────────┘             │ │   │
│  │ └──────────────────────────────────────────────────┘ │   │
│  │                                                      │   │
│  │ ┌─────────────────────────────┐ ┌──────────────┐  │   │
│  │ │ Nuovo importo buy-in        │ │ + Aggiungi   │  │   │
│  │ │ €_____                      │ │  (VERDE)     │  │   │
│  │ └─────────────────────────────┘ └──────────────┘  │   │
│  │                                                      │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │                                                      │   │
│  │      ┌──────────────────────────────────────────┐  │   │
│  │      │ ⚠️ Elimina Player      (ROSSO SCURO)     │  │   │
│  │      └──────────────────────────────────────────┘  │   │
│  │                                                      │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │          ┌──────────────────────────────────┐       │   │
│  │          │           Chiudi                 │       │   │
│  │          │          (GRIGIO)                │       │   │
│  │          └──────────────────────────────────┘       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔵 Stato: Normale (Viewing Mode)

```
┌──────────────────────────────┐
│ Buy-in #1            €20     │
├──────────────────────────────┤
│ [Modifica] [Riduci] [Elimina]│
└──────────────────────────────┘
```

---

## 🟦 Stato: Modifica (Edit Mode)

```
┌──────────────────────────────┐
│ Buy-in #1            €20     │
├──────────────────────────────┤
│ ┌──────────────────────────┐ │
│ │ €_______                │ │  ← Input con keyboard decimale
│ └──────────────────────────┘ │
│ [✓ Salva]    [✕ Annulla]    │
└──────────────────────────────┘

Scenario: User scrive "15"
Risultato: €20 → €15 (immediato)
```

---

## 🟧 Stato: Riduci (Reduce Mode)

```
┌──────────────────────────────┐
│ Buy-in #1            €50     │
├──────────────────────────────┤
│ ┌──────────────────────────┐ │
│ │ Ridurre di: €_____       │ │  ← Importo da sottrarre
│ └──────────────────────────┘ │
│ [✓ Riduci]    [✕ Annulla]    │
└──────────────────────────────┘

Scenario 1: User scrive "15"
Risultato: €50 - €15 = €35 ✓ (rimane visibile)

Scenario 2: User scrive "60"
Risultato: €50 - €60 = -10 ≤ 0 → Buy-in ELIMINATO
```

---

## 🎨 SCHEMA COLORI

### Bottoni per Azione

| Azione | Colore | RGB | Uso |
|--------|--------|-----|-----|
| **[Modifica]** | 🔵 Blu | #2196F3 | Modifica diretta |
| **[Riduci]** | 🟠 Arancione | #FF9800 | Sottrazione |
| **[Elimina]** | 🔴 Rosso | #f44336 | Rimozione singolo |
| **[✓ Salva]** | 🟢 Verde | #4CAF50 | Conferma positiva |
| **[✕ Annulla]** | ⚪ Grigio | #666 | Annulla operazione |
| **[+ Aggiungi]** | 🟢 Verde | #4CAF50 | Azione positiva |
| **[Chiudi]** | ⚪ Grigio | #555 | Neutro |
| **[⚠️ Elimina Player]** | 🔴 Scuro | #d32f2f | Azione distruttiva |

### Colori Background

| Elemento | Colore | Contrasto |
|----------|--------|-----------|
| Modal Background | #111 → #0f0f0f (gradient) | ✓ AAA |
| Card Background | #1a1a1a | ✓ AA |
| Card Hover | #222 | ✓ AA |
| Input Background | #222 | ✓ AAA |
| Overlay Background | rgba(0,0,0,.7) | ✓ AAA |

---

## 📊 TRANSIZIONI VISUALI

### Click Flow

```
User Click su [Modifica]
    ↓
    500ms fade-in input form
    ↓
Input è focused (keyboard appare su mobile)
    ↓
User scrive numero
    ↓
Click [✓ Salva]
    ↓
    100ms form fade-out
    ↓
    Buy-in card aggiorna valore
    ↓
    Totale header animate (color flash)
```

### Hover Effects

```
Before:  [Modifica] (text only)
         ↓ mouse over
After:   [Modifica] (background blue, shadow)
         └─ shadow: 0 4px 12px rgba(33, 150, 243, 0.3)

Scale: 1.0 → 1.02 on hover
Active: 1.02 → 0.98 on click (feedback)
```

---

## 📱 Layout Mobile

```
┌──────────────────────────┐
│ Marco Rossi   €95        │  ← Header full width
├──────────────────────────┤
│ NOME PLAYER              │
│ ┌──────────────────────┐ │
│ │ Marco Rossi         │ │
│ └──────────────────────┘ │
│ ┌──────────────────────┐ │
│ │ Salva   (Full width) │ │  ← Bottone pieno
│ └──────────────────────┘ │
├──────────────────────────┤
│ BUY-INS GESTIONE         │
│ ┌──────────────────────┐ │
│ │ Buy-in #1     €20   │ │
│ ├──────────────────────┤ │
│ │ ┌────┐ ┌────┐ ┌───┐ │ │
│ │ │Mod │ │Red │ │Del│ │ │  ← Flex wrap
│ │ └────┘ └────┘ └───┘ │ │
│ └──────────────────────┘ │
│ ┌──────────────────────┐ │
│ │ Buy-in #2     €30   │ │
│ ├──────────────────────┤ │
│ │ ┌────┐ ┌────┐ ┌───┐ │ │
│ │ │Mod │ │Red │ │Del│ │ │
│ │ └────┘ └────┘ └───┘ │ │
│ └──────────────────────┘ │
│ ┌──────────────────────┐ │
│ │ Input     [Aggiungi] │ │  ← Full width
│ └──────────────────────┘ │
├──────────────────────────┤
│ ┌──────────────────────┐ │
│ │⚠️ Elimina Player    │ │
│ └──────────────────────┘ │
├──────────────────────────┤
│ ┌──────────────────────┐ │
│ │ Chiudi               │ │
│ └──────────────────────┘ │
└──────────────────────────┘
```

---

## 🔄 ANIMAZIONI TIMELINE

### Apertura Modal
```
0ms:    Overlay opacity: 0
        Modal scale: 0.9
        
200ms:  Overlay opacity: 0.7 ✨
        Modal scale: 1.0 ✨
        
300ms:  Animation complete
```

### Update Live (Buy-in Ridotto)
```
0ms:    User click [Riduci]
        
100ms:  Form appears
        
500ms:  User click [✓ Riduci]
        Value calculations
        
510ms:  €50 → €35 (card updates)
        Totale aggiorna: €100 → €85
        
520ms:  Activity logged
        
550ms:  Form scompare
        State stabile
```

---

## ✨ EFFETTI SPECIALI

### Card Hover
```css
border-color: #444
background: #222
transition: all 0.2s
```

### Button Hover
```css
background: darker shade
box-shadow: 0 4px 12px rgba(color, 0.3)
transition: all 0.2s
```

### Button Active (Click)
```css
transform: scale(0.98)
transition: all 0.05s
```

### Input Focus
```css
border-color: #4CAF50
background: #2a2a2a
outline: none
```

---

## 📐 SPACING & SIZING

```
Modal width:     480px (desktop), 100% (mobile)
Card padding:    12px
Section gap:     20px
Button height:   42px (desktop), 40px (mobile)
Input height:    40px
Border radius:   20px (modal), 12px (card), 8px (button)
```

---

## 🎯 AZIONI UTENTE - FLOW DIAGRAMS

### Scenario 1: Modifica Buy-in
```
START
  ↓
[Open Modal] ← Gestisci Player
  ↓
[See Buy-ins List]
  ↓
[Click Modifica] ← User sceglie buy-in da modificare
  ↓
[Input Form Appears]
  ↓
[Type New Amount] ← User scrive "25"
  ↓
[Click ✓ Salva]
  ↓
[Card Updates] ← €20 diventa €25 LIVE
  ↓
[Total Recalculated] ← Header aggiorna totale
  ↓
[Activity Logged] ← "Corretto buy-in 1 a €25.00"
  ↓
END (Modal rimane aperto)
```

### Scenario 2: Riduci Buy-in
```
START
  ↓
[Click Riduci] ← Su Buy-in #1 = €50
  ↓
[Reduce Form] ← "Ridurre di: €"
  ↓
[Type Reduce Amount] ← User scrive "15"
  ↓
[Click ✓ Riduci]
  ↓
[Calculate: €50 - €15 = €35]
  ↓
IF €35 > 0:
  ├─ [Update Card] ← €50 → €35
  ├─ [Total Updates] ← €100 → €85
  └─ [Activity: Ridotto da €50 di €15]
ELSE:
  ├─ [Delete Buy-in] ← €0 non visualizzato
  ├─ [Total Updates] ← senza quel buy-in
  ├─ [Activity: Ridotto fino eliminazione]
  └─ [Remove Card] ← animazione fade
  ↓
END (Modal rimane aperto)
```

---

## 🧩 COMPONENT HIERARCHY

```
EditPlayerModal (main)
├─ Header Section
│  ├─ Player Name Display
│  └─ Total Buy-in Badge
├─ Name Section
│  ├─ Input: player name
│  └─ Button: [Salva]
├─ Buy-ins Section
│  ├─ Map BuyinCard
│  │  ├─ BuyinHeader
│  │  │  ├─ Title (Buy-in #X)
│  │  │  └─ Value (€XX.XX)
│  │  └─ ConditionalRender
│  │     ├─ ViewMode
│  │     │  └─ Buttons [Modifica][Riduci][Elimina]
│  │     ├─ EditMode
│  │     │  ├─ Input: new amount
│  │     │  └─ Buttons [✓][✕]
│  │     └─ ReduceMode
│  │        ├─ Input: reduce amount
│  │        └─ Buttons [✓][✕]
│  └─ AddBuyin Section
│     ├─ Input: new buy-in
│     └─ Button: [+ Aggiungi]
├─ Danger Section
│  └─ Button: [⚠️ Elimina Player]
└─ Close Button
```

---

## 📲 RESPONSIVENESS BREAKPOINTS

```css
/* Desktop (480px+) */
- Modal width: 480px
- Padding: 24px
- Button height: 42px
- Font size: 13px-14px

/* Tablet (480px-768px) */
- Modal width: 100% - 32px
- Padding: 20px
- Button height: 40px

/* Mobile (< 480px) */
- Modal width: 100%
- Padding: 16px
- Button height: 40px
- Button flex: wrap
- Header: flex-direction column
- Font size: 12px-13px
```

---

## ✅ VISUAL CHECKLIST

- [ ] Modal centered su overlay blur
- [ ] Colori bottoni distinguibili
- [ ] Card hover effect visibile
- [ ] Input focus ring verde
- [ ] Totale header aggiorna live
- [ ] Mobile buttons wrappano correttamente
- [ ] Transizioni smooth (no jank)
- [ ] Empty state visibile (no buy-in)
- [ ] Activity log registra
- [ ] Spacing coerente

---

**Design System:** Dark mode premium
**Contrast Level:** WCAG AA
**Animation Performance:** 60fps smooth
**Mobile Ready:** Fully responsive
