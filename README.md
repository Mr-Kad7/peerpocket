# Peer Pockets

Peer Pockets is an entrepreneur-focused crowdfunding platform for young, student and micro entrepreneurs: **Small capital. Real businesses.**

## Included

- Professional responsive public website
- Campaign discovery, search, categories and sorting
- Campaign detail views, progress, funding use and updates
- Entrepreneur pitch submission flow
- Admin-only private control center at `/admin`
- Campaign approval/rejection, editing, publishing, pausing/suspension and deletion
- Campaign image uploads to Supabase Storage
- Funding goal/progress and verification controls
- Manual Mobile Money payment verification using the temporary Peer Pockets number `050 012 6026`
- Supporter records and payment history
- Campaign update publishing
- FAQ management
- Homepage/site statistics and platform contact settings
- Report review and campaign safety controls
- Legal pages and professional footer

## Important payment note

The current payment method is a **temporary manual Mobile Money workflow**. It does not trigger a PIN prompt or automatically verify money. A real Request-to-Pay/C2B integration must be connected before advertising automatic payments.

## Environment variables

Set these in Render (never commit secrets to GitHub):

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET` — use a long random secret for signed admin sessions

## Supabase setup

1. Open Supabase SQL Editor.
2. Run `supabase/schema.sql`.
3. In Render → Environment, add the variables above.
4. Redeploy the Render service.

The schema includes campaigns, pitch submissions, supporters, transactions, campaign updates, reports, site settings and FAQs. The admin uses the server-side Supabase service role key; that key must never be exposed to browser code.

The image uploader creates/uses a public `campaign-images` Storage bucket for campaign artwork. For a stricter private setup, switch the bucket and serve signed URLs through a protected route.

## Admin workflow

1. Open `https://peerpocketss.com/admin`.
2. Sign in with `ADMIN_EMAIL` and `ADMIN_PASSWORD` configured in Render.
3. Use the left-side sections to manage the platform.
4. Review pitch submissions before publication.
5. Verify pending payment references only after confirming the money was actually received.
6. Use Reports to investigate suspicious campaigns and suspend them from Campaigns.

## Run locally

```bash
npm install
npm run dev
```

Production:

```bash
npm run build
npm start
```

## Deployment

The project is designed for a Render Web Service running Next.js. Keep `peerpocketss.com` as the verified Render custom domain and Spaceship as the DNS provider.
