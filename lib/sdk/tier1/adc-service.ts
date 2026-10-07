import { HotCache } from './hot-cache'
import type { AddressSubmission } from '@/types'

export interface VerifiedAdcRecord {
  adc: string
  streetAddress: string
  areaDistrict?: string
  city: string
  lga: string
  state: string
  zipCode?: string
  nipostPostcode?: string | null
  country: string
  estateName?: string | null
  landmark?: string | null
  propertyType: 'residential' | 'commercial'
  verified: boolean
}

const ADC_CACHE_PREFIX = 'tier1:adc:'
const ADC_TTL_MS = 1000 * 60 * 60 // 1 hour cache for verified ADC records

// Lazy resolver for Firestore DB to prevent 'server-only' errors in client or script runtimes
let _customDb: any = null

export function setAdcDb(db: any): void {
  _customDb = db
}

async function resolveDb(): Promise<any> {
  if (_customDb) return _customDb
  try {
    const { adminDb } = await import('@/firebase/server')
    return adminDb
  } catch {
    return null
  }
}

/**
 * Tier 1: AddressData Code (ADC) Resolution Service
 * Provides instant verified address lookups with in-memory caching.
 */
export class AdcService {
  /**
   * Looks up a verified address by its unique AddressData Code (ADC).
   */
  static async lookupByCode(adc: string): Promise<VerifiedAdcRecord | null> {
    if (!adc) return null
    const cleaned = adc.trim().toUpperCase()
    const cacheKey = `${ADC_CACHE_PREFIX}${cleaned}`

    return HotCache.wrap(
      cacheKey,
      async () => {
        const db = await resolveDb()
        if (!db) return null

        try {
          const queryPromise = db
            .collection('addressSubmissions')
            .where('adc', '==', cleaned)
            .where('status', '==', 'approved')
            .limit(1)
            .get()

          const snapshot: any = await Promise.race([
            queryPromise,
            new Promise((resolve) =>
              setTimeout(() => resolve({ empty: true, docs: [] }), 1500),
            ),
          ])

          if (!snapshot.docs || snapshot.docs.length === 0) {
            return null
          }

          const doc = snapshot.docs[0]
          const data = doc.data() as AddressSubmission
          const sub = data.submittedAddress

          return {
            adc: cleaned,
            streetAddress: sub.streetAddress,
            areaDistrict: sub.areaDistrict,
            city: sub.city,
            lga: sub.lga,
            state: sub.state,
            zipCode: sub.zipCode,
            nipostPostcode: data.nipostPostcode || null,
            country: sub.country || 'Nigeria',
            estateName: sub.estateName || null,
            landmark: sub.landmark || null,
            propertyType: data.propertyType,
            verified: true,
          }
        } catch (error) {
          console.warn('[AdcService] Firestore lookup failed or offline:', error)
          return null
        }
      },
      ADC_TTL_MS,
    )
  }

  /**
   * Fast regex check if a string matches the standard ADC format.
   * e.g. "ADC12345XYZ" or "ADC-LAG-IKJ-001"
   */
  static isValidAdcFormat(code?: string): boolean {
    if (!code) return false
    const clean = code.trim().toUpperCase()
    return /^ADC[A-Z0-9-]{6,16}$/.test(clean)
  }
}
