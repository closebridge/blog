<script>
	import { isInEditingGetter } from "../script/editorHandler.svelte";
</script>

<header
	id="blog-header"
	class="col-span-2 flex flex-row md:justify-evenly justify-start"
>
	<div class="flex flex-row justify-between items-center">
		<p class="serif text-2xl primary-text bold ml-1/4 md:ml-0">
			nogc @
			<span class="text-(--brand-color) serif bold">
				blog
				{#if isInEditingGetter()}
					<span class="text-(--brand-color) serif font-mono"
						>(ediotr mod)</span
					>
				{/if}
			</span>
		</p>
		<div class="flex flex-row gap-3 items-center justify-center"></div>
	</div>
	<div class="md:block disabled"></div>
	<div class="md:block disabled"></div>
</header>
