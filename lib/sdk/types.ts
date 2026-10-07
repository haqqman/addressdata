/**
 * Universal AddressData SDK Type Definitions
 * Designed for single-package global operation with deep Nigerian intelligence.
 */

export type CountryCode = string // ISO 3166-1 alpha-2 (e.g. 'NG', 'US', 'GB', 'GH', 'KE')

export type AdminDivisionType =
  | 'state'
  | 'province'
  | 'region'
  | 'county'
  | 'prefecture'
  | 'department'
  | 'territory'

export interface CountryMetadata {
  code: string // 2-letter uppercase ISO code
  code3: string // 3-letter uppercase ISO code
  name: string
  officialName?: string
  capital: string
  region: string // Continent / World Region
  dialCode: string
  flag: string // Unicode emoji flag
  adminDivisionType: AdminDivisionType
  postalCodeRequired: boolean
  postalCodeRegex?: RegExp
  postalCodeFormatExample?: string
}

export interface BaseAddressInput {
  street: string
  city: string
  stateOrRegion?: string
  postalCode?: string
  country: string
}

export interface NigerianAddressInput {
  street: string
  city: string
  state: string
  lga: string
  areaDistrict?: string
  estate?: string
  landmark?: string
  nipostPostcode?: string
  zipCode?: string
  country?: 'NG' | 'Nigeria' | string
}

export type ValidateAddressInput = BaseAddressInput | NigerianAddressInput

export interface NigerianIntelligence {
  state: string
  stateCode: string
  capital: string
  geopoliticalZone: string
  lga: string
  lgaValidForState: boolean
  isFctDistrict?: boolean
  nipostPostcode?: string
  nipostValid: boolean
  adc?: string
  estate?: {
    id: string
    name: string
    estateCode?: string
    entranceGate?: string | null
    accessNotes?: string | null
  }
}

export interface AddressValidationResult {
  isValid: boolean
  confidence: 'exact' | 'high' | 'medium' | 'low' | 'invalid'
  tier: 'tier0_memory' | 'tier1_cache' | 'tier2_external'
  executionTimeMs: number
  country: {
    code: string
    name: string
    flag: string
  }
  standardized: {
    street: string
    city: string
    stateOrRegion?: string
    postalCode?: string
    country: string
    formattedAddress: string
  }
  errors: string[]
  warnings: string[]
  nigeria?: NigerianIntelligence
}

export type AutocompleteType =
  | 'country'
  | 'state'
  | 'lga'
  | 'estate'
  | 'city'
  | 'address'

export interface AutocompleteSuggestion {
  id: string
  label: string
  secondaryLabel?: string
  type: AutocompleteType
  country: string
  metadata?: Record<string, any>
}

export interface AutocompleteOptions {
  query: string
  country?: string
  limit?: number
  types?: AutocompleteType[]
  state?: string
  lga?: string
}

export interface AddressDataConfig {
  apiKey?: string
  environment?: 'production' | 'preview'
  cacheTtlMs?: number // In-memory hot cache TTL (default: 5 minutes)
  enableLocalFallback?: boolean // Fallback to Tier 0 if upstream unavailable
}
