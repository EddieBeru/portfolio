import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
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

  it('siempre emite una URL canónica, incluso sin Astro.site', async () => {
    expect(await render()).toMatch(/<link rel="canonical" href="https?:\/\/[^"]+"/);
  });
});

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
