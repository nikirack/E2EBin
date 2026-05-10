import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

interface NeonPaste {
  id: string
  content: string
  iv: string
  burn_after_read: number
  created_at: number
}

function mapNeonPaste(row: NeonPaste | null): { id: string; content: string; iv: string; burnAfterRead: number; createdAt: number } | null {
  if (!row) return null
  return {
    id: row.id,
    content: row.content,
    iv: row.iv,
    burnAfterRead: row.burn_after_read ? 1 : 0,
    createdAt: row.created_at
  }
}

export default {
  async createPaste(id: string, ciphertext: string, iv: string, burnAfterRead: boolean, createdAt: number): Promise<void> {
    await sql`INSERT INTO pastes (id, content, iv, burn_after_read, created_at) VALUES (${id}, ${ciphertext}, ${iv}, ${burnAfterRead ? 1 : 0}, ${createdAt})`
  },
  async getPaste(id: string): Promise<{ id: string; content: string; iv: string; burnAfterRead: number; createdAt: number } | null> {
    const rows = await sql`SELECT * FROM pastes WHERE id = ${id}` as NeonPaste[]
    return mapNeonPaste(rows[0] ?? null)
  },
  async deletePaste(id: string): Promise<void> {
    await sql`DELETE FROM pastes WHERE id = ${id}`
  }
}