import LegalPage from "@/components/site/LegalPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Política de privacidad | DESTRA",
	description: "Política de privacidad de DESTRA.",
	alternates: { canonical: "/privacidad" },
	robots: { index: true, follow: true },
};

export default function PrivacyPage() {
	return (
		<LegalPage title="Política de Privacidad">
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
					<li>
						Mejorar la experiencia del usuario mediante el análisis de
						navegación (cookies).
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
					o en caso necesario para la prestación del servicio (por ejemplo,
					proveedores tecnológicos que prestan servicios bajo contrato de
					confidencialidad).
				</p>
				<p>No se prevé la transferencia internacional de datos.</p>
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
			<section>
				<h2>7. Información sobre cookies</h2>
				<p>
					Este sitio web utiliza cookies propias y de terceros para fines
					técnicos, analíticos y publicitarios, tal como se detalla en nuestra
					Política de Cookies.
				</p>
				<p>
					El usuario puede configurar su navegador para rechazar la instalación
					de cookies, aunque esto podría afectar al correcto funcionamiento del
					sitio web.
				</p>
			</section>
		</LegalPage>
	);
}
