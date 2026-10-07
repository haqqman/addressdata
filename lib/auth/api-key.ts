import 'server-only'
import { adminDb } from '@/firebase/server'
import type { APIKey } from '@/types'

export interface ApiAuthResult {
  authenticated: boolean
  apiKey?: APIKey
  error?: string
  status?: number
}

/**
 * Validates incoming API keys from headers.
 * Supports:
 * - 'X-Public-Key' (matches official AddressData documentation)
 * - 'x-api-key'
 * - 'Authorization: Bearer <key>'
 */
export async function authenticateApiKey(request: Request): Promise<ApiAuthResult> {
  const headers = request.headers
  const publicKey =
    headers.get('x-public-key') ||
    headers.get('x-api-key') ||
    headers.get('authorization')?.replace(/^Bearer\s+/i, '')

  if (!publicKey) {
    // In preview or development, check if mock/demo key is allowed
    const isDevelopment = process.env.NODE_ENV === 'development'
    if (isDevelopment && headers.get('x-demo-mode') === 'true') {
      return {
        authenticated: true,
      }
    }

    return {
      authenticated: false,
      error: 'Missing API key. Please provide "X-Public-Key" or "Authorization: Bearer <key>" header.',
      status: 401,
    }
  }

  try {
    const cleanKey = publicKey.trim()
    const snapshot = await adminDb
      .collection('apiKeys')
      .where('publicKey', '==', cleanKey)
      .where('isActive', '==', true)
      .limit(1)
      .get()

    if (snapshot.empty) {
      return {
        authenticated: false,
        error: 'Invalid or deactivated API key.',
        status: 401,
      }
    }

    const doc = snapshot.docs[0]
    const data = doc.data() as APIKey
    const apiKey: APIKey = {
      ...data,
      id: doc.id,
    }

    // Fire-and-forget update of lastUsedAt timestamp
    doc.ref.update({ lastUsedAt: new Date() }).catch((err) => {
      console.warn('[authenticateApiKey] Failed to update lastUsedAt timestamp:', err)
    })

    return {
      authenticated: true,
      apiKey,
    }
  } catch (error) {
    console.error('[authenticateApiKey] Authentication error:', error)
    return {
      authenticated: false,
      error: 'Internal authentication error.',
      status: 500,
    }
  }
}
