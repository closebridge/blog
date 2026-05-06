import passcodePrompt from "./passcodePrompt";
import { isInEditingGetter, isInEditingSetter } from "./editorHandler.svelte";

type mainParm = "edit" | "blog";

export default function handleNav(pageUrl: string) {
	const urlParms = document.location.href.split("/");
	const mainParm = urlParms[urlParms.length - 1] ?? undefined;

	if (mainParm === "edit" && !isInEditingGetter()) {
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
	}
	// } else if (mainParm === "blog") {}
}
