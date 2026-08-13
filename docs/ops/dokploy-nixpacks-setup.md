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

`portal.nppetah.in` is a different root domain. Use Clerk **satellite** (see env example) and add `portal.nppetah.in` in the Clerk Dashboard. Do not test `pk_live` on `localhost`.

### Build missing `NEXT_PUBLIC_*`

Clerk publishable key or `/nest-api` baked as empty. In Dokploy Environment, enable **Available at Buildtime** for every `NEXT_PUBLIC_*` variable, then **Rebuild** (not only Restart).

---

## 1. Create the application

1. Dokploy → **Create** → **Application** (not Docker Compose).
2. Connect this Git repository (`etah-portal-monorepo`).
3. Set:

| Field            | Value                                      |
| ---------------- | ------------------------------------------ |
| Build pack       | **Nixpacks**                               |
| Base directory   | `/` (repository root)                      |
| Branch           | `main` (or your production branch)         |
| Port             | **3000**                                   |
| Auto-deploy      | optional (push to production branch)       |

4. Do **not** set:

- Dockerfile path
- Docker Compose file
- Railpack
- Start command override (Nixpacks uses `nixpacks.toml`)
- Base directory `apps/portal` (workspace packages will not install)

5. Save.

## 2. Domain

Dokploy → **Domains**:

| Host                    | HTTPS | Container port |
| ----------------------- | ----- | -------------- |
| `portal.nppetah.in`     | on    | **3000**       |

Point DNS `portal.nppetah.in` A/CNAME at the Dokploy server (or Traefik). Redeploy after adding the domain.

## 3. Environment

Open [`deploy/env/dokploy.nixpacks.env.example`](../../deploy/env/dokploy.nixpacks.env.example).

1. Replace every `REPLACE_ME_*` (Clerk live keys from the same instance as `admin.sdvedutech.in`).
2. Paste the block into Dokploy **Environment**.
3. For **each** `NEXT_PUBLIC_*` variable, enable **Available at Buildtime**.
4. Save.

`NEST_API_ORIGIN` and `CLERK_SECRET_KEY` are runtime-only (buildtime off is fine).

## 4. Deploy

1. **Deploy** (first Nixpacks build installs pnpm + workspace, then `turbo run build --filter=portal`).
2. Wait until the container is healthy on port 3000.
3. Smoke:

```bash
curl -fsSI https://portal.nppetah.in/
curl -fsSI https://portal.nppetah.in/sign-in
```

Expect a redirect to Clerk (satellite → `https://admin.sdvedutech.in/sign-in`) when logged out.

## 5. Nest API allowlist (required)

Redeploy **api-survey-apps** so Etah JWTs are accepted:

```bash
CORS_ORIGIN=https://admin.sdvedutech.in,https://portal.nppetah.in
CLERK_AUTHORIZED_PARTIES=https://admin.sdvedutech.in,https://portal.nppetah.in
```

Clerk Dashboard (same instance as admin):

- Satellite domain: `portal.nppetah.in`
- Redirect URL: `https://portal.nppetah.in/dashboard`

## 6. What Nixpacks runs

From root [`nixpacks.toml`](../../nixpacks.toml):

| Phase   | Command                                      |
| ------- | -------------------------------------------- |
| Install | `pnpm install --frozen-lockfile`             |
| Build   | `pnpm exec turbo run build --filter=portal`  |
| Start   | `pnpm --filter portal start`                 |

Next listens on `HOSTNAME=0.0.0.0` and `PORT=3000`. Browser calls same-origin `/nest-api`, which proxies to `https://backend.sdvedutech.in`.

## Local vs production

|                         | Local                         | Production (`portal.nppetah.in`)      |
| ----------------------- | ----------------------------- | ------------------------------------- |
| Clerk                   | `pk_test_`                    | `pk_live_` + satellite                |
| `NEST_API_ORIGIN`       | `http://localhost:4000`       | `https://backend.sdvedutech.in`       |
| Production API from laptop | Blocked                    | Used via `/nest-api`                  |
