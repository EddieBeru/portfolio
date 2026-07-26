---
nombre: JellyfinUWPClient
linea: Un cliente de Jellyfin para Xbox, porque la tele de la casa no era smart.
nivel: 1
estado: muerto
cuando: '2023'
rol: Desarrollo completo
stack: [C#, .NET, UWP]
enseño: Siendo novato no entendía cómo hablarle a una API. Cuando entendí la serialización en C#, todo se volvió mucho más sencillo. Ese fue el desbloqueo, y llegó antes de entrar a la carrera.
imagen:
  tipo: diagrama
  componente: jellyfin-serializacion
  alt: Antes y después del desbloqueo. A la izquierda, la respuesta cruda de la API que no sabía leer. A la derecha, el objeto tipado de C# al que la serialización la convierte.
marca: jellyfin-uwp-client
repoPrivado: false
orden: 4
---

La tele de la casa no era smart y lo único conectado a ella era una Xbox. No había
cliente de Jellyfin que sirviera, así que hice uno. Llegó a listar todo el contenido y a
reproducir video, y lo publiqué en la Microsoft Store.

## Cómo murió

Quise reescribirlo para corregir los errores de novato. Fue tanto trabajo que lo dejé
botado. Así, sin maquillaje: funcionaba, y lo mató un reescribir.

## Qué queda

Perdí el acceso a la cuenta de desarrollador y la app ya no aparece en la búsqueda de la
Store. El código tampoco está publicado en GitHub. Lo que se quedó fue el desbloqueo de
la serialización, y todo lo que vine a hacer después en C# salió de ahí.
