"use client";
import Link from "next/link";
import BrandLogo from "./BrandLogo";
import { useCookieConsent } from "./CookieConsent";
import { useLocale } from "./LocaleProvider";
export default function SiteFooter() {
	const { copy } = useLocale();
	const { openPreferences } = useCookieConsent();
	const links = copy.footer.links;
	const capabilityDestinations = [
		"#servicio-strategy",
		"#servicio-solution",
		"#servicio-architecture",
		"#ia-privada",
	];
	return (
		<footer className="site-footer">
			<div className="container footer-grid">
				<div className="footer-brand">
					<Link href="#inicio" aria-label={copy.header.home}>
						<BrandLogo surface="dark" sizes="152px" />
					</Link>
					<p>{copy.footer.summary}</p>
					<p className="footer-legal-entity">{copy.footer.legalEntity}</p>
				</div>
				<nav aria-label={copy.footer.capabilities}>
					<strong>{copy.footer.capabilities}</strong>
					{links.slice(0, 4).map((label, index) => (
						<Link href={capabilityDestinations[index]} key={label}>
							{label}
						</Link>
					))}
				</nav>
				<nav aria-label={copy.footer.explore}>
					<strong>{copy.footer.explore}</strong>
					{links.slice(4).map((label, index) => (
						<Link
							href={["#metodo", "#casos-de-uso", "#destra", "#contacto"][index]}
							key={label}
						>
							{label}
						</Link>
					))}
				</nav>
			</div>
			<div className="container footer-bottom">
				<p>
					© {new Date().getFullYear()} DESTRA. {copy.footer.copyright}
				</p>
				<nav className="footer-legal" aria-label={copy.footer.privacy}>
					<Link href="/privacidad">{copy.footer.privacy}</Link>
					<Link href="/terminos-y-condiciones">{copy.footer.terms}</Link>
					<button
						className="footer-cookie-button"
						type="button"
						onClick={openPreferences}
					>
						{copy.footer.cookies}
					</button>
				</nav>
			</div>
		</footer>
	);
}
