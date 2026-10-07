import { NextResponse } from 'next/server'
import { addressData } from '@/lib/sdk'
import { authenticateApiKey } from '@/lib/auth/api-key'

export async function GET(
  request: Request,
  context: { params: Promise<{ code: string }> },
) {
  // 1. Authenticate Request
  const auth = await authenticateApiKey(request)
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: auth.status || 401 },
    )
  }

  // 2. Resolve Parameters
  const { code } = await context.params
  if (!code) {
    return NextResponse.json(
      { success: false, error: 'AddressData Code is required.' },
      { status: 400 },
    )
  }

  // 3. Lookup in Tier 1 Hot Cache / Firestore
  try {
    const record = await addressData.lookupByCode(code)
    if (!record) {
      return NextResponse.json(
        {
          success: false,
          error: `No verified address found for AddressData Code: "${code}".`,
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: record,
    })
  } catch (error) {
    console.error('[/api/v1/lookup-by-code] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to lookup address code.' },
      { status: 500 },
    )
  }
}
