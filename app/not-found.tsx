import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Página no encontrada | DESTRA",
	description:
		"La página que buscas no está disponible. Vuelve a la página de inicio de DESTRA para conocer sus soluciones de IA.",
	robots: { index: false, follow: true },
};

export default function NotFound() {
	return (
		<main className="not-found-page">
			<div className="container not-found-page__content">
				<nav className="breadcrumbs" aria-label="Migas de pan">
					<ol>
						<li>
							<Link href="/">Inicio</Link>
						</li>
						<li aria-hidden="true">/</li>
						<li aria-current="page">Página no encontrada</li>
					</ol>
				</nav>
				<p className="not-found-page__code">Error 404</p>
				<h1>Esta ruta no forma parte del mapa de DESTRA.</h1>
				<p>
					Puede que el enlace haya cambiado o que la dirección no exista. Te
					acompañamos de vuelta a un punto útil.
				</p>
				<div className="button-group">
					<Link className="button button--primary" href="/">
						Ir al inicio
					</Link>
					<Link className="button button--secondary" href="/#contacto">
						Solicitar un estudio gratuito
					</Link>
				</div>
			</div>
		</main>
	);
}
