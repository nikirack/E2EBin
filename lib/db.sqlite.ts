import Database from 'better-sqlite3'
import path from 'path'

export interface Paste { id: string; content: string; iv: string; burnAfterRead: number; createdAt: number }

const sqlite = new Database(path.join(process.cwd(), 'pastes.db'))

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS pastes (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    iv TEXT NOT NULL,
    burnAfterRead INTEGER DEFAULT 0,
    createdAt INTEGER DEFAULT (strftime('%s', 'now'))
  )
`)

export default {
  createPaste(id: string, ciphertext: string, iv: string, burnAfterRead: boolean, createdAt: number) {
    sqlite.prepare(`INSERT INTO pastes (id, content, iv, burnAfterRead, createdAt) VALUES (?, ?, ?, ?, ?)`)
      .run(id, ciphertext, iv, burnAfterRead ? 1 : 0, createdAt)
  },
  getPaste(id: string) {
    return sqlite.prepare(`SELECT * FROM pastes WHERE id = ?`).get(id) as Paste | null
  },
  deletePaste(id: string) {
    sqlite.prepare(`DELETE FROM pastes WHERE id = ?`).run(id)
  }
}