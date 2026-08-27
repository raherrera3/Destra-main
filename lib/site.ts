export const siteUrl = "https://www.destra.es";

export const organizationSchema = {
	"@context": "https://schema.org",
	"@type": "LocalBusiness",
	name: "DESTRA",
	legalName: "MAJOIRA S.A.",
	url: siteUrl,
	logo: `${siteUrl}/destra-logo-dark.png`,
	email: "contacto@destra.es",
	address: {
		"@type": "PostalAddress",
		streetAddress: "C/Valencia nº 318",
		postalCode: "08009",
		addressLocality: "Barcelona",
		addressRegion: "Barcelona",
		addressCountry: "ES",
	},
};
