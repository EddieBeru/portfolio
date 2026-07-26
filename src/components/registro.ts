import EspaciosCompartidos from './marcas/EspaciosCompartidos.astro';
import JellyfinUWPClient from './marcas/JellyfinUWPClient.astro';
import OmniRPG from './marcas/OmniRPG.astro';
import PolloAsado from './marcas/PolloAsado.astro';
import SegundoParcialProgramacion from './marcas/SegundoParcialProgramacion.astro';
import SimulacionEcosistema from './marcas/SimulacionEcosistema.astro';
import Ubot from './marcas/Ubot.astro';

// La clave es la que el contenido declara en `marca`. El test de registro falla
// si una entrada de proyecto nombra algo que no está aquí, y también al revés.
export const MARCAS = {
  ubot: Ubot,
  omnirpg: OmniRPG,
  'simulacion-ecosistema': SimulacionEcosistema,
  'jellyfin-uwp-client': JellyfinUWPClient,
  'pollo-asado': PolloAsado,
  'espacios-compartidos': EspaciosCompartidos,
  'segundo-parcial-programacion': SegundoParcialProgramacion,
} as const;

export const DIAGRAMAS = {} as const;
