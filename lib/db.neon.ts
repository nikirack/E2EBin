import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export default {
  async createPaste(id: string, ciphertext: string, iv: string, burnAfterRead: boolean, createdAt: number) {
    await sql`INSERT INTO pastes (id, content, iv, burn_after_read, createdAt) VALUES (${id}, ${ciphertext}, ${iv}, ${burnAfterRead}, ${createdAt})`
  },
  async getPaste(id: string) {
    const rows = await sql`SELECT * FROM pastes WHERE id = ${id}`
    return rows[0] ?? null
  },
  async deletePaste(id: string) {
    await sql`DELETE FROM pastes WHERE id = ${id}`
  }
}