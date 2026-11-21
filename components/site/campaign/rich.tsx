import { Fragment, type ReactNode } from "react";

/**
 * Texto con marcas:
 *   [[texto]]  palabra destacada
 *   \n         salto de línea
 *   ¶          salto solo en escritorio
 * Los saltos llevan un espacio delante: en móvil campaign.css los oculta en los
 * titulares y las palabras no deben quedar pegadas.
 */
export function rich(text: string): ReactNode {
	return text
		.split(/(\[\[.+?\]\]|\n|¶)/g)
		.filter(Boolean)
		.map((part, index) => {
			const key = `${index}-${part}`;
			if (part === "\n" || part === "¶")
				return (
					<Fragment key={key}>
						{" "}
						<br className={part === "¶" ? "campaign-br" : undefined} />
					</Fragment>
				);
			const accent = part.match(/^\[\[(.+)\]\]$/);
			if (accent)
				return (
					<span className="accent-text" key={key}>
						{accent[1]}
					</span>
				);
			return <Fragment key={key}>{part}</Fragment>;
		});
}
