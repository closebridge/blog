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

	import { getPageStatus, type PageStatus } from "./script/pageStatusFetcher";
	import { verifyForAuthentication } from "./script/blogEndpointFetcher";
	import {
		isInEditingGetter,
		isInEditingSetter,
	} from "./script/editorHandler.svelte";

	let favePostId: number = $state(0);
	let pageStatusResult = $state<PageStatus | null>(null);

	$effect(() => {
		// This runs when component mounts
		getPageStatus().then((result) => {
			pageStatusResult = result;
			favePostId = result.FavoritePostId;
		});
	});
	const urlParms = document.location.href.split("/");

	if (urlParms[urlParms.length - 1] === "edit" && !isInEditingGetter()) {
		const maxAttempts = 3;

		(async function attemptAuth(attempts = 0) {
			if (attempts >= maxAttempts) return;

			const promptResult = prompt("pls provide the auth code <3");
			if (promptResult === null) {
				alert("canceled");
				return;
			}

			const authCode = parseInt(promptResult);
			if (isNaN(authCode)) {
				alert("wrong.");
				return attemptAuth(attempts + 1);
			}

			const result = await verifyForAuthentication(authCode);

			if (result) {
				isInEditingSetter(true);
				alert("welcome me!");
			} else if (result == null) {
				alert("not authenticated");
				isInEditingSetter(false);
			} else {
				alert("wrong.");
				return attemptAuth(attempts + 1);
			}
		})();
	}
</script>

<div
	class="flex flex-col md:items-center justify-center gap-16 my-8 md:mx-0 mx-3
	sm:px-4 md:px-20 lg:px-40"
>
	<Header />
	<div class="flex md:flex-row justify-around flex-col w-full">
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
				Comment={"...pretend this isnt an error message"}
				CommentOwner={"svelte v5's {:else}"}
				CommentTimestamp={1776432350603}
				FavoritePostId={1}
				isLoading={false}
			/>
		{/if}

		<br />
		<br />

		<EditorPickedArticle postId={favePostId} />
	</div>

	<div class="w-full">
		{#if isInEditingGetter()}
			<Title
				numberCount={3}
				title="my articles"
				classes="align-center"
				extraFeature={{ icon: "edit", func: () => true }}
			/>
		{:else}
			<Title numberCount={3} title="my articles" classes="align-center" />
		{/if}

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
				{:else}
					<div>
						<p class="secondary-text mono">too bad then...</p>
						<p class="secondary-text mono">too bad then...</p>
						<p class="secondary-text mono">too bad then...</p>
						<p class="secondary-text mono">too bad then...</p>
						<p class="secondary-text mono">too bad then...</p>
						<p class="secondary-text mono">too bad then...</p>
					</div>
					<img
						src="https://share.valhalladev.org/u/o%20my%20god%20pls.webp"
						alt="server(less)'s down!!!!!"
						class="w-sm rounded-2xl outline-1 outline-(--brand-color)"
					/>
				{/if}
			{:catch}
				<div>
					<p class="secondary-text mono">cant find any, my fault.</p>
					<p class="secondary-text mono">cant find any, my fault.</p>
					<p class="secondary-text mono">cant find any, my fault.</p>
					<p class="secondary-text mono">cant find any, my fault.</p>
					<p class="secondary-text mono">cant find any, my fault.</p>
					<p class="secondary-text mono">cant find any, my fault.</p>
				</div>
				<img
					src="https://share.valhalladev.org/u/o%20my%20god%20pls.webp"
					alt="server(less)'s down!!!!!"
					class="w-sm rounded-2xl outline-1 outline-(--brand-color)"
				/>
			{/await}
		</div>
	</div>
	<div
		class="flex items-start
		flex-col md:flex-row gap-10 w-full"
	>
		<TagHeatmap />

		<Embeds />
	</div>
	<Footer />
</div>
