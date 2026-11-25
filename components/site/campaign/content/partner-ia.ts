import { defineCampaign } from "./types";

// El inglés es una traducción provisional, pendiente de revisar por DESTRA.
export default defineCampaign({
	slug: "partner-ia",
	need: "fde",
	content: {
		es: {
			meta: {
				title: "Partner de IA para empresas",
				description:
					"Un ingeniero de IA dentro de tu equipo, mes a mes. Empieza con un diagnóstico gratuito de 6 horas, sin coste ni compromiso.",
			},
			sections: [
				{
					type: "hero",
					eyebrow: "Partner de IA para empresas",
					title: "Un ingeniero de\n[[IA]] dentro de tu\nequipo, mes a mes.",
					lede: "Definimos la prioridad, construimos con entregas semanales e integramos la IA con tus sistemas.",
					note: "Sin coste ni compromiso.",
					secondary: { label: "Ver el método", href: "#metodo" },
					diagram: {
						kind: "orbit",
						nodes: [
							"Operaciones",
							"Ventas",
							"Finanzas",
							"Atención",
							"Datos",
							"Dirección",
						],
					},
					stats: [
						{ value: "Mes a mes", label: "Dentro de tu equipo" },
						{ value: "Semanal", label: "Entregas con algo funcionando" },
						{ value: "6 h", label: "De diagnóstico gratuito" },
					],
				},
				{
					type: "problem",
					label: "01. El problema",
					title:
						"Las herramientas de\nIA sueltas resuelven\n[[tareas sueltas]].",
					cards: [
						"Horas del equipo en tareas repetitivas.",
						"Sistemas que no se hablan entre sí.",
						"Quieres IA sin un proyecto largo.",
						"Sin un caso de uso definido.",
					],
					panelLabel: "Nuestro diferencial",
					panel:
						"Una herramienta de IA sobre un proceso mal planteado no lo soluciona. Primero analizamos cómo funciona tu empresa.",
				},
				{
					type: "how",
					label: "02. Cómo trabajamos",
					title: "Un ingeniero que\ntrabaja desde dentro.",
					steps: [
						{ title: "Definimos", text: "Elegimos el caso con más retorno." },
						{
							title: "Construimos",
							text: "Entregas semanales con algo funcionando.",
						},
						{
							title: "Integramos",
							text: "Conectamos con tus sistemas y datos.",
						},
						{ title: "Operamos", text: "Mes a mes, y formamos a tu equipo." },
					],
				},
				{
					type: "deliverables",
					variant: "cards",
					label: "03. Qué recibes",
					title: "Qué recibes¶con [[Destra]].",
					cards: [
						"Menos horas en tareas repetitivas.",
						"IA conectada con tus sistemas y datos.",
						"Un ingeniero dentro de tu equipo.",
					],
					panelLabel: "El diagnóstico gratuito",
					panel:
						"1 hora de reunión, 5 de análisis y un informe con el mapa de tu operativa y 4 automatizaciones de resultado rápido.",
				},
				{ type: "protocol5d" },
				{ type: "faq" },
				{ type: "closing" },
			],
		},
		en: {
			meta: {
				title: "AI partner for companies",
				description:
					"An AI engineer inside your team, month by month. Start with a free 6-hour assessment, with no cost or commitment.",
			},
			sections: [
				{
					type: "hero",
					eyebrow: "AI partner for companies",
					title: "An [[AI]] engineer\ninside your team,\nmonth by month.",
					lede: "We set the priority, build with weekly deliveries and integrate AI with your systems.",
					note: "No cost, no commitment.",
					secondary: { label: "See the method", href: "#metodo" },
					diagram: {
						kind: "orbit",
						nodes: [
							"Operations",
							"Sales",
							"Finance",
							"Support",
							"Data",
							"Management",
						],
					},
					stats: [
						{ value: "Monthly", label: "Inside your team" },
						{ value: "Weekly", label: "Deliveries that work" },
						{ value: "6 h", label: "Free assessment" },
					],
				},
				{
					type: "problem",
					label: "01. The problem",
					title: "Standalone AI tools\nsolve [[standalone tasks]].",
					cards: [
						"Team hours lost to repetitive tasks.",
						"Systems that don't talk to each other.",
						"You want AI without a long project.",
						"No defined use case.",
					],
					panelLabel: "What sets us apart",
					panel:
						"An AI tool on top of a badly designed process won't fix it. First we analyse how your company works.",
				},
				{
					type: "how",
					label: "02. How we work",
					title: "An engineer who\nworks from the inside.",
					steps: [
						{
							title: "We define",
							text: "We choose the case with the highest return.",
						},
						{
							title: "We build",
							text: "Weekly deliveries with something working.",
						},
						{
							title: "We integrate",
							text: "We connect with your systems and data.",
						},
						{
							title: "We operate",
							text: "Month by month, and we train your team.",
						},
					],
				},
				{
					type: "deliverables",
					variant: "cards",
					label: "03. What you get",
					title: "What you get¶with [[Destra]].",
					cards: [
						"Fewer hours on repetitive tasks.",
						"AI connected to your systems and data.",
						"An engineer inside your team.",
					],
					panelLabel: "The free assessment",
					panel:
						"A 1-hour meeting, 5 hours of analysis and a report with a map of your operations and 4 quick-win automations.",
				},
				{ type: "protocol5d" },
				{ type: "faq" },
				{ type: "closing" },
			],
		},
	},
});
