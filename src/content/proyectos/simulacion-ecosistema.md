---
nombre: SimulacionEcosistema
linea: Un campo con agua, plantaciones y animales que se comen entre sí, corriendo en consola con emojis.
nivel: 1
estado: archivado
cuando: 2025 · 1.er ciclo
rol: Proyecto de curso
stack: [C++, Herencia y polimorfismo, Punteros, Estructuras de datos]
enseño: Herencia y polimorfismo para las especies, punteros y gestión de memoria, todo aplicado a un sistema donde cada parte depende de otra. Y algo menos técnico, y es que ver una simulación ocurrir me gusta.
imagen:
  tipo: diagrama
  componente: ecosistema-red
  alt: Red de dependencias del ecosistema. El agua alimenta las plantaciones, las plantaciones a los herbívoros y los herbívoros a los carnívoros, mientras el clima y la temporada modulan todas las tasas de aparición.
marca: simulacion-ecosistema
repo: https://github.com/EddieBeru/SimulacionEcosistema
orden: 3
---

Los animales podían ser carnívoros, omnívoros o herbívoros, y todos tenían que comer.
Las plantaciones necesitaban agua. Encima, climas y temporadas cambiaban las tasas de
aparición de animales, charcos y cultivos. Todo eso corría en una consola donde cada
emoji era una celda del mapa.

## La explosión de conejos

Calibrar la tasa de reproducción de los conejos costó más que escribir el resto. En
cierto punto era tan exagerada que el mapa explotaba de conejos y no quedaba nada más
que ver.

## Sobre la imagen

Este proyecto no lleva captura a propósito: corría en consola. La recreación en vivo,
corriendo en el navegador con la paleta de este sitio, llega más adelante.
