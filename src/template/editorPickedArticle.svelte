<script lang="ts">
	import Title from "./components/title.svelte";
	import { getArticles } from "../script/blogEndpointFetcher";

	let { postId = 0 } = $props();

	function extractFirstImage(body: string): string {
		const imageRegex =
			/https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg|avif|bmp|tiff)(?:\?[^\s]*)?/gi;
		const matches = body.match(imageRegex);
		return (
			matches?.[0] ||
			"https://share.valhalladev.org/u/placeholder-of-all.png"
		);
	}

	function offsetImage(type: "out" | "in") {
		const el = document.getElementById("picked-image");
		if (!el) return;

		if (type === "out") {
			el.classList.remove("-right-3", "-bottom-5");
			el.classList.add("-right-4", "-bottom-6");
		} else {
			el.classList.remove("-right-4", "-bottom-6");
			el.classList.add("-right-3", "-bottom-5");
		}
	}
</script>

<div>
	<Title numberCount={2} title="my picked article" />

	{#if postId !== 0}
		{#await getArticles(1, postId)}
			<p class="secondary-text mono">loading...</p>
		{:then articles}
			{#if articles && articles.length > 0}
				{@const article = articles[0]}
				{@const imageUrl = extractFirstImage(article.Body)}

				<button
					onmouseenter={() => offsetImage("in")}
					onmouseleave={() => offsetImage("out")}
					class="w-fit cursor-pointer relative bg-(--primary-element)/75 hover:bg-(--primary-element)/90 outline-2 outline-(--brand-color)/50 hover:outline-(--brand-color) hover:outline-4 special-rounded px-2 py-3"
				>
					<div id="picked-title" class="w-[256px] *:px-2 text-start">
						<p
							class="secondary-text text-sm"
							id="picked-title-timer"
						>
							{new Date(article.Timestamp).getHours()}:{new Date(
								article.Timestamp,
							).getMinutes()} -
							{new Date(article.Timestamp).getDay()}/{new Date(
								article.Timestamp,
							).getMonth()}/{new Date(
								article.Timestamp,
							).getFullYear()}
						</p>
						<p
							class="primary-text text-lg line-clamp-2"
							id="picked-title-title"
						>
							{article.Title}
						</p>
						<div
							id="picked-title-tags"
							class="flex flex-row items-center gap-1 secondary-text"
						>
							{#if article.Tags && article.Tags.length > 0}
								{#each article.Tags.split(",") as tag}
									<p
										class="w-fit px-3 py-1 secondary-text text-sm bg-(--primary-element) outline-1 outline-(--brand-color) rounded-xl"
									>
										{tag}
									</p>
								{/each}
							{:else}
								<p
									class="w-fit px-3 py-1 secondary-text text-sm bg-(--primary-element) outline-1 outline-(--brand-color) rounded-xl"
								>
									untagged
								</p>
							{/if}
						</div>
						<img
							class="w-[256px] opacity-0"
							src={imageUrl}
							alt={article.Title || "thumbnail"}
						/>
					</div>
					<img
						class="w-72.5 absolute -right-4 -bottom-6 rounded-3xl outline-2 outline-(--brand-color)"
						src={imageUrl}
						alt={article.Title || "thumbnail"}
						id="picked-image"
					/>
				</button>
			{:else}
				<p class="secondary-text mono">
					i havent figured which one yet LOL
				</p>
			{/if}
		{/await}
	{:else}
		<p class="secondary-text mono">i havent figured which one yet LOL</p>
	{/if}
</div>
