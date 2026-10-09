import { CookieConsentProvider } from "@/components/site/CookieConsent";
import { type Locale, locales } from "@/components/site/siteCopy";
import { siteUrl } from "@/lib/site";
import type { Metadata, Viewport } from "next";
import { Azeret_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "../globals.css";

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

// Cada idioma se sirve ya renderizado en su propia URL (/es, /en); la raíz
// redirige según Accept-Language (middleware.ts).
export const dynamicParams = false;
export const generateStaticParams = () => locales.map((lang) => ({ lang }));

const meta: Record<
	Locale,
	{
		title: string;
		description: string;
		ogTitle: string;
		ogDescription: string;
		ogLocale: string;
	}
> = {
	es: {
		title: "Consultoría y soluciones de IA para empresas | DESTRA",
		description:
			"Estrategia, desarrollo, integración e infraestructura de IA para empresas. Soluciones a medida, IA privada y despliegues on-premise con DESTRA.",
		ogTitle: "DESTRA | IA diseñada para operar en tu empresa",
		ogDescription:
			"De la estrategia a la infraestructura: diseñamos, integramos y desplegamos soluciones de inteligencia artificial para organizaciones.",
		ogLocale: "es_ES",
	},
	en: {
		title: "AI consulting and solutions for companies | DESTRA",
		description:
			"AI strategy, development, integration and infrastructure for companies. Custom solutions, private AI and on-premise deployments with DESTRA.",
		ogTitle: "DESTRA | AI built to run inside your company",
		ogDescription:
			"From strategy to infrastructure: we design, integrate and deploy artificial intelligence solutions for organisations.",
		ogLocale: "en_GB",
	},
};

type Params = Promise<{ lang: Locale }>;

export async function generateMetadata({
	params,
}: { params: Params }): Promise<Metadata> {
	const { lang } = await params;
	const m = meta[lang];
	return {
		metadataBase: new URL(siteUrl),
		title: m.title,
		description: m.description,
		applicationName: "DESTRA",
		alternates: {
			canonical: `/${lang}`,
			languages: { es: "/es", en: "/en", "x-default": "/" },
		},
		openGraph: {
			type: "website",
			locale: m.ogLocale,
			alternateLocale: lang === "es" ? ["en_GB"] : ["es_ES"],
			siteName: "DESTRA",
			url: `/${lang}`,
			title: m.ogTitle,
			description: m.ogDescription,
			images: [
				{
					url: "/opengraph-image",
					width: 1200,
					height: 630,
					alt: m.ogTitle,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: m.ogTitle,
			description: m.description,
			images: ["/opengraph-image"],
		},
		robots: {
			index: true,
			follow: true,
		},
	};
}

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	viewportFit: "cover",
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#fffbf9" },
		{ media: "(prefers-color-scheme: dark)", color: "#000000" },
	],
};

export default async function RootLayout({
	children,
	params,
}: Readonly<{ children: ReactNode; params: Params }>) {
	const { lang } = await params;
	return (
		// La variable de next/font va en <html>: --font-mono-stack se declara en
		// :root y necesita que --font-mono exista ya en ese ámbito.
		// suppressHydrationWarning: el script de abajo fija data-theme antes de que
		// React hidrate, así que el atributo difiere a propósito del HTML servido.
		<html lang={lang} className={mono.variable} suppressHydrationWarning>
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
