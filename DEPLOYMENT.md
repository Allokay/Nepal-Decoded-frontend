# Deploying Nepal Decoded Frontend to Cloudflare Pages

Since we migrated the frontend from a Vite Single Page Application (SPA) to a **Next.js App Router** with Server-Side Rendering (SSR) for SEO, we deploy it to Cloudflare Pages using Cloudflare's serverless edge runtime.

Cloudflare handles builds on a Linux runner automatically when you push to GitHub, which avoids any local Windows scripting conflicts.

---

## Prerequisites
1. Ensure your latest Next.js code is pushed to your GitHub repository:
   `https://github.com/Allokay/Nepal-Decoded-frontend`
2. Have a free Cloudflare account.

---

## Step-by-Step Deployment Instructions

### 1. Create a Pages Project in Cloudflare
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com).
2. In the left navigation bar, go to **Workers & Pages**.
3. Click the **Create** button.
4. Select the **Pages** tab.
5. Click **Connect to Git** and authorize your GitHub account if you haven't already.
6. Select your repository: `Nepal-Decoded-frontend` and click **Begin setup**.

### 2. Configure Build Settings
Configure the build settings precisely as follows:
* **Project Name**: `nepal-decoded` (or your preferred name)
* **Production Branch**: `main`
* **Framework Preset**: Choose **Next.js (App Router)**
* **Build Command**: `npx @cloudflare/next-on-pages`
* **Build Output Directory**: `.vercel/output/static`

### 3. Add Environment Variables
Before building, expand the **Environment Variables (advanced)** section and add:
* **Variable Name**: `NEXT_PUBLIC_API_BASE_URL`
* **Value**: `https://nepal-decoded-backend.onrender.com`

*This variable tells the Next.js server components and client code where your live database-backed Render server is located.*

### 4. Deploy!
Click **Save and Deploy**. Cloudflare will spin up a build container, pull your repository, compile the Next.js app to edge functions, and deploy it to a global edge CDN.

---

## Maintenance & Updates
Whenever you push new code changes to the `main` branch of your GitHub repository, Cloudflare Pages will automatically trigger a new build and deploy it with zero downtime.
