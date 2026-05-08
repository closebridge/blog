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

export const endpointDomain = "https://api.nogisoft.work";

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
