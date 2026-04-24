import { endpointDomain } from "./getEndPointDomain";
import passcodePrompt from "./passcodePrompt";

let isInEditing: boolean = $state(false);

export function isInEditingSetter(bool: boolean): void {
	isInEditing = bool ? bool : !isInEditing;
}

export function isInEditingGetter(): boolean {
	return isInEditing;
}

export async function editBlogPageStat(
	type: "comment" | "favepost",
): Promise<boolean> {
	if (type !== "comment" && type !== "favepost") return false;

	let myComment: string | undefined;
	let myFavePost: number | null = null;

	if (type === "comment") {
		const myCommentRaw = prompt(
			`ok, uh smart guy, @ ${new Date().toISOString()}, what do u think?`,
		);
		myComment =
			myCommentRaw !== null
				? myCommentRaw.trim()
				: '{yall look, i just push a literal "" to the comment, this mf is restarted}';
	} else if (type === "favepost") {
		const myFavePostRaw = prompt(
			`right, and ur fave post in its purest id number form?`,
		);
		if (myFavePostRaw == null) return false;
		myFavePost = Number(myFavePostRaw);
	}

	const authentication: number | false = await passcodePrompt();

	if (!authentication) {
		alert("at the end, nope.");
		return false;
	}

	const payload: {
		authenticate: number;
		updateItems: {
			updateWhat: "comment" | "favePostId";
			toValue: string | number;
		}[];
	} = {
		authenticate: authentication,
		updateItems: [],
	};

	if (typeof myComment === "string") {
		payload.updateItems.push({
			updateWhat: "comment",
			toValue: myComment.trim(),
		});
	}
	if (
		myFavePost !== null &&
		typeof myFavePost === "number" &&
		!isNaN(myFavePost)
	) {
		payload.updateItems.push({
			updateWhat: "favePostId",
			toValue: myFavePost,
		});
	}
	if (payload.updateItems.length === 0) {
		alert("its not even the right input???");
		return false;
	}

	console.log(payload);

	const result = await fetch(`${endpointDomain}/personal/blog/info`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
	if (result.status === 200) {
		return result.ok;
	}
	return false;
}
