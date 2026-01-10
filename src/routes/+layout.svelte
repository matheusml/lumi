<script lang="ts">
	import '../app.css'

	interface Props {
		children: import('svelte').Snippet
	}

	let { children }: Props = $props()
</script>

<div class="app-container">
	{@render children()}
</div>

<style>
	.app-container {
		min-height: 100vh;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
	}
</style>
