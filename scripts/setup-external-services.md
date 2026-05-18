# BoxInWheels — Brevo, Stripe & domain setup

## 1. Brevo (transactional email)

1. Create a free account: https://www.brevo.com/
2. **SMTP & API** → **API keys** → Generate → copy the key (`xkeysib-...`)
3. **Senders, domains & dedicated IPs** → **Senders** → Add a sender (your email). Confirm the verification email Brevo sends you.
4. Add to **local** `server/.env`:
   ```env
   BREVO_API_KEY=xkeysib-xxxxxxxx
   EMAIL_FROM=BoxInWheels <you@example.com>
   ```
   `EMAIL_FROM` must use the **same email** you verified as a Brevo sender (name can differ).
5. Add the same variables in **Vercel** → project **server** → Settings → Environment Variables:
   - `BREVO_API_KEY`
   - `EMAIL_FROM` (and optionally `ORDER_EMAIL_FROM` for order emails)
6. Remove old `RESEND_API_KEY` from Vercel if it is still set.

Free tier: 300 emails/day. No custom domain required for testing — a verified sender email is enough.

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
