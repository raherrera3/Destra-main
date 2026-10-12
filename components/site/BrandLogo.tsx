"use client";
import { useId } from "react";

export default function BrandLogo() {
	return <span className="brand-logo" role="img" aria-label="DESTRA" />;
}

// Isotipo del manual (Logo Blanco ISO Azul.svg). Con degradado DESTRA sobre
// fondos oscuros; con `solid`, del color del texto, como pide la página
// «Fondos» del manual sobre Azul Eléctrico, Profundo y Cielo.
export function Isotipo({
	className,
	solid = false,
}: { className?: string; solid?: boolean }) {
	const id = useId();
	const fill = solid ? "currentColor" : `url(#${id})`;
	return (
		<svg
			className={className}
			viewBox="35 97 113 133"
			aria-hidden="true"
			focusable="false"
		>
			{!solid && (
				<defs>
					<linearGradient
						id={id}
						x1="35.7"
						y1="0"
						x2="147.75"
						y2="0"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0" stopColor="#051062" />
						<stop offset=".3" stopColor="#002fc1" />
						<stop offset=".7" stopColor="#67b4fe" />
						<stop offset="1" stopColor="#c2e4fd" />
					</linearGradient>
				</defs>
			)}
			<path fill={fill} d="M147.61,161.75c.34.36.03.91-.5.88l-43.27-2.47c-2.02-.12-4.05-.38-5.98-.96-.01,0-.02,0-.03-.01-1.09-.32-2.14-.67-3.16-1.05-3.18-1.2-5.95-3.11-8.16-5.47l-6.5-6.96-44.24-47.33c-.16-.18-.02-.44.24-.43l48.95,2.8c3.79.22,7.34,1.82,9.78,4.44l52.88,56.56Z" />
			<path fill={fill} d="M147.61,166.75c.34-.37.03-.91-.5-.88l-43.26,2.68c-2.02.13-4.05.4-5.98.98-.01,0-.02,0-.03.01-1.09.32-2.14.68-3.15,1.07-3.17,1.21-5.94,3.13-8.14,5.51l-6.47,6.99-44.01,47.54c-.16.18-.01.44.24.42l48.93-3.03c3.79-.24,7.33-1.86,9.76-4.49l52.61-56.81Z" />
		</svg>
	);
}
