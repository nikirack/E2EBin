# E2EBin

A zero-knowledge end-to-end encrypted pastebin. Your content is encrypted client-side using AES-GCM 256-bit before touching the server. The server is completely blind to your data — it only stores encrypted ciphertext.

Copyright (C) 2026 Nikirack. Licensed under the [AGPL-3.0](LICENSE).

## Features

- **Client-side encryption** — AES-GCM 256-bit encryption happens entirely in your browser
- **Zero-knowledge** — The server never sees plaintext; no passwords, no accounts
- **URL fragment keys** — Encryption keys are stored in the URL hash (`#key`), which is never sent to the server
- **Burn after read** — Optional one-time-use mode that deletes the paste after the first view
- **Markdown support** — Pastes are rendered as markdown
- **500KB limit** — Encrypted pastes up to 500KB
- **Free tier ready** — Deploy to Vercel + Neon for free

## How It Works

```
You type content → Browser generates AES-256 key → Content encrypted → Encrypted blob sent to server → You share URL with #key
```

When someone opens the link, the key (from the URL fragment) decrypts the content client-side. The server only sees encrypted garbage.

## Deploy to Vercel (Recommended)

### Prerequisites

- A [Neon](https://neon.tech) PostgreSQL database (free tier works)

### Steps

1. Fork or clone this repository
2. Create a Neon database
3. In the Neon dashboard, copy the connection string
4. Deploy to Vercel:
   ```bash
   npx vercel
   ```
5. Add the following environment variable in Vercel dashboard:
   - `DATABASE_URL` = your Neon connection string

## Self-Hosting

### Prerequisites

- Node.js 20+
- SQLite (built into most systems)

### Setup

```bash
git clone https://github.com/nikirack/e2ebin.git
npm install
npm run build
npm start
```

for dev work, use `npm run dev` instead of building and start

The app runs on port 3000 by default. No environment variables needed for SQLite.

### Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Neon connection string | Uses SQLite locally |

For production, run behind a reverse proxy with HTTPS. Encryption integrity depends on a secure transport layer.

## Security Model

- Encryption keys are stored in the URL fragment (`#key`), which browsers never send to servers
- Each paste uses a random 96-bit IV — identical content produces different ciphertext
- "Burn after read" pastes are deleted server-side on first fetch
- No authentication — anyone with the URL and key can access the paste
- The server is a dumb storage bucket; it cannot decrypt anything

## Limitations

- No password protection — anyone with the URL can decrypt
- No expiration controls (beyond burn-after-read)
- Key is in the URL — may appear in server logs/referrers unless using HTTPS
