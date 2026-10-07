/**
 * AddressData SDK
 * Official SDK for AddressData: Global Address Verification with Nigeria-First Domain Intelligence.
 */

export { AddressData } from './client'
export * from './types'

// Tier 0 Exports
export {
  ISO_COUNTRIES,
  findCountry,
  getAllCountries,
  isNigeria,
} from './tier0/countries'
export {
  validatePostalCode,
  type PostalValidationResult,
} from './tier0/postal-validators'
export {
  NigeriaGeographyEngine,
  type NigeriaHierarchyValidation,
} from './tier0/nigeria-engine'

// Tier 1 Exports
export { HotCache } from './tier1/hot-cache'
export {
  EstateService,
  type CachedEstateSummary,
} from './tier1/estate-service'

// Convenience default client instance
import { AddressData } from './client'
export const addressData = new AddressData()
export default addressData
