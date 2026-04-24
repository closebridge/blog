<script lang="ts">
	import Title from "./components/title.svelte";
	import { type PageStatus } from "../script/pageStatusFetcher";
	import { editBlogPageStat } from "../script/editorHandler.svelte";
	import { isInEditingGetter } from "../script/editorHandler.svelte";

	const {
		Comment,
		CommentOwner,
		CommentTimestamp,
		FavoritePostId,
		isLoading,
	}: PageStatus & { isLoading: boolean } = $props();

	// console.log(CommentTimeStamp);
</script>

<div class="flex flex-col justify-start">
	{#if isInEditingGetter()}
		<Title
			numberCount={1}
			title="my latest comment"
			extraFeature={{
				icon: "edit",
				func: () => editBlogPageStat("comment"),
			}}
		/>
	{:else}
		<Title numberCount={1} title="my latest comment" extraFeature={false} />
	{/if}

	<p id="displayed_thought" class="primary-text text-3xl bold serif">
		<span>"</span>
		{!isLoading ? Comment : "ehhh..."}
	</p>

	<p id="thought_author" class="secondary-text pb-2">
		<span>-</span>
		{!isLoading ? CommentOwner : "nogc"}
		,
		{!isLoading
			? (new Date(CommentTimestamp).getFullYear() ?? 1776432350603)
			: 1776432350603}
	</p>

	<div id="special_data ">
		<p class="mono secondary-text text-sm">
			unix timestamp: <span class="mono font-thin">
				{!isLoading ? CommentTimestamp : 1776432350603}
			</span>
		</p>
		<p class="mono secondary-text text-sm">
			public pgp key:
			<a
				href="/my-pgp-key.txt"
				class="mono font-thin underline text-center"
				>my-pgp-key.txt
				<span
					class="material-symbols-rounded inline"
					style="font-size: 12px">arrow_outward</span
				>
			</a>
		</p>
	</div>
</div>
