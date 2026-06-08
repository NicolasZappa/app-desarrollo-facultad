# AGENTS.md

## Stack
NestJS 11 + TypeORM + SQLite (better-sqlite3) + JWT (passport-jwt) + bcrypt + class-validator.

## Env
`.env` requerido con `JWT_SECRET`, `BCRYPT_COST`, `JWT_EXPIRES_SEC`. Se carga en `src/main.ts` con `dotenv.config({ override: true })` **antes** de `NestFactory`. PORT default 3000.

## Comandos
- `npm run start:dev` — dev con watch
- `npm run lint` — ESLint con `--fix`
- `npm run format` — Prettier
- `npm test` — Jest (unit tests en `src/`, patrón `*.spec.ts`; actualmente **no hay**)
- `npm run test:e2e` — e2e tests (config: `test/jest-e2e.json`)

## DB
- SQLite con `synchronize: true` — entidades se sincronizan automáticamente.
- Archivo: `database.sqlite`
- Entidades: `Product`, `Category`, `UserEntity`
- Columna `passwordHash` en `UserEntity` tiene `select: false`; login usa `createQueryBuilder().addSelect(...)`.

## Auth
- `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(UserRole.ADMIN)` protege rutas.
- JWT usa `secret` de `JWT_SECRET`, expiry vía env (default 24h hardcodeado en AuthService).
- Payload JWT: `{ sub: user.id }`. Strategy devuelve `{ id, role, email }`.
- `RolesGuard` lee `req.user.role`. Decorador: `@Roles(...)`.

## Módulos
- `UsersModule` (Global) — repositorio vía token `USERS_REPOSITORY`, impl `TypeOrmUsersRepository`
- `ProductsModule` (Global) — depende de `CategoriesModule`
- `CategoriesModule` — repositorio vía token `CATEGORIES_REPOSITORY`
- `AuthModule` — exporta `JwtAuthGuard`, `RolesGuard`, `JwtModule`, `AuthService`

## API
- `POST /auth/login`, `/auth/register` — público
- `GET/POST /users`, `GET /users/:id` — solo `ADMIN`
- CRUD `/products`, `/categories` — público (sin auth)
- `PATCH /products/:id/stock` — reduce stock
- `GET /categories/:id/products` — productos por categoría
- Paginación in-memory via `paginate(items, page?, limit?)` (default 10, max 50)

## Notas
- `AGENTS.md` está en `.gitignore` — no se commitea.
- No hay CI, Docker, hooks, ni README.
- `ValidationPipe` global con `whitelist`, `forbidNonWhitelisted`, `transform`.
- `ProductsController` y `CategoriesController` no tienen guards de auth.
