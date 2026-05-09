import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { randomUUID } from 'crypto'

const MAX_BYTES = 500 * 1024

export async function POST(req: Request) {
  const contentLength = req.headers.get('content-length')
  if (contentLength && parseInt(contentLength) > MAX_BYTES)
    return NextResponse.json({ error: 'Paste too large (max 500kb)' }, { status: 413 })

  const { ciphertext, iv, burnAfterRead } = await req.json()

  if (!ciphertext || !iv)
    return NextResponse.json({ error: 'Missing data' }, { status: 400 })

  const id = randomUUID()
  const createdAt = Math.floor(Date.now() / 1000)

  await db.createPaste(id, ciphertext, iv, burnAfterRead, createdAt)

  return NextResponse.json({ id }, { status: 201 })
}