# ListingBoost

SaaS **listing intelligence**: **boost multicanal** de fichas (Wallapop, eBay, Shopify, ecommerce genérico) y **scan SEO de URL** con crawler ligero, scoring heurístico y recomendaciones vía **DeepSeek**. Stack: **Next.js 15 (App Router)**, **TypeScript**, **Tailwind**, **shadcn-style UI**, **Prisma**, **PostgreSQL**, **Auth.js (NextAuth v5)** (email/contraseña + Google opcional), **Stripe**, **UploadThing**, **Zod**, **React Hook Form**, **Cheerio**.

## Requisitos

- Node.js 20+
- PostgreSQL 14+
- Cuenta [DeepSeek](https://platform.deepseek.com/) API
- (Opcional) [UploadThing](https://uploadthing.com/) para subida de imágenes
- (Opcional) [Stripe](https://stripe.com/) para plan Pro

## Git y Vercel (despliegues bloqueados por el autor)

Si Vercel muestra *“The commit author does not have contributing access”*, no es un fallo del código: **el email del autor del commit** debe coincidir con una cuenta que Vercel/GitHub reconozca.

1. En GitHub → **Settings → Emails**, mira qué direcciones están **verificadas** (o usa el formato `noreply` de GitHub).
2. En tu máquina, alinea Git con esa misma dirección (los commits de este repo deben hacerse **tú** desde tu ordenador):

```bash
git config user.name "Tu nombre público en GitHub"
git config user.email "el-mismo-email-verificado-en-github@..."
```

3. **Plan Hobby**: solo el **dueño** del proyecto/team en Vercel suele poder desplegar desde un repo privado colaborativo; si hace falta, invita al autor del commit en Vercel o usa el email de la cuenta dueña.
4. Evita que otra herramienta (CI, otro PC) haga `git push` con un `user.email` distinto al de tu cuenta de GitHub conectada a Vercel.

Si ya subiste commits con un email “equivocado”, puedes corregir **solo el último** (y luego `git push --force-with-lease` si eres el único en `main`) con `git commit --amend --reset-author --no-edit` tras ajustar `user.email`.

## Instalación

```bash
cp .env.example .env
# Rellena variables (mínimo DATABASE_URL, AUTH_SECRET, DEEPSEEK_API_KEY)

npm install
XDG_CACHE_HOME=.xdg-cache npx prisma generate   # si Prisma no puede escribir en ~/.cache
npx prisma db push
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Regístrate, entra al dashboard y ejecuta un análisis.

### Si ves 500, ENOENT en `routes-manifest`, `_buildManifest.js.tmp`, `app-build-manifest.json` o `*.pack.gz`

Suele ser **caché de Next/Turbopack corrupta** (macOS + iCloud/antivirus en Escritorio, o **dos terminales** con `npm run dev` a la vez). **Para el servidor** (`Ctrl+C`), luego:

```bash
npm run dev:clean
```

Eso borra `.next`, `.turbo` y `node_modules/.cache` y arranca **Turbopack**. Si sigue fallando: `npm run dev:clean:webpack` (webpack sin caché persistente en `next.config`).

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Desarrollo con **Turbopack** (por defecto; más estable en local) |
| `npm run dev:webpack` | Desarrollo con webpack (caché persistente desactivada en `next.config`) |
| `npm run dev:clean` | Limpia cachés y arranca Turbopack |
| `npm run dev:clean:webpack` | Limpia cachés y arranca webpack |
| `npm run clean` | Borra `.next` y `node_modules/.cache` |
| `npm run build` | Build de producción |
| `npm run start` | Servidor tras `build` |
| `npm run lint` | ESLint |
| `npm run db:generate` | Genera cliente Prisma |
| `npm run db:push` | Sincroniza schema con la DB (MVP) |
| `npm run db:migrate` | Migraciones formales (`prisma migrate dev`) |
| `npm run db:studio` | Prisma Studio |

## Planes y créditos extra

| Plan | Precio | Incluidos/mes (defecto) | Crédito extra |
|------|--------|-------------------------|---------------|
| Free | 0 € | 5 | 1,00 € |
| Pro | 29 € | 200 | 0,70 € |
| Pro+ | 79 € | 750 | 0,50 € |
| Enterprise | A medida / Stripe | 500 | 0,50 € |

Los números incluidos calibran margen frente al coste típico de API; ajústalos con variables `*_MONTHLY_ANALYSES` en `.env`. Los créditos extra se acumulan en `bonusCreditsRemaining` y no se resetean al cambiar de mes.

Tras cambiar el enum `Plan` en Prisma: `npx prisma db push` (o migración).

## Sesión e inactividad

Por defecto la sesión (JWT) **caduca tras 15 minutos sin ninguna petición** que valide la cookie. Cada navegación o llamada a `/api/auth/session` **renueva** ese plazo. Puedes cambiar el valor con `AUTH_SESSION_MAX_AGE_SECONDS` (ver `.env.example`).

## Variables de entorno

Copia de `.env.example`:

- **NEXT_PUBLIC_APP_URL** — URL pública (metadata, redirects Stripe).
- **DATABASE_URL** — PostgreSQL.
- **AUTH_SECRET** — Secreto firmado JWT (genera uno largo).
- **AUTH_URL** — Misma base que la app; en prod debe coincidir con el dominio.
- **DEEPSEEK_API_KEY** — Obligatorio para IA.
- **DEEPSEEK_VISION_MODEL** — Opcional; si el proveedor expone modelo con visión y lo configuras, se intenta multimodal antes de caer a texto + URL de imagen.
- **UPLOADTHING_TOKEN** — Subida de imágenes (token completo desde el dashboard de UploadThing). Sin esto, el formulario de producto sigue funcionando solo con texto.
- **STRIPE_SECRET_KEY**, **STRIPE_WEBHOOK_SECRET**, **STRIPE_PRICE_ID_PRO** — Suscripción Pro (checkout en `/api/stripe/checkout`, webhook en `/api/webhooks/stripe`).
- **FREE_MONTHLY_ANALYSES**, **PRO_MONTHLY_ANALYSES**, **FREE_HISTORY_LIMIT** — Opcionales (valores por defecto en `lib/constants.ts`).

### Stripe

1. Crea un precio recurrente (Product + Price) y copia el **Price ID** a `STRIPE_PRICE_ID_PRO`.
2. Añade endpoint webhook a `https://TU_DOMINIO/api/webhooks/stripe` con eventos como `checkout.session.completed` y `customer.subscription.deleted`.
3. Copia el **Signing secret** a `STRIPE_WEBHOOK_SECRET`.

Tras un pago exitoso, el webhook actualiza el plan en base de datos. El **JWT de sesión** puede seguir mostrando el plan anterior hasta que vuelvas a iniciar sesión (las páginas del dashboard leen el plan desde Prisma cuando hace falta).

### Prisma y caché local

En algunos entornos `prisma generate` falla al escribir en `~/.cache`. Puedes usar:

```bash
XDG_CACHE_HOME=$(pwd)/.xdg-cache npx prisma generate
```

## Arquitectura de carpetas

| Ruta | Rol |
|------|-----|
| `app/` | Rutas App Router, API routes, layouts, SEO (`sitemap`, `robots`) |
| `components/` | UI reutilizable (`ui/` estilo shadcn, layout, producto, URL, auth) |
| `lib/` | Utilidades (`prisma`, `usage`, `seo/score-url`, `auth/`) |
| `actions/` | Server Actions (producto, registro) |
| `services/url/` | Fetch + parse HTML (`crawler.ts`) |
| `services/llm/` | Cliente DeepSeek con timeout, logs, fallback visión |
| `services/stripe/` | Cliente Stripe |
| `prompts/` | Prompts versionados para producto y auditoría |
| `types/` | Tipos Zod / TS para salidas JSON |
| `prisma/` | Schema y migraciones |

### Flujo SEO producto

1. Formulario (RHF + Zod) → `actions/product-seo.ts`.
2. Límites (`lib/usage.ts`) + opcional imagen (UploadThing).
3. `prompts/product-seo.ts` + `deepseekChatJsonWithVisionFallback`.
4. Validación `types/product-analysis.ts` → persistencia `ProductAnalysis`.

### Flujo auditoría URL

1. `fetchAndParseUrl` (Cheerio) → resumen estructurado.
2. `scoreUrlAudit` (`lib/seo/score-url.ts`) → scores e issues.
3. `prompts/url-audit.ts` → DeepSeek devuelve JSON (`types/url-audit.ts`).
4. Fusión en `outputJson` → `UrlAudit`.

### Autenticación y Edge

`auth.config.ts` es **Edge-safe** (sin Prisma/bcrypt). El proveedor de credenciales vive en `lib/auth/credentials-provider.ts` y solo se carga en `auth.ts` (Node). El **middleware** instancia Auth.js con `providers: []` y el mismo `AUTH_SECRET` para verificar JWT sin arrastrar bcrypt al bundle Edge.

## Extensión futura del proveedor LLM

`services/llm/deepseek.ts` concentra HTTP y logging (`ApiLog`). Para OpenAI/Anthropic, añade un adaptador que implemente la misma firma (`chat JSON` + timeout) y sustituye la llamada en las actions.

## Roadmap (preparado en código y README)

- Extensión Chrome para auditar la página abierta.
- Shopify app / OAuth tienda.
- Análisis masivo de catálogo (colas + workers).
- Generación masiva de títulos y plantillas por vertical.
- Auditorías programadas y alertas email.
- Benchmark vs competidores (similitud SERP / precios si hay API).
- Integración real Google Search Console / Merchant Center.
- Proyectos guardados (`SavedProject` en schema) y analítica por proyecto.
- Export TXT/Markdown (arquitectura: mismo JSON → serializers).

## Licencia

Privado / uso según el propietario del repositorio.
