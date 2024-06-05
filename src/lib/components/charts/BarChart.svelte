<script lang="ts">
	import { daysToText } from '$lib/utils';
	import {
		Chart,
		type ChartConfiguration,
		type ChartData,
		type ChartOptions,
		type Chart as IChart
	} from 'chart.js/auto';
	import { Card } from '../ui/card';
	import CardContent from '../ui/card/card-content.svelte';

	let { chartData }: { chartData: ChartData<'bar'> } = $props();
	let chartRef: HTMLCanvasElement;
	let chart: IChart;
	const options: ChartOptions<'bar'> = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: true
			},
			tooltip: {
				callbacks: {
					label: (x) => {
						return daysToText(Number(x.formattedValue));
					}
				}
			}
		}
	};

	const createChart = () => {
		const ctx = chartRef.getContext('2d');
		if (!ctx) return;
		const config: ChartConfiguration<'bar'> = {
			data: chartData,
			options,
			type: 'bar'
		};
		chart = new Chart(ctx, config);
	};
	$effect(() => {
		if (!!chartData) {
			chart?.destroy();
			createChart();
		}
	});
</script>

<Card>
	<CardContent>
		<canvas height="480" bind:this={chartRef}></canvas>
	</CardContent>
</Card>
