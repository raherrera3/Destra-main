"use client";
import { useLocale } from "./LocaleProvider";
export default function LanguageToggle({
	onChange,
}: { onChange?: () => void }) {
	const { locale, setLocale, copy } = useLocale();
	return (
		<div className="language-toggle" aria-label={copy.header.language}>
			{(["en", "es"] as const).map((item) => (
				<button
					type="button"
					key={item}
					aria-pressed={locale === item}
					onClick={() => {
						setLocale(item);
						onChange?.();
					}}
				>
					<span className="language-toggle__flag" aria-hidden="true">
						{item === "es" ? "🇪🇸" : "🇬🇧"}
					</span>
					{item.toUpperCase()}
				</button>
			))}
		</div>
	);
}
