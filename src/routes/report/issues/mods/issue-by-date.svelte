<script lang="ts">
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import type { IIssueList } from '$lib/models/issue.model';
	import type { ChartData } from 'chart.js/auto';

	let { rawData }: { rawData: any[] } = $props();

	const orgData = (payload: IIssueList[]): ChartData<'bar'> => {
		if (!payload) return {} as any;
		const temp: { [key: string]: { created: number; updated: number } } = {};
		payload.forEach((item) => {
			const c = item.created;
			const r = item.updated;
			if (!(c in temp)) {
				temp[c] = { created: 0, updated: 0 };
			}
			if (r && !(r in temp)) {
				temp[r] = { created: 0, updated: 0 };
			}
			if (temp[c]) {
				temp[c].created += 1;
			} else {
				temp[c]['created'] = 1;
			}
			if (r) {
				if (temp[r]) {
					temp[r].updated += 1;
				} else {
					temp[r]['updated'] = 1;
				}
			}
		});
		return {
			datasets: [
				{ data: Object.values(temp).map((x) => x.created) },
				{ data: Object.values(temp).map((x) => x.updated) }
			],
			labels: Object.keys(temp)
		};
	};
	const chartData: ChartData<'bar'> = $derived(orgData(rawData));
</script>

<BarChart {chartData} />
