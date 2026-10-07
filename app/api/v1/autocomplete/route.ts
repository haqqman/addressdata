import { NextResponse } from 'next/server'
import { addressData } from '@/lib/sdk'
import { authenticateApiKey } from '@/lib/auth/api-key'

export async function GET(request: Request) {
  // 1. Authenticate Request
  const auth = await authenticateApiKey(request)
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: auth.status || 401 },
    )
  }

  // 2. Parse Query Parameters
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query') || searchParams.get('q') || ''
  const country = searchParams.get('country') || undefined
  const state = searchParams.get('state') || undefined
  const lga = searchParams.get('lga') || undefined
  const limitParam = searchParams.get('limit')
  const limit = limitParam ? parseInt(limitParam, 10) : 10

  if (!query.trim()) {
    return NextResponse.json(
      { success: false, error: 'Query parameter "query" is required.' },
      { status: 400 },
    )
  }

  // 3. Execute Autocomplete
  try {
    const suggestions = await addressData.autocomplete({
      query,
      country,
      state,
      lga,
      limit: isNaN(limit) ? 10 : Math.min(limit, 50),
    })

    return NextResponse.json({
      success: true,
      count: suggestions.length,
      data: suggestions,
    })
  } catch (error) {
    console.error('[/api/v1/autocomplete] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Autocomplete execution failed.' },
      { status: 500 },
    )
  }
}
