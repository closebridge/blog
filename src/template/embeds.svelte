<script lang="ts">
	import Title from "./components/title.svelte";
</script>

<div class="*:pb-4 w-full px-2">
	<Title title="embed my blog" numberCount={4} />
	<div class="flex flex-col lg:flex-row lg:items-start gap-2">
		<div class="flex flex-col justify-center items-center">
			<span
				class="material-symbols-rounded primary-text"
				style="font-size: 72px">rss_feed</span
			>
			<p
				class="text-center break-all secondary-text mono bg-(--primary-element) outline-1 outline-(--brand-color) rounded-xl px-2 py-1"
			>
				https://api.nogisoft.work/personal/blog/rss
			</p>
		</div>
		<div class="flex flex-col justify-center items-center">
			<span
				class="material-symbols-rounded primary-text"
				style="font-size: 72px">api</span
			>
			<div
				class="text-center break-all secondary-text bg-(--primary-element) outline-1 outline-(--brand-color) rounded-xl px-2 py-1"
			>
				<p class="mono">
					GET: <br />https://api.nogisoft.work/personal/blog/json
				</p>
				<br />
				<p class="mono">
					URL Parameter?: amount?: number, tags?: string, postId?:
					number
				</p>
			</div>
		</div>
	</div>
</div>
