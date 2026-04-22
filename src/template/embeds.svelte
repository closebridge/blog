<script lang="ts">
	import Title from "./components/title.svelte";
</script>

<div class=" w-full px-2">
	<Title title="embed my blog" numberCount={5} />
	<div class="flex flex-col md:flex-row items-start gap-2">
		<div class="flex flex-col justify-center items-start md:w-1/2 h-full">
			<span
				class="material-symbols-rounded primary-text"
				style="font-size: 72px">rss_feed</span
			>
			<p
				class="text-start break-all secondary-text mono bg-(--primary-element) outline-1 outline-(--brand-color) rounded-xl px-2 py-1"
			>
				https://api.nogisoft.work/personal/blog/rss
			</p>
		</div>
		<div class="flex flex-col justify-center items-start md:w-1/2">
			<span
				class="material-symbols-rounded primary-text"
				style="font-size: 72px">api</span
			>
			<div
				class="text-start break-all secondary-text bg-(--primary-element) outline-1 outline-(--brand-color) rounded-xl px-2 py-1"
			>
				<p class="mono">
					GET: <br />https://api.nogisoft.work/personal/blog/json
				</p>
			</div>
			<p class="secondary-text text-sm mono px-2">
				URL Parameter?: amount?: number, tags?: string, postId?: number
			</p>
		</div>
	</div>
</div>
