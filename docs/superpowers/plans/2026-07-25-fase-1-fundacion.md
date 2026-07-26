# Fase 1 — Fundación Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Un sitio Astro que compila y se despliega solo en GitHub Pages, con los tokens de `DESIGN.md` verificados por test, las tres tipografías self-hosted y un layout base accesible.

**Architecture:** Astro genera HTML estático sin JavaScript por defecto. Tailwind 4 lee los tokens desde un bloque `@theme` en CSS, sin archivo de configuración JS. Los tokens de color no se confían a la revisión visual: un test de Vitest parsea `tokens.css`, convierte OKLCH a sRGB y falla el build si algún par de colores baja del mínimo de contraste. Un workflow de GitHub Actions compila y publica.

**Tech Stack:** Astro 7 · Tailwind CSS 4 (`@tailwindcss/vite`) · Vitest 4 · TypeScript · pnpm · GitHub Actions

## Global Constraints

Aplican a cada tarea de este plan, sin excepción.

- **Fuente de verdad del diseño:** `DESIGN.md` en la raíz. Ningún valor de color, tipografía o espaciado se inventa; se copia de ahí.
- **Contraste:** texto de cuerpo ≥ 4.5:1, texto grande ≥ 3:1, contra cada superficie donde el token pueda aparecer.
- **`--color-moss` está prohibido como color de texto.** Da 4.23:1 contra el fondo. Para musgo legible existe `--color-moss-text`.
- **`--color-ink-3` es el piso de la rampa de tinta.** No existe nada más tenue.
- **Fuentes vetadas**, en cualquier archivo del proyecto: Inter, Space Grotesk, Space Mono, IBM Plex (cualquiera), DM Sans, Poppins, Outfit, Plus Jakarta Sans, Instrument Sans, Instrument Serif, Fraunces, Playfair Display, Cormorant.
- **Sin peticiones a CDN externo** para fuentes. Todo self-hosted.
- **Tema oscuro único.** No hay theme toggle ni bloque `prefers-color-scheme: light`.
- **`astro.config.mjs` lleva `site` pero no `base`.** El repo es `EddieBeru.github.io` y se sirve desde la raíz.
- **Sin atribución de IA** en ningún commit ni archivo generado.
- **Gestor de paquetes: pnpm.**
- Los archivos ya existentes en el repo (`PRODUCT.md`, `DESIGN.md`, `docs/`, `src/assets/`) no se tocan ni se mueven.

---

### Task 1: Proyecto Astro con tokens verificados por test

El entregable no es "el proyecto compila", es "los tokens de color son demostrablemente correctos". El andamiaje va incluido porque el test lo necesita.

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `src/lib/color.ts`
- Create: `src/styles/tokens.css`
- Test: `tests/tokens.test.ts`

**Interfaces:**
- Consumes: nada. Es la primera tarea.
- Produces:
  - `src/lib/color.ts` exporta `parseOklch(value: string): Oklch`, `oklchToSrgb(c: Oklch): [number, number, number]`, `contrast(a: Oklch, b: Oklch): number`, y el tipo `Oklch = { l: number; c: number; h: number }`.
  - `src/styles/tokens.css` define el bloque `@theme` con todos los tokens de `DESIGN.md`. Las tareas siguientes importan este archivo y usan las utilidades de Tailwind derivadas (`bg-bg`, `text-ink`, `border-line`, etc.).

- [ ] **Step 1: Crear `package.json`**

Se escribe a mano en vez de usar `pnpm create astro` porque el directorio ya tiene contenido (`docs/`, `src/assets/`, los `.md` de la raíz) y el scaffolder pide confirmación interactiva sobre un directorio no vacío.

```json
{
  "name": "eddieberu-portfolio",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run"
  },
  "dependencies": {
    "astro": "^7.1.3"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.9",
    "@tailwindcss/vite": "^4.3.3",
    "tailwindcss": "^4.3.3",
    "typescript": "^5.9.0",
    "vitest": "^4.1.10"
  }
}
```

- [ ] **Step 2: Crear `astro.config.mjs`**

Tailwind 4 se conecta como plugin de Vite. La integración `@astrojs/tailwind` es de la era de Tailwind 3 y no se usa aquí.

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://eddieberu.github.io',
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 3: Crear `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Crear `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
```

- [ ] **Step 5: Instalar dependencias**

Run: `pnpm install`
Expected: instala sin errores. Verificar que `astro` quedó en versión 7.x con `pnpm list astro`.

- [ ] **Step 6: Escribir el test que falla**

Este test es la razón de ser de la tarea. Convierte cada token OKLCH a sRGB, calcula el contraste WCAG y verifica los mínimos. Los valores esperados salen de la tabla ya calculada en `DESIGN.md`.

Create `tests/tokens.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { contrast, parseOklch } from '../src/lib/color';

const css = readFileSync('src/styles/tokens.css', 'utf8');

function token(name: string) {
  const match = css.match(new RegExp(`--color-${name}:\\s*(oklch\\([^)]*\\))`));
  if (!match) throw new Error(`Falta el token --color-${name} en tokens.css`);
  return parseOklch(match[1]);
}

const surfaces = ['bg', 'surface', 'surface-2'] as const;
const bodyText = ['ink', 'ink-2', 'ink-3', 'neon', 'celeste', 'amber', 'moss-text'] as const;

describe('contraste de tokens', () => {
  it.each(bodyText)('%s cumple 4.5:1 contra toda superficie', (name) => {
    const fg = token(name);
    for (const surface of surfaces) {
      expect(contrast(fg, token(surface))).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('ink-3 es el piso de la rampa: nada entre ink-3 y las superficies', () => {
    const ink3 = contrast(token('ink-3'), token('surface-2'));
    expect(ink3).toBeGreaterThanOrEqual(4.5);
    expect(ink3).toBeLessThan(6);
  });

  it('moss no alcanza 4.5:1 y por eso está prohibido como texto', () => {
    expect(contrast(token('moss'), token('bg'))).toBeLessThan(4.5);
  });

  it('el fondo sobre relleno neón o ámbar es legible', () => {
    expect(contrast(token('bg'), token('neon'))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token('bg'), token('amber'))).toBeGreaterThanOrEqual(4.5);
  });
});

describe('guardas del sistema', () => {
  it('no declara un bloque de tema claro', () => {
    expect(css).not.toContain('prefers-color-scheme: light');
  });
});
```

- [ ] **Step 7: Correr el test y verificar que falla**

Run: `pnpm test`
Expected: FAIL. El error es de resolución de módulo — `Cannot find module '../src/lib/color'` — porque ni `color.ts` ni `tokens.css` existen todavía.

- [ ] **Step 8: Escribir `src/lib/color.ts`**

Conversión OKLab → sRGB lineal → sRGB con gamma, y luminancia relativa WCAG. Sin dependencias.

```ts
export type Oklch = { l: number; c: number; h: number };

export function parseOklch(value: string): Oklch {
  const match = value.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
  if (!match) throw new Error(`Valor OKLCH inválido: ${value}`);
  return { l: Number(match[1]), c: Number(match[2]), h: Number(match[3]) };
}

export function oklchToSrgb({ l, c, h }: Oklch): [number, number, number] {
  const rad = (h * Math.PI) / 180;
  const a = c * Math.cos(rad);
  const b = c * Math.sin(rad);

  const lCone = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const mCone = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const sCone = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;

  const linear = [
    4.0767416621 * lCone - 3.3077115913 * mCone + 0.2309699292 * sCone,
    -1.2684380046 * lCone + 2.6097574011 * mCone - 0.3413193965 * sCone,
    -0.0041960863 * lCone - 0.7034186147 * mCone + 1.707614701 * sCone,
  ];

  return linear.map((channel) => {
    const gamma =
      channel <= 0.0031308
        ? 12.92 * channel
        : 1.055 * Math.max(channel, 0) ** (1 / 2.4) - 0.055;
    return Math.min(1, Math.max(0, gamma));
  }) as [number, number, number];
}

function relativeLuminance(color: Oklch): number {
  const [r, g, b] = oklchToSrgb(color);
  const linearize = (channel: number) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

export function contrast(a: Oklch, b: Oklch): number {
  const [lighter, darker] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (lighter + 0.05) / (darker + 0.05);
}
```

- [ ] **Step 9: Escribir `src/styles/tokens.css`**

Los valores se copian literalmente de `DESIGN.md`. En Tailwind 4, `@theme` genera las utilidades: `--color-bg` produce `bg-bg`, `text-bg`, `border-bg`.

```css
@import 'tailwindcss';

@theme {
  /* Superficies */
  --color-bg: oklch(0.16 0.020 205);
  --color-surface: oklch(0.21 0.024 203);
  --color-surface-2: oklch(0.26 0.026 202);
  --color-line: oklch(0.34 0.024 200);

  /* Tinta */
  --color-ink: oklch(0.95 0.010 200);
  --color-ink-2: oklch(0.78 0.014 200);
  --color-ink-3: oklch(0.66 0.016 200);

  /* Marca */
  --color-neon: oklch(0.84 0.130 192);
  --color-celeste: oklch(0.80 0.110 240);
  --color-moss: oklch(0.55 0.119 160);
  --color-moss-text: oklch(0.72 0.115 160);
  --color-amber: oklch(0.78 0.100 62);

  /* Radios */
  --radius-sm: 4px;
  --radius-md: 10px;
  --radius-lg: 18px;
  --radius-full: 999px;

  /* Motion */
  --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
}

:root {
  /* Escala z semántica. Nunca valores arbitrarios. */
  --z-base: 0;
  --z-sticker: 10;
  --z-sticky: 20;
  --z-overlay: 30;
  --z-modal: 40;
  --z-toast: 50;
  --z-tooltip: 60;

  /* Duraciones */
  --dur-fast: 150ms;
  --dur-base: 240ms;
  --dur-slow: 420ms;
}
```

- [ ] **Step 10: Correr el test y verificar que pasa**

Run: `pnpm test`
Expected: PASS. Los diez casos verdes.

Si algún caso falla, el token está mal copiado de `DESIGN.md`. Se corrige el token, no el test: la tabla de `DESIGN.md` es la fuente de verdad y sus ratios ya fueron calculados.

- [ ] **Step 11: Añadir `dist/` y `.astro/` al `.gitignore`**

Ya están en el `.gitignore` existente. Verificar con `grep -E 'dist|\.astro' .gitignore` y añadir solo lo que falte.

- [ ] **Step 12: Commit**

```bash
git add package.json pnpm-lock.yaml astro.config.mjs tsconfig.json vitest.config.ts src/lib/color.ts src/styles/tokens.css tests/tokens.test.ts
git commit -m "feat: scaffold Astro project with contrast-verified tokens

Tokens from DESIGN.md live in a Tailwind 4 @theme block. A Vitest suite
converts each OKLCH value to sRGB and asserts the WCAG minimums, so a token
that fails contrast breaks the build instead of shipping.

Also encodes two system rules as tests: moss must stay below 4.5:1 to justify
its ban as a text color, and no light-theme block may exist."
```

---

### Task 2: Tipografías self-hosted

**Files:**
- Create: `src/fonts/` (archivos `.woff2` descargados a mano)
- Create: `src/styles/fonts.css`
- Modify: `src/styles/tokens.css` (añadir tokens de familia y escala)
- Test: `tests/fonts.test.ts`

**Interfaces:**
- Consumes: `src/styles/tokens.css` de la Task 1.
- Produces: los tokens `--font-display`, `--font-body`, `--font-micro` y la escala `--text-*`, disponibles como utilidades de Tailwind (`font-display`, `text-step-4`).

- [ ] **Step 1: Instalar Sono desde npm**

Sono está en Google Fonts y por tanto en Fontsource. Es la única de las tres que se instala.

Run: `pnpm add @fontsource-variable/sono`
Expected: instala `@fontsource-variable/sono@^5.3.0`.

- [ ] **Step 2: Descargar Cabinet Grotesk y Supreme a mano**

**Este paso es manual y no se puede automatizar.** Ninguna de las dos está en npm ni en Google Fonts: son de Fontshare (Indian Type Foundry), gratuitas para uso personal y comercial, pero solo por descarga desde el sitio.

1. Ir a `https://www.fontshare.com/fonts/cabinet-grotesk` y descargar la familia.
2. Ir a `https://www.fontshare.com/fonts/supreme` y descargar la familia.
3. De cada zip, copiar **solo los `.woff2`** de los pesos que el diseño usa, a `src/fonts/`:
   - `CabinetGrotesk-Extrabold.woff2` (800, display)
   - `Supreme-Regular.woff2` (400, cuerpo)
   - `Supreme-Medium.woff2` (500, cuerpo enfático)

No copiar `.ttf`, `.otf` ni `.woff`: pesan más y ningún navegador vigente los necesita.

Verificar: `ls src/fonts/` muestra exactamente esos tres archivos.

- [ ] **Step 3: Escribir el test que falla**

Create `tests/fonts.test.ts`:

```ts
import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const fontsCss = readFileSync('src/styles/fonts.css', 'utf8');
const tokensCss = readFileSync('src/styles/tokens.css', 'utf8');

const BANNED = [
  'Inter', 'Space Grotesk', 'Space Mono', 'IBM Plex', 'DM Sans', 'Poppins',
  'Outfit', 'Plus Jakarta', 'Instrument Sans', 'Instrument Serif', 'Fraunces',
  'Playfair Display', 'Cormorant',
];

describe('tipografías', () => {
  it('los tres archivos de Fontshare están descargados', () => {
    const files = readdirSync('src/fonts');
    expect(files).toContain('CabinetGrotesk-Extrabold.woff2');
    expect(files).toContain('Supreme-Regular.woff2');
    expect(files).toContain('Supreme-Medium.woff2');
  });

  it('solo sirve woff2', () => {
    for (const file of readdirSync('src/fonts')) {
      expect(file.endsWith('.woff2')).toBe(true);
    }
  });

  it('cada @font-face usa font-display: swap', () => {
    const faces = fontsCss.match(/@font-face\s*{[^}]*}/g) ?? [];
    expect(faces.length).toBeGreaterThan(0);
    for (const face of faces) {
      expect(face).toContain('font-display: swap');
    }
  });

  it('no pide fuentes a un CDN externo', () => {
    expect(fontsCss).not.toMatch(/https?:\/\//);
  });

  it.each(BANNED)('no usa la fuente vetada %s', (family) => {
    expect(fontsCss).not.toContain(family);
    expect(tokensCss).not.toContain(family);
  });

  it('declara los tres tokens de familia', () => {
    expect(tokensCss).toContain('--font-display');
    expect(tokensCss).toContain('--font-body');
    expect(tokensCss).toContain('--font-micro');
  });
});
```

- [ ] **Step 4: Correr el test y verificar que falla**

Run: `pnpm test tests/fonts.test.ts`
Expected: FAIL con `ENOENT: no such file or directory, open 'src/styles/fonts.css'`.

- [ ] **Step 5: Escribir `src/styles/fonts.css`**

```css
@font-face {
  font-family: 'Cabinet Grotesk';
  src: url('../fonts/CabinetGrotesk-Extrabold.woff2') format('woff2');
  font-weight: 800;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Supreme';
  src: url('../fonts/Supreme-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Supreme';
  src: url('../fonts/Supreme-Medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
```

Sono no necesita `@font-face` propio: Fontsource trae el suyo y se importa desde el layout en la Task 3.

- [ ] **Step 6: Añadir los tokens de tipografía a `src/styles/tokens.css`**

Dentro del bloque `@theme` ya existente, después de los radios:

```css
  /* Familias */
  --font-display: 'Cabinet Grotesk', system-ui, sans-serif;
  --font-body: 'Supreme', system-ui, sans-serif;
  --font-micro: 'Sono Variable', ui-monospace, monospace;

  /* Escala modular, ratio 1.25 */
  --text-step--1: 0.8125rem;
  --text-step-0: 1.0625rem;
  --text-step-1: 1.3125rem;
  --text-step-2: 1.625rem;
  --text-step-3: 2.0625rem;
  --text-step-4: 2.5625rem;
  --text-step-5: 3.1875rem;
  --text-display: clamp(2.5rem, 6vw, 4.5rem);
```

- [ ] **Step 7: Correr el test y verificar que pasa**

Run: `pnpm test`
Expected: PASS. Los tests de la Task 1 siguen verdes.

- [ ] **Step 8: Commit**

```bash
git add src/fonts src/styles/fonts.css src/styles/tokens.css tests/fonts.test.ts package.json pnpm-lock.yaml
git commit -m "feat: self-host the three typefaces

Sono comes from Fontsource. Cabinet Grotesk and Supreme are Fontshare
families with no npm package, so their woff2 files are vendored under
src/fonts and declared by hand.

Tests assert every face uses font-display swap, that nothing reaches an
external CDN, and that none of the banned default typefaces appear anywhere
in the stylesheets."
```

---

### Task 3: Layout base accesible

**Files:**
- Create: `src/styles/global.css`
- Create: `src/layouts/Base.astro`
- Create: `src/pages/index.astro`
- Test: `tests/layout.test.ts`

**Interfaces:**
- Consumes: `src/styles/tokens.css` y `src/styles/fonts.css`.
- Produces: `Base.astro`, que acepta las props `{ title: string; description: string }` y renderiza el documento completo. Todas las páginas de fases posteriores lo usan.

- [ ] **Step 1: Escribir el test que falla**

Astro expone una API de contenedor para renderizar componentes fuera de un servidor. Se usa para verificar la estructura del layout.

Create `tests/layout.test.ts`:

```ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import Base from '../src/layouts/Base.astro';

async function render() {
  const container = await AstroContainer.create();
  return container.renderToString(Base, {
    props: { title: 'Prueba', description: 'Descripción de prueba' },
  });
}

describe('layout base', () => {
  it('declara el idioma del documento como español', async () => {
    expect(await render()).toContain('lang="es"');
  });

  it('abre con un enlace para saltar al contenido', async () => {
    const html = await render();
    expect(html).toContain('href="#contenido"');
    expect(html).toContain('id="contenido"');
  });

  it('usa landmarks semánticos', async () => {
    const html = await render();
    expect(html).toMatch(/<main[\s>]/);
    expect(html).toMatch(/<footer[\s>]/);
  });

  it('pone el título y la descripción en el head', async () => {
    const html = await render();
    expect(html).toContain('<title>Prueba</title>');
    expect(html).toContain('Descripción de prueba');
  });
});
```

- [ ] **Step 2: Escribir el test de reglas globales**

Añadir a `tests/layout.test.ts`, al final del archivo:

```ts
import { readFileSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) sourceFiles(path, out);
    else if (/\.(css|astro)$/.test(entry)) out.push(path);
  }
  return out;
}

describe('reglas del sistema', () => {
  const files = sourceFiles('src').map((path) => [path, readFileSync(path, 'utf8')] as const);

  it('cubre prefers-reduced-motion', () => {
    const global = readFileSync('src/styles/global.css', 'utf8');
    expect(global).toContain('prefers-reduced-motion: reduce');
  });

  it('nunca usa moss como color de texto', () => {
    for (const [path, source] of files) {
      expect(source, `${path} usa moss como texto`).not.toMatch(
        /(?:^|[^-])color:\s*var\(--color-moss\)/m,
      );
    }
  });

  it('no apaga el outline sin reemplazarlo', () => {
    for (const [path, source] of files) {
      expect(source, `${path} apaga el outline`).not.toMatch(/outline:\s*none/);
    }
  });

  it('no usa background-clip para texto en degradado', () => {
    for (const [path, source] of files) {
      expect(source, `${path} usa texto en degradado`).not.toContain('background-clip: text');
    }
  });
});
```

- [ ] **Step 3: Correr el test y verificar que falla**

Run: `pnpm test tests/layout.test.ts`
Expected: FAIL. No existe `src/layouts/Base.astro`.

- [ ] **Step 4: Escribir `src/styles/global.css`**

```css
@import './tokens.css';
@import './fonts.css';

*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  color-scheme: dark;
}

body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-ink);
  font-family: var(--font-body);
  font-size: var(--text-step-0);
  /* El +0.05 que pide el texto claro sobre fondo oscuro ya está incluido. */
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}

h1,
h2,
h3 {
  font-family: var(--font-display);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
  text-wrap: balance;
}

p {
  max-width: 68ch;
  text-wrap: pretty;
}

a {
  color: var(--color-neon);
}

:focus-visible {
  outline: 2px solid var(--color-neon);
  outline-offset: 2px;
}

.saltar-al-contenido {
  position: absolute;
  left: 8px;
  top: -100%;
  z-index: var(--z-toast);
  padding: 12px 16px;
  border-radius: var(--radius-md);
  background: var(--color-neon);
  color: var(--color-bg);
  font-family: var(--font-micro);
  transition: top var(--dur-fast) var(--ease-out-quint);
}

.saltar-al-contenido:focus-visible {
  top: 8px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 5: Escribir `src/layouts/Base.astro`**

```astro
---
import '@fontsource-variable/sono';
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---

<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={new URL(Astro.url.pathname, Astro.site)} />
  </head>
  <body>
    <a class="saltar-al-contenido" href="#contenido">Saltar al contenido</a>
    <main id="contenido">
      <slot />
    </main>
    <footer>
      <p>EddieBeru · Costa Rica</p>
    </footer>
  </body>
</html>
```

- [ ] **Step 6: Escribir `src/pages/index.astro`**

Una página mínima que prueba que el sistema se ve. Se reemplaza por completo en la Fase 3.

```astro
---
import Base from '../layouts/Base.astro';
---

<Base title="EddieBeru" description="Portafolio de EddieBeru, estudiante de Ingeniería en Sistemas de la Información.">
  <h1>Llueve afuera. Adentro compilo.</h1>
  <p>
    Estudiante de Ingeniería en Sistemas de la Información en la Universidad Nacional.
    Este sitio está en construcción.
  </p>
</Base>
```

- [ ] **Step 7: Correr los tests y verificar que pasan**

Run: `pnpm test`
Expected: PASS, toda la suite.

- [ ] **Step 8: Verificar que el proyecto compila y se ve**

Run: `pnpm build`
Expected: build exitoso, genera `dist/`.

Run: `pnpm dev` y abrir el URL que imprime.
Expected: fondo casi negro con tinte verde-azul, titular en Cabinet Grotesk. Presionar Tab al cargar debe revelar el enlace "Saltar al contenido" en la esquina superior izquierda.

- [ ] **Step 9: Commit**

```bash
git add src/styles/global.css src/layouts/Base.astro src/pages/index.astro tests/layout.test.ts
git commit -m "feat: add accessible base layout

Base.astro carries the skip link, semantic landmarks, Spanish lang attribute
and canonical URL. global.css sets the reset, base type and a focus ring that
is never removed.

Tests render the layout through Astro's container API and scan every source
file for the system's hard rules: reduced-motion coverage, no moss as text,
no disabled outlines, no gradient text."
```

---

### Task 4: Despliegue automático en GitHub Pages

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: el script `build` de `package.json` (Task 1) y el sitio compilable (Task 3).
- Produces: el sitio publicado en `https://eddieberu.github.io`. Las fases posteriores añaden un cron a este mismo workflow para refrescar los datos de GitHub.

- [ ] **Step 1: Escribir el workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 10

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - run: pnpm install --frozen-lockfile

      - name: Correr los tests
        run: pnpm test

      - name: Compilar
        run: pnpm build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Los tests corren antes de compilar a propósito: un token que falle contraste tumba el deploy en vez de publicarse.

- [ ] **Step 2: Activar GitHub Pages con origen en Actions**

Run:

```bash
gh api -X POST repos/EddieBeru/EddieBeru.github.io/pages \
  -f 'build_type=workflow' \
  --silent || \
gh api -X PUT repos/EddieBeru/EddieBeru.github.io/pages \
  -f 'build_type=workflow'
```

Expected: sin error. El primer comando crea la configuración de Pages; si ya existe, el segundo la actualiza.

Verificar: `gh api repos/EddieBeru/EddieBeru.github.io/pages --jq '.build_type'` devuelve `workflow`.

- [ ] **Step 3: Commit y push**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: build and publish to GitHub Pages

Tests run before the build so a token that fails contrast blocks the deploy
instead of shipping. Later phases hang the daily data-refresh cron off this
same workflow."
git push origin main
```

- [ ] **Step 4: Verificar el despliegue**

Run: `gh run watch`
Expected: los jobs `build` y `deploy` terminan en verde.

Run: `curl -sI https://eddieberu.github.io | head -1`
Expected: `HTTP/2 200`.

Abrir `https://eddieberu.github.io` en el navegador y confirmar que se ve el titular con la tipografía y los colores correctos.

Si devuelve 404, esperar un minuto: el primer despliegue de Pages tarda en propagarse.

---

## Al terminar la fase

El sitio está vivo, se despliega solo en cada push a `main`, y el sistema de diseño está protegido por tests que corren antes de cada deploy.

Lo que **no** existe todavía y llega en fases siguientes: colecciones de contenido, páginas de proyecto, el home real, los widgets, la simulación en vivo, el guestbook y el README de perfil sincronizado.

Antes de arrancar la Fase 2 conviene resolver el paso manual de la Task 2: sin los `.woff2` de Fontshare en `src/fonts/`, la suite no pasa y el deploy no corre.
