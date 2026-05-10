import { NextResponse } from 'next/server'
import getDbInstance from '@/lib/db'
import { randomUUID } from 'crypto'
import { rateLimit } from '@/lib/rate-limit'

const MAX_BYTES = 500 * 1024

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const { allowed, remaining, resetAt } = rateLimit(ip)
  if (!allowed)
    return NextResponse.json({ error: 'Rate limit exceeded', resetAt }, { 
      status: 429,
      headers: { 
        'X-RateLimit-Remaining': String(remaining),
        'X-RateLimit-Reset': String(resetAt)
      }
    })

  const contentLength = req.headers.get('content-length')
  if (contentLength && parseInt(contentLength) > MAX_BYTES)
    return NextResponse.json({ error: 'Paste too large (max 500kb)' }, { status: 413 })

  const { ciphertext, iv, burnAfterRead } = await req.json()

  if (!ciphertext || !iv)
    return NextResponse.json({ error: 'Missing data' }, { status: 400 })

  const bodySize = new TextEncoder().encode(JSON.stringify({ ciphertext, iv })).length
  if (bodySize > MAX_BYTES)
    return NextResponse.json({ error: 'Paste too large (max 500kb)' }, { status: 413 })

  const id = randomUUID()
  const createdAt = Math.floor(Date.now() / 1000)

  const db = await getDbInstance()
  await db.createPaste(id, ciphertext, iv, burnAfterRead, createdAt)

  return NextResponse.json({ id }, { status: 201 })
}