import { useState } from 'react'
import styles from './Setup.module.css'
import { validateAmount, filterNumericInput } from '../utils/validation'

const defaultBuyIn = '20'

function buildPlayers(wanted, previous = []) {
  const next = [...previous]
  while (next.length < wanted) next.push({ name: `Player ${next.length + 1}`, buyIn: defaultBuyIn })
  if (next.length > wanted) next.splice(wanted)
  return next
}

export default function Setup({ onCreate, loadingCountdown }) {
  const [count, setCount] = useState('4')
  const [players, setPlayers] = useState(() => buildPlayers(4))
  const [tableName, setTableName] = useState('Tavolo')
  const [errors, setErrors] = useState([])
  const [buyInErrors, setBuyInErrors] = useState({})

  function handleCountChange(value) {
    // Allow only numeric input for count
    const filtered = filterNumericInput(value)
    setCount(filtered)
    const parsed = parseInt(filtered, 10)
    if (!Number.isFinite(parsed)) return
    const wanted = Math.max(2, Math.min(20, parsed))
    setPlayers((prev) => buildPlayers(wanted, prev))
  }

  function updatePlayer(idx, key, value) {
    // For buyIn field, filter to allow only digits
    const processedValue = key === 'buyIn' ? filterNumericInput(value) : value
    setPlayers((prev) => prev.map((p, i) => i === idx ? { ...p, [key]: processedValue } : p))
    
    // Clear error for this player when typing
    if (key === 'buyIn' && buyInErrors[idx]) {
      setBuyInErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[idx]
        return newErrors
      })
    }
  }

  function validateBuyIn(value, playerIndex) {
    const validation = validateAmount(value, {
      required: true,
      fieldName: `Buy-in giocatore ${playerIndex + 1}`
    })
    
    if (!validation.valid) {
      setBuyInErrors((prev) => ({
        ...prev,
        [playerIndex]: validation.error
      }))
      return false
    }
    
    // Clear error if valid
    setBuyInErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[playerIndex]
      return newErrors
    })
    return true
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = []
    
    // Validate player count
    if (!count || Number(count) < 2) errs.push('Numero di giocatori deve essere almeno 2')
    if (Number(count) > 20) errs.push('Numero di giocatori non può superare 20')
    
    // Validate each player
    let hasBuyInErrors = false
    players.forEach((p, i) => {
      if (!p.name || String(p.name).trim() === '') errs.push(`Nome giocatore ${i + 1} non valido`)
      
      // Validate buy-in with new validation system
      const buyInValid = validateBuyIn(p.buyIn, i)
      if (!buyInValid) hasBuyInErrors = true
    })
    
    setErrors(errs)
    
    if (errs.length === 0 && !hasBuyInErrors) {
      onCreate({
        players: players.map(p => ({ name: String(p.name).trim(), buyIn: Number(p.buyIn) })),
        tableName: String(tableName).trim() || 'Tavolo'
      })
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Home Games</h1>
        <div className={styles.subtitle}>Setup del tavolo</div>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.topFields}>
          <label className={styles.row}>
            <span>Numero di giocatori</span>
            <input
              type="text"
              inputMode="numeric"
              value={count}
              onChange={(e) => handleCountChange(e.target.value)}
            />
          </label>

          <label className={styles.row}>
            <span>Nome del tavolo</span>
            <input value={tableName} onChange={(e) => setTableName(e.target.value)} />
          </label>
        </div>

        <div className={styles.playersGrid}>
          {players.map((p, i) => (
            <div key={i} className={styles.playerCard}>
              <label>
                <div className={styles.small}>Nome</div>
                <input value={p.name} onChange={(e) => updatePlayer(i, 'name', e.target.value)} />
              </label>
              <label>
                <div className={styles.small}>Buy-in iniziale (€)</div>
                <input
                  type="text"
                  inputMode="numeric"
                  value={p.buyIn}
                  onChange={(e) => updatePlayer(i, 'buyIn', e.target.value)}
                  onBlur={() => validateBuyIn(p.buyIn, i)}
                  placeholder={defaultBuyIn}
                  className={buyInErrors[i] ? styles.inputError : ''}
                />
                {buyInErrors[i] && (
                  <div className={styles.inputErrorMsg}>
                    ⚠️ {buyInErrors[i]}
                  </div>
                )}
              </label>
            </div>
          ))}
        </div>

        {errors.length > 0 && (
          <div className={styles.errors}>
            {errors.map((err, i) => <div key={i}>{err}</div>)}
          </div>
        )}

        <div className={styles.actions}>
          <button type="submit" className={styles.cta} disabled={loadingCountdown > 0}>{loadingCountdown > 0 ? `Inizio in ${loadingCountdown}s` : 'Crea tavolo'}</button>
        </div>
      </form>
    </div>
  )
}