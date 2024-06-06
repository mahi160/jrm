<script lang="ts">
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import type { IIssueList } from '$lib/models/issue.model';
	import type { ChartData } from 'chart.js/auto';
	import dayjs from 'dayjs';

	let { rawData }: { rawData: any[] } = $props();

	const orgData = (payload: IIssueList[]): ChartData<'bar'> => {
		if (!payload) return {} as any;
		const temp: { [key: string]: { created: number; updated: number } } = {};
		payload.forEach((issue) => {
			const created = dayjs(issue.created).format('YYYY-MM-DD');
			const updated = issue.updated ? dayjs(issue.updated).format('YYYY-MM-DD') : null;
			if (!temp[created]) temp[created] = { created: 0, updated: 0 };
			if (updated && !temp[updated]) temp[updated] = { created: 0, updated: 0 };
			temp[created].created++;
			updated && temp[updated].updated++;
		});
		return {
			labels: Object.keys(temp).sort(),
			datasets: [
				{
					label: 'Created',
					data: Object.values(temp).map((item) => item.created)
				},
				{
					label: 'Updated',
					data: Object.values(temp).map((item) => item.updated)
				}
			]
		};
	};

	const chartData: ChartData<'bar'> = $derived(orgData(rawData));
</script>

<BarChart {chartData} />
