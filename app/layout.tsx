import { CookieConsentProvider } from "@/components/site/CookieConsent";
import { siteUrl } from "@/lib/site";
import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

// Archivo para titulares (tracking negativo a tamaño grande), Plex Sans para
// texto corrido y Plex Mono para etiquetas en versalita: el vocabulario de
// ingeniería que sostiene la dirección visual.
const display = Archivo({
	subsets: ["latin"],
	display: "swap",
	weight: ["600", "700", "800"],
	variable: "--font-display",
});

const sans = IBM_Plex_Sans({
	subsets: ["latin"],
	display: "swap",
	weight: ["400", "500", "600"],
	variable: "--font-sans",
});

const mono = IBM_Plex_Mono({
	subsets: ["latin"],
	display: "swap",
	weight: ["400", "500"],
	variable: "--font-mono",
});

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: "Consultoría y soluciones de IA para empresas | DESTRA",
	description:
		"Estrategia, desarrollo, integración e infraestructura de IA para empresas. Soluciones a medida, IA privada y despliegues on-premise con DESTRA.",
	applicationName: "DESTRA",
	alternates: {
		canonical: "/",
	},
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
		url: "/",
		title: "DESTRA | IA diseñada para operar en tu empresa",
		description:
			"De la estrategia a la infraestructura: diseñamos, integramos y desplegamos soluciones de inteligencia artificial para organizaciones.",
		images: [
			{
				url: "/opengraph-image",
				width: 1200,
				height: 630,
				alt: "DESTRA — IA diseñada para operar en tu empresa",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "DESTRA | IA diseñada para operar en tu empresa",
		description:
			"Estrategia, desarrollo, integración e infraestructura de IA para empresas.",
		images: ["/opengraph-image"],
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
	themeColor: "#0d3563",
};

export default function RootLayout({
	children,
}: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="es">
			<body
				className={`${display.variable} ${sans.variable} ${mono.variable} ${sans.className}`}
			>
				<CookieConsentProvider>{children}</CookieConsentProvider>
			</body>
		</html>
	);
}
