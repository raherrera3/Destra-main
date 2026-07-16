import SiteShell from "@/components/site/SiteShell";
import { organizationSchema } from "@/lib/site";

export default function Home() {
	return (
		<>
			<script type="application/ld+json">
				{JSON.stringify(organizationSchema)}
			</script>
			<SiteShell />
		</>
	);
}
