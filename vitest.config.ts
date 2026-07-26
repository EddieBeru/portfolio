import { getViteConfig } from 'astro/config';

// getViteConfig aplica el plugin de Astro sobre la configuración de Vitest.
// Sin él, Vitest trata los .astro como JS y falla al parsear el template.
export default getViteConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
