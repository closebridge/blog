import { endpointDomain } from "./getEndPointDomain";
import passcodePrompt from "./passcodePrompt";

let isInEditing: boolean = $state(false);

export function isInEditingSetter(bool: boolean): void {
	isInEditing = bool ? bool : !isInEditing;
}

export function isInEditingGetter(): boolean {
	return isInEditing;
}

export async function editBlogPageStat(): Promise<boolean> {
	const myComment = prompt(
		`ok, uh smart guy, @ ${new Date().toISOString()}, what do u think?`,
	);
	const myFavePostRaw = prompt(
		`right, and ur fave post in its purest id number form?`,
	);
	const myFavePost = myFavePostRaw !== null ? Number(myFavePostRaw) : null;

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
			toValue: myComment.trim()
				? myComment.trim()
				: '{yall look, i just push a literal "" to the comment, this mf is restarted}',
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
