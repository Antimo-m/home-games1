import { useState } from 'react'
import styles from './TablesList.module.css'

export default function TablesList({ tables, historyTables, onSelectTable, onNewTable, onDeleteTable, onRestoreTable }) {
  const [showHistory, setShowHistory] = useState(false)

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Home Games</h1>
      <div style={{ fontSize: 14, color: '#cfe6c9', marginBottom: 20 }}>Tavoli aperti</div>

      {tables.length === 0 ? (
        <div className={styles.empty}>Nessun tavolo aperto. Creane uno nuovo!</div>
      ) : (
        <div className={styles.tablesList}>
          {tables.map((table) => (
            <div key={table.id} className={styles.tableCard}>
              <div className={styles.tableName}>{table.name}</div>
              <div className={styles.tableInfo}>
                <span>{table.players.length} giocatori</span>
                <span>Creato: {new Date(table.createdAt).toLocaleTimeString('it-IT')}</span>
              </div>
              <div className={styles.tableActions}>
                <button className={styles.selectBtn} onClick={() => onSelectTable(table.id)}>Apri</button>
                <button className={styles.deleteBtn} onClick={() => onDeleteTable(table.id)}>Elimina</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.actionsRow}>
        <button className={styles.newTableBtn} onClick={onNewTable}>+ Crea tavolo</button>
      </div>

      {historyTables.length > 0 && (
        <div className={styles.historySection}>
          <div className={styles.historyHeader}>
            <h2 className={styles.historyTitle}>Storico tavoli</h2>
            <div className={styles.historySubtitle}>I tavoli resettati o eliminati restano qui per 48 ore.</div>
          </div>

          <button
            className={styles.historyToggle}
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? '▼' : '▶'} Storico Tavoli ({historyTables.length})
          </button>

          {showHistory && (
            <div className={styles.historyList}>
              {historyTables.map((table) => (
                <div key={table.id} className={styles.historyCard}>
                  <div className={styles.historyName}>{table.name}</div>
                  <div className={styles.historyInfo}>
                    <span>{table.players.length} giocatori</span>
                    <span>Archiviato: {new Date(table.archivedAt).toLocaleString('it-IT')}</span>
                    <span>Motivo: {table.archivedReason === 'reset' ? 'Reset tavolo' : 'Eliminato'}</span>
                  </div>
                  <button
                    className={styles.restoreBtn}
                    onClick={() => onRestoreTable(table.id)}
                  >
                    Ripristina
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
