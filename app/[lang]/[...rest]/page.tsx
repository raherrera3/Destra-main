import { notFound } from "next/navigation";

// Cualquier ruta desconocida bajo /es o /en muestra el 404 del sitio.
export default function CatchAll() {
	notFound();
}
