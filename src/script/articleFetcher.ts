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
): Promise<Array<ArticleStructure> | false> {
	const response = await fetch(
		`${endpointDomain}/personal/blog/json?amount=${amount}`,
	);
	if (response.ok) return JSON.parse(await response.text());
	else return false;
}
