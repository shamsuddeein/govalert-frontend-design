# GovAlert

GovAlert is a frontend for monitoring and verifying Nigerian public-sector recruitment opportunities. It prioritises evidence over claims: every listing should point to its official source and present verification and portal-health data only when that data is available.

## Stack

- React 19 and TypeScript
- TanStack Start and TanStack Router
- Vite and Tailwind CSS
- Bun for package management and scripts

## Getting started

### Prerequisites

- [Bun](https://bun.sh/) 1.x or newer

### Install and run

```bash
bun install
bun run dev
```

The development server URL is printed in the terminal, usually `http://localhost:3000`.

## Configuration

The app reads its API host from `VITE_API_BASE_URL`. If it is not set, it uses the deployed GovAlert API.

Create a local environment file when you need to point the UI at a different backend:

```bash
VITE_API_BASE_URL=https://your-api.example.com
```

The client calls the API under `/api/v1` and authentication endpoints under `/api/auth`.

## Scripts

```bash
# Start the development server
bun run dev

# Create a production build
bun run build

# Run linting
bun run lint

# Apply formatting
bun run format

# Run mapper tests
bunx vitest run src/lib/apiMapper.test.ts
```

## Project structure

```text
src/
├── components/     Shared UI and layout components
├── lib/            API client, DTO mappers, utilities, and data
├── routes/         File-based TanStack Start routes
├── hooks/          Shared React hooks
├── router.tsx      Router configuration
└── start.ts         Server entry point and error middleware
```

Routes are generated from `src/routes`. Do not edit `src/routeTree.gen.ts` manually.

## Trust-data policy

GovAlert must not invent evidence. API mappers in `src/lib/api.ts` follow these principles:

- Missing verification scores, timestamps, source URLs, audit events, and portal metrics are shown as unavailable.
- Unknown portal or verification state stays unknown; it is never upgraded to a positive state by the UI.
- Empty API payloads are rejected instead of being converted into convincing placeholder listings.

This behaviour is covered by `src/lib/apiMapper.test.ts`.

## Production build

```bash
bun run build
```

The build output is written to `.output/`. The configured deployment target is a Cloudflare module worker.

## Notes for contributors

- Follow the design and content rules in [`REDESIGN_BRIEF.md`](REDESIGN_BRIEF.md).
- Preserve the distinction between verified data and unavailable data.
- Keep the connected Lovable branch in a working state; do not rewrite published Git history.
