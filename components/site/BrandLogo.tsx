import Image from "next/image";

type BrandLogoProps = {
	/** The surface behind the mark, used to select the matching wordmark. */
	surface: "light" | "dark";
	priority?: boolean;
	sizes: string;
};

export default function BrandLogo({
	surface,
	priority = false,
	sizes,
}: BrandLogoProps) {
	return (
		<Image
			src={
				surface === "dark" ? "/destra-logo-light.png" : "/destra-logo-dark.png"
			}
			alt="DESTRA"
			width={833}
			height={313}
			priority={priority}
			sizes={sizes}
		/>
	);
}
