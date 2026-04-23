import { useMemo, useState, useEffect, useRef } from 'react'
import styles from './Table.module.css'

export default function TableView({ players, onAddBuyin, onAddPlayer, onReset, onClose, lastInserted, tableName = 'Tavolo' }) {
  // inputs state kept for backwards compatibility; central add uses addAmount
  const [addOpen, setAddOpen] = useState(false)
  const [addPlayerOpen, setAddPlayerOpen] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState(players[0]?.id ?? '')
  const [activePlayerId, setActivePlayerId] = useState(players[0]?.id ?? '')
  const [addAmount, setAddAmount] = useState('')
  const [newPlayerName, setNewPlayerName] = useState('')
  const [newPlayerBuyIn, setNewPlayerBuyIn] = useState('')
  const [stageSize, setStageSize] = useState({ width: 720, height: 720 })
  const stageRef = useRef(null)

  useEffect(() => {
    // update selectedPlayer when players change
    if (players && players.length) setSelectedPlayer(players[0].id)
    if (players && players.length && !players.some((player) => player.id === activePlayerId)) {
      setActivePlayerId(players[0].id)
    }

    // measure container width on mount and on resize
    const handleResize = () => {
      if (stageRef.current) {
        setStageSize({
          width: stageRef.current.offsetWidth,
          height: stageRef.current.offsetHeight,
        })
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [players])

  const totals = useMemo(() => {
    return players.map(p => p.buyIns.reduce((s, n) => s + Number(n || 0), 0))
  }, [players])

  const totalPot = totals.reduce((s, n) => s + n, 0)
  const crowdedTable = players.length >= 8
  const seatTokenSize = players.length <= 4 ? 94 : players.length <= 6 ? 84 : players.length <= 8 ? 74 : players.length <= 10 ? 68 : 62
  const avatarSize = players.length <= 4 ? 58 : players.length <= 6 ? 52 : players.length <= 8 ? 44 : players.length <= 10 ? 40 : 36
  const labelWidth = players.length <= 4 ? 86 : players.length <= 6 ? 76 : players.length <= 8 ? 64 : 58
  const activePlayerIndex = players.findIndex((player) => player.id === activePlayerId)
  const activePlayer = activePlayerIndex >= 0 ? players[activePlayerIndex] : players[0]
  const activePlayerTotal = activePlayerIndex >= 0 ? totals[activePlayerIndex] : totals[0] || 0

  // per-seat inputs removed; kept inputs state for compatibility if needed

  function getPlayerInitials(name) {
    return name
      .split(' ')
      .map((part) => part.trim()[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  function handleConfirmAdd() {
    const num = Number((addAmount || '').toString().replace(',', '.'))
    if (!selectedPlayer || !Number.isFinite(num) || num < 0) return
    onAddBuyin(selectedPlayer, num)
    setAddAmount('')
    setAddOpen(false)
  }

  function handleAddPlayer() {
    const trimmedName = newPlayerName.trim()
    const amount = Number((newPlayerBuyIn || '0').toString().replace(',', '.'))
    if (!trimmedName || !Number.isFinite(amount) || amount < 0) return
    onAddPlayer({
      name: trimmedName,
      buyIn: amount,
    })
    setNewPlayerName('')
    setNewPlayerBuyIn('')
    setAddPlayerOpen(false)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>{tableName}</h2>
        <div className={styles.topActions}>
          <div className={styles.pot}>Buy in complessivi: <strong>€ {totalPot.toFixed(2)}</strong></div>

          <div className={styles.buttonRow}>
            <button className={styles.cta} onClick={() => setAddOpen(o => !o)}>{addOpen ? 'Chiudi' : 'Aggiungi Buy-in'}</button>
            <button className={styles.reset} onClick={onReset}>Reset tavolo</button>
            {onClose && <button className={styles.closeBtn} onClick={onClose}>Indietro</button>}
          </div>
        </div>
      </div>

      {addOpen && (
        <div className={styles.addPanel}>
          <select value={selectedPlayer} onChange={(e) => setSelectedPlayer(e.target.value)} className={styles.addSelect}>
            {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input
            className={styles.addInput}
            type="text"
            inputMode="decimal"
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
            placeholder="Importo"
          />
          <button className={styles.cta} onClick={handleConfirmAdd}>Conferma</button>
        </div>
      )}

      

      {/* New stage: central table with players positioned around it */}
      <div className={styles.tableStage} ref={stageRef}>
        <div className={styles.tableCenter}>{tableName}</div>
        {players.map((p, i) => {
          const cx = stageSize.width / 2
          const cy = stageSize.height / 2

          const isDualRing = players.length > 10
          let ring = 0
          let idxInRing = i
          let playersInRing = players.length

          if (isDualRing) {
            playersInRing = Math.ceil(players.length / 2)
            ring = i < playersInRing ? 0 : 1
            idxInRing = ring === 0 ? i : i - playersInRing
          }

          const angleOffset = playersInRing % 2 === 0 ? Math.PI / playersInRing : 0
          const angle = (idxInRing / playersInRing) * Math.PI * 2 - Math.PI / 2 + angleOffset
          const radiusXBase = Math.max(170, stageSize.width * (crowdedTable ? 0.37 : 0.31))
          const radiusYBase = Math.max(145, stageSize.height * (crowdedTable ? 0.35 : 0.28))
          const radiusX = ring === 0 ? radiusXBase : radiusXBase * 0.68
          const radiusY = ring === 0 ? radiusYBase : radiusYBase * 0.68

          const left = cx + Math.cos(angle) * radiusX
          const top = cy + Math.sin(angle) * radiusY
          const isActive = p.id === activePlayer?.id
          return (
            <button
              key={p.id + '_seat'}
              type="button"
              className={`${styles.playerSeat} ${styles.playerSeatCompact} ${isActive ? styles.playerSeatActive : ''}`}
              onClick={() => setActivePlayerId(p.id)}
              style={{
                left: `${left}px`,
                top: `${top}px`,
                width: `${seatTokenSize}px`,
                minHeight: `${seatTokenSize}px`,
                '--seat-size': `${seatTokenSize}px`,
                '--avatar-size': `${avatarSize}px`,
                '--compact-name-width': `${labelWidth}px`,
              }}
            >
              <div className={styles.avatarBadge}>{getPlayerInitials(p.name)}</div>
              <div className={styles.compactName}>{p.name}</div>
            </button>
          )
        })}
      </div>

      {activePlayer && (
        <div className={styles.playerDetailsCard}>
          <div className={styles.playerDetailsTop}>
            <div>
              <div className={styles.playerDetailsLabel}>Player selezionato</div>
              <div className={styles.playerDetailsName}>{activePlayer.name}</div>
            </div>
            <div className={styles.playerDetailsTotal}>Totale: <strong>€ {activePlayerTotal.toFixed(2)}</strong></div>
          </div>

          <div className={styles.playerDetailsBuyins}>
            {activePlayer.buyIns.length === 0 && <div className={styles.empty}>Nessun buy-in</div>}
            {activePlayer.buyIns.map((b, idx) => {
              const isNew = lastInserted && lastInserted.playerId === activePlayer.id && lastInserted.idx === idx
              return (
                <div key={idx} className={`${styles.buyinItem} ${isNew ? styles.newBuyin : ''}`}>
                  <span className={styles.buyinLabel}>{idx + 1} buy-in</span>
                  <span className={styles.buyinValue}>€ {b.toFixed(2)}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {addPlayerOpen && (
        <div className={styles.fabPanel}>
          <div className={styles.fabTitle}>Aggiungi player</div>
          <input
            className={styles.fabInput}
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            placeholder="Nome player"
          />
          <input
            className={styles.fabInput}
            type="text"
            inputMode="decimal"
            value={newPlayerBuyIn}
            onChange={(e) => setNewPlayerBuyIn(e.target.value)}
            placeholder="Buy-in iniziale"
          />
          <div className={styles.fabActions}>
            <button className={styles.closeBtn} onClick={() => setAddPlayerOpen(false)}>Chiudi</button>
            <button className={styles.cta} onClick={handleAddPlayer}>Aggiungi</button>
          </div>
        </div>
      )}

      <button className={styles.fab} onClick={() => setAddPlayerOpen((open) => !open)} aria-label="Aggiungi player">
        +
      </button>
    </div>
  )
}
