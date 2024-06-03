<script lang="ts">
	import { daysToText } from '$lib/utils';
	import { Chart, type ChartConfiguration, type Chart as IChart } from 'chart.js/auto';
	import { Card } from '../ui/card';
	import CardContent from '../ui/card/card-content.svelte';
	import type { IBarChartData } from './charts.model';
	let { data, key }: { data: Array<unknown>; key: { x: string; y: string } } = $props();
	let chartRef: HTMLCanvasElement;
	let chart: IChart;
	const convertData = (): IBarChartData[] => {
		return data.map((d: any) => ({ name: d[key.x], value: d[key.y] }));
	};
	const createChart = () => {
		const ctx = chartRef.getContext('2d');
		if (!ctx) return;
		const data = convertData();
		const config: ChartConfiguration<'bar'> = {
			data: {
				datasets: [
					{
						data: data.map((d) => d.value),
						label: 'Issue lifetime'
					}
				],
				labels: data.map((d) => d.name)
			},
			options: {
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
			},
			type: 'bar'
		};
		chart = new Chart(ctx, config);
	};
	$effect(() => {
		if (data) {
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
