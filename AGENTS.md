# AGENTS.md

SvelteKit fullstack (frontend Y backend) para cotizadores de ventanas, desplegado en Cloudflare Pages + D1 (SQLite) con **Prisma** (`@prisma/adapter-d1`, driver adapter). Comentarios/errores/README en español. Se trabaja en la rama `update` (`origin` = fork Skyrdow, `client-repo` = upstream termoacusticos).

## Comandos (usa **bun** — no hay npm; node sí, ver gotchas)

- `bun install` — tras actualizar dependencias: `bunx prisma generate` (el cliente NO está en repo; sin generate nada compila)
- Verificación: `bun run format` → `bun run lint` → `bun run check`
- Dev local con DB: `bun run devw` (= `vite build` con adapter-cloudflare + `wrangler pages dev .svelte-kit/cloudflare`)
- Dev sólo UI: `bun run dev` (sin DB, ver gotchas)
- Tests: `bun run test` corre Vitest; la calculadora tiene una prueba unitaria que simula los repositorios.

### Migraciones / base de datos (Prisma + wrangler d1 migrations)

- Schema: `prisma/schema.prisma` → SQL: `migrations/0001_create_tables.sql` (tablas PascalCase: `"Usuario"`, `"Presupuesto"`, ...)
  - regenerar tras tocar schema: `bunx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/0001_create_tables.sql`
  - aplicar: `bunx wrangler d1 migrations apply pingeso-demo --local` (o `--remote`; wrangler ya está logueado). El README dice `termoacusticos-db` — **ese nombre no existe en esta cuenta**, usar `pingeso-demo` (id en `wrangler.toml`)
  - seed: `bunx wrangler d1 execute pingeso-demo --local|--remote --file src/lib/sql/insert.sql` (perfiles, tipos, materiales, constantes, etc.)
  - reset completo: `src/lib/sql/tabla.sql` (DROP de todo); borrar una tabla vieja a mano si choca — SQLite es case-insensitive: `"Usuario"` y `usuario` son la MISMA tabla
- wrangler.toml está gitignored; los valores TOML van **entrecomillados** (`database_name = "pingeso-demo"`) — sin comillas wrangler muere en el parseo.

## Gotchas de entorno (verificados)

- **wrangler debe correr bajo Node, nunca bajo bun**: con wrangler bajo runtime de bun, workerd acepta el socket pero **ninguna petición responde** (ni estática). Node está en `~/.local/node/bin` + symlink en `~/.bun/bin` (siempre en PATH); `bun run`/`bunx` respetan el shebang `env node`. No borrar esos enlaces.
- **`JWT_SECRET` es obligatorio**: `$env/static/private` (`src/lib/index.ts`, `api/login`) — sin él build/dev fallan con `"JWT_SECRET" is not exported`. Vive en `.env` (gitignored, no hay `.env.example` ni lo documenta el README).
- **`bun run dev` no tiene DB**: `platform` es `undefined` → `getDB()` retorna `err` → todo `/api/*` responde 400 `falló la conexión con la db`. Con `devw` (wrangler) sí funciona — todo el flujo de auth/DB probarlo con `devw`.
- `bun run lint`, `bun run check` y `bun run build` pasan actualmente. `lint` = `prettier --check . && eslint .`; usa `bun run format` para corregir formato.
- No hay CI ni pre-commit (no existe `.github/`).

- ESLint debe ignorar `.wrangler/`: Wrangler genera ahí código que no pertenece al proyecto y dispara miles de errores espurios.

## Auth / arquitectura

- **Cookie `authToken`** (httpOnly, 1h): la emite `POST /api/login`, la borra `DELETE /api/login` (logout). `src/hooks.server.ts` la lee y setea `locals.session` (`JWTBody` en `src/lib/types.d.ts`). Las rutas `/api/*` **también** validan a mano: `cookies.get('authToken')` → `validateJWT(token)` → 401. **`validateJWT` recibe el token crudo de la cookie, sin prefijo `Bearer`** (ya no hace `substring(7)`).
- **`getDB(platform)` devuelve un `PrismaClient`** (no una `D1Database`): lo crea con `PrismaD1(platform.env.DB)` y lo cuelga del export mutable `prisma` de `$lib`. **Orden obligatorio**: toda ruta llama primero `getDB(platform)` (si falla, 400) y DESPUÉS los repositories — éstos importan `prisma` de `$lib` y truena si nadie lo inicializó.
- Repositories (`src/lib/repositories/*.ts`): queries Prisma (`prisma.usuario.findFirst(...)`) que devuelven `Result` de **neverthrow** (`ok`/`err`), nunca throw; SELECTs chequean fila adentro, mutations devuelven ok/err para el caller.
- Tipos de modelos: `import type { Usuario, Presupuesto } from '@prisma/client'` (generado). Tipos auxiliares (JWTBody, PresupuestoModel, VentanaModel) son ambient en `src/lib/types.d.ts` — sin import. **No existe `entidades.d.ts`**.
- Lógica de negocio: `src/lib/services/` — `calculadora.ts` (evalúa fórmulas del catálogo con `mathjs.evaluate`, ojo: fórmulas de la DB son código), `pdf_generator.ts` (pdf-lib + fontkit). Stores de Svelte en `src/lib/store.ts`.
- `/api/*` sólo para datos con interacción de usuario; pre-carga de vistas en `+page.server.ts` / `+page.ts` (convención README). Home tiene secciones: `cotizar`, `historial`, `configurar`, `modificar`.
- Iconos: plugin `@iconify/tailwind` (`<span class="iconify mdi--account-alert-outline">`); set nuevo: `bun add -D @iconify-json/<set>` + `addIconSelectors([...])` en `tailwind.config.js`.
- README: útil pero parcialmente desactualizado (comandos en npx/npm → equivalentes bun; `termoacusticos-db` no existe). Ante conflicto, manda el código.
