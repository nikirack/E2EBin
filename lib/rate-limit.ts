const rateLimitMap = new Map<string, { count: number; timestamp: number }>()
const WINDOW_MS = 60 * 1000
const MAX_REQUESTS = 30

export function rateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now - record.timestamp > WINDOW_MS) {
    const resetAt = now + WINDOW_MS
    rateLimitMap.set(ip, { count: 1, timestamp: now })
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetAt }
  }

  if (record.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetAt: record.timestamp + WINDOW_MS }
  }

  record.count++
  return { allowed: true, remaining: MAX_REQUESTS - record.count, resetAt: record.timestamp + WINDOW_MS }
}

setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitMap.entries()) {
    if (now - value.timestamp > WINDOW_MS * 2) {
      rateLimitMap.delete(key)
    }
  }
}, WINDOW_MS)