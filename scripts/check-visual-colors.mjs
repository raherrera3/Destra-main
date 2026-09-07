import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const palette = new Set(["002fc1", "051062", "fffbf9", "000000"]);
const paletteRgb = new Set([
	"0,47,193",
	"5,16,98",
	"255,251,249",
	"0,0,0",
]);
const allowedNames = new Set(["black", "transparent", "currentcolor"]);
const cssColorNames = [
	"aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige",
	"bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown",
	"burlywood", "cadetblue", "chartreuse", "chocolate", "coral",
	"cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan",
	"darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki",
	"darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred",
	"darksalmon", "darkseagreen", "darkslateblue", "darkslategray",
	"darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue",
	"dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite",
	"forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod",
	"gray", "green", "greenyellow", "grey", "honeydew", "hotpink",
	"indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush",
	"lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan",
	"lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey", "lightpink",
	"lightsalmon", "lightseagreen", "lightskyblue", "lightslategray",
	"lightslategrey", "lightsteelblue", "lightyellow", "lime", "limegreen",
	"linen", "magenta", "maroon", "mediumaquamarine", "mediumblue",
	"mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue",
	"mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue",
	"mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace",
	"olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod",
	"palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff",
	"peru", "pink", "plum", "powderblue", "purple", "rebeccapurple", "red",
	"rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown",
	"seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue",
	"slategray", "slategrey", "snow", "springgreen", "steelblue", "tan",
	"teal", "thistle", "tomato", "transparent", "turquoise", "violet",
	"wheat", "white", "whitesmoke", "yellow", "yellowgreen", "currentcolor",
];
const namedColors = new RegExp(
	`(?<![-\\w])(${cssColorNames.join("|")})(?![-\\w])`,
	"gi",
);
const systemColors =
	/(?<![-\w])(accentcolor|accentcolortext|activetext|buttonborder|buttonface|buttontext|canvas|canvastext|field|fieldtext|graytext|highlight|highlighttext|linktext|mark|marktext|selecteditem|selecteditemtext|visitedtext)(?![-\w])/gi;
const colorFunctions = /\b(?:rgb|rgba|hsl|hsla)\([^)]*\)/gi;
const hexColors = /#[\da-f]{3,8}\b/gi;
const extensions = new Set([
	".css",
	".ts",
	".tsx",
	".js",
	".jsx",
	".mjs",
	".svg",
]);

async function sourceFiles(path) {
	const entries = await readdir(path, { withFileTypes: true });
	const files = await Promise.all(
		entries.map((entry) => {
			const child = join(path, entry.name);
			return entry.isDirectory()
				? sourceFiles(child)
				: extensions.has(extname(child))
					? [child]
					: [];
		}),
	);
	return files.flat();
}

function normalizeHex(literal) {
	const value = literal.slice(1).toLowerCase();
	if (value.length === 3 || value.length === 4)
		return value
			.slice(0, 3)
			.split("")
			.map((digit) => digit.repeat(2))
			.join("");
	return value.slice(0, 6);
}

function validFunction(literal) {
	if (/^hsla?/i.test(literal)) return false;
	const values = literal.match(/[\d.]+/g);
	return (
		!!values &&
		values.length >= 3 &&
		paletteRgb.has(values.slice(0, 3).join(","))
	);
}

const files = [
	...(await sourceFiles("app")),
	...(await sourceFiles("components")),
	...(await sourceFiles("public")),
	"tailwind.config.ts",
].sort();
const invalid = [];
let count = 0;

for (const file of files) {
	const source = (await readFile(file, "utf8")).replace(
		/\/\*[\s\S]*?\*\//g,
		(comment) => comment.replace(/[^\n]/g, " "),
	);
	const lines = source.split("\n");
	for (const [index, line] of lines.entries()) {
		const scanNamedColors = file.endsWith(".css") || file.endsWith(".svg") ||
			/\b(?:color|background|border|outline|shadow|fill|stroke|decoration|gradient|ring)\b\s*[:=]/i.test(line) ||
			/["'`]\s*(?:bg|text|border|outline|shadow|fill|stroke|ring|decoration|from|via|to)-/i.test(line);
		const valueSource = line.includes(":")
			? line.slice(line.indexOf(":") + 1)
			: "";
		const literals = [
			...(line.match(hexColors) ?? []),
			...(line.match(colorFunctions) ?? []),
			...(scanNamedColors ? (line.match(namedColors) ?? []) : []),
			...(scanNamedColors ? (valueSource.match(systemColors) ?? []) : []),
		];
		for (const literal of literals) {
			count += 1;
			const lower = literal.toLowerCase();
			const valid = literal.startsWith("#")
				? palette.has(normalizeHex(literal))
				: /^(?:rgb|rgba)/i.test(literal)
					? validFunction(literal)
					: allowedNames.has(lower);
			console.log(
				`${relative(".", file)}:${index + 1} ${literal}${valid ? "" : "  INVALID"}`,
			);
			if (!valid) invalid.push(`${file}:${index + 1} ${literal}`);
		}
	}
}

if (invalid.length) {
	console.error(
		`\n${invalid.length} color literal(s) outside the DESTRA palette.`,
	);
	process.exit(1);
}

console.log(
	`\nOK: ${count} literals; all use the DESTRA palette or an allowed keyword.`,
);
