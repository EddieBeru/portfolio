---
nombre: OmniRPG
linea: Un RPG donde el mundo se genera y la aventura se narra sola.
nivel: 1
estado: en curso
cuando: '2026'
rol: Diseño y desarrollo completo
stack: [Godot, GDScript, Python, Gemini]
enseño: La primera versión metía cliente y servidor en la misma pieza y se desincronizaba sin remedio. La reescritura invirtió el modelo, y el servidor Python es la única fuente de verdad y los clientes solo reaccionan.
imagen:
  tipo: diagrama
  componente: omnirpg-verdad
  alt: Diagrama del servidor Python como única fuente de verdad. Dos clientes de Godot reaccionan a lo que el servidor dicta, y Gemini escribe la narrativa a partir de ese mismo estado.
marca: omnirpg
repoPrivado: true
orden: 2
---

Nació de un gusto compartido: a mi pareja le encanta D&D y los juegos de rol, y a mí me
gustan las decisiones y las historias. Así que hice un juego donde una IA arma un
universo, una historia y, al final, una aventura.

## Arquitectura por fracaso

La primera versión era una página Astro con cliente y servidor en la misma pieza. Nunca
supe sincronizarla bien. Llegamos a jugarla y fue un desmadre. La reescritura le dio
vuelta al modelo: un servidor Python manda, los clientes obedecen.

## El reparto con la IA

El código Python genera el mundo de forma aleatoria y determinista. Gemini escribe la
narrativa para la inmersión. **El código es el table master; Gemini es la voz.** La IA
narra, pero no decide la verdad del mundo.

## Asincronía

Cada jugador puede avanzar solo. Cuando el otro vuelve, recibe un resumen de lo que
ocurrió mientras estuvo fuera.

El repo es privado.
