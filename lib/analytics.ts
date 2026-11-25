// Contenedores de Google cargados en app/[lang]/layout.tsx, con un solo dataLayer:
// - GTM-K6MZDLPT: Google Analytics 4 (G-H4GHGCQZTE).
// - GTM-PCFLL3MK: Google Ads (AW-18520959477), del media buyer de las campañas.
export const gtmIds = ["GTM-K6MZDLPT", "GTM-PCFLL3MK"] as const;

// v2: el consentimiento pasó a cubrir también publicidad (Google Ads), así que
// quien aceptó solo la analítica con la v1 vuelve a ver el banner.
export const consentStorageKey = "destra-cookie-consent-v2";

const adsId = "AW-18520959477";
// Etiqueta de la conversión "lead" en Google Ads (la da el media buyer).
// Sin ella se envía solo generate_lead, que se puede importar desde GA4.
const leadLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL?.trim();

type Params = Record<string, string | number>;

function gtag(...args: unknown[]) {
	try {
		(window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.(...args);
	} catch {
		// La analítica nunca debe romper la página.
	}
}

export function trackEvent(name: string, params: Params = {}) {
	gtag("event", name, params);
}

/** Lead enviado y aceptado por el servidor. Sin datos personales. */
export function trackLead(params: Params) {
	trackEvent("generate_lead", params);
	if (leadLabel) trackEvent("conversion", { send_to: `${adsId}/${leadLabel}` });
}

/** Consent Mode v2: el valor por defecto lo fija el script del layout. */
export function updateConsent(granted: boolean) {
	const value = granted ? "granted" : "denied";
	gtag("consent", "update", {
		analytics_storage: value,
		ad_storage: value,
		ad_user_data: value,
		ad_personalization: value,
	});
}
