<script lang="ts">
	import {
		Chart,
		type ChartConfiguration,
		type ChartOptions,
		type Chart as IChart
	} from 'chart.js/auto';
	import { Card } from '../ui/card';
	import CardContent from '../ui/card/card-content.svelte';
	import CardHeader from '../ui/card/card-header.svelte';
	import type { ILineChart } from './charts.model';

	let { data, height, width, options, title }: ILineChart = $props();
	let chartRef: HTMLCanvasElement;
	let chart: IChart;
	let defaultOptions: ChartOptions<'line'> = {
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
		const config: ChartConfiguration<'line'> = {
			data,
			options: defaultOptions,
			type: 'line'
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
	<CardHeader>{title}</CardHeader>
	<CardContent>
		<canvas {height} {width} bind:this={chartRef}></canvas>
	</CardContent>
</Card>
