import { type Locale, locales } from "@/components/site/siteCopy";
import type { CampaignSlug } from "@/lib/site";
import type { Metadata } from "next";
import { campaigns } from "./content";

// Sin esto heredarían el canonical de la home (layout). Van con noindex porque
// son páginas de campaña, igual que las landings publicadas hasta ahora.
export function campaignMetadata(slug: CampaignSlug, lang: Locale): Metadata {
	const { title: name, description } = campaigns[slug].content[lang].meta;
	const title = `${name} | DESTRA`;
	const url = `/${lang}/${slug}`;
	return {
		title,
		description,
		alternates: {
			canonical: url,
			languages: Object.fromEntries(locales.map((l) => [l, `/${l}/${slug}`])),
		},
		robots: { index: false, follow: false },
		openGraph: {
			type: "website",
			locale: lang === "es" ? "es_ES" : "en_GB",
			siteName: "DESTRA",
			title,
			description,
			url,
			images: [
				{ url: "/opengraph-image", width: 1200, height: 630, alt: title },
			],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: ["/opengraph-image"],
		},
	};
}
