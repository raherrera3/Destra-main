import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import BrandLogo from "./BrandLogo";
import { type Locale, locales } from "./siteCopy";

const ui = {
	es: {
		home: "Inicio",
		back: "Volver al inicio",
		brand: "DESTRA, volver al inicio",
		breadcrumbs: "Migas de pan",
		notice: null,
	},
	en: {
		home: "Home",
		back: "Back to home",
		brand: "DESTRA, return to home",
		breadcrumbs: "Breadcrumbs",
		notice:
			"This English version is provided for information purposes. In the event of any discrepancy, the Spanish version shall prevail.",
	},
};

type Copy = { title: string; description: string; ogDescription: string };

// Metadatos comunes de las páginas legales: canonical y hreflang por idioma.
export function legalMetadata(
	lang: Locale,
	slug: string,
	copy: Record<Locale, Copy>,
): Metadata {
	const { title, description, ogDescription } = copy[lang];
	const url = `/${lang}/${slug}`;
	return {
		title,
		description,
		alternates: {
			canonical: url,
			languages: Object.fromEntries(locales.map((l) => [l, `/${l}/${slug}`])),
		},
		robots: { index: true, follow: true },
		openGraph: { title, description: ogDescription, url },
		twitter: {
			card: "summary_large_image",
			title,
			description: ogDescription,
		},
	};
}

type LegalPageProps = {
	lang: Locale;
	title: string;
	children: ReactNode;
};

export default function LegalPage({ lang, title, children }: LegalPageProps) {
	const t = ui[lang];
	return (
		<main className="legal-page">
			<div className="container">
				<header className="legal-page__header">
					<Link
						className="legal-page__brand"
						href={`/${lang}`}
						aria-label={t.brand}
					>
						<BrandLogo />
					</Link>
					<Link className="legal-page__back" href={`/${lang}`}>
						{t.back}
					</Link>
				</header>
				<nav className="breadcrumbs" aria-label={t.breadcrumbs}>
					<ol>
						<li>
							<Link href={`/${lang}`}>{t.home}</Link>
						</li>
						<li aria-hidden="true">/</li>
						<li aria-current="page">{title}</li>
					</ol>
				</nav>
				<article className="legal-page__content">
					<h1>{title}</h1>
					{t.notice && (
						<p>
							<em>{t.notice}</em>
						</p>
					)}
					{children}
				</article>
			</div>
		</main>
	);
}
