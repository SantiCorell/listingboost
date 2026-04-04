-- =============================================================================
-- ListingBoost / BETTERSEO — esquema PostgreSQL para Supabase (SQL Editor)
-- =============================================================================
-- Cómo usar:
--   1. Supabase → SQL Editor → New query → pega todo este archivo → Run.
--   2. Debe ejecutarse en un proyecto vacío (public sin estas tablas). Si ya
--      existen, fallará: borra tablas en orden inverso o usa solo Prisma
--      (`npm run db:push`).
-- 3. Tras crear el esquema, en local ejecuta `npx prisma generate` (el cliente
--    ya cuadra con estas tablas y nombres "User", "Session", etc.).
--
-- Conexión de la app: usa la URI Postgres (DATABASE_URL), no las claves API.
-- RLS está activado; el rol `postgres` de tu cadena de conexión ignora RLS.
-- Los roles `anon` / `authenticated` no tienen permisos sobre estas tablas
-- (evita lectura accidental vía PostgREST). `service_role` sí (Edge Functions).
-- =============================================================================

CREATE SCHEMA IF NOT EXISTS "public";

-- ---------------------------------------------------------------------------
-- Enums (coinciden con prisma/schema.prisma)
-- ---------------------------------------------------------------------------
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO', 'PRO_PLUS', 'ENTERPRISE');
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'PAST_DUE', 'TRIALING', 'INCOMPLETE');
CREATE TYPE "ProductPlatformTarget" AS ENUM ('WALLAPOP', 'EBAY', 'SHOPIFY', 'GENERIC', 'ALL');
CREATE TYPE "UrlPageType" AS ENUM ('HOME', 'PRODUCT', 'COLLECTION', 'BLOG', 'CATEGORY', 'OTHER');
CREATE TYPE "AccountProfile" AS ENUM ('MARKETPLACE_SELLER', 'ECOMMERCE_BRAND', 'AGENCY_FREELANCER', 'OTHER');
CREATE TYPE "AccountKind" AS ENUM ('EMPRESA', 'AUTONOMO', 'PARTICULAR');
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- ---------------------------------------------------------------------------
-- Tablas
-- ---------------------------------------------------------------------------
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "passwordHash" TEXT,
    "image" TEXT,
    "companyName" TEXT,
    "phone" TEXT,
    "profileType" "AccountProfile",
    "accountKind" "AccountKind",
    "termsAcceptedAt" TIMESTAMP(3),
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "analysesThisMonth" INTEGER NOT NULL DEFAULT 0,
    "bonusCreditsRemaining" INTEGER NOT NULL DEFAULT 0,
    "monthResetAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "currentPeriodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProductAnalysis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "descriptionInput" TEXT,
    "platformTarget" "ProductPlatformTarget" NOT NULL,
    "language" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "categoryHint" TEXT,
    "tone" TEXT NOT NULL,
    "outputJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductAnalysis_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UrlAudit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "keywordHint" TEXT,
    "pageType" "UrlPageType" NOT NULL,
    "crawlSummaryJson" JSONB NOT NULL,
    "outputJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UrlAudit_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UsageEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ApiLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "provider" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "ok" BOOLEAN NOT NULL,
    "latencyMs" INTEGER NOT NULL,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SavedProject" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedProject_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SiteVisit" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "visitorKey" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteVisit_pkey" PRIMARY KEY ("id")
);

-- ---------------------------------------------------------------------------
-- Índices y uniques
-- ---------------------------------------------------------------------------
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
CREATE UNIQUE INDEX "Subscription_stripeCustomerId_key" ON "Subscription"("stripeCustomerId");
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");
CREATE INDEX "ProductAnalysis_userId_createdAt_idx" ON "ProductAnalysis"("userId", "createdAt");
CREATE INDEX "UrlAudit_userId_createdAt_idx" ON "UrlAudit"("userId", "createdAt");
CREATE INDEX "UsageEvent_userId_createdAt_idx" ON "UsageEvent"("userId", "createdAt");
CREATE INDEX "ApiLog_createdAt_idx" ON "ApiLog"("createdAt");
CREATE INDEX "SavedProject_userId_idx" ON "SavedProject"("userId");
CREATE INDEX "SiteVisit_createdAt_idx" ON "SiteVisit"("createdAt");
CREATE INDEX "SiteVisit_visitorKey_createdAt_idx" ON "SiteVisit"("visitorKey", "createdAt");

-- ---------------------------------------------------------------------------
-- Foreign keys
-- ---------------------------------------------------------------------------
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductAnalysis" ADD CONSTRAINT "ProductAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UrlAudit" ADD CONSTRAINT "UrlAudit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UsageEvent" ADD CONSTRAINT "UsageEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ApiLog" ADD CONSTRAINT "ApiLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SavedProject" ADD CONSTRAINT "SavedProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SiteVisit" ADD CONSTRAINT "SiteVisit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ---------------------------------------------------------------------------
-- updatedAt automático (equivalente práctico a @updatedAt de Prisma en SQL)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION listingboost_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_set_updated_at BEFORE UPDATE ON "User"
  FOR EACH ROW EXECUTE FUNCTION listingboost_set_updated_at();

CREATE TRIGGER subscription_set_updated_at BEFORE UPDATE ON "Subscription"
  FOR EACH ROW EXECUTE FUNCTION listingboost_set_updated_at();

CREATE TRIGGER productanalysis_set_updated_at BEFORE UPDATE ON "ProductAnalysis"
  FOR EACH ROW EXECUTE FUNCTION listingboost_set_updated_at();

CREATE TRIGGER urlaudit_set_updated_at BEFORE UPDATE ON "UrlAudit"
  FOR EACH ROW EXECUTE FUNCTION listingboost_set_updated_at();

CREATE TRIGGER savedproject_set_updated_at BEFORE UPDATE ON "SavedProject"
  FOR EACH ROW EXECUTE FUNCTION listingboost_set_updated_at();

-- ---------------------------------------------------------------------------
-- Permisos Supabase (PostgREST / API)
-- Solo estas tablas (no abre el resto de objetos que tengas en public).
-- ---------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

GRANT ALL ON TABLE "User" TO postgres, service_role;
GRANT ALL ON TABLE "Account" TO postgres, service_role;
GRANT ALL ON TABLE "Session" TO postgres, service_role;
GRANT ALL ON TABLE "VerificationToken" TO postgres, service_role;
GRANT ALL ON TABLE "Subscription" TO postgres, service_role;
GRANT ALL ON TABLE "ProductAnalysis" TO postgres, service_role;
GRANT ALL ON TABLE "UrlAudit" TO postgres, service_role;
GRANT ALL ON TABLE "UsageEvent" TO postgres, service_role;
GRANT ALL ON TABLE "ApiLog" TO postgres, service_role;
GRANT ALL ON TABLE "SavedProject" TO postgres, service_role;
GRANT ALL ON TABLE "SiteVisit" TO postgres, service_role;

-- Evita que el cliente público lea usuarios, sesiones, OAuth, etc. sin backend.
REVOKE ALL ON TABLE "User" FROM anon, authenticated;
REVOKE ALL ON TABLE "Account" FROM anon, authenticated;
REVOKE ALL ON TABLE "Session" FROM anon, authenticated;
REVOKE ALL ON TABLE "VerificationToken" FROM anon, authenticated;
REVOKE ALL ON TABLE "Subscription" FROM anon, authenticated;
REVOKE ALL ON TABLE "ProductAnalysis" FROM anon, authenticated;
REVOKE ALL ON TABLE "UrlAudit" FROM anon, authenticated;
REVOKE ALL ON TABLE "UsageEvent" FROM anon, authenticated;
REVOKE ALL ON TABLE "ApiLog" FROM anon, authenticated;
REVOKE ALL ON TABLE "SavedProject" FROM anon, authenticated;
REVOKE ALL ON TABLE "SiteVisit" FROM anon, authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security (PostgREST respeta políticas; postgres / service_role bypass)
-- ---------------------------------------------------------------------------
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "VerificationToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProductAnalysis" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UrlAudit" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UsageEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ApiLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SavedProject" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SiteVisit" ENABLE ROW LEVEL SECURITY;

-- Sin políticas para anon/authenticated → sin acceso vía API con JWT de usuario.
-- Si más adelante quieres leer datos desde el cliente Supabase, añade políticas
-- explícitas (por ejemplo auth.uid() = …) en un script aparte.

-- =============================================================================
-- Fin. Comprueba en Table editor que aparecen las tablas.
-- =============================================================================
