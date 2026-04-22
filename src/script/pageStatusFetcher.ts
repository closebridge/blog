import { endpointDomain } from "./getEndPointDomain";

export type PageStatus = {
	Comment: string;
	CommentOwner: string;
	CommentTimestamp: number;
	FavoritePostId: number;
};

export async function getPageStatus() {
	const response = await fetch(`${endpointDomain}/personal/blog/info`);
	if (response.ok) return JSON.parse(await response.text());
	else return false;
}
