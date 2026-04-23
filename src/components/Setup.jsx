import { useEffect, useState } from 'react'
import styles from './Setup.module.css'

export default function Setup({ onCreate, loadingCountdown }) {
  const [count, setCount] = useState('4')
  const [players, setPlayers] = useState([])
  const [tableName, setTableName] = useState('Tavolo')
  const [errors, setErrors] = useState([])
  const defaultBuyIn = '20'

  useEffect(() => {
    const parsed = parseInt(count, 10)
    if (!Number.isFinite(parsed)) return
    const wanted = Math.max(2, Math.min(20, parsed))
    setPlayers((prev) => {
      const next = [...prev]
      while (next.length < wanted) next.push({ name: `Player ${next.length + 1}`, buyIn: defaultBuyIn })
      if (next.length > wanted) next.splice(wanted)
      return next
    })
  }, [count])

  function updatePlayer(idx, key, value) {
    setPlayers((prev) => prev.map((p, i) => i === idx ? { ...p, [key]: value } : p))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = []
    if (!Number.isInteger(Number(count)) || Number(count) < 2) errs.push('Numero di giocatori deve essere almeno 2')
    if (Number(count) > 20) errs.push('Numero di giocatori non può superare 20')
    players.forEach((p, i) => {
      if (!p.name || String(p.name).trim() === '') errs.push(`Nome giocatore ${i + 1} non valido`)
      const b = Number(p.buyIn)
      if (!Number.isFinite(b) || b < 0) errs.push(`Buy-in giocatore ${i + 1} deve essere >= 0`)
    })
    setErrors(errs)
    if (errs.length === 0) {
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
              onChange={(e) => setCount(e.target.value)}
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
                <div className={styles.small}>Buy-in iniziale</div>
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*[.,]?[0-9]*"
                  value={p.buyIn}
                  onChange={(e) => updatePlayer(i, 'buyIn', e.target.value)}
                  placeholder={defaultBuyIn}
                />
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
