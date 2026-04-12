<script>
	import Title from "./components/title.svelte";
</script>

<div class="flex flex-col justify-start gap-y-3">
	<Title numberCount={1} title="my latest comment" />

	<p id="displayed_thought" class="primary-text text-3xl bold serif">
		<span>"</span>
		XDDDDDD
	</p>

	<p id="thought_author" class="secondary-text"><span>-</span> nogc, 2026</p>

	<div id="special_data">
		<p class="mono secondary-text text-sm">
			unix timestamp: <span class="mono font-thin">234567894323</span>
		</p>
		<p class="mono secondary-text text-sm">
			public pgp key:
			<a
				href="/my-pgp-key.txt"
				class="mono font-thin underline text-center"
				>my-pgp-key.txt
				<span class="material-symbols-rounded">arrow_outward</span>
			</a>
		</p>
	</div>
</div>
