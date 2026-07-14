# DESTRA

Web corporativa de DESTRA construida con Next.js 15, React 19, TypeScript y Tailwind CSS.

## Desarrollo

```bash
npm install
npm run dev
```

La aplicación se sirve por defecto en `http://localhost:3000`.

## Verificación

```bash
npm run typecheck
npm run lint
npm run build
```

## Variables de entorno

Parte de `.env.example` y configura los valores confirmados en `.env.local`:

```bash
cp .env.example .env.local
```

- `CONTACT_WEBHOOK_URL`: endpoint HTTPS confirmado para recibir el formulario. Es obligatorio para enviar; sin él, la API responde `503` y el formulario conserva los datos.
- `NEXT_PUBLIC_CALENDLY_URL`: agenda HTTPS corporativa de DESTRA. Es opcional; sin ella no se carga el iframe ni ningún recurso de Calendly y la página dirige al formulario.

No existen fallbacks a integraciones heredadas. Reinicia `npm run dev` después de modificar variables de entorno.

## Pendiente de confirmar antes de publicar

- Confirmar la URL de Calendly y la identidad mostrada dentro del widget.
- Confirmar el webhook/CRM y su tratamiento de los nuevos campos cualificados.
- Confirmar información legal, privacidad, cookies, razón social, dominio y datos de contacto.
- No añadir canonical, `og:url`, clientes, métricas o certificaciones sin información verificada.
