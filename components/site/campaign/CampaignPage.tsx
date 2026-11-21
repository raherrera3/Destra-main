import ContactExperience from "@/components/site/ContactExperience";
import SiteShell from "@/components/site/SiteShell";
import { type Locale, siteCopy } from "@/components/site/siteCopy";
import type { CampaignSlug } from "@/lib/site";
import CampaignBlock from "./CampaignSections";
import "./campaign.css";
import { campaigns } from "./content";
import { campaignCommon } from "./content/common";

export type CampaignParams = Promise<{ lang: Locale }>;

export default function CampaignPage({
	slug,
	lang,
}: { slug: CampaignSlug; lang: Locale }) {
	const campaign = campaigns[slug];
	const common = campaignCommon[lang];
	return (
		<SiteShell
			locale={lang}
			campaign={{
				nav: common.nav.map(({ href, label }) => [href, label] as const),
				cta: common.navCta,
			}}
		>
			<div className="campaign">
				{campaign.content[lang].sections.map((block) => (
					<CampaignBlock
						key={block.type}
						block={block}
						common={common}
						clients={siteCopy[lang].clients}
					/>
				))}
				<ContactExperience campaign={{ ...common.form, need: campaign.need }} />
			</div>
		</SiteShell>
	);
}
