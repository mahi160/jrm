<script lang="ts">
	import { Download } from 'lucide-svelte';
	import * as papa from 'papaparse';
	import Button from './ui/button/button.svelte';

	export let data: unknown[];
	const downloadCSVData = () => {
		const csv = papa.unparse(data);

		const anchor = document.createElement('a');
		anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
		anchor.target = '_blank';
		anchor.download = 'nameYourFileHere.csv';
		anchor.click();
	};
</script>

<Button variant="outline" on:click={downloadCSVData}>
	<Download />
</Button>
