import { siteCopy } from "@/components/site/siteCopy";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

// llms.txt (llmstxt.org): resumen en Markdown para asistentes de IA. Incluye
// también el español, que el HTML servido no contiene (se elige en cliente).
function section(locale: "en" | "es") {
	const c = siteCopy[locale];
	return [
		`## ${c.services.title}`,
		...c.services.items.map(
			(s) =>
				`- **${s.title}**: ${s.body} ${c.services.labels.audience}: ${s.audience} ${c.services.labels.model}: ${s.model}`,
		),
		"",
		`## ${c.process.title}: ${c.process.headline}`,
		...c.process.steps.map((s, i) => `${i + 1}. **${s.title}**: ${s.body}`),
		"",
		"## FAQ",
		...c.faq.items.flatMap((q) => [`### ${q.title}`, q.body, ""]),
	].join("\n");
}

export function GET() {
	const body = `# DESTRA

> DESTRA is a strategic and technology partner, based in Barcelona, that helps organisations adopt, build, integrate, host and operate artificial intelligence. Every engagement starts with a free 6-hour diagnostic.

- Legal entity: MAJOIRA S.A., C/Valencia nº 318, 08009 Barcelona, Spain
- Contact: contacto@destra.es · ${siteUrl}/en#contacto
- Languages: [English](${siteUrl}/en), [Spanish](${siteUrl}/es)

${section("en")}
---

# DESTRA (Español)

> ${siteCopy.es.hero.title} ${siteCopy.es.hero.lead}

- Web: ${siteUrl}/es · Contacto: contacto@destra.es · ${siteUrl}/es#contacto

${section("es")}
## Legal

- [Privacidad](${siteUrl}/es/privacidad) · [Privacy policy](${siteUrl}/en/privacidad)
- [Términos y condiciones](${siteUrl}/es/terminos-y-condiciones) · [Terms and conditions](${siteUrl}/en/terminos-y-condiciones)
`;
	return new Response(body, {
		headers: { "Content-Type": "text/markdown; charset=utf-8" },
	});
}
