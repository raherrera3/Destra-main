# Fuentes

## Neue Montreal (principal) — pendiente de archivo

La web pide **Neue Montreal** como tipografía principal, pero la fuente **no está
en este repositorio** y no puede estarlo: es comercial (Pangram Pangram,
<https://pangrampangram.com/products/neue-montreal>) y su licencia no permite
redistribuirla.

Hasta que el archivo exista, la web se ve en Helvetica Neue / Arial.

### Cómo completarla

Compra la licencia **web** y deja los tres archivos aquí, con estos nombres
exactos:

```
public/fonts/NeueMontreal-Regular.woff2   (peso 400)
public/fonts/NeueMontreal-Medium.woff2    (peso 500)
public/fonts/NeueMontreal-Bold.woff2      (peso 700)
```

No hay que tocar ni una línea de código: las reglas `@font-face` de
`app/globals.css` ya apuntan a esas rutas y la fuente entra sola en el siguiente
despliegue.

Si el proveedor entrega `.otf` o `.ttf` en lugar de `.woff2`, conviértelos antes
(por ejemplo con <https://transfonter.org/>): woff2 pesa la mitad y es el único
formato que necesitan los navegadores actuales.

### Comprobar que ha funcionado

En la consola del navegador, sobre la web ya cargada:

```js
const m = (f) => { const c = document.createElement("canvas").getContext("2d"); c.font = `48px ${f}`; return c.measureText("Destra ABCwxyz").width };
m('"Neue Montreal"') !== m('"FuenteQueNoExiste"')  // true = la fuente carga
```

Ojo: `document.fonts.check()` **no sirve** para esto, devuelve `true` aunque la
fuente no exista.

## Azeret Mono (secundaria) — ya funciona

Se sirve con `next/font/google` desde `app/layout.tsx`, que la autoaloja y
expone como `--font-mono`. No requiere ningún archivo aquí.
