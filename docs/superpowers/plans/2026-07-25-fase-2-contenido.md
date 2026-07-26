# Fase 2 — Contenido Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Los trece proyectos existen como contenido validado por Zod, cada uno con marca propia e imagen real, navegables desde `/proyectos` y con página propia los de nivel 1 y 2.

**Architecture:** Cada tipo de contenido es una colección de Astro cargada con el loader `glob` y validada con un schema Zod. El schema convierte en error de build los dos campos que el sitio no puede permitirse vacíos: `enseñó` e `imagen`. Las marcas y los diagramas no son archivos de imagen sino componentes `.astro` con SVG en línea, así heredan los tokens de color del sitio y escalan sin pipeline de imágenes. Un registro tipado conecta la cadena que declara el contenido con el componente que la dibuja, y un test verifica que ninguna referencia quede colgando.

**Tech Stack:** Astro 7 Content Layer · Zod (vía `astro:content`) · Vitest 4 · SVG en línea

## Global Constraints

Aplican a cada tarea, sin excepción. Heredan además todas las de la Fase 1.

- **Fuente de verdad del contenido:** `docs/superpowers/specs/2026-07-25-portfolio-content.md`. Ningún hecho, fecha, stack ni cita se inventa; se copia de ahí.
- **La pareja de Eddie se menciona como "mi pareja".** Nunca su género, en ninguna parte: copy, texto alternativo, nombres de archivo, commits, metadatos.
- **La historia de ConocimientoWebDev que motivó la lista de bans no se publica.** La postura sí; el reclamo no.
- **Ningún proyecto se enlaza al vacío.** Si el repo es privado, se dice que es privado.
- **Cero imágenes es un bug.** Todo proyecto de nivel 1 y 2 lleva imagen real: captura o diagrama. Nunca un bloque de color.
- **`enseñó` es campo de primera clase**, con peso visual propio. No es una nota al pie.
- **Nada de barras de porcentaje ni estrellas** en el inventario. Los niveles son `en serio` / `maso` / `toqué`.
- **Sin retículas de tarjetas idénticas.** Los proyectos destacados van en paneles de peso distinto.
- **Sin atribución de IA** en ningún commit ni archivo generado.

## Decisiones que este plan toma sobre el spec

El spec de contenido dejó tres cosas abiertas. Se resuelven así, y la razón queda escrita porque la decisión se hereda a las fases siguientes.

1. **Markdown, no MDX.** El spec dice `.mdx`. Ningún cuerpo de proyecto embebe componentes: la estructura vive en los campos del frontmatter y la prosa es prosa. Markdown plano evita instalar `@astrojs/mdx` para nada. Cuando la recreación en vivo de SimulacionEcosistema llegue, se monta desde la plantilla de página, no desde el cuerpo del `.md`.

2. **`imagen` es una unión discriminada de dos variantes: `captura` y `diagrama`.** Eddie todavía no ha entregado capturas, y un schema que exija `captura` dejaría el sitio sin poder compilar. Un diagrama no es un sustituto de segunda: para OmniRPG (servidor como única fuente de verdad) o para Ubot (alcance del renderizado) dice más que una captura. Cuando lleguen las capturas, cambiar la variante en el frontmatter es un renglón. La tercera variante, `recreacion`, la añade la fase de la simulación en vivo; añadirla ahora sería código sin uso.

3. **Las marcas de Ubot y JellyfinUWPClient son propias por ahora.** El spec pide el logo real de Ubot y el de Jellyfin. Ninguno de los dos archivos está en el repo, y bajarlos de un sitio de terceros para incrustarlos no es una decisión que corresponda tomar sola. Ambos llevan marca propia del mismo sistema, y el cambio, cuando Eddie entregue los archivos, toca un solo componente.

---

## Estructura de archivos

```
src/
  content.config.ts              define las cuatro colecciones y sus schemas
  content/
    proyectos/*.md               trece archivos, uno por proyecto
    hitos/*.md                   cuatro archivos, uno por hito
    conocimientos/inventario.yaml el inventario completo
    aprendiendo/actual.md        editable a mano, alimenta el widget
  components/
    marcas/                      un .astro por proyecto de nivel 1 y 2
    diagramas/                   un .astro por proyecto que no tiene captura
    registro.ts                  mapea cadena del frontmatter → componente
    Chip.astro                   metadato en Sono
    ImagenProyecto.astro         resuelve la unión captura|diagrama
  pages/
    proyectos/index.astro        el índice de los trece
    proyectos/[slug].astro       página de proyecto, nivel 1 y 2
tests/
  contenido.test.ts              schema, cobertura y reglas de privacidad
  registro.test.ts               ninguna referencia a marca o diagrama cuelga
  paginas.test.ts                las páginas renderizan lo que deben
```

---

### Task 1: Colecciones y schema

El entregable es el schema: que un proyecto sin `enseñó` o sin `imagen` rompa el build en vez de dejar un hueco en producción.

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/proyectos/ubot.md` (uno solo, para poder probar el schema)
- Test: `tests/contenido.test.ts`

**Interfaces:**
- Consumes: nada de la Fase 1 salvo el proyecto compilable.
- Produces:
  - Las colecciones `proyectos`, `hitos`, `conocimientos` y `aprendiendo`, consultables con `getCollection('proyectos')`.
  - El tipo de una entrada de proyecto, con estos campos en `data`:
    `nombre: string`, `linea: string`, `nivel: 1|2|3`, `estado: 'vivo'|'en curso'|'pausado'|'muerto'|'archivado'`, `cuando: string`, `rol?: string`, `stack: string[]`, `enseño: string`, `imagen: Imagen`, `marca?: string`, `repo?: string`, `repoPrivado: boolean`, `sitio?: string`, `orden: number`.
  - El tipo `Imagen`, unión discriminada por `tipo`:
    `{ tipo: 'captura'; src: string; alt: string }` | `{ tipo: 'diagrama'; componente: string; alt: string }`.

**Nota sobre el nombre del campo.** El spec lo llama `enseñó`. En el frontmatter se escribe `enseño`, sin tilde en la o: es una clave, y una clave con tilde obliga a comillas en YAML y a notación de corchetes en TypeScript por el resto del proyecto. El texto visible sí lleva la tilde.

- [x] **Step 1: Escribir el test que falla**

Create `tests/contenido.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { getCollection } from 'astro:content';

describe('colección de proyectos', () => {
  it('carga entradas validadas', async () => {
    const proyectos = await getCollection('proyectos');
    expect(proyectos.length).toBeGreaterThan(0);
  });

  it('todo proyecto declara qué enseñó, sin excepción', async () => {
    for (const proyecto of await getCollection('proyectos')) {
      expect(proyecto.data.enseño.length, `${proyecto.id} no dice qué enseñó`).toBeGreaterThan(20);
    }
  });

  it('todo proyecto de nivel 1 y 2 lleva imagen real', async () => {
    const conPagina = (await getCollection('proyectos')).filter((p) => p.data.nivel <= 2);
    for (const proyecto of conPagina) {
      expect(proyecto.data.imagen, `${proyecto.id} no tiene imagen`).toBeDefined();
      expect(proyecto.data.imagen.alt.length, `${proyecto.id}: alt vacío`).toBeGreaterThan(10);
    }
  });

  it('ningún repo privado se enlaza al vacío', async () => {
    for (const proyecto of await getCollection('proyectos')) {
      if (proyecto.data.repoPrivado) {
        expect(proyecto.data.repo, `${proyecto.id} enlaza un repo privado`).toBeUndefined();
      }
    }
  });
});
```

- [x] **Step 2: Correr el test y verificar que falla**

Run: `pnpm test tests/contenido.test.ts`
Expected: FAIL. `astro:content` no resuelve porque no existe `src/content.config.ts`.

- [x] **Step 3: Escribir `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const imagen = z.discriminatedUnion('tipo', [
  z.object({
    tipo: z.literal('captura'),
    src: z.string(),
    alt: z.string().min(10, 'El texto alternativo es parte de la voz, no un trámite'),
  }),
  z.object({
    tipo: z.literal('diagrama'),
    componente: z.string(),
    alt: z.string().min(10, 'El texto alternativo es parte de la voz, no un trámite'),
  }),
]);

const proyectos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/proyectos' }),
  schema: z
    .object({
      nombre: z.string(),
      linea: z.string(),
      nivel: z.union([z.literal(1), z.literal(2), z.literal(3)]),
      estado: z.enum(['vivo', 'en curso', 'pausado', 'muerto', 'archivado']),
      cuando: z.string(),
      rol: z.string().optional(),
      stack: z.array(z.string()).min(1),
      enseño: z.string().min(20),
      imagen: imagen.optional(),
      marca: z.string().optional(),
      repo: z.string().url().optional(),
      repoPrivado: z.boolean().default(false),
      sitio: z.string().url().optional(),
      orden: z.number().int(),
    })
    .superRefine((data, ctx) => {
      // Nivel 1 y 2 tienen página propia, y una página sin imagen es un bug.
      // Nivel 3 vive en una tabla de una línea y no lleva ninguna.
      if (data.nivel <= 2 && !data.imagen) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['imagen'],
          message: 'Los proyectos con página propia necesitan imagen real: captura o diagrama',
        });
      }
      if (data.nivel <= 2 && !data.marca) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['marca'],
          message: 'Los proyectos con página propia necesitan marca',
        });
      }
      if (data.repoPrivado && data.repo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['repo'],
          message: 'Un repo privado no se enlaza: se dice que es privado',
        });
      }
    }),
});

const hitos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/hitos' }),
  schema: z.object({
    cuando: z.string(),
    orden: z.number().int(),
    titulo: z.string(),
    porQueMarco: z.string().min(20),
    proyectos: z.array(z.string()).default([]),
  }),
});

const conocimientos = defineCollection({
  loader: file('./src/content/conocimientos/inventario.yaml'),
  schema: z.object({
    id: z.string(),
    categoria: z.enum(['lenguaje', 'framework', 'nube', 'herramienta']),
    nombre: z.string(),
    nivel: z.enum(['en serio', 'maso', 'toqué']).optional(),
    opinion: z.string().optional(),
  }),
});

const aprendiendo = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/aprendiendo' }),
  schema: z.object({
    actualizado: z.coerce.date(),
  }),
});

export const collections = { proyectos, hitos, conocimientos, aprendiendo };
```

- [x] **Step 4: Escribir un proyecto de prueba, `src/content/proyectos/ubot.md`**

El contenido sale del spec, sección "Ubot". La prosa del cuerpo se escribe completa en la Task 2; aquí basta el frontmatter válido y un párrafo, para que el schema tenga qué validar.

```markdown
---
nombre: Ubot
linea: Preparación para el examen de admisión de las universidades públicas de Costa Rica.
nivel: 1
estado: vivo
cuando: 2026
rol: Frontend completo
stack: [Blazor WASM, .NET, LaTeX, PWA, Azure, Railway]
enseño: Renderizar LaTeX era lo más pesado de la aplicación, y ese peso delató que Blazor redibujaba la página entera en cada cambio de estado. El problema caro reveló cómo funcionaba la herramienta por dentro.
imagen:
  tipo: diagrama
  componente: ubot-renderizado
  alt: Diagrama del alcance del renderizado en Blazor, antes y después de acotarlo.
marca: ubot
repoPrivado: true
sitio: https://ubotcr.com
orden: 1
---

Chat con IA, exámenes simulacro y juegos de estudio.
```

- [x] **Step 5: Correr el test y verificar que pasa**

Run: `pnpm test tests/contenido.test.ts`
Expected: PASS.

Si Vitest no resuelve `astro:content`, es porque el módulo virtual necesita que Astro haya sincronizado los tipos. Correr `pnpm astro sync` una vez y repetir.

- [x] **Step 6: Verificar que el schema rechaza lo que debe**

Prueba manual, para confirmar que la guarda muerde. Añadir temporalmente `src/content/proyectos/roto.md`:

```markdown
---
nombre: Roto
linea: Prueba de que el schema muerde.
nivel: 1
estado: muerto
cuando: 2026
stack: [nada]
enseño: Texto suficientemente largo para pasar el mínimo de veinte caracteres.
marca: ubot
repoPrivado: false
orden: 99
---
```

Run: `pnpm build`
Expected: FAIL con `Los proyectos con página propia necesitan imagen real: captura o diagrama`.

Borrar `src/content/proyectos/roto.md` y volver a correr `pnpm build`: pasa.

- [x] **Step 7: Commit**

```bash
git add src/content.config.ts src/content/proyectos/ubot.md tests/contenido.test.ts
git commit -m "feat: define content collections with enforcing schemas

Zod turns the two fields the site cannot afford to leave empty into build
errors: every project states what it taught, and every project with its own
page carries a real image. A private repo that also declares a URL is a
build error too, since the site never links into the void."
```

---

### Task 2: Los trece proyectos, los hitos y el inventario

**Files:**
- Create: `src/content/proyectos/*.md` (los doce restantes)
- Modify: `src/content/proyectos/ubot.md` (cuerpo completo)
- Create: `src/content/hitos/*.md` (cuatro)
- Create: `src/content/conocimientos/inventario.yaml`
- Create: `src/content/aprendiendo/actual.md`
- Modify: `tests/contenido.test.ts`

**Interfaces:**
- Consumes: los schemas de la Task 1.
- Produces: trece entradas de `proyectos` con estos identificadores, que las tareas siguientes usan como rutas:
  `ubot`, `omnirpg`, `simulacion-ecosistema`, `jellyfin-uwp-client` (nivel 1);
  `pollo-asado`, `espacios-compartidos`, `segundo-parcial-programacion` (nivel 2);
  `proyecto-progra-ii`, `admin-biblio-proyecto`, `backend-progra-iii`, `conocimiento-webdev`, `pwa-demo`, `poker-mod` (nivel 3).
  Los identificadores de nivel 1 y 2 coinciden con las carpetas ya creadas en `src/assets/proyectos/`.

- [x] **Step 1: Ampliar el test con la cobertura y las reglas de privacidad**

Añadir a `tests/contenido.test.ts`:

```ts
const ESPERADOS = {
  1: ['ubot', 'omnirpg', 'simulacion-ecosistema', 'jellyfin-uwp-client'],
  2: ['pollo-asado', 'espacios-compartidos', 'segundo-parcial-programacion'],
  3: [
    'proyecto-progra-ii', 'admin-biblio-proyecto', 'backend-progra-iii',
    'conocimiento-webdev', 'pwa-demo', 'poker-mod',
  ],
} as const;

describe('cobertura del spec', () => {
  it('los trece proyectos existen, en su nivel', async () => {
    const proyectos = await getCollection('proyectos');
    for (const [nivel, ids] of Object.entries(ESPERADOS)) {
      const presentes = proyectos.filter((p) => p.data.nivel === Number(nivel)).map((p) => p.id);
      expect(presentes.sort()).toEqual([...ids].sort());
    }
  });

  it('los cuatro hitos de la línea de tiempo existen y están ordenados', async () => {
    const hitos = (await getCollection('hitos')).sort((a, b) => a.data.orden - b.data.orden);
    expect(hitos).toHaveLength(4);
    expect(hitos.map((h) => h.data.cuando)).toEqual(['2023', '2024', '2025 · 1.er ciclo', '2026']);
  });

  it('el inventario usa los tres niveles honestos y ninguna métrica falsa', async () => {
    const inventario = await getCollection('conocimientos');
    expect(inventario.length).toBeGreaterThan(10);
    for (const item of inventario) {
      if (item.data.nivel) {
        expect(['en serio', 'maso', 'toqué']).toContain(item.data.nivel);
      }
    }
  });
});

describe('reglas de privacidad', () => {
  const PROHIBIDO = [/\bnovio\b/i, /\bnovia\b/i, /\besposo\b/i, /\besposa\b/i];

  it('la pareja se menciona sin género', async () => {
    const textos = [
      ...(await getCollection('proyectos')).flatMap((p) => [
        p.data.linea, p.data.enseño, p.body ?? '', p.data.imagen?.alt ?? '',
      ]),
      ...(await getCollection('hitos')).map((h) => h.data.porQueMarco),
    ];
    for (const texto of textos) {
      for (const patron of PROHIBIDO) {
        expect(texto, `revela género de la pareja: ${texto.slice(0, 60)}`).not.toMatch(patron);
      }
    }
  });

  it('no publica la historia del profesor', async () => {
    for (const proyecto of await getCollection('proyectos')) {
      expect((proyecto.body ?? '').toLowerCase()).not.toContain('profe');
    }
  });
});
```

- [x] **Step 2: Correr el test y verificar que falla**

Run: `pnpm test tests/contenido.test.ts`
Expected: FAIL en "los trece proyectos existen": solo hay uno.

- [x] **Step 3: Escribir los cuatro proyectos de nivel 1**

Cada cuerpo se redacta desde la sección correspondiente del spec de contenido, respetando la estructura fija de la página de proyecto: por qué lo hizo, qué enseñó, qué salió mal. Los hechos —stack, escala, fechas, estado— se copian literales del spec; no se inventa ninguno.

`ubot.md` reemplaza su cuerpo de prueba por el completo: qué es, la migración de Railway a Azure por los créditos de startups, la escala real (~80 registrados, ~5 diarios), y el equipo (Eddie + Efraín, antes "yonpork", hoy Ubot, no constituida).

`omnirpg.md`:

```markdown
---
nombre: OmniRPG
linea: Un RPG donde el mundo se genera y la aventura se narra sola.
nivel: 1
estado: en curso
cuando: 2026
rol: Diseño y desarrollo completo
stack: [Godot, GDScript, Python, Gemini]
enseño: La primera versión metía cliente y servidor en la misma pieza y se desincronizaba sin remedio. La reescritura invirtió el modelo: el servidor Python es la única fuente de verdad y los clientes solo reaccionan.
imagen:
  tipo: diagrama
  componente: omnirpg-verdad
  alt: Diagrama del servidor Python como única fuente de verdad, con los clientes reaccionando y Gemini narrando aparte.
marca: omnirpg
repoPrivado: true
orden: 2
---

Nació de un gusto compartido: a mi pareja le encanta D&D y los juegos de rol; a mí me
gustan las decisiones y las historias.

## El reparto con la IA

El código Python genera el mundo de forma aleatoria y determinista. Gemini escribe la
narrativa para la inmersión. **El código es el table master; Gemini es la voz.** La IA
narra, pero no decide la verdad del mundo.

## Asincronía

Cada jugador puede avanzar solo. Cuando el otro vuelve, recibe un resumen de lo que
ocurrió mientras estuvo fuera.
```

`simulacion-ecosistema.md` lleva `imagen.tipo: diagrama` con componente `ecosistema-red` y una nota en el cuerpo de que la recreación en vivo llega después. `jellyfin-uwp-client.md` cuenta el desbloqueo de la serialización en C# y cómo lo mató un reescribir, sin maquillaje.

- [x] **Step 4: Escribir los tres proyectos de nivel 2**

`pollo-asado.md` (finanzas personales con insights, JavaScript, con una amiga de residencias, lento porque la universidad se atraviesa, repo público), `espacios-compartidos.md` (**no se presenta como fracaso**: es el antecedente directo de este portafolio, la idea cambió de forma y este sitio es ese cuarto) y `segundo-parcial-programacion.md` (contenedor genérico, iterador y nodo propios, Facade, Observer, persistencia en CSV, patrones aplicados sin que nadie los pidiera por nombre).

- [x] **Step 5: Escribir los seis proyectos de nivel 3**

Frontmatter mínimo, sin `imagen` ni `marca` —el schema no los exige en nivel 3— y con `enseño` cargando la línea de la columna "Qué queda" del spec. Ejemplo completo, `poker-mod.md`:

```markdown
---
nombre: PokerMod
linea: Mod de póker para Minecraft, con Efraín.
nivel: 3
estado: muerto
cuando: 2025
stack: [Java, Fabric]
enseño: Murió en el andamiaje y el ExampleMixin sigue intacto, pero alcanzó a tener CI en Actions e icono propio antes de pararse.
repo: https://github.com/EddieBeru/PokerMod
orden: 13
---
```

- [x] **Step 6: Escribir los cuatro hitos**

Uno por fila de la tabla "Línea de tiempo" del spec. Ejemplo completo, `2023-csharp.md`:

```markdown
---
cuando: '2023'
orden: 1
titulo: Metió mano en C# con .NET, en serio
porQueMarco: Aprendió montones y de ahí nació JellyfinUWPClient, antes de entrar a la carrera.
proyectos: [jellyfin-uwp-client]
---
```

Los otros tres: `2024-carrera.md` (entró a la carrera, aprendizaje formal y buenas prácticas, C++ al inicio, sin proyectos enlazados), `2025-simulacion.md` (SimulacionEcosistema, descubrió que ver simulaciones ocurrir le gusta, enlaza `simulacion-ecosistema`) y `2026-ubot.md` (nace Ubot, frontend y deploys a otra escala, enlaza `ubot`).

- [x] **Step 7: Escribir `src/content/conocimientos/inventario.yaml`**

El loader `file` sobre un YAML espera una lista de objetos con `id`. Los niveles y opiniones se copian del spec.

```yaml
- id: csharp
  categoria: lenguaje
  nombre: C#
  nivel: en serio
- id: cpp
  categoria: lenguaje
  nombre: C++
  nivel: maso
  opinion: Me dejó la sensación de que tiene mucho más que ofrecer de lo que alcancé a ver.
- id: javascript
  categoria: lenguaje
  nombre: JavaScript
  nivel: maso
  opinion: La sintaxis tan liberal se me hace rara. Prefiero tipado.
- id: python
  categoria: lenguaje
  nombre: Python
  nivel: maso
- id: java
  categoria: lenguaje
  nombre: Java
  nivel: maso
  opinion: Lo detesto.
- id: gdscript
  categoria: lenguaje
  nombre: GDScript
  nivel: maso
- id: sql
  categoria: lenguaje
  nombre: SQL
  nivel: toqué
- id: dotnet
  categoria: framework
  nombre: .NET
  nivel: en serio
- id: blazor
  categoria: framework
  nombre: Blazor
  nivel: maso
- id: godot
  categoria: framework
  nombre: Godot
  nivel: maso
- id: azure
  categoria: nube
  nombre: Azure
  nivel: maso
- id: railway
  categoria: nube
  nombre: Railway
  nivel: maso
- id: vscode
  categoria: herramienta
  nombre: VSCode
- id: antigravity
  categoria: herramienta
  nombre: Antigravity
- id: opencode
  categoria: herramienta
  nombre: OpenCode
- id: claude-code
  categoria: herramienta
  nombre: Claude Code
- id: git
  categoria: herramienta
  nombre: git
- id: adb
  categoria: herramienta
  nombre: adb
  opinion: No viene de un curso. Viene de trastear mi Android: debugging, sideloading y hasta custom ROMs.
```

- [x] **Step 8: Escribir `src/content/aprendiendo/actual.md`**

El único archivo que Eddie edita a mano con regularidad. Alimenta el widget de la Fase 4 y el README de perfil.

```markdown
---
actualizado: 2026-07-25
---

Astro y Tailwind 4, construyendo este sitio. Lo que más me está costando y más me
gusta: que el sistema de diseño sea código verificable y no una carpeta de capturas.
```

- [x] **Step 9: Correr los tests y verificar que pasan**

Run: `pnpm test`
Expected: PASS, toda la suite.

- [x] **Step 10: Commit**

```bash
git add src/content tests/contenido.test.ts
git commit -m "feat: author the thirteen projects, the timeline and the inventory

Every fact comes from the content spec: no invented stacks, dates or scale.
Tests assert the roster is complete per tier, that the timeline has its four
milestones in order, and two privacy rules the site must never break — the
partner is never gendered, and the professor story stays unpublished."
```

---

### Task 3: Marcas propias en SVG

**Files:**
- Create: `src/components/marcas/<Proyecto>.astro` (siete)
- Create: `src/components/registro.ts`
- Test: `tests/registro.test.ts`

**Interfaces:**
- Consumes: el campo `marca` de las entradas de proyecto.
- Produces: `src/components/registro.ts` exporta `MARCAS: Record<string, AstroComponentFactory>` y `DIAGRAMAS: Record<string, AstroComponentFactory>`. La Task 4 añade entradas a `DIAGRAMAS`; la Task 5 las consume.

- [x] **Step 1: Escribir el test que falla**

Create `tests/registro.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { getCollection } from 'astro:content';
import { DIAGRAMAS, MARCAS } from '../src/components/registro';

describe('registro de marcas y diagramas', () => {
  it('toda marca declarada en el contenido existe como componente', async () => {
    for (const proyecto of await getCollection('proyectos')) {
      if (!proyecto.data.marca) continue;
      expect(MARCAS[proyecto.data.marca], `falta la marca ${proyecto.data.marca}`).toBeDefined();
    }
  });

  it('todo diagrama declarado en el contenido existe como componente', async () => {
    for (const proyecto of await getCollection('proyectos')) {
      const { imagen } = proyecto.data;
      if (imagen?.tipo !== 'diagrama') continue;
      expect(DIAGRAMAS[imagen.componente], `falta el diagrama ${imagen.componente}`).toBeDefined();
    }
  });

  it('no hay marcas ni diagramas huérfanos', async () => {
    const proyectos = await getCollection('proyectos');
    const marcasUsadas = new Set(proyectos.map((p) => p.data.marca).filter(Boolean));
    const diagramasUsados = new Set(
      proyectos.map((p) => (p.data.imagen?.tipo === 'diagrama' ? p.data.imagen.componente : null))
        .filter(Boolean),
    );
    expect(Object.keys(MARCAS).filter((k) => !marcasUsadas.has(k))).toEqual([]);
    expect(Object.keys(DIAGRAMAS).filter((k) => !diagramasUsados.has(k))).toEqual([]);
  });
});
```

- [x] **Step 2: Correr el test y verificar que falla**

Run: `pnpm test tests/registro.test.ts`
Expected: FAIL. No existe `src/components/registro.ts`.

- [x] **Step 3: Dibujar las siete marcas**

Un glifo por proyecto, mismo sistema: lienzo `0 0 48 48`, trazo de 2.5, extremos redondeados, `currentColor` para que herede el color del contexto, sin relleno salvo donde el glifo lo pida. Cada una alude a lo que el proyecto es, no a su tecnología.

Ejemplo completo, `src/components/marcas/Ubot.astro` — una U que es a la vez un contenedor y una barra de progreso:

```astro
---
interface Props {
  size?: number;
}
const { size = 48 } = Astro.props;
---

<svg
  width={size}
  height={size}
  viewBox="0 0 48 48"
  fill="none"
  stroke="currentColor"
  stroke-width="2.5"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <path d="M14 10v16a10 10 0 0 0 20 0V10" />
  <path d="M14 34h20" stroke-opacity="0.4" />
  <circle cx="24" cy="20" r="2.5" fill="currentColor" stroke="none" />
</svg>
```

Las otras seis siguen el mismo contrato de props y el mismo lienzo:
`OmniRPG.astro` (un dado de veinte caras reducido a su silueta hexagonal con un nodo central del que salen dos ramas: las dos partidas asíncronas), `SimulacionEcosistema.astro` (tres celdas de una retícula con densidades distintas y una flecha de ciclo), `JellyfinUWPClient.astro` (un rectángulo de pantalla con un triángulo de reproducción descentrado), `PolloAsado.astro` (una curva ascendente sobre una línea base, con un punto marcado), `EspaciosCompartidos.astro` (dos habitaciones cuadradas que comparten una arista abierta) y `SegundoParcialProgramacion.astro` (tres nodos encadenados con la flecha del último volviendo al primero: la lista enlazada con su iterador).

- [x] **Step 4: Escribir `src/components/registro.ts`**

```ts
import EspaciosCompartidos from './marcas/EspaciosCompartidos.astro';
import JellyfinUWPClient from './marcas/JellyfinUWPClient.astro';
import OmniRPG from './marcas/OmniRPG.astro';
import PolloAsado from './marcas/PolloAsado.astro';
import SegundoParcialProgramacion from './marcas/SegundoParcialProgramacion.astro';
import SimulacionEcosistema from './marcas/SimulacionEcosistema.astro';
import Ubot from './marcas/Ubot.astro';

export const MARCAS = {
  ubot: Ubot,
  omnirpg: OmniRPG,
  'simulacion-ecosistema': SimulacionEcosistema,
  'jellyfin-uwp-client': JellyfinUWPClient,
  'pollo-asado': PolloAsado,
  'espacios-compartidos': EspaciosCompartidos,
  'segundo-parcial-programacion': SegundoParcialProgramacion,
} as const;

export const DIAGRAMAS = {} as const;
```

`DIAGRAMAS` queda vacío a propósito: la Task 4 lo llena. El test de diagramas falla hasta entonces, y eso es correcto — el contenido ya declara diagramas que todavía no existen.

- [x] **Step 5: Correr el test**

Run: `pnpm test tests/registro.test.ts`
Expected: el caso de marcas PASA; el de diagramas FALLA con `falta el diagrama ubot-renderizado`. Ese fallo es el trabajo de la Task 4.

- [x] **Step 6: Commit**

```bash
git add src/components/marcas src/components/registro.ts tests/registro.test.ts
git commit -m "feat: draw the seven project marks

Own glyphs instead of a borrowed-logo grid: each mark alludes to what the
project is, not to the language it was written in. Inline SVG on currentColor
so marks inherit the palette and need no image pipeline.

Ubot's real logo and the Jellyfin logo replace these two when the files land."
```

---

### Task 4: Diagramas como imagen real

Siete proyectos con página y ninguna captura entregada. El diagrama no es relleno: es la imagen que explica el proyecto.

**Files:**
- Create: `src/components/diagramas/<Nombre>.astro` (siete)
- Modify: `src/components/registro.ts`

**Interfaces:**
- Consumes: `MARCAS` y `DIAGRAMAS` de la Task 3.
- Produces: `DIAGRAMAS` poblado con las siete claves que el contenido declara: `ubot-renderizado`, `omnirpg-verdad`, `ecosistema-red`, `jellyfin-serializacion`, `pollo-asado-insight`, `espacios-cuartos`, `segundo-parcial-iterador`.

- [x] **Step 1: Dibujar los diagramas**

Lienzo `0 0 640 360`, texto en `--font-micro`, trazos con los tokens del sitio. Cada uno tiene `role="img"` y su `<title>` conectado por `aria-labelledby`: el diagrama es contenido, no decoración, y el lector de pantalla debe recibirlo.

Ejemplo completo, `src/components/diagramas/OmnirpgVerdad.astro`:

```astro
---
const tituloId = 'diag-omnirpg-titulo';
---

<svg viewBox="0 0 640 360" role="img" aria-labelledby={tituloId} class="diagrama">
  <title id={tituloId}>
    El servidor Python guarda el estado del mundo. Los clientes de Godot solo reaccionan a
    lo que el servidor dicta, y Gemini escribe la narrativa a partir de ese mismo estado.
  </title>

  <rect x="240" y="140" width="160" height="80" rx="10" class="nodo-verdad" />
  <text x="320" y="172" class="etiqueta">servidor Python</text>
  <text x="320" y="194" class="etiqueta-menor">única verdad</text>

  <rect x="40" y="40" width="140" height="64" rx="10" class="nodo" />
  <text x="110" y="78" class="etiqueta">cliente Godot</text>

  <rect x="40" y="256" width="140" height="64" rx="10" class="nodo" />
  <text x="110" y="294" class="etiqueta">cliente Godot</text>

  <rect x="460" y="148" width="140" height="64" rx="10" class="nodo-voz" />
  <text x="530" y="186" class="etiqueta">Gemini</text>
  <text x="530" y="232" class="etiqueta-menor">la voz</text>

  <path d="M180 78 L240 158" class="flecha" marker-end="url(#punta)" />
  <path d="M180 288 L240 206" class="flecha" marker-end="url(#punta)" />
  <path d="M400 180 L460 180" class="flecha" marker-end="url(#punta)" />

  <defs>
    <marker id="punta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0 0 L10 5 L0 10 z" fill="var(--color-line)" />
    </marker>
  </defs>
</svg>

<style>
  .diagrama {
    width: 100%;
    height: auto;
    background: var(--color-surface);
    border: 1px solid var(--color-line);
    border-radius: var(--radius-lg);
  }
  .nodo {
    fill: var(--color-surface-2);
    stroke: var(--color-line);
  }
  .nodo-verdad {
    fill: var(--color-surface-2);
    stroke: var(--color-neon);
    stroke-width: 2;
  }
  .nodo-voz {
    fill: var(--color-surface-2);
    stroke: var(--color-celeste);
    stroke-dasharray: 6 4;
  }
  .etiqueta {
    fill: var(--color-ink);
    font-family: var(--font-micro);
    font-size: 14px;
    text-anchor: middle;
  }
  .etiqueta-menor {
    fill: var(--color-ink-3);
    font-family: var(--font-micro);
    font-size: 12px;
    text-anchor: middle;
  }
  .flecha {
    stroke: var(--color-line);
    stroke-width: 2;
    fill: none;
  }
</style>
```

Los otros seis, cada uno diciendo lo que su proyecto enseñó:

- `UbotRenderizado.astro` — dos estados de la misma pantalla: a la izquierda, el árbol entero marcado como redibujado; a la derecha, solo el nodo de LaTeX. Es la historia ancla del sitio hecha imagen.
- `EcosistemaRed.astro` — la red de dependencias: agua alimenta plantaciones, plantaciones alimentan herbívoros, herbívoros alimentan carnívoros, y clima y temporada modulan las tasas de arriba.
- `JellyfinSerializacion.astro` — respuesta cruda de la API a la izquierda, objeto C# tipado a la derecha, y en medio el paso que Eddie no entendía. Antes y después del desbloqueo.
- `PolloAsadoInsight.astro` — movimientos entrando, insight saliendo. La app no es un registro de gastos, es lo que se deriva de ellos.
- `EspaciosCuartos.astro` — cuartos publicados con gustos adentro, y una flecha que sale del último cuarto hacia este mismo sitio. El antecedente, dibujado.
- `SegundoParcialIterador.astro` — la lista enlazada con su iterador recorriéndola, y a un lado el Facade y el Observer colgando de la misma estructura.

- [x] **Step 2: Registrar los diagramas**

Reemplazar la línea `export const DIAGRAMAS = {} as const;` de `src/components/registro.ts` por:

```ts
import EcosistemaRed from './diagramas/EcosistemaRed.astro';
import EspaciosCuartos from './diagramas/EspaciosCuartos.astro';
import JellyfinSerializacion from './diagramas/JellyfinSerializacion.astro';
import OmnirpgVerdad from './diagramas/OmnirpgVerdad.astro';
import PolloAsadoInsight from './diagramas/PolloAsadoInsight.astro';
import SegundoParcialIterador from './diagramas/SegundoParcialIterador.astro';
import UbotRenderizado from './diagramas/UbotRenderizado.astro';

export const DIAGRAMAS = {
  'ubot-renderizado': UbotRenderizado,
  'omnirpg-verdad': OmnirpgVerdad,
  'ecosistema-red': EcosistemaRed,
  'jellyfin-serializacion': JellyfinSerializacion,
  'pollo-asado-insight': PolloAsadoInsight,
  'espacios-cuartos': EspaciosCuartos,
  'segundo-parcial-iterador': SegundoParcialIterador,
} as const;
```

Los `import` van arriba del archivo, junto a los de las marcas.

- [x] **Step 3: Correr los tests y verificar que pasan**

Run: `pnpm test`
Expected: PASS, incluido el caso de diagramas que la Task 3 dejó en rojo.

- [x] **Step 4: Commit**

```bash
git add src/components/diagramas src/components/registro.ts
git commit -m "feat: draw one diagram per project page

No screenshots exist yet, and a page without an image is a bug by the design
rules. These are not filler: each diagram carries what its project taught —
Blazor's render scope, the Python server as single source of truth, the
ecosystem's dependency web, the C# serialization unlock.

Every diagram is inline SVG with role=img and a title element, so it reaches
screen readers as content rather than decoration."
```

---

### Task 5: Página de proyecto

**Files:**
- Create: `src/components/Chip.astro`
- Create: `src/components/ImagenProyecto.astro`
- Create: `src/pages/proyectos/[slug].astro`
- Test: `tests/paginas.test.ts`

**Interfaces:**
- Consumes: las colecciones de la Task 2, el registro de la Task 4.
- Produces: la ruta `/proyectos/<id>` para todo proyecto de nivel 1 y 2. La Task 6 y la Fase 3 enlazan a ella.

- [x] **Step 1: Escribir el test que falla**

Create `tests/paginas.test.ts`:

```ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import { getCollection } from 'astro:content';
import Proyecto from '../src/pages/proyectos/[slug].astro';

async function renderProyecto(id: string) {
  const proyectos = await getCollection('proyectos');
  const proyecto = proyectos.find((p) => p.id === id);
  if (!proyecto) throw new Error(`No existe el proyecto ${id}`);
  const container = await AstroContainer.create();
  return container.renderToString(Proyecto, {
    props: { proyecto },
    params: { slug: id },
  });
}

describe('página de proyecto', () => {
  it('muestra qué enseñó con peso propio', async () => {
    const html = await renderProyecto('ubot');
    expect(html).toContain('Qué enseñó');
  });

  it('dice que el repo es privado en vez de enlazar al vacío', async () => {
    const html = await renderProyecto('omnirpg');
    expect(html).toMatch(/repo privado/i);
    expect(html).not.toContain('href="https://github.com/EddieBeru/OmniRPG"');
  });

  it('enlaza el repo público cuando lo hay', async () => {
    const html = await renderProyecto('simulacion-ecosistema');
    expect(html).toContain('https://github.com/EddieBeru/SimulacionEcosistema');
  });

  it('nunca renderiza una página sin imagen', async () => {
    for (const proyecto of (await getCollection('proyectos')).filter((p) => p.data.nivel <= 2)) {
      const html = await renderProyecto(proyecto.id);
      expect(html, `${proyecto.id} salió sin imagen`).toMatch(/<svg|<img/);
    }
  });
});
```

- [x] **Step 2: Correr el test y verificar que falla**

Run: `pnpm test tests/paginas.test.ts`
Expected: FAIL. No existe `src/pages/proyectos/[slug].astro`.

- [x] **Step 3: Escribir `src/components/Chip.astro`**

```astro
---
interface Props {
  tono?: 'neutro' | 'acento';
}
const { tono = 'neutro' } = Astro.props;
---

<span class:list={['chip', tono]}><slot /></span>

<style>
  .chip {
    display: inline-block;
    padding: 3px 10px;
    border: 1px solid var(--color-line);
    border-radius: var(--radius-full);
    background: var(--color-surface);
    color: var(--color-ink-2);
    font-family: var(--font-micro);
    font-size: var(--text-step--1);
    line-height: 1.5;
  }
  .acento {
    border-color: var(--color-moss);
    color: var(--color-moss-text);
  }
</style>
```

`--color-moss` aparece solo como borde. Como texto va `--color-moss-text`, que es la regla dura del sistema.

- [x] **Step 4: Escribir `src/components/ImagenProyecto.astro`**

Resuelve la unión discriminada en un solo lugar, para que la plantilla de página no tenga que saber de variantes.

```astro
---
import { DIAGRAMAS } from './registro';

interface Props {
  imagen:
    | { tipo: 'captura'; src: string; alt: string }
    | { tipo: 'diagrama'; componente: string; alt: string };
}

const { imagen } = Astro.props;
const Diagrama = imagen.tipo === 'diagrama' ? DIAGRAMAS[imagen.componente] : null;

if (imagen.tipo === 'diagrama' && !Diagrama) {
  throw new Error(`El diagrama "${imagen.componente}" no está en el registro`);
}
---

<figure class="imagen">
  {imagen.tipo === 'captura' && <img src={imagen.src} alt={imagen.alt} loading="lazy" />}
  {Diagrama && <Diagrama />}
  <figcaption>{imagen.alt}</figcaption>
</figure>

<style>
  .imagen {
    margin: 0;
  }
  img {
    width: 100%;
    height: auto;
    border: 1px solid var(--color-line);
    border-radius: var(--radius-lg);
  }
  figcaption {
    margin-top: 10px;
    color: var(--color-ink-3);
    font-family: var(--font-micro);
    font-size: var(--text-step--1);
  }
</style>
```

El `throw` es deliberado: una referencia colgante rompe el build en vez de dejar un hueco.

- [x] **Step 5: Escribir `src/pages/proyectos/[slug].astro`**

```astro
---
import { getCollection, render } from 'astro:content';
import type { GetStaticPaths } from 'astro';
import Base from '../../layouts/Base.astro';
import Chip from '../../components/Chip.astro';
import ImagenProyecto from '../../components/ImagenProyecto.astro';
import { MARCAS } from '../../components/registro';

export const getStaticPaths: GetStaticPaths = async () => {
  const proyectos = await getCollection('proyectos');
  return proyectos
    .filter((proyecto) => proyecto.data.nivel <= 2)
    .map((proyecto) => ({ params: { slug: proyecto.id }, props: { proyecto } }));
};

const { proyecto } = Astro.props;
const { data } = proyecto;
const { Content } = await render(proyecto);
const Marca = data.marca ? MARCAS[data.marca] : null;
---

<Base title={`${data.nombre} — EddieBeru`} description={data.linea}>
  <article class="proyecto">
    <header>
      {Marca && <span class="marca"><Marca size={56} /></span>}
      <h1>{data.nombre}</h1>
      <p class="linea">{data.linea}</p>

      <ul class="metadatos">
        <li><Chip>{data.estado}</Chip></li>
        <li><Chip>{data.cuando}</Chip></li>
        {data.rol && <li><Chip>{data.rol}</Chip></li>}
        {data.stack.map((pieza) => <li><Chip tono="acento">{pieza}</Chip></li>)}
      </ul>
    </header>

    {data.imagen && <ImagenProyecto imagen={data.imagen} />}

    <div class="cuerpo">
      <Content />
    </div>

    <section class="enseno">
      <h2>Qué enseñó</h2>
      <p>{data.enseño}</p>
    </section>

    <footer class="enlaces">
      {data.sitio && <a href={data.sitio}>Sitio</a>}
      {data.repo && <a href={data.repo}>Repo</a>}
      {data.repoPrivado && <span class="privado">Repo privado</span>}
    </footer>
  </article>
</Base>

<style>
  .proyecto {
    max-width: 72ch;
    margin-inline: auto;
    padding: 0 24px 96px;
  }
  .marca {
    display: block;
    color: var(--color-neon);
    margin-bottom: 16px;
  }
  h1 {
    font-size: var(--text-step-4);
    margin: 0 0 8px;
  }
  .linea {
    color: var(--color-ink-2);
    font-size: var(--text-step-1);
    margin: 0 0 20px;
  }
  .metadatos {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    list-style: none;
    padding: 0;
    margin: 0 0 40px;
  }
  .cuerpo {
    margin-top: 48px;
  }
  .enseno {
    margin-top: 56px;
    padding: 28px 32px;
    border-left: 1px solid var(--color-line);
    border-radius: var(--radius-lg);
    background: var(--color-surface);
  }
  .enseno h2 {
    margin: 0 0 12px;
    font-size: var(--text-step-2);
    color: var(--color-neon);
  }
  .enseno p {
    margin: 0;
    color: var(--color-ink);
  }
  .enlaces {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-top: 48px;
    font-family: var(--font-micro);
  }
  .privado {
    color: var(--color-ink-3);
  }
</style>
```

El bloque de "Qué enseñó" lleva superficie propia y titular en neón, no una franja de color al costado: el borde es de 1px, que es lo que el sistema permite.

- [x] **Step 6: Correr los tests y verificar que pasan**

Run: `pnpm test`
Expected: PASS.

- [x] **Step 7: Verificar el build**

Run: `pnpm build`
Expected: genera siete rutas bajo `dist/proyectos/`, una por proyecto de nivel 1 y 2.

Verificar: `ls dist/proyectos/` lista los siete directorios.

- [x] **Step 8: Commit**

```bash
git add src/components/Chip.astro src/components/ImagenProyecto.astro src/pages/proyectos tests/paginas.test.ts
git commit -m "feat: add the project page

Fixed structure with no optional sections that leave holes: mark, name, one
line, metadata chips, real image, body, what it taught, links. A private repo
says so instead of linking into the void.

ImagenProyecto resolves the captura/diagrama union in one place and throws on
a dangling registry key, so a missing diagram breaks the build."
```

---

### Task 6: Índice de los trece

**Files:**
- Create: `src/pages/proyectos/index.astro`
- Modify: `tests/paginas.test.ts`

**Interfaces:**
- Consumes: todo lo anterior.
- Produces: la ruta `/proyectos`. La Fase 3 enlaza a ella desde el home.

- [x] **Step 1: Ampliar el test**

Añadir a `tests/paginas.test.ts`:

```ts
import Indice from '../src/pages/proyectos/index.astro';

async function renderIndice() {
  const container = await AstroContainer.create();
  return container.renderToString(Indice);
}

describe('índice de proyectos', () => {
  it('lista los trece', async () => {
    const html = await renderIndice();
    for (const proyecto of await getCollection('proyectos')) {
      expect(html, `falta ${proyecto.data.nombre}`).toContain(proyecto.data.nombre);
    }
  });

  it('nombra la sección de nivel 3 por lo que es', async () => {
    expect(await renderIndice()).toMatch(/trabajo de curso y experimentos/i);
  });

  it('solo enlaza a página propia los de nivel 1 y 2', async () => {
    const html = await renderIndice();
    const proyectos = await getCollection('proyectos');
    for (const proyecto of proyectos.filter((p) => p.data.nivel === 3)) {
      expect(html).not.toContain(`/proyectos/${proyecto.id}"`);
    }
    for (const proyecto of proyectos.filter((p) => p.data.nivel <= 2)) {
      expect(html).toContain(`/proyectos/${proyecto.id}`);
    }
  });
});
```

- [x] **Step 2: Correr el test y verificar que falla**

Run: `pnpm test tests/paginas.test.ts`
Expected: FAIL. No existe `src/pages/proyectos/index.astro`.

- [x] **Step 3: Escribir `src/pages/proyectos/index.astro`**

Los niveles reciben tratamiento distinto a propósito. Nivel 1 son paneles anchos con marca grande; nivel 2 son piezas más angostas; nivel 3 es una tabla honesta. Nada de una retícula de tarjetas iguales repetida trece veces.

```astro
---
import { getCollection } from 'astro:content';
import Base from '../../layouts/Base.astro';
import Chip from '../../components/Chip.astro';
import { MARCAS } from '../../components/registro';

const proyectos = (await getCollection('proyectos')).sort(
  (a, b) => a.data.orden - b.data.orden,
);
const porNivel = (nivel: number) => proyectos.filter((p) => p.data.nivel === nivel);
---

<Base
  title="Proyectos — EddieBeru"
  description="Trece proyectos: los que cargan el peso, los que están a medias y los que fueron tarea."
>
  <div class="pagina">
    <h1>Proyectos</h1>

    <section class="destacados">
      {porNivel(1).map((proyecto) => {
        const Marca = proyecto.data.marca ? MARCAS[proyecto.data.marca] : null;
        return (
          <a class="panel" href={`/proyectos/${proyecto.id}`}>
            {Marca && <span class="marca"><Marca size={40} /></span>}
            <h2>{proyecto.data.nombre}</h2>
            <p>{proyecto.data.linea}</p>
            <ul class="stack">
              {proyecto.data.stack.slice(0, 3).map((pieza) => <li><Chip>{pieza}</Chip></li>)}
            </ul>
          </a>
        );
      })}
    </section>

    <section class="breves">
      <h2 class="titulo-seccion">También</h2>
      {porNivel(2).map((proyecto) => (
        <a class="breve" href={`/proyectos/${proyecto.id}`}>
          <h3>{proyecto.data.nombre}</h3>
          <p>{proyecto.data.linea}</p>
        </a>
      ))}
    </section>

    <section class="curso">
      <h2 class="titulo-seccion">Trabajo de curso y experimentos</h2>
      <p class="aclaracion">
        Un portafolio honesto admite que esto fue tarea. Entran por lo que dejaron, no por
        lo que aparentan.
      </p>
      <ul class="lista">
        {porNivel(3).map((proyecto) => (
          <li>
            <span class="nombre">{proyecto.data.nombre}</span>
            <span class="que-queda">{proyecto.data.enseño}</span>
            {proyecto.data.repo && <a href={proyecto.data.repo}>repo</a>}
          </li>
        ))}
      </ul>
    </section>
  </div>
</Base>

<style>
  .pagina {
    max-width: 1000px;
    margin-inline: auto;
    padding: 0 24px 96px;
  }
  h1 {
    font-size: var(--text-display);
    margin: 0 0 48px;
  }
  .destacados {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }
  .panel {
    display: block;
    padding: 28px;
    border: 1px solid var(--color-line);
    border-radius: var(--radius-lg);
    background: var(--color-surface);
    color: inherit;
    text-decoration: none;
    transition: border-color var(--dur-base) var(--ease-out-quint);
  }
  /* El primero pesa más que los otros tres: los niveles no son una retícula. */
  .panel:first-child {
    grid-column: 1 / -1;
  }
  .panel:hover {
    border-color: var(--color-neon);
  }
  .marca {
    display: block;
    color: var(--color-neon);
    margin-bottom: 14px;
  }
  .panel h2 {
    margin: 0 0 6px;
    font-size: var(--text-step-2);
  }
  .panel p {
    margin: 0 0 16px;
    color: var(--color-ink-2);
  }
  .stack {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .titulo-seccion {
    margin: 72px 0 20px;
    font-size: var(--text-step-2);
    color: var(--color-ink-2);
  }
  .breves {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
  }
  .breve {
    padding: 20px;
    border-top: 1px solid var(--color-line);
    color: inherit;
    text-decoration: none;
  }
  .breve h3 {
    margin: 0 0 6px;
    font-size: var(--text-step-1);
  }
  .breve p {
    margin: 0;
    color: var(--color-ink-3);
    font-size: var(--text-step--1);
  }
  .aclaracion {
    color: var(--color-ink-3);
    margin: 0 0 20px;
  }
  .lista {
    list-style: none;
    padding: 0;
    margin: 0;
    font-family: var(--font-micro);
    font-size: var(--text-step--1);
  }
  .lista li {
    display: grid;
    grid-template-columns: minmax(160px, 200px) 1fr auto;
    gap: 16px;
    padding: 14px 0;
    border-top: 1px solid var(--color-line);
    align-items: baseline;
  }
  .nombre {
    color: var(--color-ink);
  }
  .que-queda {
    color: var(--color-ink-3);
  }
  @media (max-width: 640px) {
    .lista li {
      grid-template-columns: 1fr;
      gap: 4px;
    }
  }
</style>
```

- [x] **Step 4: Correr los tests y verificar que pasan**

Run: `pnpm test`
Expected: PASS, toda la suite.

- [x] **Step 5: Enlazar desde el home**

Modificar `src/pages/index.astro`, añadiendo bajo el párrafo existente:

```astro
  <p><a href="/proyectos">Ver los proyectos</a></p>
```

El home real llega en la Fase 3; esto solo evita que `/proyectos` quede huérfana.

- [x] **Step 6: Verificar el build**

Run: `pnpm build`
Expected: ocho páginas — el home, el índice y las siete de proyecto.

- [x] **Step 7: Commit y push**

```bash
git add src/pages/proyectos/index.astro src/pages/index.astro tests/paginas.test.ts
git commit -m "feat: add the project index

Three tiers get three treatments: wide panels for the four that carry the
site, narrower pieces for the three in-between, and an honest table for the
course work. Not one grid of thirteen identical cards.

The tier-3 section is named what it is, and tests assert it never links to a
page that does not exist."
git push origin main
```

---

## Al terminar la fase

Los trece proyectos existen como contenido validado, con marca e imagen propia, y `/proyectos` los muestra. El schema garantiza que ningún proyecto llegue a producción sin decir qué enseñó ni sin imagen, y los tests protegen dos reglas de privacidad que no dependen de que alguien se acuerde.

Lo que **no** existe todavía: el home real con lluvia y línea de tiempo (Fase 3), los widgets (Fase 4), la simulación en vivo (Fase 5), `/conocimientos` y el guestbook (Fase 6), y el README de perfil sincronizado.

Dos cosas que dependen de Eddie y no de código:

- **Las capturas.** Cada proyecto que hoy lleva diagrama puede llevar además captura; el cambio es una variante en el frontmatter. Las carpetas esperan en `src/assets/proyectos/`.
- **El logo real de Ubot y el de Jellyfin.** Hoy ambos llevan marca propia.

---

## Ejecutado el 2026-07-26

Las seis tareas están completas y desplegadas. `/proyectos` y las siete páginas
de proyecto responden 200 en producción. Suite: 59 tests, `astro check` en cero
errores, build de nueve páginas.

Cinco desvíos respecto del plan escrito:

1. **`src/styles/diagramas.css` en vez de siete bloques `<style>`.** Los siete
   diagramas comparten el mismo lienzo y el mismo vocabulario de formas.
   Duplicar unas noventa líneas de CSS siete veces las habría dejado
   desincronizadas al primer ajuste de color. Cada diagrama importa la hoja
   desde su frontmatter.

2. **Cada diagrama define su propio `marker` con id único** (`punta-ubot`,
   `punta-eco`, …). El plan mostraba un id genérico `punta`; con dos diagramas
   en la misma página los ids colisionan y las puntas de flecha se resuelven
   contra el primer marker del documento.

3. **Una flecha por elemento `<path>`.** El borrador agrupaba varias flechas en
   un solo `path` con varios subtrazos. `marker-end` se coloca en el último
   vértice del path completo, no en el de cada subtrazo, así que solo la última
   flecha del grupo habría tenido punta.

4. **`MARCAS` y `DIAGRAMAS` tipados como `Record<string, Componente | undefined>`
   en vez de `as const`.** Las claves vienen del contenido, que es un string
   cualquiera; con un objeto literal TypeScript rechaza el índice.

5. **`getStaticPaths` sin anotar y `InferGetStaticPropsType`.** Anotar la
   función como `GetStaticPaths` borra la inferencia de props y deja
   `Astro.props` en `unknown`.

Además, `astro check` pasó de ocho errores a cero: faltaba `@types/node` para
los archivos de test y la ampliación de tipos de Vitest en `vitest.config.ts`.
Estaba en rojo desde la Fase 1, o sea que no guardaba nada.

Sigue pendiente de Eddie: las capturas de cada proyecto en
`src/assets/proyectos/<slug>/`, el logo real de Ubot y el de Jellyfin.
