import { useState } from 'react'
import styles from './EditPlayerModal.module.css'
import { validateAmount, filterNumericInput } from '../utils/validation'

export default function EditPlayerModal({
    player,
    onClose,
    onUpdatePlayer,
    onRemovePlayer,
    onUpdateBuyin,
    onRemoveBuyin,
    onAddBuyin,
    onReduceBuyin
}) {
    const [name, setName] = useState(player.name)
    const [newBuyin, setNewBuyin] = useState('')
    const [newBuyinOpen, setNewBuyinOpen] = useState(false)
    const [editingIdx, setEditingIdx] = useState(null)
    const [editValue, setEditValue] = useState('')
    const [reduceIdx, setReduceIdx] = useState(null)
    const [reduceValue, setReduceValue] = useState('')
    const [newBuyinError, setNewBuyinError] = useState(null)
    const [editValueError, setEditValueError] = useState(null)
    const [reduceValueError, setReduceValueError] = useState(null)

    function saveName() {
        const trimmed = name.trim()
        if (!trimmed) return
        setName(trimmed)
        onUpdatePlayer(player.id, { name: trimmed }, `Nome modificato in ${trimmed}`)
    }

    function validateNewBuyin(value) {
        const validation = validateAmount(value, {
            required: true,
            fieldName: 'Importo buy-in'
        })
        setNewBuyinError(validation.valid ? null : validation.error)
        return validation.valid
    }

    function addBuyin() {
        if (!validateNewBuyin(newBuyin)) return
        
        const amount = Number(newBuyin)
        const firstBuyinIsZero = player.buyIns.length > 0 && player.buyIns[0] === 0
        
        if (firstBuyinIsZero) {
            onUpdateBuyin(player.id, 0, amount)
        } else {
            onAddBuyin(player.id, amount)
        }
        
        setNewBuyin('')
        setNewBuyinError(null)
        setNewBuyinOpen(false)
    }

    function validateEditValue(value) {
        const validation = validateAmount(value, {
            required: true,
            fieldName: 'Importo add-on'
        })
        setEditValueError(validation.valid ? null : validation.error)
        return validation.valid
    }

    function startEditBuyin(idx) {
        setEditingIdx(idx)
        setEditValue('')
        setEditValueError(null)
        setReduceIdx(null)
    }

    function saveEditBuyin(idx) {
        if (!validateEditValue(editValue)) return
        
        const amount = Number(editValue)
        const currentValue = Number(player.buyIns[idx] || 0)
        onUpdateBuyin(player.id, idx, currentValue + amount)
        setEditingIdx(null)
        setEditValue('')
        setEditValueError(null)
    }

    function validateReduceValue(value) {
        const validation = validateAmount(value, {
            required: true,
            allowZero: true,
            fieldName: 'Importo riduzione'
        })
        setReduceValueError(validation.valid ? null : validation.error)
        return validation.valid
    }

    function startReduceBuyin(idx) {
        setReduceIdx(idx)
        setReduceValue('')
        setReduceValueError(null)
        setEditingIdx(null)
    }

    function saveReduceBuyin(idx) {
        if (!validateReduceValue(reduceValue)) return
        
        const reduceAmount = Number(reduceValue)
        onReduceBuyin(player.id, idx, reduceAmount)
        setReduceIdx(null)
        setReduceValue('')
        setReduceValueError(null)
    }

    // Handler per input - filtra solo numeri
    function handleNewBuyinChange(value) {
        const filtered = filterNumericInput(value)
        setNewBuyin(filtered)
        if (newBuyinError) setNewBuyinError(null)
    }

    function handleEditValueChange(value) {
        const filtered = filterNumericInput(value)
        setEditValue(filtered)
        if (editValueError) setEditValueError(null)
    }

    function handleReduceValueChange(value) {
        const filtered = filterNumericInput(value)
        setReduceValue(filtered)
        if (reduceValueError) setReduceValueError(null)
    }

    const totalBuyin = player.buyIns.reduce((sum, val) => sum + (Number(val) || 0), 0)
    const lastBuyinIndex = player.buyIns.length > 0 ? player.buyIns.length - 1 : -1

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>{player.name}</h2>
                    <div className={styles.totalBuyin}>
                        Totale: €{totalBuyin.toFixed(2)}
                    </div>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Nome Player</h3>
                    <div className={styles.nameRow}>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nome"
                        />
                        <button className={styles.btnPrimary} onClick={saveName}>
                            Salva Nome
                        </button>
                    </div>
                </div>

                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Gestione Buy-in</h3>
                    
                    {player.buyIns.length === 0 ? (
                        <div className={styles.addBuyinSectionEmpty}>
                            {!newBuyinOpen ? (
                                <button className={styles.btnGreen} onClick={() => setNewBuyinOpen(true)}>
                                    Aggiungi Buy-in
                                </button>
                            ) : (
                                <div className={styles.editForm}>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        value={newBuyin}
                                        onChange={(e) => handleNewBuyinChange(e.target.value)}
                                        onBlur={() => validateNewBuyin(newBuyin)}
                                        placeholder="Importo buy-in"
                                        className={newBuyinError ? styles.inputError : ''}
                                    />
                                    {newBuyinError && (
                                        <div className={styles.inputErrorMsg}>
                                            ⚠️ {newBuyinError}
                                        </div>
                                    )}
                                    <div className={styles.formActions}>
                                        <button className={styles.btnSmallGreen} onClick={addBuyin}>
                                            Conferma
                                        </button>
                                        <button
                                            className={styles.btnSmallRed}
                                            onClick={() => {
                                                setNewBuyin('')
                                                setNewBuyinError(null)
                                                setNewBuyinOpen(false)
                                            }}
                                        >
                                            Annulla
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={styles.buyins}>
                            {player.buyIns.map((buyin, idx) => (
                                <div key={idx} className={styles.buyinCard}>
                                    <div className={styles.buyinHeader}>
                                        <span className={styles.buyinTitle}>Buy-in #{idx + 1}</span>
                                        <span className={styles.buyinValue}>€{Number(buyin).toFixed(2)}</span>
                                    </div>

                                    {editingIdx === idx ? (
                                        <div className={styles.editForm}>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={editValue}
                                                onChange={(e) => handleEditValueChange(e.target.value)}
                                                onBlur={() => validateEditValue(editValue)}
                                                placeholder="Importo add-on"
                                                className={editValueError ? styles.inputError : ''}
                                            />
                                            {editValueError && (
                                                <div className={styles.inputErrorMsg}>
                                                    ⚠️ {editValueError}
                                                </div>
                                            )}
                                            <div className={styles.formActions}>
                                                <button 
                                                    className={styles.btnSmallGreen}
                                                    onClick={() => saveEditBuyin(idx)}
                                                >
                                                    Conferma
                                                </button>
                                                <button 
                                                    className={styles.btnSmallRed}
                                                    onClick={() => {
                                                        setEditingIdx(null)
                                                        setEditValue('')
                                                        setEditValueError(null)
                                                    }}
                                                >
                                                    Annulla
                                                </button>
                                            </div>
                                        </div>
                                    ) : reduceIdx === idx ? (
                                        <div className={styles.editForm}>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={reduceValue}
                                                onChange={(e) => handleReduceValueChange(e.target.value)}
                                                onBlur={() => validateReduceValue(reduceValue)}
                                                placeholder="Importo da ridurre"
                                                className={reduceValueError ? styles.inputError : ''}
                                            />
                                            {reduceValueError && (
                                                <div className={styles.inputErrorMsg}>
                                                    ⚠️ {reduceValueError}
                                                </div>
                                            )}
                                            <div className={styles.formActions}>
                                                <button 
                                                    className={styles.btnSmallGreen}
                                                    onClick={() => saveReduceBuyin(idx)}
                                                >
                                                    Conferma
                                                </button>
                                                <button 
                                                    className={styles.btnSmallRed}
                                                    onClick={() => {
                                                        setReduceIdx(null)
                                                        setReduceValue('')
                                                        setReduceValueError(null)
                                                    }}
                                                >
                                                    Annulla
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={styles.buyinActions}>
                                            {idx === lastBuyinIndex ? (
                                                <>
                                                    <button 
                                                        className={styles.btnBlue}
                                                        onClick={() => startEditBuyin(idx)}
                                                        title="Aggiungi valore a questo buy-in"
                                                    >
                                                        Add-on
                                                    </button>
                                                    <button 
                                                        className={styles.btnBlue}
                                                         onClick={() => startReduceBuyin(idx)}
                                                        title="Riduci importo"
                                                    >
                                                        Riduci
                                                    </button>
                                                    <button 
                                                        className={styles.btnRed}
                                                        onClick={() => onRemoveBuyin(player.id, idx)}
                                                        title="Elimina buy-in"
                                                    >
                                                        Elimina
                                                    </button>
                                                </>
                                            ) : (
                                                <div className={styles.buyinLocked}>
                                                    <span className={styles.buyinLockedText}>🔒 Bloccato</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.dangerSection}>
                    <button
                        className={styles.btnDanger}
                        onClick={() => onRemovePlayer(player.id)}
                    >
                        Elimina Player
                    </button>
                </div>

                <button className={styles.btnClose} onClick={onClose}>
                    Chiudi
                </button>
            </div>
        </div>
    )
}