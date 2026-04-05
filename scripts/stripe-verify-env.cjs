/**
 * Comprueba que cada STRIPE_PRICE_ID_* del entorno apunta a un Price con el importe esperado (misma fuente que lib/plans.ts + stripe-seed-catalog.cjs).
 *
 * Uso: npm run stripe:verify
 * Requiere STRIPE_SECRET_KEY en .env.local (mismo modo test/live que los Price IDs).
 */
/* eslint-disable no-console */
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

/** Céntimos EUR esperados (one_time o recurring/mes). */
const EXPECTED = {
  STRIPE_PRICE_ID_PRO: { unit: 2900, recurring: true },
  STRIPE_PRICE_ID_PRO_PLUS: { unit: 7900, recurring: true },
  STRIPE_PRICE_ID_ENTERPRISE: { unit: 10000, recurring: true },
  STRIPE_PRICE_ID_CREDIT_FREE: { unit: 100, recurring: false },
  STRIPE_PRICE_ID_CREDIT_PRO: { unit: 70, recurring: false },
  STRIPE_PRICE_ID_CREDIT_PRO_PLUS: { unit: 50, recurring: false },
  STRIPE_PRICE_ID_CREDIT_ENTERPRISE: { unit: 50, recurring: false },
};

async function main() {
  loadEnvLocal();
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !key.startsWith("sk_")) {
    console.error("Falta STRIPE_SECRET_KEY en .env.local");
    process.exit(1);
  }

  const stripe = new Stripe(key, { apiVersion: API_VERSION });
  let errors = 0;

  for (const [envKey, exp] of Object.entries(EXPECTED)) {
    const priceId = process.env[envKey]?.trim();
    if (!priceId) {
      console.error(`✗ ${envKey}: vacío`);
      errors++;
      continue;
    }
    try {
      const pr = await stripe.prices.retrieve(priceId);
      const isRecurring = pr.type === "recurring";
      const unit = pr.unit_amount;
      if (isRecurring !== exp.recurring) {
        console.error(
          `✗ ${envKey}: tipo distinto (Stripe ${isRecurring ? "recurring" : "one_time"}, esperado ${exp.recurring ? "recurring" : "one_time"})`,
        );
        errors++;
        continue;
      }
      if (unit !== exp.unit) {
        console.error(
          `✗ ${envKey}: ${priceId} → ${unit} céntimos (esperado ${exp.unit}). Copia el Price correcto desde el producto «Crédito extra» / suscripción en Stripe o ejecuta npm run stripe:seed:write.`,
        );
        errors++;
        continue;
      }
      if (exp.recurring && pr.recurring?.interval !== "month") {
        console.error(`✗ ${envKey}: intervalo debe ser month`);
        errors++;
        continue;
      }
      const product =
        typeof pr.product === "string"
          ? await stripe.products.retrieve(pr.product)
          : pr.product;
      const pname = product?.name ?? "?";
      console.log(`✓ ${envKey}: ${unit} céntimos · ${pname}`);
    } catch (e) {
      console.error(`✗ ${envKey}:`, e.message ?? e);
      errors++;
    }
  }

  if (errors > 0) {
    console.error(
      `\nCorrige Vercel (Environment Variables) con los mismos Price IDs que en Stripe modo Live, o ejecuta:\n  npm run stripe:seed:write\ny copia las líneas STRIPE_PRICE_ID_* a producción.\n`,
    );
    process.exit(1);
  }
  console.log("\nTodos los precios coinciden con la app.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
