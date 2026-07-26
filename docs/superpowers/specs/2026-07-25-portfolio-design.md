# Portafolio personal — lenguaje de diseño y fundación técnica

**Fecha:** 2026-07-25
**Estado:** aprobado
**Alcance:** fundación. Este spec cubre el lenguaje visual, las reglas de sistema y el stack. **No** cubre el contenido de los proyectos ni la arquitectura de páginas; esos se definen en un spec posterior.

---

## Problema

Un estudiante de Ingeniería en Sistemas necesita exponer proyectos, capacidades y conocimientos (SDK, IDEs, frameworks, lenguajes, herramientas de IA) de forma visual y con huella personal fuerte.

El sitio no compite con LinkedIn ni con el CV: no está optimizado para el escaneo de un reclutador. Su audiencia es la comunidad dev —compañeros, profesores, gente de open source— y su eje narrativo es el **progreso**, no el catálogo de logros.

Restricción dura: **sin servidor**. Nada de costos recurrentes de infraestructura.

---

## Decisiones

### 1. Stack

Astro 5 + Tailwind CSS 4.

| Pieza | Elección | Por qué |
|---|---|---|
| Framework | Astro 5 | Salida HTML estática, cero JS por default, islas solo donde hace falta. El sitio es pesado en contenido y ligero en interacción; este es exactamente su caso de uso. |
| Estilos | Tailwind CSS 4 | Tokens declarados en `@theme` (CSS-first), sin `tailwind.config.js`. Los tokens de DESIGN.md son la única fuente de verdad. |
| Contenido | Content Collections + Zod | Cada proyecto es un `.mdx` con schema validado. Agregar un proyecto es agregar un archivo, no duplicar markup. |
| Motion | `motion` (Motion One) | Orquestación y stagger. CSS puro donde CSS alcanza. |
| Lluvia | Canvas propio (~40 líneas) | Una librería de partículas para esto pesa más que el efecto. |
| Íconos | `astro-icon` + Lucide | Solo para chrome de UI. Los stickers de personalidad son SVG propios. |
| Fuentes | Self-hosted (`@fontsource` / Fontshare con subsetting) | Sin peticiones a CDN externo: sin FOUT, sin dependencia de terceros, mejor privacidad. |
| Guestbook | giscus | Los mensajes viven en GitHub Discussions del repo. Sin servidor, sin base de datos, sin costo. La audiencia es dev, así que el requisito de cuenta de GitHub no filtra a nadie relevante. |
| Datos dinámicos | GitHub API en build + GitHub Actions cron diario | Único camino a datos frescos sin servidor. |
| Deploy | GitHub Pages vía Actions | El cron diario que refresca los datos de GitHub ya obliga a tener Actions. Desplegar desde el mismo workflow evita una plataforma más. Repo público, así que los minutos de Actions son gratis e ilimitados. |
| Calidad | `@astrojs/check`, ESLint, Prettier | Type checking sobre `.astro` incluido. |

**Alternativas descartadas:** Next.js con `output: 'export'` (manda más JS al cliente sin aportar nada sin servidor); Vite + React SPA (peor primer render y SEO, todo el sitio en un bundle); HTML/CSS/JS puro (escala mal —cada proyecto nuevo obliga a duplicar markup a mano).

**Cloudflare Pages fue la elección inicial y se descartó.** Sus ventajas reales —ancho de banda ilimitado, previews por rama— no aplican: el tráfico esperado no roza los 100 GB mensuales de GitHub Pages, y el trabajo es de una sola persona mergeando a `main`. A cambio evitamos una plataforma más que mantener. El único costo asumido es quedarse sin deploy previews por PR.

**Pendiente de decisión, con impacto en la configuración:** GitHub Pages sirve el repo `portfolio` bajo `eddieberu.github.io/portfolio`, lo que obliga a fijar `base: '/portfolio'` en `astro.config.mjs`. Servir desde la raíz requiere renombrar el repo a `EddieBeru.github.io` o apuntar un dominio propio. Hay que decidirlo antes de configurar el proyecto: cambiar `base` después rompe todos los enlaces internos y las rutas de assets.

### 2. Lenguaje visual

Definido por completo en `DESIGN.md`. Resumen de las decisiones que lo anclan:

- **Tema oscuro sin alternativa clara.** El mundo de la marca es una ciudad de noche y un café con lluvia; ese mundo no existe en modo claro. Sin theme toggle.
- **Estrategia de color: Committed.** Neón verde agua (`oklch(0.84 0.130 192)`) y azul celeste cargan la identidad sobre superficie oscura tintada de verde-azul. Verde musgo como tierra estructural. Un solo cálido —ámbar de lámpara— limitado al 5% de la superficie.
- **Tres familias tipográficas** con trabajos distintos: Cabinet Grotesk (display), Supreme (cuerpo), Sono (micro y código). Ninguna aparece en las listas de fuentes saturadas por generación automática.
- **Ritmo variado, no uniforme.** El espaciado de sección se varía a propósito; el hero y la línea de tiempo rompen la retícula, el resto la respeta.
- **Motion con intención.** Lluvia en el hero, respiración del neón, stagger en listas. Sin fade-on-scroll universal. El contenido nace visible.

### 3. Widgets

Gramática de blog personal Y2K: el sitio es un espacio con dueño, con rincones y widgets, no una landing corporativa.

**Regla que los define: presumen el trabajo, nunca la vida.** Nada de actividad en vivo, ubicación, reproducción actual ni telemetría personal.

| Widget | Fuente de datos | Frescura |
|---|---|---|
| Heatmap de contribuciones | GitHub API en build | Diaria vía Actions cron |
| Último commit / repo activo | GitHub API en build | Diaria vía Actions cron |
| "Aprendiendo ahora" | Markdown curado a mano | Cuando el autor lo edita |
| Stickers de gustos | SVG propios estáticos | — |

El heatmap redibuja la cuadrícula de GitHub en la paleta del sitio (`surface-2 → moss → celeste → neon`). Cada celda lleva `title` y `aria-label`: el color nunca es el único portador del dato.

Los stickers (Snoopy, Bluey, gato, Joy-Con, taza de Coffee Talk) son arrastrables, `aria-hidden` y puramente decorativos. Son la huella de personalidad y no exponen ninguna información.

### 4. Accesibilidad

Contraste calculado, no estimado. La tabla verificada vive en `DESIGN.md`. Dos consecuencias que cambiaron los tokens propuestos:

- `--color-ink-3` subió de L `0.63` a `0.66`: a `0.63` daba 4.43:1 contra `surface-2` y fallaba el mínimo de 4.5:1.
- `--color-moss` quedó **prohibido como color de texto** (4.23:1 contra el fondo). Es estructural. Existe `--color-moss-text` en L `0.72` para cuando el musgo deba ser legible.

`prefers-reduced-motion` es soporte de primera clase: apaga lluvia y respiración, deja crossfade o transición instantánea.

---

## Riesgos

- **El neón oscuro es territorio saturado.** Un portafolio dev oscuro con acento cian es el reflejo obvio de la categoría. La defensa es la especificidad: la calidez del ámbar, el musgo estructural, los stickers propios, los widgets Y2K y la línea de tiempo de progreso. Si en revisión el sitio se puede confundir con cualquier otro portafolio oscuro, la dirección falló y hay que empujar más los elementos propios, no el neón.
- **Los datos build-time envejecen hasta 24h.** Aceptable: "hace 1 día" no debilita el argumento del progreso. Si el cron falla, el sitio muestra el último dato bueno en lugar de romperse.
- **Los widgets Y2K viven cerca del cringe.** El calibrado es la diferencia. La regla operativa: cada widget debe comunicar algo real sobre el trabajo. Un widget sin dato es decoración y se elimina.
- **giscus depende de que GitHub Discussions siga siendo gratis y público.** Riesgo bajo; el fallback es quitar el guestbook sin tocar nada más.

---

## Siguiente

Spec de contenido y arquitectura de páginas: qué proyectos entran, cómo se estructura una página de proyecto, cómo se representa la línea de tiempo, y cómo se modela el inventario de conocimientos (lenguajes, frameworks, SDK, IDEs, herramientas de IA).
