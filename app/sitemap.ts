import { locales } from "@/components/site/siteCopy";
import { siteUrl } from "@/lib/site";
import type { MetadataRoute } from "next";

// Cada página existe en todos los idiomas; cada URL declara sus alternativas.
const pages = [
	{ path: "", changeFrequency: "weekly", priority: 1 },
	{ path: "/privacidad", changeFrequency: "yearly", priority: 0.3 },
	{ path: "/terminos-y-condiciones", changeFrequency: "yearly", priority: 0.3 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
	const lastModified = new Date();
	return pages.flatMap(({ path, changeFrequency, priority }) => {
		const languages = Object.fromEntries(
			locales.map((l) => [l, `${siteUrl}/${l}${path}`]),
		);
		return locales.map((l) => ({
			url: `${siteUrl}/${l}${path}`,
			lastModified,
			changeFrequency,
			priority,
			alternates: { languages },
		}));
	});
}
