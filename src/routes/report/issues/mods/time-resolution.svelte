<script lang="ts">
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import type { IIssue } from '$lib/models/issue.model';
	import { daysToText } from '$lib/utils';
	import type { ChartData, ChartOptions } from 'chart.js/auto';
	import dayjs from 'dayjs';

	let { rawData }: { rawData: IIssue[] } = $props();
	let chartData: ChartData<'bar'> = $derived(
		rawData && {
			labels: rawData?.map((r) => r.id),
			datasets: [{ data: rawData?.map((r) => r.days), label: 'Time Taken to resolve' }]
		}
	);
	let options: ChartOptions<'bar'> = {
		plugins: {
			tooltip: {
				callbacks: {
					label: (x) => {
						return daysToText(Number(x.formattedValue));
					}
				}
			}
		}
	};
</script>

<BarChart data={chartData} height={400} {options} />

<Card class="max-h-[50vh] overflow-auto">
	<CardHeader>List of data</CardHeader>
	<CardContent>
		<Table.Root>
			<Table.Caption>A list</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[100px]">Issue No.</Table.Head>
					<Table.Head>Summary</Table.Head>
					<Table.Head>Issue Type</Table.Head>
					<Table.Head>Created Date</Table.Head>
					<Table.Head>Resolution Date</Table.Head>
					<Table.Head class="text-right">Days Taken</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each rawData as item, i (i)}
					<Table.Row>
						<Table.Cell class="font-medium">
							<a class="min-w-24 text-primary" href={item.url} target="_blank">
								<div class="min-w-24">
									{item.id}
								</div>
							</a>
						</Table.Cell>
						<Table.Cell>
							{item.summary}
						</Table.Cell>
						<Table.Cell>{item.type}</Table.Cell>
						<Table.Cell>{dayjs(item.createdDate).format('D MMM, YYYY')}</Table.Cell>
						<Table.Cell>{dayjs(item.resolutionDate).format('D MMM, YYYY')}</Table.Cell>
						<Table.Cell class="text-right">{item.days}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</CardContent>
</Card>
