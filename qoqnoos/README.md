# Qoqnoos (ققنوس) — Persian AI Wellness Platform

> *The wound is where the light enters.* — Rumi
> *زخم جایی است که نور از آن وارد می‌شود*

Qoqnoos (Phoenix in Persian) is an AI-powered mental wellness platform for the Persian diaspora.

## Features

- **AI Companion (Simorgh)** — Culturally-aware AI therapy companion (EN/FA)
- **Live Therapy** — Video sessions with Persian-speaking therapists
- **Guided Meditations** — Persian-themed breathwork and sound baths
- **Journal & Mood Tracking** — AI-analyzed reflections
- **Content Library** — Curated books, podcasts, and exercises
- **Community** — Group healing circles and workshops

## Tech Stack

| Layer | Technology |
|-------|------------|
| Web | Next.js 14 (App Router) |
| Mobile | React Native (Expo SDK 51) |
| API | Node.js + tRPC + Prisma |
| AI Pipeline | Python FastAPI + LangChain |
| Database | PostgreSQL 16 + Redis 7 |
| AI | OpenAI GPT-4o + Pinecone |
| Voice | Deepgram STT + ElevenLabs TTS |
| Video | Daily.co |
| Cloud | GCP (GKE Autopilot) |
| Payments | Stripe |

## Quick Start

```bash
pnpm install
cp .env.example .env.local
docker-compose up -d postgres redis
cd services/api && npx prisma migrate dev
pnpm dev
```

## License

Private — All rights reserved.

---

*Built with love for the Persian diaspora. Rise from the ashes.*
*از خاکستر برمی‌خیزیم*
