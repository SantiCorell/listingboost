/**
 * Crea en Stripe (test o live según STRIPE_SECRET_KEY) productos y precios alineados con lib/plans.ts.
 *
 * Uso:
 *   npm run stripe:seed
 *   npm run stripe:seed:write   → imprime IDs y actualiza STRIPE_PRICE_ID_* en .env.local
 *
 * Montos (EUR): Pro 15/mes, Pro+ 30/mes, Enterprise 100/mes.
 * Créditos extra (debe coincidir con lib/plans.ts EXTRA_CREDIT_UNIT_AMOUNT_CENTS_EUR):
 *   Free 1,00 · Pro 0,70 · Pro+ 0,50 · Enterprise 0,50 €/crédito.
 *   Packs con descuento (solo Free) usan price_data en checkout, no estos IDs.
 */
/* eslint-disable @typescript-eslint/no-require-imports, no-console */
const fs = require("fs");
const path = require("path");
const Stripe = require("stripe");

const API_VERSION = "2025-02-24.acacia";
const ROOT = path.join(__dirname, "..");
const ENV_LOCAL = path.join(ROOT, ".env.local");

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

function productSuffix(mode) {
  return mode === "test" ? " (test)" : "";
}

async function findOrCreatePrice(stripe, { productName, unitAmount, recurring }) {
  const products = await stripe.products.list({ limit: 100, active: true });
  let product = products.data.find((p) => p.name === productName);
  if (!product) {
    product = await stripe.products.create({ name: productName });
  }
  const prices = await stripe.prices.list({ product: product.id, limit: 100, active: true });
  const match = prices.data.find((pr) => {
    if (recurring) {
      return (
        pr.type === "recurring" &&
        pr.recurring?.interval === "month" &&
        pr.unit_amount === unitAmount &&
        pr.currency === "eur"
      );
    }
    return pr.type === "one_time" && pr.unit_amount === unitAmount && pr.currency === "eur";
  });
  if (match) return match.id;
  const created = await stripe.prices.create({
    product: product.id,
    unit_amount: unitAmount,
    currency: "eur",
    ...(recurring ? { recurring: { interval: "month", interval_count: 1 } } : {}),
  });
  return created.id;
}

function writePriceIdsToEnvLocal(ids) {
  if (!fs.existsSync(ENV_LOCAL)) {
    console.error("No existe .env.local; créalo o copia desde .env.example.");
    process.exit(1);
  }
  let text = fs.readFileSync(ENV_LOCAL, "utf8");
  const lines = text.split(/\n/);
  const keys = Object.keys(ids);
  const seen = new Set();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(/^(STRIPE_PRICE_ID_[A-Z0-9_]+)=(.*)$/);
    if (m && ids[m[1]] !== undefined) {
      lines[i] = `${m[1]}=${ids[m[1]]}`;
      seen.add(m[1]);
    }
  }

  const toAppend = keys.filter((k) => !seen.has(k)).map((k) => `${k}=${ids[k]}`);
  let out = lines.join("\n");
  if (toAppend.length) {
    if (!out.endsWith("\n")) out += "\n";
    out += toAppend.join("\n") + "\n";
  }
  fs.writeFileSync(ENV_LOCAL, out, "utf8");
  console.log("\nActualizado .env.local con STRIPE_PRICE_ID_*.\n");
}

async function main() {
  loadEnvLocal();
  const writeEnv = process.argv.includes("--write-env-local");
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !key.startsWith("sk_")) {
    console.error("Falta STRIPE_SECRET_KEY (sk_test_… o sk_live_…) en .env.local");
    process.exit(1);
  }

  const mode = stripeMode(key);
  if (mode === "unknown") {
    console.error("STRIPE_SECRET_KEY debe empezar por sk_test_ o sk_live_");
    process.exit(1);
  }

  if (mode === "live") {
    console.warn(
      "\n⚠️  Modo LIVE: se crearán (o reutilizarán) precios reales en tu cuenta Stripe.\n",
    );
  }

  const stripe = new Stripe(key, { apiVersion: API_VERSION });
  const s = productSuffix(mode);

  const pro = await findOrCreatePrice(stripe, {
    productName: `ListingBoost — Pro${s}`,
    unitAmount: 1500,
    recurring: true,
  });
  const proPlus = await findOrCreatePrice(stripe, {
    productName: `ListingBoost — Pro+${s}`,
    unitAmount: 3000,
    recurring: true,
  });
  const enterprise = await findOrCreatePrice(stripe, {
    productName: `ListingBoost — Enterprise${s}`,
    unitAmount: 10000,
    recurring: true,
  });

  const creditFree = await findOrCreatePrice(stripe, {
    productName: `ListingBoost — Crédito extra (plan Free · 1,00 €/ud)${s}`,
    unitAmount: 100,
    recurring: false,
  });
  const creditPro = await findOrCreatePrice(stripe, {
    productName: `ListingBoost — Crédito extra (plan Pro · 0,70 €/ud)${s}`,
    unitAmount: 70,
    recurring: false,
  });
  const creditProPlus = await findOrCreatePrice(stripe, {
    productName: `ListingBoost — Crédito extra (plan Pro+ · 0,50 €/ud)${s}`,
    unitAmount: 50,
    recurring: false,
  });
  const creditEnterprise = await findOrCreatePrice(stripe, {
    productName: `ListingBoost — Crédito extra (plan Enterprise · 0,50 €/ud)${s}`,
    unitAmount: 50,
    recurring: false,
  });

  const ids = {
    STRIPE_PRICE_ID_PRO: pro,
    STRIPE_PRICE_ID_PRO_PLUS: proPlus,
    STRIPE_PRICE_ID_ENTERPRISE: enterprise,
    STRIPE_PRICE_ID_CREDIT_FREE: creditFree,
    STRIPE_PRICE_ID_CREDIT_PRO: creditPro,
    STRIPE_PRICE_ID_CREDIT_PRO_PLUS: creditProPlus,
    STRIPE_PRICE_ID_CREDIT_ENTERPRISE: creditEnterprise,
  };

  console.log("\nCopia estas líneas a .env.local (modo " + mode + "):\n");
  for (const [k, v] of Object.entries(ids)) {
    console.log(`${k}=${v}`);
  }
  console.log(
    "\nWebhook:\n" +
      "  · Test local: stripe listen --forward-to localhost:3000/api/webhooks/stripe → whsec_…\n" +
      "  · Producción: Dashboard Stripe (modo Live) → Webhooks → endpoint → signing secret\n",
  );

  if (writeEnv) {
    writePriceIdsToEnvLocal(ids);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
