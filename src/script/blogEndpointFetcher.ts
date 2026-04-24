import { endpointDomain } from "./getEndPointDomain";
import { getPageStatus } from "./pageStatusFetcher";

export type ArticleStructure = {
	PostId: number;
	Timestamp: number;
	Tags: string;
	Creator: string;
	Title: string;
	Body: string;
	Location: string;
};

export async function getArticles(
	amount: number = 5,
	postId?: number,
	tags?: string,
): Promise<Array<ArticleStructure> | false> {
	console.log(
		`${endpointDomain}/personal/blog/json?${amount ? "amount=" + amount : ""}${postId ? "&postId=" + postId : ""}${tags ? "&tags=" + tags : ""}`,
	);
	const response = await fetch(
		`${endpointDomain}/personal/blog/json?${amount ? "amount=" + amount : ""}${postId ? "&postId=" + postId : ""}${tags ? "&tags=" + tags : ""}`,
	);
	if (response.ok) return JSON.parse(await response.text());
	else return false;
}

export async function getTags(): Promise<Record<string, number> | false> {
	const response = await fetch(`${endpointDomain}/personal/blog/tags`);
	if (response.ok) return JSON.parse(await response.text());
	else return false;
}

export async function verifyForAuthentication(
	totp: number,
): Promise<boolean | null> {
	if (!(await getPageStatus())) return null;

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
