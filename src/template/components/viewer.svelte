<script lang="ts" module>
	// stripped from nsense frontend lool
	// inf popup -> just one (idk could made to be inf too but meh its just a blog pge bro)
	// hookie input, sidebar, 3d viewer, text viewer... -> just text viewer
	// so lightweight

	import { parse } from "marked";

	interface articleData {
		id: number;
		timestamp: number;
		creator: string;
		title: string;
		content: string;
		tags: string;
		location: string;
	}

	export interface globalPopupState {
		currentVisible: boolean;
		popupRecord: articleData;
	}

	export let globalPopupState: globalPopupState = $state({
		currentVisible: false,
		popupRecord: {
			id: 1,
			timestamp: 0,
			creator: "me",
			title: "this is title",
			content:
				"# I AM DOING THIS SHIT AGAIN, U HEARD?\n\n# XLarge Headline\n\n## Large Headline\n\n### Medium Headline\n\n#### Small Headline\n\nThis is **bold text** and this is *italic text* and this is ~~strikethrough~~\n\nThis is a longer piece of text that should wrap to multiple lines. It demonstrates how text behaves when it exceeds the width of its container.\n\n```console.log('hello, world!')```\n\n`hi chat snippet`\n\nBlock content here:\n\n+ Item A\n+ Item B\n\n\n![img](https://share.valhalladev.org/raw/20260410_001416.png)\n*cute image caption*\n\n--- \n\n | Header 1 | Header 2 | Header 3 |\n| :--- | :---: | ---: |\n| Left-aligned | Centered | Right-aligned |\n| Row 2 | Data | Data |		",
			tags: "test,hi chat",
			location: "vn",
		},
	});

	function popupRecordManager() {}
</script>

<div
	class="drop-shadow-xl bg-(--primary-element) rounded-xl h-[90vh] md:w-xl lg:w-2xl p-5 flex flex-col gap-y-5 px-5 overflow-y-scroll hide-scrollbar shadow-2xl border-4 border-(--brand-color)"
>
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
					style="color: var(--brand-color)">account_circle</span
				>
				<div class="ml-4">
					<p
						id="notify-author-name"
						class="primary-text font-semibold"
					>
						{globalPopupState.popupRecord.creator}
					</p>

					<p class="inline secondary-text text-sm">01/01/00</p>
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
					{#each globalPopupState.popupRecord.tags.split(",") as tag}
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
				class="serif text-2xl md:text-4xl font-medium w-full break-all"
			>
				AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA...
			</p>
			<p
				id="p-notify-body"
				class="primary-text md:text-lg w-full break-all"
			>
				{@html parse(globalPopupState.popupRecord.content)}
			</p>
			<signing class="text-xl serif py-3">
				>{globalPopupState.popupRecord.creator ?? "me"}</signing
			>
			<!-- <img
				src="https://share.valhalladev.org/raw/45076da80ff080aed9e1.jpg"
				alt="img"
				class="outline-4 outline-(--brand-color) outline-offset-2 rounded-xl"
			/> -->
		</div>
	</div>
	<button
		class="bg-(--secondary-text) py-2 rounded-lg sticky bottom-2 left-1/2"
	>
		okay
	</button>
</div>

<style>
	:global(#p-notify-body > *) {
		padding: 10px 0 10px 0;
		font-size: medium;
		color: var(--primary-text);
		overflow-wrap: break-word;
	}

	:global(#p-notify-body h1) {
		color: var(--primary-text);
		font-size: x-large;
	}

	:global(#p-notify-body h2) {
		color: var(--primary-text);
		font-size: large;
	}

	:global(#p-notify-body h3) {
		color: var(--secondary-text);
		font-size: medium;
	}

	:global(#p-notify-body h4) {
		color: var(--secondary-text);
		font-size: x-small;
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
		outline-offset: 2px;
		border-radius: 0.75rem;
	}

	:global(#p-notify-body > table) {
		outline: 4px solid var(--brand-color);
		outline-offset: 4px;
		padding: 2px 6px 2px 6px;
		border-radius: 5px;
		margin: 0 auto;

		width: 75%;
	}
	:global(#p-notify-body > table > tbody > tr) {
		border-top: 2px solid var(--brand-color);
	}
</style>
