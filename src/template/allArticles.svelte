<script lang="ts">
	// import Title from "./components/title.svelte";
	const articleIdentifier = String(Date.now());

	// TODO: makes articleIdentier not misleading with others for some reason?
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

	// export const { articleItems } = $props();
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
			src="https://share.valhalladev.org/u/placeholder-of-all.png"
			alt="h"
		/>
	</div>

	<div class="mx-2 my-2 min-w-0">
		<p class="secondary-text px-2">00:00 1st jan 25</p>
		<p
			class="primary-text text-md line-clamp-4 overflow-hidden px-1
			md:line-clamp-2 md:px-2 md:text-lg"
		>
			test long long very longtest long long very long test long long very
			long
		</p>
		<div
			class="flex flex-row overflow-x-hidden p-1 gap-1
			*:px-2 *:py-1 *:outline *:outline-(--brand-color) *:rounded-xl *:w-fit"
		>
			<p>dev</p>
			<p>devXDDDDDD</p>
			<p>dev</p>
			<p>dev</p>
		</div>
	</div>
</button>
