# Etah Nagar Palika Parishad portal

Next.js app in `apps/portal`. Production host: **https://portal.nppetah.in**.

**Dokploy:** Nixpacks application (not Compose). See [`docs/ops/dokploy-nixpacks-setup.md`](docs/ops/dokploy-nixpacks-setup.md). Env paste: [`deploy/env/dokploy.nixpacks.env.example`](deploy/env/dokploy.nixpacks.env.example).

## Local

```bash
pnpm install
pnpm --filter portal dev
```

Copy `apps/portal/env.example` to `apps/portal/.env.local`. Production Nest (`backend.sdvedutech.in`) cannot be used from localhost.

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/portal
```

This will place the ui components in the `packages/ui/src/components` directory.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button";
```
