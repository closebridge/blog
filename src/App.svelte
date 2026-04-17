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

	import {
		getArticles,
		type ArticleStructure,
	} from "./script/articleFetcher";
	import Article from "./template/components/article.svelte";

	import PageStatusFetcher from "./script/PageStatusFetcher";
	import { type PageStatus } from "./script/PageStatusFetcher";
</script>

<div
	class="flex flex-col items-startmd:items-center justify-center gap-16 my-8 md:mx-0 mx-3
	"
>
	<Header />
	<div
		class="flex md:flex-row justify-around
		flex-col gap-5 md:gap-0"
	>
		{#await PageStatusFetcher()}
			<MyThought
				Comment={"let me think about this..."}
				CommentOwner={"nogc"}
				CommentTimestamp={1776432350603}
				FavoritePostId={1}
				isLoading={false}
			/>
		{:then pageStatus}
			<MyThought
				Comment={pageStatus.Comment}
				CommentOwner={pageStatus.CommentOwner}
				CommentTimestamp={pageStatus.CommentTimestamp}
				FavoritePostId={pageStatus.FavoritePostId}
				isLoading={false}
			/>
		{/await}
		<EditorPickedArticle />
	</div>
	<div>
		<Title numberCount={3} title="my articles" classes="align-center" />
		<div class="grid grid-cols-2 items-start md:items-center gap-6 mx-4">
			{#await getArticles(6)}
				<p>Loading...</p>
			{:then articles}
				{#if articles}
					{#each articles as article}
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
		class="flex md:flex-row items-start
		flex-col"
	>
		<TagHeatmap />
		<Embeds />
	</div>
	<Footer />
</div>
