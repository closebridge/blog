<script lang="ts">
	import "./app.css";
	import "./style/color.css";
	import "./style/font.css";
	import "./style/button.css";

	import Title from "./template/components/title.svelte";

	import Header from "./template/header.svelte";
	import MyThought from "./template/myThought.svelte";
	import EditorPickedArticle from "./template/editorPickedArticle.svelte";
	import AllArticles from "./template/allArticles.svelte";
	import TagHeatmap from "./template/tagHeatmap.svelte";
	import Embeds from "./template/embeds.svelte";
	import Footer from "./template/footer.svelte";
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
		<MyThought />
		<EditorPickedArticle />
	</div>
	<div>
		<Title numberCount={3} title="my articles" classes="align-center" />
		<div class="grid grid-cols-2 items-start md:items-center gap-6 mx-4">
			<AllArticles />
			<AllArticles />
			<AllArticles />
			<AllArticles />
			<AllArticles />
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
