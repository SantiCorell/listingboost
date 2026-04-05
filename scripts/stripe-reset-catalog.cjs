/**
 * Archiva (desactiva) en Stripe todos los productos cuyo nombre contiene "ListingBoost"
 * y todos sus precios activos. Después ejecuta `npm run stripe:seed:write` para crear
 * productos/precios nuevos alineados con lib/plans.ts.
 *
 * NO borra objetos en Stripe (Stripe suele impedir borrar si hubo pagos); los archiva.
 *
 * Uso:
 *   npm run stripe:reset-catalog -- --dry-run          # solo lista qué haría
 *   npm run stripe:reset-catalog -- --confirm         # ejecuta (requiere STRIPE_SECRET_KEY en .env.local)
 *   npm run stripe:seed:write                         # recrear catálogo e IDs en .env.local
 *
 * En Vercel: copia los STRIPE_PRICE_ID_* nuevos y redeploy.
 */
/* eslint-disable @typescript-eslint/no-require-imports, no-console */
const Stripe = require("stripe");

const API_VERSION = "2025-02-24.acacia";

const fs = require("fs");
const path = require("path");
const ENV_LOCAL = path.join(__dirname, "..", ".env.local");

function loadEnvLocal() {
  if (!fs.existsSync(ENV_LOCAL)) return;
  const text = fs.readFileSync(ENV_LOCAL, "utf8");
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const m = t.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (process.env[m[1]] === undefined) process.env[m[1]] = v;
  }
}

function stripeMode(key) {
  if (key.startsWith("sk_live_")) return "live";
  if (key.startsWith("sk_test_")) return "test";
  return "unknown";
}

function matchesListingBoost(name) {
  return typeof name === "string" && name.toLowerCase().includes("listingboost");
}

async function listAllProducts(stripe) {
  const out = [];
  for (const active of [true, false]) {
    let startingAfter;
    let hasMore = true;
    while (hasMore) {
      const res = await stripe.products.list({
        limit: 100,
        active,
        starting_after: startingAfter,
      });
      out.push(...res.data);
      hasMore = res.has_more;
      startingAfter = res.data.length ? res.data[res.data.length - 1].id : undefined;
    }
  }
  return out;
}

async function archiveAllActivePrices(stripe, productId) {
  let startingAfter;
  let hasMore = true;
  let n = 0;
  while (hasMore) {
    const res = await stripe.prices.list({
      product: productId,
      limit: 100,
      active: true,
      starting_after: startingAfter,
    });
    for (const pr of res.data) {
      await stripe.prices.update(pr.id, { active: false });
      n++;
    }
    hasMore = res.has_more;
    startingAfter = res.data.length ? res.data[res.data.length - 1].id : undefined;
  }
  return n;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const confirm = process.argv.includes("--confirm");

  loadEnvLocal();
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !key.startsWith("sk_")) {
    console.error("Falta STRIPE_SECRET_KEY en .env.local");
    process.exit(1);
  }

  if (!dryRun && !confirm) {
    console.error(
      "Este script archiva productos ListingBoost en Stripe.\n" +
        "  Vista previa:  npm run stripe:reset-catalog -- --dry-run\n" +
        "  Ejecutar:      npm run stripe:reset-catalog -- --confirm\n" +
        "Luego: npm run stripe:seed:write y actualiza Vercel con los nuevos STRIPE_PRICE_ID_*.",
    );
    process.exit(1);
  }

  const mode = stripeMode(key);
  if (mode === "live" && !dryRun) {
    console.warn("\n⚠️  MODO LIVE: se archivarán productos/precios ListingBoost en la cuenta real.\n");
  }

  const stripe = new Stripe(key, { apiVersion: API_VERSION });
  const all = await listAllProducts(stripe);
  const targets = all.filter((p) => matchesListingBoost(p.name));

  if (targets.length === 0) {
    console.log("No hay productos con «ListingBoost» en el nombre.");
    process.exit(0);
  }

  console.log(
    dryRun ? `[dry-run] Se archivarían ${targets.length} producto(s):\n` : `Archivando ${targets.length} producto(s)…\n`,
  );

  for (const p of targets) {
    const label = `${p.id}  ${p.name}  (activo=${p.active})`;
    if (dryRun) {
      console.log(`  - ${label}`);
      continue;
    }
    const priceCount = await archiveAllActivePrices(stripe, p.id);
    if (p.active) {
      await stripe.products.update(p.id, { active: false });
    }
    console.log(`  ✓ ${p.name} — ${priceCount} precio(s) archivado(s), producto archivado.`);
  }

  if (dryRun) {
    console.log("\n[dry-run] Sin cambios. Quita --dry-run y usa --confirm para ejecutar.");
  } else {
    console.log(
      "\nListo. Ejecuta ahora:\n  npm run stripe:seed:write\ny copia STRIPE_PRICE_ID_* a Vercel (mismo modo test/live que la clave).",
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
