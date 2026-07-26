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

// El tipo de un componente .astro no se exporta con nombre propio, así que se
// toma del primero. Los registros se indexan con la clave que trae el contenido,
// que es un string cualquiera: de ahí el Record en vez de un objeto literal.
type Componente = typeof Ubot;

// La clave es la que el contenido declara en `marca`. El test de registro falla
// si una entrada de proyecto nombra algo que no está aquí, y también al revés.
export const MARCAS: Record<string, Componente | undefined> = {
  ubot: Ubot,
  omnirpg: OmniRPG,
  'simulacion-ecosistema': SimulacionEcosistema,
  'jellyfin-uwp-client': JellyfinUWPClient,
  'pollo-asado': PolloAsado,
  'espacios-compartidos': EspaciosCompartidos,
  'segundo-parcial-programacion': SegundoParcialProgramacion,
};

// La clave es la que el contenido declara en `imagen.componente`.
export const DIAGRAMAS: Record<string, Componente | undefined> = {
  'ubot-renderizado': UbotRenderizado,
  'omnirpg-verdad': OmnirpgVerdad,
  'ecosistema-red': EcosistemaRed,
  'jellyfin-serializacion': JellyfinSerializacion,
  'pollo-asado-insight': PolloAsadoInsight,
  'espacios-cuartos': EspaciosCuartos,
  'segundo-parcial-iterador': SegundoParcialIterador,
};
