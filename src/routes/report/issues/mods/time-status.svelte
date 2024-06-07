<script lang="ts">
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import Overall from './time-status/overall.svelte';

	let { rawData }: any = $props();
	let showOverall = $state(true);
</script>

<div class="flex gap-2">
	<span class:text-gray-300={!showOverall}>Show issue by issue</span>
	<Switch bind:checked={showOverall} />
	<span class:text-gray-300={showOverall}>Show overall</span>
</div>
{#if showOverall}
	<Overall {rawData} />
{:else}
	<p>Coming soon</p>
{/if}
