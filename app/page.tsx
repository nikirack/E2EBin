'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const MAX_BYTES = 500 * 1024

async function generateKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt'])
}

async function exportKey(key: CryptoKey): Promise<string> {
  const raw = await crypto.subtle.exportKey('raw', key)
  return btoa(String.fromCharCode(...new Uint8Array(raw)))
}

async function encryptContent(content: string, key: CryptoKey): Promise<{ ciphertext: string, iv: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encoded = new TextEncoder().encode(content)
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded)
  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    iv: btoa(String.fromCharCode(...iv))
  }
}

export default function Home() {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [burnAfterRead, setBurnAfterRead] = useState(false)

  const sizeBytes = new TextEncoder().encode(content).length
  const sizeKb = (sizeBytes / 1024).toFixed(1)
  const isNearLimit = sizeBytes > MAX_BYTES * 0.8

  async function handleSubmit() {
    if (!content.trim()) return
    setError(null)

    const size = new TextEncoder().encode(content).length
    if (size > MAX_BYTES) {
      setError('Paste too large (max 500kb)')
      return
    }

    setLoading(true)

    const key = await generateKey()
    const { ciphertext, iv } = await encryptContent(content, key)
    const exportedKey = await exportKey(key)

    const res = await fetch('/api/pastes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ciphertext, iv, burnAfterRead }),
    })

    if (!res.ok) {
      const { error } = await res.json()
      setError(error ?? 'Something went wrong')
      setLoading(false)
      return
    }

    const { id } = await res.json()
    router.push(`/paste/${id}#${exportedKey}`)
  }

  return (
    <main className="relative max-w-3xl mx-auto mt-28 px-6 pb-8">
      <header>
        <h1 className="text-5xl sm:text-8xl font-bold leading-none mb-2">E2EBin</h1>
        <p className="text-xl sm:text-2xl font-bold uppercase tracking-widest mb-6">End-to-end encrypted pastebin</p>
      </header>

      <section className="mb-8">
        <p className="text-sm leading-relaxed pl-4 border-l-[3px] border-black max-w-lg mb-6">
          Your pastes are encrypted client-side before being sent to the server. The server will never sees your content in plaintext.
        </p>
      </section>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      
      <textarea
        className="w-full h-64 p-4 border-2 border-black text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black font-mono bg-white"
        placeholder="Paste your text or markdow here ..."
        value={content}
        onChange={e => setContent(e.target.value)}
      />
      <p className={`text-xs mt-1 ${isNearLimit ? 'text-red-500' : 'text-gray-400'}`}>
        {sizeKb} kb / 500 kb
      </p>
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="inline-block px-4 py-3 border-2 border-black bg-white text-black font-bold uppercase text-xs tracking-wider cursor-pointer transition-all duration-200 no-underline mt-4 disabled:opacity-50"
      >
        {loading ? 'Encrypting...' : 'Create Paste'}
      </button>
      <button
        onClick={() => setBurnAfterRead(b => !b)}
        className={`inline-block px-4 py-3 border-2 border-black font-bold uppercase text-xs tracking-wider transition-all duration-200 ml-1 ${
          burnAfterRead ? 'bg-amber-800 text-white' : 'bg-white text-black'
        }`}
      >
        {burnAfterRead ? '🔥 Burn after read' : 'Burn after read'}
      </button>
    </main>
  )
}