"use client";
import { useLocale } from "./LocaleProvider";
export default function LanguageToggle({
	onChange,
}: { onChange?: () => void }) {
	const { locale, setLocale, copy } = useLocale();
	return (
		<div className="language-toggle" aria-label={copy.header.language}>
			{(["es", "en"] as const).map((item) => (
				<button
					type="button"
					key={item}
					aria-pressed={locale === item}
					onClick={() => {
						setLocale(item);
						onChange?.();
					}}
				>
					{item.toUpperCase()}
				</button>
			))}
		</div>
	);
}
