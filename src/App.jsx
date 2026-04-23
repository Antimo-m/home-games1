import { useEffect, useReducer, useRef } from 'react'
import Setup from './components/Setup'
import TableView from './components/TableView'
import TablesList from './components/TablesList'
import './App.css'

const STORAGE_KEY = 'poker-home-games-tables-v2'
const HISTORY_RETENTION_MS = 48 * 60 * 60 * 1000

function uid(prefix = '') {
  return prefix + Math.random().toString(36).slice(2, 9)
}

const initialState = {
  tables: [], // array of { id, name, players, gameStarted, countdown, lastInserted, showWelcome, createdAt, history }
  currentTableId: null, // currently viewed table
  view: 'list', // 'list', 'setup', 'playing'
  historyTables: [], // reset/deleted tables retained for 48h
  theme: 'forest',
}

function pruneHistory(tables = []) {
  const now = Date.now()
  return tables.filter((table) => {
    const archivedAt = table.archivedAt || table.deletedAt || 0
    return now - archivedAt < HISTORY_RETENTION_MS
  })
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return {
        ...state,
        ...action.payload,
        historyTables: pruneHistory(action.payload.historyTables || action.payload.backupTables || []),
      }

    case 'SET_VIEW':
      return { ...state, view: action.view }

    case 'SET_THEME':
      return { ...state, theme: action.theme }

    case 'CREATE_TABLE': {
      const newTable = {
        id: uid('table_'),
        name: action.tableName,
        players: action.players,
        gameStarted: false,
        countdown: 5,
        lastInserted: null,
        showWelcome: false,
        createdAt: Date.now(),
        history: [],
      }
      return { ...state, tables: [...state.tables, newTable], currentTableId: newTable.id, view: 'playing' }
    }

    case 'UPDATE_TABLE': {
      const { tableId, updates } = action
      const tables = state.tables.map(t => t.id === tableId ? { ...t, ...updates } : t)
      return { ...state, tables }
    }

    case 'SELECT_TABLE':
      return { ...state, currentTableId: action.tableId, view: 'playing' }

    case 'TICK_TABLE': {
      const { tableId } = action
      const tables = state.tables.map(t => {
        if (t.id !== tableId) return t
        return { ...t, countdown: Math.max(0, t.countdown - 1) }
      })
      return { ...state, tables }
    }

    case 'ADD_BUYIN_TABLE': {
      const { tableId, playerId, amount } = action
      const tables = state.tables.map(t => {
        if (t.id !== tableId) return t
        const players = t.players.map(p => 
          p.id === playerId ? { ...p, buyIns: [...p.buyIns, amount] } : p
        )
        const player = players.find(p => p.id === playerId)
        const idx = player ? player.buyIns.length - 1 : null
        return { ...t, players, lastInserted: idx != null ? { playerId, idx } : null }
      })
      return { ...state, tables }
    }

    case 'CLEAR_LAST_INSERTED': {
      const { tableId } = action
      const tables = state.tables.map((table) => (
        table.id === tableId ? { ...table, lastInserted: null } : table
      ))
      return { ...state, tables }
    }

    case 'ADD_PLAYER_TABLE': {
      const { tableId, player } = action
      const tables = state.tables.map((table) => {
        if (table.id !== tableId) return table
        return {
          ...table,
          players: [...table.players, player],
        }
      })
      return { ...state, tables }
    }

    case 'DELETE_TABLE': {
      const { tableId } = action
      const tableToDelete = state.tables.find(t => t.id === tableId)
      if (tableToDelete) {
        const archivedTable = {
          ...tableToDelete,
          archivedAt: Date.now(),
          archivedReason: 'deleted',
        }
        return {
          ...state,
          tables: state.tables.filter(t => t.id !== tableId),
          historyTables: [archivedTable, ...state.historyTables],
          currentTableId: state.currentTableId === tableId ? null : state.currentTableId,
          view: 'list'
        }
      }
      return state
    }

    case 'RESTORE_TABLE_FROM_HISTORY': {
      const { tableId } = action
      const archivedTable = state.historyTables.find(t => t.id === tableId)
      if (!archivedTable) return state
      const restoredTable = {
        ...archivedTable,
        archivedAt: undefined,
        archivedReason: undefined,
        deletedAt: undefined,
        gameStarted: true,
        countdown: 0,
        showWelcome: false,
        lastInserted: null,
      }
      return {
        ...state,
        tables: [...state.tables, restoredTable],
        historyTables: state.historyTables.filter(t => t.id !== tableId),
        currentTableId: restoredTable.id,
        view: 'playing'
      }
    }

    case 'RESET_TABLE': {
      const { tableId } = action
      const tableToArchive = state.tables.find(t => t.id === tableId)
      if (!tableToArchive) return state
      const resetSnapshot = {
        ...tableToArchive,
        players: tableToArchive.players.map((p) => ({ ...p, buyIns: [...p.buyIns] })),
        gameStarted: true,
        countdown: 0,
        lastInserted: tableToArchive.lastInserted,
        showWelcome: false,
        archivedAt: Date.now(),
        archivedReason: 'reset',
      }
      return {
        ...state,
        tables: state.tables.filter(t => t.id !== tableId),
        historyTables: [resetSnapshot, ...state.historyTables],
        currentTableId: null,
        view: 'list',
      }
    }

    default:
      return state
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const timerRef = useRef(null)

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        dispatch({ type: 'LOAD', payload: parsed })
      }
    } catch {
      // ignore
    }
  }, [])

  // Persist
  useEffect(() => {
    try {
      const stateToSave = { ...state, historyTables: pruneHistory(state.historyTables) }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave))
    } catch {
      // ignore
    }
  }, [state])

  // Countdown effect for current table
  useEffect(() => {
    const currentTable = state.tables.find(t => t.id === state.currentTableId)
    if (!currentTable) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }

    if (currentTable.countdown > 0 && !timerRef.current) {
      timerRef.current = setInterval(() => {
        dispatch({ type: 'TICK_TABLE', tableId: state.currentTableId })
      }, 1000)
    }

    if (currentTable.countdown === 0 && timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
      if (!currentTable.gameStarted && currentTable.players.length) {
        dispatch({ type: 'UPDATE_TABLE', tableId: state.currentTableId, updates: { showWelcome: true } })
        setTimeout(() => {
          dispatch({ type: 'UPDATE_TABLE', tableId: state.currentTableId, updates: { showWelcome: false, gameStarted: true } })
        }, 3000)
      }
    }
    return () => {}
  }, [state.currentTableId, state.tables])

  useEffect(() => {
    const currentTable = state.tables.find((table) => table.id === state.currentTableId)
    if (!currentTable?.lastInserted) return undefined

    const timeoutId = window.setTimeout(() => {
      dispatch({ type: 'CLEAR_LAST_INSERTED', tableId: currentTable.id })
    }, 1100)

    return () => window.clearTimeout(timeoutId)
  }, [state.currentTableId, state.tables])

  function handleCreateTable(payload) {
    // payload: { players: [{name, buyIn}], tableName }
    const players = (payload.players || []).map((p) => {
      const amount = Number(p.buyIn)
      return {
        id: uid('p_'),
        name: p.name,
        buyIns: Number.isFinite(amount) && amount > 0 ? [amount] : [],
      }
    })
    dispatch({ type: 'CREATE_TABLE', players, tableName: payload.tableName })
  }

  function handleAddBuyin(playerId, amount) {
    const num = Number(amount)
    if (Number.isFinite(num) && num >= 0) {
      dispatch({ type: 'ADD_BUYIN_TABLE', tableId: state.currentTableId, playerId, amount: num })
    }
  }

  function handleResetTable() {
    dispatch({ type: 'RESET_TABLE', tableId: state.currentTableId })
  }

  function handleAddPlayer(payload) {
    const amount = Number(payload.buyIn || 0)
    const player = {
      id: uid('p_'),
      name: payload.name,
      buyIns: Number.isFinite(amount) && amount > 0 ? [amount] : [],
    }
    dispatch({ type: 'ADD_PLAYER_TABLE', tableId: state.currentTableId, player })
  }

  function handleDeleteTable(tableId) {
    dispatch({ type: 'DELETE_TABLE', tableId })
  }

  function handleRestoreTable(tableId) {
    dispatch({ type: 'RESTORE_TABLE_FROM_HISTORY', tableId })
  }

  const currentTable = state.tables.find(t => t.id === state.currentTableId)

  return (
    <div className={`app-root theme-${state.theme}`}>
      <div className="theme-switcher">
        <label className="theme-label" htmlFor="theme-select">Tema sfondo</label>
        <select
          id="theme-select"
          className="theme-select"
          value={state.theme}
          onChange={(e) => dispatch({ type: 'SET_THEME', theme: e.target.value })}
        >
          <option value="forest">Forest</option>
          <option value="ocean">Ocean</option>
          <option value="sunset">Sunset</option>
        </select>
      </div>

      {state.view === 'list' && state.tables.length === 0 && (
        <TablesList
          tables={state.tables}
          historyTables={state.historyTables}
          onSelectTable={(tableId) => dispatch({ type: 'SELECT_TABLE', tableId })}
          onNewTable={() => dispatch({ type: 'SET_VIEW', view: 'setup' })}
          onDeleteTable={handleDeleteTable}
          onRestoreTable={handleRestoreTable}
        />
      )}

      {state.view === 'list' && state.tables.length > 0 && (
        <TablesList
          tables={state.tables}
          historyTables={state.historyTables}
          onSelectTable={(tableId) => dispatch({ type: 'SELECT_TABLE', tableId })}
          onNewTable={() => dispatch({ type: 'SET_VIEW', view: 'setup' })}
          onDeleteTable={handleDeleteTable}
          onRestoreTable={handleRestoreTable}
        />
      )}

      {state.view === 'setup' && (
        <Setup onCreate={handleCreateTable} loadingCountdown={0} />
      )}

      {state.view === 'playing' && currentTable && (
        <>
          {currentTable.countdown > 0 && (
            <div className="countdown-wrap">
              <div className="countdown">{currentTable.countdown}</div>
              <div className="countdown-msg">Preparatevi: la partita inizia tra</div>
            </div>
          )}

          {currentTable.showWelcome && (
            <div className="welcome-overlay">
              <div className="welcome-message">
                <h1>Benvenuti al tavolo da gioco!</h1>
                <p>Buon divertimento</p>
              </div>
            </div>
          )}

          {currentTable.gameStarted && (
            <TableView
              tableId={state.currentTableId}
              players={currentTable.players}
              onAddBuyin={handleAddBuyin}
              onAddPlayer={handleAddPlayer}
              onReset={handleResetTable}
              onClose={() => dispatch({ type: 'SET_VIEW', view: 'list' })}
              lastInserted={currentTable.lastInserted}
              tableName={currentTable.name}
            />
          )}
        </>
      )}

      <div style={{ height: 40 }} />
    </div>
  )
}
