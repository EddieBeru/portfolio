---
nombre: Ubot
linea: Preparación para el examen de admisión de las universidades públicas de Costa Rica.
nivel: 1
estado: vivo
cuando: '2026'
rol: Frontend completo
stack: [Blazor WASM, .NET, LaTeX, PWA, Azure, Railway]
enseño: Renderizar LaTeX era lo más pesado de la aplicación, y ese peso delató que Blazor redibujaba la página entera en cada cambio de estado. El problema caro reveló cómo funcionaba la herramienta por dentro, y de ahí salió aprender a separar y acotar los procesos de renderizado.
imagen:
  tipo: diagrama
  componente: ubot-renderizado
  alt: Diagrama del alcance del renderizado en Blazor. A la izquierda, el árbol de componentes entero redibujándose en cada cambio de estado. A la derecha, solo el nodo de LaTeX.
marca: ubot
repoPrivado: true
sitio: https://ubotcr.com
orden: 1
---

Chat con IA para resolver dudas, exámenes simulacro y juegos de estudio: flipcards,
flipmatch y una torre de poder al estilo Mortal Kombat. Yo hice el frontend completo;
Efraín, el backend.

Está vivo y creciendo: unos 80 usuarios registrados y unos 5 diarios. Es el proyecto
más grande que tengo y del que estoy más orgulloso.

## La migración

Empezó en Railway, que era simple. Nos pasamos a Azure por los créditos de startups y
ahí se acabó lo simple: hubo roturas y costó encontrar lo que uno necesitaba. Lo que
quedó fue experiencia real en las dos plataformas, no en una.

## El equipo

Efraín y yo. Antes nos decíamos yonpork; hoy somos Ubot. No es una empresa constituida,
somos un grupito. La landing de ubotcr.com también es mía.
