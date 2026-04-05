# ListingBoost — arquitectura de producto (SEO Growth Engine)

## Bucle de valor

Analizar → Mejorar → Medir → repetir. El scan URL es la entrada; créditos y planes gobiernan el volumen.

## Estructura de carpetas (núcleo)

| Ruta | Rol |
|------|-----|
| `app/api/seo/*` | Generación: quick-fix, contenido, blog, competidor |
| `app/api/monitoring` | CRUD seguimiento SERP (Pro+) |
| `app/api/cron/seo-monitoring` | Cron diario (Vercel) + `CRON_SECRET` |
| `services/seo/` | Lógica LLM + crawls reutilizando `fetchAndParseUrl` |
| `lib/serp/google-rank.ts` | Posición orgánica opcional (`SERPAPI_API_KEY`) |
| `lib/plan-features.ts` | Gates por plan |
| `lib/feature-credits.ts` | Costes en créditos por feature |
| `components/seo/seo-engine-workbench.tsx` | UI hub `/dashboard/seo-engine` |

## Coste orientativo por feature (créditos)

| Feature | Créditos | Notas |
|---------|---------|--------|
| Quick-fix 1‑clic | 2 | Desde issue de un scan |
| Contenido blog | 4 | |
| Contenido producto | 3 | |
| Blog optimizer | 4 | |
| Competidor (2 URLs) | 5 | Plan de pago |
| Scan URL | 2–5 | Según preset (existente) |
| Monitoring | 0/run | Incluido en suscripción Pro+; sin SerpAPI solo guarda intentos |

## Variables nuevas

- `SERPAPI_API_KEY` — rankings automáticos en monitoring.
- `CRON_SECRET` — protege `GET /api/cron/seo-monitoring` (Bearer).

## Roadmap 2–4 semanas (siguiente iteración)

1. Colas asíncronas para jobs largos + emails de alerta (“caíste 3 posiciones”).
2. Integración DataForSEO alternativa a SerpAPI.
3. Historial UI para `ContentGeneration` / `BlogOptimization` en dashboard.
4. API pública rate-limited para agencias (Enterprise).

## Precios mostrados en app

Pro **29 €/mes**, Pro+ **79 €/mes**; cupos por defecto **200** y **750** análisis/mes (`lib/plans.ts` + `stripe-seed-catalog.cjs`). Tras cambiar Stripe, ejecutar seed y actualizar `STRIPE_PRICE_ID_*` en Vercel.
