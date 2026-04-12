<script lang="ts">
	import Title from "./components/title.svelte";
</script>

<div>
	<Title title="tag heatmap" numberCount={4} />
	<!-- <div
	id="heattag-parent"
	class="w-1/2 min-h-33 flex flex-wrap gap-2 items-start justify-center content-start
	*:self-start *:primary-text *:bg-(--primary-element) *:text-(--primary-text) *:outline *:outline-(--brand-color) *:rounded-2xl *:py-2 *:px-4"
> -->

	<!-- FUTURE: make elemnt actually packed tightly -->
	<div
		id="heattag-parent"
		class="w-full min-h-33 flex flex-wrap auto-rows-min gap-2 items-start justify-center content-start
	*:self-start *:primary-text *:bg-(--primary-element) *:text-(--primary-text) *:outline *:outline-(--brand-color) *:rounded-2xl *:py-2 *:px-4"
	>
		<button class="text-3xl">tg1</button>
		<button class="">tag2</button>
		<button class="text-lg">tAag3</button>
		<button class="text-2xl">taAAAAg4</button>
		<button class="text-sm">tag5</button>
		<button class="text-xl">tag67</button>
		<button class="text-lg">tagggg</button>
		<button class="text-xs">t1</button>
	</div>
</div>
