<script lang="ts">
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { secondsToYMDHMS } from '$lib/utils';
	import type { ChartData, ChartOptions } from 'chart.js/auto';
	import dayjs from 'dayjs';

	interface LogEntry {
		timestamp: string;
		to: string;
		key: string;
		from: string;
		url: string;
	}

	interface TimeStatus {
		[key: string]: number | string;
	}

	let { rawData }: { rawData: LogEntry[] } = $props();
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
		},
		scales: {
			x: {
				stacked: true
			},
			y: {
				stacked: true
			}
		}
	};
	// const issueTypes = new Set(rawData.map((entry) => entry.to));
	const issueTypes = [
		'Backlog',
		'Selected for Development',
		'In Progress',
		'QA / Testing',
		'In Review',
		'Done',
		'Blocked'
	];

	function createChart(data: Record<string, TimeStatus>): ChartData<'bar'> {
		const labels = Object.keys(data);
		const statusKeys = Array.from(new Set(Object.values(data).flatMap(Object.keys)));

		const datasets = statusKeys.map((status, index) => ({
			label: status,
			data: labels.map((key) => Math.abs(Number(data[key][status]) || 0)),
			stack: 'Stack 1'
		}));

		return {
			labels: labels,
			datasets: datasets
		};
	}

	function createOrgData(data: LogEntry[]): Record<string, TimeStatus> {
		const orgData: Record<string, TimeStatus> = {};

		data.forEach((entry, index) => {
			const { key, timestamp, from, to } = entry;
			const timeInSeconds = dayjs(timestamp).unix();
			orgData[key] = orgData[key] || { url: entry.url };

			if (!orgData[key]) {
				orgData[key] = {};
			}

			if (index > 0) {
				const prevEntry = data[index - 1];
				if (prevEntry.key === key) {
					const prevTimeInSeconds = dayjs(prevEntry.timestamp).unix();
					const diff = timeInSeconds - prevTimeInSeconds;

					if (!orgData[key][prevEntry.to]) {
						orgData[key][prevEntry.to] = 0;
					}

					(orgData[key][prevEntry.to] as number) += diff;
				}
			}
		});

		return orgData;
	}
</script>

<Card class="overflow-auto">
	<CardHeader>Time Status</CardHeader>
	<CardContent>
		<BarChart data={chartData} height={400} {options} />
	</CardContent>
</Card>

<Card class="max-h-[65vh] overflow-auto">
	<CardHeader>List of data</CardHeader>
	<CardContent>
		<Table.Root>
			<Table.Caption>A list</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head>Issue</Table.Head>
					{#each Array.from(issueTypes) as issueType}
						<Table.Head>{issueType}</Table.Head>
					{/each}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if orgData}
					{#each Object.keys(orgData) as key}
						<Table.Row>
							<Table.Cell class="font-medium">
								<a class="min-w-24 text-primary" href={orgData[key].url as string} target="_blank">
									<div class="min-w-24">
										{key}
									</div>
								</a>
							</Table.Cell>
							{#each Array.from(issueTypes) as to}
								<Table.Cell>{secondsToYMDHMS(Number(orgData[key][to])) || 'N/A'}</Table.Cell>
							{/each}
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
		</Table.Root>
	</CardContent>
</Card>
