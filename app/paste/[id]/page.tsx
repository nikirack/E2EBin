'use client'
import { useEffect, useState } from 'react'
import { use } from 'react'
import ReactMarkdown from 'react-markdown'

async function importKey(keyStr: string): Promise<CryptoKey> {
  const raw = Uint8Array.from(atob(keyStr), c => c.charCodeAt(0))
  return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['decrypt'])
}

async function decryptContent(ciphertext: string, iv: string, key: CryptoKey): Promise<string> {
  const ct = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0))
  const ivBytes = Uint8Array.from(atob(iv), c => c.charCodeAt(0))
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: ivBytes }, key, ct)
  return new TextDecoder().decode(decrypted)
}

export default function PastePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [content, setContent] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [copied, setCopied] = useState(false);

  const [isBurned, setIsBurned] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [hadTimer, setHadTimer] = useState(false)


  const copyCurrentUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  useEffect(() => {
    async function load() {
      try {
        const keyStr = window.location.hash.slice(1)
        if (!keyStr) { setError('No key in URL'); return }

        const res = await fetch(`/api/pastes/${id}`)
        if (!res.ok) { setError('Paste not found or expired'); return }

        const { ciphertext, iv, burned, createdAt } = await res.json()
        const key = await importKey(keyStr)
        const plaintext = await decryptContent(ciphertext, iv, key)
        if (burned) {
          setIsBurned(true)
          const now = Math.floor(Date.now() / 1000)
          const age = now - createdAt
          const burnAfterSeconds = 10
          if (age < burnAfterSeconds) {
            setTimeLeft(burnAfterSeconds - age)
            setHadTimer(true)
          }
        }
        setContent(plaintext)
      } catch {
        setError('Failed to decrypt — wrong key or corrupted paste')
      }
    }
    load()
  }, [id])

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [timeLeft])

  if (error) return (
    <main className="relative max-w-3xl mx-auto mt-28 px-6 pb-8">
      <div className="border-2 border-black p-6 bg-white">
        <p className="text-xs font-bold uppercase tracking-widest mb-3">Error</p>
        <p className="text-xs leading-relaxed">{error}</p>
      </div>
      <a href="/" className="inline-block px-4 py-3 border-2 border-black bg-white text-black font-bold uppercase text-xs tracking-wider cursor-pointer transition-all duration-200 no-underline mt-4">← New paste</a>
    </main>
  )

  if (!content) return (
    <main className="relative max-w-3xl mx-auto mt-28 px-6 pb-8">
      <p className="text-neutral-500">Decrypting...</p>
    </main>
  )

  return (
    <main className="relative max-w-3xl mx-auto mt-28 px-6 pb-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-wide">Paste</h1>
        <p className="text-xs text-neutral-500 uppercase tracking-widest">{id}</p>
        {isBurned && (
          <div className="border-2 border-black bg-amber-800 text-white text-sm font-bold uppercase tracking-wider px-4 py-3 mt-3">
            {timeLeft !== null && timeLeft > 0 
              ? `This paste will become one-time use in ${timeLeft}s (you do not need to be on the site for it to happen)`
              : hadTimer 
                ? 'This paste will be burned if you refresh or someone else opens it'
                : 'This paste has been burned and will not be accessible again'}
          </div>
        )}
      </header>
      <div className="border-2 border-black p-6 bg-white transition-all duration-200">
        <div className="prose max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
      <a href="/" className="inline-block px-4 py-3 border-2 border-black bg-white text-black font-bold uppercase text-xs tracking-wider cursor-pointer transition-all duration-200 no-underline mt-3">← New paste</a>
      <button
        className="inline-block px-4 py-3 border-2 border-black bg-white text-black font-bold uppercase text-xs tracking-wider cursor-pointer transition-all duration-200 no-underline mt-4 ml-1"
        onClick={copyCurrentUrl}  
      >
        {copied ? "Copied!" : "Copy url"}
      </button>
    </main>
  )
}