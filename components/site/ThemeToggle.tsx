"use client";
import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { useLocale } from "./LocaleProvider";

export type Theme = "light" | "dark";

// El tema vive en <html data-theme>, que el script de app/layout.tsx fija antes
// de pintar. Ese atributo es la única fuente de verdad: no hay contexto React.
const subscribe = (notify: () => void) => {
	const observer = new MutationObserver(notify);
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["data-theme"],
	});
	return () => observer.disconnect();
};
const read = (): Theme =>
	document.documentElement.dataset.theme === "light" ? "light" : "dark";

export function useTheme() {
	return useSyncExternalStore(subscribe, read, () => "dark" as Theme);
}

function applyTheme(next: Theme) {
	const set = () => {
		document.documentElement.dataset.theme = next;
		try {
			localStorage.setItem("destra-theme", next);
		} catch {}
	};
	const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	// Fundido cruzado nativo donde existe; en el resto, cambio instantáneo.
	if (!reduced && "startViewTransition" in document) {
		// Con la pestaña oculta el navegador aborta la transición pero sí aplica
		// el cambio; el rechazo de `ready` no es un error real.
		document.startViewTransition(set).ready.catch(() => {});
	}
	else set();
}

export default function ThemeToggle({ onChange }: { onChange?: () => void }) {
	const { copy } = useLocale();
	const theme = useTheme();
	const next: Theme = theme === "dark" ? "light" : "dark";
	const label =
		next === "light" ? copy.header.themeLight : copy.header.themeDark;
	return (
		<button
			type="button"
			className="theme-toggle"
			aria-label={label}
			title={label}
			onClick={() => {
				applyTheme(next);
				onChange?.();
			}}
		>
			<Sun aria-hidden="true" data-icon="sun" />
			<Moon aria-hidden="true" data-icon="moon" />
		</button>
	);
}
