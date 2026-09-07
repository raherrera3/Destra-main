import type { NeedValue } from "./contactSchema";

export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export type ContactErrorCode =
	| "invalid_content_type"
	| "request_too_large"
	| "not_configured"
	| "rate_limited"
	| "invalid_request"
	| "invalid_session"
	| "verification_failed"
	| "verification_unavailable"
	| "delivery_failed"
	| "unexpected_failure";

type Item = { title: string; body: string };
type SiteCopy = {
	skip: string;
	header: {
		home: string;
		nav: string;
		mobileNav: string;
		open: string;
		close: string;
		cta: string;
		language: string;
	};
	navLabels: {
		home: string;
		services: string;
		faq: string;
	};
	hero: {
		kicker: string;
		title: string;
		lead: string;
		primary: string;
		secondary: string;
		reassurance: string;
	};
	services: {
		title: string;
		lead: string;
		labels: { solution: string; audience: string; model: string };
		items: Array<
			Item & {
				audience: string;
				model: string;
				cta: string;
				intent: NeedValue;
			}
		>;
	};
	faq: { title: string; items: Item[] };
	contact: {
		title: string;
		lead: string;
		open: string;
		close: string;
		privacy: string;
		successTitle: string;
		success: string;
		again: string;
	};
	cookies: {
		title: string;
		description: string;
		accept: string;
		reject: string;
		configure: string;
		save: string;
		close: string;
		privacyLink: string;
		necessaryTitle: string;
		necessaryDescription: string;
		alwaysOn: string;
	};
	form: {
		errorSummary: string;
		retry: string;
		labels: Record<string, string>;
		hints: Record<string, string>;
		placeholder: string;
		needs: Record<NeedValue, string>;
		sizes: string[];
		submit: string;
		sending: string;
		validation: {
			name: string;
			email: string;
			company: string;
			need: string;
			context: string;
		};
		errors: Record<ContactErrorCode, string>;
	};
	footer: {
		summary: string;
		explore: string;
		links: string[];
		privacy: string;
		terms: string;
		cookies: string;
		contact: string;
		office: string;
		legalEntity: string;
		copyright: string;
	};
};

export const siteCopy: Record<Locale, SiteCopy> = {
	es: {
		skip: "Saltar al contenido",
		header: {
			home: "DESTRA, volver al inicio",
			nav: "Navegación principal",
			mobileNav: "Navegación móvil",
			open: "Abrir menú",
			close: "Cerrar menú",
			cta: "Contacto",
			language: "Idioma",
		},
		navLabels: {
			home: "Inicio",
			services: "Servicios",
			faq: "FAQ",
		},
		hero: {
			kicker: "Partner de IA para organizaciones",
			title: "Convierte la IA en una capacidad que tu empresa puede operar.",
			lead: "Definimos la prioridad, construimos la solución y la integramos en tus sistemas, datos y equipos.",
			primary: "Solicitar estudio sin compromiso",
			secondary: "Ver servicios",
			reassurance:
				"Sin coste ni compromiso. Revisamos tu caso y proponemos el siguiente paso.",
		},
		services: {
			title: "Servicios",
			lead: "Cuatro formas de trabajar con nosotros. La mayoría empieza por la primera.",
			labels: {
				solution: "Qué resuelve",
				audience: "Para quién",
				model: "Modelo comercial",
			},
			items: [
				{
					title: "Forward Deployed Engineer (FDE)",
					body: "Acompañamiento continuo. Un experto en inteligencia artificial se incorpora a la empresa y trabaja desde el primer día, mes a mes, en automatizaciones, formación en IA, infraestructura o lo que la organización necesite.",
					audience:
						"Cualquier empresa que quiera empezar con IA sin arriesgar. Es la puerta de entrada por defecto.",
					model:
						"Bono de horas semanal o mensual a 80 €/hora (+IVA). Las primeras 6 horas de diagnóstico son gratuitas.",
					cta: "Hablar sobre FDE",
					intent: "fde",
				},
				{
					title: "Plataformas y Soluciones",
					body: "Desarrollo de software y automatizaciones a medida.",
					audience:
						"Empresas con un proceso o proyecto concreto ya identificado, a menudo tras un FDE.",
					model:
						"Presupuesto cerrado por proyecto, facturado por fases o hitos.",
					cta: "Hablar sobre una solución",
					intent: "solution",
				},
				{
					title: "Arquitectura e Infraestructura de IA",
					body: "Optimizamos el uso de la IA que ya existe y reducimos la factura sin perder calidad.",
					audience:
						"Empresas que ya usan APIs frontera en producción y donde el gasto supone un problema.",
					model:
						"Fee ligado al ahorro medido sobre un baseline firmado, con posible fee base.",
					cta: "Hablar sobre infraestructura",
					intent: "architecture",
				},
				{
					title: "Despliegue de IA Privada / On-Premise",
					body: "Infraestructura de IA local, sin salir nunca de la empresa o de una zona controlada, por ejemplo Europa.",
					audience:
						"Sectores regulados o con datos privilegiados, como hospitales, family offices, bancos o bufetes.",
					model:
						"Proyecto de infraestructura, con hardware o colocation y despliegue, más acompañamiento posterior.",
					cta: "Hablar sobre IA privada",
					intent: "private",
				},
			],
		},
		faq: {
			title: "Preguntas antes de empezar.",
			items: [
				{
					title: "¿Qué es exactamente un Forward Deployed Engineer?",
					body: "Un ingeniero de IA que se incorpora a tu equipo y trabaja desde dentro: automatiza procesos, forma a las personas y monta la infraestructura que haga falta. Lo que entrega son cosas funcionando, no un informe. Las primeras 6 horas de diagnóstico no se facturan.",
				},
				{
					title: "¿Necesitamos un caso de uso definido?",
					body: "No. Podemos empezar por un proceso, necesidad o restricción y ordenar las oportunidades en el estudio sin compromiso.",
				},
				{
					title: "¿Trabajáis con nuestros sistemas actuales?",
					body: "Revisamos integraciones, permisos y limitaciones antes de proponer una solución.",
				},
				{
					title: "¿Podéis desplegar modelos en nuestra infraestructura?",
					body: "Cuando el caso lo permite, tras evaluar rendimiento, seguridad, mantenimiento, coste y calidad.",
				},
				{
					title: "¿La IA privada garantiza el cumplimiento normativo?",
					body: "No por sí sola. Puede facilitar control y trazabilidad, pero el cumplimiento depende del contexto y su evaluación.",
				},
			],
		},
		contact: {
			title: "Hablemos",
			lead: "Cuéntanos el reto. Prepararemos una primera evaluación con prioridad, viabilidad y siguiente paso.",
			open: "Abrir formulario",
			close: "Cerrar formulario",
			privacy:
				"No incluyas información confidencial. Los datos se transmitirán al canal de contacto configurado de DESTRA.",
			successTitle: "Solicitud enviada",
			success:
				"El canal de contacto ha confirmado la recepción. Revisaremos el contexto antes de responder.",
			again: "Enviar otra solicitud",
		},
		cookies: {
			title: "Tu privacidad, bajo control",
			description:
				"Guardamos únicamente la preferencia necesaria para respetar tu elección de privacidad.",
			accept: "Aceptar",
			reject: "Rechazar",
			configure: "Configurar",
			save: "Guardar selección",
			close: "Cerrar configuración de cookies",
			privacyLink: "Ver política de privacidad",
			necessaryTitle: "Preferencia necesaria",
			necessaryDescription:
				"Guardamos tu elección de privacidad en este navegador para respetarla.",
			alwaysOn: "Siempre activa",
		},
		form: {
			errorSummary: "Revisa los campos indicados.",
			retry:
				"Los datos permanecen en el formulario para que puedas intentarlo de nuevo.",
			labels: {
				name: "Nombre y apellidos",
				email: "Correo profesional",
				company: "Empresa u organización",
				role: "Cargo o área",
				need: "¿Qué necesitas abordar?",
				size: "Tamaño de la organización",
				context: "Cuéntanos el contexto",
			},
			hints: {
				role: "Dirección, Tecnología, Operaciones…",
				context:
					"Proceso, objetivo, restricciones o plazo. No incluyas información confidencial.",
			},
			placeholder: "Selecciona una o varias opciones",
			needs: {
				fde: "Forward Deployed Engineer",
				solution: "Plataformas y soluciones",
				architecture: "Arquitectura e infraestructura",
				private: "IA privada u on-premise",
				unclear: "Aún no lo tengo claro",
			},
			sizes: [
				"Prefiero no indicarlo",
				"1–49",
				"50–249",
				"250–999",
				"1.000 o más",
			],
			submit: "Solicitar estudio sin compromiso",
			sending: "Enviando…",
			validation: {
				name: "Indica tu nombre y apellidos",
				email: "Introduce un correo válido",
				company: "Indica la empresa u organización",
				need: "Selecciona al menos una necesidad",
				context: "Añade al menos 20 caracteres de contexto",
			},
			errors: {
				invalid_content_type: "El formato de la solicitud no es válido.",
				not_configured: "El canal de contacto todavía no está configurado.",
				rate_limited: "Hay demasiados intentos. Espera unos minutos.",
				invalid_request: "Revisa los datos de la solicitud.",
				invalid_session: "Recarga la página e inténtalo de nuevo.",
				request_too_large: "La solicitud es demasiado grande. Reduce el texto.",
				verification_failed: "Completa de nuevo la verificación de seguridad.",
				verification_unavailable:
					"No se ha podido verificar la seguridad. Inténtalo de nuevo.",
				delivery_failed: "El canal de contacto no ha confirmado la recepción.",
				unexpected_failure: "No se ha podido completar el envío.",
			},
		},
		footer: {
			summary: "IA útil, integrada y gobernada.",
			explore: "Explorar",
			links: ["Inicio", "Servicios", "FAQ", "Contacto"],
			privacy: "Política de privacidad",
			terms: "Términos y condiciones",
			cookies: "Configurar cookies",
			contact: "Contacto",
			office: "Oficinas",
			legalEntity:
				"Responsable del sitio: MAJOIRA S.A. · C/Valencia nº 318, 08009 Barcelona · contacto@destra.es",
			copyright: "Todos los derechos reservados.",
		},
	},
	en: {} as SiteCopy,
};
siteCopy.en = {
	...siteCopy.es,
	skip: "Skip to content",
	header: {
		home: "DESTRA, return to home",
		nav: "Main navigation",
		mobileNav: "Mobile navigation",
		open: "Open menu",
		close: "Close menu",
		cta: "Contact",
		language: "Language",
	},
	navLabels: {
		home: "Home",
		services: "Services",
		faq: "FAQ",
	},
	hero: {
		kicker: "AI partner for organisations",
		title: "Turn AI into a capability your business can run.",
		lead: "We define the priority, build the solution and integrate it with your systems, data and teams.",
		primary: "Let’s discuss your project",
		secondary: "View services",
		reassurance:
			"No cost, no commitment. We review your case and recommend the next step.",
	},
	services: {
		title: "Services",
		lead: "Four ways to work with us. Most companies start with the first.",
		labels: {
			solution: "What it solves",
			audience: "Who it is for",
			model: "Commercial model",
		},
		items: [
			{
				title: "Forward Deployed Engineer (FDE)",
				body: "Ongoing support. We embed an artificial intelligence expert in your company to work from day one, month by month, on automations, AI training, infrastructure or whatever the organisation needs.",
				audience:
					"Any company that wants to start with AI without taking unnecessary risk. This is the default entry point.",
				model:
					"Weekly or monthly hour bundle at €80/hour plus VAT. The first 6 diagnostic hours are free.",
				cta: "Discuss FDE",
				intent: "fde",
			},
			{
				title: "Platforms and Solutions",
				body: "Custom software development and automation.",
				audience:
					"Companies with a specific process or project already identified, often after an FDE engagement.",
				model: "Fixed project budget, billed by phase or milestone.",
				cta: "Discuss a solution",
				intent: "solution",
			},
			{
				title: "AI Architecture and Infrastructure",
				body: "We optimise existing AI usage and reduce the bill without sacrificing quality.",
				audience:
					"Companies already using frontier APIs in production where the cost has become a problem.",
				model:
					"Fee linked to measured savings against a signed baseline, with a possible base fee.",
				cta: "Discuss infrastructure",
				intent: "architecture",
			},
			{
				title: "Private / On-Premise AI Deployment",
				body: "Local AI infrastructure that never leaves the company or a controlled region such as Europe.",
				audience:
					"Regulated or privileged-data sectors such as hospitals, family offices, banks and law firms.",
				model:
					"Infrastructure project covering hardware or colocation and deployment, followed by ongoing support.",
				cta: "Discuss private AI",
				intent: "private",
			},
		],
	},
	faq: {
		title: "Questions to resolve first.",
		items: [
			{
				title: "What exactly is a Forward Deployed Engineer?",
				body: "An AI engineer who joins your team and works from the inside: automating processes, training people and building whatever infrastructure is needed. The output is working software, not a report. The first 6 diagnostic hours are not billed.",
			},
			{
				title: "Do we need a defined use case?",
				body: "No. We can start with a process, need or constraint and prioritise opportunities in an initial assessment, with no commitment required.",
			},
			{
				title: "Do you work with our current systems?",
				body: "We review integrations, permissions and constraints before proposing a solution.",
			},
			{
				title: "Can you deploy models in our infrastructure?",
				body: "Where appropriate, after assessing performance, security, maintenance, cost and quality.",
			},
			{
				title: "Does private AI guarantee compliance?",
				body: "Not by itself. It can facilitate control and traceability, but compliance depends on context and assessment.",
			},
		],
	},
	contact: {
		title: "Let’s talk",
		lead: "An initial assessment, with no commitment required. Tell us about the challenge so we can explore priorities, feasibility and the next step.",
		open: "Open contact form",
		close: "Close contact form",
		privacy:
			"Do not include confidential information. Your data will be sent to DESTRA’s configured contact channel.",
		successTitle: "Request sent",
		success:
			"The contact channel has confirmed receipt. We will review the context before replying.",
		again: "Send another request",
	},
	cookies: {
		title: "Your privacy, under your control",
		description:
			"We only store the necessary preference needed to respect your privacy choice.",
		accept: "Accept",
		reject: "Reject",
		configure: "Configure",
		save: "Save selection",
		close: "Close cookie settings",
		privacyLink: "View privacy policy",
		necessaryTitle: "Necessary preference",
		necessaryDescription:
			"We store your privacy choice in this browser so we can respect it.",
		alwaysOn: "Always on",
	},
	form: {
		errorSummary: "Review the highlighted fields.",
		retry: "Your details remain in the form so you can try again.",
		labels: {
			name: "Full name",
			email: "Work email",
			company: "Company or organisation",
			role: "Role or area",
			need: "What do you need to address?",
			size: "Organisation size",
			context: "Tell us the context",
		},
		hints: {
			role: "Leadership, Technology, Operations…",
			context:
				"Process, objective, constraints or timeframe. Do not include confidential information.",
		},
		placeholder: "Select one or more options",
		needs: {
			fde: "Forward Deployed Engineer",
			solution: "Platforms and solutions",
			architecture: "Architecture and infrastructure",
			private: "Private or on-premise AI",
			unclear: "Not sure yet",
		},
		sizes: ["Prefer not to say", "1–49", "50–249", "250–999", "1,000+"],
		submit: "Let’s discuss your project",
		sending: "Sending…",
		validation: {
			name: "Enter your full name",
			email: "Enter a valid email address",
			company: "Enter your company or organisation",
			need: "Select at least one need",
			context: "Add at least 20 characters of context",
		},
		errors: {
			invalid_content_type: "The request format is not valid.",
			not_configured: "The contact channel is not configured yet.",
			rate_limited:
				"There have been too many attempts. Please wait a few minutes.",
			invalid_request: "Review the request details.",
			invalid_session: "Reload the page and try again.",
			request_too_large: "The request is too large. Shorten the text.",
			verification_failed: "Complete the security check again.",
			verification_unavailable:
				"The security check is unavailable. Please try again.",
			delivery_failed: "The contact channel did not confirm receipt.",
			unexpected_failure: "We could not complete the request.",
		},
	},
	footer: {
		summary: "Useful, integrated, governed AI.",
		explore: "Explore",
		links: ["Home", "Services", "FAQ", "Contact"],
		privacy: "Privacy policy",
		terms: "Terms and conditions",
		cookies: "Configure cookies",
		contact: "Contact",
		office: "Office",
		legalEntity:
			"Website controller: MAJOIRA S.A. · C/Valencia nº 318, 08009 Barcelona · contacto@destra.es",
		copyright: "All rights reserved.",
	},
};
