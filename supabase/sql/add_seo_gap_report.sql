-- Parche para bases ya desplegadas: tabla SEO Gap Finder AI.
-- Ejecutar en Supabase SQL Editor (o psql) si ves Prisma P2021 en /api/seo-gap.
-- En local: npm run db:push

CREATE TABLE IF NOT EXISTS "SeoGapReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "domain" TEXT,
    "country" TEXT NOT NULL DEFAULT 'es',
    "language" TEXT NOT NULL DEFAULT 'es',
    "creditsUsed" INTEGER NOT NULL DEFAULT 0,
    "cacheKey" TEXT,
    "outputJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SeoGapReport_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "SeoGapReport_userId_createdAt_idx" ON "SeoGapReport"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "SeoGapReport_userId_cacheKey_idx" ON "SeoGapReport"("userId", "cacheKey");

DO $$
BEGIN
  ALTER TABLE "SeoGapReport" ADD CONSTRAINT "SeoGapReport_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
