import { NextResponse } from 'next/server'
import { addressData } from '@/lib/sdk'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code') || searchParams.get('country')

  if (code) {
    const country = addressData.geography.getCountry(code)
    if (!country) {
      return NextResponse.json(
        { success: false, error: `Country "${code}" not found.` },
        { status: 404 },
      )
    }
    return NextResponse.json({
      success: true,
      data: country,
    })
  }

  const countries = addressData.geography.getCountries()
  return NextResponse.json(
    {
      success: true,
      count: countries.length,
      data: countries,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    },
  )
}
