import type { Locale } from "../../siteCopy";
import type { CampaignCommon } from "./types";

// Textos compartidos por las landings. La respuesta de integración es la que ya
// publica la home. El inglés es provisional, pendiente de revisar por DESTRA.
export const campaignCommon: Record<Locale, CampaignCommon> = {
	es: {
		nav: [
			{ label: "Método", href: "#metodo" },
			{ label: "Qué recibes", href: "#que-recibes" },
			{ label: "Preguntas", href: "#preguntas" },
		],
		navCta: "Solicita el diagnóstico",
		cta: "Solicita el diagnóstico gratuito de 6 horas",
		protocol: {
			label: "Protocolo 5D",
			title: "Antes de automatizar,\n[[mejoramos]] el proceso.",
			sub: "Cinco pasos y un orden. Automatizar es lo último.",
			trackA: "Mejorar el proceso",
			trackB: "Automatizar",
			steps: [
				{ n: "Paso 01", title: "Depurar", text: "Cuestionar requisitos" },
				{ n: "Paso 02", title: "Descartar", text: "Eliminar pasos" },
				{ n: "Paso 03", title: "Destilar", text: "Simplificar lo que queda" },
				{ n: "Paso 04", title: "Disparar", text: "Acelerar el proceso" },
				{
					n: "Paso 05",
					title: "Delegar",
					text: "Automatizar, al final",
					final: true,
				},
			],
			ruleLabel: "Principio rector",
			rule: "Lo que no existe [[no cuesta]], [[no falla]] y no hay que mantener.",
		},
		faq: {
			label: "04. Preguntas frecuentes",
			title: "Lo que suelen¶[[preguntarnos]].",
			items: [
				{
					q: "¿Tiene algún coste el diagnóstico?",
					a: "No. El diagnóstico de 6 horas es gratuito y sin compromiso.",
				},
				{
					q: "¿Hace falta un caso de uso definido?",
					a: "No. Se puede empezar por un proceso, una necesidad o una restricción. En el diagnóstico elegimos el caso con más retorno.",
				},
				{
					q: "¿Cómo se integra con lo que usamos?",
					a: "Revisamos integraciones, permisos y limitaciones antes de proponer una solución.",
				},
				{
					q: "¿Qué pasa con nuestros datos?",
					a: "Se tratan en zona controlada de la UE y lo revisamos contigo.",
				},
			],
		},
		closing: "IA [[útil]], [[integrada]] y [[gobernada]].",
		form: {
			title: "Solicita el diagnóstico gratuito",
			lead: "Cuéntanos tu caso y te responderemos con el siguiente paso.",
			open: "Abrir formulario",
			submit: "Solicitar diagnóstico gratuito",
		},
	},
	en: {
		nav: [
			{ label: "Method", href: "#metodo" },
			{ label: "What you get", href: "#que-recibes" },
			{ label: "FAQ", href: "#preguntas" },
		],
		navCta: "Request assessment",
		cta: "Request your free 6-hour assessment",
		protocol: {
			label: "5D Protocol",
			title: "Before automating,\nwe [[improve]] the process.",
			sub: "Five steps, one order. Automation comes last.",
			trackA: "Improve the process",
			trackB: "Automate",
			steps: [
				{ n: "Step 01", title: "Debug", text: "Question the requirements" },
				{ n: "Step 02", title: "Discard", text: "Remove steps" },
				{ n: "Step 03", title: "Distill", text: "Simplify what remains" },
				{ n: "Step 04", title: "Drive", text: "Speed up the process" },
				{
					n: "Step 05",
					title: "Delegate",
					text: "Automate, at the end",
					final: true,
				},
			],
			ruleLabel: "Guiding principle",
			rule: "What doesn't exist [[costs nothing]], [[never fails]] and needs no maintenance.",
		},
		faq: {
			label: "04. Frequently asked questions",
			title: "What people¶usually [[ask us]].",
			items: [
				{
					q: "Does the assessment cost anything?",
					a: "No. The 6-hour assessment is free and with no commitment.",
				},
				{
					q: "Do we need a defined use case?",
					a: "No. You can start from a process, a need or a constraint. During the assessment we choose the case with the highest return.",
				},
				{
					q: "How does it integrate with our tools?",
					a: "We review integrations, permissions and constraints before proposing a solution.",
				},
				{
					q: "What happens to our data?",
					a: "It is handled in a controlled EU zone, and we review it with you.",
				},
			],
		},
		closing: "[[Useful]], [[integrated]], [[governed]] AI.",
		form: {
			title: "Request your free assessment",
			lead: "Tell us about your case and we'll reply with the next step.",
			open: "Open contact form",
			submit: "Request free assessment",
		},
	},
};
