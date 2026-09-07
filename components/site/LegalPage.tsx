import Link from "next/link";
import type { ReactNode } from "react";
import BrandLogo from "./BrandLogo";

type LegalPageProps = {
	title: string;
	children: ReactNode;
};

export default function LegalPage({ title, children }: LegalPageProps) {
	return (
		<main className="legal-page">
			<div className="container">
				<header className="legal-page__header">
					<Link
						className="legal-page__brand"
						href="/"
						aria-label="DESTRA, volver al inicio"
					>
						<BrandLogo surface="dark" sizes="(max-width: 720px) 132px, 152px" />
					</Link>
					<Link className="legal-page__back" href="/">
						Volver al inicio
					</Link>
				</header>
				<nav className="breadcrumbs" aria-label="Migas de pan">
					<ol>
						<li>
							<Link href="/">Inicio</Link>
						</li>
						<li aria-hidden="true">/</li>
						<li aria-current="page">{title}</li>
					</ol>
				</nav>
				<article className="legal-page__content">
					<h1>{title}</h1>
					{children}
				</article>
			</div>
		</main>
	);
}
