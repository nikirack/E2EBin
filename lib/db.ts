export interface Paste {
  id: string
  content: string
  iv: string
  burnAfterRead: number | boolean
  createdAt: number
}

export interface DB {
  createPaste(id: string, ciphertext: string, iv: string, burnAfterRead: boolean, createdAt: number): Promise<void>
  getPaste(id: string): Promise<Paste | null>
  deletePaste(id: string): Promise<void>
}

async function getDb(): Promise<DB> {
  if (process.env.DATABASE_URL) {
    const neon = await import('./db.neon')
    return neon.default
  }
  const sqlite = await import('./db.sqlite')
  return sqlite.default
}

let dbInstance: DB | null = null

export default async function getDbInstance(): Promise<DB> {
  if (!dbInstance) {
    dbInstance = await getDb()
  }
  return dbInstance
}