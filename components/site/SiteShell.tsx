"use client";
import Particles from "@/components/Particles";
import BuilderCursors from "./BuilderCursors";
import CookieConsentBanner from "./CookieConsent";
import EnterpriseHome from "./EnterpriseHome";
import { LocaleProvider, useLocale } from "./LocaleProvider";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import type { ShellCampaign } from "./campaign/content/types";
import type { Locale } from "./siteCopy";
function ShellContent({
	campaign,
	children,
}: { campaign?: ShellCampaign; children?: React.ReactNode }) {
	const { copy } = useLocale();
	return (
		<>
			<svg
				className="liquid-glass-filters"
				aria-hidden="true"
				focusable="false"
			>
				<defs>
					<filter
						id="button-glass"
						x="-20%"
						y="-30%"
						width="140%"
						height="160%"
					>
						<feTurbulence
							type="fractalNoise"
							baseFrequency="0.018 0.035"
							numOctaves="1"
							seed="8"
							result="noise"
						/>
						<feGaussianBlur in="noise" stdDeviation="1.25" result="softNoise" />
						<feDisplacementMap
							in="SourceGraphic"
							in2="softNoise"
							scale="14"
							xChannelSelector="R"
							yChannelSelector="G"
						/>
					</filter>
				</defs>
			</svg>
			<a className="skip-link" href="#contenido">
				{copy.skip}
			</a>
			<div className="page-particles" aria-hidden="true">
				<Particles />
			</div>
			<SiteHeader campaign={campaign} />
			<main id="contenido">
				{children ?? <EnterpriseHome />}
			</main>
			<SiteFooter onCampaign={!!campaign} />
			<BuilderCursors />
			<a className="mobile-cta button button--primary" href="#contacto">
				{campaign?.cta ?? copy.hero.primary}
			</a>
			<CookieConsentBanner />
		</>
	);
}
export default function SiteShell({
	locale,
	campaign,
	children,
}: {
	locale: Locale;
	campaign?: ShellCampaign;
	children?: React.ReactNode;
}) {
	return (
		<LocaleProvider locale={locale}>
			<ShellContent campaign={campaign}>{children}</ShellContent>
		</LocaleProvider>
	);
}
