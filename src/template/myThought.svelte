<script lang="ts">
	import Title from "./components/title.svelte";
	import { type PageStatus } from "../script/pageStatusFetcher";

	const {
		Comment,
		CommentOwner,
		CommentTimestamp,
		FavoritePostId,
		isLoading,
	}: PageStatus & { isLoading: boolean } = $props();

	// console.log(CommentTimeStamp);
</script>

<div class="flex flex-col justify-start gap-y-3">
	<Title numberCount={1} title="my latest comment" />

	<p id="displayed_thought" class="primary-text text-3xl bold serif">
		<span>"</span>
		{!isLoading ? Comment : "let me think about this..."}
	</p>

	<p id="thought_author" class="secondary-text">
		<span>-</span>
		{!isLoading ? CommentOwner : "nogc"}
		,
		{!isLoading
			? (new Date(CommentTimestamp).getFullYear() ?? 1776432350603)
			: 1776432350603}
	</p>

	<div id="special_data">
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
				<span class="material-symbols-rounded">arrow_outward</span>
			</a>
		</p>
	</div>
</div>
