// Astro guarda el almacén de contenido en dos sitios según el modo:
// `astro sync` y `astro build` lo escriben en el cacheDir (node_modules/.astro),
// mientras que en modo dev el módulo virtual `astro:data-layer-content` lo busca
// en .astro/. Vitest corre Vite con command 'serve', así que getViteConfig
// resuelve como dev y sin este puente getCollection devuelve colecciones vacías.
import { copyFileSync, cpSync, existsSync, mkdirSync } from 'node:fs';

const ORIGEN = 'node_modules/.astro';
const DESTINO = '.astro';

if (!existsSync(`${ORIGEN}/data-store.json`)) {
  console.error('No hay almacén de contenido. Corré `astro sync` antes que esto.');
  process.exit(1);
}

mkdirSync(DESTINO, { recursive: true });
copyFileSync(`${ORIGEN}/data-store.json`, `${DESTINO}/data-store.json`);

// El modo fragmentado guarda las colecciones en un directorio aparte.
if (existsSync(`${ORIGEN}/data-store`)) {
  cpSync(`${ORIGEN}/data-store`, `${DESTINO}/data-store`, { recursive: true });
}
