<script lang="ts">
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import LineChart from '$lib/components/charts/LineChart.svelte';
	import type { IIssueList } from '$lib/models/issue.model';
	import type { ChartData } from 'chart.js/auto';
	import dayjs from 'dayjs';

	let { rawData }: { rawData: any[] } = $props();

	const orgData = (payload: IIssueList[]): ChartData<'bar'> => {
		if (!payload) return {} as any;
		const temp: { [key: string]: { created: number; updated: number } } = {};
		payload.forEach((issue) => {
			const created = issue.created ? dayjs(issue.created).format('YYYY-MM-DD') : null;
			const updated = issue.updated ? dayjs(issue.updated).format('YYYY-MM-DD') : null;
			if (created && !temp[created]) temp[created] = { created: 0, updated: 0 };
			if (updated && !temp[updated]) temp[updated] = { created: 0, updated: 0 };
			created && temp[created].created++;
			updated && temp[updated].updated++;
		});
		const dates = Object.keys(temp).sort((a, b) => (a > b ? 1 : -1));
		const dataToReturn: ChartData<'bar'> = {
			labels: dates.map((date) => dayjs(date).format('MMM DD')),
			datasets: [
				{
					label: 'Resolved',
					data: dates.map((item) => temp[item].created)
				},
				{
					label: 'Created',
					data: dates.map((item) => temp[item].updated)
				}
			]
		};
		return dataToReturn;
	};

	const createLineChart = () => {
		if (!rawData) return {} as any;

		const data = orgData(rawData);
		const lineChartData: ChartData<'line'> = {
			labels: data.labels,
			datasets: [
				{
					label: 'Resolved',
					data: []
				},
				{
					label: 'Created',
					data: []
				}
			]
		};
		data.datasets[0].data.reduce(
			(acc, value, index) =>
				(lineChartData.datasets[0].data[index] = (acc as number) + (value as number)),
			0
		);
		data.datasets[1].data.reduce(
			(acc, value, index) =>
				(lineChartData.datasets[1].data[index] = (acc as number) + (value as number)),
			0
		);
		return lineChartData;
	};
	const chartData: ChartData<'bar'> = $derived(orgData(rawData));
	const lineChartData: ChartData<'line'> = $derived(createLineChart());
</script>

<BarChart data={chartData} height={400} title="Issues by date" />
<LineChart data={lineChartData} height={400} title="Trend of Issues by date" />
