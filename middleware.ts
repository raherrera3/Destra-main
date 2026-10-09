import { type NextRequest, NextResponse } from "next/server";

// Idioma preferido según Accept-Language ("en-GB,en;q=0.9,es;q=0.8").
// Español por defecto: es el mercado principal y lo que verán los rastreadores,
// que casi nunca envían esta cabecera.
export function preferredLocale(header: string | null): "es" | "en" {
	const ranked = (header ?? "")
		.split(",")
		.map((part) => {
			const [tag, ...params] = part.trim().toLowerCase().split(";");
			const q = params.find((p) => p.trim().startsWith("q="));
			return { lang: tag.split("-")[0], q: q ? Number(q.trim().slice(2)) : 1 };
		})
		.filter((item) => item.q > 0 && (item.lang === "es" || item.lang === "en"))
		.sort((a, b) => b.q - a.q);
	return ranked[0]?.lang === "en" ? "en" : "es";
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const url = request.nextUrl.clone();

	if (pathname === "/") {
		// 307 (temporal): la raíz depende del visitante, no debe cachearse como 301.
		url.pathname = `/${preferredLocale(request.headers.get("accept-language"))}`;
		const response = NextResponse.redirect(url, 307);
		response.headers.set("Vary", "Accept-Language");
		response.headers.set("Cache-Control", "private, no-store");
		return response;
	}

	if (/^\/(es|en)(\/|$)/.test(pathname)) return NextResponse.next();

	// Rutas sin prefijo que no son redirecciones conocidas (next.config.mjs):
	// se sirven como /es/... para mostrar el 404 del sitio con su diseño.
	url.pathname = `/es${pathname}`;
	return NextResponse.rewrite(url);
}

export const config = {
	// Fuera: API, assets de Next, archivos con extensión (robots.txt, llms.txt,
	// sitemap.xml, icon.png...) y la imagen OG.
	matcher: ["/((?!api|_next|opengraph-image|.*\\..*).*)"],
};
