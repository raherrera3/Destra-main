"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { type Locale, locales, siteCopy } from "./siteCopy";
const LocaleContext = createContext<{
	locale: Locale;
	copy: typeof siteCopy.es;
	setLocale: (locale: Locale) => void;
} | null>(null);
export function LocaleProvider({ children }: { children: React.ReactNode }) {
	const [locale, setLocaleState] = useState<Locale>("es");
	useEffect(() => {
		const value = localStorage.getItem("destra-locale");
		if (value && locales.includes(value as Locale))
			setLocaleState(value as Locale);
	}, []);
	useEffect(() => {
		document.documentElement.lang = locale;
		document.documentElement.dir = "ltr";
	}, [locale]);
	const value = useMemo(
		() => ({
			locale,
			copy: siteCopy[locale],
			setLocale: (next: Locale) => {
				localStorage.setItem("destra-locale", next);
				setLocaleState(next);
			},
		}),
		[locale],
	);
	return (
		<LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
	);
}
export function useLocale() {
	const context = useContext(LocaleContext);
	if (!context) throw new Error("useLocale must be used within LocaleProvider");
	return context;
}
