# IRO API

Built on the [tsc-server-boilerplate](https://github.com/getMonirr/tsc-server-boilerplate) structure:
Express 4 · TypeScript · MongoDB (Mongoose) · Zod · JWT (access + rotating refresh) · Pino · Jest

## Quick start
```bash
yarn install            # or npm install
cp .env.example .env    # set DATABASE_URL, and two different JWT secrets: openssl rand -hex 48
yarn start:dev          # http://localhost:5000
```
On first start the server creates the **super admin** (`SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD`) and loads the default
Bangla + English website content into empty collections. `yarn seed:reset` wipes and reloads all content (users untouched).
Docker: `docker compose up --build`.

## Structure (same conventions as the boilerplate)
```
src/
  app.ts · server.ts
  app/
    builder/QueryBuilder.ts      search / whitelisted filter / sort / pagination for every list endpoint
    config/index.ts              env mapping (+ assertConfig(): fail fast on missing or weak secrets)
    DB/                          seedSuperAdmin, seedContent, seed.ts (CLI), seed-data.json
    errors/ · interface/ · utils/        AppError, error handlers, catchAsync, sendResponse, logger
    helpers/                     jwtHelpers, revalidate (refresh the website cache after content changes)
    middlewares/                 authGuard, validateRequest, globalErrorHandler, notFoundAPIHandler,
                                 rateLimit, requestLogger
    shared/                      constant.ts (roles, rank, ACCESS matrix), bilingual.ts (bn/en schema helpers)
    modules/<Module>/<module>.{constant,interface,model,validation,service,controller,route,utils,test}.ts
      Auth  User  Program  ListItem  Setting  JoinRequest  AuditLog  Public
    routes/index.ts              moduleRoutes registry
```
New module: copy any module folder, then add `{ path, route }` to `routes/index.ts`.

## Roles (`shared/constant.ts` → `ACCESS`)
| Role | Can |
|---|---|
| `superAdmin` | everything (created only by the seed) |
| `admin` | everything, but only manages users ranked below them |
| `editor` | read/create/edit content, read/update join requests. Cannot delete, edit settings or manage users |
| `member` | no dashboard access (reserved for future member features) |

Use on routes: `authGuard(...ACCESS.CONTENT_WRITE)`. Nobody can create, edit or delete a user of equal or higher rank,
or change their own role/status. The role is read from the database on every request, so changes apply immediately.

## Auth
- `POST /auth/login` → `accessToken` (15m, send as `Authorization: Bearer …`) + httpOnly `refreshToken` cookie (7d)
- `POST /auth/refresh-token` rotates the refresh token. Re-using an old one revokes all sessions of that user.
- 5 wrong passwords → 15 minute lock · login rate limit · bcrypt · password change/reset ends all sessions

## API (`/api/v1`) — responses `{ success, message, meta?, data }`; errors `{ success:false, message, errorMessage, errorDetails }`
| Path | Methods | Access |
|---|---|---|
| `/public/content?lang=bn\|en` | GET | public: the whole website in one call |
| `/join-requests` | POST | public (5 per hour per IP) |
| `/auth/login` `/refresh-token` `/logout` | POST | public |
| `/auth/me` · `/auth/change-password` | GET · POST | any logged-in user |
| `/programs` `/items` `/:id` | GET POST PATCH DELETE | read/write: editor+ · delete: admin+ |
| `/settings` · `/settings/:key` (site, nav, ui) | GET · PUT | read: editor+ · write: admin+ |
| `/join-requests` `/:id` | GET PATCH DELETE | read/update: editor+ · delete: admin+ |
| `/users` `/:id` | GET POST PATCH DELETE | admin+ (soft delete) |
| `/audit-logs` | GET | admin+ |

Lists accept `?page=&limit=&sort=&searchTerm=` plus the module's filters (e.g. `/items?group=stat`, `/join-requests?status=new`).
Health: `/health`, `/health/ready`.

## Logging and audit
Pino JSON logs (pretty in development) with `x-request-id`; authorization, cookies and passwords are redacted. Every admin
create/update/delete and login is saved to `AuditLog` (who, what, when, IP) and auto-deleted after a year.

## Changes compared with the boilerplate
- `authGuard`: accepts `Bearer <token>`, reads the role from the DB, returns 403 for a wrong role (401 only for auth problems)
- `validateRequest`: also validates `query`/`params` and writes the parsed body back, so unknown fields are dropped
- `globalErrorHandler`: keeps `AppError` messages on 401, maps JWT / bad-JSON errors, unknown errors are 500 and logged
- user model hashes the password only when it changed (the original re-hashed on every save)
- `config`: fixed `path.join` and added `assertConfig()`; `.env.example` has no real-looking secrets and a 15m/7d token lifetime
- `babel.config.js` uses `module.exports` (the ESM `export` failed under Jest)
- no `yarn.lock` is included: run `yarn install` once to create it
