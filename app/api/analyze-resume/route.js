import { NextResponse } from 'next/server'
import { analyzeResume } from '../../../services/geminiService'

export const runtime = 'nodejs'

export async function POST(request) {
  try {
    const body = await request.json()
    const { text, jobrole, experience, description } = body

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid resume text.' }, { status: 400 })
    }

    const analysis = await analyzeResume(text, jobrole || '', experience || '', description || '')
    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Analyze resume error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to analyze resume' },
      { status: 500 }
    )
  }
}
