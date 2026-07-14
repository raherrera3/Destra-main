"use client";
import Particles from "@/components/Particles";
import EnterpriseHome from "./EnterpriseHome";
import { LocaleProvider, useLocale } from "./LocaleProvider";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
function ShellContent() {
	const { copy } = useLocale();
	return (
		<>
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
