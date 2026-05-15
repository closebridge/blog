import type { PagesFunction } from "@cloudflare/workers-types";

const siteURL = "https://blog.nogisoft.work";
const apiURL = "https://api.nogisoft.work";
const defaultImg = `${siteURL}/static/whoisthis.png`;

interface ArticlePage {
	PostId?: number;
	Title: string;
	Timestamp: number;
	Tags: string;
	Creator: string;
	Body: string;
	Location: string;
}

interface RenderArguments {
	pageType: "home" | "article";
	articleContent: ArticlePage | null;
}

// @ts-ignore: onrequest still being clingly
export const onRequest: PagesFunction = async (context) => {
	const { request } = context;
	const url = new URL(request.url);

	const isLegacyBrowser = (): boolean | null => {
		// ts determines if browser should recieve modern content/dom structure

		const browserHeader = context.request.headers.get("user-agent") ?? false;
		if (!browserHeader) return null;

		const oldBrowserMatch = [
			"msie 5.",
			"msie 4.",
			"mac_powerpc",
			"macintosh; i; ppc",
			"netscape6/",
			"netscape/7.",
			"cyberdog",
			"mosaic/",
		];

		const matchesToken =
			oldBrowserMatch.some((token) => browserHeader.includes(token)) &&
			/^mozilla\/[1-4]\./i.test(browserHeader.toLowerCase())
				? true
				: false;

		return matchesToken;
	};

	return new Response("hello", { status: 200 });
};

function symbolEncode(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}
