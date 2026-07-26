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
      proyectos
        .map((p) => (p.data.imagen?.tipo === 'diagrama' ? p.data.imagen.componente : null))
        .filter(Boolean),
    );
    expect(Object.keys(MARCAS).filter((k) => !marcasUsadas.has(k))).toEqual([]);
    expect(Object.keys(DIAGRAMAS).filter((k) => !diagramasUsados.has(k))).toEqual([]);
  });
});
