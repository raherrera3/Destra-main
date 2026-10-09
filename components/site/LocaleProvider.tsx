"use client";
import { createContext, useContext } from "react";
import { type Locale, siteCopy } from "./siteCopy";
const LocaleContext = createContext<{
	locale: Locale;
	copy: typeof siteCopy.es;
} | null>(null);
// El idioma lo fija la URL (/es, /en), no el navegador.
export function LocaleProvider({
	locale,
	children,
}: { locale: Locale; children: React.ReactNode }) {
	return (
		<LocaleContext.Provider value={{ locale, copy: siteCopy[locale] }}>
			{children}
		</LocaleContext.Provider>
	);
}
export function useLocale() {
	const context = useContext(LocaleContext);
	if (!context) throw new Error("useLocale must be used within LocaleProvider");
	return context;
}
