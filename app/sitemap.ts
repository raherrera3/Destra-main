import { siteUrl } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const lastModified = new Date();
	const languages = { es: `${siteUrl}/es`, en: `${siteUrl}/en` };
	return [
		...Object.values(languages).map((url) => ({
			url,
			lastModified,
			changeFrequency: "weekly" as const,
			priority: 1,
			alternates: { languages },
		})),
		{
			url: `${siteUrl}/es/privacidad`,
			lastModified,
			changeFrequency: "yearly",
			priority: 0.3,
		},
		{
			url: `${siteUrl}/es/terminos-y-condiciones`,
			lastModified,
			changeFrequency: "yearly",
			priority: 0.3,
		},
	];
}
