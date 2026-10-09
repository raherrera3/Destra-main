import SiteShell from "@/components/site/SiteShell";
import type { Locale } from "@/components/site/siteCopy";
import { siteSchema } from "@/lib/site";

export default async function Home({
	params,
}: { params: Promise<{ lang: Locale }> }) {
	const { lang } = await params;
	return (
		<>
			<script type="application/ld+json">
				{JSON.stringify(siteSchema(lang))}
			</script>
			<SiteShell locale={lang} />
		</>
	);
}
