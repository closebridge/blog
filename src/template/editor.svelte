<script lang="ts">
	import EasyMDE from "easymde";
	import "easymde/dist/easymde.min.css";
	import { onMount } from "svelte";
	import { type EditorType, makeEditToAPI } from "../script/editor";
	import { type ArticleStructure } from "../script/blogEndpointFetcher";

	let {
		editorType,
		selectedArticle,
	}: {
		editorType: EditorType;
		selectedArticle: ArticleStructure;
	} = $props();

	// console.log(true, selectedArticle);
	let easyMde: EasyMDE | null = $state(null);

	onMount(() => {
		const textInbox = document.createElement("textarea");
		textInbox.id = "editor";
		document.getElementById("editorPlacement")!.appendChild(textInbox);
		easyMde = new EasyMDE({
			element: textInbox,
			minHeight: "200px",
		});
		easyMde.value(
			selectedArticle.Body
				? selectedArticle.Body.replace(/\\n/g, "\n")
				: "",
		);
	});

	let currentTitle = $state(selectedArticle.Title);
	let currentTags = $state(selectedArticle.Tags);
	let currentLocation = $state(selectedArticle.Location);

	async function handleSubmit() {
		if (!easyMde) return;

		const updated: ArticleStructure = {
			...selectedArticle,
			Title: currentTitle,
			Tags: currentTags,
			Location: currentLocation,
			Body: easyMde.value().replace("\n", "\\n"),
		};

		console.log(editorType);

		const result = await makeEditToAPI({
			editorType,
			selectedArticle: updated,
		});

		if (result === null) alert("failed to submit");
		else if (result) alert("successfully submitted");
		else alert("something went wrong");
	}
</script>

<div class="flex flex-col h-full">
	<input
		class="bg-(--primary-element) px-4 py-2 rounded-lg shrink-0 w-full"
		type="text"
		id="title"
		placeholder="title"
		bind:value={currentTitle}
	/>
	<div class="flex divide-x-2 divide-(--secondary-element)">
		<input
			class="inline bg-(--primary-element) px-4 py-2 rounded-lg shrink-0 w-1/2"
			type="text"
			id="tags"
			placeholder="tags (separate with ',')"
			bind:value={currentTags}
		/>
		<input
			class="inline bg-(--primary-element) px-4 py-2 rounded-lg shrink-0 w-1/2"
			type="text"
			id="location"
			placeholder="location (default is vietnam)"
			bind:value={currentLocation}
		/>
	</div>
	<br />
	<div id="editorPlacement" class="flex-1 min-h-0"></div>
	<button
		onclick={handleSubmit}
		class="px-4 py-1 bg-(--primary-element) primary-text rounded-lg shrink-0 mt-2"
		>submit</button
	>
</div>

<style>
	:global(.EasyMDEContainer) {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	:global(.EasyMDEContainer:has(.editor-preview-side)) {
		display: block;
		overflow: visible;
	}

	:global(.EasyMDEContainer .CodeMirror) {
		height: auto;
		flex: 1;
		min-height: 0;
		background: var(--primary-element);
		color: var(--primary-text);
	}

	:global(.EasyMDEContainer .editor-toolbar) {
		background: var(--primary-element);
		border-color: var(--secondary-element);
	}

	:global(.EasyMDEContainer .CodeMirror-scroll) {
		overflow-y: auto;
		overflow-x: hidden;
	}

	:global(.EasyMDEContainer .editor-preview-side),
	:global(.EasyMDEContainer .editor-preview) {
		background: var(--primary-element);
		color: var(--primary-text);
	}

	:global(.EasyMDEContainer .editor-statusbar) {
		color: var(--secondary-text);
	}

	:global(.editor-toolbar button.active) {
		background: var(--brand-diluted);
		border-color: var(--brand-color);
	}

	/* fullscreen editor hack */
	:global(.CodeMirror-fullscreen) {
		position: static !important;
		height: 100% !important;
	}

	:global(.CodeMirror-sizer) {
		margin-bottom: 0 !important;
	}
</style>
