import type { SeoCategoriaSlug, VenderWallapopSlug } from "@/lib/seo/growth-registry";
import { CATEGORIA_LABEL, PRODUCTO_WALLAPOP_LABEL } from "@/lib/seo/growth-registry";

export function tituloSeoPageContent(categoria: SeoCategoriaSlug) {
  const label = CATEGORIA_LABEL[categoria];
  const title = `Título SEO para ${label}: ejemplos y fórmula`;
  const description = `Genera títulos SEO para vender ${label} en Wallapop, eBay y Shopify: estructura, keywords y errores típicos. Prueba ListingBoost gratis.`;
  const h1 = `Título SEO para ${label}: plantilla + ejemplos listos`;

  const examples =
    categoria === "iphone"
      ? [
          "iPhone 14 128 GB medianoche — batería 92%, sin golpes, con caja",
          "iPhone 13 Pro 256 GB verde alpinista, usado, pantalla OK · factura",
        ]
      : categoria === "coche"
        ? [
            "BMW Serie 1 118d 2018 — 140.000 km, ITV recién pasada, ITVPegatina OK",
            "Seat León FR 2.0 TDI 150 CV 2017 · historial mantenimiento · negociable",
          ]
        : categoria === "sofa"
          ? [
              "Sofá rinconera gris 280×180 cm — desenfundable, buen estado · solo recogida",
              "Sofá 3 plazas piel sintética marrón, uso doméstico, sin roturas",
            ]
          : categoria === "muebles"
            ? [
                "Mesa comedor roble 160×90 cm — 6 comensales, patas desmontables",
                "Estantería IKEA Billy blanca 80×28×202 — desmontada lista para llevar",
              ]
            : categoria === "zapatillas"
              ? [
                  "Nike Air Force 1 talla 42 blancas — uso urbano, suela desgastada leve",
                  "Adidas Ultraboost 22 mujer talla 38 — pocas salidas, sin caja",
                ]
              : categoria === "bicicleta"
                ? [
                    "Bicicleta MTB Orbea 29\" talla M — revisada, cambio Shimano Deore",
                    "Bici carretera carbono talla 54 — potenciómetro retirado, negociable",
                  ]
                : categoria === "electronica"
                  ? [
                      "Portátil Lenovo ThinkPad i5 16 GB RAM 512 SSD — Windows 11, garantía 3 meses",
                      "Monitor Dell 27\" QHD 75 Hz — sin píxeles muertos, embalaje original",
                    ]
                  : [
                      "Pack 3 camisetas básicas algodón talla M — sin etiquetas, lavadas una vez",
                      "Chaqueta impermeable talla L — costura refuerzo en bolsillo (detalle foto)",
                    ];

  const tips = [
    `Incluye en el título las palabras que alguien buscaría al comprar ${label}: marca, modelo, medida, estado.`,
    "No rellenes sinónimos artificiales; suena a spam y cansa.",
    "Si hay variaciones (talla/color), evita títulos idénticos entre anuncios.",
    "Cierra expectativas: ‘solo mano’, ‘envío incluido’, ‘negociable’ si es verdad.",
  ];

  return { title, description, h1, examples, tips, label };
}

export function descripcionProductoPageContent(categoria: SeoCategoriaSlug) {
  const label = CATEGORIA_LABEL[categoria];
  const title = `Descripción de producto para ${label}: plantilla SEO`;
  const description = `Plantilla de descripción para ${label} en marketplaces: bloques, SEO y confianza. ListingBoost + ListingBrain™ — empieza gratis.`;
  const h1 = `Descripción de producto para ${label}: template + tips`;

  const template: { head: string; body: string }[] = [
    { head: "Qué es", body: "modelo exacto y para quién encaja." },
    { head: "Estado", body: "defectos visibles, uso previo, accesorios incluidos." },
    { head: "Logística", body: "envío, recogida, plazo de preparación." },
    { head: "Confianza", body: "factura, número de serie parcial si aplica, política simple." },
  ];

  const bullets = [
    `En la primera línea resume lo que el comprador de ${label} necesita saber sí o sí.`,
    "Usa viñetas para especificaciones; párrafos cortos para lectura móvil.",
    "Repite de forma natural 2–3 keywords del título sin forzar.",
    "Cierra con CTA claro: ‘escribe para verlo’ o ‘reserva con señal’ si lo usas.",
  ];

  return { title, description, h1, template, bullets, label };
}

export function venderWallapopPageContent(producto: VenderWallapopSlug) {
  const label = PRODUCTO_WALLAPOP_LABEL[producto];
  const title = `Vender ${label} en Wallapop: guía práctica + texto que vende`;
  const description = `Cómo vender ${label} en Wallapop: precio, fotos, título y seguridad. Optimiza con ListingBoost (IA) y publica más rápido.`;
  const h1 = `Vender ${label} en Wallapop: guía para cerrar antes`;

  const specifics =
    producto === "iphone"
      ? [
          "Indica capacidad, color, % batería y si Face ID / True Tone funcionan.",
          "Menciona iCloud desvinculado y si aceptas revisión de IMEI en mano.",
          "Foto de pantalla encendida y de marcos con luz lateral.",
        ]
      : producto === "coche"
        ? [
            "Km, año, motor, ITV, golpes, historial de mantenimiento razonable.",
            "Si financias o solo efectivo; prueba seria en estación de servicio si aplica.",
            "Fotos laterales completas + interior + maletero.",
          ]
        : producto === "sofa" || producto === "muebles"
          ? [
              "Medidas reales (ancho × fondo × alto); si cabe en ascensor estándar.",
              "Material, desmontaje, si subes ayuda en planta.",
              "Marca de uso en tejidos o madera; evita sorpresas en recogida.",
            ]
          : [
              "Talla o medidas claras; marca y modelo si aportan confianza.",
              "Estado suela / batería / desgaste con fotos cercanas.",
              "Política de envío vs mano; Wallapop envíos si lo usas.",
            ];

  return { title, description, h1, specifics, label };
}
