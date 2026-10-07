import { vi, describe, it, expect } from 'vitest'

// Mock 'server-only' for non-Next.js testing harness
vi.mock('server-only', () => ({}))

// Mock Firebase Admin and Auth to isolate Server Action logic
vi.mock('@/firebase/server', () => ({
  adminDb: {
    collection: vi.fn(() => ({
      add: vi.fn(async (data) => ({ id: 'mock-doc-123', ...data })),
      doc: vi.fn(() => ({
        get: vi.fn(async () => ({
          exists: true,
          data: () => ({
            submittedAddress: { state: 'Lagos', city: 'Ikeja' },
            status: 'pending-review',
          }),
        })),
        update: vi.fn(async () => {}),
      })),
    })),
  },
}))

vi.mock('@/lib/auth/server-utils', () => ({
  verifyServerSession: vi.fn(async () => ({
    id: 'test-user-id',
    displayName: 'Test User',
    email: 'user@example.com',
    role: 'administrator',
  })),
  requireRefroshAdmin: vi.fn(async () => {}),
}))

vi.mock('@/ai/flows/flag-address-discrepancies', () => ({
  flagAddressDiscrepancies: vi.fn(async () => ({
    isDiscrepant: false,
  })),
}))

describe('addressActions SDK Integration', () => {
  it('validates NIPOST postcodes via SDK wrapper', async () => {
    const { validateNipostPostcode } = await import('../app/actions/addressActions')
    const valid = await validateNipostPostcode('100001')
    const invalid = await validateNipostPostcode('invalid')
    expect(valid).toBe(true)
    expect(invalid).toBe(false)
  })

  it('rejects state and LGA mismatch instantly at Tier 0 without calling AI', async () => {
    const { submitAddress } = await import('../app/actions/addressActions')
    const { flagAddressDiscrepancies } = await import('@/ai/flows/flag-address-discrepancies')

    const formData = new FormData()
    formData.append('street', '12 Kano Way')
    formData.append('city', 'Kano')
    formData.append('state', 'Kano')
    formData.append('lga', 'Ikeja') // Ikeja belongs to Lagos, NOT Kano!
    formData.append('propertyType', 'residential')

    const result = await submitAddress({
      formData,
      user: { id: 'test-user-id', displayName: 'Test', email: 'test@example.com' },
    })

    expect(result.success).toBe(false)
    expect(result.errors?.lga).toBeDefined()
    expect(result.message).toContain('Kano')
    // Verify AI was NEVER called, saving cost!
    expect(flagAddressDiscrepancies).not.toHaveBeenCalled()
  })

  it('accepts valid state and LGA and auto-resolves estate and NIPOST format', async () => {
    const { submitAddress } = await import('../app/actions/addressActions')

    const formData = new FormData()
    formData.append('street', '15 Allen Avenue')
    formData.append('city', 'Ikeja')
    formData.append('state', 'Lagos')
    formData.append('lga', 'Ikeja')
    formData.append('nipostPostcode', '100001')
    formData.append('propertyType', 'commercial')

    const result = await submitAddress({
      formData,
      user: { id: 'test-user-id', displayName: 'Test', email: 'test@example.com' },
    })

    expect(result.success).toBe(true)
    expect((result.submission as any)?.adc).toMatch(/^ADC-LA/)
  })
})
