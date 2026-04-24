import { verifyForAuthentication } from "./blogEndpointFetcher";
import { isInEditingSetter } from "./editorHandler.svelte";

export default async function passcodePrompt(
	attempts = 0,
	maxAttempts = 3,
): Promise<number | false> {
	if (attempts >= maxAttempts) return false;

	const promptResult = prompt("pls provide the auth code <3");
	if (promptResult === null) {
		alert("canceled");
		return false;
	}

	const authCode = parseInt(promptResult);
	if (isNaN(authCode)) {
		alert("wrong.");
		return passcodePrompt(attempts + 1, maxAttempts);
	}

	const result = await verifyForAuthentication(authCode);
	if (result) {
		// isInEditingSetter(true);
		// alert("welcome me!");
		return authCode;
	} else if (result === null) {
		alert("not authenticated");
		return false;
	} else {
		alert("wrong.");
		return passcodePrompt(attempts + 1, maxAttempts);
	}
}
