"use client";
import Particles from "@/components/Particles";
import CookieConsentBanner from "./CookieConsent";
import EnterpriseHome from "./EnterpriseHome";
import { LocaleProvider, useLocale } from "./LocaleProvider";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
function ShellContent() {
	const { copy } = useLocale();
	return (
		<>
			<svg
				className="liquid-glass-filters"
				aria-hidden="true"
				focusable="false"
			>
				<defs>
					<filter id="button-glass" x="-20%" y="-30%" width="140%" height="160%">
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
			<SiteHeader />
			<main id="contenido">
				<EnterpriseHome />
			</main>
			<SiteFooter />
			<a className="mobile-cta button button--primary" href="#contacto">
				{copy.hero.primary}
			</a>
			<CookieConsentBanner />
		</>
	);
}
export default function SiteShell() {
	return (
		<LocaleProvider>
			<ShellContent />
		</LocaleProvider>
	);
}
