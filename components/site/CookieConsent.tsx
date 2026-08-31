"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createContext, useContext } from "react";
import { useLocale } from "./LocaleProvider";

type Consent = "unknown" | "accepted" | "rejected";

type CookieConsentContextValue = {
	shouldShowBanner: boolean;
	isInitialized: boolean;
	preferencesOpen: boolean;
	accept: () => void;
	reject: () => void;
	openPreferences: () => void;
	closePreferences: () => void;
};

const STORAGE_KEY = "destra-cookie-consent-v1";

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
	null,
);

export function CookieConsentProvider({
	children,
}: { children: React.ReactNode }) {
	const [consent, setConsent] = useState<Consent>("unknown");
	const [isInitialized, setIsInitialized] = useState(false);
	const [preferencesOpen, setPreferencesOpen] = useState(false);

	useEffect(() => {
		try {
			const stored = window.localStorage.getItem(STORAGE_KEY);
			if (stored === "accepted" || stored === "rejected") setConsent(stored);
		} catch {
			// If storage is unavailable, keep the conservative no-consent state.
		} finally {
			setIsInitialized(true);
		}
	}, []);

	const saveConsent = useCallback(
		(nextConsent: Exclude<Consent, "unknown">) => {
			try {
				window.localStorage.setItem(STORAGE_KEY, nextConsent);
			} catch {
				// The current visit still honours the selection when storage is blocked.
			}
			setConsent(nextConsent);
			setPreferencesOpen(false);
		},
		[],
	);
	const accept = useCallback(() => saveConsent("accepted"), [saveConsent]);
	const reject = useCallback(() => saveConsent("rejected"), [saveConsent]);
	const openPreferences = useCallback(() => setPreferencesOpen(true), []);
	const closePreferences = useCallback(() => setPreferencesOpen(false), []);

	return (
		<CookieConsentContext.Provider
			value={{
				shouldShowBanner: consent === "unknown",
				isInitialized,
				preferencesOpen,
				accept,
				reject,
				openPreferences,
				closePreferences,
			}}
		>
			{children}
		</CookieConsentContext.Provider>
	);
}

export function useCookieConsent() {
	const context = useContext(CookieConsentContext);
	if (!context)
		throw new Error(
			"useCookieConsent must be used within CookieConsentProvider",
		);
	return context;
}

export default function CookieConsentBanner() {
	const { copy } = useLocale();
	const {
		isInitialized,
		preferencesOpen,
		shouldShowBanner,
		accept,
		reject,
		openPreferences,
		closePreferences,
	} = useCookieConsent();
	const dialog = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		if (!preferencesOpen) return;
		const modal = dialog.current;
		if (modal && !modal.open) modal.showModal();
		modal?.focus();
		const closeOnEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") closePreferences();
		};
		document.addEventListener("keydown", closeOnEscape);
		return () => {
			document.removeEventListener("keydown", closeOnEscape);
			if (modal?.open) modal.close();
		};
	}, [closePreferences, preferencesOpen]);

	if (!isInitialized) return null;

	return (
		<>
			{shouldShowBanner && !preferencesOpen && (
				<section className="cookie-banner" aria-label={copy.cookies.title}>
					<div>
						<strong>{copy.cookies.title}</strong>
						<p>
							{copy.cookies.description}{" "}
							<Link href="/privacidad#cookies">{copy.cookies.privacyLink}</Link>
						</p>
					</div>
					<div className="cookie-banner__actions">
						<button
							className="button button--secondary"
							type="button"
							onClick={reject}
						>
							{copy.cookies.reject}
						</button>
						<button
							className="button button--secondary"
							type="button"
							onClick={openPreferences}
						>
							{copy.cookies.configure}
						</button>
						<button
							className="button button--primary"
							type="button"
							onClick={accept}
						>
							{copy.cookies.accept}
						</button>
					</div>
				</section>
			)}
			{preferencesOpen && (
				<div className="cookie-dialog-backdrop">
					<dialog
						className="cookie-dialog"
						aria-modal="true"
						aria-labelledby="cookie-dialog-title"
						tabIndex={-1}
						ref={dialog}
					>
						<div className="cookie-dialog__heading">
							<div>
								<h2 id="cookie-dialog-title">{copy.cookies.configure}</h2>
								<p>{copy.cookies.description}</p>
							</div>
							<button
								className="cookie-dialog__close"
								type="button"
								onClick={closePreferences}
								aria-label={copy.cookies.close}
							>
								×
							</button>
						</div>
						<div className="cookie-option">
							<div>
								<strong>{copy.cookies.necessaryTitle}</strong>
								<p>{copy.cookies.necessaryDescription}</p>
							</div>
							<span>{copy.cookies.alwaysOn}</span>
						</div>
						<div className="cookie-dialog__actions">
							<button
								className="button button--secondary"
								type="button"
								onClick={reject}
							>
								{copy.cookies.reject}
							</button>
							<button
								className="button button--primary"
								type="button"
								onClick={accept}
							>
								{copy.cookies.save}
							</button>
						</div>
					</dialog>
				</div>
			)}
		</>
	);
}
