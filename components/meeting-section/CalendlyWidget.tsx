"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const InlineWidget = dynamic(
	() => import("react-calendly").then((module) => module.InlineWidget),
	{
		ssr: false,
		loading: () => (
			<div className="calendly-loading" aria-live="polite">
				Cargando agenda…
			</div>
		),
	},
);

export default function CalendlyWidget(
	props: ComponentProps<typeof InlineWidget>,
) {
	return (
		<div className="calendly-shell">
			<InlineWidget
				styles={{ width: "100%", height: 690 }}
				pageSettings={{
					backgroundColor: "ffffff",
					hideEventTypeDetails: false,
					textColor: "071225",
					primaryColor: "0a5bff",
				}}
				{...props}
			/>
		</div>
	);
}
