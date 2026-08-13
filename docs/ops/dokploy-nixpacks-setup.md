# Dokploy + Nixpacks (Etah portal)

This repo is a **single Next.js app** (`apps/portal`) that calls the existing SDV Nest API. Production deploy is **Nixpacks**, not Docker Compose.

`api-survey-apps` stays on Compose (`docker-compose.dokploy.yml`). Do not copy that pattern here.

## If you see these errors

### Wrong app type

```text
ERROR: failed to solve: failed to read dockerfile: open Dockerfile: no such file or directory
```

This repo has **no Dockerfile**. Recreate as **Application → Nixpacks**. Do not add a root Dockerfile.

### Railpack instead of Nixpacks

Dokploy may default to Railpack. Switch **Build Pack** to **Nixpacks** so `nixpacks.toml` is used.

### Clerk Origin / production keys

```text
Production Keys are only allowed for domain "sdvedutech.in"
```

Do **not** use the admin `sdvedutech.in` `pk_live_` on this host. Use a **separate Clerk application** whose Frontend API is `clerk.nppetah.in`. See [`clerk-production.md`](./clerk-production.md).

### Build missing `NEXT_PUBLIC_*`

Clerk publishable key or `/nest-api` baked as empty. In Dokploy Environment, enable **Available at Buildtime** for every `NEXT_PUBLIC_*` variable, then **Rebuild** (not only Restart).

---

## 1. Create the application

1. Dokploy → **Create** → **Application** (not Docker Compose).
2. Connect this Git repository (`etah-portal-monorepo`).
3. Set:

| Field          | Value                                |
| -------------- | ------------------------------------ |
| Build pack     | **Nixpacks**                         |
| Base directory | `/` (repository root)                |
| Branch         | `main` (or your production branch)   |
| Port           | **3000**                             |
| Auto-deploy    | optional (push to production branch) |

4. Do **not** set:

- Dockerfile path
- Docker Compose file
- Railpack
- Start command override (Nixpacks uses `nixpacks.toml`)
- Base directory `apps/portal` (workspace packages will not install)

5. Save.

## 2. Domain

Dokploy → **Domains**:

| Host                | HTTPS | Container port |
| ------------------- | ----- | -------------- |
| `portal.nppetah.in` | on    | **3000**       |

Point DNS `portal.nppetah.in` A/CNAME at the Dokploy server (or Traefik). Redeploy after adding the domain.

## 3. Environment

Open [`deploy/env/dokploy.nixpacks.env.example`](../../deploy/env/dokploy.nixpacks.env.example).

1. Replace every `REPLACE_ME_*` with **this portal’s** Clerk keys (not admin.sdvedutech.in).
2. Delete any `NEXT_PUBLIC_CLERK_IS_SATELLITE` / `PRIMARY_SIGN_IN` variables.
3. Paste the block into Dokploy **Environment**.
4. For **each** `NEXT_PUBLIC_*` variable, enable **Available at Buildtime**.
5. Save.

`NEST_API_ORIGIN` and `CLERK_SECRET_KEY` are runtime-only (buildtime off is fine).

## 4. Deploy

1. **Deploy** (first Nixpacks build installs pnpm + workspace, then `turbo run build --filter=portal`).
2. Wait until the container is healthy on port 3000.
3. Smoke:

```bash
curl -fsSI https://portal.nppetah.in/
curl -fsSI https://portal.nppetah.in/sign-in
```

Expect `https://portal.nppetah.in/sign-in` (this portal’s Clerk), not admin.sdvedutech.in.

## 5. Nest API allowlist (required)

Redeploy **api-survey-apps** so portal Clerk JWTs are accepted:

```bash
CORS_ORIGIN=https://admin.sdvedutech.in,https://portal.nppetah.in
CLERK_AUTHORIZED_PARTIES=https://admin.sdvedutech.in,https://portal.nppetah.in
PORTAL_CLERK_SECRET_KEY=sk_…same secret as this portal…
PORTAL_CLERK_AUTHORIZED_PARTIES=https://portal.nppetah.in
```

Full Clerk production + cookies: [`clerk-production.md`](./clerk-production.md).

## 5b. After login, APIs used by this portal

Browser → `https://portal.nppetah.in/nest-api/...` → server proxy → `https://backend.sdvedutech.in/...` with `Authorization: Bearer <Clerk JWT>`.

| Screen                      | Nest route                                                                       | Live without token |
| --------------------------- | -------------------------------------------------------------------------------- | ------------------ |
| Health                      | `GET /health`                                                                    | 200                |
| Etah scope                  | `GET /districts`, `/ulbs`, `/wards`                                              | 401                |
| Dashboard / survey overview | `GET /command-center/kpis`, `/dashboard/analytics`                               | 401                |
| Wards                       | `GET /command-center/wards`                                                      | 401                |
| Registry / detail           | `GET /survey-registry`, `/surveys`, `/surveys/:id`                               | 401                |
| Demand notice               | `GET /demand-notices`, `/demand-notices/:id`, `POST /demand-notices/print-token` | 401                |
| Reports                     | `GET /reports/surveys`, `/reports/export`, `/reports/jobs/:id`                   | 401                |
| Settings                    | `GET /users`, `/users/me`, `/roles`, `/permissions`                              | 401                |

401 without a Bearer token means the route exists. 404 would mean a missing API. Payments / cash-desk collection totals are **not** on Nest; the portal does not invent them.

`/nest-api` is excluded from Clerk middleware so the proxy returns JSON (Nest 401/200), not an HTML sign-in redirect.

## 6. What Nixpacks runs

From root [`nixpacks.toml`](../../nixpacks.toml):

| Phase   | Command                                     |
| ------- | ------------------------------------------- |
| Install | `pnpm install --frozen-lockfile`            |
| Build   | `pnpm exec turbo run build --filter=portal` |
| Start   | `pnpm --filter portal start`                |

Next listens on `HOSTNAME=0.0.0.0` and `PORT=3000`. Browser calls same-origin `/nest-api`, which proxies to `https://backend.sdvedutech.in`.

## Local vs production

|                            | Local                   | Production (`portal.nppetah.in`)       |
| -------------------------- | ----------------------- | -------------------------------------- |
| Clerk                      | local test keys         | Portal’s own Clerk keys (no satellite) |
| `NEST_API_ORIGIN`          | `http://localhost:4000` | `https://backend.sdvedutech.in`        |
| Production API from laptop | Blocked                 | Used via `/nest-api`                   |
