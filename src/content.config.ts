import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

const ALT_MINIMO = 'El texto alternativo es parte de la voz, no un trámite';

const imagen = z.discriminatedUnion('tipo', [
  z.object({
    tipo: z.literal('captura'),
    src: z.string(),
    alt: z.string().min(10, ALT_MINIMO),
  }),
  z.object({
    tipo: z.literal('diagrama'),
    componente: z.string(),
    alt: z.string().min(10, ALT_MINIMO),
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
          code: 'custom',
          path: ['imagen'],
          message: 'Los proyectos con página propia necesitan imagen real: captura o diagrama',
        });
      }
      if (data.nivel <= 2 && !data.marca) {
        ctx.addIssue({
          code: 'custom',
          path: ['marca'],
          message: 'Los proyectos con página propia necesitan marca',
        });
      }
      if (data.repoPrivado && data.repo) {
        ctx.addIssue({
          code: 'custom',
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
