import { treaty } from "@elysiajs/eden";
import type { App } from "../app/api/[[...slugs]]/route";

const domain = process.env.NEXT_PUBLIC_API_URL || "localhost:3000";
const url = domain.startsWith("http") ? domain : `https://${domain}`;

export const client = treaty<App>(
	process.env.NODE_ENV === "development" ? "http://localhost:3000" : url,
).api;
