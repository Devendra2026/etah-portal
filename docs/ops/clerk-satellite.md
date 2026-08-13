# Clerk: portal has its own keys (not satellite)

`portal.nppetah.in` signs in with **this portal’s Clerk application**.
It does **not** redirect to `admin.sdvedutech.in`.

Survey/export data still comes from Nest at `https://backend.sdvedutech.in`, scoped to Etah ULB.

| App | Host | Auth |
| --- | --- | --- |
| Etah portal | `portal.nppetah.in` | Own Clerk (`pk_` / `sk_` for nppetah.in) |
| Admin UI | `admin.sdvedutech.in` | SDV Clerk (unchanged) |
| Nest API | `backend.sdvedutech.in` | Accepts **both** secrets |

## Officer flow

1. Open `https://portal.nppetah.in/sign-in` (or `/sign-up`).
2. Nest verifies the portal JWT via `PORTAL_CLERK_SECRET_KEY`.
3. If the email already exists on the survey service, that officer’s Etah roles apply. Otherwise they are `PENDING_APPROVAL`.
4. An Etah `DEPT_ADMIN` / `ADMIN` grants a department role under Settings → User Permissions.
5. Dashboard, registry, and **ULB-wise exports** call `/nest-api/...` → `backend.sdvedutech.in` with `districtId` + `ulbId` for Etah Municipal Council.

## Portal Dokploy (rebuild)

Remove every satellite variable (`NEXT_PUBLIC_CLERK_IS_SATELLITE`, `SATELLITE_DOMAIN`, `PRIMARY_SIGN_IN_URL`, …). Paste [`deploy/env/dokploy.nixpacks.env.example`](../../deploy/env/dokploy.nixpacks.env.example). Enable **Available at Buildtime** on all `NEXT_PUBLIC_*` keys.

Clerk Dashboard for **this** application:

- Production domain: `portal.nppetah.in` (or a development instance allowed on that host)
- Paths: `/sign-in`, `/sign-up`
- Redirect: `https://portal.nppetah.in/dashboard`

## Nest / api-survey-apps (redeploy api)

Same secret as the portal `CLERK_SECRET_KEY`:

```bash
PORTAL_CLERK_SECRET_KEY=sk_…same as portal…
PORTAL_CLERK_AUTHORIZED_PARTIES=https://portal.nppetah.in
CORS_ORIGIN=https://admin.sdvedutech.in,https://portal.nppetah.in
CLERK_AUTHORIZED_PARTIES=https://admin.sdvedutech.in,https://portal.nppetah.in
```

Do not point `NEST_API_ORIGIN` at `admin.sdvedutech.in` — that host is the admin Next.js UI, not the API.
