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
