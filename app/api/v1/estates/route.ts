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

  // 2. Parse Query Params
  const { searchParams } = new URL(request.url)
  const state = searchParams.get('state') || undefined
  const lga = searchParams.get('lga') || undefined
  const query = searchParams.get('query') || searchParams.get('q') || undefined
  const limitParam = searchParams.get('limit')
  const limit = limitParam ? parseInt(limitParam, 10) : 20

  // 3. Query Tier 1 Estates Service
  try {
    const estates = await addressData.nigeria.getEstates({
      state,
      lga,
      query,
      limit: isNaN(limit) ? 20 : Math.min(limit, 100),
    })

    return NextResponse.json({
      success: true,
      count: estates.length,
      data: estates,
    })
  } catch (error) {
    console.error('[/api/v1/estates] Error fetching estates:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve estates directory.' },
      { status: 500 },
    )
  }
}
