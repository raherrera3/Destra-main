import { type Locale, siteCopy } from "@/components/site/siteCopy";

export const siteUrl = "https://www.destra.es";

const orgId = `${siteUrl}/#organization`;

// Grafo de entidades (AISO): una identidad canónica con @id que reutilizan
// WebSite, los servicios y el FAQ. Los textos salen de siteCopy, en el idioma
// de la página, para no divergir.
export function siteSchema(locale: Locale) {
	const copy = siteCopy[locale];
	return {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "ProfessionalService",
				"@id": orgId,
				name: "DESTRA",
				legalName: "MAJOIRA S.A.",
				description:
					"DESTRA is a strategic and technology partner that helps organisations adopt, build, integrate, host and operate artificial intelligence: AI strategy, custom AI platforms, AI infrastructure and private / on-premise AI.",
				url: siteUrl,
				logo: `${siteUrl}/destra-logo-dark.png`,
				image: `${siteUrl}/opengraph-image`,
				email: "contacto@destra.es",
				address: {
					"@type": "PostalAddress",
					streetAddress: "C/Valencia nº 318",
					postalCode: "08009",
					addressLocality: "Barcelona",
					addressRegion: "Barcelona",
					addressCountry: "ES",
				},
				areaServed: ["ES", "EU"],
				knowsLanguage: ["es", "en"],
				knowsAbout: [
					"Artificial intelligence consulting",
					"Forward Deployed Engineering",
					"AI integration",
					"AI infrastructure",
					"Private AI",
					"On-premise LLM deployment",
					"AI cost optimisation",
				],
				// ponytail: añadir sameAs (LinkedIn, etc.) cuando existan perfiles oficiales.
				hasOfferCatalog: {
					"@type": "OfferCatalog",
					name: copy.services.title,
					itemListElement: copy.services.items.map((service) => ({
						"@type": "Offer",
						itemOffered: {
							"@type": "Service",
							name: service.title,
							description: `${service.body} ${service.audience}`,
							provider: { "@id": orgId },
						},
					})),
				},
			},
			{
				"@type": "WebSite",
				"@id": `${siteUrl}/#website`,
				url: siteUrl,
				name: "DESTRA",
				inLanguage: ["en", "es"],
				publisher: { "@id": orgId },
			},
			{
				"@type": "FAQPage",
				"@id": `${siteUrl}/${locale}#faq`,
				url: `${siteUrl}/${locale}`,
				inLanguage: locale,
				mainEntity: copy.faq.items.map((item) => ({
					"@type": "Question",
					name: item.title,
					acceptedAnswer: { "@type": "Answer", text: item.body },
				})),
			},
		],
	};
}
