import { endpointDomain } from "./getEndPointDomain";
import { getPageStatus } from "./pageStatusFetcher";

let fetchedPosts: Array<ArticleStructure> = [];

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

// for a 99.99% service? yes.
const isAlive: boolean = await getPageStatus();

async function localFetchedPosts(
	type: "getter" | "setter",
	data?: Array<ArticleStructure>,
): Promise<Array<ArticleStructure>> {
	if (type === "getter") return fetchedPosts;
	else {
		fetchedPosts = (await getArticles()) || [];
		return fetchedPosts;
	}
}

export async function getArticles(
	amount: number = 10,
	postId?: number,
	tags?: string,
): Promise<Array<ArticleStructure> | false> {
	const postCache = await localFetchedPosts("getter");
	const reqPost = postCache.find((post) => post.postId === postId);

	if (postId && reqPost) return [reqPost];
	else if (postCache.length > 0) return postCache;
	else {
		const response = await fetch(
			`${endpointDomain}/personal/blog/json?${amount ? "amount=" + amount : ""}${postId ? "&postId=" + postId : ""}${tags ? "&tags=" + tags : ""}`,
		);
		if (response.ok) {
			const posts = await response.text();
			return JSON.parse(posts);
		} else return false;
	}
}

export async function getTags(): Promise<Record<string, number> | false> {
	const response = await fetch(`${endpointDomain}/personal/blog/tags`);
	if (response.ok) return JSON.parse(await response.text());
	else return false;
}

export async function verifyForAuthentication(
	totp: number,
): Promise<boolean | null> {
	if (!isAlive) return null;

	const response = await fetch(`${endpointDomain}/personal/security`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			Type: "verify",
			Authentication: totp,
		}),
	});
	if (response.ok) return true;
	else if (response.status === 421) return null;
	else return false;
}

export async function editArticle(
	type: "edit" | "create" | "remove",
	article: ArticleStructure,
	authentication: number,
	postId?: number,
): Promise<boolean> {
	if (!isAlive) return false;

	// if (!(await verifyForAuthentication(authenticated))) return false;
	// passcodeprompt will handle it

	const resBodyActionPretext = {
		edit: "edit",
		create: "add",
		remove: "remove",
	};

	const normalizedMarkdownBody = article.Body.trim()
		.replace(/\r\n/g, "\n")
		.replace(/[ \t]+$/gm, "")
		.replace(/\n{3,}/g, "\n\n")
		.replace(/\t/g, "    ")
		.replace(/\u00a0/g, " ")
		.normalize("NFC");

	const resBody = {
		action: resBodyActionPretext[type],
		articleContents: { ...article, Body: normalizedMarkdownBody },
		authenticate: authentication,
		postId: postId,
	};

	const response = await fetch(`${endpointDomain}/personal/blog/edit`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(resBody),
	});

	if (type === "create") {
		// push to server as is
		if (response.ok) return true;
		else return false;
	} else if (type === "edit") {
		const articleExistence = await getArticles(1, article.PostId);
		if (!articleExistence) return false;

		if (response.ok) return true;
		else return false;
	} else if (type === "remove") {
		if (response.ok) return true;
		else return false;
	}
	return false;
}
