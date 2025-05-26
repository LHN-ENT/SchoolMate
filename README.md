# SchoolMate v1.2 Full Export

## Modules
- Onboarding (Google SSO, multi-child, transport, aftercare, digest)
- Dashboard cleanup (hide setup, remove demo, placeholder reminders)
- Chat & Email Parsing (Make.com webhook, Gmail parse, OpenAI chat UI)
- CI/CD (GitHub, Vercel integration)

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```
2. Create `.env.local`:
   ```
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=...
   MAKE_WEBHOOK_SECRET=...
   OPENAI_API_KEY=...
   ```
3. Run dev server:
   ```
   npm run dev
   ```

## Deployment
1. Push to GitHub.
2. Connect to Vercel; set env vars.
3. Deploy.
<!-- trigger build -->

