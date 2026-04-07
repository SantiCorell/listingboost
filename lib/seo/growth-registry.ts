/** Slugs para /titulo-seo/[categoria] y /descripcion-producto/[categoria] */
export const SEO_CATEGORIAS = [
  "zapatillas",
  "muebles",
  "iphone",
  "coche",
  "sofa",
  "ropa",
  "bicicleta",
  "electronica",
] as const;

export type SeoCategoriaSlug = (typeof SEO_CATEGORIAS)[number];

/** Slugs para /vender-[producto]-wallapop */
export const VENDER_WALLAPOP_PRODUCTOS = ["zapatillas", "muebles", "iphone", "coche", "sofa"] as const;

export type VenderWallapopSlug = (typeof VENDER_WALLAPOP_PRODUCTOS)[number];

export const GROWTH_STATIC_ROUTES = [
  "/alternativa-semrush-ahrefs",
  "/seo-wallapop",
  "/optimizar-listings-wallapop",
  "/seo-ebay",
  "/seo-etsy",
  "/generador-titulos-productos",
  "/descripcion-productos-ia",
  "/no-vendo-en-wallapop",
  "/no-vendo-en-ebay",
  "/como-vender-mas-en-wallapop",
  "/por-que-no-vendo-productos",
] as const;

export type GrowthStaticRoute = (typeof GROWTH_STATIC_ROUTES)[number];

/** Etiquetas legibles para categorías (títulos H1 y copy). */
export const CATEGORIA_LABEL: Record<SeoCategoriaSlug, string> = {
  zapatillas: "zapatillas",
  muebles: "muebles de segunda mano",
  iphone: "iPhone",
  coche: "coches",
  sofa: "sofás",
  ropa: "ropa",
  bicicleta: "bicicletas",
  electronica: "electrónica",
};

export const PRODUCTO_WALLAPOP_LABEL: Record<VenderWallapopSlug, string> = {
  zapatillas: "zapatillas",
  muebles: "muebles",
  iphone: "iPhone",
  coche: "coche",
  sofa: "sofá",
};

export function isSeoCategoria(s: string): s is SeoCategoriaSlug {
  return (SEO_CATEGORIAS as readonly string[]).includes(s);
}

export function isVenderWallapopSlug(s: string): s is VenderWallapopSlug {
  return (VENDER_WALLAPOP_PRODUCTOS as readonly string[]).includes(s);
}
