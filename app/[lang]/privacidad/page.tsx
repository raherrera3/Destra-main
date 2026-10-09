import LegalPage, { legalMetadata } from "@/components/site/LegalPage";
import type { Locale } from "@/components/site/siteCopy";

type Params = Promise<{ lang: Locale }>;

export async function generateMetadata({ params }: { params: Params }) {
	const { lang } = await params;
	return legalMetadata(lang, "privacidad", {
		es: {
			title: "Política de privacidad y cookies | DESTRA",
			description:
				"Consulta cómo MAJOIRA S.A. trata los datos personales y gestiona las preferencias de privacidad en destra.es.",
			ogDescription:
				"Información sobre el tratamiento de datos personales y las preferencias de cookies en destra.es.",
		},
		en: {
			title: "Privacy and cookie policy | DESTRA",
			description:
				"Learn how MAJOIRA S.A. processes personal data and manages privacy preferences on destra.es.",
			ogDescription:
				"Information on the processing of personal data and cookie preferences on destra.es.",
		},
	});
}

export default async function PrivacyPage({ params }: { params: Params }) {
	const { lang } = await params;
	return lang === "en" ? (
		<LegalPage lang="en" title="Privacy Policy">
			<section>
				<h2>1. Data controller</h2>
				<p>
					In accordance with Regulation (EU) 2016/679 (GDPR) and Spanish Organic
					Law 3/2018 on the Protection of Personal Data and the Guarantee of
					Digital Rights (LOPDGDD), you are informed that the controller of your
					data is:
				</p>
				<ul>
					<li>Owner: MAJOIRA S.A</li>
					<li>Tax ID (NIF): A-58.684.507</li>
					<li>Address: C/Valencia nº 318, 08009 Barcelona, Spain</li>
					<li>Email: contacto@destra.es</li>
				</ul>
			</section>
			<section>
				<h2>2. Purpose of processing</h2>
				<p>
					Personal data collected through this website will be processed for the
					following purposes:
				</p>
				<ul>
					<li>
						Responding to enquiries or requests sent through the contact form.
					</li>
					<li>Providing the services contracted or requested.</li>
					<li>
						Managing the sending of commercial communications, where express
						consent has been given.
					</li>
				</ul>
			</section>
			<section>
				<h2>3. Legal basis</h2>
				<p>The processing of your data is based on:</p>
				<ul>
					<li>The user's consent to the processing of their personal data.</li>
					<li>
						The performance of a contract or the application of pre-contractual
						measures.
					</li>
					<li>
						Compliance with legal obligations applicable to the controller.
					</li>
					<li>
						Legitimate interest in improving our services and the security of
						the website.
					</li>
				</ul>
			</section>
			<section>
				<h2>4. Recipients of the data</h2>
				<p>
					Personal data will not be disclosed to third parties, except where
					required by law or where necessary to provide the requested service.
				</p>
			</section>
			<section>
				<h2>5. Users' rights</h2>
				<p>Users may exercise the following rights:</p>
				<ul>
					<li>Access their personal data.</li>
					<li>Request the rectification of inaccurate data.</li>
					<li>
						Request its erasure when, among other reasons, the data is no longer
						necessary.
					</li>
					<li>Object to the processing of their data.</li>
					<li>Request the restriction of the processing of their data.</li>
					<li>Request data portability.</li>
					<li>Withdraw consent at any time.</li>
				</ul>
				<p>
					To exercise these rights, you may send a request together with a copy
					of your identity document to contacto@destra.es. You also have the
					right to lodge a complaint with the{" "}
					<a href="https://www.aepd.es/" rel="noreferrer">
						Spanish Data Protection Agency (AEPD)
					</a>{" "}
					if you consider that the processing of your data does not comply with
					the applicable regulations.
				</p>
			</section>
			<section>
				<h2>6. Source of the data</h2>
				<p>
					The personal data processed by MAJOIRA S.A is obtained from the data
					subject through:
				</p>
				<ul>
					<li>Web forms.</li>
					<li>Emails or direct communications.</li>
					<li>Interactions with the website (cookies and similar).</li>
				</ul>
			</section>
			<section id="cookies">
				<h2>7. Information about cookies</h2>
				<p>
					This site only stores the privacy preference in the browser in order
					to respect the user's choice.
				</p>
				<p>
					This choice can be accepted, rejected or changed at any time from the
					“Cookie settings” link available in the footer of the home page.
					Rejecting this preference does not prevent use of the contact form.
				</p>
			</section>
		</LegalPage>
	) : (
		<LegalPage lang="es" title="Política de Privacidad">
			<section>
				<h2>1. Responsable del tratamiento</h2>
				<p>
					En cumplimiento del Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica
					3/2018 de Protección de Datos Personales y garantía de los derechos
					digitales (LOPDGDD), se informa que el responsable del tratamiento de
					sus datos es:
				</p>
				<ul>
					<li>Titular: MAJOIRA S.A</li>
					<li>NIF: A-58.684.507</li>
					<li>Domicilio: C/Valencia nº 318, 08009 Barcelona, Barcelona</li>
					<li>Correo electrónico: contacto@destra.es</li>
				</ul>
			</section>
			<section>
				<h2>2. Finalidad del tratamiento</h2>
				<p>
					Los datos personales que se recaban a través de esta web serán
					tratados con las siguientes finalidades:
				</p>
				<ul>
					<li>
						Atender consultas o solicitudes enviadas a través del formulario de
						contacto.
					</li>
					<li>Prestar los servicios contratados o solicitados.</li>
					<li>
						Gestionar el envío de comunicaciones comerciales, en caso de
						consentimiento expreso.
					</li>
				</ul>
			</section>
			<section>
				<h2>3. Legitimación</h2>
				<p>El tratamiento de sus datos se basa en:</p>
				<ul>
					<li>
						El consentimiento del usuario para el tratamiento de sus datos
						personales.
					</li>
					<li>
						La ejecución de un contrato o la aplicación de medidas
						precontractuales.
					</li>
					<li>
						El cumplimiento de obligaciones legales aplicables al responsable.
					</li>
					<li>
						El interés legítimo para mejorar nuestros servicios y la seguridad
						del sitio web.
					</li>
				</ul>
			</section>
			<section>
				<h2>4. Destinatarios de los datos</h2>
				<p>
					Los datos personales no se cederán a terceros, salvo obligación legal
					o cuando sea necesario para prestar el servicio solicitado.
				</p>
			</section>
			<section>
				<h2>5. Derechos de los usuarios</h2>
				<p>El usuario puede ejercer los siguientes derechos:</p>
				<ul>
					<li>Acceder a sus datos personales.</li>
					<li>Solicitar la rectificación de los datos inexactos.</li>
					<li>
						Solicitar su supresión cuando, entre otros motivos, los datos ya no
						sean necesarios.
					</li>
					<li>Oponerse al tratamiento de sus datos.</li>
					<li>Solicitar la limitación del tratamiento de sus datos.</li>
					<li>Solicitar la portabilidad de los datos.</li>
					<li>Retirar el consentimiento en cualquier momento.</li>
				</ul>
				<p>
					Para ejercer estos derechos, puede enviar una solicitud acompañada de
					copia de su documento identificativo al correo electrónico
					contacto@destra.es. Asimismo, tiene derecho a presentar una
					reclamación ante la{" "}
					<a href="https://www.aepd.es/" rel="noreferrer">
						Agencia Española de Protección de Datos
					</a>{" "}
					si considera que el tratamiento de sus datos no se ajusta a la
					normativa vigente.
				</p>
			</section>
			<section>
				<h2>6. Procedencia de los datos</h2>
				<p>
					Los datos personales que tratamos en MAJOIRA S.A proceden del propio
					interesado a través de:
				</p>
				<ul>
					<li>Formularios web.</li>
					<li>Correos electrónicos o comunicaciones directas.</li>
					<li>Interacciones con la web (cookies y similares).</li>
				</ul>
			</section>
			<section id="cookies">
				<h2>7. Información sobre cookies</h2>
				<p>
					Este sitio guarda únicamente la preferencia de privacidad en el
					navegador para respetar la elección del usuario.
				</p>
				<p>
					Se puede aceptar, rechazar o modificar esta elección en cualquier
					momento desde el enlace “Configurar cookies” disponible en el pie de
					la página de inicio. Rechazar esta preferencia no impide utilizar el
					formulario de contacto.
				</p>
			</section>
		</LegalPage>
	);
}
