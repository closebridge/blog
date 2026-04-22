<script lang="ts">
	// import Title from "./components/title.svelte";
	import { type ArticleStructure } from "../../script/blogEndpointFetcher";
	let {
		articleIdentifier = `article-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
		PostId,
		Timestamp,
		Tags,
		Creator,
		Title,
		Body,
		Location,
	}: ArticleStructure & { articleIdentifier?: string } = $props();

	function scaleImageOnHover(
		type: "in" | "out",
		elementId: string = `${articleIdentifier}-image`,
	) {
		const selectedElement = document.getElementById(elementId);

		if (!selectedElement) return;

		if (type == "in") {
			selectedElement.classList.add("scale-110");
		} else {
			selectedElement.classList.remove("scale-110");
		}
	}
</script>

<button
	id={articleIdentifier}
	onmouseenter={() => scaleImageOnHover("in")}
	onmouseleave={() => scaleImageOnHover("out")}
	class="cursor-pointer text-start flex flex-col md:flex-row list-image-none bg-(--primary-element) special-rounded outline-1 outline-(--brand-color) w-full overflow-hidden"
>
	<div class="w-full md:w-36 h-36 overflow-hidden special-rounded shrink-0">
		<img
			id="{articleIdentifier}-image"
			class="w-full h-full object-cover transition-transform"
			src={(() => {
				// regex to find cdn img urls, then use the first one
				// also use placeholder if none
				const imageRegex =
					/https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg|avif|bmp|tiff)(?:\?[^\s]*)?/gi;
				const matches = Body.match(imageRegex);
				if (matches && matches.length > 0) {
					return matches[0];
				}
				return "https://share.valhalladev.org/u/placeholder-of-all.png";
			})()}
			alt="h"
		/>
	</div>

	<div class="mx-2 my-2 min-w-0">
		<p class="secondary-text px-2">
			<!-- {new Date(Timestamp).toLocaleString()} -->
			{new Date(Timestamp).getHours()}:{new Date(Timestamp).getMinutes()} -
			{new Date(Timestamp).getDay()}/{new Date(
				Timestamp,
			).getMonth()}/{new Date(Timestamp).getFullYear()}
		</p>
		<p
			class="primary-text text-md line-clamp-4 overflow-hidden px-1
			md:line-clamp-2 md:px-2 md:text-lg"
		>
			{Title.slice(0, 30)}
		</p>
		<div
			class="flex flex-row overflow-x-hidden p-1 gap-1 secondary-text
			*:px-2 *:py-1 *:outline *:outline-(--brand-color) *:rounded-xl *:w-fit *:line-clamp-1"
		>
			{#each Tags.split(",") as tag}
				<p>{tag}</p>
			{/each}
		</div>
	</div>
</button>
