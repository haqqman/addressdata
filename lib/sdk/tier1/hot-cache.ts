/**
 * Tier 1: High-Performance In-Memory Hot Cache
 * Keeps hot Firestore reads (Estates, Verified ADCs) in local memory with configurable TTL.
 * Delivers sub-5ms response times and reduces Firestore read quotas to near zero.
 */

interface CacheEntry<T> {
  value: T
  expiresAt: number
}

export class HotCache {
  private static store = new Map<string, CacheEntry<any>>()
  private static defaultTtlMs = 1000 * 60 * 10 // 10 minutes default

  static set<T>(key: string, value: T, ttlMs = this.defaultTtlMs): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    })
  }

  static get<T>(key: string): T | undefined {
    const entry = this.store.get(key)
    if (!entry) return undefined

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return undefined
    }

    return entry.value as T
  }

  static has(key: string): boolean {
    return this.get(key) !== undefined
  }

  static delete(key: string): void {
    this.store.delete(key)
  }

  static clear(): void {
    this.store.clear()
  }

  static size(): number {
    return this.store.size
  }

  /**
   * Helper to retrieve from cache or compute/fetch asynchronously.
   */
  static async wrap<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMs = this.defaultTtlMs,
  ): Promise<T> {
    const cached = this.get<T>(key)
    if (cached !== undefined) {
      return cached
    }

    const fresh = await fetcher()
    if (fresh !== undefined && fresh !== null) {
      this.set(key, fresh, ttlMs)
    }
    return fresh
  }
}
