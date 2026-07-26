# Design

Sistema visual del portafolio. Registro **brand**, plataforma **web**.
Estrategia de color: **Committed** — el neón y el celeste cargan la identidad sobre superficie oscura; el ámbar es el acento raro reservado a lo que importa.

Escena que ancla el sistema: *un café a las once de la noche, lluvia en la ventana, un letrero de neón afuera, musgo en la maceta de la mesa.*

---

## Theme

Oscuro, sin alternativa clara. No es una preferencia de moda: el mundo de la marca es una ciudad de noche y un café con lluvia, y ese mundo no existe en modo claro. No hay theme toggle.

El fondo no es negro puro. Lleva tinte verde-azul (hue 205) para que la noche sea húmeda y no de vacío.

---

## Color

Todos los tokens en OKLCH. Los ratios están calculados, no estimados.

```css
@theme {
  /* Superficies */
  --color-bg:        oklch(0.16 0.020 205);  /* #031011 */
  --color-surface:   oklch(0.21 0.024 203);  /* #0a1c1d */
  --color-surface-2: oklch(0.26 0.026 202);  /* #142829 */
  --color-line:      oklch(0.34 0.024 200);  /* #293c3d */

  /* Tinta */
  --color-ink:       oklch(0.95 0.010 200);  /* #e7f1f1 */
  --color-ink-2:     oklch(0.78 0.014 200);  /* #aebabb */
  --color-ink-3:     oklch(0.66 0.016 200);  /* #879596 */

  /* Marca */
  --color-neon:      oklch(0.84 0.130 192);  /* #42e5e0 — primario */
  --color-celeste:   oklch(0.80 0.110 240);  /* #78c7fd — secundario */
  --color-moss:      oklch(0.55 0.119 160);  /* #148659 — estructural */
  --color-moss-text: oklch(0.72 0.115 160);  /* #5bbb8c — musgo legible */
  --color-amber:     oklch(0.78 0.100 62);   /* #e6a973 — cálido, ≤5% */
}
```

### Contraste verificado

| Token | vs `bg` | vs `surface` | vs `surface-2` |
|---|---|---|---|
| `ink` | 16.78 | 15.27 | 13.36 |
| `ink-2` | 9.72 | 8.85 | 7.74 |
| `ink-3` | 6.26 | 5.70 | 4.99 |
| `neon` | 12.46 | 11.34 | 9.92 |
| `celeste` | 10.51 | 9.57 | 8.37 |
| `amber` | 9.47 | 8.62 | 7.54 |
| `moss-text` | 8.21 | 7.47 | 6.53 |
| `moss` | 4.23 | 3.85 | 3.37 |

**`--color-moss` está prohibido como color de texto.** Falla 4.5:1 contra toda superficie. Es color estructural: rellenos, bordes, ilustración, celdas del heatmap, siluetas de bosque. Cuando el musgo tenga que ser texto o ícono fino, se usa `--color-moss-text`.

`--color-ink-3` es el piso absoluto de la rampa. Nada más tenue existe. Si un texto parece necesitar menos presencia, la solución es tamaño o peso, no un gris más claro.

### Reparto

- `bg` domina. `surface` para paneles de proyecto y widgets; `surface-2` solo para elementos dentro de un panel (chips, celdas, campos). No hay tercer nivel de anidación.
- `neon` es el primario: enlaces, foco, acento de encabezado, celdas activas del heatmap, subrayados. Es abundante pero nunca es fondo de bloques grandes.
- `celeste` acompaña al neón como segunda voz —etiquetas de tecnología, estados secundarios, la gradación media del heatmap. Nunca compite por la misma jerarquía en la misma vista.
- `moss` es la tierra: bordes de widgets, ilustración de bosque, las celdas bajas del heatmap, la textura.
- `amber` no pasa del 5% de la superficie de ninguna pantalla. Se reserva para el CTA de contacto y para un único dato destacado por página. Es la lámpara del café; si hay dos lámparas, deja de significar algo.

Sobre relleno de `neon` o `amber`, el texto es `--color-bg` (12.46 y 9.47 respectivamente).

---

## Typography

Tres familias, cada una con un trabajo distinto. Todas self-hosted (`@fontsource` o descarga de Fontshare con subsetting) — sin peticiones a CDN externo.

| Rol | Familia | Pesos | Especificación |
|---|---|---|---|
| Display | Cabinet Grotesk | 800 | `clamp(2.5rem, 6vw, 4.5rem)` · `letter-spacing: -0.03em` · `text-wrap: balance` |
| Cuerpo | Supreme | 400, 500 | `1.0625rem` · `line-height: 1.65` · máx `68ch` · `text-wrap: pretty` |
| Micro | Sono | 400, 600 | `0.8125rem` · etiquetas, timestamps, metadata de widgets, código |

Escala modular ratio **1.25**:
`0.8125 · 0.9375 · 1.0625 · 1.3125 · 1.625 · 2.0625 · 2.5625 · 3.1875rem`

Encabezados h1–h3 con `text-wrap: balance`; prosa larga con `text-wrap: pretty`. El `line-height` del cuerpo ya incluye el +0.05 que pide el texto claro sobre fondo oscuro.

Sono existe porque el contenido es técnico (commits, snippets, nombres de repo) y porque los sellos pixelados del mundo Y2K necesitan una voz monoespaciada. No es disfraz de "developer": si un texto no es dato técnico ni etiqueta, no va en Sono.

---

## Spacing & Layout

Base 4px. Escala: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`.

- Padding vertical de sección: `clamp(4rem, 10vw, 9rem)`. El ritmo se **varía** a propósito —separaciones generosas entre mundos, agrupaciones apretadas dentro de uno. Secciones equiespaciadas leen como plantilla.
- Contenedor principal: `max-width: 1120px`. Prosa: `68ch`.
- Grids sin breakpoints: `repeat(auto-fit, minmax(280px, 1fr))`.
- Flexbox para una dimensión, Grid para dos. Grid no es el default.
- El hero y la línea de tiempo rompen la retícula deliberadamente. El resto la respeta; si todo es asimétrico, nada destaca.

### Radios

```css
--radius-sm: 4px;    /* chips, inputs, celdas del heatmap */
--radius-md: 10px;   /* paneles de proyecto */
--radius-lg: 18px;   /* widgets, stickers */
--radius-full: 999px;
```

La forma codifica el tono: los widgets son redondeados porque son la parte con personalidad; los bloques de contenido técnico son más rectos porque ahí se habla en serio.

### z-index

Escala semántica, nunca valores arbitrarios:

```css
--z-base: 0; --z-sticker: 10; --z-sticky: 20;
--z-overlay: 30; --z-modal: 40; --z-toast: 50; --z-tooltip: 60;
```

---

## Motion

```css
--ease: cubic-bezier(0.22, 1, 0.36, 1);   /* ease-out-quint */
--dur-fast: 150ms; --dur-base: 240ms; --dur-slow: 420ms;
```

- **Lluvia**: canvas propio en el hero, isla Astro, ~40 líneas. Se pausa fuera de viewport y en pestaña oculta.
- **Respiración del neón**: pulso lento de opacidad y `box-shadow` en el acento principal. Uno por página.
- **Stagger** en la lista de proyectos y en las celdas del heatmap. Cada revelado corresponde a lo que revela; no hay un fade-in idéntico aplicado a cada sección.
- **El contenido nace visible.** Las animaciones de entrada mejoran un estado ya renderizado; nunca se oculta contenido esperando una clase. Una pestaña en segundo plano o un renderizador headless debe ver la página completa.
- El glow es `box-shadow` contenido con el color del acento, no un blur decorativo. Nada de brillos sin propósito.

```css
@media (prefers-reduced-motion: reduce) {
  /* lluvia estática, sin respiración, transiciones a 1ms o crossfade */
}
```

---

## Components

- **Panel de proyecto** — no una tarjeta genérica. Título, una línea de qué es, stack en chips Sono, y **lo que enseñó** como campo de primera clase con peso visual propio. Los paneles varían de tamaño según el peso del proyecto; una retícula de tarjetas idénticas está prohibida.
- **Heatmap de contribuciones** — celdas `--radius-sm` en rampa `surface-2 → moss → celeste → neon`. Cada celda lleva `title` y `aria-label` con fecha y conteo. El color nunca es el único portador del dato.
- **Widget** — `--radius-lg`, borde `--color-moss`, cabecera en Sono. Cuatro tipos: heatmap, "aprendiendo ahora" (curado a mano en Markdown), último commit / repo activo (build-time), stickers.
- **Stickers** — SVG propios de las referencias personales (Snoopy, Bluey, gato, Joy-Con, taza de Coffee Talk), arrastrables, `--z-sticker`. Decorativos: `aria-hidden`, nunca portan información.
- **Chip de tecnología** — `surface-2` con texto `neon` o `celeste`. Sin íconos de logo de terceros.
- **Línea de tiempo** — el eje de progreso. Rompe la retícula, avanza asimétrica, marca por semestre o por proyecto.
- **Guestbook** — giscus sobre GitHub Discussions. Hereda los tokens vía tema propio, no el default de giscus.

---

## Bans

Coincidir y rehacer. Si estás por escribir esto, el elemento se reestructura.

- Texto con gradiente (`background-clip: text`).
- Glassmorphism decorativo.
- `border-left` / `border-right` de color como acento.
- Eyebrow en mayúsculas con tracking encima de cada sección. Una etiqueta fuerte como sistema propio es voz; repetirla como gramática de sección es andamio.
- Numeración `01 / 02 / 03` como estructura de sección. Solo si la sección **es** una secuencia real.
- Retículas de tarjetas idénticas.
- Emojis como decoración de sección. La personalidad va en los stickers SVG, que son propios.
- Gradientes y brillos sin propósito.
- Plantilla hero-métrica (número gigante, etiqueta chica, stats de apoyo).
- Texto que desborda su contenedor. Se prueba el copy real en cada breakpoint.
- `--color-moss` como color de texto.
- Fuentes vetadas: Inter, Space Grotesk, Space Mono, IBM Plex (cualquiera), DM Sans, Poppins, Outfit, Plus Jakarta Sans, Instrument Sans/Serif, Fraunces, Playfair Display, Cormorant.

---

## Accessibility

- Contraste según la tabla de arriba. Cualquier token nuevo se verifica con cálculo antes de entrar.
- Foco: anillo `2px` `--color-neon` con `outline-offset: 2px`. Nunca `outline: none` sin reemplazo.
- Landmarks semánticos y skip link al contenido.
- El heatmap y cualquier dato codificado por color llevan texto o `aria-label` equivalente.
- `prefers-reduced-motion` cubierto en todo lo que se mueve.
- Los stickers son `aria-hidden`; el contenido sobrevive sin ellos.
