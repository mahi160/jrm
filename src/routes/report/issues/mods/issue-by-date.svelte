<script lang="ts">
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import type { ChartData } from 'chart.js/auto';

	let { rawData }: { rawData: any[] } = $props();
	const chartData: ChartData<'bar'> = $derived({
		datasets: [
			{ data: rawData ? Object.values(rawData)?.map((x) => x.created) : [] },
			{ data: rawData ? Object.values(rawData)?.map((x) => x.resolution) : [] }
		],
		labels: rawData ? Object.keys(rawData) : []
	});
</script>

{JSON.stringify(chartData)}
<BarChart {chartData} />
