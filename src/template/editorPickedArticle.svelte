<script lang="ts">
	import Title from "./components/title.svelte";

	function offsetImage(type: "out" | "in") {
		// alert(type);
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
	<button
		onmouseenter={() => offsetImage("in")}
		onmouseleave={() => offsetImage("out")}
		class="w-fit cursor-pointer relative bg-(--primary-element)/75 hover:bg-(--primary-element)/90 outline-2 outline-(--brand-color)/50 hover:outline-(--brand-color) hover:outline-4 special-rounded px-2 py-3"
	>
		<div id="picked-title" class="w-[256px] *:px-2 text-start">
			<p class="secondary-text text-sm mono" id="picked-title-timer">
				00:00 - 1st jan 20
			</p>
			<p
				class="primary-text text-lg line-clamp-2"
				id="picked-title-title"
			>
				test: test test test test test test test test test test
			</p>
			<div
				id="picked-title-tags "
				class="flex flex-row items-center gap-1 secondary-text"
			>
				<p
					class="w-fit px-3 py-1 secondary-text text-sm bg-(--primary-element) outline-1 outline-(--brand-color) rounded-xl"
				>
					1
				</p>
				<p
					class="w-fit px-3 py-1 secondary-text text-sm bg-(--primary-element) outline-1 outline-(--brand-color) rounded-xl"
				>
					2
				</p>
				<p
					class="w-fit px-3 py-1 secondary-text text-sm bg-(--primary-element) outline-1 outline-(--brand-color) rounded-xl"
				>
					3
				</p>
			</div>
			<img
				class="w-[256px] opacity-0"
				src="https://share.valhalladev.org/u/placeholder-of-all.png"
				alt="hi"
			/>
		</div>
		<img
			class="w-[290px] absolute -right-4 -bottom-6 rounded-3xl outline-2 outline-(--brand-color)"
			src="https://share.valhalladev.org/u/placeholder-of-all.png"
			alt="hi"
			id="picked-image"
		/>
	</button>
</div>
