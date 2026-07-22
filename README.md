# 1upthrift.jo

A clean black-and-white vintage thrift store website for **1upthrift** — based in Jordan. Built with React, Tailwind CSS, Framer Motion, and Supabase for live shared inventory.

## Features

- Minimal black & white vintage aesthetic with smooth animations
- Product grid with **Available** / **Purchased** status badges
- Cart with **Claim on WhatsApp** (placeholder — wire your link later)
- Dev panel (password-protected) to add, edit, and toggle listing availability
- Supabase-backed listings sync for all visitors in real time
- GitHub Pages deployment via GitHub Actions

## Quick Start (Local)

1. Install [Node.js](https://nodejs.org/) (v20+)
2. Install dependencies:

```bash
npm install
```

3. Copy env file and add your Supabase keys (optional for local demo):

```bash
copy .env.example .env
```

Without Supabase, the site runs in **local demo mode** using `public/data/listings.json` and browser storage for dev edits (single browser only).

4. Start dev server:

```bash
npm run dev
```

## Supabase Setup (Required for Production)

Shared listings for all visitors require Supabase.

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) and create a free project.

### 2. Run the database migration

In Supabase Dashboard → **SQL Editor**, paste and run:

[`supabase/migrations/001_listings.sql`](supabase/migrations/001_listings.sql)

This creates the `listings` table, storage bucket, RLS policies, and seeds 4 initial products.

### 3. Deploy the Edge Function

Install the [Supabase CLI](https://supabase.com/docs/guides/cli), then:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase secrets set DEV_PASSWORD=1052M1
supabase functions deploy dev-action
```

The Edge Function validates the dev password server-side and handles all listing mutations.

### 4. Add environment variables

Create `.env` locally:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Find these in Supabase Dashboard → **Project Settings → API**.

## Dev Panel

1. Click **dev** in the top-right corner
2. Enter password: `1052M1`
3. You are redirected to the home page with dev privileges
4. **Add a listing** appears in the header
5. Hover any product card and click **Edit** to update or mark as purchased

Wrong password = access denied, no dev tools shown.

## GitHub Pages Deployment

### 1. Create a GitHub repo and push this project

### 2. Enable GitHub Pages

Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**

### 3. Add repository secrets

**Settings → Secrets and variables → Actions:**

| Secret | Value |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |

### 4. Update base path (if needed)

If your repo is not named `first-store`, edit [`vite.config.ts`](vite.config.ts):

```ts
base: process.env.GITHUB_PAGES === 'true' ? '/YOUR-REPO-NAME/' : '/',
```

### 5. Push to `main`

GitHub Actions builds and deploys automatically.

## Custom Domain (1upthrift.jo)

1. Add a `CNAME` record pointing to `<username>.github.io`
2. In GitHub Pages settings, set custom domain to `1upthrift.jo`
3. Update `vite.config.ts` base to `'/'` when using a custom domain at repo root, or use a `www` subdomain setup

## WhatsApp Button

The **Claim on WhatsApp** button is styled and visible in the cart but intentionally does nothing yet. To wire it later, edit:

- [`src/components/CartDrawer.tsx`](src/components/CartDrawer.tsx)
- [`src/pages/CartPage.tsx`](src/pages/CartPage.tsx)

Example link format:

```ts
window.open('https://wa.me/962XXXXXXXXX?text=...', '_blank')
```

## Project Structure

```
public/logo/          Store logo
public/listings/      Product images
public/data/          Fallback seed JSON
src/components/       UI components
src/pages/            Route pages
src/hooks/            Cart, listings, dev auth
src/lib/              Supabase + dev API
supabase/             Migration + Edge Function
```

## License

Private — 1upthrift.jo
