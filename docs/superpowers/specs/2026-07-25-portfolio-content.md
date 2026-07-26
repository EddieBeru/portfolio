# Portafolio — contenido y arquitectura de páginas

**Fecha:** 2026-07-25
**Estado:** propuesto
**Depende de:** [2026-07-25-portfolio-design.md](2026-07-25-portfolio-design.md) (lenguaje visual y stack)
**Alcance:** qué contenido existe, cómo se estructura, cómo se modela. No cubre implementación.

---

## Identidad

```
Firma:        EddieBeru
Carrera:      Ingeniería en Sistemas de la Información — Universidad Nacional
Ubicación:    Costa Rica
Estado:       6.º semestre · ingreso 2024 · graduación estimada 2028
GitHub:       github.com/EddieBeru
Email:        eddieberu@outlook.com
LinkedIn:     linkedin.com/in/eddieberu
```

Autodescripción, en sus palabras: *persona tranquila pero apasionada en sus gustos; le gustan los gatos y todo lo chill, aunque también adora hacer locuras de vez en cuando.*

### Reglas de privacidad

- La pareja de Eddie se menciona como **"mi pareja"**. Nunca se revela su género, en ninguna parte del sitio, el copy alternativo, los commits ni los metadatos.
- Los widgets exponen trabajo, nunca vida: sin actividad en vivo, sin ubicación en tiempo real, sin reproducción actual.
- La historia de ConocimientoWebDev que motivó la lista de bans **no se publica**. La postura sí; el reclamo no.

---

## Proyectos

Trece proyectos en tres niveles. El nivel determina cuánta superficie recibe cada uno, no cuánto vale.

### Nivel 1 — página propia completa

Los cuatro que cargan el sitio. Cada uno tiene una historia con falla, aprendizaje y consecuencia.

#### Ubot

Preparación para el examen de admisión de las universidades públicas de Costa Rica: chat con IA, exámenes simulacro y juegos de estudio (flipcards, flipmatch y una torre de poder al estilo Mortal Kombat).

```
Rol:        frontend completo (Efraín: backend)
Stack:      Blazor WASM · .NET · LaTeX · PWA
Deploy:     Railway → Azure (créditos de startups)
Escala:     ~80 usuarios registrados · ~5 diarios
Estado:     vivo y creciendo
Repo:       privado, organización propia
Sitio:      ubotcr.com (landing también hecha por Eddie)
Equipo:     Eddie + Efraín. Antes "yonpork", hoy Ubot. No es empresa constituida.
```

**Qué enseñó — la historia ancla del sitio.** Renderizar LaTeX era lo más pesado de la aplicación, y ese peso delató algo que no se veía: Blazor estaba redibujando la página entera en cada cambio de estado. El problema caro reveló cómo funcionaba la herramienta por dentro, y de ahí salió aprender a separar y acotar los procesos de renderizado. También: cómo el navegador actualiza el DOM y cómo eso interactúa con .NET, guardado local de archivos y datos, PWA, y despliegue en dos nubes distintas.

**La migración.** Railway era simple; Azure no. Hubo roturas y costó encontrar lo que se necesitaba. Se migró por los créditos de startups, y el resultado es experiencia real en ambas plataformas.

#### OmniRPG

Un RPG donde el mundo se genera y la aventura se narra sola. Nació de un gusto compartido: a la pareja de Eddie le encanta D&D y los juegos de rol; a Eddie le gustan las decisiones y las historias.

```
Stack:      Godot + GDScript (cliente) · Python (servidor) · Gemini (narrativa)
Estado:     jugado en la versión anterior; reescrito, en curso
Repo:       privado — confirmar antes de enlazar
```

**Qué enseñó — arquitectura por fracaso.** La primera versión era una página Astro con cliente y servidor en la misma pieza. Se desincronizaba y fue un desastre; llegaron a jugarla y fue un desmadre. La reescritura invirtió el modelo: un servidor Python es la **única fuente de verdad** y los clientes solo reaccionan.

**El reparto con la IA, que es la postura de Eddie hecha arquitectura.** El código Python genera el mundo de forma aleatoria y determinista; Gemini escribe la narrativa para la inmersión. *El código es el table master; Gemini es la voz.* La IA narra pero no decide la verdad del mundo.

**Asincronía.** Cada jugador puede avanzar solo; cuando el otro vuelve, recibe un resumen de lo que ocurrió mientras estuvo fuera.

#### SimulacionEcosistema

Simulación de un campo con agua, plantaciones y animales carnívoros, omnívoros y herbívoros, corriendo en consola con emojis. Los animales necesitan comer, las plantaciones necesitan agua, y climas y temporadas alteran las tasas de aparición de animales, charcos y cultivos.

```
Stack:      C++
Contexto:   proyecto de curso, 2025 · 1.er ciclo
Repo:       github.com/EddieBeru/SimulacionEcosistema
```

**Qué enseñó.** Herencia y polimorfismo para las especies, punteros, gestión de memoria y estructuras de datos, todo aplicado a un sistema con partes interconectadas. Y algo menos técnico: que ver una simulación ocurrir le gusta.

**La anécdota.** Calibrar la tasa de reproducción de los conejos costó. En cierto punto era tan exagerada que el mapa explotaba de conejos.

**Tratamiento visual.** Este proyecto no lleva captura. Corría en consola con emojis, así que se **recrea corriendo en vivo** en su página, en el navegador, con la paleta del sitio. Es la pieza interactiva del portafolio y es contenido y evidencia al mismo tiempo.

#### JellyfinUWPClient

Cliente de Jellyfin para Xbox, construido en 2023, antes de entrar a la carrera.

```
Stack:      C# · .NET · UWP
Estado:     muerto pero valioso — funcionaba; lo mató un reescribir
Publicado:  Microsoft Store (cuenta de desarrollador perdida; la app ya no aparece en búsqueda)
```

**Por qué existe.** La tele de la casa no era smart y lo único conectado a ella era una Xbox. No había cliente que sirviera, así que hizo uno. Llegó a listar todo el contenido y a reproducir video.

**Qué enseñó.** Siendo novato, no entendía cómo hablarle a una API. Cuando entendió la serialización en C#, todo se volvió mucho más sencillo. Ese fue el desbloqueo.

**Cómo murió.** Intentó reescribirlo para corregir los errores de novato, y fue tanto trabajo que lo dejó botado. Se cuenta así, sin maquillaje.

**Marca:** usa el logo de Jellyfin. Es legítimo: es un cliente de Jellyfin.

### Nivel 2 — página propia breve

#### PolloAsado
App de finanzas personales con insights para aprender a manejar el dinero. JavaScript. Con una amiga de residencias estudiantiles. En proceso, lento, porque la universidad se atraviesa. Repo público.

#### espacios-compartidos
Experimento abandonado: crear cuartos y publicarlos exponiendo tus gustos. JavaScript. **No se presenta como fracaso: se presenta como el antecedente directo de este portafolio.** La idea no murió, cambió de forma — este sitio es ese cuarto.

#### SegundoParcialProgramacion
Catalogado como olvidable por su autor; es el repo con mejor arquitectura de los viejos. Contenedor genérico, iterador y nodo propios (lista enlazada con iterador implementado a mano), patrón Facade, patrón Observer, persistencia en CSV. C++, en un parcial. Se muestra por lo que revela: patrones de diseño aplicados sin que nadie los pidiera por nombre.

### Nivel 3 — lista honesta

Entran con una línea cada uno y sin ceremonia. La sección se llama lo que es: trabajo de curso y experimentos. Un portafolio honesto admite "esto fue tarea".

| Proyecto | Qué es | Qué queda |
|---|---|---|
| ProyectoPrograII | Sistema de matrícula, C++ | Seis estructuras de listas propias, sin STL |
| AdminBiblioProyecto | Biblioteca con préstamos y reportes, C++ | MVC estricto, serialización propia, jerarquía de excepciones |
| Backend_Proyecto-2_Progra-3 | Backend de farmacia, Java | Sockets crudos, DAO + Service, hashing de contraseñas. Odió el curso; el repo muestra más de lo que recuerda |
| ConocimientoWebDev | Proyecto continuo de Programación 4 | Desarrollo web con diseño propio y atención al detalle |
| PWA-demo | PacMan como PWA, para una presentación de Progra 4 | Reutilizó componentes de ConocimientoWebDev |
| PokerMod | Mod de póker para Minecraft (Fabric), con Efraín | Murió en scaffolding — el `ExampleMixin` sigue intacto. Alcanzó CI en Actions e icono propio |

---

## Línea de tiempo

El eje narrativo. Cuatro hitos confirmados, en orden:

| Cuándo | Qué pasó | Por qué marcó |
|---|---|---|
| 2023 | Metió mano en C# con .NET, en serio | Aprendió montones y de ahí nació JellyfinUWPClient — antes de la carrera |
| 2024 | Entró a la carrera | Empezó el aprendizaje formal y las buenas prácticas, con C++ al inicio |
| 2025 · 1.er ciclo | SimulacionEcosistema | Descubrió que ver simulaciones ocurrir le gusta, y principios de programación que sí sirvieron |
| 2026 | Nace Ubot | Frontend y manejo de deploys, a otra escala |

La línea de tiempo **rompe la retícula** (regla de `DESIGN.md`) y enlaza a los proyectos que nacieron en cada punto. No es un CV en orden inverso: es una curva que sube.

---

## Inventario de conocimientos

Tres niveles, en el vocabulario de Eddie. Nada de barras de porcentaje ni de estrellas: son mentira y todos lo saben.

- **`en serio`** — construyó cosas reales con esto
- **`maso`** — sabe algo más que lo básico, no experto
- **`toqué`** — lo probó, entiende qué es, no lo domina

| Categoría | Contenido |
|---|---|
| Lenguajes | C# `en serio` · C++ `maso` · JavaScript `maso` · Python `maso` · Java `maso` · GDScript `maso` · SQL `toqué` |
| Frameworks | .NET `en serio` · Blazor `maso` · Godot `maso` |
| Nube y deploy | Azure `maso` · Railway `maso` |
| Herramientas | VSCode · Antigravity (IDE y CLI) · OpenCode · Claude Code · git · adb |

**Las opiniones son parte del inventario, no una nota al pie.** Un inventario donde nada le cae mal a nadie no lo cree nadie:

- **Java lo detesta.** Se dice.
- **JavaScript le incomoda**: la sintaxis tan liberal se le hace rara. Prefiere tipado.
- **C++ lo dejó con la sensación de que tiene mucho más que ofrecer** de lo que alcanzó a ver.

Esa preferencia por el tipado no es trivia: explica por qué C# es lo que mejor maneja, y justifica que este sitio se construya en TypeScript.

**adb** no viene de un curso. Viene de trastear su Android de entonces: debugging, sideloading y hasta custom ROMs. Entra porque es curiosidad técnica real fuera de la carrera, que es exactamente lo que el sitio quiere mostrar.

### Postura sobre IA

Sección propia, no una fila de logos. Publicable tal como lo dijo:

> La IA es una buena herramienta para el desarrollo, pero dejar que lo haga todo mata la personalidad de las personas y aquello que las hace únicas. Además, publicar contenido sin revisar arruina la experiencia de todos. Siempre supervisada.

Tiene credibilidad porque hay evidencia: hay un `src/Prompts/promptSegundoProyecto.txt` commiteado en un repo de curso, y OmniRPG está construido con esa regla escrita en la arquitectura — el código es el table master, Gemini es solo la voz.

---

## Arquitectura de páginas

```
/                        Home
/proyectos               Índice de los trece
/proyectos/[slug]        Página de proyecto (nivel 1 y 2)
/conocimientos           Inventario completo + postura sobre IA
```

Sin página "sobre mí" separada: la identidad vive en el home y en la línea de tiempo. Una página de biografía aparte diluiría el eje, que es el trabajo.

### Home

Orden deliberado según el CTA acordado — que aprecien los proyectos primero, con GitHub y contacto accesibles pero sin robar atención:

1. **Hero** — quién es, en su voz. Lluvia en canvas. Un solo acento ámbar.
2. **Proyectos destacados** — los cuatro de nivel 1, en paneles de tamaños distintos según su peso. Nunca una retícula de tarjetas iguales.
3. **Línea de tiempo** — la curva, rompiendo la retícula, enlazando a proyectos.
4. **Widgets** — heatmap, último commit, aprendiendo ahora, stickers. El rincón Y2K.
5. **Inventario resumido** — con enlace a la página completa.
6. **Guestbook** — giscus.
7. **Contacto** — el único ámbar de esta zona.

### Página de proyecto

Estructura fija, sin secciones opcionales que dejen huecos:

1. Marca del proyecto + nombre + una línea
2. Metadatos en Sono: tipo, estado, cuándo, rol, stack en chips
3. **Imagen real, siempre.** Captura, recreación en vivo o diagrama. Nunca un bloque de color.
4. Por qué lo hizo
5. **Qué enseñó** — campo de primera clase, con peso visual propio, tal como manda `DESIGN.md`
6. Qué salió mal, cuando lo hay. La explosión de conejos y la desincronización de OmniRPG son contenido, no vergüenza.
7. Enlaces: repo, demo. Si el repo es privado, se dice; no se enlaza al vacío.

---

## Imágenes

Regla dura de `DESIGN.md`: cero imágenes es un bug, no restricción. Cada proyecto necesita una imagen real además de su marca.

| Proyecto | Marca | Imagen |
|---|---|---|
| Ubot | logo real existente | capturas de ubotcr.com |
| JellyfinUWPClient | logo de Jellyfin | capturas de la página del Store, si se recupera la cuenta |
| SimulacionEcosistema | marca propia | recreación en vivo en el navegador |
| OmniRPG | marca propia | captura del cliente Godot |
| Resto | marca propia | captura, diagrama de arquitectura o visualización de código |

Las marcas propias son SVG pequeños construidos con los tokens del sitio: un glifo o monograma por proyecto, mismo sistema, misma paleta. Se descartó usar logos de terceros (C++, Java) como identidad de proyecto: es la grilla de logos genéricos que el sitio rechaza, y no muestra nada propio.

---

## Modelo de contenido

Una colección de Astro por tipo, validada con Zod.

```
src/content/
  proyectos/     un .mdx por proyecto
  hitos/         un .mdx por hito de la línea de tiempo
  conocimientos/ un .yaml con el inventario
  aprendiendo/   un .md editable a mano — alimenta el widget
```

Campos de `proyectos` que el diseño exige y el schema debe garantizar: `nivel` (1|2|3), `estado`, `rol`, `stack[]`, `enseñó` (obligatorio, sin default vacío), `imagen` (obligatoria), `repoPrivado` (booleano, para decidir si se enlaza).

Que `enseñó` e `imagen` sean obligatorios en el schema es deliberado: son los dos campos que el sitio no puede permitirse vacíos, y Zod los convierte en error de build en vez de en un hueco en producción.

---

## Pendientes

- Confirmar si el repo de OmniRPG es privado antes de decidir cómo enlazarlo.
- Recuperar, si se puede, la cuenta de desarrollador de Microsoft Store para las capturas de JellyfinUWPClient.
- Capturas del cliente de OmniRPG en Godot.
- Decidir si ConocimientoWebDev y PWA-demo se fusionan en una entrada: son el mismo curso y comparten componentes.
