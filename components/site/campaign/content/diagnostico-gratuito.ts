import { defineCampaign } from "./types";

// El inglés es una traducción provisional, pendiente de revisar por DESTRA.
export default defineCampaign({
	slug: "diagnostico-gratuito",
	need: "unclear",
	content: {
		es: {
			meta: {
				title: "Diagnóstico gratuito de 6 horas",
				description:
					"Sistemas con IA para tu empresa. Seis horas de diagnóstico gratuito para elegir el caso de IA con más retorno. Sin coste ni compromiso.",
			},
			sections: [
				{
					type: "hero",
					eyebrow: "Sistemas con IA para tu empresa",
					title: "Tu partner de\n[[IA]], mes a mes.",
					lede: "Seis horas de diagnóstico gratuito para elegir el caso de IA con más retorno.",
					note: "Sin coste ni compromiso.",
					secondary: { label: "Ver el método", href: "#metodo" },
					stats: [
						{ value: "1 h", label: "Reunión con tu equipo" },
						{ value: "5 h", label: "Análisis e informe" },
						{ value: "4", label: "Automatizaciones de resultado rápido" },
					],
				},
				{
					type: "problem",
					label: "01. El problema",
					title: "La IA suelta [[no entra]]\nen la operativa.",
					cards: [
						"Procesos manuales que se llevan horas de tu equipo.",
						"Herramientas y sistemas desconectados.",
						"Pruebas de IA que no llegan al día a día.",
						"No saber por dónde empezar.",
					],
					panelLabel: "Nuestro diferencial",
					panel:
						"Automatizar un proceso mal planteado no lo soluciona. Primero analizamos cómo funciona tu empresa.",
				},
				{
					type: "how",
					label: "02. Cómo trabajamos",
					title: "Definir, construir,\nintegrar y operar.",
					steps: [
						{
							title: "Definimos la prioridad",
							text: "Elegimos el caso con más retorno antes de construir.",
						},
						{
							title: "Construimos",
							text: "Entregas semanales con algo funcionando.",
						},
						{
							title: "Integramos",
							text: "Conectamos con tus sistemas y tus datos.",
						},
						{ title: "Operamos", text: "Mes a mes, y formamos a tu equipo." },
					],
				},
				{
					type: "deliverables",
					variant: "hours",
					label: "03. Qué recibes",
					title: "Qué ocurre en¶las [[seis horas]].",
					hours: [
						{ value: "1 h", label: "Reunión con tu equipo." },
						{ value: "5 h", label: "Análisis e informe." },
					],
					deliveries: [
						{
							label: "Entrega 01",
							title: "Un mapa de tu operativa",
							text: "Tecnología, procesos y herramientas.",
						},
						{
							label: "Entrega 02",
							title: "Oportunidades de mejora",
							text: "Dónde aporta la IA en tu caso.",
						},
						{
							label: "Entrega 03",
							title: "4 automatizaciones rápidas",
							text: "Una propuesta concreta para empezar.",
						},
					],
				},
				{ type: "protocol5d" },
				{ type: "faq" },
				{ type: "closing" },
			],
		},
		en: {
			meta: {
				title: "Free 6-hour assessment",
				description:
					"AI systems for your company. Six hours of free assessment to choose the AI use case with the highest return. No cost, no commitment.",
			},
			sections: [
				{
					type: "hero",
					eyebrow: "AI systems for your company",
					title: "Your [[AI]] partner,\nmonth by month.",
					lede: "Six hours of free assessment to choose the AI use case with the highest return.",
					note: "No cost, no commitment.",
					secondary: { label: "See the method", href: "#metodo" },
					stats: [
						{ value: "1 h", label: "Meeting with your team" },
						{ value: "5 h", label: "Analysis and report" },
						{ value: "4", label: "Quick-win automations" },
					],
				},
				{
					type: "problem",
					label: "01. The problem",
					title: "Standalone AI [[doesn't reach]]\nday-to-day operations.",
					cards: [
						"Manual processes that take up your team's hours.",
						"Disconnected tools and systems.",
						"AI pilots that never reach daily work.",
						"Not knowing where to start.",
					],
					panelLabel: "What sets us apart",
					panel:
						"Automating a badly designed process won't fix it. First we analyse how your company works.",
				},
				{
					type: "how",
					label: "02. How we work",
					title: "Define, build,\nintegrate and operate.",
					steps: [
						{
							title: "We set the priority",
							text: "We choose the case with the highest return before building.",
						},
						{
							title: "We build",
							text: "Weekly deliveries with something working.",
						},
						{
							title: "We integrate",
							text: "We connect with your systems and your data.",
						},
						{
							title: "We operate",
							text: "Month by month, and we train your team.",
						},
					],
				},
				{
					type: "deliverables",
					variant: "hours",
					label: "03. What you get",
					title: "What happens in¶the [[six hours]].",
					hours: [
						{ value: "1 h", label: "Meeting with your team." },
						{ value: "5 h", label: "Analysis and report." },
					],
					deliveries: [
						{
							label: "Delivery 01",
							title: "A map of your operations",
							text: "Technology, processes and tools.",
						},
						{
							label: "Delivery 02",
							title: "Improvement opportunities",
							text: "Where AI adds value in your case.",
						},
						{
							label: "Delivery 03",
							title: "4 quick automations",
							text: "A concrete proposal to get started.",
						},
					],
				},
				{ type: "protocol5d" },
				{ type: "faq" },
				{ type: "closing" },
			],
		},
	},
});
