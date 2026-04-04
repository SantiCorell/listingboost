/**
 * Comprueba que Prisma llega a Postgres (Supabase).
 * Uso: npm run db:check
 */
/* eslint-disable @typescript-eslint/no-require-imports, no-console */
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

function loadEnvLocal() {
  const p = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(p)) {
    console.error("No existe .env.local");
    process.exit(1);
  }
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

function redactUrl(u) {
  try {
    const x = new URL(u.replace(/^postgresql:/, "http:"));
    if (x.password) x.password = "***";
    return x.toString().replace(/^http:/, "postgresql:");
  } catch {
    return "(URL no parseable)";
  }
}

async function main() {
  loadEnvLocal();
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL no está definida en .env.local");
    process.exit(1);
  }

  console.log("Probando conexión con:", redactUrl(url));
  const prisma = new PrismaClient({ log: [] });
  try {
    await prisma.$queryRaw`SELECT 1 AS ok`;
    console.log("OK: la base de datos responde. Prisma puede conectar.");
  } catch (e) {
    const msg = String(e?.message ?? e);
    console.error("\nFallo de conexión:\n", msg, "\n");

    if (msg.includes("Can't reach database server") || msg.includes("P1001")) {
      console.log(
        "→ Suele ser IPv6: la URL «directa» db.PROYECTO.supabase.co:5432 no es alcanzable desde tu red.\n" +
          "  Solución: en Supabase → Connect → copia la URI del modo «Session pooler» (puerto 5432)\n" +
          "  o «Transaction pooler» (6543; Prisma a veces necesita ?pgbouncer=true en la URL).\n" +
          "  Pégala entera como DATABASE_URL en .env.local.\n" +
          "  Alternativa de pago: IPv4 add-on en Supabase para la conexión directa.\n" +
          "  Desarrollo local: arranca Docker Desktop, `npm run db:docker-up`, usa DATABASE_URL de .env.example\n" +
          "  (127.0.0.1:5433/listingboost) y `npm run db:push`.\n",
      );
    } else if (msg.includes("Tenant or user not found")) {
      console.log(
        "→ El pooler no reconoce usuario/proyecto. Copia la cadena EXACTA del apartado Connect\n" +
          "  (no inventes la región aws-0-…). El usuario suele ser postgres.TUREF.\n",
      );
    } else if (
      msg.includes("password authentication failed") ||
      msg.includes("28P01") ||
      (msg.includes("credentials for") && msg.includes("are not valid")) ||
      msg.includes("Authentication failed against database server")
    ) {
      console.log(
        "→ Usuario o contraseña de Postgres incorrectos (la conexión al host sí llega).\n" +
          "  En Supabase: Settings → Database → «Database password» (resetea si no la recuerdas).\n" +
          "  Luego Connect → Session pooler → copia la URI completa y pégala en DATABASE_URL.\n" +
          "  No uses la clave anon ni service_role como contraseña de Postgres.\n" +
          "  Si la contraseña tiene @ # : / ? codifícala en la URL (p. ej. @ → %40).\n",
      );
    } else if (msg.includes("does not exist") || msg.includes("P2021")) {
      console.log("→ Conecta pero falta una tabla. Ejecuta npm run db:push o el SQL de supabase/listingboost_schema.sql\n");
    }

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
