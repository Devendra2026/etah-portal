# Clerk: admin primary + Etah portal satellite

Same Clerk **production** instance as `admin.sdvedutech.in` / `backend.sdvedutech.in`.

| App | Host | Clerk role |
| --- | --- | --- |
| api-survey-apps `apps/web` | `admin.sdvedutech.in` | **Primary** — sign-in, sign-up, user management |
| etah-portal `apps/portal` | `portal.nppetah.in` | **Satellite** — session sync after primary login |
| api-survey-apps `apps/api` | `backend.sdvedutech.in` | JWT verify (`azp` allowlist) |

## Officer flow

1. New officer signs up / signs in on `https://admin.sdvedutech.in`.
2. Nest upserts them as `PENDING_APPROVAL` (no permissions).
3. An Etah `DEPT_ADMIN` or platform `ADMIN` opens `https://portal.nppetah.in/settings/permissions` and grants `DEPT_CLERK` / `DEPT_OPERATOR` / `DEPT_ADMIN` for Etah ULB.
4. Next sign-in: Clerk satellite returns to the portal, or admin redirects Etah department roles to `https://portal.nppetah.in/dashboard`.

Platform roles (`ADMIN`, `SURVEYOR`, `QC_SUPERVISOR`, `FIELD_SUPERVISOR`) stay on admin.

## Portal Dokploy env

Use live keys from the **admin** Clerk instance (`pk_live_` / `sk_live_`), plus:

```bash
NEXT_PUBLIC_CLERK_IS_SATELLITE=true
NEXT_PUBLIC_CLERK_SATELLITE_DOMAIN=portal.nppetah.in
NEXT_PUBLIC_CLERK_PRIMARY_SIGN_IN_URL=https://admin.sdvedutech.in/sign-in
NEXT_PUBLIC_CLERK_PRIMARY_SIGN_UP_URL=https://admin.sdvedutech.in/sign-up
NEST_API_ORIGIN=https://backend.sdvedutech.in
```

Do not use `pk_test_` on `portal.nppetah.in`.

## Admin Dokploy (rebuild web)

```bash
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
ETAH_PORTAL_URL=https://portal.nppetah.in
CLERK_AUTHORIZED_PARTIES=https://admin.sdvedutech.in,https://portal.nppetah.in
CORS_ORIGIN=https://admin.sdvedutech.in,https://portal.nppetah.in
```

Do **not** set `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL` — it blocks satellite return to the portal.

## Clerk Dashboard

- Home URL: `https://admin.sdvedutech.in`
- Satellite domain: `portal.nppetah.in`
- Allowed redirect: `https://portal.nppetah.in/dashboard`
- Same instance as Nest `CLERK_SECRET_KEY`
