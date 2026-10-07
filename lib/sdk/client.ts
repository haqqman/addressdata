import {
  findCountry,
  getAllCountries,
  isNigeria,
} from './tier0/countries'
import { validatePostalCode } from './tier0/postal-validators'
import { NigeriaGeographyEngine } from './tier0/nigeria-engine'
import { EstateService } from './tier1/estate-service'
import { AdcService } from './tier1/adc-service'
import type {
  AddressDataConfig,
  ValidateAddressInput,
  NigerianAddressInput,
  BaseAddressInput,
  AddressValidationResult,
  AutocompleteOptions,
  AutocompleteSuggestion,
  CountryMetadata,
  NigerianIntelligence,
} from './types'

/**
 * AddressData: The Unified Global Address Intelligence Client (Nigeria-First)
 * Provides ultra-fast Tier 0 (Memory) and Tier 1 (Cache/DB) address validation,
 * postal formatting, and autocomplete.
 */
export class AddressData {
  private config: AddressDataConfig

  constructor(config: AddressDataConfig = {}) {
    this.config = {
      environment: 'production',
      cacheTtlMs: 1000 * 60 * 10,
      enableLocalFallback: true,
      ...config,
    }
  }

  // ==========================================
  // 1. Unified Address Validation
  // ==========================================

  /**
   * Validates and standardizes an address globally.
   * If country is 'NG' or Nigerian fields are detected, automatically layers deep Nigeria intelligence.
   */
  async validate(input: ValidateAddressInput): Promise<AddressValidationResult> {
    const startTime = performance.now()
    const errors: string[] = []
    const warnings: string[] = []

    // Detect country (defaults to Nigeria if Nigerian-specific LGA is supplied)
    const rawCountry = input.country || ('lga' in input ? 'NG' : '')
    const country = findCountry(rawCountry)

    if (!country) {
      const elapsed = Math.round((performance.now() - startTime) * 100) / 100
      return {
        isValid: false,
        confidence: 'invalid',
        tier: 'tier0_memory',
        executionTimeMs: elapsed,
        country: { code: 'UNKNOWN', name: rawCountry || 'Unknown', flag: '🌐' },
        standardized: {
          street: input.street || '',
          city: input.city || '',
          country: rawCountry || '',
          formattedAddress: input.street || '',
        },
        errors: [`Unrecognized country: "${rawCountry}". Please provide a valid country name or ISO code.`],
        warnings: [],
      }
    }

    // --- Path A: Deep Nigeria Intelligence Layer ---
    if (country.code === 'NG') {
      const ngInput = input as NigerianAddressInput
      const stateQuery = ngInput.state || ''
      const lgaQuery = ngInput.lga || ''
      const street = (ngInput.street || '').trim()
      const city = (ngInput.city || '').trim()

      if (!street) errors.push('Street address is required.')
      if (!city) errors.push('City is required.')

      // Tier 0: Administrative Hierarchy Validation
      const hierarchy = NigeriaGeographyEngine.validateHierarchy(stateQuery, lgaQuery)
      if (!hierarchy.isValid) {
        errors.push(hierarchy.error || 'Invalid State or LGA.')
      }

      // Tier 0: NIPOST Postcode Validation
      const rawPostcode = ngInput.nipostPostcode || ngInput.zipCode
      const postalValidation = validatePostalCode('NG', rawPostcode)
      if (rawPostcode && !postalValidation.isValid) {
        warnings.push(postalValidation.error || 'Invalid NIPOST postcode format.')
      }

      // Tier 1: Gated Estate Matching
      const matchedEstate = await EstateService.matchEstate(
        ngInput.estate || street,
        hierarchy.matchedState?.id,
        hierarchy.matchedLga?.id,
      )

      // Tier 1: ADC Format / Verification
      let verifiedAdc: string | undefined
      if (hierarchy.matchedState && hierarchy.matchedLga) {
        // Construct standard ADC candidate prefix
        const stateCode = hierarchy.matchedState.code
        const lgaClean = hierarchy.matchedLga.id.slice(0, 3).toUpperCase()
        verifiedAdc = `ADC-${stateCode}-${lgaClean}`
      }

      const isValid = errors.length === 0
      const confidence = isValid ? (matchedEstate ? 'exact' : 'high') : 'invalid'

      const nigeriaIntelligence: NigerianIntelligence = {
        state: hierarchy.matchedState?.name || stateQuery,
        stateCode: hierarchy.matchedState?.code || '',
        capital: hierarchy.matchedState?.capital || '',
        geopoliticalZone: hierarchy.matchedState?.zone || '',
        lga: hierarchy.matchedLga?.name || lgaQuery,
        lgaValidForState: hierarchy.isValid,
        isFctDistrict: hierarchy.matchedLga?.isFctDistrict,
        nipostPostcode: postalValidation.formatted || rawPostcode,
        nipostValid: postalValidation.isValid,
        adc: verifiedAdc,
        estate: matchedEstate
          ? {
              id: matchedEstate.id,
              name: matchedEstate.name,
              estateCode: matchedEstate.estateCode,
              entranceGate: matchedEstate.entranceGate,
              accessNotes: matchedEstate.accessNotes,
            }
          : undefined,
      }

      const formattedAddressParts = [
        street,
        ngInput.areaDistrict,
        matchedEstate ? matchedEstate.name : undefined,
        city,
        hierarchy.matchedLga ? `${hierarchy.matchedLga.name} LGA` : lgaQuery,
        hierarchy.matchedState ? `${hierarchy.matchedState.name} State` : stateQuery,
        postalValidation.formatted,
        'Nigeria',
      ].filter(Boolean)

      const elapsed = Math.round((performance.now() - startTime) * 100) / 100

      return {
        isValid,
        confidence,
        tier: matchedEstate ? 'tier1_cache' : 'tier0_memory',
        executionTimeMs: elapsed,
        country: { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
        standardized: {
          street,
          city,
          stateOrRegion: hierarchy.matchedState?.name || stateQuery,
          postalCode: postalValidation.formatted || rawPostcode,
          country: 'Nigeria',
          formattedAddress: formattedAddressParts.join(', '),
        },
        errors,
        warnings,
        nigeria: nigeriaIntelligence,
      }
    }

    // --- Path B: Standard Global Core Layer ---
    const baseInput = input as BaseAddressInput
    const street = (baseInput.street || '').trim()
    const city = (baseInput.city || '').trim()
    const stateOrRegion = (baseInput.stateOrRegion || '').trim()
    const rawPostal = (baseInput.postalCode || '').trim()

    if (!street) errors.push('Street address is required.')
    if (!city) errors.push('City is required.')

    // Tier 0: Postal Code Rule Validation
    const postalValidation = validatePostalCode(country.code, rawPostal)
    if (!postalValidation.isValid) {
      if (country.postalCodeRequired) {
        errors.push(postalValidation.error || 'Invalid postal code.')
      } else {
        warnings.push(postalValidation.error || 'Postal code does not match expected country format.')
      }
    }

    const isValid = errors.length === 0
    const confidence = isValid ? 'high' : 'invalid'

    const formattedParts = [
      street,
      city,
      stateOrRegion,
      postalValidation.formatted || rawPostal,
      country.name,
    ].filter(Boolean)

    const elapsed = Math.round((performance.now() - startTime) * 100) / 100

    return {
      isValid,
      confidence,
      tier: 'tier0_memory',
      executionTimeMs: elapsed,
      country: { code: country.code, name: country.name, flag: country.flag },
      standardized: {
        street,
        city,
        stateOrRegion,
        postalCode: postalValidation.formatted || rawPostal,
        country: country.name,
        formattedAddress: formattedParts.join(', '),
      },
      errors,
      warnings,
    }
  }

  // ==========================================
  // 2. Global & Local Autocomplete
  // ==========================================

  /**
   * Fast autocomplete across countries, states, LGAs, and verified estates.
   */
  async autocomplete(options: AutocompleteOptions): Promise<AutocompleteSuggestion[]> {
    const { query, country, limit = 10, state, lga } = options
    if (!query || query.trim().length === 0) return []
    const q = query.trim().toLowerCase()
    const results: AutocompleteSuggestion[] = []

    // 1. If Nigeria or unspecified: search Nigerian deep directory
    if (!country || isNigeria(country)) {
      // Tier 1: Search verified estates
      const estateMatches = await EstateService.findEstates({
        query: q,
        state,
        lga,
        limit,
      })

      for (const e of estateMatches) {
        results.push({
          id: `estate:${e.id}`,
          label: e.name,
          secondaryLabel: `${e.lga}, ${e.state}`,
          type: 'estate',
          country: 'NG',
          metadata: e,
        })
        if (results.length >= limit) return results
      }

      // Tier 0: Search Nigerian States & LGAs
      const geoMatches = NigeriaGeographyEngine.search(q, limit - results.length)
      for (const g of geoMatches) {
        results.push({
          id: `${g.type}:${g.id}`,
          label: g.name,
          secondaryLabel: g.stateName ? `${g.stateName} State` : 'Nigeria',
          type: g.type,
          country: 'NG',
          metadata: g,
        })
        if (results.length >= limit) return results
      }
    }

    // 2. Search Global Countries if query is country-related or cross-border
    if (!country) {
      for (const c of getAllCountries()) {
        if (c.name.toLowerCase().includes(q) || c.code.toLowerCase() === q) {
          results.push({
            id: `country:${c.code}`,
            label: `${c.flag} ${c.name}`,
            secondaryLabel: c.region,
            type: 'country',
            country: c.code,
            metadata: c,
          })
          if (results.length >= limit) return results
        }
      }
    }

    return results
  }

  // ==========================================
  // 3. Lookup By Code (ADC)
  // ==========================================

  /**
   * Looks up a verified address by its unique AddressData Code (ADC).
   */
  async lookupByCode(adc: string) {
    return AdcService.lookupByCode(adc)
  }

  // ==========================================
  // 4. Sub-Namespace: Geography (Global)
  // ==========================================

  readonly geography = {
    getCountries: (): CountryMetadata[] => getAllCountries(),
    getCountry: (query: string): CountryMetadata | undefined => findCountry(query),
    validatePostalCode: (country: string, code?: string) => validatePostalCode(country, code),
  }

  // ==========================================
  // 5. Sub-Namespace: Nigeria (Deep Domain Moat)
  // ==========================================

  readonly nigeria = {
    getStates: () => NigeriaGeographyEngine.listStates(),
    getState: (query: string) => NigeriaGeographyEngine.findState(query),
    getLgas: (stateId: string) => NigeriaGeographyEngine.getLgas(stateId),
    validateHierarchy: (state: string, lga: string) =>
      NigeriaGeographyEngine.validateHierarchy(state, lga),
    validateNipost: (code: string) => validatePostalCode('NG', code),
    getEstates: (options: { query?: string; state?: string; lga?: string; limit?: number } = {}) =>
      EstateService.findEstates(options),
    matchEstate: (name: string, state?: string, lga?: string) =>
      EstateService.matchEstate(name, state, lga),
  }
}
