import CampaignPage, {
	type CampaignParams,
} from "@/components/site/campaign/CampaignPage";
import { campaignMetadata } from "@/components/site/campaign/campaignMetadata";

const slug = "partner-ia";

export async function generateMetadata({ params }: { params: CampaignParams }) {
	return campaignMetadata(slug, (await params).lang);
}

export default async function Page({ params }: { params: CampaignParams }) {
	return <CampaignPage slug={slug} lang={(await params).lang} />;
}
