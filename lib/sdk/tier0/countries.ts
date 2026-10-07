import type { CountryMetadata } from '../types'

/**
 * Tier 0: Authoritative ISO 3166-1 Country Registry & Postal Format Dictionary
 * Precompiled in memory for zero-latency (<1ms) client & server validation.
 */

export const ISO_COUNTRIES: CountryMetadata[] = [
  // --- African Priority Markets ---
  {
    code: 'NG',
    code3: 'NGA',
    name: 'Nigeria',
    officialName: 'Federal Republic of Nigeria',
    capital: 'Abuja',
    region: 'Africa',
    dialCode: '+234',
    flag: '🇳🇬',
    adminDivisionType: 'state',
    postalCodeRequired: false,
    // Supports both traditional 6-digit codes and official NIPOST NDAPS 11-12 alphanumeric format
    postalCodeRegex: /^([0-9]{6}|[A-Z]{2}[\s-]?[0-9]{2}[\s-]?[A-Z0-9]{3}[\s-]?[A-Z0-9]{2}[\s-]?[0-9]{2})$/i,
    postalCodeFormatExample: 'LA 11 W06 TC 10 (or 100001)',
  },
  {
    code: 'GH',
    code3: 'GHA',
    name: 'Ghana',
    capital: 'Accra',
    region: 'Africa',
    dialCode: '+233',
    flag: '🇬🇭',
    adminDivisionType: 'region',
    postalCodeRequired: false,
    postalCodeRegex: /^([A-Z]{2}-[0-9]{3,4}-[0-9]{4}|[0-9]{5})$/i,
    postalCodeFormatExample: 'GA-183-8164',
  },
  {
    code: 'KE',
    code3: 'KEN',
    name: 'Kenya',
    capital: 'Nairobi',
    region: 'Africa',
    dialCode: '+254',
    flag: '🇰🇪',
    adminDivisionType: 'county',
    postalCodeRequired: false,
    postalCodeRegex: /^[0-9]{5}$/,
    postalCodeFormatExample: '00100',
  },
  {
    code: 'ZA',
    code3: 'ZAF',
    name: 'South Africa',
    capital: 'Pretoria',
    region: 'Africa',
    dialCode: '+27',
    flag: '🇿🇦',
    adminDivisionType: 'province',
    postalCodeRequired: true,
    postalCodeRegex: /^[0-9]{4}$/,
    postalCodeFormatExample: '2000',
  },
  {
    code: 'EG',
    code3: 'EGY',
    name: 'Egypt',
    capital: 'Cairo',
    region: 'Africa',
    dialCode: '+20',
    flag: '🇪🇬',
    adminDivisionType: 'department',
    postalCodeRequired: false,
    postalCodeRegex: /^[0-9]{5}$/,
    postalCodeFormatExample: '11511',
  },
  {
    code: 'RW',
    code3: 'RWA',
    name: 'Rwanda',
    capital: 'Kigali',
    region: 'Africa',
    dialCode: '+250',
    flag: '🇷🇼',
    adminDivisionType: 'province',
    postalCodeRequired: false,
  },
  {
    code: 'CI',
    code3: 'CIV',
    name: "Côte d'Ivoire",
    capital: 'Yamoussoukro',
    region: 'Africa',
    dialCode: '+225',
    flag: '🇨🇮',
    adminDivisionType: 'region',
    postalCodeRequired: false,
  },
  {
    code: 'SN',
    code3: 'SEN',
    name: 'Senegal',
    capital: 'Dakar',
    region: 'Africa',
    dialCode: '+221',
    flag: '🇸🇳',
    adminDivisionType: 'region',
    postalCodeRequired: false,
    postalCodeRegex: /^[0-9]{5}$/,
    postalCodeFormatExample: '12500',
  },

  // --- Major Global Markets ---
  {
    code: 'US',
    code3: 'USA',
    name: 'United States',
    capital: 'Washington, D.C.',
    region: 'Americas',
    dialCode: '+1',
    flag: '🇺🇸',
    adminDivisionType: 'state',
    postalCodeRequired: true,
    postalCodeRegex: /^[0-9]{5}(-[0-9]{4})?$/,
    postalCodeFormatExample: '90210 or 10001-1234',
  },
  {
    code: 'GB',
    code3: 'GBR',
    name: 'United Kingdom',
    capital: 'London',
    region: 'Europe',
    dialCode: '+44',
    flag: '🇬🇧',
    adminDivisionType: 'county',
    postalCodeRequired: true,
    postalCodeRegex: /^[A-Z]{1,2}[0-9][A-Z0-9]?[ ]?[0-9][A-Z]{2}$/i,
    postalCodeFormatExample: 'SW1A 1AA',
  },
  {
    code: 'CA',
    code3: 'CAN',
    name: 'Canada',
    capital: 'Ottawa',
    region: 'Americas',
    dialCode: '+1',
    flag: '🇨🇦',
    adminDivisionType: 'province',
    postalCodeRequired: true,
    postalCodeRegex: /^[A-CEGHJ-NPR-TVXY][0-9][A-CEGHJ-NPR-TV-Z][ ]?[0-9][A-CEGHJ-NPR-TV-Z][0-9]$/i,
    postalCodeFormatExample: 'K1A 0B1',
  },
  {
    code: 'DE',
    code3: 'DEU',
    name: 'Germany',
    capital: 'Berlin',
    region: 'Europe',
    dialCode: '+49',
    flag: '🇩🇪',
    adminDivisionType: 'state',
    postalCodeRequired: true,
    postalCodeRegex: /^[0-9]{5}$/,
    postalCodeFormatExample: '10115',
  },
  {
    code: 'FR',
    code3: 'FRA',
    name: 'France',
    capital: 'Paris',
    region: 'Europe',
    dialCode: '+33',
    flag: '🇫🇷',
    adminDivisionType: 'department',
    postalCodeRequired: true,
    postalCodeRegex: /^[0-9]{5}$/,
    postalCodeFormatExample: '75008',
  },
  {
    code: 'AU',
    code3: 'AUS',
    name: 'Australia',
    capital: 'Canberra',
    region: 'Oceania',
    dialCode: '+61',
    flag: '🇦🇺',
    adminDivisionType: 'state',
    postalCodeRequired: true,
    postalCodeRegex: /^[0-9]{4}$/,
    postalCodeFormatExample: '2000',
  },
  {
    code: 'IN',
    code3: 'IND',
    name: 'India',
    capital: 'New Delhi',
    region: 'Asia',
    dialCode: '+91',
    flag: '🇮🇳',
    adminDivisionType: 'state',
    postalCodeRequired: true,
    postalCodeRegex: /^[1-9][0-9]{5}$/,
    postalCodeFormatExample: '110001',
  },
  {
    code: 'AE',
    code3: 'ARE',
    name: 'United Arab Emirates',
    capital: 'Abu Dhabi',
    region: 'Middle East',
    dialCode: '+971',
    flag: '🇦🇪',
    adminDivisionType: 'state',
    postalCodeRequired: false,
    postalCodeFormatExample: 'Not required',
  },
  {
    code: 'CN',
    code3: 'CHN',
    name: 'China',
    capital: 'Beijing',
    region: 'Asia',
    dialCode: '+86',
    flag: '🇨🇳',
    adminDivisionType: 'province',
    postalCodeRequired: true,
    postalCodeRegex: /^[0-9]{6}$/,
    postalCodeFormatExample: '100000',
  },
  {
    code: 'JP',
    code3: 'JPN',
    name: 'Japan',
    capital: 'Tokyo',
    region: 'Asia',
    dialCode: '+81',
    flag: '🇯🇵',
    adminDivisionType: 'prefecture',
    postalCodeRequired: true,
    postalCodeRegex: /^[0-9]{3}-?[0-9]{4}$/,
    postalCodeFormatExample: '100-0001',
  },
  {
    code: 'BR',
    code3: 'BRA',
    name: 'Brazil',
    capital: 'Brasília',
    region: 'Americas',
    dialCode: '+55',
    flag: '🇧🇷',
    adminDivisionType: 'state',
    postalCodeRequired: true,
    postalCodeRegex: /^[0-9]{5}-?[0-9]{3}$/,
    postalCodeFormatExample: '01310-100',
  },
]

// Fast lookup indexes
const BY_CODE = new Map<string, CountryMetadata>()
const BY_CODE3 = new Map<string, CountryMetadata>()
const BY_NAME = new Map<string, CountryMetadata>()

for (const country of ISO_COUNTRIES) {
  BY_CODE.set(country.code.toUpperCase(), country)
  BY_CODE3.set(country.code3.toUpperCase(), country)
  BY_NAME.set(country.name.toLowerCase(), country)
  if (country.officialName) {
    BY_NAME.set(country.officialName.toLowerCase(), country)
  }
}

/**
 * Resolves a country by 2-letter ISO, 3-letter ISO, or name.
 */
export function findCountry(query: string): CountryMetadata | undefined {
  if (!query) return undefined
  const cleaned = query.trim()
  const upper = cleaned.toUpperCase()
  const lower = cleaned.toLowerCase()

  return (
    BY_CODE.get(upper) ||
    BY_CODE3.get(upper) ||
    BY_NAME.get(lower) ||
    // Partial substring fallback
    ISO_COUNTRIES.find((c) => c.name.toLowerCase().includes(lower))
  )
}

/**
 * Lists all registered countries for zero-latency drop-down selectors.
 */
export function getAllCountries(): CountryMetadata[] {
  return [...ISO_COUNTRIES]
}

/**
 * Returns true if the query resolves to Nigeria.
 */
export function isNigeria(query?: string): boolean {
  if (!query) return false
  const c = findCountry(query)
  return c?.code === 'NG'
}
