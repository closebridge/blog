import { type ArticleStructure } from "./articleStructure";

const endpointDomain = "https://api.nogisoft.work";

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
