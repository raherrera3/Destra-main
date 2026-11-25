import type { NeedValue } from "../../contactSchema";
import type { Locale } from "../../siteCopy";

// Modelo de contenido de las landings de campaña. Cada landing es una lista de
// bloques: cambiar el orden o añadir uno no toca la plantilla.
// Los textos admiten las marcas de rich.tsx: [[destacado]], \n y ¶.

export type HeroDiagramContent =
	| { kind: "orbit"; nodes: string[] }
	| {
			kind: "platform";
			source: string;
			label: string;
			title: string;
			systems: string[];
			caption: string;
	  };

export type HeroBlock = {
	type: "hero";
	eyebrow: string;
	title: string;
	lede: string;
	note: string;
	/** Texto del CTA principal. Por defecto, el común */
	cta?: string;
	secondary: { label: string; href: string };
	stats: { value: string; label: string }[];
	diagram?: HeroDiagramContent;
};

export type ProblemBlock = {
	type: "problem";
	label: string;
	title: string;
	cards: string[];
	panelLabel: string;
	panel: string;
};

export type HowBlock = {
	type: "how";
	label: string;
	title: string;
	steps: { title: string; text: string }[];
};

export type DeliverablesBlock = {
	type: "deliverables";
	label: string;
	title: string;
} & (
	| {
			variant: "hours";
			hours: { value: string; label: string }[];
			deliveries: { label: string; title: string; text: string }[];
	  }
	| { variant: "cards"; cards: string[]; panelLabel: string; panel: string }
);

export type Block =
	| HeroBlock
	| ProblemBlock
	| HowBlock
	| DeliverablesBlock
	| { type: "protocol5d" }
	| { type: "faq" }
	| { type: "closing" };

export type ProtocolContent = {
	label: string;
	title: string;
	sub: string;
	trackA: string;
	trackB: string;
	steps: { n: string; title: string; text: string; final?: boolean }[];
	ruleLabel: string;
	rule: string;
};

export type CampaignFormCopy = {
	title: string;
	lead: string;
	open: string;
	submit: string;
};

export type CampaignCommon = {
	nav: { label: string; href: string }[];
	/** CTA corto de la cabecera y la barra móvil */
	navCta: string;
	/** CTA largo del hero, el protocolo y el cierre */
	cta: string;
	protocol: ProtocolContent;
	faq: {
		label: string;
		title: string;
		items: { q: string; a: string }[];
	};
	closing: string;
	form: CampaignFormCopy;
};

export type CampaignContent = {
	/** El título no lleva la marca: los metadatos añaden " | DESTRA" */
	meta: { title: string; description: string };
	sections: Block[];
};

export type Campaign = {
	slug: string;
	/** Opción del formulario que llega ya marcada */
	need: NeedValue;
	content: Record<Locale, CampaignContent>;
};

/** Lo que el shell necesita saber cuando no pinta la home. */
export type ShellCampaign = {
	nav: ReadonlyArray<readonly [string, string]>;
	cta: string;
};

/** Identidad tipada: TypeScript avisa si falta un campo o un idioma. */
export const defineCampaign = (campaign: Campaign) => campaign;
