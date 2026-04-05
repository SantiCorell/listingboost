-- SEO Gap Finder AI: informes y caché 24h por usuario
CREATE TABLE "SeoGapReport" (
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

CREATE INDEX "SeoGapReport_userId_createdAt_idx" ON "SeoGapReport"("userId", "createdAt");

CREATE INDEX "SeoGapReport_userId_cacheKey_idx" ON "SeoGapReport"("userId", "cacheKey");

ALTER TABLE "SeoGapReport" ADD CONSTRAINT "SeoGapReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
