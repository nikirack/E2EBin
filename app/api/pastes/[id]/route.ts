import { NextResponse } from 'next/server'
import getDbInstance from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
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

  const { id } = await params

  if (!UUID_REGEX.test(id))
    return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })

  const db = await getDbInstance()
  const paste = await db.getPaste(id)

  if (!paste)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const ageS = Math.floor(Date.now()/1000)-paste.createdAt
  const isNew = ageS < 10
  // console.log(ageS)

  if (paste.burnAfterRead && !isNew)
    await db.deletePaste(id)

  return NextResponse.json({ ciphertext: paste.content, iv: paste.iv, burned: paste.burnAfterRead, createdAt: paste.createdAt })
}