/**
 * Utility per la validazione degli input numerici
 * Fornisce messaggi di errore chiari e user-friendly
 */

/**
 * Valida un importo numerico
 * @param {string} value - Il valore da validare
 * @param {Object} options - Opzioni di validazione
 * @returns {Object} - { valid: boolean, error: string|null, parsedValue: number|null }
 */
export function validateAmount(value, options = {}) {
  const {
    required = true,
    allowZero = false,
    allowNegative = false,
    maxDecimals = 2,
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

  // Sostituisci virgola con punto per supportare entrambi i formati
  const normalized = trimmed.replace(',', '.')

  // Controlla se contiene caratteri non validi
  const validPattern = /^-?\d*\.?\d*$/
  if (!validPattern.test(normalized)) {
    return {
      valid: false,
      error: `Inserisci un numero valido (usa solo cifre)`,
      parsedValue: null
    }
  }

  // Prova a convertire
  const num = Number(normalized)

  if (!Number.isFinite(num)) {
    return {
      valid: false,
      error: `Inserisci un numero valido`,
      parsedValue: null
    }
  }

  // Controlla se negativo
  if (num < 0 && !allowNegative) {
    return {
      valid: false,
      error: `${fieldName} non può essere negativo`,
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

  // Controlla decimali
  const decimalPart = normalized.split('.')[1]
  if (decimalPart && decimalPart.length > maxDecimals) {
    return {
      valid: false,
      error: `Usa massimo ${maxDecimals} decimali`,
      parsedValue: null
    }
  }

  return {
    valid: true,
    error: null,
    parsedValue: Math.round(num * 100) / 100
  }
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
  INVALID_CHARACTERS: 'Usa solo cifre numeriche',
  NEGATIVE_NOT_ALLOWED: 'Il valore non può essere negativo',
  ZERO_NOT_ALLOWED: 'Il valore deve essere maggiore di 0',
  TOO_MANY_DECIMALS: 'Troppi decimali (max 2)',
  USE_DOT_FOR_DECIMALS: 'Usa il punto per i decimali (es: 10.50)'
}

export default {
  validateAmount,
  formatCurrency,
  ERROR_MESSAGES
}