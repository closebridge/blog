import type { PagesFunction } from "@cloudflare/workers-types";
import * as cheerio from "cheerio";
import { getArticles } from "./shared/getArticles";
import { ArticleStructure } from "./shared/articleStructure";

// tl-dr(review): we got reactjs at home 😭🙏 (i call this "miBomboclatta UI lib 😎")
// SHOULDVE USE SVELTEKIT INSTEAD LMFAO

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
	const urlArgs = new URL(request.url).searchParams;
	const requestedPostId = urlArgs.get("postId");
	const isLegacyBrowser = (): boolean => {
		// ts determines if browser should recieve modern content/dom structure

		const browserHeader = context.request.headers.get("user-agent") ?? false;
		if (!browserHeader) return false;

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
			// oldBrowserMatch.some((token) => browserHeader.includes(token)) &&
			/^mozilla\/[1-4]\./i.test(browserHeader.toLowerCase()) ? true : false;

		return matchesToken;
	};

	if (requestedPostId) {
		// requested for one, in article rn
	} else {
		// empty, basically @ home nav

		const legacyBrowser = isLegacyBrowser();
		console.log("legacyBrowser", legacyBrowser);
		if (legacyBrowser) {
			return new Response(await renderHTML("home", null, legacyBrowser), {
				status: 200,
				headers: { "content-type": "text/html" },
			});
		}

		return new Response(await renderHTML("home", null, legacyBrowser), {
			status: 200,
			headers: { "content-type": "text/html" },
		});
	}
};

function symbolEncode(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

async function renderHTML(
	type: "home" | "article",
	articleContent: ArticlePage | null,
	isLegacyBrowser: boolean = false,
): Promise<string> {
	const baseHTML = `
<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<link rel="icon" type="image/svg+xml" href="/favicon.ico" />

		<link rel="stylesheet" href="/assets/index--nojs.css" />

		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link
			rel="stylesheet"
			href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0"
		/>
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
		<link
			href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap"
			rel="stylesheet"
		/>
		<link
			rel="stylesheet"
			href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0"
		/>

		<!-- Embeds -->
		<meta property="og:title" content="nogc's blog" />
		<meta
			property="og:description"
			content="larper @ work, take a lokk rok somethign idk XDD"
		/>
		<meta
			property="og:image"
			content="https://blog.nogisoft.work/static/whoisthis.png"
		/>
		<meta property="og:url" content="https://blog.nogisoft.work" />
		<meta property="og:image" content="https://blog.nogisoft.work" />
		<meta name="theme-color" content="#d49742" />

		<title>nogc's blog</title>
	</head>
	<body style="background: var(--background)">
	</body>
</html>
		`;

	const html = cheerio.load(baseHTML);
	const htmlTitle = html("head title");
	if (!isLegacyBrowser) {
		html("body").append(
			`<div id="appBody" class="flex flex-col md:items-center justify-center gap-16 my-8 md:mx-0 mx-3 sm:px-4 md:px-20 lg:px-40">`,
		);
	}

	const htmlBody = !isLegacyBrowser ? html("#appBody") : html("body");
	const pageStatus = (await getPageStatus()) ?? {};
	const favoriteArticlesResult = pageStatus.FavoritePostId
		? await getArticles(pageStatus.FavoritePostId)
		: [
				{
					PostId: 0,
					postId: 0,
					Timestamp: 0,
					Tags: "",
					Creator: "",
					Title: "",
					Body: "",
					Location: "",
				},
			];
	const favoriteArticle = Array.isArray(favoriteArticlesResult)
		? favoriteArticlesResult
		: [
				{
					PostId: 0,
					postId: 0,
					Timestamp: 0,
					Tags: "",
					Creator: "",
					Title: "",
					Body: "",
					Location: "",
				},
			];
	const fetchedArticlesResult = await getArticles();
	const fetchedArticles = Array.isArray(fetchedArticlesResult)
		? fetchedArticlesResult
		: [];

	const header = !isLegacyBrowser
		? htmlBody.append(`
			<header
				id="blog-header"
				class="col-span-2 flex flex-row md:justify-evenly justify-start">
				<div class="flex flex-row justify-between items-center">
					<p class="serif text-2xl primary-text bold ml-1/4 md:ml-0">
						nogc @
						<span class="text-(--brand-color) serif bold">
							blog
						</span>
					</p>
					<div class="flex flex-row gap-3 items-center justify-center"></div>
				</div>
				<div class="md:block disabled"></div>
			</header>
		`)
		: htmlBody.append(
				`<table width="100%"><tr><td><font size="6"><b>nogc</b></font><font size="6" color="#d89a2b"><b>@ blog</b></font></td></tr></table>`,
			);
	const latestComment = !isLegacyBrowser
		? htmlBody.append(`
			${renderTitle(1, "my latest comment", isLegacyBrowser)}
			<div class="flex flex-col justify-start">
				<p id="displayed_thought" class="primary-text text-3xl bold serif">
					<span>"</span>
					${!pageStatus.Comment ? pageStatus.Comment : "ehhh..."}
				</p>

				<p id="thought_author" class="secondary-text pb-2">
					<span>-</span>
					${!pageStatus.CommentOwner ? pageStatus.CommentOwner : "nogc"}
					,
					${
						!pageStatus.CommentTimestamp
							? (new Date(pageStatus.CommentTimestamp).getFullYear() ??
								1776432350603)
							: 1776432350603
					}
				</p>

				<div id="special_data ">
					<p class="mono secondary-text text-sm">
						unix timestamp: <span class="mono font-thin">
							${!pageStatus ? pageStatus.CommentTimestamp : 1776432350603}
						</span>
					</p>
					<p class="mono secondary-text text-sm">
						public pgp key:
						<a
							href="/my-pgp-key.txt"
							class="mono font-thin underline text-center"
							>my-pgp-key.txt
							<span
								class="material-symbols-rounded inline"
								style="font-size: 12px">arrow_outward</span
							>
						</a>
					</p>
				</div>
			</div>

	`)
		: htmlBody.append(`
			<br><br>
			${renderTitle(1, "my latest comment", isLegacyBrowser)}
			<table border="0" width="100%" cellpadding="4">
				<tr>
					<td>
						<font size="6"><b>" ${pageStatus.Comment ? pageStatus.Comment : "ehhh..."}</b></font><br />
						<font color="#777777">- ${pageStatus.CommentOwner ? pageStatus.CommentOwner : "nogc"}, ${pageStatus.CommentTimestamp ? new Date(pageStatus.CommentTimestamp).getFullYear() : 2026}</font><br><br>
						<tt>unix timestamp: ${pageStatus.CommentTimestamp ? pageStatus.CommentTimestamp : 1776432350603}</tt><br />
						<tt>public pgp key: <a href="my-pgp-key.txt">my-pgp-key.txt</a></tt>
					</td>
				</tr>
			</table>
			`);
	const pickedArticle = !isLegacyBrowser
		? htmlBody.append(`
			${renderTitle(2, "my picked article", isLegacyBrowser)}
				<div>
					<a class="w-fit cursor-pointer relative bg-(--primary-element)/75 hover:bg-(--primary-element)/90 outline-2 outline-(--brand-color)/50 hover:outline-(--brand-color) hover:outline-4 special-rounded px-2 py-3"
					href="/blog?postId=${favoriteArticle[0].PostId}">
						<div id="picked-title" class="w-[256px] *:px-2 text-start">
							<p
								class="secondary-text text-sm"
								id="picked-title-timer"
							>

								${new Date(favoriteArticle[0].Timestamp).getHours()}:${new Date(
									favoriteArticle[0].Timestamp,
								).getMinutes()} -
								${new Date(favoriteArticle[0].Timestamp).getDay()}/${new Date(
									favoriteArticle[0].Timestamp,
								).getMonth()}/${new Date(
									favoriteArticle[0].Timestamp,
								).getFullYear()}
							</p>
							<p
								class="primary-text text-lg line-clamp-2"
								id="picked-title-title"
							>
								${favoriteArticle[0].Title}
							</p>
							<div
								id="picked-title-tags"
								class="flex flex-row items-center gap-1 secondary-text"
							>
								${
									favoriteArticle[0].Tags && favoriteArticle[0].Tags.length > 0
										? favoriteArticle[0].Tags.split(",")
												.map(
													(tag) => `
										<p
											class="w-fit px-3 py-1 secondary-text text-sm bg-(--primary-element) outline-1 outline-(--brand-color) rounded-xl"
										>
											${tag}
										</p>
									`,
												)
												.join("")
										: `<p
										class="w-fit px-3 py-1 secondary-text text-sm bg-(--primary-element) outline-1 outline-(--brand-color) rounded-xl"
									>
										untagged
									</p>`
								}
							</div>
							<img
								class="w-[256px] opacity-0"
								src=${extractFirstImage(favoriteArticle[0].Body) || "https://share.valhalladev.org/u/placeholder-of-all.png"}
								alt=${favoriteArticle[0].Title || "thumbnail"}
							/>
						</div>
						<img
							class="w-72.5 absolute -right-4 -bottom-6 rounded-3xl outline-2 outline-(--brand-color)"
							src=${extractFirstImage(favoriteArticle[0].Body)}
							alt=${favoriteArticle[0].Title || "thumbnail"}
							id="picked-image"
						/>
					</a>
				</div>
			`)
		: htmlBody.append(`<br><br>
			${renderTitle(2, "my picked article", isLegacyBrowser)}
			<a href="/blog?postId=${favoriteArticle[0].PostId}">
				<table border="1" cellpadding="6" cellspacing="0" width="280"><tr><td>
					<font color="#777777">
						${String(new Date(favoriteArticle[0].Timestamp).getHours()).padStart(2, "0")}:
						${String(new Date(favoriteArticle[0].Timestamp).getMinutes()).padStart(2, "0")} -
						${String(new Date(favoriteArticle[0].Timestamp).getDate()).padStart(2, "0")}/
						${String(new Date(favoriteArticle[0].Timestamp).getMonth() + 1).padStart(2, "0")}/
						${new Date(favoriteArticle[0].Timestamp).getFullYear()}
					</font><br>
					<font size="5"><b>${favoriteArticle[0].Title || "my picked article"}!</b></font><br><br>
					<img src="${extractFirstImage(favoriteArticle[0].Body)}" width="260"><br><br>
					<table border="0" cellpadding="3"><tr>
						${(favoriteArticle[0].Tags || "")
							.split(",")
							.filter((tag) => tag.trim() !== "")
							.map((tag) => `<td border="1"><small>${tag.trim()}</small></td>`)
							.join("")}
					</tr></table>
				</td></tr>
				</table>
			</a>
			`);
	const articles = !isLegacyBrowser
		? htmlBody.append(`
			<div class="grid grid-cols-2 items-start md:items-center gap-6 mx-4">
				${fetchedArticles
					.map(
						(article: ArticleStructure) => `
						<a
							id={articleIdentifier}

							href="${article.PostId ? `/blog?postId=${article.PostId}` : ""}"
							class="cursor-pointer text-start flex flex-col md:flex-row list-image-none bg-(--primary-element) special-rounded outline-1 outline-(--brand-color) w-full overflow-hidden"
>
							<div class="w-full md:w-36 h-36 overflow-hidden special-rounded shrink-0">
								<img
									id="{articleIdentifier}-image"
									class="w-full h-full object-cover transition-transform"
									src=${(() => {
										// regex to find cdn img urls, then use the first one
										// also use placeholder if none
										const imageRegex =
											/https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg|avif|bmp|tiff)(?:\?[^\s]*)?/gi;
										const matches = article.Body.match(imageRegex);
										if (matches && matches.length > 0) {
											return matches[0];
										}
										return "./static/whoisthis.png";
									})()}
									alt="article-${article.PostId}"
								/>
							</div>

							<div class="mx-2 my-2 min-w-0">
								<p class="secondary-text px-2">
									${new Date(article.Timestamp).getHours()}:${new Date(article.Timestamp).getMinutes()} -
									${new Date(article.Timestamp).getDay()}/${new Date(
										article.Timestamp,
									).getMonth()}/${new Date(article.Timestamp).getFullYear()}
								</p>
								<p
									class="primary-text text-md line-clamp-4 overflow-hidden px-1
									md:line-clamp-2 md:px-2 md:text-lg"
								>
									${article.Title.slice(0, 30)}
								</p>
								<div
									class="flex flex-row overflow-x-hidden p-1 gap-1 secondary-text
									*:px-2 *:py-1 *:outline *:outline-(--brand-color) *:rounded-xl *:w-fit *:line-clamp-1"
								>
								${
									article.Tags && article.Tags.length > 0
										? article.Tags.split(",")
												.map(
													(tag) => `
										<p
											class="w-fit px-3 py-1 secondary-text text-sm bg-(--primary-element) outline-1 outline-(--brand-color) rounded-xl"
										>
											${tag}
										</p>
									`,
												)
												.join("")
										: ""
								}
								</div>
							</div>
						</a>
					`,
					)
					.join("")}

			</div>
			`)
		: htmlBody.append(`<br><br>
			${renderTitle(3, "my articles", isLegacyBrowser)}
			<table border="0" cellpadding="10">
				<tr>
					${fetchedArticles
						.map(
							(article) => `
						<td valign="top">
							<a href="nojs?postId=${article.PostId}">
							${article.Title}
								<img
									id="${article.PostId}-image"
									src="${extractFirstImage(article.Body)}"
									alt="article-${article.PostId}"
								>
							</a>
						</td>
						`,
						)
						.join("")}
				</tr>
			</table>
			`);
	const heatTag = !isLegacyBrowser
		? htmlBody.append(`
		<div>
			${renderTitle(4, "my tag heatmap", isLegacyBrowser)}
			<div class="flex justify-center">
				<div
					id="heattag-parent"
					class="flex flex-wrap justify-center items-center pt-2 md:pt-10 gap-1"
				>
				${await getTagHeatmap(isLegacyBrowser)}
				</div>
			</div>
			</div>

		`)
		: htmlBody.append(` <br><br>
			${renderTitle(3, "my tag heatmap", isLegacyBrowser)}

			<table border="0" cellpadding="4">
				${await getTagHeatmap(isLegacyBrowser)}
			</table>
		`);
	const embeds = !isLegacyBrowser
		? htmlBody.append(`<br><br>
			<div class=" w-full">
				${renderTitle(5, "embed my blog", isLegacyBrowser)}
				<div class="flex flex-col md:flex-row items-start gap-2">
					<div class="flex flex-col justify-center items-start md:w-1/2 h-full">
						<span
							class="material-symbols-rounded primary-text"
							style="font-size: 72px">rss_feed</span
						>
						<p
							class="text-start break-all secondary-text mono bg-(--primary-element) outline-1 outline-(--brand-color) rounded-xl px-2 py-1"
						>
							https://api.nogisoft.work/personal/blog/xml
						</p>
					</div>
					<div class="flex flex-col justify-center items-start md:w-1/2">
						<span
							class="material-symbols-rounded primary-text"
							style="font-size: 72px">api</span
						>
						<div
							class="text-start break-all secondary-text bg-(--primary-element) outline-1 outline-(--brand-color) rounded-xl px-2 py-1"
						>
							<p class="mono">
								GET: <br />https://api.nogisoft.work/personal/blog/json
							</p>
						</div>
						<p class="secondary-text text-sm mono px-2">
							URL Parameter?: amount?: number, tags?: string, postId?: number
						</p>
					</div>
				</div>
			</div>
			`)
		: htmlBody.append(`<br><br>
			${renderTitle(5, "embed my blog", isLegacyBrowser)}
			<table border="1" width="100%" cellpadding="8">
				<tr>
					<td>
						xml:
						<pre>
							https://api.nogisoft.work/personal/blog/xml
						</pre>
					</td>
				</tr>
				<tr>
					<td>
						json:
						<pre>
							GET:
							https://api.nogisoft.work/personal/blog/json

							URL Parameter?:
							amount?: number
							tags?: string
							postId?: number
						</pre>
					</td>
				</tr>
			</table>
			`);

	return html.html();
}

async function getTagHeatmap(legacy: boolean) {
	function tagSizing(
		count: number,
		kind: "text" | "opacity" | "padding",
		legacy: boolean,
	) {
		const baseSizes = {
			text: {
				"0": ["text-md font-light", "font-size: 10px"],
				"1": ["text-lg", "font-size: 14px"],
				"3": ["text-xl font-medium", "font-size: 18px font-weight: semi"],
				"6": ["text-2xl font-semibold", "font-size: 20px font-weight: semi"],
				"10": ["text-3xl font-bold", "font-size: 26px font-weight: bold"],
				"20": ["text-4xl font-black", "font-size: 30px font-weight: bold"],
			},
			opacity: {
				"0": "bg-opacity-20 outline-1",
				"1": "bg-opacity-30 outline-2",
				"3": "bg-opacity-40 outline-3",
				"6": "bg-opacity-50 outline-4",
				"10": "bg-opacity-60 outline-5",
				"20": "bg-opacity-70 outline-6",
			},
			padding: {
				"0": "px-2 py-1",
				"1": "px-3 py-2",
				"3": "px-4 py-3",
				"6": "px-5 py-4",
				"10": "px-6 py-5",
				"20": "px-7 py-6",
			},
		};

		if (count < 1)
			return legacy ? baseSizes["text"]["0"][1] : baseSizes[kind]["0"];
		if (count < 3)
			return legacy ? baseSizes["text"]["1"][1] : baseSizes[kind]["1"];
		if (count < 6)
			return legacy ? baseSizes["text"]["3"][1] : baseSizes[kind]["3"];
		if (count < 10)
			return legacy ? baseSizes["text"]["6"][1] : baseSizes[kind]["6"];
		if (count < 20)
			return legacy ? baseSizes["text"]["10"][1] : baseSizes[kind]["10"];
		if (count < 30)
			return legacy ? baseSizes["text"]["20"][1] : baseSizes[kind]["20"];

		// for counts >= 30, return the largest size
		return kind === "text" ? "text-4xl font-black" : "bg-opacity-80";
	}

	try {
		const tags = await getTags();
		if (tags && typeof tags === "object" && Object.keys(tags).length > 0) {
			return Object.entries(tags)
				.map(([tagName, count]) => {
					const textSize = tagSizing(count as number, "text", legacy);
					const opacity = tagSizing(count as number, "opacity", legacy);
					const padding = tagSizing(count as number, "padding", legacy);
					return !legacy
						? `
					<p
						class="
							self-start
							leading-none
							inline
							primary-text
							text-(--primary-text) wrap-break-word
							bg-(--brand-diluted)
							outline-1
							outline-(--brand-color)
							rounded-md
							${textSize}
							${opacity}
							${padding}
						"
					>
						${symbolEncode(tagName)}
					</p>
				`
						: `
						<td><a href="tag-${symbolEncode(tagName)}.html">${symbolEncode(tagName)}</a></td>
				`;
				})
				.join("");
		} else {
			return `<p class="secondary-text font-mono bg-none">doesnt feel like it apparently...</p>`;
		}
	} catch {
		return `<p class="secondary-text font-mono bg-none">doesnt feel like it apparently...</p>`;
	}
}

function extractFirstImage(body: string): string {
	const imageRegex =
		/https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg|avif|bmp|tiff)(?:\?[^\s]*)?/gi;
	const matches = body.match(imageRegex);
	return (
		matches?.[0] || "https://share.valhalladev.org/u/placeholder-of-all.png"
	);
}

function renderTitle(num: number, title: string, legacy: boolean) {
	return legacy
		? `<p><font color="#d89a2b"><b>0${num}.</b></font><font color="#777777"><b> ${title}</b></font></p>`
		: `<div class="secondary-text *:inline mb-3">
				<p id="counting-seg" class="text-(--brand-color) mono">
				0${num}.</p>
				<p id="title-header">${title}</p>
				</div>
			`;
}

async function getPageStatus() {
	try {
		const response = await fetch(`${apiURL}/personal/blog/info`);
		if (response.ok) return JSON.parse(await response.text());
		else return false;
	} catch {
		return false;
	}
}

async function getTags(): Promise<Record<string, number> | false> {
	const response = await fetch(`${apiURL}/personal/blog/tags`);
	if (response.ok) return JSON.parse(await response.text());
	else return false;
}
