"use client";

import Link from "next/link";
import BrandLogo from "./BrandLogo";
import { useCookieConsent } from "./CookieConsent";
import { useLocale } from "./LocaleProvider";

export default function SiteFooter() {
	const { copy } = useLocale();
	const { openPreferences } = useCookieConsent();
	const navigation = ["#inicio", "#servicios", "#faq", "#contacto"];

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
				<nav aria-label={copy.footer.explore}>
					<strong>{copy.footer.explore}</strong>
					{copy.footer.links.map((label, index) => (
						<Link href={navigation[index]} key={label}>
							{label}
						</Link>
					))}
				</nav>
				<address className="footer-contact">
					<strong>{copy.footer.contact}</strong>
					<a href="mailto:contacto@destra.es">contacto@destra.es</a>
					<a href="tel:+34936940165">+34 936 940 165</a>
					<span>
						{copy.footer.office}
						<br />
						Via Augusta 125, 2-2
					</span>
				</address>
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
