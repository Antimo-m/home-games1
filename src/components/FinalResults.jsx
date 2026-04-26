// =========================
// 3. FinalResults.jsx
// =========================

import { useMemo, useState } from 'react'
import styles from './FinalResults.module.css'
import { validateAmount } from '../utils/validation'

export default function FinalResults({
    players,
    onBack,
    onConfirm
}) {
    const [values, setValues] = useState({})
    const [errors, setErrors] = useState({})

    const rows = useMemo(() => {
        return players.map((player) => {
            const totalBuyin = player.buyIns.reduce(
                (sum, val) => sum + Number(val || 0),
                0
            )

            const finalStack = Number(
                (values[player.id] || '0').replace(',', '.')
            )

            // Mostra netto solo se l'utente ha inserito uno stack finale
            const hasInputValue = values[player.id] && values[player.id].trim() !== ''
            const netto = hasInputValue && Number.isFinite(finalStack)
                ? finalStack - totalBuyin
                : null

            return {
                ...player,
                totalBuyin,
                finalStack,
                netto,
                hasInputValue
            }
        })
    }, [players, values])

    const totalNet = rows.reduce(
        (sum, row) => sum + (row.netto ?? 0),
        0
    )

    // Controlla se tutti gli stack finali sono stati inseriti
    const allFilled = rows.every(row => row.hasInputValue)

    return (
        <div className={styles.wrapper}>
            <h2>Conti Finali</h2>

            {rows.map((row) => (
                <div
                    key={row.id}
                    className={styles.card}
                >
                    <div className={styles.playerName}>{row.name}</div>

                    <div className={styles.info}>
                        Stack iniziale: <strong>€ {row.totalBuyin.toFixed(2)}</strong>
                    </div>

                    <div className={styles.inputWrapper}>
                        <input
                            placeholder="Stack finale (es: 50.00)"
                            value={values[row.id] || ''}
                            onChange={(e) => {
                                const val = e.target.value
                                setValues((prev) => ({
                                    ...prev,
                                    [row.id]: val
                                }))
                                // Clear error when typing
                                if (errors[row.id]) {
                                    setErrors((prev) => ({
                                        ...prev,
                                        [row.id]: null
                                    }))
                                }
                            }}
                            onBlur={() => {
                                // Validate on blur
                                const validation = validateAmount(values[row.id], {
                                    required: true,
                                    allowZero: true,
                                    fieldName: 'Stack finale'
                                })
                                if (!validation.valid) {
                                    setErrors((prev) => ({
                                        ...prev,
                                        [row.id]: validation.error
                                    }))
                                }
                            }}
                            className={errors[row.id] ? styles.inputError : ''}
                        />
                        {errors[row.id] && (
                            <div className={styles.inputErrorMsg}>
                                ⚠️ {errors[row.id]}
                            </div>
                        )}
                    </div>

                    {row.hasInputValue && row.netto !== null && (
                        <div className={`${styles.info} ${row.netto >= 0 ? styles.positive : styles.negative}`}>
                            Netto:{' '}
                            <strong>
                                € {row.netto.toFixed(2)}
                            </strong>
                        </div>
                    )}
                </div>
            ))}

            {allFilled && Math.abs(totalNet) > 0.01 && (
                <div className={styles.warning}>
                    ⚠️ I conti non quadrano (differenza: € {totalNet.toFixed(2)})
                </div>
            )}

            <div className={styles.actions}>
                <button 
                    className={styles.cancelBtn}
                    onClick={onBack}
                >
                    Indietro
                </button>

            <button
                className={styles.confirmBtn}
                disabled={!allFilled}
                onClick={() => onConfirm(rows)}
            >
                Procedi
            </button>
            </div>
        </div>
    )
}