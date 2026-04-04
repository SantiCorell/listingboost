/**
 * Prueba qué host aws-0|aws-1-REGION.pooler.supabase.com acepta tu usuario postgres.PROJECT_REF.
 * Uso: npm run db:discover-pooler
 * Si ves "password authentication" o "SELECT 1", esa región es la buena → úsala en DATABASE_URL.
 */
/* eslint-disable @typescript-eslint/no-require-imports, no-console */
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

function loadEnvLocal() {
  const p = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(p)) return;
  const text = fs.readFileSync(p, "utf8");
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

function parseDatabaseUrl(url) {
  try {
    const u = new URL(url.replace(/^postgresql:/, "http:"));
    const user = decodeURIComponent(u.username);
    const pass = decodeURIComponent(u.password);
    const host = u.hostname;
    let ref = null;
    const mDb = host.match(/^db\.([a-z0-9]+)\.supabase\.co$/i);
    if (mDb) ref = mDb[1];
    const mPu = user.match(/^postgres\.([a-z0-9]+)$/i);
    if (mPu) ref = mPu[1];
    return { user, pass, ref, host };
  } catch {
    return null;
  }
}

const REGIONS = [
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "ca-central-1",
  "eu-west-1",
  "eu-west-2",
  "eu-west-3",
  "eu-central-1",
  "eu-central-2",
  "eu-north-1",
  "eu-south-1",
  "il-central-1",
  "me-central-1",
  "af-south-1",
  "ap-south-1",
  "ap-south-2",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-southeast-3",
  "ap-southeast-4",
  "ap-northeast-1",
  "ap-northeast-2",
  "ap-northeast-3",
  "ap-east-1",
  "sa-east-1",
];

async function tryRegion(ref, pass, awsPrefix, region, port, extraQs) {
  const user = `postgres.${ref}`;
  const enc = encodeURIComponent(pass);
  const qs = extraQs ? `&${extraQs}` : "";
  const databaseUrl = `postgresql://${user}:${enc}@${awsPrefix}-${region}.pooler.supabase.com:${port}/postgres?schema=public&sslmode=require${qs}`;
  const prisma = new PrismaClient({
    datasources: { db: { url: databaseUrl } },
    log: [],
  });
  try {
    await prisma.$queryRaw`SELECT 1 AS n`;
    return { awsPrefix, region, port, status: "OK", databaseUrl: databaseUrl.replace(pass, "***") };
  } catch (e) {
    const msg = String(e?.message ?? e);
    if (msg.includes("Tenant or user not found")) return { awsPrefix, region, port, status: "no_tenant" };
    if (
      msg.includes("password authentication failed") ||
      msg.includes("28P01") ||
      (msg.includes("credentials for") && msg.includes("are not valid")) ||
      msg.includes("Authentication failed against database server")
    )
      return { awsPrefix, region, port, status: "bad_password" };
    if (msg.includes("Can't reach") || msg.includes("P1001")) return { awsPrefix, region, port, status: "unreachable" };
    return { awsPrefix, region, port, status: "other", msg: msg.slice(0, 120) };
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}

function printWin(ref, pass, awsPrefix, region, port) {
  console.log("\nPon en .env.local (sustituye la contraseña real):\n");
  const enc = encodeURIComponent(pass);
  const extra =
    port === 6543
      ? "?schema=public&sslmode=require&pgbouncer=true&connect_timeout=15"
      : "?schema=public&sslmode=require";
  console.log(
    `DATABASE_URL="postgresql://postgres.${ref}:${enc}@${awsPrefix}-${region}.pooler.supabase.com:${port}/postgres${extra}"`,
  );
  console.log("\nLuego: npm run db:check && npm run dev\n");
}

const AWS_PREFIXES = ["aws-0", "aws-1"];

async function main() {
  loadEnvLocal();
  const direct = process.env.DATABASE_URL ?? "";
  const parsed = parseDatabaseUrl(direct);
  if (!parsed?.ref || !parsed?.pass) {
    console.error(
      "No pude extraer ref/contraseña de DATABASE_URL. Usa:\n" +
        "  postgresql://postgres:PASS@db.REF.supabase.co:5432/… o\n" +
        "  postgresql://postgres.REF:PASS@aws-0-REGION.pooler… (pooler del dashboard).",
    );
    process.exit(1);
  }
  const { ref, pass } = parsed;
  console.log(
    `Proyecto ref: ${ref}\nProbando pooler aws-0/aws-1 × región: session (5432) y transaction (6543 + pgbouncer)…\n`,
  );

  let sawBadPassword = false;
  for (const awsPrefix of AWS_PREFIXES) {
    for (const region of REGIONS) {
      process.stdout.write(`${awsPrefix} ${region} :5432 … `);
      let r = await tryRegion(ref, pass, awsPrefix, region, 5432, "");
      if (r.status === "OK") {
        console.log("✓ OK");
        printWin(ref, pass, awsPrefix, region, 5432);
        process.exit(0);
      }
      if (r.status === "bad_password") sawBadPassword = true;
      console.log(r.status + (r.msg ? `: ${r.msg}` : ""));
      process.stdout.write(`${awsPrefix} ${region} :6543 … `);
      r = await tryRegion(ref, pass, awsPrefix, region, 6543, "pgbouncer=true&connect_timeout=15");
      if (r.status === "OK") {
        console.log("✓ OK");
        printWin(ref, pass, awsPrefix, region, 6543);
        process.exit(0);
      }
      if (r.status === "bad_password") sawBadPassword = true;
      console.log(r.status + (r.msg ? `: ${r.msg}` : ""));
    }
  }

  if (sawBadPassword) {
    console.log(
      "\nEn algún host el pooler aceptó el proyecto pero rechazó la contraseña.\n" +
        "Resetea «Database password» en Supabase (Settings → Database) y vuelve a pegar la URI de Connect en DATABASE_URL.\n",
    );
  }

  console.log(
    "\nNinguna región encajó. Copia la URI exacta de Supabase → Connect (Session o Transaction).\n" +
      "Si todo devuelve «no_tenant», puede ser incidencia del pooler: https://supabase.com/dashboard/support/new\n" +
      "Mientras tanto: Docker local → npm run db:docker-up y DATABASE_URL 127.0.0.1:5433 (ver .env.example).",
  );
  process.exit(1);
}

main();
