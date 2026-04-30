<script lang="ts" module>
	import EasyMDE from "easymde";
	import { type ArticleStructure } from "../script/blogEndpointFetcher";

	// const editor = new EasyMDE();

	export interface EditorRef {
		editorType: "create" | "edit" | null;
		selectedArticle: ArticleStructure | null;
	}
	export let editorRef: EditorRef = {
		editorType: null,
		selectedArticle: null,
	};
</script>

<!-- <textarea bind:this={editor.codemirror}></textarea> -->
