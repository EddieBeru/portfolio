import EcosistemaRed from './diagramas/EcosistemaRed.astro';
import EspaciosCuartos from './diagramas/EspaciosCuartos.astro';
import JellyfinSerializacion from './diagramas/JellyfinSerializacion.astro';
import OmnirpgVerdad from './diagramas/OmnirpgVerdad.astro';
import PolloAsadoInsight from './diagramas/PolloAsadoInsight.astro';
import SegundoParcialIterador from './diagramas/SegundoParcialIterador.astro';
import UbotRenderizado from './diagramas/UbotRenderizado.astro';
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

// La clave es la que el contenido declara en `imagen.componente`.
export const DIAGRAMAS = {
  'ubot-renderizado': UbotRenderizado,
  'omnirpg-verdad': OmnirpgVerdad,
  'ecosistema-red': EcosistemaRed,
  'jellyfin-serializacion': JellyfinSerializacion,
  'pollo-asado-insight': PolloAsadoInsight,
  'espacios-cuartos': EspaciosCuartos,
  'segundo-parcial-iterador': SegundoParcialIterador,
} as const;
