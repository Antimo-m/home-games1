import { useMemo, useState, useEffect } from 'react'
import styles from './Table.module.css'

export default function TableView({
  players,
  onAddBuyin,
  onAddPlayer,
  onReset,
  onClose,
  lastInserted,
  tableName = 'Tavolo'
}) {
  const [addOpen, setAddOpen] = useState(false)
  const [addPlayerOpen, setAddPlayerOpen] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState(players[0]?.id ?? '')
  const [activePlayerId, setActivePlayerId] = useState(players[0]?.id ?? '')
  const [addAmount, setAddAmount] = useState('')
  const [newPlayerName, setNewPlayerName] = useState('')
  const [newPlayerBuyIn, setNewPlayerBuyIn] = useState('')

  useEffect(() => {
    if (!players.length) return

    setSelectedPlayer(players[0].id)

    const exists = players.some((p) => p.id === activePlayerId)

    if (!exists) {
      setActivePlayerId(players[0].id)
    }
  }, [players])

  const totals = useMemo(() => {
    return players.map((player) =>
      player.buyIns.reduce((sum, value) => sum + Number(value || 0), 0)
    )
  }, [players])

  const totalPot = totals.reduce((sum, value) => sum + value, 0)

  const n = players.length

  const seatTokenSize =
    n <= 4 ? 94 :
      n <= 6 ? 84 :
        n <= 8 ? 74 :
          n <= 10 ? 68 :
            n <= 12 ? 58 :
              n <= 15 ? 52 :
                46

  const avatarSize =
    n <= 4 ? 58 :
      n <= 6 ? 52 :
        n <= 8 ? 44 :
          n <= 10 ? 40 :
            n <= 12 ? 34 :
              n <= 15 ? 30 :
                28

  const labelWidth =
    n <= 4 ? 86 :
      n <= 6 ? 76 :
        n <= 8 ? 64 :
          n <= 10 ? 58 :
            52

  const activePlayerIndex = players.findIndex(
    (player) => player.id === activePlayerId
  )

  const activePlayer =
    activePlayerIndex >= 0
      ? players[activePlayerIndex]
      : players[0]

  const activePlayerTotal =
    activePlayerIndex >= 0
      ? totals[activePlayerIndex]
      : totals[0] || 0

  function getPlayerInitials(name) {
    return name
      .split(' ')
      .map((part) => part.trim()[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  /**
   * Posizionamento perfetto in senso orario.
   * Sempre un solo anello ellittico.
   */
  function computeSeatPositions(totalPlayers) {
    const positions = []

    const centerX = 50
    const centerY = 50

    let radiusX = 42
    let radiusY = 36

    if (totalPlayers >= 11) {
      radiusX = 46
      radiusY = 40
    }

    if (totalPlayers >= 15) {
      radiusX = 48
      radiusY = 42
    }

    if (totalPlayers >= 19) {
      radiusX = 49
      radiusY = 43
    }

    for (let i = 0; i < totalPlayers; i++) {
      const angle =
        (-90 + (360 / totalPlayers) * i) *
        (Math.PI / 180)

      positions.push({
        left: centerX + Math.cos(angle) * radiusX,
        top: centerY + Math.sin(angle) * radiusY
      })
    }

    return positions
  }

  const seatPositions = useMemo(() => {
    return computeSeatPositions(players.length)
  }, [players.length])

  function handleConfirmAdd() {
    const num = Number(
      (addAmount || '').toString().replace(',', '.')
    )

    if (!selectedPlayer) return
    if (!Number.isFinite(num)) return
    if (num < 0) return

    onAddBuyin(selectedPlayer, num)

    setAddAmount('')
    setAddOpen(false)
  }

  function handleAddPlayer() {
    const trimmedName = newPlayerName.trim()

    const amount = Number(
      (newPlayerBuyIn || '0')
        .toString()
        .replace(',', '.')
    )

    if (!trimmedName) return
    if (!Number.isFinite(amount)) return
    if (amount < 0) return

    onAddPlayer({
      name: trimmedName,
      buyIn: amount
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
          <div className={styles.pot}>
            Buy in complessivi:{' '}
            <strong>
              € {totalPot.toFixed(2)}
            </strong>
          </div>

          <div className={styles.buttonRow}>
            <button
              className={styles.cta}
              onClick={() =>
                setAddOpen((open) => !open)
              }
            >
              {addOpen
                ? 'Chiudi'
                : 'Aggiungi Buy-in'}
            </button>

            <button
              className={styles.reset}
              onClick={onReset}
            >
              Reset tavolo
            </button>

            {onClose && (
              <button
                className={styles.closeBtn}
                onClick={onClose}
              >
                Indietro
              </button>
            )}
          </div>
        </div>
      </div>

      {addOpen && (
        <div className={styles.addPanel}>
          <select
            value={selectedPlayer}
            onChange={(e) =>
              setSelectedPlayer(e.target.value)
            }
            className={styles.addSelect}
          >
            {players.map((player) => (
              <option
                key={player.id}
                value={player.id}
              >
                {player.name}
              </option>
            ))}
          </select>

          <input
            className={styles.addInput}
            type="text"
            inputMode="decimal"
            value={addAmount}
            onChange={(e) =>
              setAddAmount(e.target.value)
            }
            placeholder="Importo"
          />

          <button
            className={styles.cta}
            onClick={handleConfirmAdd}
          >
            Conferma
          </button>
        </div>
      )}

      <div className={styles.tableStage}>
        <div className={styles.tableCenter}>
          {tableName}
        </div>

        {players.map((player, index) => {
          const pos = seatPositions[index]
          const isActive =
            player.id === activePlayer?.id

          return (
            <button
              key={player.id}
              type="button"
              onClick={() =>
                setActivePlayerId(player.id)
              }
              className={`${styles.playerSeat} ${styles.playerSeatCompact} ${isActive
                  ? styles.playerSeatActive
                  : ''
                }`}
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                width: `${seatTokenSize}px`,
                minHeight: `${seatTokenSize}px`,
                '--seat-size': `${seatTokenSize}px`,
                '--avatar-size': `${avatarSize}px`,
                '--compact-name-width': `${labelWidth}px`
              }}
            >
              <div className={styles.avatarBadge}>
                {getPlayerInitials(player.name)}
              </div>

              <div className={styles.compactName}>
                {player.name}
              </div>
            </button>
          )
        })}
      </div>

      {activePlayer && (
        <div className={styles.playerDetailsCard}>
          <div className={styles.playerDetailsTop}>
            <div>
              <div className={styles.playerDetailsLabel}>
                Player selezionato
              </div>

              <div className={styles.playerDetailsName}>
                {activePlayer.name}
              </div>
            </div>

            <div className={styles.playerDetailsTotal}>
              Totale:{' '}
              <strong>
                € {activePlayerTotal.toFixed(2)}
              </strong>
            </div>
          </div>

          <div className={styles.playerDetailsBuyins}>
            {activePlayer.buyIns.length === 0 && (
              <div className={styles.empty}>
                Nessun buy-in
              </div>
            )}

            {activePlayer.buyIns.map(
              (buyin, idx) => {
                const isNew =
                  lastInserted &&
                  lastInserted.playerId ===
                  activePlayer.id &&
                  lastInserted.idx === idx

                return (
                  <div
                    key={idx}
                    className={`${styles.buyinItem} ${isNew
                        ? styles.newBuyin
                        : ''
                      }`}
                  >
                    <span
                      className={
                        styles.buyinLabel
                      }
                    >
                      {idx + 1} buy-in
                    </span>

                    <span
                      className={
                        styles.buyinValue
                      }
                    >
                      € {buyin.toFixed(2)}
                    </span>
                  </div>
                )
              }
            )}
          </div>
        </div>
      )}

      {addPlayerOpen && (
        <div className={styles.fabPanel}>
          <div className={styles.fabTitle}>
            Aggiungi player
          </div>

          <input
            className={styles.fabInput}
            value={newPlayerName}
            onChange={(e) =>
              setNewPlayerName(
                e.target.value
              )
            }
            placeholder="Nome player"
          />

          <input
            className={styles.fabInput}
            type="text"
            inputMode="decimal"
            value={newPlayerBuyIn}
            onChange={(e) =>
              setNewPlayerBuyIn(
                e.target.value
              )
            }
            placeholder="Buy-in iniziale"
          />

          <div className={styles.fabActions}>
            <button
              className={styles.closeBtn}
              onClick={() =>
                setAddPlayerOpen(false)
              }
            >
              Chiudi
            </button>

            <button
              className={styles.cta}
              onClick={handleAddPlayer}
            >
              Aggiungi
            </button>
          </div>
        </div>
      )}

      <button
        className={styles.fab}
        onClick={() =>
          setAddPlayerOpen(
            (open) => !open
          )
        }
        aria-label="Aggiungi player"
      >
        +
      </button>
    </div>
  )
}