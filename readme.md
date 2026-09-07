# Destra Web

Web corporativa de Destra construida con Next.js App Router.

## Desarrollo local

```bash
pnpm install
pnpm dev
```

La aplicación queda disponible en `http://localhost:3000`.

## Comprobaciones

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Variables de entorno

Copia `.env.example` a `.env.local` y configura:

- `RESEND_API_KEY`: clave de Resend utilizada para enviar el correo.
- `CONTACT_FROM_EMAIL`: remitente válido; puede usar el formato `Destra <correo@dominio>`.
- `CONTACT_TO_EMAIL`: dirección que recibe las solicitudes.
- `TURNSTILE_SECRET_KEY`: clave privada para verificar Cloudflare Turnstile en el servidor.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: clave pública que carga el widget de Turnstile.
- `CRM_WEBHOOK_URL`: endpoint HTTPS opcional que recibe el lead después de que Resend acepte el correo. No admite credenciales embebidas en la URL.

Las cinco primeras variables son obligatorias: si falta alguna, la API de contacto responde `503`. Reinicia `pnpm dev` después de modificar variables de entorno.

## Pendiente de confirmar antes de publicar

- Confirmar el webhook opcional del CRM y su tratamiento de los campos cualificados.
- Confirmar información legal, privacidad, cookies, razón social, dominio y datos de contacto.
- No añadir canonical, `og:url`, clientes, métricas o certificaciones sin información verificada.
