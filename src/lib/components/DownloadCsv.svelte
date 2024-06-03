<script lang="ts">
	import { Download } from 'lucide-svelte';
	import Button from './ui/button/button.svelte';
	export let jsonData: unknown[];

	const createCsv = () => {
		console.log({ jsonData });
	};
</script>

<Button variant="outline" on:click={createCsv}>
	<Download />
</Button>
