// Logos en public/logos/<slug>.<ext>. Sin `logo`, se muestra el nombre en texto.
const clients: Array<{ name: string; logo?: string }> = [
	{ name: "Engel & Völkers", logo: "engel-volkers.svg" },
	{ name: "Ferlicom", logo: "ferlicom.png" },
	{ name: "CRUGA Rehabilita", logo: "cruga.png" },
	{ name: "Indy", logo: "indy.png" },
	{ name: "Grup Capital", logo: "grup-capital.png" },
	{ name: "Alcosmik", logo: "alcosmik.svg" },
	{ name: "Foimpex", logo: "foimpex.png" },
	{ name: "Larson Martin", logo: "larson-martin.png" },
];

export default function ClientMarquee({ title }: { title: string }) {
	return (
		<div className="clients">
			<p className="clients__title container">{title}</p>
			<div className="marquee">
				<ul className="marquee__track">
					{[...clients, ...clients].map((client, index) => (
						<li
							className="client"
							// biome-ignore lint/suspicious/noArrayIndexKey: lista estática duplicada a propósito para el bucle
							key={index}
							aria-hidden={index >= clients.length || undefined}
						>
							{client.logo ? (
								<img
									src={`/logos/${client.logo}`}
									alt={client.name}
									loading="lazy"
									height="56"
								/>
							) : (
								<span>{client.name}</span>
							)}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
