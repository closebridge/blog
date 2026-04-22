<script lang="ts">
	import "./app.css";
	import "./style/color.css";
	import "./style/font.css";
	import "./style/button.css";

	import Title from "./template/components/title.svelte";
	import ArticleViewer from "./template/components/articleViewer.svelte";

	import Header from "./template/header.svelte";
	import MyThought from "./template/myThought.svelte";
	import EditorPickedArticle from "./template/editorPickedArticle.svelte";
	import TagHeatmap from "./template/tagHeatmap.svelte";
	import Embeds from "./template/embeds.svelte";
	import Footer from "./template/footer.svelte";
	import Editor from "./template/editor.svelte";

	import {
		getArticles,
		type ArticleStructure,
	} from "./script/blogEndpointFetcher";
	import Article from "./template/components/article.svelte";

	import pageStatusFetcher from "./script/pageStatusFetcher";
	import { type PageStatus } from "./script/pageStatusFetcher";

	let favePostId: number = $state(0);
	let pageStatusResult = $state<PageStatus | null>(null);

	$effect(() => {
		// This runs when component mounts
		pageStatusFetcher().then((result) => {
			pageStatusResult = result;
			favePostId = result.FavoritePostId;
		});
	});
</script>

<div
	class="flex flex-col md:items-center justify-center gap-16 my-8 md:mx-0 mx-3
	sm:px-4 md:px-20 lg:px-40"
>
	<Header />
	<div class="flex md:flex-row justify-around flex-col md:gap-0">
		{#if pageStatusResult}
			<MyThought
				Comment={pageStatusResult.Comment}
				CommentOwner={pageStatusResult.CommentOwner}
				CommentTimestamp={pageStatusResult.CommentTimestamp}
				FavoritePostId={pageStatusResult.FavoritePostId}
				isLoading={false}
			/>
		{:else}
			<MyThought
				Comment={"no cant do..."}
				CommentOwner={"nogc"}
				CommentTimestamp={1776432350603}
				FavoritePostId={1}
				isLoading={false}
			/>
		{/if}

		<br />
		<br />

		<EditorPickedArticle postId={favePostId} />
	</div>

	<div>
		<Title numberCount={3} title="my articles" classes="align-center" />

		<div class="grid grid-cols-2 items-start md:items-center gap-6 mx-4">
			{#await getArticles(5, 0)}
				<p>Loading...</p>
			{:then articles}
				{#if articles}
					{#each articles as article}
						{console.log(article)}
						<Article
							PostId={article.PostId}
							Timestamp={article.Timestamp}
							Tags={article.Tags}
							Creator={article.Creator}
							Title={article.Title}
							Body={article.Body}
							Location={article.Location}
						/>
					{/each}
				{/if}
			{:catch error}
				<p>{error}</p>
			{/await}
		</div>
	</div>
	<div
		class="flex items-start
		flex-col md:flex-row gap-10"
	>
		<TagHeatmap />

		<Embeds />
	</div>
	<Footer />
</div>
