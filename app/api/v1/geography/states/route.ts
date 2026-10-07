import { NextResponse } from 'next/server'
import { addressData } from '@/lib/sdk'

export async function GET() {
  const states = addressData.nigeria.getStates()
  return NextResponse.json(
    {
      success: true,
      count: states.length,
      data: states,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    },
  )
}
