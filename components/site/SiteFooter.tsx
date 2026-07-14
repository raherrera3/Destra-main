"use client";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "./LocaleProvider";
export default function SiteFooter() {
	const { copy } = useLocale();
	const links = copy.footer.links;
	return (
		<footer className="site-footer">
			<div className="container footer-grid">
				<div className="footer-brand">
					<Link href="#inicio" aria-label={copy.header.home}>
						<Image
							src="/destra-logo.png"
							alt="DESTRA"
							width={689}
							height={237}
							sizes="152px"
						/>
					</Link>
					<p>{copy.footer.summary}</p>
				</div>
				<nav aria-label={copy.footer.capabilities}>
					<strong>{copy.footer.capabilities}</strong>
					{links.slice(0, 4).map((label, index) => (
						<Link href={index === 3 ? "#ia-privada" : "#servicios"} key={label}>
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
				<p>{copy.footer.legal}</p>
			</div>
		</footer>
	);
}
