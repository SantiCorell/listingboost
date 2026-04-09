import type { BlogPost } from "../types";

export const article11: BlogPost = {
  slug: "seo-vs-aeo-guia-completa-2026",
  title:
    "SEO vs AEO en 2026: guía completa con ejemplos, gráficos y checklist para Google y motores de respuesta",
  description:
    "Qué es el Answer Engine Optimization frente al SEO clásico, cómo se miden, tablas comparativas, ejemplos reales y bloques interactivos para aplicar ambos en tu web y catálogo.",
  keywords: [
    "SEO vs AEO",
    "Answer Engine Optimization",
    "SEO 2026",
    "motores de respuesta",
    "contenido para IA",
    "Google SGE",
    "ListingBoost",
  ],
  publishedAt: "2026-04-10T10:00:00.000Z",
  author: "ListingBoost",
  contentHtml: htmlArticle11(),
};

function htmlArticle11(): string {
  const blocks: string[] = [];
  const p = (s: string) => blocks.push(`<p>${s}</p>`);
  const h2 = (s: string) => blocks.push(`<h2>${s}</h2>`);
  const h3 = (s: string) => blocks.push(`<h3>${s}</h3>`);

  p(
    "Si llevas tiempo en marketing digital, el SEO te suena de sobra: arquitectura, enlaces, intención de búsqueda y contenido que Google pueda rastrear e indexar. En paralelo, desde hace pocos años circula otro acrónimo: <strong>AEO</strong> (Answer Engine Optimization), orientado a que tu marca sea <em>entendida y citada</em> cuando un usuario pregunta a un buscador o a un sistema de IA que sintetiza respuestas. Esta guía larga —con tablas, un gráfico en SVG, ejemplos y secciones desplegables— une ambos mundos sin humo: verás diferencias claras, solapamientos reales y un plan práctico que puedes aplicar mañana en tu web o ecommerce.",
  );

  h2("Definiciones rápidas: dos juegos en el mismo estadio");
  h3("SEO (Search Engine Optimization)");
  p(
    "El SEO optimiza la visibilidad en resultados de búsqueda clásicos: páginas enlazadas, snippets, rich results y, en general, el clic hacia tu dominio. El éxito se mide en impresiones, posiciones medias, CTR orgánico y conversiones atribuibles al canal orgánico.",
  );
  h3("AEO (Answer Engine Optimization)");
  p(
    "El AEO optimiza la probabilidad de que una <strong>respuesta sintetizada</strong> —en un panel de IA, un resumen generativo o un asistente conversacional— refleje con precisión tu propuesta de valor, cite fuentes fiables o recomiende tu solución cuando el usuario no hace clic en diez enlaces azules. Aquí prima la claridad semántica, la consistencia factual y la autoridad percibida más que el keyword stuffing.",
  );
  p(
    "Importante: el AEO no sustituye al SEO en la mayoría de negocios; se superpone. Un sitio mal rastreable sigue siendo invisible tanto para Google como para los sistemas que aprenden de la web abierta.",
  );

  h2("Tabla comparativa: SEO frente a AEO");
  blocks.push(`
<div style="overflow-x:auto">
<table>
<thead>
<tr><th>Dimensión</th><th>Enfoque SEO clásico</th><th>Enfoque AEO</th></tr>
</thead>
<tbody>
<tr><td>Objetivo principal</td><td>Mejorar ranking y clics orgánicos</td><td>Ser la «mejor respuesta» citada o resumida</td></tr>
<tr><td>Unidad de éxito</td><td>Posición, CTR, sesiones</td><td>Precisión de la cita, recall de marca, reducción de alucinaciones contextuales</td></tr>
<tr><td>Formato típico</td><td>Landing, categorías, blog pillar</td><td>FAQs explícitas, definiciones, tablas, datos estructurados coherentes</td></tr>
<tr><td>Señal técnica</td><td>Core Web Vitals, crawl budget, hreflang</td><td>HTML semántico, bloques autocontenidos, menos ambigüedad léxica</td></tr>
<tr><td>Riesgo si fallas</td><td>Caída de tráfico</td><td>Respuestas genéricas o competidores citados en tu lugar</td></tr>
</tbody>
</table>
</div>
`);

  h2("Visual: peso relativo de tácticas (ilustrativo)");
  p(
    "El siguiente gráfico de barras <strong>no son datos de mercado</strong>: resume de forma didáctica cómo un mismo equipo puede repartir esfuerzo cuando el objetivo es equilibrar tráfico clicable (SEO) y señal comprensible para sistemas de respuesta (AEO). Ajusta los porcentajes a tu sector.",
  );
  blocks.push(`
<figure>
<svg viewBox="0 0 520 220" width="100%" style="max-width:520px;height:auto;display:block;margin:0 auto" role="img" aria-label="Gráfico de barras SEO versus AEO">
<title>Comparativa ilustrativa de foco SEO y AEO</title>
<rect x="0" y="0" width="520" height="220" fill="transparent"/>
<text x="20" y="24" font-size="14" font-weight="600" fill="currentColor">Foco táctico (ilustrativo, %)</text>
<g font-size="11" fill="currentColor">
<text x="20" y="52">Investigación de keywords</text>
<text x="20" y="82">Contenido pillar / clusters</text>
<text x="20" y="112">Datos estructurados</text>
<text x="20" y="142">FAQs y definiciones explícitas</text>
<text x="20" y="172">Enlazado interno y autoridad</text>
</g>
<g>
<rect x="200" y="40" width="240" height="14" fill="#94a3b8" rx="3"/>
<rect x="200" y="40" width="168" height="14" fill="#0ea5e9" rx="3"/>
<text x="450" y="51" font-size="10" fill="currentColor">70% SEO</text>
<rect x="200" y="70" width="240" height="14" fill="#94a3b8" rx="3"/>
<rect x="200" y="70" width="192" height="14" fill="#0ea5e9" rx="3"/>
<text x="450" y="81" font-size="10" fill="currentColor">80% SEO</text>
<rect x="200" y="100" width="240" height="14" fill="#94a3b8" rx="3"/>
<rect x="200" y="100" width="120" height="14" fill="#22c55e" rx="3"/>
<text x="450" y="111" font-size="10" fill="currentColor">50/50</text>
<rect x="200" y="130" width="240" height="14" fill="#94a3b8" rx="3"/>
<rect x="200" y="130" width="180" height="14" fill="#22c55e" rx="3"/>
<text x="450" y="141" font-size="10" fill="currentColor">75% AEO</text>
<rect x="200" y="160" width="240" height="14" fill="#94a3b8" rx="3"/>
<rect x="200" y="160" width="156" height="14" fill="#0ea5e9" rx="3"/>
<text x="450" y="171" font-size="10" fill="currentColor">65% SEO</text>
</g>
</svg>
<figcaption>Barras grises: escala máxima. Azul: peso SEO. Verde: peso AEO en esa fila.</figcaption>
</figure>
`);

  h2("Ejemplo lado a lado: misma intención, dos redacciones");
  h3("Versión solo «SEO de los años 2010»");
  blocks.push(
    `<blockquote>«Somos líderes en soluciones innovadoras de máxima calidad para el sector B2B con resultados probados y mejores prácticas.»</blockquote>`,
  );
  p(
    "Problema: no responde a ninguna pregunta concreta; es jerga vacía. Google y un modelo de lenguaje tienen poco anclaje factual.",
  );
  h3("Versión equilibrada SEO + AEO");
  blocks.push(
    `<blockquote>«Ayudamos a tiendas Shopify a reducir devoluciones por talla un 18% de media (últimos 12 meses, n=120) con un asistente de tallas y fichas que unifican medidas EU/US/UK. Implementación en 2–4 semanas; requiere feed de producto y política de cambios actualizada.»</blockquote>`,
  );
  p(
    "Aquí hay entidad (Shopify), promesa medible, alcance y límites. Eso alimenta snippets útiles y reduce ambigüedad para sistemas que resumen.",
  );

  h2("Sección interactiva: desplegable por objetivo");
  p(
    "Usa los bloques siguientes como micro-workshop. Abre solo el que coincida con tu situación actual.",
  );
  blocks.push(`
<details>
<summary>Soy ecommerce y vendo en marketplace + web propia</summary>
<p>Duplica esfuerzos con sentido: en marketplace prioriza títulos y bullets alineados a reglas del canal; en tu web construye páginas de categoría con tablas comparativas y FAQs que expliquen envíos, garantías y compatibilidad. El AEO gana cuando la misma información no se contradice entre canal y dominio.</p>
<ul>
<li>Unifica atributos críticos (peso, dimensiones, materiales) en una fuente de verdad.</li>
<li>Evita copiar/pegar descripciones genéricas del fabricante sin valor añadido.</li>
<li>Marca con datos estructurados solo lo que el usuario ve en pantalla.</li>
</ul>
</details>
<details>
<summary>Soy SaaS B2B con ciclo largo</summary>
<p>El SEO se apoya en páginas de solución, casos de uso y comparativas «nosotros vs status quo». El AEO mejora cuando cada página responde en la primera pantalla: ¿para quién es?, ¿qué problema resuelve?, ¿qué no hace?, ¿cuánto cuesta aproximadamente?</p>
<ul>
<li>Glosario interno enlazado: define acrónimos una sola vez y reutiliza la misma definición.</li>
<li>Publica límites honestos: los modelos de IA castigan menos la transparencia que el marketing vapor.</li>
</ul>
</details>
<details>
<summary>Soy negocio local (franquicia, clínica, servicios)</summary>
<p>Local SEO sigue siendo rey para mapas y packs. El AEO ayuda cuando las preguntas son «¿citan seguro médico?», «¿horario en festivos?» o «¿qué incluye la primera visita?». Escribe esas respuestas en texto plano, no solo en imágenes.</p>
</details>
`);

  h2("Señales que Google y los sistemas de IA comparten");
  ul(
    [
      "Contenido útil, específico y verificable; mejor una cifra con metodología que diez adjetivos.",
      "Jerarquía clara: un H1, H2 que funcionen como índice, párrafos cortos.",
      "Enlaces internos que refuercen relaciones semánticas entre entidades (marca, producto, categoría).",
      "Velocidad y estabilidad: una respuesta correcta en una web rota no convierte.",
      "Coherencia NAP y datos legales en local y fichas de producto.",
    ],
    blocks,
  );

  h2("Errores frecuentes al «hacer AEO» sin base SEO");
  ul(
    [
      "Publicar bloques FAQ ocultos o irrelevantes solo para marcar schema.",
      "Sobrecargar sinónimos pensando que «más keywords» ayudan a la IA (suele aumentar ruido).",
      "Ignorar el rastreo: páginas huérfanas o bloqueadas por robots no aportan señal en ningún lado.",
      "Confundir voz de marca con vaguedad: puedes ser elegante y preciso al mismo tiempo.",
    ],
    blocks,
  );

  h2("Métricas: qué mirar en cada pilar");
  blocks.push(`
<div style="overflow-x:auto">
<table>
<thead>
<tr><th>SEO</th><th>AEO (proxy práctico)</th></tr>
</thead>
<tbody>
<tr><td>Search Console: consultas, impresiones, CTR</td><td>Encuestas a clientes: «¿cómo nos encontraste?» incluyendo asistentes</td></tr>
<tr><td>Core Web Vitals y tasa de rebote por landing</td><td>Consistencia de respuestas: auditoría manual de prompts frecuentes en tu categoría</td></tr>
<tr><td>Backlinks y autoridad de dominio</td><td>Presencia en fuentes que suelen resumirse (documentación pública, guías citables)</td></tr>
</tbody>
</table>
</div>
`);
  p(
    "Ninguna herramienta te dará un «ranking en un asistente concreto» fiable al 100%. Usa proxies: branded search, menciones cualitativas y pruebas controladas con preguntas estándar en tu vertical.",
  );

  h2("Roadmap en cuatro fases (8 semanas, plantilla)");
  ol(
    [
      "<strong>Auditoría técnica y semántica</strong>: indexación, duplicados, datos estructurados alineados con lo visible.",
      "<strong>Mapa de preguntas</strong>: extrae PAA, foros, soporte y llamadas de ventas; prioriza por volumen e ingreso.",
      "<strong>Contenido en bloques</strong>: cada URL debe contestar una pregunta principal y dos secundarias sin solaparse con otras URLs canónicas.",
      "<strong>Mediciones y refino</strong>: revisión quincenal de páginas piloto; actualiza cifras y fechas para mantener frescura.",
    ],
    blocks,
  );

  h2("De dónde sale el AEO y por qué importa ahora");
  p(
    "Los buscadores llevan años mostrando respuestas directas: knowledge panels, fragmentos destacados y People Also Ask. Lo que cambia en la mitad de la década de 2020 es la <strong>densidad de síntesis</strong>: el usuario recibe un párrafo armado por un modelo a partir de múltiples fuentes. Ahí el AEO deja de ser «opcional creativo» y pasa a ser higiene de marca: si tu sitio no dice con claridad qué vendes, a quién y bajo qué condiciones, un resumen automático tenderá a promediar el sector o a citar al competidor que sí lo explicó mejor.",
  );
  p(
    "Esto no anula el SEO técnico. De hecho, un crawl limpio, un sitemap coherente y una arquitectura de enlaces internos ayudan a que tanto Google como otros sistemas descubran tus definiciones y FAQs. El error habitual es crear una «capa AEO» de preguntas y respuestas en el footer mientras las páginas de producto siguen siendo PDFs escaneados o galerías sin texto: la IA no puede adivinar lo que no está escrito.",
  );

  h2("Plantilla mental: la página perfecta para SEO y AEO");
  h3("Encabezado y lead");
  p(
    "Las primeras 160 palabras deberían contener la promesa, el público y un verbo de acción o resultado. Evita la voz pasiva cuando describas responsabilidades (quién implementa, quién mantiene, quién responde ante incidencias).",
  );
  h3("Cuerpo en capas");
  p(
    "Primera capa: respuesta corta (dos o tres frases). Segunda capa: prueba (cifra, metodología, fuente). Tercera capa: objeciones frecuentes en formato pregunta-respuesta. Cuarta capa: profundidad técnica o legal solo para quien despliegue un acordeón o salte a ancla.",
  );
  h3("Cierre");
  p(
    "Un solo siguiente paso: demo, comparador, calculadora o contacto. Múltiples CTAs competidoras diluyen tanto la conversión como la señal semántica de «qué esperas que haga el visitante».",
  );

  h2("Matriz: ¿qué priorizo esta semana?");
  blocks.push(`
<div style="overflow-x:auto">
<table>
<thead>
<tr><th>Situación</th><th>Prioridad 1 (SEO)</th><th>Prioridad 1 (AEO)</th></tr>
</thead>
<tbody>
<tr><td>Tráfico plano pero buen producto</td><td>Ampliar clusters de contenido y enlaces internos</td><td>Reescribir páginas piloto con FAQs honestas y datos comparables</td></tr>
<tr><td>Muchas impresiones, poco CTR</td><td>Retítulos y meta descripciones alineados a intención</td><td>Primer párrafo que responda la query literal en lenguaje natural</td></tr>
<tr><td>Buen tráfico, pocas conversiones</td><td>Velocidad y claridad de precio/envío</td><td>Eliminar contradicciones entre landing, checkout y políticas</td></tr>
<tr><td>Lanzamiento reciente</td><td>Indexación, canonicals, sitemap</td><td>Página «qué es X» con definición estable (URL que no rote cada mes)</td></tr>
</tbody>
</table>
</div>
`);

  h2("Glosario express (desplegable)");
  blocks.push(`
<details>
<summary>Términos que sueles ver junto a AEO</summary>
<ul>
<li><strong>Answer surface</strong>: cualquier interfaz que muestre una respuesta sin listar solo enlaces (resúmenes, paneles, voz).</li>
<li><strong>Grounding</strong>: anclar una afirmación de IA a fuentes verificables; en web pública, eso suele ser tu propio contenido citables.</li>
<li><strong>Entity</strong>: persona, marca, producto o concepto que los sistemas intentan desambiguar; consistencia de nombre ayuda.</li>
<li><strong>Information gain</strong>: aportar datos que no están en las diez primeras URLs genéricas de tu sector.</li>
</ul>
</details>
`);

  h2("Mini caso (ficticio) aplicado en 30 días");
  p(
    "Una tienda de componentes de bicicleta tenía 2.000 SKUs con descripciones del fabricante. Semana 1: canonicals y faceted navigation revisados. Semana 2: diez categorías piloto con tabla «compatible con / no compatible con» y un párrafo de mantenimiento. Semana 3: guía de tallas unificada enlazada desde todas las fichas relevantes. Semana 4: monitorización de consultas de marca y ajuste de la primera respuesta visible en home y categoría. El SEO midió CTR y posición; el proxy AEO fue reducción de preguntas repetitivas al soporte (-22% en el ejemplo ficticio) y mayor precisión en demos internas con prompts estándar del sector.",
  );
  p(
    "No necesitas datos perfectos para empezar: necesitas <strong>dejar de mentir por omisión</strong> (envíos, plazos, exclusiones). Eso es branding y es AEO al mismo tiempo.",
  );

  h2("Preguntas frecuentes (desplegables)");
  blocks.push(`
<details>
<summary>¿El AEO es solo para grandes marcas?</summary>
<p>No. Las marcas pequeñas ganan cuando son la fuente más clara en un nicho estrecho. La IA no «prefiere» corporaciones; tiende a sintetizar lo que está mejor explicado y corroborado.</p>
</details>
<details>
<summary>¿Debo abandonar el link building?</summary>
<p>No si tu mercado es competitivo. Los enlaces siguen siendo señal de confianza para buscadores y, de forma indirecta, aumentan la probabilidad de que tu contenido sea descubierto y citado.</p>
</details>
<details>
<summary>¿JSON-LD sustituye a buen copy?</summary>
<p>No. El marcado ayuda a empaquetar información ya visible; si mientes o exageras en schema, te expones a penalizaciones y a respuestas de IA incoherentes con tu web.</p>
</details>
<details>
<summary>¿ListingBoost encaja con SEO y AEO?</summary>
<p>Sí: el producto está pensado para analizar URL, competencia y catálogo, y generar textos optimizados que mejoren el posicionamiento en Google y sean más fáciles de interpretar por buscadores y sistemas de IA —siempre con revisión humana cuando el riesgo legal o de marca lo exija.</p>
</details>
`);

  h2("Conclusión");
  p(
    "SEO y AEO convergen en una sola idea incómoda pero liberadora: <strong>deja de escribir para algoritmos abstractos y empieza a escribir para preguntas reales</strong>, con pruebas, límites y estructura. El SEO te lleva el clic; el AEO te prepara para un mundo donde muchas respuestas se leen sin clic. Necesitas ambos tableros, no dos equipos enfrentados.",
  );
  p(
    "Si quieres pasar de teoría a ejecución, prueba ListingBoost: analizamos tu web, tu SEO y tu competencia para generar contenido que mejora tu visibilidad en Google y refuerza cómo los sistemas de IA entienden tu oferta.",
  );

  return blocks.join("\n");
}

function ul(items: string[], blocks: string[]) {
  blocks.push(`<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`);
}

function ol(items: string[], blocks: string[]) {
  blocks.push(`<ol>${items.map((i) => `<li>${i}</li>`).join("")}</ol>`);
}
