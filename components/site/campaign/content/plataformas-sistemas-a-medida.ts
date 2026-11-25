import { defineCampaign } from "./types";

// La v2 mostraba en móvil otros pasos en "Cómo trabajamos"; aquí hay un único
// texto, el de escritorio. El inglés es provisional, pendiente de revisar.
export default defineCampaign({
	slug: "plataformas-sistemas-a-medida",
	need: "solution",
	content: {
		es: {
			meta: {
				title: "Plataformas y sistemas a medida para empresas",
				description:
					"Software y automatizaciones a medida, integrados con tus sistemas y tus datos. Presupuesto cerrado por proyecto. Empieza con un diagnóstico gratuito de 6 horas.",
			},
			sections: [
				{
					type: "hero",
					eyebrow: "Plataformas y sistemas a medida",
					title: "Plataformas y\nsistemas [[a medida]]\npara tu proceso.",
					lede: "Software integrado con tus sistemas, con presupuesto cerrado y facturación por fases.",
					cta: "Cuéntanos tu proceso",
					note: "Empezamos con un diagnóstico gratuito de 6 horas.",
					secondary: { label: "Ver el método", href: "#metodo" },
					diagram: {
						kind: "platform",
						source: "Tu proceso",
						label: "Plataforma a medida",
						title: "Tu proceso,\nhecho software.",
						systems: ["CRM", "ERP", "Correo", "Datos"],
						caption: "Tus sistemas y tus datos",
					},
					stats: [
						{ value: "Cerrado", label: "Presupuesto por proyecto" },
						{ value: "Por fases", label: "Facturación por hitos" },
						{ value: "Semanal", label: "Entregas con algo funcionando" },
					],
				},
				{
					type: "problem",
					label: "01. El problema",
					title:
						"Cuando ninguna\nherramienta del\nmercado [[encaja]]\ncon tu proceso.",
					cards: [
						"Un proceso que pide software propio.",
						"Sistemas y herramientas desconectados.",
						"Una solución a medida, no otra licencia.",
						"Un presupuesto cuyo final no ves.",
					],
					panelLabel: "Nuestro diferencial",
					panel:
						"Programar un proceso mal planteado no lo soluciona. Antes de construir, analizamos el proceso.",
				},
				{
					type: "how",
					label: "02. Cómo trabajamos",
					title: "Primero las integraciones,¶después la propuesta.",
					steps: [
						{
							title: "Revisamos integraciones",
							text: "Permisos y limitaciones, antes de proponer.",
						},
						{
							title: "Cerramos el presupuesto",
							text: "Por proyecto, facturado por hitos.",
						},
						{
							title: "Construimos",
							text: "Entregas semanales con algo funcionando.",
						},
						{
							title: "Integramos y operamos",
							text: "La plataforma entra en el día a día.",
						},
					],
				},
				{
					type: "deliverables",
					variant: "cards",
					label: "03. Qué recibes",
					title: "Qué recibes¶con [[Destra]].",
					cards: [
						"Tecnología pensada para tu proceso.",
						"Integración con lo que ya tienes.",
						"Coste cerrado desde el inicio.",
					],
					panelLabel: "El diagnóstico gratuito",
					panel:
						"1 hora de reunión, 5 de análisis y un informe con el mapa de tu operativa y propuestas de resultado rápido.",
				},
				{ type: "protocol5d" },
				{ type: "faq" },
				{ type: "closing" },
			],
		},
		en: {
			meta: {
				title: "Custom platforms and systems for companies",
				description:
					"Custom software and automations, integrated with your systems and data. Fixed budget per project. Start with a free 6-hour assessment.",
			},
			sections: [
				{
					type: "hero",
					eyebrow: "Custom platforms and systems",
					title: "Platforms and\nsystems [[built around]]\nyour process.",
					lede: "Software integrated with your systems, with a fixed budget and phased billing.",
					cta: "Tell us about your process",
					note: "We start with a free 6-hour assessment.",
					secondary: { label: "See the method", href: "#metodo" },
					diagram: {
						kind: "platform",
						source: "Your process",
						label: "Custom platform",
						title: "Your process,\nmade software.",
						systems: ["CRM", "ERP", "Email", "Data"],
						caption: "Your systems and your data",
					},
					stats: [
						{ value: "Fixed", label: "Budget per project" },
						{ value: "Phased", label: "Milestone billing" },
						{ value: "Weekly", label: "Deliveries that work" },
					],
				},
				{
					type: "problem",
					label: "01. The problem",
					title: "When no tool\non the market [[fits]]\nyour process.",
					cards: [
						"A process that calls for its own software.",
						"Disconnected systems and tools.",
						"A custom solution, not another licence.",
						"A budget with no end in sight.",
					],
					panelLabel: "What sets us apart",
					panel:
						"Coding a badly designed process won't fix it. Before building, we analyse the process.",
				},
				{
					type: "how",
					label: "02. How we work",
					title: "Integrations first,¶then the proposal.",
					steps: [
						{
							title: "We review integrations",
							text: "Permissions and limits, before proposing.",
						},
						{
							title: "We fix the budget",
							text: "Per project, billed by milestones.",
						},
						{
							title: "We build",
							text: "Weekly deliveries with something working.",
						},
						{
							title: "We integrate and operate",
							text: "The platform becomes part of daily work.",
						},
					],
				},
				{
					type: "deliverables",
					variant: "cards",
					label: "03. What you get",
					title: "What you get¶with [[Destra]].",
					cards: [
						"Technology designed around your process.",
						"Integration with what you already have.",
						"A fixed cost from the start.",
					],
					panelLabel: "The free assessment",
					panel:
						"A 1-hour meeting, 5 hours of analysis and a report with a map of your operations and quick-win proposals.",
				},
				{ type: "protocol5d" },
				{ type: "faq" },
				{ type: "closing" },
			],
		},
	},
});
