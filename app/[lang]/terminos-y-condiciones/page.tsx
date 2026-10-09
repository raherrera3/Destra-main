import LegalPage, { legalMetadata } from "@/components/site/LegalPage";
import type { Locale } from "@/components/site/siteCopy";

type Params = Promise<{ lang: Locale }>;

export async function generateMetadata({ params }: { params: Params }) {
	const { lang } = await params;
	return legalMetadata(lang, "terminos-y-condiciones", {
		es: {
			title: "Términos y condiciones de uso | DESTRA",
			description:
				"Condiciones de uso del sitio web destra.es, titularidad de MAJOIRA S.A., y marco aplicable a sus contenidos y servicios.",
			ogDescription:
				"Condiciones de uso, propiedad intelectual y responsabilidad aplicables a destra.es.",
		},
		en: {
			title: "Terms and conditions of use | DESTRA",
			description:
				"Terms of use of the destra.es website, owned by MAJOIRA S.A., and the framework applicable to its content and services.",
			ogDescription:
				"Terms of use, intellectual property and liability applicable to destra.es.",
		},
	});
}

export default async function TermsPage({ params }: { params: Params }) {
	const { lang } = await params;
	return lang === "en" ? (
		<LegalPage lang="en" title="Terms and Conditions">
			<section>
				<h2>1. Terms of use</h2>
				<p>
					Accessing and using the website https://www.destra.es confers the
					status of user and implies full and unreserved acceptance of these
					terms.
				</p>
				<p>
					Users undertake to use the website lawfully, respectfully and in
					accordance with current legislation, refraining from any act that may
					damage the image, interests or rights of MAJOIRA S.A or third parties.
				</p>
			</section>
			<section>
				<h2>2. Intellectual property</h2>
				<p>
					All content on the website, including text, images, logos, trademarks,
					graphic design, software and other elements, is protected by
					intellectual and industrial property rights owned by MAJOIRA S.A or
					authorised third parties.
				</p>
				<p>
					The reproduction, distribution, public communication or transformation
					of such content without the express authorisation of the rights holder
					is prohibited.
				</p>
			</section>
			<section>
				<h2>3. Responsibilities</h2>
				<p>
					Users are responsible for the accuracy and lawfulness of the data they
					provide, as well as for the proper use of this website.
				</p>
				<p>
					MAJOIRA S.A accepts no liability for any loss or damage that may arise
					from interference, interruptions, computer viruses or disconnections
					of this website's operating system.
				</p>
			</section>
			<section>
				<h2>4. Disclaimer of warranties and liability</h2>
				<p>
					MAJOIRA S.A does not guarantee the availability, continuity or
					infallibility of the website and, consequently, excludes, to the
					extent permitted by applicable law, any liability for loss or damage
					of any kind that may result from the website's lack of availability or
					continuity.
				</p>
			</section>
			<section>
				<h2>5. Changes to the terms</h2>
				<p>
					MAJOIRA S.A reserves the right to modify, update or remove the content
					of these Terms and Conditions, as well as the Privacy Policy, at any
					time and without prior notice. It is the user's responsibility to
					review the current terms periodically.
				</p>
			</section>
			<section>
				<h2>6. Governing law and jurisdiction</h2>
				<p>
					These terms are governed by current Spanish law. For the resolution of
					any dispute that may arise from accessing or using the website, the
					parties submit to the Courts and Tribunals of the city of Barcelona,
					waiving any other jurisdiction that may correspond to them.
				</p>
			</section>
		</LegalPage>
	) : (
		<LegalPage lang="es" title="Términos y Condiciones">
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
