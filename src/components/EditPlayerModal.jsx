import { useState } from 'react'
import styles from './EditPlayerModal.module.css'

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

    function saveName() {
        const trimmed = name.trim()
        if (!trimmed) return
        setName(trimmed)
        onUpdatePlayer(player.id, { name: trimmed }, `Nome modificato in ${trimmed}`)
    }

    function addBuyin() {
        const amount = Number(newBuyin.replace(',', '.'))
        if (!Number.isFinite(amount) || amount <= 0) return
        
        const firstBuyinIsZero = player.buyIns.length > 0 && player.buyIns[0] === 0
        
        if (firstBuyinIsZero) {
            onUpdateBuyin(player.id, 0, amount)
        } else {
            onAddBuyin(player.id, amount)
        }
        
        setNewBuyin('')
        setNewBuyinOpen(false)
    }

    function startEditBuyin(idx) {
        setEditingIdx(idx)
        setEditValue('')
        setReduceIdx(null)
    }

    function saveEditBuyin(idx) {
        const amount = Number(editValue.replace(',', '.'))
        if (!Number.isFinite(amount) || amount <= 0) return
        const currentValue = Number(player.buyIns[idx] || 0)
        onUpdateBuyin(player.id, idx, currentValue + amount)
        setEditingIdx(null)
        setEditValue('')
    }

    function startReduceBuyin(idx) {
        setReduceIdx(idx)
        setReduceValue('')
        setEditingIdx(null)
    }

    function saveReduceBuyin(idx) {
        const reduceAmount = Number(reduceValue.replace(',', '.'))
        if (!Number.isFinite(reduceAmount) || reduceAmount < 0) return
        onReduceBuyin(player.id, idx, reduceAmount)
        setReduceIdx(null)
        setReduceValue('')
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
                                        inputMode="decimal"
                                        value={newBuyin}
                                        onChange={(e) => setNewBuyin(e.target.value)}
                                        placeholder="Importo buy-in"
                                    />
                                    <div className={styles.formActions}>
                                        <button className={styles.btnSmallGreen} onClick={addBuyin}>
                                            Conferma
                                        </button>
                                        <button
                                            className={styles.btnSmallRed}
                                            onClick={() => {
                                                setNewBuyin('')
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
                                                inputMode="decimal"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                placeholder="Importo da aggiungere"
                                            />
                                            <div className={styles.formActions}>
                                                <button 
                                                    className={styles.btnSmallGreen}
                                                    onClick={() => saveEditBuyin(idx)}
                                                >
                                                    Conferma
                                                </button>
                                                <button 
                                                    className={styles.btnSmallRed}
                                                    onClick={() => setEditingIdx(null)}
                                                >
                                                    Annulla
                                                </button>
                                            </div>
                                        </div>
                                    ) : reduceIdx === idx ? (
                                        <div className={styles.editForm}>
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                value={reduceValue}
                                                onChange={(e) => setReduceValue(e.target.value)}
                                                placeholder="Importo da ridurre"
                                            />
                                            <div className={styles.formActions}>
                                                <button 
                                                    className={styles.btnSmallGreen}
                                                    onClick={() => saveReduceBuyin(idx)}
                                                >
                                                    Conferma
                                                </button>
                                                <button 
                                                    className={styles.btnSmallRed}
                                                    onClick={() => setReduceIdx(null)}
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
