export type ArticleStructure = {
	PostId: number;
	Timestamp: number;
	Tags: string;
	Creator: string;
	Title: string;
	Body: string;
	Location: string;
};

const endpointDomain = document.location.href.includes("localhost")
	? "http://localhost:8787"
	: "https://api.nogisoft.work";

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
