# Mapa del código de Jhonify

Todo está agrupado por lo que hace, en español, para encontrarlo rápido.

| Quiero cambiar... | Carpeta / archivo |
| --- | --- |
| Pantalla de **inicio de sesión** | `src/pantallas/iniciar-sesion/PantallaIniciarSesion.tsx` |
| Pantalla de **registro** | `src/pantallas/registro/PantallaRegistro.tsx` |
| Pantalla de **inicio** (buscar + sugerencias) | `src/pantallas/inicio/PantallaInicio.tsx` |
| Pantalla de **biblioteca** | `src/pantallas/biblioteca/PantallaBiblioteca.tsx` |
| Pantalla de **favoritos** | `src/pantallas/favoritos/PantallaFavoritos.tsx` |
| Pantalla de **perfil** | `src/pantallas/perfil/PantallaPerfil.tsx` |
| **Reproductor**: barra inferior | `src/reproductor/BarraReproductor.tsx` |
| **Reproductor**: pantalla completa + letra | `src/reproductor/ReproductorGlobal.tsx` |
| **Reproductor**: estado global (cola, play, siguiente) | `src/reproductor/estado-reproductor.tsx` |
| Canciones sugeridas por categoría | `src/reproductor/canciones-sugeridas.ts` |
| **Diseño**: menú, sidebar, botones azules | `src/diseno/LayoutApp.tsx` |
| **Diseño**: logo | `src/diseno/Logo.tsx` |
| **Diseño**: tema claro / oscuro negro | `src/diseno/tema.tsx` |
| Colores y tokens | `src/styles.css` |
| Búsqueda de YouTube (servidor) | `src/servidor/youtube.functions.ts` |
| Letras de canciones (servidor) | `src/servidor/letras.functions.ts` |

## Rutas (URLs)

`src/routes/` sólo conecta cada URL con su pantalla; el contenido vive en `src/pantallas/`.

| URL | Archivo de ruta |
| --- | --- |
| `/iniciar-sesion` | `src/routes/iniciar-sesion.tsx` |
| `/registro` | `src/routes/registro.tsx` |
| `/inicio` | `src/routes/_authenticated/inicio.tsx` |
| `/biblioteca` | `src/routes/_authenticated/biblioteca.tsx` |
| `/favoritos` | `src/routes/_authenticated/favoritos.tsx` |
| `/perfil` | `src/routes/_authenticated/perfil.tsx` |

`_authenticated` significa que hay que iniciar sesión para entrar.
