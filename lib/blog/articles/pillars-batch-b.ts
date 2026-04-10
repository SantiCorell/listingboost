import type { BlogPost } from "../types";

const cta =
  '<section class="mt-10 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/[0.07] to-transparent p-6 text-center"><p class="text-lg font-semibold text-foreground">Prueba ListingBoost gratis</p><p class="mt-2 text-sm text-muted-foreground">Auditoría SEO + gaps en Google + contenido con IA.</p><p class="mt-4"><a href="/register?callbackUrl=/dashboard/audit" class="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">Analizar mi web gratis</a></p></section>';

function rel(links: { path: string; label: string }[]): string {
  const items = links
    .map(
      (l) =>
        `<li><a href="${l.path}" class="font-medium text-primary underline-offset-4 hover:underline">${l.label}</a></li>`,
    )
    .join("");
  return `<section class="mt-12 border-t border-border/60 pt-8"><h2>Artículos relacionados</h2><ul class="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">${items}</ul></section>`;
}

/** Artículos 6–10 (pillar SEO en español). */
export const pillarBatchB: BlogPost[] = [
  {
    slug: "seo-ecommerce",
    canonicalPath: "/seo-ecommerce",
    title: "SEO para ecommerce: cómo posicionar productos en Google",
    description:
      "Guía completa de SEO para ecommerce: mejora tus fichas de producto y aumenta tus ventas.",
    keywords: ["seo ecommerce", "seo tienda online", "fichas de producto", "google shopping seo", "ListingBoost"],
    publishedAt: "2026-04-17T08:00:00.000Z",
    author: "ListingBoost",
    faqItems: [
      {
        question: "¿Duplico descripción del fabricante?",
        answer:
          "Evítalo: añade valor (compatibilidades, uso, comparativas). Google suele filtrar thin duplicate content.",
      },
      {
        question: "¿Qué priorizo primero en una tienda grande?",
        answer:
          "Categorías con demanda, plantillas de PDP con bloques únicos y arquitectura de enlaces internos desde home y menú.",
      },
      {
        question: "¿Cómo evitar thin content en masas de PDP?",
        answer:
          "Reglas de mínimo de texto único por plantilla, bloques modulares (guías, compatibilidades) y consolidación de variantes que no merecen URL propia.",
      },
      {
        question: "¿Facetas y filtros perjudican el SEO?",
        answer:
          "Sí si generan miles de URLs duplicadas sin canonical o parámetros sin control. Ordena qué combinaciones se indexan y cuáles se bloquean o canonicalizan.",
      },
    ],
    contentHtml: `
<p>El <strong>SEO ecommerce</strong> es un juego de plantillas: si optimizas la estructura una vez, multiplicas el impacto en miles de URLs. El error típico es pelear keyword a keyword sin arreglar filtros, paginación, canonicals y contenido duplicado de fabricante.</p>

<h2>Arquitectura y rastreo</h2>
<p>Asegura que Google alcance categorías y productos importantes en pocos clics desde la home. Bloquea parámetros basura con reglas claras; usa canonicals en variaciones de color/talla cuando no aportan valor único.</p>

<h2>Fichas de producto que rankean</h2>
<ul>
<li>Título con modelo + atributo buscado (talla, capacidad, color).</li>
<li>Bloque “ideal para…” con escenarios de uso.</li>
<li>FAQ de devoluciones, garantía y envío visibles.</li>
<li>Enlaces a guías relacionadas (cómo elegir talla, comparativa).</li>
</ul>

<h2>Contenido transaccional</h2>
<p>Las páginas de categoría necesitan texto introductorio útil, no 300 palabras de relleno. Piensa en intención: ¿el usuario compara, elige talla o busca oferta?</p>

<h2>PLP, filtros y paginación</h2>
<p>El <strong>SEO ecommerce</strong> se rompe cuando cada filtro crea una URL indexable idéntica salvo por un parámetro. Define una política: facetas “SEO” con demanda real pueden tener URL limpia y copy único; el resto, noindex o parámetros gestionados en Search Console. La paginación debe enlazar con rel next/prev o diseño de “cargar más” que no multiplique duplicados siempre que el contenido único esté en la primera página.</p>

<h2>Pruebas sociales y datos estructurados</h2>
<p>Reseñas verificables, vídeos cortos de uso y comparativas “vs modelo anterior” aumentan tiempo en página y claridad para buscadores. Si implementas <code>Product</code> o <code>Offer</code> en schema, que coincida con el precio visible; discrepancias son señal de baja calidad.</p>

<h2>Herramientas</h2>
<p>Combina Search Console con una <a href="/auditoria-seo">auditoría SEO</a> por plantilla y, si publicas en marketplaces, revisa el flujo multicanal en ListingBoost.</p>

<h2>Conclusión</h2>
<p><strong>Posicionar productos en Google</strong> exige disciplina de catálogo + contenido único. Prioriza las URLs con impresiones y CTR bajo: ahí suele estar el dinero. Cierra el ciclo con <a href="/auditoria-seo">auditoría SEO</a> por plantilla y, si escala el catálogo, con <a href="/herramientas-seo-ia">texto asistido por IA</a> bajo revisión humana.</p>
${cta}
${rel([
      { path: "/como-posicionar-web-google", label: "Cómo posicionar en Google" },
      { path: "/aumentar-trafico-web", label: "Aumentar tráfico web" },
      { path: "/herramientas-seo-ia", label: "Herramientas SEO con IA" },
    ])}
`,
  },
  {
    slug: "herramientas-seo-ia",
    canonicalPath: "/herramientas-seo-ia",
    title: "Las mejores herramientas SEO con IA en 2026",
    description:
      "Descubre las herramientas SEO que utilizan inteligencia artificial para mejorar tu posicionamiento.",
    keywords: ["herramientas seo ia", "seo ai tool", "ia seo", "ListingBoost", "ListingBrain"],
    publishedAt: "2026-04-16T08:00:00.000Z",
    author: "ListingBoost",
    faqItems: [
      {
        question: "¿La IA sustituye al SEO humano?",
        answer:
          "No. Acelera borradores y análisis; la estrategia, la validación legal y el criterio editorial siguen siendo humanos.",
      },
      {
        question: "¿Qué riesgos tiene el contenido IA?",
        answer:
          "Inexactitudes, homogeneización y páginas ‘perfectas’ pero vacías. Combina IA con datos propios y revisión.",
      },
      {
        question: "¿Cómo evitar que todas las fichas suenen igual?",
        answer:
          "Plantillas con variables obligatorias (uso, compatibilidad, público), tono de marca en el prompt y validación por categoría antes de publicar en masa.",
      },
      {
        question: "¿ListingBrain™ qué aporta frente a un chat genérico?",
        answer:
          "Contexto SEO operativo: auditoría, huecos de SERP y reglas de publicación alineadas con ListingBoost, no solo texto suelto.",
      },
    ],
    contentHtml: `
<p>Las <strong>herramientas SEO con IA</strong> en 2026 van desde generadores de meta descripciones hasta suites que proponen clusters de contenido completos. El filtro para elegir es simple: ¿la IA reduce tu tiempo en tareas de bajo valor o te hace publicar basura más rápido?</p>

<h2>Tipos de herramientas</h2>
<ul>
<li><strong>Generación</strong>: títulos, FAQs, esquemas de artículo.</li>
<li><strong>Análisis</strong>: priorización de quick wins, sugerencias on-page.</li>
<li><strong>SERP</strong>: resumen de intención y competidores.</li>
<li><strong>Operativas</strong>: de la auditoría al texto listo para CMS — aquí encaja ListingBoost con ListingBrain™.</li>
</ul>

<h2>Qué exigir a un proveedor</h2>
<p>Transparencia de límites, trazabilidad de fuentes cuando use datos externos, y controles de tono/marca. Evita “publicar mil URLs” sin checklist de calidad.</p>

<h2>Comparativa con suites clásicas</h2>
<p>Las suites grandes añaden módulos IA; las startups nativas IA a veces carecen de crawl profundo. Lo óptimo suele ser <strong>combinar</strong>: datos donde los necesitas + flujo de publicación rápido.</p>

<h2>Gobernanza y prompts en equipos</h2>
<p>Define quién aprueba borradores IA, un banco de ejemplos “bueno / malo” y límites legales (salud, finanzas, claims comparativos). Los prompts deben incluir público objetivo, prohibiciones de marca y formato de salida (bullets, tabla, FAQ). Sin gobernanza, la <strong>herramienta SEO con IA</strong> acelera el caos.</p>

<h2>Flujo recomendado</h2>
<ol>
<li>Audita la URL o plantilla con scoring claro.</li>
<li>Genera outline + FAQs desde intención real de SERP.</li>
<li>Humano ajusta cifras, garantías y tono.</li>
<li>Publica y mide CTR y posición a 14–28 días.</li>
</ol>
<p>Encaja este flujo con la visión general de <a href="/seo-para-ia">SEO para IA</a> y con <a href="/alternativas-a-semrush">alternativas a SEMrush</a> si buscas recortar coste fijo.</p>

<h2>Conclusión</h2>
<p>Las <strong>mejores herramientas SEO con IA</strong> son las que tu equipo confía para ejecutar. Prueba siempre con una URL real antes de comprometer anualidades.</p>
${cta}
${rel([
      { path: "/mejores-herramientas-seo-2026", label: "Mejores herramientas SEO 2026" },
      { path: "/alternativas-a-semrush", label: "Alternativas a SEMrush" },
      { path: "/seo-para-ia", label: "SEO para IA" },
    ])}
`,
  },
  {
    slug: "auditoria-seo",
    canonicalPath: "/auditoria-seo",
    title: "Auditoría SEO: cómo analizar tu web paso a paso",
    description:
      "Aprende a hacer una auditoría SEO completa y mejora el posicionamiento de tu web.",
    keywords: ["auditoria seo", "auditoría web", "seo audit tool", "analizar web", "ListingBoost"],
    publishedAt: "2026-04-15T08:00:00.000Z",
    author: "ListingBoost",
    faqItems: [
      {
        question: "¿Con qué frecuencia auditar?",
        answer:
          "Tras cambios grandes (migración, nueva plantilla) y al menos trimestral en sitios activos en contenido.",
      },
      {
        question: "¿Qué herramientas mínimas necesito?",
        answer:
          "Search Console, prueba de velocidad móvil y un crawler o auditoría on-page. ListingBoost acelera la primera pasada con scoring accionable.",
      },
      {
        question: "¿Auditoría manual o solo herramienta?",
        answer:
          "La herramienta prioriza; el humano valida muestreo en URLs reales y negocio (¿esta página debe existir?).",
      },
      {
        question: "¿Qué hacer si hay miles de errores 404?",
        answer:
          "Clasifica: 404 esperados (producto fuera de catálogo) vs rotos por enlazado interno. Prioriza los que reciben enlaces externos o tráfico histórico.",
      },
    ],
    contentHtml: `
<p>Una <strong>auditoría SEO</strong> es un inventario priorizado de lo que impide que tu web rinda en Google: técnica, contenido, popularidad y UX. No es una lista infinita de “errores rojos”; es un plan con impacto estimado y orden de ejecución.</p>

<h2>Fase 1: rastreo e indexación</h2>
<p>Revisa cobertura en Search Console, sitemap, robots.txt y status codes. Sin indexación sana, el mejor contenido no compite.</p>

<h2>Fase 2: on-page</h2>
<ul>
<li>Títulos y metas duplicados o truncados.</li>
<li>Jerarquía H1–H3 coherente.</li>
<li>Enlaces internos rotos y oportunidades de ancla.</li>
<li>Datos estructurados coherentes con lo visible.</li>
</ul>

<h2>Fase 3: contenido e intención</h2>
<p>Para cada plantilla (home, categoría, PDP, blog), define la intención objetivo y compara con la SERP. Si todos los top resultados son guías largas y tú tienes 200 palabras, ajusta formato o keyword.</p>

<h2>Fase 4: rendimiento y CWV</h2>
<p>Prioriza LCP en móvil en páginas de dinero: PDP, lead gen, reserva.</p>

<h2>Entregable</h2>
<p>Tabla: problema → URL ejemplo → acción → responsable → fecha. Sin eso, la auditoría muere en el drive.</p>

<h2>Muestreo y priorización</h2>
<p>No intentes “arreglar el sitio entero” en una semana. Toma 20 URLs representativas por plantilla (home, categoría, producto, blog hub, artículo) y extrapola patrones. Si el patrón afecta a 10 000 URLs, el fix es de plantilla o regla CMS, no de edición manual una a una.</p>

<h2>Stakeholders y handoff</h2>
<p>Los desarrolladores necesitan tickets con criterios de aceptación; contenido necesita briefs con keyword y SERP objetivo; diseño debe saber qué CWV tocar sin romper la marca. La <strong>auditoría SEO</strong> es un documento vivo: vuelve a ejecutarla tras cada release grande.</p>

<h2>Conclusión</h2>
<p>Empieza con una <strong>seo audit tool</strong> que te dé score y prioridades; luego profundiza con crawl manual donde duela. Conecta hallazgos con <a href="/como-posicionar-web-google">cómo posicionar en Google</a> para el plan editorial posterior.</p>
${cta}
${rel([
      { path: "/por-que-mi-web-no-posiciona", label: "Por qué no posiciona mi web" },
      { path: "/como-posicionar-web-google", label: "Posicionar en Google" },
      { path: "/mejores-herramientas-seo-2026", label: "Herramientas SEO" },
    ])}
`,
  },
  {
    slug: "por-que-mi-web-no-posiciona",
    canonicalPath: "/por-que-mi-web-no-posiciona",
    title: "Por qué tu web no posiciona en Google (y cómo solucionarlo)",
    description:
      "Descubre por qué tu web no aparece en Google y cómo mejorar tu posicionamiento.",
    keywords: ["por qué no posiciona mi web", "no aparece en google", "seo problemas", "ListingBoost"],
    publishedAt: "2026-04-14T08:00:00.000Z",
    author: "ListingBoost",
    faqItems: [
      {
        question: "¿Puede ser penalización?",
        answer:
          "A veces, pero lo habitual son problemas técnicos, contenido débil o competencia fuerte. Revisa Search Console antes de asumir penalización.",
      },
      {
        question: "¿Cuánto tarda en recuperarse?",
        answer:
          "Depende del fix: indexación puede mejorar en días; autoridad y contenido, semanas o meses.",
      },
      {
        question: "¿Puede ser el algoritmo actualización reciente?",
        answer:
          "A veces, pero primero descarta pérdidas técnicas, competencia fuerte o cambios en la intención de búsqueda comparando fechas de release con Search Console.",
      },
      {
        question: "¿Qué revisar si ‘de la noche a la mañana’ desaparecí?",
        answer:
          "noindex accidental, robots.txt, caídas de servidor, migración mal hecha o manual actions en Search Console.",
      },
    ],
    contentHtml: `
<p>Si te preguntas <strong>por qué tu web no posiciona</strong>, casi siempre es una mezcla de señales débiles: técnica, contenido, intención equivocada o falta de autoridad. Rara vez hay un único “botón mágico”. Lo que sí existe es un orden de diagnóstico que ahorra meses.</p>

<h2>Causas técnicas frecuentes</h2>
<ul>
<li>Bloqueo accidental en robots o noindex.</li>
<li>Canonical apuntando mal en migraciones.</li>
<li>Duplicados masivos (filtros, www vs no-www).</li>
<li>Sitio lentísimo en móvil en URLs críticas.</li>
</ul>

<h2>Causas de contenido</h2>
<p>Páginas que no responden mejor que el top 10, texto genérico, keyword stuffing moderno (variaciones artificiales) o falta de prueba social y datos útiles.</p>

<h2>Causas de intención</h2>
<p>Atacas palabras transaccionales con un artículo largo informacional — o al revés. Google premia el formato que el usuario espera.</p>

<h2>Cómo solucionarlo</h2>
<ol>
<li>Elige 5 URLs con impresiones pero pocos clics.</li>
<li>Audita cada una (técnica + contenido).</li>
<li>Reescribe introducción y H1 alineados a la SERP.</li>
<li>Mejora enlaces internos y velocidad.</li>
<li>Vuelve a medir a las 2–4 semanas.</li>
</ol>

<h2>Señales de competencia y autoridad</h2>
<p>Si técnicamente todo está bien y el contenido es sólido, <strong>por qué no posiciona mi web</strong> puede ser simple matemática: dominios con más enlaces temáticos, marca fuerte o mejor product-market fit en la SERP. Ahí el plan pasa a PR digital, partnerships, recursos enlazables y diferenciación real, no a otro plugin.</p>

<h2>Cuando sí es Google (y no tú)</h2>
<p>Features de SERP (People Also Ask, vídeos, mapas) pueden robar clics aunque subas posición. Ajusta el tipo de contenido o amplía long-tail. Revisa también si tu sector tiene resultados oficiales o agregadores que monopolizan la intención.</p>

<h2>Conclusión</h2>
<p>La respuesta a <strong>por qué no posiciona mi web</strong> está en datos: Search Console + <a href="/auditoria-seo">auditoría</a> + criterio. Sin datos, solo opiniones.</p>
${cta}
${rel([
      { path: "/aumentar-trafico-web", label: "Aumentar tráfico web" },
      { path: "/como-posicionar-web-google", label: "Guía posicionar en Google" },
    ])}
`,
  },
  {
    slug: "aumentar-trafico-web",
    canonicalPath: "/aumentar-trafico-web",
    title: "Cómo aumentar el tráfico de tu web en 2026",
    description:
      "Estrategias para aumentar tráfico web con SEO y contenido optimizado.",
    keywords: ["aumentar tráfico web", "más visitas web", "seo tráfico", "marketing orgánico", "ListingBoost"],
    publishedAt: "2026-04-13T08:00:00.000Z",
    author: "ListingBoost",
    faqItems: [
      {
        question: "¿SEO o paid primero?",
        answer:
          "Paid para validar mensaje y LPs; SEO para margen a largo plazo. Lo ideal es que aprendan una de la otra.",
      },
      {
        question: "¿Qué métrica importa más?",
        answer:
          "Sesiones cualificadas y conversiones, no solo visitas. Mejor menos tráfico que convierte que mucho bounce.",
      },
      {
        question: "¿Email y comunidad cuentan para SEO?",
        answer:
          "No como ranking directo, pero reactivan páginas, generan branded search y enlaces naturales si el contenido merece compartirse.",
      },
      {
        question: "¿Actualizar posts antiguos sirve?",
        answer:
          "Sí si hay nueva intención, datos o leyes. Añade fecha de actualización y secciones nuevas; evita cambiar URL sin redirección.",
      },
    ],
    contentHtml: `
<p><strong>Aumentar tráfico web</strong> en 2026 sigue pasando por orgánico de calidad, pero el mix incluye marca, email, partners y, en algunos nichos, visibilidad en respuestas de IA. Este artículo se centra en el núcleo estable: SEO + contenido que merece el clic.</p>

<h2>Diagnóstico rápido</h2>
<p>Mira Search Console: ¿suben impresiones pero no clics? Mejora títulos y meta. ¿Ni impresiones? Problema de indexación o keywords demasiado competitivas para tu autoridad actual.</p>

<h2>Estrategias SEO</h2>
<ul>
<li>Amplía cobertura long-tail con clusters temáticos.</li>
<li>Actualiza contenidos con fecha y datos nuevos.</li>
<li>Gana enlaces con recursos enlazables (plantillas, estudios).</li>
<li>Optimiza CTR en URLs que ya rankean en top 20.</li>
</ul>

<h2>Contenido optimizado</h2>
<p>Cada pieza debe tener CTA claro, enlaces internos y alineación AEO: respuesta directa al inicio para humanos y modelos.</p>

<h2>Distribución</h2>
<p>Reutiliza hallazgos en newsletter y LinkedIn: no copies el post entero, comparte el insight y enlaza a la guía profunda.</p>

<h2>Retención y producto</h2>
<p><strong>Aumentar tráfico web</strong> sin mejorar velocidad de carga, mensaje above the fold o prueba social puede subir el rebote. Alinea landing con anuncio o snippet orgánico: la promesa del clic debe cumplirse en 3 segundos. Instrumenta eventos clave para ver qué tráfico orgánico realmente activa trial o compra.</p>

<h2>Canal orgánico + IA</h2>
<p>Prepara resúmenes cortos de tus guías largas: listas y definiciones que otros puedan citar. Eso refuerza marca y puede traer menciones; enlaza siempre a la fuente canónica en tu dominio. Combina con <a href="/seo-para-ia">SEO para IA</a> para coherencia de mensaje.</p>

<h2>Conclusión</h2>
<p><strong>Aumentar tráfico</strong> es un sistema: publicar, medir, iterar. Usa ListingBoost para acortar el camino entre idea y página publicada.</p>
${cta}
${rel([
      { path: "/seo-ecommerce", label: "SEO ecommerce" },
      { path: "/seo-para-ia", label: "SEO para IA" },
      { path: "/como-posicionar-web-google", label: "Posicionar en Google" },
    ])}
`,
  },
];
