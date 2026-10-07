import { findCountry } from './countries'
import { isValidNipostPostcode } from '@/lib/data/nigeria-geography'

export interface PostalValidationResult {
  isValid: boolean
  isNipostNdaps?: boolean
  isTraditionalZip?: boolean
  formatted?: string
  expectedFormat?: string
  error?: string
}

/**
 * Validates a postal or zip code against Tier 0 in-memory country rules.
 * Runs in under 1 millisecond.
 */
export function validatePostalCode(
  countryQuery: string,
  postalCode?: string,
): PostalValidationResult {
  const country = findCountry(countryQuery)
  if (!country) {
    return {
      isValid: false,
      error: `Unrecognized country: "${countryQuery}". Please provide a valid ISO-3166 country.`,
    }
  }

  const raw = (postalCode || '').trim()

  // If postal code is missing
  if (!raw) {
    if (country.postalCodeRequired) {
      return {
        isValid: false,
        error: `Postal code is required for ${country.name}.`,
        expectedFormat: country.postalCodeFormatExample,
      }
    }
    return { isValid: true }
  }

  // --- Specific Nigeria Intelligence ---
  if (country.code === 'NG') {
    // 1. Check for official NIPOST NDAPS 11-12 alphanumeric postcode
    if (isValidNipostPostcode(raw)) {
      const cleaned = raw.replace(/[\s-]/g, '').toUpperCase()
      // Standardize into formatted pairs: e.g. "LA-11-W06-TC-10"
      const formatted = `${cleaned.slice(0, 2)}-${cleaned.slice(2, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9, 11)}`
      return {
        isValid: true,
        isNipostNdaps: true,
        formatted,
      }
    }

    // 2. Check for traditional 6-digit NIPOST zip code
    if (/^[0-9]{6}$/.test(raw)) {
      return {
        isValid: true,
        isTraditionalZip: true,
        formatted: raw,
      }
    }

    return {
      isValid: false,
      error: `Invalid Nigerian postcode format. Provide a 6-digit code (e.g. 100001) or an 11-12 character NIPOST NDAPS code (e.g. LA 11 W06 TC 10).`,
      expectedFormat: country.postalCodeFormatExample,
    }
  }

  // --- General Global Validation ---
  if (country.postalCodeRegex) {
    const matches = country.postalCodeRegex.test(raw)
    if (!matches) {
      return {
        isValid: false,
        error: `Invalid postal code format for ${country.name}.`,
        expectedFormat: country.postalCodeFormatExample,
      }
    }
  }

  return {
    isValid: true,
    formatted: raw,
  }
}
