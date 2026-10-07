import { HotCache } from './hot-cache'
import type { Estate } from '@/types'

export interface CachedEstateSummary {
  id: string
  name: string
  estateCode?: string
  state: string
  lga: string
  city?: string
  district?: string
  entranceGate?: string | null
  accessNotes?: string | null
}

const ESTATES_CACHE_KEY = 'tier1:all_verified_estates'
const ESTATES_TTL_MS = 1000 * 60 * 15 // 15 minutes cache

// Lazy resolver for Firestore DB to prevent 'server-only' errors in client or script runtimes
let _customDb: any = null

export function setEstateDb(db: any): void {
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
 * Tier 1: Approved Estates Directory Service
 * Fast in-memory cached lookup of verified gated estates across Nigeria.
 */
export class EstateService {
  /**
   * Fetches all verified/approved estates, utilizing HotCache to avoid redundant Firestore reads.
   */
  static async getVerifiedEstates(): Promise<CachedEstateSummary[]> {
    return HotCache.wrap(
      ESTATES_CACHE_KEY,
      async () => {
        const db = await resolveDb()
        if (!db) {
          // In offline/client environments, return empty without throwing
          return []
        }

        try {
          const snapshot = await db
            .collection('estates')
            .where('status', 'in', ['verified', 'approved'])
            .get()

          const estates: CachedEstateSummary[] = []
          for (const doc of snapshot.docs) {
            const data = doc.data() as Estate
            estates.push({
              id: doc.id,
              name: data.name,
              estateCode: data.estateCode,
              state: data.location?.state || '',
              lga: data.location?.lga || '',
              city: data.location?.city,
              district: data.location?.district,
              entranceGate: data.entranceGate || null,
              accessNotes: data.accessNotes || null,
            })
          }
          return estates
        } catch (error) {
          console.warn('[EstateService] Firestore read failed or offline, returning empty cache:', error)
          return []
        }
      },
      ESTATES_TTL_MS,
    )
  }

  /**
   * Fast in-memory search for estates by name within a state or LGA.
   */
  static async findEstates(options: {
    query?: string
    state?: string
    lga?: string
    limit?: number
  }): Promise<CachedEstateSummary[]> {
    const all = await this.getVerifiedEstates()
    const { query, state, lga, limit = 10 } = options

    const q = query ? query.trim().toLowerCase() : ''
    const stateNorm = state ? state.trim().toLowerCase() : ''
    const lgaNorm = lga ? lga.trim().toLowerCase() : ''

    const filtered = all.filter((e) => {
      if (stateNorm && e.state.toLowerCase() !== stateNorm) return false
      if (lgaNorm && e.lga.toLowerCase() !== lgaNorm) return false
      if (q && !e.name.toLowerCase().includes(q)) return false
      return true
    })

    return filtered.slice(0, limit)
  }

  /**
   * Checks if an address string or input contains a recognized gated estate.
   */
  static async matchEstate(
    nameOrInput: string,
    state?: string,
    lga?: string,
  ): Promise<CachedEstateSummary | undefined> {
    if (!nameOrInput) return undefined
    const clean = nameOrInput.trim().toLowerCase()
    const all = await this.getVerifiedEstates()

    return all.find((e) => {
      if (state && e.state.toLowerCase() !== state.trim().toLowerCase()) return false
      if (lga && e.lga.toLowerCase() !== lga.trim().toLowerCase()) return false

      const estateName = e.name.toLowerCase()
      return (
        estateName === clean ||
        clean.includes(estateName) ||
        (e.estateCode && clean.includes(e.estateCode.toLowerCase()))
      )
    })
  }

  /**
   * Invalidates local cache when an estate is modified in the admin console.
   */
  static invalidateCache(): void {
    HotCache.delete(ESTATES_CACHE_KEY)
  }
}
