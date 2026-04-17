const endpointDomain = document.location.href.includes("localhost")
	? "http://localhost:8787"
	: "https://api.nogisoft.work";

export type PageStatus = {
	Comment: string;
	CommentOwner: string;
	CommentTimestamp: number;
	FavoritePostId: number;
};

export default async function getPageStatus() {
	const response = await fetch(`${endpointDomain}/personal/blog/info`);
	if (response.ok) return JSON.parse(await response.text());
	else return false;
}
