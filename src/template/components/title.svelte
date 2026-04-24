<script lang="ts">
	// and i still have no fucking clue on how 2 pass props
	// what happened to the old way?
	interface TitleProps {
		numberCount: number;
		title: string;
		classes?: string;
		extraFeature?: false | { icon: string; func: () => boolean };
	}

	export const { numberCount, title, classes, extraFeature }: TitleProps =
		$props();
</script>

<div>
	<div class="secondary-text *:inline mb-3 {classes}">
		<p id="counting-seg" class="text-(--brand-color) mono">
			0{numberCount}.
		</p>
		<p id="title-header">{title}</p>
		{#if extraFeature}
			<button
				onclick={async () => {
					await extraFeature.func();
				}}
				class="material-symbols-rounded cursor-pointer p-4 md:p-2"
				style="font-size: 18px; color: var(--secondary-text)"
				>{extraFeature.icon}</button
			>
		{/if}
	</div>
</div>
