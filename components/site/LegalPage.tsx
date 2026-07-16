import Link from "next/link";
import type { ReactNode } from "react";

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
						DESTRA
					</Link>
					<Link className="legal-page__back" href="/">
						Volver al inicio
					</Link>
				</header>
				<article className="legal-page__content">
					<h1>{title}</h1>
					{children}
				</article>
			</div>
		</main>
	);
}
