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
      expect(proyecto.data.imagen!.alt.length, `${proyecto.id}: alt vacío`).toBeGreaterThan(10);
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
    // Cuenta exacta a propósito. Un YAML mal indentado no rompe el build: el loader
    // registra el error y devuelve la colección vacía. Solo un conteo exacto lo delata.
    expect(inventario).toHaveLength(18);
    for (const item of inventario) {
      if (item.data.nivel) {
        expect(['en serio', 'maso', 'toqué']).toContain(item.data.nivel);
      }
    }
  });

  it('todo repo enlazado es de EddieBeru', async () => {
    for (const proyecto of await getCollection('proyectos')) {
      if (!proyecto.data.repo) continue;
      expect(proyecto.data.repo, `${proyecto.id} enlaza fuera`).toMatch(
        /^https:\/\/github\.com\/EddieBeru\/[\w.-]+$/,
      );
    }
  });

  it('aprendiendo ahora existe y tiene fecha', async () => {
    const entradas = await getCollection('aprendiendo');
    expect(entradas).toHaveLength(1);
    expect(entradas[0]!.data.actualizado).toBeInstanceOf(Date);
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
