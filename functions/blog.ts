import type { PagesFunction } from "@cloudflare/workers-types";

const endpointDomain = "https://api.nogisoft.work";

type MainParm = "edit" | "blog";
export type ArticleStructure = {
	PostId?: number;
	postId?: number;
	Timestamp: number;
	Tags: string;
	Creator: string;
	Title: string;
	Body: string;
	Location: string;
};

export const onRequest: PagesFunction = async (context) => {
	const ua = context.request.headers.get("User-Agent") ?? "";
	const isBot =
		/discordbot|twitterbot|facebookexternalhit|slack|telegram/i.test(ua);

	if (!isBot) {
		// redirect to the spa root, spa handles routing
		const origin = new URL(context.request.url).origin;
		return Response.redirect(origin, 302);
	}

	const requestUrl: string = context.request.url;
	const url = new URL(requestUrl);
	const section = url.pathname.split("/").pop() as MainParm;

	let htmlRes = `<!DOCTYPE html>
		<html>
		<head>
			<meta property="og:title" content="nogc's blog" />
			<meta property="og:description" content="larper @ work, take a lokk rok somethign idk XDD" />
			<meta property="og:site_name" content="nogc's site" />
			<meta property="og:image" content="https://blog.nogisoft.work/static/whoisthis.png" />
			<meta property="og:url" content="https://blog.nogisoft.work" />
			<meta name="theme-color" content="#d49742" />
			<title>nogc's blog</title>
		</head>
		<body>
		</body>
		</html>
	`;

	if (section !== "blog")
		return new Response(htmlRes, { headers: { "Content-Type": "text/html" } });

	const args = url.search.split("?").pop();
	if (!args)
		return new Response(htmlRes, { headers: { "Content-Type": "text/html" } });

	const [key, id] = args.split("=");

	if (key !== "postId")
		return new Response(htmlRes, { headers: { "Content-Type": "text/html" } });
	if (isNaN(Number(id)) || Number(id) < 1)
		return new Response(htmlRes, { headers: { "Content-Type": "text/html" } });

	const article = (await getArticles(Number(id))) ?? false;
	if (!article)
		return new Response(htmlRes, { headers: { "Content-Type": "text/html" } });
	const postData = article[0];

	const author = postData.Creator;
	const creationTimestamp = postData.Timestamp;
	const dateObj = new Date(creationTimestamp * 1000);
	const isoDate = dateObj.toISOString();
	const readableDate = dateObj.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
	const title = postData.Title.slice(0, 256) + "...";
	const stripMarkdown = (md: string) =>
		md
			.replace(/!\[[^\]]*\]\([^)]+\)/g, "") // images
			.replace(/\[[^\]]*\]\([^)]+\)/g, "$1") // links to text
			.replace(/[#*_~>`|\-]{1,3}/g, "") // headers, bold, italic, strikethrough, code, blockquotes
			.replace(/\n{3,}/g, "  ") // collapse 3+ newlines into 3 spaces
			.replace(/^\s+|\s+$/gm, "") // trim each line
			.split("\n")
			.map((line) => line.replace(/\s+/g, " "))
			.join("\n")
			.trim();

	const body = stripMarkdown(postData.Body).slice(0, 256) + "...";
	const bodyForMeta = body.replace(/\n/g, "&#10;");
	// const tags = postData.Tags;
	const hasImage = (blogBody: string) => {
		// regex to find cdn img urls, then use the first one
		// also use placeholder if none
		const imageRegex =
			/https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg|avif|bmp|tiff)(?:\?[^\s]*)?/gi;
		const matches = blogBody.match(imageRegex);
		if (matches && matches.length > 0) {
			return matches[0];
		}
		return "https://blog.nogisoft.work/static/whoisthis.png";
	};

	htmlRes = `<!DOCTYPE html>
		<html>
		<head>
			<meta property="og:title" content="${title}" />
			<meta property="og:description" content="${bodyForMeta}" />
			<meta property="og:site_name" content="nogc's site" />
			<meta property="article:author" content="${author}" />
			<meta property="article:published_time" content="${isoDate}" />
			<meta property="og:image" content="${hasImage(postData.Body)}" />
			<meta property="og:url" content="https://blog.nogisoft.work" />
			<meta name="theme-color" content="#d49742" />
			<title>${title}</title>
		</head>
		<body>
			<p>${author} &middot; ${readableDate}</p>
			<p>${body.replace(/\n/g, "<br>")}</p>
		</body>
		</html>
	`;

	return new Response(htmlRes, {
		headers: {
			"Content-Type": "text/html",
		},
	});
};

export async function getArticles(
	postId?: number,
	tags?: string,
): Promise<Array<ArticleStructure> | false> {
	console.log(
		`${endpointDomain}/personal/blog/json?${postId ? "&postId=" + postId : ""}${tags ? "&tags=" + tags : ""}`,
	);
	const response = await fetch(
		`${endpointDomain}/personal/blog/json?${postId ? "&postId=" + postId : ""}${tags ? "&tags=" + tags : ""}`,
	);
	if (response.ok) return JSON.parse(await response.text());
	else return false;
}
