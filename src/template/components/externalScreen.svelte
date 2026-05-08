<script lang="ts" module>
	// stripped from nsense frontend lool
	// inf popup -> just one (idk could made to be inf too but meh its just a blog pge bro)
	// hookie input, sidebar, 3d viewer, text viewer... -> just text viewer
	// so lightweight

	import { parse, Renderer } from "marked";
	import { type ArticleStructure } from "../../script/blogEndpointFetcher";
	import Editor from "../editor.svelte";

	// interface articleData {
	// 	id: number;
	// 	timestamp: number;
	// 	creator: string;
	// 	title: string;
	// 	content: string;
	// 	tags: string;
	// 	location: string;
	// }

	export interface globalPopupState {
		currentVisible: boolean;
		popupComponent: "article" | "editor" | null;
		popupRecord: ArticleStructure;
	}

	export let globalPopupState: globalPopupState = $state({
		currentVisible: false,
		popupComponent: null,
		popupRecord: {
			PostId: 0,
			Timestamp: 0,
			Creator: "",
			Title: "",
			Body: "",
			Tags: "",
			Location: "",
		},
	});

	function renderMd(body: string): string {
		try {
			const normalized = body
				.replace(/\\n/g, "\n")
				.replace(/\\/g, "")
				.replace(/\|(\s*:?-+:?\s*)\|/g, (_match, dashes) => {
					// just in case your |---| contains " "
					return "|" + dashes.replace(/\s+/g, "") + "|";
				});
			const renderer = new Renderer({
				gfm: true,
			});
			renderer.image = ({ href, title, text }) => {
				return `<img src="${href}" alt="${text}"${title ? ` title="${title}"` : ""} loading="lazy" />`;
			};
			const result = parse(normalized, { renderer, gfm: true });
			if (typeof result !== "string") return body;
			return result;
		} catch {
			console.warn("markdown parse failed, falling back to raw text");
			return body;
		}
	}

	export function popupRecordManager(
		viewState: "open" | "close",
		type?: "article" | "editor",
		popupRecord?: ArticleStructure,
	) {
		if (popupRecord) {
			if (type === "article") {
				globalPopupState.currentVisible =
					viewState === "open" ? true : false;
				globalPopupState.popupComponent = "article";
				globalPopupState.popupRecord = popupRecord;
			} else if (type === "editor") {
				globalPopupState.currentVisible =
					viewState === "open" ? true : false;
				globalPopupState.popupComponent = "editor";
				globalPopupState.popupRecord = popupRecord;
			}
		} else if (!popupRecord && viewState === "close") {
			// basically hidden
			globalPopupState.currentVisible = false;
			globalPopupState.popupComponent = null;
			globalPopupState.popupRecord = {
				PostId: 0,
				Timestamp: 0,
				Creator: "",
				Title: "",
				Body: "",
				Tags: "",
				Location: "",
			};
		}
	}
	console.log(globalPopupState);
</script>

{#if globalPopupState.popupComponent == "article"}
	<div
		class="drop-shadow-xl bg-(--primary-element) rounded-xl h-[90vh] md:w-xl lg:w-2xl p-5 flex flex-col gap-y-5 px-5 overflow-y-scroll hide-scrollbar shadow-2xl border-4 border-(--brand-color)"
	>
		{#if globalPopupState.popupRecord.PostId}
			<div
				id="popup-detail-notify-header"
				class="z-100 flex flex-col gap-y-3 justify-center items-start"
			>
				<div
					class="flex flex-row justify-between items-center w-full bg-(--brand-diluted) py-1 rounded-lg"
				>
					<div class="flex flex-row justify-center items-center">
						<span
							class="material-symbols-rounded ignore text-[2.5rem] md:text-[3rem] primary-text ml-5"
							style="color: var(--brand-color)"
							>account_circle</span
						>
						<div class="ml-4">
							<p
								id="notify-author-name"
								class="primary-text font-semibold"
							>
								{globalPopupState.popupRecord.Creator}
							</p>

							<p class="inline secondary-text text-sm">
								{new Date(
									globalPopupState.popupRecord.Timestamp,
								).getDate()}
								/
								{new Date(
									globalPopupState.popupRecord.Timestamp,
								).getMonth()}
								/
								{new Date(
									globalPopupState.popupRecord.Timestamp,
								).getFullYear()}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div class="flex flex-col md:flex-row items-center md:items-start">
				<div class="md:sticky md:top-0 md:w-[35%]">
					<div
						class="flex flex-row md:flex-col justify-start items-center md:items-start gap-5"
					>
						<div
							id="tagsContainer"
							class="flex flex-row md:flex-col gap-2 items-center md:items-start justify-evenly"
						>
							{#each globalPopupState.popupRecord.Tags.split(",") as tag}
								<div
									style="background: var(--bar-gradient); filter: blur(0.5px); "
									class="px-3 py-1 rounded-full backdrop-blur-[2px] outline outline-[--brand-color]"
								>
									<p
										class="inline primary-text font-bold text-xs text-nowrap md:text-base"
									>
										{tag}
									</p>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<div
					id="popup-detail-notify-full-message"
					class="w-full flex flex-col items-start gap-3 md:border-l-2 md:border-(--brand-color) md:px-[6%]"
				>
					<p
						id="p-notify-subject"
						class="serif text-2xl md:text-4xl font-medium w-full text-pretty"
					>
						<span
							class="serif text-(--disabled-text) font-bold pr-1"
							>#{globalPopupState.popupRecord.PostId}.
						</span>
						{globalPopupState.popupRecord.Title}
					</p>
					<p
						id="p-notify-body"
						class="primary-text md:text-lg w-full break-pretty"
					>
						{@html renderMd(globalPopupState.popupRecord.Body)}
					</p>
					<span
						class="text-xl serif py-3 block"
						style="font-style: italic; font-weight:300;"
					>
						> {globalPopupState.popupRecord.Creator ?? "me"}</span
					>
					<!-- <img
				src="https://share.valhalladev.org/raw/45076da80ff080aed9e1.jpg"
				alt="img"
				class="outline-4 outline-(--brand-color) outline-offset-2 rounded-xl"
			/> -->
				</div>
			</div>
		{:else}
			<div
				class="flex flex-col text-center serif items-center justify-center text-(--secondary-text) h-full"
			>
				<span class="material-symbols-rounded" style="font-size: 48px">
					warning
				</span>
				<p class="serif text-2xl line-clamp-1 w-full">
					post doesnt even exist...
				</p>
			</div>
		{/if}

		<button
			class="bg-(--secondary-element) primary-text py-2 rounded-lg sticky bottom-2 left-1/2 cursor-pointer"
			onclick={() =>
				popupRecordManager(
					"close",
					"article",
					globalPopupState.popupRecord,
				)}
		>
			okay
		</button>
	</div>
{:else if globalPopupState.popupComponent == "editor"}
	<div
		class="drop-shadow-xl bg-(--primary-element) rounded-xl max-h-[85vh] md:w-xl lg:w-2xl p-5 flex flex-col overflow-y-auto hide-scrollbar shadow-2xl border-4 border-(--brand-color)"
	>
		<Editor
			editorType={globalPopupState.popupRecord.Body !== ""
				? "edit"
				: "add"}
			selectedArticle={globalPopupState.popupRecord}
		/>
	</div>
{/if}

<style>
	:global(#p-notify-body > *) {
		padding: 10px 0 10px 0;
		font-size: medium;
		color: var(--primary-text);
		overflow-wrap: break-word;
	}

	:global(#p-notify-body h1) {
		color: var(--primary-text);
		font-size: xx-large;
		font-weight: bold;
	}

	:global(#p-notify-body h2) {
		color: var(--primary-text);
		font-size: x-large;
		font-weight: bold;
	}

	:global(#p-notify-body h3) {
		color: var(--secondary-text);
		font-size: large;
		font-weight: bold;
	}

	:global(#p-notify-body h4) {
		color: var(--secondary-text);
		font-size: small;
		font-weight: bold;
	}

	:global(#p-notify-body > hr) {
		border: 0;
	}

	:global(#p-notify-body > ul) {
		padding: 0 0 0 12px;
	}

	:global(#p-notify-body > p > code) {
		font-family: "DM Mono", monospace;
		border-radius: 6px;
		display: block;
		background-color: var(--misc-macos-traffic-disabled-color);
		padding: 10px;
		width: 100%;
	}

	:global(#p-notify-body > p > img) {
		outline: 4px solid var(--brand-color);
		border-radius: 0.75rem;
		padding: 4px;
	}

	:global(#p-notify-body > table) {
		outline: 4px solid var(--brand-color);
		outline-offset: 4px;
		padding: 2px 6px 2px 6px;
		border-radius: 5px;
		margin: 0 auto;

		width: 100%;
	}
	:global(#p-notify-body > table > thead) {
		border-top: 2px solid var(--brand-color);
	}
	:global(#p-notify-body > table > thead)::after {
		display: block;
		height: 4px;
	}
	:global(#p-notify-body > table > tbody > tr) {
		border-top: 2px solid var(--brand-color);
	}
</style>
