import type { CampaignSlug } from "@/lib/site";
import diagnostico from "./diagnostico-gratuito";
import partner from "./partner-ia";
import plataformas from "./plataformas-sistemas-a-medida";
import type { Campaign } from "./types";

export const campaigns: Record<CampaignSlug, Campaign> = {
	"diagnostico-gratuito": diagnostico,
	"partner-ia": partner,
	"plataformas-sistemas-a-medida": plataformas,
};
