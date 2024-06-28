<script lang="ts">
	import { Download } from 'lucide-svelte';
	import * as papa from 'papaparse';
	import Button from './ui/button/button.svelte';

	export let data: unknown[];
	const downloadCSVData = () => {
		if (!data) return;
		const csv = papa.unparse(data);

		const anchor = document.createElement('a');
		anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
		anchor.target = '_blank';
		anchor.download = 'report.csv';
		anchor.click();
	};
</script>

<Button variant="secondary" disabled={!data} on:click={downloadCSVData}>
	<Download />
</Button>
