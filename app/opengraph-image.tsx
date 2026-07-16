import { ImageResponse } from "next/og";

export const alt = "DESTRA — IA diseñada para operar en tu empresa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
	return new ImageResponse(
		<div
			style={{
				display: "flex",
				height: "100%",
				width: "100%",
				background:
					"radial-gradient(circle at 78% 22%, #dbeafe 0, transparent 28%), linear-gradient(135deg, #f8fbff 0%, #ffffff 58%, #edf5ff 100%)",
				color: "#10245b",
				padding: "82px 96px",
				flexDirection: "column",
				justifyContent: "space-between",
			}}
		>
			<div
				style={{
					display: "flex",
					letterSpacing: "0.14em",
					fontSize: 30,
					fontWeight: 700,
				}}
			>
				DESTRA
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 26,
					maxWidth: 890,
				}}
			>
				<div
					style={{ color: "#2463eb", fontSize: 25, letterSpacing: "0.08em" }}
				>
					PARTNER DE IA PARA ORGANIZACIONES
				</div>
				<div
					style={{
						fontSize: 70,
						lineHeight: 1.08,
						fontWeight: 700,
						letterSpacing: "-0.04em",
					}}
				>
					IA diseñada para operar en tu empresa.
				</div>
			</div>
			<div style={{ display: "flex", color: "#38528e", fontSize: 28 }}>
				Estrategia · Sistemas · Datos · Infraestructura
			</div>
		</div>,
		size,
	);
}
