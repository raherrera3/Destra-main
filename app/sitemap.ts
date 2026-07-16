import { siteUrl } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: siteUrl,
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${siteUrl}/privacidad`,
			changeFrequency: "yearly",
			priority: 0.3,
		},
		{
			url: `${siteUrl}/terminos-y-condiciones`,
			changeFrequency: "yearly",
			priority: 0.3,
		},
	];
}
