// =========================
// PaymentsPage.jsx
// Nuova schermata per la distribuzione pagamenti tra player
// =========================

import { useState, useMemo } from 'react'
import styles from './PaymentsPage.module.css'

/**
 * Algoritmo per calcolare i pagamenti ottimali tra debitori e creditori.
 * Minimizza il numero di transazioni necessarie.
 * 
 * @param {Array} rows - Array di player con netto (positivo = credito, negativo = debito)
 * @returns {Array} - Array di transazioni {from, to, amount}
 */
function calculatePayments(rows) {
  // Separa debitori (netto negativo) e creditori (netto positivo)
  const debtors = rows
    .filter(r => r.netto < -0.001)
    .map(r => ({ id: r.id, name: r.name, amount: Math.abs(r.netto) }))
    .sort((a, b) => b.amount - a.amount) // Ordina dal debito maggiore al minore

  const creditors = rows
    .filter(r => r.netto > 0.001)
    .map(r => ({ id: r.id, name: r.name, amount: r.netto }))
    .sort((a, b) => b.amount - a.amount) // Ordina dal credito maggiore al minore

  const transactions = []

  // Copie mutabili per tracciare i residui
  const debtorRemaining = debtors.map(d => ({ ...d, remaining: d.amount }))
  const creditorRemaining = creditors.map(c => ({ ...c, remaining: c.amount }))

  let di = 0
  let ci = 0

  while (di < debtorRemaining.length && ci < creditorRemaining.length) {
    const debtor = debtorRemaining[di]
    const creditor = creditorRemaining[ci]

    // Arrotonda a 2 decimali per evitare errori floating point
    const amount = Math.round(Math.min(debtor.remaining, creditor.remaining) * 100) / 100

    if (amount > 0.001) {
      transactions.push({
        fromId: debtor.id,
        fromName: debtor.name,
        toId: creditor.id,
        toName: creditor.name,
        amount: amount
      })
    }

    debtor.remaining = Math.round((debtor.remaining - amount) * 100) / 100
    creditor.remaining = Math.round((creditor.remaining - amount) * 100) / 100

    // Passa al prossimo debitore/creditore se ha finito
    if (debtor.remaining <= 0.001) di++
    if (creditor.remaining <= 0.001) ci++
  }

  return transactions
}

export default function PaymentsPage({ rows, onBack, onConfirm }) {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const transactions = useMemo(() => {
    if (!rows || rows.length === 0) return []
    return calculatePayments(rows)
  }, [rows])

  const totalToDistribute = useMemo(() => {
    return transactions.reduce((sum, t) => sum + t.amount, 0)
  }, [transactions])

  // Verifica che i conti quadrino
  const netBalance = useMemo(() => {
    if (!rows || rows.length === 0) return 0
    return rows.reduce((sum, r) => sum + (r.netto || 0), 0)
  }, [rows])

  const handleProceed = () => {
    setShowConfirmation(true)
  }

  const handleConfirmClose = () => {
    setIsClosing(true)
    // Dopo 5 secondi, esegue la chiusura definitiva
    setTimeout(() => {
      onConfirm()
    }, 5000)
  }

  const handleCancelClose = () => {
    setShowConfirmation(false)
  }

  // Schermata di chiusura in corso
  if (isClosing) {
    return (
      <div className={styles.fullScreenOverlay}>
        <div className={styles.closingCard}>
          <div className={styles.closingIcon}>✓</div>
          <h2>Il tavolo è stato chiuso</h2>
          <p>Grazie per aver partecipato!</p>
          <div className={styles.closingSpinner} />
        </div>
      </div>
    )
  }

  // Modale di conferma chiusura
  if (showConfirmation) {
    return (
      <div className={styles.fullScreenOverlay}>
        <div className={styles.confirmationCard}>
          <h2>Confermi la chiusura?</h2>
          <p>Sei sicuro di voler chiudere il tavolo?</p>
          <p className={styles.confirmationNote}>
            I dati del tavolo verranno archiviati nello storico.
          </p>
          <div className={styles.confirmationActions}>
            <button
              className={styles.confirmBtn}
              onClick={handleConfirmClose}
            >
              Sì, chiudi tavolo
            </button>
            <button
              className={styles.cancelBtn}
              onClick={handleCancelClose}
            >
              Annulla
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.fullScreenPage}>
      <div className={styles.wrapper}>
      <h2>Ripartizione Pagamenti</h2>
      <p className={styles.subtitle}>
        Ecco chi deve dare soldi a chi per chiudere i conti.
      </p>

      {/* Riepilogo saldi */}
      <div className={styles.summarySection}>
        <h3>Riepilogo Saldi</h3>
        {rows.map((row) => (
          <div
            key={row.id}
            className={`${styles.summaryRow} ${row.netto >= 0 ? styles.positive : styles.negative}`}
          >
            <span className={styles.summaryName}>{row.name}</span>
            <span className={styles.summaryAmount}>
              {row.netto >= 0 ? '+' : ''}€ {Math.abs(row.netto).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Transazioni */}
      <div className={styles.transactionsSection}>
        <h3>Pagamenti da Effettuare</h3>
        
        {transactions.length === 0 ? (
          <div className={styles.noTransactions}>
            Nessun pagamento necessario — i conti sono già in pari!
          </div>
        ) : (
          <>
            <div className={styles.transactionsTotal}>
              Totale da distribuire: <strong>€ {totalToDistribute.toFixed(2)}</strong>
            </div>

            <div className={styles.transactionsList}>
              {transactions.map((t, idx) => (
                <div key={idx} className={styles.transactionCard}>
                  <div className={styles.transactionFrom}>
                    <span className={styles.transactionLabel}>Da</span>
                    <span className={styles.transactionName}>{t.fromName}</span>
                  </div>
                  
                  <div className={styles.transactionArrow}>→</div>
                  
                  <div className={styles.transactionAmount}>
                    € {t.amount.toFixed(2)}
                  </div>
                  
                  <div className={styles.transactionArrow}>→</div>
                  
                  <div className={styles.transactionTo}>
                    <span className={styles.transactionLabel}>A</span>
                    <span className={styles.transactionName}>{t.toName}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Avviso se i conti non quadrano */}
      {Math.abs(netBalance) > 0.01 && (
        <div className={styles.warning}>
          ⚠️ Attenzione: i conti non quadrano perfettamente (differenza: € {Math.abs(netBalance).toFixed(2)})
        </div>
      )}

      {/* Azioni */}
      <div className={styles.actions}>
        <button
          className={styles.backBtn}
          onClick={onBack}
        >
          Indietro
        </button>
        <button
          className={styles.confirmBtn}
          onClick={handleProceed}
        >
          Avanza e Chiudi Tavolo
        </button>
      </div>
      </div>
    </div>
  )
}
