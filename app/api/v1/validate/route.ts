import { NextResponse } from 'next/server'
import { addressData } from '@/lib/sdk'
import { authenticateApiKey } from '@/lib/auth/api-key'
import type { ValidateAddressInput } from '@/lib/sdk'

export async function POST(request: Request) {
  // 1. Authenticate Request
  const auth = await authenticateApiKey(request)
  if (!auth.authenticated) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: auth.status || 401 },
    )
  }

  // 2. Parse Payload
  let body: ValidateAddressInput
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: 'Malformed JSON payload.' },
      { status: 400 },
    )
  }

  // 3. Execute Unified SDK Validation (Tier 0 & Tier 1)
  try {
    const result = await addressData.validate(body)
    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      {
        headers: {
          'X-Execution-Tier': result.tier,
          'X-Response-Time-Ms': result.executionTimeMs.toString(),
        },
      },
    )
  } catch (error: any) {
    console.error('[/api/v1/validate] Internal validation error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal validation failed.' },
      { status: 500 },
    )
  }
}
