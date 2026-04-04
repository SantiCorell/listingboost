import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductSeoForm } from "@/components/product/product-seo-form";
import { CreditsUpsellBanner } from "@/components/pricing/credits-upsell-banner";

export default async function ProductSeoPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Boost de ficha</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Multicanal hoy; roadmap: Amazon, Etsy, Milanuncios y más pipes.
        </p>
      </div>
      <CreditsUpsellBanner />
      <ProductSeoForm userPlan={user.plan} />
    </div>
  );
}
