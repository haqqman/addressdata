import { NextResponse } from 'next/server'
import { addressData } from '@/lib/sdk'

export async function GET(
  _request: Request,
  context: { params: Promise<{ stateId: string }> },
) {
  const { stateId } = await context.params
  if (!stateId) {
    return NextResponse.json(
      { success: false, error: 'State identifier is required.' },
      { status: 400 },
    )
  }

  const state = addressData.nigeria.getState(stateId)
  if (!state) {
    return NextResponse.json(
      { success: false, error: `Nigerian state "${stateId}" not found.` },
      { status: 404 },
    )
  }

  const lgas = addressData.nigeria.getLgas(state.id)
  return NextResponse.json(
    {
      success: true,
      state: {
        id: state.id,
        name: state.name,
        code: state.code,
        capital: state.capital,
        zone: state.zone,
      },
      count: lgas.length,
      data: lgas,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    },
  )
}
