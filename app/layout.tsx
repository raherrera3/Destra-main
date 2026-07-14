import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
});

export const metadata: Metadata = {
	title: "Consultoría y soluciones de IA para empresas | DESTRA",
	description:
		"Estrategia, desarrollo, integración e infraestructura de IA para empresas. Soluciones a medida, IA privada y despliegues on-premise con DESTRA.",
	applicationName: "DESTRA",
	keywords: [
		"consultoría de inteligencia artificial",
		"soluciones de IA para empresas",
		"infraestructura de inteligencia artificial",
		"inteligencia artificial privada",
		"IA on-premise",
		"integración de inteligencia artificial",
	],
	openGraph: {
		type: "website",
		locale: "es_ES",
		siteName: "DESTRA",
		title: "DESTRA | IA diseñada para operar en tu empresa",
		description:
			"De la estrategia a la infraestructura: diseñamos, integramos y desplegamos soluciones de inteligencia artificial para organizaciones.",
	},
	robots: {
		index: true,
		follow: true,
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	viewportFit: "cover",
};

export default function RootLayout({
	children,
}: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="es">
			<body className={`${inter.variable} ${inter.className}`}>{children}</body>
		</html>
	);
}
