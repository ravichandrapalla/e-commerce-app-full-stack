# BoxInWheels — Resend, Stripe & domain setup

## 1. Resend (transactional email)

1. Create a free account: https://resend.com/signup
2. **API Keys** → Create API Key → copy `re_...`
3. Add to **local** `server/.env`:
   ```env
   RESEND_API_KEY=re_xxxxxxxx
   EMAIL_FROM=BoxInWheels <onboarding@resend.dev>
   ```
   (`onboarding@resend.dev` works on the free tier for testing.)
4. Add the same key in **Vercel** → project **server** → Settings → Environment Variables → `RESEND_API_KEY`
5. (Optional) Verify `boxinwheels.com` in Resend → Domains, then set:
   `EMAIL_FROM=BoxInWheels <orders@boxinwheels.com>`

## 2. Stripe (checkout)

1. Create account: https://dashboard.stripe.com/register
2. Stay in **Test mode** (toggle top-right).
3. **Developers → API keys** → copy **Secret key** (`sk_test_...`) → `server/.env` and Vercel **server** → `STRIPE_SECRET_KEY`
4. **Developers → Webhooks → Add endpoint**
   - URL: `https://api.boxinwheels.com/api/v1/payments/stripe/webhook`
   - Events: `checkout.session.completed`, `checkout.session.expired`
   - Copy **Signing secret** (`whsec_...`) → `STRIPE_WEBHOOK_SECRET` (local + Vercel)
5. Test card: `4242 4242 4242 4242`, any future expiry, any CVC.

## 3. Domain `boxinwheels.com`

Domains are attached to Vercel projects:

| Host | Vercel project |
|------|----------------|
| `boxinwheels.com`, `www.boxinwheels.com` | **client** |
| `api.boxinwheels.com` | **server** |

**Option A — Buy on Vercel (~$11.25/yr)**  
Dashboard → Domains → buy `boxinwheels.com` (DNS is automatic).

**Option B — You already own the domain**  
At your registrar, add:

```
A     @      76.76.21.21
A     www    76.76.21.21
A     api    76.76.21.21
```

Or point nameservers to `ns1.vercel-dns.com` and `ns2.vercel-dns.com`.

## 4. After adding secrets

Redeploy both projects (or push to GitHub if connected):

```bash
cd client && npx vercel deploy --prod
cd server && npx vercel deploy --prod
```
