import LegalPage from "@/components/site/LegalPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Términos y condiciones | DESTRA",
	description: "Términos y condiciones de DESTRA.",
	alternates: { canonical: "/terminos-y-condiciones" },
	robots: { index: true, follow: true },
};

export default function TermsPage() {
	return (
		<LegalPage title="Términos y Condiciones">
			<section>
				<h2>1. Condiciones de uso</h2>
				<p>
					El acceso y uso del sitio web https://www.destra.es atribuye la
					condición de usuario y conlleva la aceptación plena y sin reservas de
					estas condiciones.
				</p>
				<p>
					El usuario se compromete a utilizar el sitio web de forma lícita,
					respetuosa y conforme a la legislación vigente, absteniéndose de
					realizar cualquier acto que pueda dañar la imagen, los intereses o los
					derechos de MAJOIRA S.A o de terceros.
				</p>
			</section>
			<section>
				<h2>2. Propiedad intelectual</h2>
				<p>
					Todos los contenidos del sitio web, incluyendo textos, imágenes,
					logos, marcas, diseño gráfico, software y demás elementos, están
					protegidos por los derechos de propiedad intelectual e industrial
					titularidad de MAJOIRA S.A o de terceros autorizados.
				</p>
				<p>
					Queda prohibida la reproducción, distribución, comunicación pública o
					transformación de dichos contenidos sin la autorización expresa del
					titular de los derechos.
				</p>
			</section>
			<section>
				<h2>3. Responsabilidades</h2>
				<p>
					El usuario es responsable de la veracidad y licitud de los datos que
					proporcione, así como del uso adecuado de este sitio web.
				</p>
				<p>
					MAJOIRA S.A no se responsabiliza de los daños y perjuicios que puedan
					derivarse de interferencias, interrupciones, virus informáticos o
					desconexiones del sistema operativo de esta web.
				</p>
			</section>
			<section>
				<h2>4. Exclusión de garantías y responsabilidad</h2>
				<p>
					MAJOIRA S.A no garantiza la disponibilidad, continuidad ni
					infalibilidad del funcionamiento del sitio web y, en consecuencia,
					excluye, en la medida permitida por la normativa vigente, cualquier
					responsabilidad por los daños y perjuicios de cualquier naturaleza que
					puedan deberse a la falta de disponibilidad o continuidad del sitio
					web.
				</p>
			</section>
			<section>
				<h2>5. Modificaciones de los términos</h2>
				<p>
					MAJOIRA S.A se reserva el derecho a modificar, actualizar o eliminar
					en cualquier momento el contenido de estos Términos y Condiciones, así
					como de la Política de Privacidad, sin necesidad de previo aviso. Es
					responsabilidad del usuario revisar periódicamente las condiciones
					vigentes.
				</p>
			</section>
			<section>
				<h2>6. Legislación aplicable y jurisdicción</h2>
				<p>
					Estas condiciones se rigen por la legislación española vigente. Para
					la resolución de cualquier conflicto que pudiera derivarse del acceso
					o uso del sitio web, las partes se someten a los Juzgados y Tribunales
					de la ciudad de Barcelona, renunciando a cualquier otro fuero que
					pudiera corresponderles.
				</p>
			</section>
		</LegalPage>
	);
}
