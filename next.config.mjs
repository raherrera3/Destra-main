/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	async redirects() {
		return [
			{ source: "/servicios", destination: "/#servicios", permanent: true },
			{ source: "/metodo", destination: "/#metodo", permanent: true },
			{ source: "/casos-de-uso", destination: "/#casos-de-uso", permanent: true },
			{ source: "/por-que-destra", destination: "/#destra", permanent: true },
			{ source: "/estudio-gratuito", destination: "/#contacto", permanent: true },
			{
				source: "/servicios/estrategia-y-adopcion-de-ia",
				destination: "/#servicio-strategy",
				permanent: true,
			},
			{
				source: "/servicios/plataformas-y-soluciones-de-ia",
				destination: "/#servicio-solution",
				permanent: true,
			},
			{
				source: "/servicios/arquitectura-e-infraestructura-de-ia",
				destination: "/#servicio-architecture",
				permanent: true,
			},
			{
				source: "/servicios/ia-privada-y-on-premise",
				destination: "/#servicio-private",
				permanent: true,
			},
		];
	},
};

export default nextConfig;
