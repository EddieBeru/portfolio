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
