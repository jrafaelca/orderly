# Repository Guidelines

## Project Structure & Module Organization
This repository is a Nuxt 4 app with a minimal starter layout.

- `app/`: main application source. Start at `app/app.vue`.
- `app/assets/css/main.css`: global styles and Tailwind/Nuxt UI imports.
- `public/`: static files served directly (for example `favicon.ico`, `robots.txt`).
- `nuxt.config.ts`: central Nuxt configuration (`@nuxt/ui`, CSS, devtools).
- `.nuxt/`: generated build artifacts. Do not edit manually.

When adding features, follow Nuxt conventions (`app/pages`, `app/components`, `app/composables`) so filesystem routing and auto-imports remain predictable.

## Build, Test, and Development Commands
Use the package manager already present in the repo (`pnpm` is recommended because `pnpm-lock.yaml` is tracked).

- `pnpm install`: install dependencies.
- `pnpm dev`: run local dev server at `http://localhost:3000`.
- `pnpm build`: create production build.
- `pnpm preview`: preview the production build locally.
- `pnpm generate`: generate static output.

There is currently no dedicated lint or test script in `package.json`.

## Coding Style & Naming Conventions
Match existing Nuxt/Vue style in the repository:

- Use Vue Single File Components and TypeScript-friendly ES modules.
- Use 2-space indentation and no trailing semicolons in TS config files.
- Keep configuration in `nuxt.config.ts`; avoid scattering framework setup.
- Prefer descriptive, feature-based names (for example `DashboardHeader.vue`, `useOrderFilters.ts`).
- Keep shared styling in `app/assets/css/main.css` or reusable components, not inline one-off patterns.

## Testing Guidelines
Automated tests are not set up yet. For new test infrastructure, prefer Vitest + `@nuxt/test-utils` and place specs under `tests/` or alongside components as `*.spec.ts`.

Until a test runner is added, validate changes by:

- Running `pnpm dev` and checking affected routes/components.
- Running `pnpm build` before opening a PR to catch integration issues.

## Commit & Pull Request Guidelines
Recent commits use short, imperative, lowercase subjects (for example, `add Tailwind CSS and Nuxt UI integration...`).

- Commit format: `<verb> <scope/change>` (example: `add dashboard sidebar layout`).
- Keep commits focused and atomic.
- PRs should include: purpose, key changes, manual verification steps, and screenshots for UI changes.
- Link related issues/tasks when available.
