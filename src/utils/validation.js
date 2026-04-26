/**
 * Utility per la validazione degli input numerici
 * Fornisce messaggi di errore chiari e user-friendly
 * VALIDAZIONE STRICT: solo numeri interi positivi
 */

/**
 * Valida un importo come numero intero positivo
 * @param {string} value - Il valore da validare
 * @param {Object} options - Opzioni di validazione
 * @returns {Object} - { valid: boolean, error: string|null, parsedValue: number|null }
 */
export function validateAmount(value, options = {}) {
  const {
    required = true,
    allowZero = false,
    fieldName = 'Importo'
  } = options

  // Trim e controllo vuoto
  const trimmed = (value || '').trim()

  if (!trimmed) {
    if (required) {
      return {
        valid: false,
        error: `${fieldName} obbligatorio`,
        parsedValue: null
      }
    }
    return {
      valid: true,
      error: null,
      parsedValue: 0
    }
  }

  // Pattern per numeri interi positivi (nessun punto, virgola, lettere, simboli)
  const validPattern = /^\d+$/
  if (!validPattern.test(trimmed)) {
    return {
      valid: false,
      error: `Carattere non consentito. Sono ammessi solo numeri interi.`,
      parsedValue: null
    }
  }

  // Prova a convertire
  const num = Number(trimmed)

  if (!Number.isFinite(num)) {
    return {
      valid: false,
      error: `Inserisci un numero valido`,
      parsedValue: null
    }
  }

  // Controlla se zero
  if (num === 0 && !allowZero) {
    return {
      valid: false,
      error: `${fieldName} deve essere maggiore di 0`,
      parsedValue: null
    }
  }

  return {
    valid: true,
    error: null,
    parsedValue: num
  }
}

/**
 * Filtra l'input in tempo reale, permettendo solo cifre numeriche
 * @param {string} value - Il valore inserito
 * @returns {string} - Il valore filtrato (solo numeri)
 */
export function filterNumericInput(value) {
  // Rimuove tutto ciò che non è una cifra
  return (value || '').replace(/\D/g, '')
}

/**
 * Controlla se un valore è un intero valido
 * @param {string} value - Il valore da controllare
 * @returns {boolean}
 */
export function isValidInteger(value) {
  if (!value || value.trim() === '') return false
  const trimmed = value.trim()
  return /^\d+$/.test(trimmed) && Number(trimmed) > 0
}

/**
 * Formatta un numero come importo valuta
 * @param {number} value - Il valore da formattare
 * @returns {string} - Il valore formattato
 */
export function formatCurrency(value) {
  if (value === null || value === undefined) return ''
  return Number(value).toFixed(2)
}

/**
 * Messaggi di errore predefiniti
 */
export const ERROR_MESSAGES = {
  REQUIRED: 'Campo obbligatorio',
  INVALID_NUMBER: 'Inserisci un numero valido',
  INVALID_CHARACTERS: 'Carattere non consentito. Sono ammessi solo numeri interi.',
  NEGATIVE_NOT_ALLOWED: 'Il valore non può essere negativo',
  ZERO_NOT_ALLOWED: 'Il valore deve essere maggiore di 0',
  DECIMALS_NOT_ALLOWED: 'Non sono ammessi decimali. Usa solo numeri interi.',
  USE_ONLY_DIGITS: 'Usa solo cifre numeriche (0-9)'
}

export default {
  validateAmount,
  filterNumericInput,
  isValidInteger,
  formatCurrency,
  ERROR_MESSAGES
}