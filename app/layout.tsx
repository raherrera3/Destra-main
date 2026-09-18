import { CookieConsentProvider } from "@/components/site/CookieConsent";
import { siteUrl } from "@/lib/site";
import type { Metadata, Viewport } from "next";
import { Azeret_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

// Neue Montreal se declara en la pila CSS principal para usar cualquier copia
// instalada/licenciada; Azeret Mono sí está disponible mediante next/font.
const mono = Azeret_Mono({
	subsets: ["latin"],
	display: "swap",
	weight: ["400", "500", "600"],
	variable: "--font-mono",
});

// Preferencia guardada; si no hay, la del sistema. Corre antes del primer pintado.
const themeScript = `try{var t=localStorage.getItem("destra-theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.dataset.theme=t}catch(e){}`;

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: "AI consulting and solutions for companies | DESTRA",
	description:
		"AI strategy, development, integration and infrastructure for companies. Custom solutions, private AI and on-premise deployments with DESTRA.",
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
		locale: "en_GB",
		alternateLocale: ["es_ES"],
		siteName: "DESTRA",
		url: "/",
		title: "DESTRA | AI built to run inside your company",
		description:
			"From strategy to infrastructure: we design, integrate and deploy artificial intelligence solutions for organisations.",
		images: [
			{
				url: "/opengraph-image",
				width: 1200,
				height: 630,
				alt: "DESTRA — AI built to run inside your company",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "DESTRA | AI built to run inside your company",
		description:
			"AI strategy, development, integration and infrastructure for companies.",
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
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#fffbf9" },
		{ media: "(prefers-color-scheme: dark)", color: "#000000" },
	],
};

export default function RootLayout({
	children,
}: Readonly<{ children: ReactNode }>) {
	return (
		// La variable de next/font va en <html>: --font-mono-stack se declara en
		// :root y necesita que --font-mono exista ya en ese ámbito.
		// suppressHydrationWarning: el script de abajo fija data-theme antes de que
		// React hidrate, así que el atributo difiere a propósito del HTML servido.
		<html lang="en" className={mono.variable} suppressHydrationWarning>
			<head>
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: script estático, sin datos externos; evita el destello del tema equivocado.
					dangerouslySetInnerHTML={{ __html: themeScript }}
				/>
			</head>
			<body>
				<CookieConsentProvider>{children}</CookieConsentProvider>
			</body>
		</html>
	);
}
