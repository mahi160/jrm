<script lang="ts">
	import DownloadCsv from '$lib/components/DownloadCsv.svelte';
	import BarChart from '$lib/components/charts/BarChart.svelte';
	import { Button } from '$lib/components/ui/button';
	import {
		Select,
		SelectContent,
		SelectInput,
		SelectItem,
		SelectTrigger,
		SelectValue
	} from '$lib/components/ui/select';

	const reports = [{ title: 'Time Resolution Report', value: 'time-resolution' }];
</script>

<div class="container mx-auto grid gap-4 p-4">
	<h1 class="text-3xl text-neutral-700 underline">Reports on issue</h1>

	<div class="flex items-center justify-start gap-4">
		<Select>
			<SelectTrigger>
				<SelectValue placeholder="Select a report" />
			</SelectTrigger>
			<SelectContent>
				{#each reports as report}
					<SelectItem value={report.value} label={report.title}>{report.title}</SelectItem>
				{/each}
			</SelectContent>
			<SelectInput name="report" />
		</Select>
		<Button variant="default">Generate Report</Button>
		<DownloadCsv jsonData={reports}></DownloadCsv>
	</div>

	<BarChart />
</div>
