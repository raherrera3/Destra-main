// Turnstile (challenges.cloudflare.com) carga script e iframe. 'unsafe-inline' en
// script-src lo exigen el script de tema y los de hidratación de Next.
// ponytail: CSP estática para no perder el prerender; con nonce por petición
// (middleware) se quitaría 'unsafe-inline', pero todas las páginas pasarían a dinámicas.
// Google Tag Manager / GA4: gtm.js y los envíos de analítica.
const google =
	"https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com";
const csp = [
	"default-src 'self'",
	`script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com ${google}`,
	"style-src 'self' 'unsafe-inline'",
	`img-src 'self' data: blob: ${google}`,
	"font-src 'self'",
	`connect-src 'self' https://challenges.cloudflare.com ${google}`,
	"frame-src https://challenges.cloudflare.com",
	"object-src 'none'",
	"base-uri 'self'",
	"form-action 'self'",
	"frame-ancestors 'none'",
	"upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
	{ key: "Content-Security-Policy", value: csp },
	{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
	{ key: "X-Content-Type-Options", value: "nosniff" },
	{ key: "X-Frame-Options", value: "DENY" },
	{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
	{ key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	poweredByHeader: false,
	async headers() {
		return [{ source: "/:path*", headers: securityHeaders }];
	},
	async redirects() {
		return [
			{ source: "/privacidad", destination: "/es/privacidad", permanent: true },
			{
				source: "/terminos-y-condiciones",
				destination: "/es/terminos-y-condiciones",
				permanent: true,
			},
			{ source: "/servicios", destination: "/es#servicios", permanent: true },
			{ source: "/metodo", destination: "/es#metodo", permanent: true },
			{ source: "/casos-de-uso", destination: "/es#casos-de-uso", permanent: true },
			{ source: "/por-que-destra", destination: "/es#destra", permanent: true },
			{ source: "/estudio-gratuito", destination: "/es#contacto", permanent: true },
			{
				source: "/servicios/estrategia-y-adopcion-de-ia",
				destination: "/es#servicio-strategy",
				permanent: true,
			},
			{
				source: "/servicios/plataformas-y-soluciones-de-ia",
				destination: "/es#servicio-solution",
				permanent: true,
			},
			{
				source: "/servicios/arquitectura-e-infraestructura-de-ia",
				destination: "/es#servicio-architecture",
				permanent: true,
			},
			{
				source: "/servicios/ia-privada-y-on-premise",
				destination: "/es#servicio-private",
				permanent: true,
			},
		];
	},
};

export default nextConfig;
