import { vi, describe, it, expect } from 'vitest'

// Mock 'server-only' so route handlers can be tested in standard Node/Bun/Vitest environments
vi.mock('server-only', () => ({}))

describe('Public API v1 Route Handlers', () => {
  it('should test all v1 route handlers', async () => {
    // Dynamic import to ensure mock is active
    const { GET: getCountries } = await import('../app/api/v1/geography/countries/route')
    const { GET: getStates } = await import('../app/api/v1/geography/states/route')
    const { GET: getLgas } = await import('../app/api/v1/geography/states/[stateId]/lgas/route')
    const { POST: postValidate } = await import('../app/api/v1/validate/route')
    const { GET: getAutocomplete } = await import('../app/api/v1/autocomplete/route')

    // 1. GET /api/v1/geography/countries
    const reqCountries = new Request('http://localhost:3000/api/v1/geography/countries')
    const resCountries = await getCountries(reqCountries)
    const jsonCountries = await resCountries.json()
    expect(resCountries.status).toBe(200)
    expect(jsonCountries.count).toBeGreaterThan(15)

    // 2. GET /api/v1/geography/countries?code=NG
    const reqNg = new Request('http://localhost:3000/api/v1/geography/countries?code=NG')
    const resNg = await getCountries(reqNg)
    const jsonNg = await resNg.json()
    expect(resNg.status).toBe(200)
    expect(jsonNg.data.code).toBe('NG')
    expect(jsonNg.data.name).toBe('Nigeria')

    // 3. GET /api/v1/geography/states
    const resStates = await getStates()
    const jsonStates = await resStates.json()
    expect(resStates.status).toBe(200)
    expect(jsonStates.count).toBe(37) // 36 States + FCT

    // 4. GET /api/v1/geography/states/lagos/lgas
    const reqLgas = new Request('http://localhost:3000/api/v1/geography/states/lagos/lgas')
    const resLgas = await getLgas(reqLgas, { params: Promise.resolve({ stateId: 'lagos' }) })
    const jsonLgas = await resLgas.json()
    expect(resLgas.status).toBe(200)
    expect(jsonLgas.state.name).toBe('Lagos')
    expect(jsonLgas.count).toBe(20)

    // 5. POST /api/v1/validate (Unauthorized check)
    const reqUnauth = new Request('http://localhost:3000/api/v1/validate', {
      method: 'POST',
      body: JSON.stringify({ street: '123 Main St', city: 'London', country: 'GB' }),
    })
    const resUnauth = await postValidate(reqUnauth)
    expect(resUnauth.status).toBe(401)

    // 6. POST /api/v1/validate (With Demo Header in development)
    const reqAuth = new Request('http://localhost:3000/api/v1/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-demo-mode': 'true',
      },
      body: JSON.stringify({
        street: 'Plot 4, Admiralty Way',
        city: 'Lekki',
        state: 'Lagos',
        lga: 'Eti Osa',
        nipostPostcode: 'LA 11 W06 TC 10',
        country: 'NG',
      }),
    })
    const resAuth = await postValidate(reqAuth)
    const jsonAuth = await resAuth.json()
    expect(resAuth.status).toBe(200)
    expect(jsonAuth.data.isValid).toBe(true)
    expect(jsonAuth.data.nigeria.lga).toBe('Eti Osa')
    expect(jsonAuth.data.nigeria.geopoliticalZone).toBe('South West')

    // 7. GET /api/v1/autocomplete
    const reqAuto = new Request('http://localhost:3000/api/v1/autocomplete?query=Ikeja&country=NG', {
      headers: { 'x-demo-mode': 'true' },
    })
    const resAuto = await getAutocomplete(reqAuto)
    const jsonAuto = await resAuto.json()
    expect(resAuto.status).toBe(200)
    expect(jsonAuto.count).toBeGreaterThanOrEqual(1)
  })
})
