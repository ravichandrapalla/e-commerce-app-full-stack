# BoxInWheels — Free production deployment

## Live URLs (current)

| Layer | URL |
|-------|-----|
| **Storefront** | https://boxinwheels.com (DNS pending) · https://client-devlp.vercel.app |
| **API** | https://api.boxinwheels.com/api/v1 (DNS pending) · https://server-devlp.vercel.app/api/v1 |
| **Stripe webhook** | `https://api.boxinwheels.com/api/v1/payments/stripe/webhook` |
| **Database** | Neon project `boxinwheels` |
| **Images** | Cloudinary |

See `scripts/setup-external-services.md` for Brevo, Stripe, and domain DNS steps.

Demo accounts (after `npm run seed:catalog`):

- Admin: `admin@gmail.com` / `admin@1234`
- Seller: `seller@gmail.com` / `seller@1234`

---

Recommended stack (all have solid free tiers for this project):

| Layer | Service | Why |
|-------|---------|-----|
| **Database** | [Neon](https://neon.tech) | Managed PostgreSQL, works with Prisma, generous free tier |
| **API** | [Vercel](https://vercel.com) or [Render](https://render.com) | Vercel is deployed now; use Render if you need long-running uploads without serverless limits |
| **Frontend** | [Vercel](https://vercel.com) | Best fit for Vite + React, global CDN, preview URLs |
| **Images** | [Cloudinary](https://cloudinary.com) | Already integrated |

## 1. Database (Neon)

1. Sign up at [neon.tech](https://neon.tech) → **New project**.
2. Copy the **pooled** connection string (`postgresql://...?sslmode=require`).
3. Keep it for Render `DATABASE_URL`.

## 2. API (Render)

1. Push this repo to GitHub.
2. [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint** → connect repo (uses `render.yaml`).
3. Or **New Web Service** → root directory `server`, build:
   ```bash
   npm install && npm run db:migrate && npm run build
   ```
   Start: `npm start`
4. Set environment variables:

   | Variable | Required | Notes |
   |----------|----------|-------|
   | `DATABASE_URL` | Yes | Neon pooled URL |
   | `JWT_SECRET` | Yes | Long random string (Render can auto-generate) |
   | `CLIENT_URL` | Yes | Vercel URL, e.g. `https://boxinwheels.vercel.app` (comma-separate for previews) |
   | `CLOUDINARY_*` | Yes | From Cloudinary dashboard |
   | `BREVO_API_KEY` | Optional | Emails log to console if omitted |
   | `STRIPE_*` | Optional | Demo checkout works without Stripe |

5. After deploy, note the API URL: `https://<service>.onrender.com`.

Free tier sleeps after ~15 min idle; first request may take ~30s.

## 3. Frontend (Vercel)

1. [vercel.com](https://vercel.com) → **Add New Project** → import GitHub repo.
2. **Root Directory**: `client`
3. **Framework**: Vite (auto-detected)
4. **Environment variable**:
   - `VITE_API_URL` = `https://<your-render-service>.onrender.com/api/v1`
5. Deploy.

## 4. Wire CORS + cookies

1. In Render, set `CLIENT_URL` to your exact Vercel URL (no trailing slash).
2. Redeploy API if you change the frontend URL.
3. Auth uses httpOnly cookies with `SameSite=None` in production — frontend and API must both be HTTPS (Vercel + Render provide this).

## 5. Optional: seed data

From your machine with production `DATABASE_URL`:

```bash
cd server
export DATABASE_URL="postgresql://..."
npm run seed:catalog
npm run seed:assign
```

## 6. Stripe webhooks (optional)

If using live Stripe, set `STRIPE_WEBHOOK_SECRET` and point webhook to:

`https://<render-service>.onrender.com/api/v1/payments/stripe/webhook`

## Quick CLI (optional)

```bash
# Frontend
cd client && npx vercel --prod

# API: use Render dashboard or connect repo via Blueprint
```
