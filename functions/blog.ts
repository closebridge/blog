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

function esc(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

const siteURL = "https://blog.nogisoft.work";
const defaultImg = `${siteURL}/static/whoisthis.png`;

function defaultPage(
	title: string,
	desc: string,
	img: string,
	url: string,
): string {
	return `<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8" />
			<meta property="og:type" content="website" />
			<meta property="og:title" content="${esc(title)}" />
			<meta property="og:description" content="${esc(desc)}" />
			<meta property="og:site_name" content="nogc's site" />
			<meta property="og:image" content="${img}" />
			<meta property="og:url" content="${url}" />
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content="${esc(title)}" />
			<meta name="twitter:description" content="${esc(desc)}" />
			<meta name="twitter:image" content="${img}" />
			<meta name="theme-color" content="#d49742" />
			<title>${esc(title)}</title>
		</head>
		<body>
		</body>
		</html>
	`;
}

export const onRequest: PagesFunction = async (context) => {
	const ua = context.request.headers.get("User-Agent") ?? "";
	const isBot =
		/discordbot|twitterbot|facebookexternalhit|slack|telegram/i.test(ua);

	if (!isBot) {
		return context.next();
	}

	const requestUrl: string = context.request.url;
	const url = new URL(requestUrl);
	const section = url.pathname.split("/").pop() as MainParm;

	const fallbackHtml = defaultPage(
		"nogc's blog",
		"larper @ work, take a lokk rok somethign idk XDD",
		defaultImg,
		siteURL,
	);

	if (section !== "blog") {
		return new Response(fallbackHtml, {
			headers: { "Content-Type": "text/html; charset=utf-8" },
		});
	}

	const args = url.search.split("?").pop();
	if (!args) {
		return new Response(fallbackHtml, {
			headers: { "Content-Type": "text/html; charset=utf-8" },
		});
	}

	const [key, id] = args.split("=");

	if (key !== "postId") {
		return new Response(fallbackHtml, {
			headers: { "Content-Type": "text/html; charset=utf-8" },
		});
	}
	if (isNaN(Number(id)) || Number(id) < 1) {
		return new Response(fallbackHtml, {
			headers: { "Content-Type": "text/html; charset=utf-8" },
		});
	}

	const article = (await getArticles(Number(id))) ?? false;
	if (!article) {
		return new Response(fallbackHtml, {
			headers: { "Content-Type": "text/html; charset=utf-8" },
		});
	}
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

	const title =
		postData.Title.length > 256
			? postData.Title.slice(0, 253) + "..."
			: postData.Title;

	const stripMarkdown = (md: string) =>
		md
			.replace(/\\n/g, "\n") // handle literal \n (backslash-n) from api
			.replace(/!\[[^\]]*\]\([^)]+\)/g, "") // images
			.replace(/\[([^\]]*)\]\([^)]+\)/g, "$1") // links → text only
			.replace(/[#*_~>`|\-]{1,3}/g, "") // formatting chars
			.replace(/\n\n+/g, " ") // paragraph breaks → space
			.replace(/\n/g, " ") // remaining newlines → space
			.replace(/\s{2,}/g, " ") // collapse whitespace
			.trim();

	const body = stripMarkdown(postData.Body);
	const bodyTruncated = body.length > 256 ? body.slice(0, 253) + "..." : body;

	const findImage = (blogBody: string) => {
		const imageRegex =
			/https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg|avif|bmp|tiff)(?:\?[^\s]*)?/gi;
		const matches = blogBody.match(imageRegex);
		return matches?.[0] ?? defaultImg;
	};

	const image = findImage(postData.Body);
	const postId = postData.PostId ?? postData.postId;
	const postUrl = `${siteURL}/blog?postId=${postId}`;

	const htmlRes = `<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8" />
			<!-- Open Graph -->
			<meta property="og:type" content="article" />
			<meta property="og:title" content="${esc(title)}" />
			<meta property="og:description" content="${esc(bodyTruncated)}" />
			<meta property="og:site_name" content="nogc's site" />
			<meta property="og:image" content="${image}" />
			<meta property="og:url" content="${postUrl}" />
			<!-- Article -->
			<meta property="article:published_time" content="${isoDate}" />
			<meta property="article:author" content="${siteURL}/about" />
			<!-- Twitter -->
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:site" content="@nogisoft" />
			<meta name="twitter:creator" content="@${esc(author)}" />
			<meta name="twitter:title" content="${esc(title)}" />
			<meta name="twitter:description" content="${esc(bodyTruncated)}" />
			<meta name="twitter:image" content="${image}" />
			<meta name="theme-color" content="#d49742" />
			<title>${esc(title)}</title>
		</head>
		<body>
			<article>
				<p>${esc(author)} &middot; ${readableDate}</p>
				<p>${bodyTruncated}</p>
			</body>
		</article>
		</html>
	`;

	return new Response(htmlRes, {
		headers: {
			"Content-Type": "text/html; charset=utf-8",
		},
	});
};

export async function getArticles(
	postId?: number,
	tags?: string,
): Promise<Array<ArticleStructure> | false> {
	const params = new URLSearchParams();
	if (postId) params.set("postId", String(postId));
	if (tags) params.set("tags", tags);
	const qs = params.toString();

	console.log(`${endpointDomain}/personal/blog/json?${qs}`);
	const response = await fetch(`${endpointDomain}/personal/blog/json?${qs}`);

	if (response.ok) return (await response.json()) as ArticleStructure[];
	else return false;
}
