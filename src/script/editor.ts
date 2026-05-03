import {
	getArticles,
	type ArticleStructure,
} from "../script/blogEndpointFetcher";
import { editArticle } from "../script/blogEndpointFetcher";
import passcodePrompt from "../script/passcodePrompt";
import { popupRecordManager } from "../template/components/externalScreen.svelte";

export type EditorType = "add" | "edit" | "remove";

export interface EditorRef {
	editorType: EditorType;
	selectedArticle: ArticleStructure;
}

const emptyArticle: ArticleStructure = {
	PostId: 0,
	Timestamp: 0,
	Tags: "",
	Creator: "",
	Title: "",
	Body: "",
	Location: "",
};

export default async function editorWindow(window: EditorType): Promise<void> {
	if (window == "add") {
		popupRecordManager("open", "editor", emptyArticle);
	} else if (window == "edit") {
		const postId = await getPostId();
		if (postId == null) return;

		const articles = await getArticles(1, postId);
		const ifArticle = Array.isArray(articles) && articles.length > 0;
		const article = ifArticle ? articles[0] : emptyArticle;

		!ifArticle && alert("no article found, falling back to empty article");

		popupRecordManager("open", "editor", article);

		// continue to call makeEditToAPI next
	} else if (window == "remove") {
		const postId = await getPostId();
		if (postId == null) return;

		const result = await makeEditToAPI({
			editorType: "remove",
			selectedArticle: { ...emptyArticle, PostId: postId },
		});
		if (result) alert("article removed");
		else if (result === null) alert("no article found");
		else if (result === false) alert("failed to remove article");
	}
}

async function getPostId() {
	const input = prompt("pls provide postId:");
	if (input === null) return null;

	const id = Number(input);
	if (isNaN(id)) return getPostId();

	if (await getArticles(1, id)) return id;
	return getPostId();
}

export async function makeEditToAPI(args: EditorRef): Promise<boolean | null> {
	if (args.editorType === "add") {
		const passcode = await passcodePrompt();
		if (!passcode) return false;

		return await editArticle("create", args.selectedArticle, passcode);
	} else if (args.editorType === "edit") {
		const passcode = await passcodePrompt();
		if (!passcode) return false;

		return await editArticle(
			"edit",
			args.selectedArticle,
			passcode,
			args.selectedArticle.PostId,
		);
	} else if (args.editorType === "remove") {
		const passcode = await passcodePrompt();
		if (!passcode) return false;

		const existence = await getArticles(1, args.selectedArticle.PostId);
		if (existence && existence.length === 0) return null;

		console.log(existence);

		return await editArticle(
			"remove",
			args.selectedArticle,
			passcode,
			args.selectedArticle.PostId,
		);
	}
	return false;
}
