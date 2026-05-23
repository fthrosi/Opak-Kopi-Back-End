# Opak Kopi Backend

Backend API for the Opak Kopi application. This service is built with Express, TypeScript, Prisma, MySQL, Socket.IO, Midtrans, Nodemailer, and cron jobs for payment and reservation status checks.

## Features

- Authentication, email verification, refresh tokens, and JWT-protected routes
- Menu, menu category, promo, table, reservation, order, review, feedback, report, dashboard, and payment APIs
- File uploads for products, promos, and profiles through the `uploads/` directory
- Socket.IO notification support
- Prisma-managed MySQL database schema and migrations
- Docker setup for backend, MySQL, and phpMyAdmin

## Tech Stack

- Node.js 20
- Express 5
- TypeScript with ES modules
- Prisma ORM
- MySQL 8.1
- Socket.IO
- Midtrans payment integration

## Project Structure

```text
src/
  api/                 Feature modules: route, controller, service, repository
  config/              Database, mailer, and Midtrans configuration
  lib/cron/            Scheduled payment and reservation jobs
  middleware/          Auth, upload, and request middleware
  socket/              Socket.IO setup and notification service
  types/               Shared TypeScript types
  server.ts            Express app entry point
prisma/
  schema.prisma        Database schema
  migrations/          Prisma migration history
uploads/               Runtime uploaded media
dist/                  Compiled JavaScript output
```

## Prerequisites

- Node.js 20 or newer
- MySQL 8 or Docker
- npm

## Environment Variables

Create a `.env` file in the project root. Do not commit it.

```env
DATABASE_URL="mysql://root:password@localhost:3306/opak_kopi"
PORT=3000
CLIENT_URL="http://localhost:5173"
BASE_URL="http://localhost:3000"
JWT_SECRET="change-this-secret"
EMAIL_USER="your-email@example.com"
EMAIL_PASS="your-email-password"
MIDTRANS_SERVER_KEY="your-midtrans-server-key"
MIDTRANS_CLIENT_KEY="your-midtrans-client-key"
MIDTRANS_IS_PRODUCTION="false"
NODE_ENV="development"
```

## Installation

```bash
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

## Development

```bash
npm run dev
```

The development server runs from `src/server.ts` with `nodemon`. By default, the API is available at `http://localhost:3000`.

## Build and Production Run

```bash
npm run build
npm start
```

`npm run build` compiles TypeScript into `dist/`, and `npm start` runs `dist/server.js`.

## Docker

Run the backend, MySQL, and phpMyAdmin:

```bash
docker compose up --build
```

Services:

- Backend: `http://localhost:3000`
- MySQL: `localhost:3306`
- phpMyAdmin: `http://localhost:8080`

The Docker container waits for MySQL, runs `prisma migrate deploy`, attempts the seed script, then starts the compiled server.

## API Routes

Main route prefixes registered by `src/server.ts`:

- `/auth`
- `/user`
- `/menu-categories`
- `/menus`
- `/promos`
- `/feedbacks`
- `/reservations`
- `/orders`
- `/reports`
- `/tables`
- `/reviews`
- `/dashboard`
- `/payment`
- `/uploads`

The root route `/` returns a welcome JSON response.

## Testing

No test runner is configured yet. The current `npm test` script is a placeholder and exits with an error. For now, validate changes with:

```bash
npm run build
```

Then run targeted manual checks against the affected API routes.

## Notes for Contributors

- Keep source changes in `src/`; do not edit generated files in `dist/`.
- Use explicit `.js` extensions in relative TypeScript imports because the project uses NodeNext modules.
- Keep secrets in `.env`.
- Review `AGENTS.md` for contributor conventions before making larger changes.
