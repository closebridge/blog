<script lang="ts">
	import Title from "./components/title.svelte";
	import { getTags } from "../script/blogEndpointFetcher";

	function tagSizing(count: number, kind: "text" | "opacity" | "padding") {
		const baseSizes = {
			text: {
				"0": "text-md font-light",
				"1": "text-lg",
				"3": "text-xl font-medium",
				"6": "text-2xl font-semibold",
				"10": "text-3xl font-bold",
				"20": "text-4xl font-black",
			},
			opacity: {
				"0": "bg-opacity-20 outline-1",
				"1": "bg-opacity-30 outline-2",
				"3": "bg-opacity-40 outline-3",
				"6": "bg-opacity-50 outline-4",
				"10": "bg-opacity-60 outline-5",
				"20": "bg-opacity-70 outline-6",
			},
			padding: {
				"0": "px-2 py-1",
				"1": "px-3 py-2",
				"3": "px-4 py-3",
				"6": "px-5 py-4",
				"10": "px-6 py-5",
				"20": "px-7 py-6",
			},
		};

		if (count < 1) return baseSizes[kind]["0"];
		if (count < 3) return baseSizes[kind]["1"];
		if (count < 6) return baseSizes[kind]["3"];
		if (count < 10) return baseSizes[kind]["6"];
		if (count < 20) return baseSizes[kind]["10"];
		if (count < 30) return baseSizes[kind]["20"];

		// For counts >= 30, return the largest size
		return kind === "text" ? "text-4xl font-black" : "bg-opacity-80";
	}
</script>

<div>
	<Title title="tag heatmap" numberCount={4} />
	<!-- FUTURE: make elemnt actually packed tightly -->
	<div class="flex justify-center">
		<div
			id="heattag-parent"
			class="flex flex-wrap justify-center items-center pt-2 md:pt-10 gap-1

			*:self-start *:leading-none *:inline *:primary-text *:text-(--primary-text) wrap-break-word *:bg-(--brand-diluted) *:outline-1 *:outline-(--brand-color) *:rounded-md"
		>
			{#await getTags()}
				<p class="secondary-text font-mono">hold on...</p>
			{:then tags}
				{#each Object.entries(tags) as tag}
					<p
						class="
						{tagSizing(tag[1], 'text')}
						{tagSizing(tag[1], 'opacity')}
						{tagSizing(tag[1], 'padding')}
					"
					>
						{tag[0]}
					</p>
				{/each}
			{/await}
		</div>
	</div>
</div>
