<script lang="ts">
	import {
		Chart,
		type ChartConfiguration,
		type ChartOptions,
		type Chart as IChart
	} from 'chart.js/auto';
	import { Card } from '../ui/card';
	import CardContent from '../ui/card/card-content.svelte';
	import type { IBarChart } from './charts.model';

	let { data, height, width, options }: IBarChart = $props();
	let chartRef: HTMLCanvasElement;
	let chart: IChart;
	let defaultOptions: ChartOptions<'bar'> = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: true
			}
		}
	};

	const createChart = () => {
		const ctx = chartRef.getContext('2d');
		if (!ctx) return;
		if (!data) return;

		if (options) defaultOptions = { ...defaultOptions, ...options };
		const config: ChartConfiguration<'bar'> = {
			data,
			options: defaultOptions,
			type: 'bar'
		};
		chart = new Chart(ctx, config);
	};
	$effect(() => {
		if (!!data) {
			chart?.destroy();
			createChart();
		}
	});
</script>

<Card>
	<CardContent>
		<canvas {height} {width} bind:this={chartRef}></canvas>
	</CardContent>
</Card>
