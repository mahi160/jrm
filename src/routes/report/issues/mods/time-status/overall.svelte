<script lang="ts">
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table/index.js';
	import { secondsToYMDHMS } from '$lib/utils';
	import type { ChartData, ChartOptions } from 'chart.js/auto';
	import dayjs from 'dayjs';

	interface LogEntry {
		timestamp: string;
		to: string;
	}

	interface TimeStatus {
		count: number;
		total: number;
		average: number;
	}
	let { rawData }: any = $props();
	let orgData = $derived(rawData && createOrgData(rawData));
	let chartData = $derived(orgData && createChart(orgData));
	let options: ChartOptions<'bar'> = {
		plugins: {
			tooltip: {
				callbacks: {
					label: (x) => {
						return '' + secondsToYMDHMS(x.raw as number);
					}
				}
			}
		}
	};

	function createChart(data: Record<string, TimeStatus>): ChartData<'bar'> {
		const labels = Object.keys(data).sort();
		const counts = labels.map((key) => data[key].count);
		const totals = labels.map((key) => Math.abs(data[key].total));
		const averages = labels.map((key) => Math.abs(data[key].average));

		return {
			labels,
			datasets: [
				{
					data: counts,
					label: 'Count',
					backgroundColor: '#3b82f6',
					borderColor: '#3b82f6',
					borderWidth: 1
				},
				{
					data: totals,
					label: 'Total',
					backgroundColor: '#f58518',
					borderColor: '#f58518',
					borderWidth: 1
				},
				{
					data: averages,
					label: 'Average',
					backgroundColor: '#ef4444',
					borderColor: '#ef4444',
					borderWidth: 1
				}
			]
		};
	}

	function createOrgData(data: LogEntry[]): Record<string, TimeStatus> {
		let prevTimestamp = 0;
		const timeStatus: Record<string, TimeStatus> = {};
		let prevStatus: string | null = null;

		for (const entry of data) {
			const { timestamp, to } = entry;
			const timeInSeconds = dayjs(timestamp).unix();

			if (prevTimestamp && prevStatus !== null) {
				const diff = timeInSeconds - prevTimestamp;

				if (!timeStatus[prevStatus]) {
					timeStatus[prevStatus] = { count: 0, total: 0, average: 0 };
				}

				const status = timeStatus[prevStatus];
				status.count += 1;
				status.total += diff;
				status.average = status.total / status.count;
			}

			prevTimestamp = timeInSeconds;
			prevStatus = to;
		}

		return timeStatus;
	}
</script>

<Card class="overflow-auto">
	<CardHeader>Time Status</CardHeader>
	<CardContent>
		<BarChart data={chartData} height={400} {options} />
	</CardContent>
</Card>

<Card class=" overflow-auto">
	<CardHeader>List of data</CardHeader>
	<CardContent>
		<Table.Root>
			<Table.Caption>A list</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head>Status</Table.Head>
					<Table.Head>Count</Table.Head>
					<Table.Head>Total</Table.Head>
					<Table.Head>Average</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if orgData}
					{#each Object.keys(orgData) as key}
						<Table.Row>
							<Table.Cell class="font-medium">{key}</Table.Cell>
							<Table.Cell>{orgData[key].count}</Table.Cell>
							<Table.Cell>{secondsToYMDHMS(orgData[key].total)}</Table.Cell>
							<Table.Cell>{secondsToYMDHMS(orgData[key].average)}</Table.Cell>
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
		</Table.Root>
	</CardContent>
</Card>
