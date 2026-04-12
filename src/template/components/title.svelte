<script lang="ts">
	// and i still have no fucking clue on how 2 pass props
	// what happened to the old way?
	export const {
		numberCount,
		title,
		classes,
	}: { numberCount: number; title: string; classes?: string } = $props();
</script>

<div>
	<div class="secondary-text *:inline mb-3 {classes}">
		<p id="counting-seg" class="text-(--brand-color) mono">
			0{numberCount}.
		</p>
		<p id="title-header">{title}</p>
	</div>
</div>
