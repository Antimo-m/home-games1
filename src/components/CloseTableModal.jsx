// =========================
// 2. CloseTableModal.jsx
// =========================

import styles from './CloseTableModal.module.css'

export default function CloseTableModal({
    onArchive,
    onFinalResults,
    onClose
}) {
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>Chiudi Tavolo</h2>
                <p>Scegli come procedere.</p>

                <div className={styles.buttonContainer}>
                    <button
                        className={styles.primary}
                        onClick={onArchive}
                    >
                        Archivia Diretto
                    </button>

                    <button
                        className={styles.secondary}
                        onClick={onFinalResults}
                    >
                        Vai ai Conti Finali
                    </button>

                    <button
                        className={styles.close}
                        onClick={onClose}
                    >
                        Annulla
                    </button>
                </div>
            </div>
        </div>
    )
}
