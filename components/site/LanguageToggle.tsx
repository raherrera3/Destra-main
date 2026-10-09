"use client";
import { useLocale } from "./LocaleProvider";
export default function LanguageToggle({
	onChange,
}: { onChange?: () => void }) {
	const { locale, copy } = useLocale();
	return (
		<div className="language-toggle" aria-label={copy.header.language}>
			{(["en", "es"] as const).map((item) => (
				// Enlace real a la otra versión: los rastreadores también lo siguen.
				<a
					key={item}
					href={`/${item}`}
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
