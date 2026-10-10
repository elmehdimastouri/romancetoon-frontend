# RomanceToon — Frontend

The official Next.js 15 frontend for **RomanceToon**, an English-language manhwa reading platform built for speed, SEO, and continuous vertical reading.

## Tech Stack

* **Framework:** Next.js 15 (`15.5.27`) with React Server Components (RSC) and App Router
* **Runtime / Deployment:** Cloudflare Workers via `@opennextjs/cloudflare` (`1.20.10`) & Wrangler (`4.149.0`)
* **Styling:** Tailwind CSS with custom *Romantic Dark* theme tokens
* **Icons:** Lucide React
* **Data Source:** Headless WordPress REST API (`RomanceToon Core`)
* **Image Delivery:** Cloudflare R2 bucket served through public CDN

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env.local` and configure your WordPress API URL:
```bash
cp .env.example .env.local
```

```env
WORDPRESS_API_URL=https://meh.romancetoon.com/wp-json
NEXT_PUBLIC_CDN_BASE_URL=https://cdn.romancetoon.com
NEXT_PUBLIC_SITE_URL=https://romancetoon.com
NEXT_PUBLIC_SITE_NAME=RomanceToon
REVALIDATION_SECRET_TOKEN=your-revalidation-secret
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Build & Deploy to Cloudflare Workers
```bash
npm run build:worker
npx wrangler deploy
```

## Features

* **Continuous Vertical Webtoon Strip:** Optimized continuous reading mode with lazy loading and zero layout shifts.
* **SEO & Structured Data:** Automatic Schema.org (`ComicSeries` and `ComicIssue`), dynamic `sitemap.xml`, and Google-compliant `robots.txt`.
* **Permanent 301 Redirects:** Handles canonical URL changes from WordPress without broken links.
* **On-Demand ISR Revalidation:** Instant cache invalidation via HMAC-signed webhooks upon chapter publishing.
* **Browser LocalStorage:** Client-side reading history and bookmarks without requiring user logins.
