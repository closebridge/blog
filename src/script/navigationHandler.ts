import passcodePrompt from "./passcodePrompt";
import { isInEditingGetter, isInEditingSetter } from "./editorHandler.svelte";
import { popupRecordManager } from "../template/components/externalScreen.svelte";
import { getArticles } from "./blogEndpointFetcher";

type MainParm = "edit" | "blog";
// type ViewParm = "postId"

export default function navigationHandler(pageUrl: string) {
	const url = new URL(pageUrl);
	const section = url.pathname.split("/").pop() as MainParm;
	const args = url.search.split("?").pop();

	if (section === "edit" && !isInEditingGetter()) {
		(async () => {
			const result = await passcodePrompt();

			if (result) {
				isInEditingSetter(true);
				alert("welcome me!");
			} else if (result == null) {
				alert("not authenticated / server fucked");
				isInEditingSetter(false);
			}
		})();
	} else if (section === "blog") {
		console.log(args);
		if (!args) return null;
		const [key, id] = args.split("=");

		if (key === "postId") {
			// call popup to view article
			(async () => {
				if (isNaN(Number(id)) || Number(id) < 1) return false;
				const article = (await getArticles(1, Number(id))) ?? false;
				if (!article) {
					popupRecordManager("open", "article", {
						PostId: 0,
						Timestamp: 0,
						Creator: "",
						Title: "",
						Body: "",
						Tags: "",
						Location: "",
					});
				} else {
					const fetchedArticleStructure = article[0];
					popupRecordManager("open", "article", {
						PostId: fetchedArticleStructure?.PostId ?? 0,
						Timestamp: fetchedArticleStructure?.Timestamp ?? 0,
						Creator: fetchedArticleStructure?.Creator ?? "",
						Title: fetchedArticleStructure?.Title ?? "",
						Body: fetchedArticleStructure?.Body ?? "",
						Tags: fetchedArticleStructure?.Tags ?? "",
						Location: fetchedArticleStructure?.Location ?? "",
					});
				}
			})();
		}
	} else {
		popupRecordManager("close", "article", {
			PostId: 0,
			Timestamp: 0,
			Creator: "",
			Title: "",
			Body: "",
			Tags: "",
			Location: "",
		});
	}
}

export function navigateTo(url: string) {
	console.log(url);
	history.pushState(null, "", url);
	navigationHandler(document.location.href);
}

window.addEventListener("popstate", function () {
	navigationHandler(document.location.href);
});
