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
