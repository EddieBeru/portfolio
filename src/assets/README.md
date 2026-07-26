# Assets

Aquí van las imágenes. Astro optimiza automáticamente todo lo que viva en `src/assets/` —
convierte a AVIF/WebP, genera tamaños responsive y calcula las dimensiones. Por eso las
imágenes van aquí y **no** en `public/`.

## Dónde poner qué

```
src/assets/
  proyectos/<slug>/     capturas del proyecto
  marcas/               marcas propias en SVG (las hago yo, no las llenes)
```

Las carpetas de proyecto ya están creadas y esperando:

| Carpeta | Proyecto | Qué falta |
|---|---|---|
| `proyectos/ubot/` | Ubot | capturas de ubotcr.com y de la app |
| `proyectos/omnirpg/` | OmniRPG | capturas del cliente en Godot |
| `proyectos/jellyfin-uwp-client/` | JellyfinUWPClient | capturas del Store, si recuperas la cuenta |
| `proyectos/pollo-asado/` | PolloAsado | lo que haya, aunque esté a medias |
| `proyectos/espacios-compartidos/` | espacios-compartidos | lo que haya |
| `proyectos/segundo-parcial-programacion/` | SegundoParcialProgramacion | consola corriendo, o nada |
| `proyectos/simulacion-ecosistema/` | SimulacionEcosistema | **no hace falta** — se recrea en vivo en el navegador |

## Cómo nombrar los archivos

El orden numérico decide el orden en que aparecen. La primera es la principal.

```
01-hero.png          la imagen principal del proyecto
02-<lo-que-sea>.png  ej. 02-simulacro.png, 03-flipcards.png
```

Nombres en minúscula, con guiones, descriptivos. `02-chat-ia.png` sirve; `Captura de pantalla 2026-07-25 a las 14.32.11.png` no.

## Formato

- **PNG** para capturas de UI. **JPG** para fotos. **SVG** para logos y diagramas.
- **Ancho mínimo 1600px** en la imagen principal. Astro puede achicar, no puede inventar píxeles.
- No la comprimas antes: Astro lo hace mejor. Sube el original.
- No hace falta que sean livianas ni que estén recortadas a un tamaño exacto.

## Un detalle que no es opcional

Cada imagen necesita texto alternativo, y lo escribo yo cuando las conectemos —
pero si al subirlas me dejas dicho qué se ve en cada una, sale mejor. En este sitio
el texto alternativo es parte de la voz, no un requisito que se cumple con desgano.

Cuando subas algo, avísame y lo conecto a las páginas.
