/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
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
