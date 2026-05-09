import { NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const paste = await db.getPaste(id)

  if (!paste)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const ageS = Math.floor(Date.now()/1000)-paste.createdAt
  const isNew = ageS < 10
  console.log(ageS)

  if (paste.burnAfterRead && !isNew)
    await db.deletePaste(id)

  return NextResponse.json({ ciphertext: paste.content, iv: paste.iv, burned: paste.burnAfterRead, createdAt: paste.createdAt })
}