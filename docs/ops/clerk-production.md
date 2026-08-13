# Clerk production — portal.nppetah.in

This portal is a **standalone** Clerk app. Sign-in stays on `https://portal.nppetah.in/sign-in`. Survey data comes from `https://backend.sdvedutech.in` (Etah ULB).

Do **not** use satellite. Do **not** use `sdvedutech.in` keys. Do **not** use `pk_test_` on this host.

## Live failure this setup prevents

```text
X-Clerk-Auth-Reason: dev-browser-missing
```

That header means development keys. Cookies are set on `*.clerk.accounts.dev` and blocked on `nppetah.in`. Production keys + `clerk.nppetah.in` DNS fix it.

Nixpacks builds with `CI=true`. `next build` **fails** unless `pk_live_` / `sk_live_` / `CLERK_ENCRYPTION_KEY` are present and satellite vars are absent.

## 1. Clerk Dashboard — new application

1. [dashboard.clerk.com](https://dashboard.clerk.com) → **Create application** → `Etah NPP Portal`.
2. This is a different app from SDV admin.
3. Switch to the **Production** instance (Deploy / `clerk deploy`).

### Domains

| Setting                 | Value                                 |
| ----------------------- | ------------------------------------- |
| Home URL                | `https://portal.nppetah.in`           |
| Sign-in                 | `/sign-in`                            |
| Sign-up                 | `/sign-up`                            |
| After sign-in / sign-up | `https://portal.nppetah.in/dashboard` |
| Satellite               | **Off**                               |

Add **every DNS record** on the Domains page. Required for cookies:

| Type  | Host                         | Target                            |
| ----- | ---------------------------- | --------------------------------- |
| CNAME | `clerk` (`clerk.nppetah.in`) | Frontend API value from Dashboard |

Wait until **Verified**. `__client` is first-party only after this CNAME exists.

Also add mail/DKIM records Clerk lists so sign-in emails work.

### Paths and allowlist

- Hosted components on this app (`/sign-in`, `/sign-up`). Do not send users to Account Portal as the only UI.
- Allowed origins / redirects:
  - `https://portal.nppetah.in`
  - `https://portal.nppetah.in/sign-in`
  - `https://portal.nppetah.in/sign-up`
  - `https://portal.nppetah.in/dashboard`

### Google and email/password

Enable these on the **Etah NPP Portal** production instance (not the SDV admin app):

- Email/password
- Google OAuth

Google Client ID and Client Secret stay in the Clerk Dashboard. Do **not** put them in Dokploy or any `NEXT_PUBLIC_*` variable.

Google OAuth callback (do not change):

```text
https://clerk.nppetah.in/v1/oauth_callback
```

The portal uses Clerk’s hosted Google button on `/sign-in` and `/sign-up`. There is no custom Google callback route in this app.

### Keys

Production API keys only:

- `pk_live_…` — must decode to `clerk.nppetah.in`, not `clerk.sdvedutech.in`, not `*.clerk.accounts.dev`
- `sk_live_…` — same instance

Generate encryption key:

```bash
openssl rand -base64 32
```

## 2. Portal Dokploy

Delete satellite and test keys:

- `NEXT_PUBLIC_CLERK_IS_SATELLITE`
- `NEXT_PUBLIC_CLERK_SATELLITE_DOMAIN`
- `NEXT_PUBLIC_CLERK_PRIMARY_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_PRIMARY_SIGN_UP_URL`
- `pk_test_` / `sk_test_`

Paste [`deploy/env/dokploy.nixpacks.env.example`](../../deploy/env/dokploy.nixpacks.env.example).

Enable **Available at Buildtime** on every `NEXT_PUBLIC_*`. **Rebuild** (not restart).

If the build error mentions Clerk production config, the keys or encryption key are still wrong.

## 3. Nest (api-survey-apps)

Same portal `sk_live_`:

```bash
PORTAL_CLERK_SECRET_KEY=sk_live_…same as portal…
PORTAL_CLERK_AUTHORIZED_PARTIES=https://portal.nppetah.in
CORS_ORIGIN=https://admin.sdvedutech.in,https://portal.nppetah.in
CLERK_AUTHORIZED_PARTIES=https://admin.sdvedutech.in,https://portal.nppetah.in
```

Redeploy **api**.

## 4. Smoke

```bash
curl -sI https://portal.nppetah.in/sign-in
```

Pass:

- `200`
- **No** `dev-browser-missing`
- Browser login sets `__session` on `portal.nppetah.in` and `__client` on `clerk.nppetah.in`
- After login, dashboard loads Etah data via `/nest-api` → `backend.sdvedutech.in`

## Do not

| Don’t                                         | Why                                         |
| --------------------------------------------- | ------------------------------------------- |
| SDV `pk_live_`                                | Origin locked to `sdvedutech.in`            |
| `pk_test_`                                    | Third-party cookies → `dev-browser-missing` |
| Satellite                                     | Login leaves this host                      |
| `NEST_API_ORIGIN=https://admin.sdvedutech.in` | Admin UI, not Nest                          |
