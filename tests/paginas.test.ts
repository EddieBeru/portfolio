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
