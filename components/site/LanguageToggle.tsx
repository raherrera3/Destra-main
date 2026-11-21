"use client";
import { usePathname } from "next/navigation";
import { useLocale } from "./LocaleProvider";
export default function LanguageToggle({
	onChange,
}: { onChange?: () => void }) {
	const { locale, copy } = useLocale();
	// Conserva la página actual al cambiar de idioma (en la home queda vacío).
	const rest = (usePathname() ?? "").replace(/^\/(es|en)(?=\/|$)/, "");
	return (
		<div className="language-toggle" aria-label={copy.header.language}>
			{(["en", "es"] as const).map((item) => (
				// Enlace real a la otra versión: los rastreadores también lo siguen.
				<a
					key={item}
					href={`/${item}${rest}`}
					hrefLang={item}
					lang={item}
					aria-current={locale === item ? "page" : undefined}
					onClick={onChange}
				>
					<span className="language-toggle__flag" aria-hidden="true">
						{item === "es" ? "🇪🇸" : "🇬🇧"}
					</span>
					{item.toUpperCase()}
				</a>
			))}
		</div>
	);
}
