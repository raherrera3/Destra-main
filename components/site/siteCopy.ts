import type { NeedValue } from "./contactSchema";

export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export type ContactErrorCode =
	| "invalid_content_type"
	| "not_configured"
	| "rate_limited"
	| "invalid_request"
	| "invalid_session"
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
		servicesMenu: string;
	};
	navLabels: {
		services: string;
		private: string;
		method: string;
		cases: string;
		why: string;
	};
	hero: {
		kicker: string;
		title: string;
		lead: string;
		primary: string;
		secondary: string;
		reassurance: string;
		band: string;
		capabilities: string[];
	};
	map: {
		caption: string;
		sources: string;
		sourceNodes: string[];
		core: string;
		coreItems: string[];
		outcomes: string;
		outcomeNodes: string[];
		control: string;
		controlValues: string;
	};
	problem: {
		title: string;
		lead: string;
		items: Item[];
		statement: string;
		emphasis: string;
	};
	proposal: {
		title: string;
		lead: string;
		center: string;
		dimensions: Item[];
		cta: string;
	};
	services: {
		title: string;
		lead: string;
		items: Array<
			Item & { stage: string; tags: string[]; cta: string; intent: NeedValue }
		>;
	};
	privateAi: {
		title: string;
		lead: string;
		sectors: string;
		benefits: Item[];
		cta: string;
		visual: string;
		perimeter: string;
		nodes: string[];
		monitor: string[];
		noteTitle: string;
		note: string;
	};
	method: { title: string; lead: string; cta: string; steps: Item[] };
	cases: {
		title: string;
		lead: string;
		disclaimer: string;
		items: Array<Item & { cta: string; intent: NeedValue }>;
	};
	why: { title: string; items: Item[] };
	faq: { title: string; items: Item[] };
	contact: {
		title: string;
		lead: string;
		includes: string;
		points: string[];
		privacy: string;
		successTitle: string;
		success: string;
		again: string;
		meetingTitle: string;
		meetingLead: string;
		unavailable: string;
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
		capabilities: string;
		explore: string;
		links: string[];
		privacy: string;
		terms: string;
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
			cta: "Estudio gratuito",
			language: "Idioma",
			servicesMenu: "Ver servicios",
		},
		navLabels: {
			services: "Servicios",
			private: "IA privada",
			method: "Método",
			cases: "Casos de uso",
			why: "DESTRA",
		},
		hero: {
			kicker: "Partner de IA para organizaciones",
			title: "Convierte la IA en una capacidad que tu empresa puede operar.",
			lead: "Definimos la prioridad, construimos la solución y la integramos en tus sistemas, datos y equipos.",
			primary: "Solicitar estudio gratuito",
			secondary: "Ver cómo trabajamos",
			reassurance:
				"Sin coste ni compromiso. Revisamos tu caso y proponemos el siguiente paso.",
			band: "Estrategia, sistemas y adopción en un mismo equipo.",
			capabilities: ["Estrategia", "Sistemas", "Datos", "Infraestructura"],
		},
		map: {
			caption: "De las fuentes internas a una operación de IA gobernada.",
			sources: "Fuentes",
			sourceNodes: ["Sistemas", "Documentación", "Datos"],
			core: "Núcleo de IA",
			coreItems: ["Contexto", "Orquestación", "Integración"],
			outcomes: "Operación",
			outcomeNodes: ["Equipos", "Procesos", "Aplicaciones"],
			control: "Control",
			controlValues: "Accesos · Trazabilidad · Calidad",
		},
		problem: {
			title: "La IA se bloquea antes de llegar a la operación.",
			lead: "El problema rara vez es un modelo. Suele ser decidir dónde aporta valor, integrarlo bien y mantener el control.",
			items: [
				{
					title: "Prioridad",
					body: "Casos de uso que no conectan valor, viabilidad y adopción.",
				},
				{
					title: "Integración",
					body: "Herramientas aisladas de sistemas, permisos y procesos.",
				},
				{
					title: "Control",
					body: "Datos, costes y trazabilidad sin un diseño operativo claro.",
				},
			],
			statement: "El reto no es añadir más IA.",
			emphasis: "Es construir una capacidad que encaje en la organización.",
		},
		proposal: {
			title: "De la decisión a la operación.",
			lead: "Conectamos negocio, proceso, datos, tecnología e implantación para que la IA llegue a producción.",
			center: "IA en operación",
			dimensions: [
				{ title: "Estrategia", body: "Prioridad y hoja de ruta" },
				{ title: "Procesos", body: "Flujos y responsables" },
				{ title: "Datos", body: "Fuentes y permisos" },
				{ title: "Tecnología", body: "Modelos e integración" },
				{ title: "Infraestructura", body: "Despliegue y control" },
				{ title: "Personas", body: "Uso y adopción" },
			],
			cta: "Ver cómo trabajamos",
		},
		services: {
			title: "Cuatro capacidades, una visión de conjunto.",
			lead: "Empezamos donde esté la necesidad y diseñamos cada paso pensando en el siguiente.",
			items: [
				{
					stage: "Decidir",
					title: "Estrategia y adopción de IA",
					body: "Priorizamos oportunidades con valor, viabilidad y adopción.",
					tags: ["Procesos", "Roadmap", "Equipos"],
					cta: "Estudiar este caso",
					intent: "strategy",
				},
				{
					stage: "Construir",
					title: "Plataformas y soluciones",
					body: "Creamos herramientas conectadas con los procesos que ya utilizas.",
					tags: ["Aplicaciones", "Agentes", "Integración"],
					cta: "Estudiar este caso",
					intent: "solution",
				},
				{
					stage: "Operar",
					title: "Arquitectura e infraestructura",
					body: "Definimos modelos, datos, permisos y operación para cada solución.",
					tags: ["RAG", "APIs", "Observabilidad"],
					cta: "Estudiar este caso",
					intent: "architecture",
				},
				{
					stage: "Controlar",
					title: "IA privada y on-premise",
					body: "Evaluamos dónde procesar los datos y cómo gobernar el acceso.",
					tags: ["Local", "Híbrido", "Trazabilidad"],
					cta: "Evaluar la arquitectura",
					intent: "private",
				},
			],
		},
		privateAi: {
			title: "IA bajo las reglas de tu organización.",
			lead: "Para contextos que requieren más control, diseñamos entornos privados, locales o híbridos adaptados a tus sistemas y políticas.",
			sectors:
				"Relevante en salud, legal, finanzas, industria y administración.",
			benefits: [
				{
					title: "Control del dato",
					body: "Define dónde se procesa y almacena la información.",
				},
				{
					title: "Arquitectura adaptada",
					body: "Combina infraestructura local, privada o híbrida.",
				},
				{
					title: "Integración interna",
					body: "Conecta documentación y aplicaciones corporativas.",
				},
				{
					title: "Gobernanza",
					body: "Incorpora accesos, evaluación y monitorización.",
				},
			],
			cta: "Evaluar una arquitectura privada",
			visual: "Flujo de IA en un perímetro definido por el cliente",
			perimeter: "Perímetro definido por el cliente",
			nodes: [
				"Fuentes internas",
				"Acceso y permisos",
				"Modelos privados",
				"Aplicaciones",
			],
			monitor: ["Calidad", "Coste", "Trazabilidad"],
			noteTitle: "Más control técnico. No una garantía de cumplimiento.",
			note: "Una arquitectura privada puede facilitar el control y la trazabilidad. El cumplimiento depende también del uso, los datos, los riesgos y la evaluación aplicable.",
		},
		method: {
			title: "Un proceso claro, desde el primer estudio.",
			lead: "Alineamos oportunidad, arquitectura, integración y adopción desde el inicio.",
			cta: "Empezar con un estudio gratuito",
			steps: [
				{
					title: "Diagnosticar",
					body: "Proceso, sistemas, datos y restricciones.",
				},
				{ title: "Priorizar", body: "Valor, viabilidad, riesgo y esfuerzo." },
				{ title: "Diseñar", body: "Experiencia, arquitectura y controles." },
				{ title: "Construir", body: "Desarrollo e integración por fases." },
				{ title: "Desplegar", body: "Producción, formación y adopción." },
				{ title: "Mejorar", body: "Calidad, uso, coste y evolución." },
			],
		},
		cases: {
			title: "Procesos que merece la pena evaluar.",
			lead: "Ejemplos de ámbitos donde la IA puede aportar contexto, velocidad y control.",
			disclaimer:
				"Son áreas para estudiar; no son resultados ni casos de clientes.",
			items: [
				{
					title: "Operaciones",
					body: "Incidencias, información y decisiones con supervisión humana.",
					cta: "Estudiar el proceso",
					intent: "solution",
				},
				{
					title: "Conocimiento documental",
					body: "Búsqueda con permisos y síntesis sobre repositorios internos.",
					cta: "Explorar el sistema",
					intent: "solution",
				},
				{
					title: "Legal, riesgo y finanzas",
					body: "Revisión asistida y trazabilidad en contextos sensibles.",
					cta: "Evaluar el caso",
					intent: "private",
				},
				{
					title: "Atención y servicio",
					body: "Respuestas y tareas conectadas con el CRM.",
					cta: "Analizar el flujo",
					intent: "integration",
				},
			],
		},
		why: {
			title: "Estrategia y ejecución, sin soluciones parciales.",
			items: [
				{
					title: "De la prioridad al sistema",
					body: "Una decisión puede convertirse en una solución operable.",
				},
				{
					title: "Integración desde el diseño",
					body: "Datos, permisos y experiencia forman parte del proyecto.",
				},
				{
					title: "Arquitectura según el caso",
					body: "Elegimos modelos y entorno por necesidad, no por moda.",
				},
				{
					title: "Mejora continua",
					body: "Medimos calidad, uso y coste tras el despliegue.",
				},
			],
		},
		faq: {
			title: "Preguntas antes de empezar.",
			items: [
				{
					title: "¿Necesitamos un caso de uso definido?",
					body: "No. Podemos empezar por un proceso, necesidad o restricción y ordenar las oportunidades en el estudio gratuito.",
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
			title: "Solicita un estudio gratuito de tu caso.",
			lead: "Cuéntanos el reto. Prepararemos una primera evaluación con prioridad, viabilidad y siguiente paso.",
			includes: "Qué incluye",
			points: [
				"Un punto de partida bien encuadrado.",
				"Preguntas técnicas y de negocio relevantes.",
				"Un siguiente paso adecuado al contexto.",
			],
			privacy:
				"No incluyas información confidencial. Los datos se transmitirán al canal de contacto configurado de DESTRA.",
			successTitle: "Solicitud enviada",
			success:
				"El canal de contacto ha confirmado la recepción. Revisaremos el contexto antes de responder.",
			again: "Enviar otra solicitud",
			meetingTitle: "Prefieres hablar primero?",
			meetingLead:
				"La sesión estratégica se habilitará cuando la agenda de DESTRA esté configurada.",
			unavailable: "La agenda todavía no está disponible.",
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
			placeholder: "Selecciona una opción",
			needs: {
				strategy: "Definir estrategia o roadmap",
				solution: "Desarrollar una solución",
				architecture: "Arquitectura e infraestructura",
				integration: "Integrar IA con sistemas",
				private: "Evaluar IA privada u on-premise",
				improve: "Mejorar un proyecto iniciado",
				unclear: "Aún no lo tenemos claro",
			},
			sizes: [
				"Prefiero no indicarlo",
				"1–49",
				"50–249",
				"250–999",
				"1.000 o más",
			],
			submit: "Solicitar estudio gratuito",
			sending: "Enviando…",
			validation: {
				name: "Indica tu nombre y apellidos",
				email: "Introduce un correo válido",
				company: "Indica la empresa u organización",
				need: "Selecciona la necesidad principal",
				context: "Añade al menos 20 caracteres de contexto",
			},
			errors: {
				invalid_content_type: "El formato de la solicitud no es válido.",
				not_configured: "El canal de contacto todavía no está configurado.",
				rate_limited: "Hay demasiados intentos. Espera unos minutos.",
				invalid_request: "Revisa los datos de la solicitud.",
				invalid_session: "Recarga la página e inténtalo de nuevo.",
				delivery_failed: "El canal de contacto no ha confirmado la recepción.",
				unexpected_failure: "No se ha podido completar el envío.",
			},
		},
		footer: {
			summary: "IA útil, integrada y gobernada.",
			capabilities: "Capacidades",
			explore: "Explorar",
			links: [
				"Estrategia y adopción",
				"Soluciones de IA",
				"Arquitectura",
				"IA privada",
				"Método",
				"Casos de uso",
				"Por qué DESTRA",
				"Estudio gratuito",
			],
			privacy: "Política de privacidad",
			terms: "Términos y condiciones",
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
		cta: "Free AI assessment",
		language: "Language",
		servicesMenu: "View services",
	},
	navLabels: {
		services: "Services",
		private: "Private AI",
		method: "Method",
		cases: "Use cases",
		why: "DESTRA",
	},
	hero: {
		kicker: "AI partner for organisations",
		title: "Turn AI into a capability your business can run.",
		lead: "We define the priority, build the solution and integrate it with your systems, data and teams.",
		primary: "Request a free AI assessment",
		secondary: "See how we work",
		reassurance:
			"No cost, no commitment. We review your case and recommend the next step.",
		band: "Strategy, systems and adoption in one team.",
		capabilities: ["Strategy", "Systems", "Data", "Infrastructure"],
	},
	map: {
		caption: "From internal sources to governed AI operations.",
		sources: "Sources",
		sourceNodes: ["Systems", "Documents", "Data"],
		core: "AI core",
		coreItems: ["Context", "Orchestration", "Integration"],
		outcomes: "Operation",
		outcomeNodes: ["Teams", "Processes", "Applications"],
		control: "Control",
		controlValues: "Access · Traceability · Quality",
	},
	problem: {
		title: "AI stalls before it reaches operations.",
		lead: "The issue is rarely a model. It is usually deciding where it adds value, integrating it well and keeping control.",
		items: [
			{
				title: "Priority",
				body: "Use cases disconnected from value, feasibility and adoption.",
			},
			{
				title: "Integration",
				body: "Tools isolated from systems, permissions and processes.",
			},
			{
				title: "Control",
				body: "Data, cost and traceability without a clear operating design.",
			},
		],
		statement: "The challenge is not adding more AI.",
		emphasis: "It is building a capability that fits the organisation.",
	},
	proposal: {
		title: "From decision to operation.",
		lead: "We connect business, process, data, technology and delivery so AI reaches production.",
		center: "AI in operation",
		dimensions: [
			{ title: "Strategy", body: "Priority and roadmap" },
			{ title: "Processes", body: "Flows and ownership" },
			{ title: "Data", body: "Sources and permissions" },
			{ title: "Technology", body: "Models and integration" },
			{ title: "Infrastructure", body: "Deployment and control" },
			{ title: "People", body: "Use and adoption" },
		],
		cta: "See how we work",
	},
	services: {
		title: "Four capabilities, one joined-up view.",
		lead: "We start where the need is and design each step with the next one in mind.",
		items: [
			{
				stage: "Decide",
				title: "AI strategy and adoption",
				body: "We prioritise opportunities by value, feasibility and adoption.",
				tags: ["Processes", "Roadmap", "Teams"],
				cta: "Assess this use case",
				intent: "strategy",
			},
			{
				stage: "Build",
				title: "Platforms and solutions",
				body: "We create tools connected to the processes you already use.",
				tags: ["Applications", "Agents", "Integration"],
				cta: "Assess this use case",
				intent: "solution",
			},
			{
				stage: "Operate",
				title: "Architecture and infrastructure",
				body: "We define models, data, permissions and operations for each solution.",
				tags: ["RAG", "APIs", "Observability"],
				cta: "Assess this use case",
				intent: "architecture",
			},
			{
				stage: "Control",
				title: "Private and on-premise AI",
				body: "We assess where to process data and how to govern access.",
				tags: ["Local", "Hybrid", "Traceability"],
				cta: "Assess the architecture",
				intent: "private",
			},
		],
	},
	privateAi: {
		title: "AI under your organisation’s rules.",
		lead: "For contexts that require more control, we design private, local or hybrid environments adapted to your systems and policies.",
		sectors: "Relevant to healthcare, legal, finance, industry and government.",
		benefits: [
			{
				title: "Data control",
				body: "Define where information is processed and stored.",
			},
			{
				title: "Fit-for-purpose architecture",
				body: "Combine local, private or hybrid infrastructure.",
			},
			{
				title: "Internal integration",
				body: "Connect corporate documents and applications.",
			},
			{
				title: "Governance",
				body: "Include access, evaluation and monitoring.",
			},
		],
		cta: "Assess a private architecture",
		visual: "AI flow within a client-defined perimeter",
		perimeter: "Client-defined perimeter",
		nodes: [
			"Internal sources",
			"Access and permissions",
			"Private models",
			"Applications",
		],
		monitor: ["Quality", "Cost", "Traceability"],
		noteTitle: "More technical control. Not a compliance guarantee.",
		note: "A private architecture can facilitate control and traceability. Compliance also depends on use, data, risks and the relevant assessment.",
	},
	method: {
		title: "A clear process, from the first assessment.",
		lead: "We align opportunity, architecture, integration and adoption from the outset.",
		cta: "Start with a free assessment",
		steps: [
			{ title: "Diagnose", body: "Process, systems, data and constraints." },
			{ title: "Prioritise", body: "Value, feasibility, risk and effort." },
			{ title: "Design", body: "Experience, architecture and controls." },
			{ title: "Build", body: "Phased development and integration." },
			{ title: "Deploy", body: "Production, training and adoption." },
			{ title: "Improve", body: "Quality, use, cost and evolution." },
		],
	},
	cases: {
		title: "Processes worth assessing.",
		lead: "Examples of areas where AI can add context, speed and control.",
		disclaimer:
			"These are areas to assess, not client results or case studies.",
		items: [
			{
				title: "Operations",
				body: "Incidents, information and decisions with human oversight.",
				cta: "Assess the process",
				intent: "solution",
			},
			{
				title: "Document knowledge",
				body: "Permissioned search and synthesis across internal repositories.",
				cta: "Explore the system",
				intent: "solution",
			},
			{
				title: "Legal, risk and finance",
				body: "Assisted review and traceability in sensitive contexts.",
				cta: "Assess the use case",
				intent: "private",
			},
			{
				title: "Service and support",
				body: "Responses and tasks connected to the CRM.",
				cta: "Assess the flow",
				intent: "integration",
			},
		],
	},
	why: {
		title: "Strategy and delivery, without partial solutions.",
		items: [
			{
				title: "From priority to system",
				body: "A decision can become an operable solution.",
			},
			{
				title: "Integration by design",
				body: "Data, permissions and experience are part of the project.",
			},
			{
				title: "Architecture for the case",
				body: "We choose models and environment by need, not fashion.",
			},
			{
				title: "Continuous improvement",
				body: "We measure quality, use and cost after deployment.",
			},
		],
	},
	faq: {
		title: "Questions to resolve first.",
		items: [
			{
				title: "Do we need a defined use case?",
				body: "No. We can start with a process, need or constraint and prioritise opportunities in the free assessment.",
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
		title: "Request a free assessment of your case.",
		lead: "Tell us about the challenge. We will prepare an initial view of priority, feasibility and the next step.",
		includes: "What it includes",
		points: [
			"A well-framed starting point.",
			"Relevant business and technical questions.",
			"A next step suited to the context.",
		],
		privacy:
			"Do not include confidential information. Your data will be sent to DESTRA’s configured contact channel.",
		successTitle: "Request sent",
		success:
			"The contact channel has confirmed receipt. We will review the context before replying.",
		again: "Send another request",
		meetingTitle: "Prefer to talk first?",
		meetingLead:
			"The strategic session will be enabled when DESTRA’s calendar is configured.",
		unavailable: "The calendar is not available yet.",
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
		placeholder: "Select an option",
		needs: {
			strategy: "Define strategy or roadmap",
			solution: "Build a solution",
			architecture: "AI architecture and infrastructure",
			integration: "Integrate AI with systems",
			private: "Assess private or on-premise AI",
			improve: "Improve an existing project",
			unclear: "We are not sure yet",
		},
		sizes: ["Prefer not to say", "1–49", "50–249", "250–999", "1,000+"],
		submit: "Request my free assessment",
		sending: "Sending…",
		validation: {
			name: "Enter your full name",
			email: "Enter a valid email address",
			company: "Enter your company or organisation",
			need: "Select your main need",
			context: "Add at least 20 characters of context",
		},
		errors: {
			invalid_content_type: "The request format is not valid.",
			not_configured: "The contact channel is not configured yet.",
			rate_limited:
				"There have been too many attempts. Please wait a few minutes.",
			invalid_request: "Review the request details.",
			invalid_session: "Reload the page and try again.",
			delivery_failed: "The contact channel did not confirm receipt.",
			unexpected_failure: "We could not complete the request.",
		},
	},
	footer: {
		summary: "Useful, integrated, governed AI.",
		capabilities: "Capabilities",
		explore: "Explore",
		links: [
			"Strategy and adoption",
			"AI solutions",
			"Architecture",
			"Private AI",
			"Method",
			"Use cases",
			"Why DESTRA",
			"Free AI assessment",
		],
		privacy: "Privacy policy",
		terms: "Terms and conditions",
		copyright: "All rights reserved.",
	},
};
