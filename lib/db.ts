import type { Paste } from './db.sqlite'

export interface DB {
  createPaste(id: string, ciphertext: string, iv: string, burnAfterRead: boolean, createdAt: number): void | Promise<void>
  getPaste(id: string): Paste | null | Promise<Paste | null>
  deletePaste(id: string): void | Promise<void>
}

const db: DB = process.env.DATABASE_URL
  ? require('./db.neon').default
  : require('./db.sqlite').default

export default db