# Repository Guidelines

## Project Structure & Module Organization

This is a TypeScript Express backend for Opak Kopi. Source code lives in `src/`; compiled JavaScript is emitted to `dist/`. API features are under `src/api/<feature>/` with `*.route.ts`, `*.controller.ts`, `*.service.ts`, and `*.repository.ts` where applicable. Shared middleware is in `src/middleware/`, configuration in `src/config/`, Socket.IO code in `src/socket/`, cron jobs in `src/lib/cron/`, and shared types in `src/types/`. Prisma schema and migrations live in `prisma/`. Uploaded files are stored under `uploads/` and served from `/uploads`.

## Build, Test, and Development Commands

- `npm install`: install dependencies.
- `npm run dev`: run the API from `src/server.ts` with `nodemon` and the `ts-node` ESM loader.
- `npm run build`: compile TypeScript into `dist/` using `tsc`.
- `npm start`: run the compiled server from `dist/server.js`.
- `npx prisma migrate dev`: apply migrations and regenerate the Prisma client.
- `npx prisma db seed`: run the configured seed script, `src/seed.ts`.

The current `npm test` script is a placeholder and exits with an error.

## Coding Style & Naming Conventions

Use TypeScript with ES modules and explicit `.js` extensions in relative imports, matching NodeNext. Keep strict type checking clean. Follow the existing feature structure: routes define endpoints, controllers handle HTTP concerns, services hold business logic, and repositories isolate database access. Use PascalCase for classes such as `MenuController`, camelCase for variables and methods, and lowercase feature folders; preserve existing underscore names such as `menu_categories`. Prefer two-space indentation and concise error responses consistent with nearby controllers.

## Testing Guidelines

No test framework is currently configured. For any new setup, prefer focused integration tests around routes/services and keep fixtures close to the tested feature. Name tests after the unit under test, for example `menu.service.test.ts`. Until a runner is added, verify changes with `npm run build` and targeted manual API checks.

## Commit & Pull Request Guidelines

Recent history uses short, informal commit subjects such as `fixing Report menu` and `fixing bug deploy`. Keep commits brief but more specific when possible, for example `fix order status cron update`. Pull requests should include a summary, affected endpoints or modules, migration notes, environment variable changes, and manual verification steps. Include screenshots or request/response examples when behavior changes are visible to clients.

## Security & Configuration Tips

Keep `.env` out of version control. Required runtime values include database, CORS, authentication, mailer, and Midtrans settings used by `src/config/`. Do not commit generated secrets, production uploads, or local Prisma client output.
