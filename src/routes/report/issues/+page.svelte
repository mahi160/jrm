<script lang="ts">
	import DatePicker from '$lib/components/DatePicker.svelte';
	import DownloadCsv from '$lib/components/DownloadCsv.svelte';
	import IssueType from '$lib/components/IssueType.svelte';
	import ProjectSelector from '$lib/components/ProjectSelector.svelte';
	import { Button } from '$lib/components/ui/button';
	import {
		Select,
		SelectContent,
		SelectInput,
		SelectItem,
		SelectTrigger,
		SelectValue
	} from '$lib/components/ui/select';
	import { getLocalTimeZone, today } from '@internationalized/date';
	import type { Selected } from 'bits-ui';
	import TimeResolution from './mods/time-resolution.svelte';

	const reports = [{ title: 'Time Resolution Report', value: 'time-resolution' }];
	let report: Selected<unknown>;
	let project: Selected<unknown>[];
	let tasks: Selected<unknown>[];

	let chartData: any;
	const start = today(getLocalTimeZone());
	const end = start.add({ days: 14 });

	let value = {
		start,
		end
	};

	const generateReport = async () => {
		const r = report.value;
		const keys = project.map((p) => p.value).toString();
		const t = tasks.map((x) => x.value).toString();
		const days = value.end.compare(value.start);
		const url = `/api/v1/report/${r}?key=${keys}&days=${days}&tasks=${t}`;
		const res = await fetch(url);

		chartData = await res.json();
		console.log(chartData);
	};
</script>

<div class="container mx-auto grid gap-10 p-4">
	<h1 class="text-3xl text-neutral-700 underline">Reports on issue</h1>

	<div class="flex items-center justify-start gap-4">
		<Select bind:selected={report}>
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
		<ProjectSelector bind:selected={project} />

		<IssueType bind:selected={tasks} />

		<!-- <Input type="number" placeholder="Days" bind:value={days} /> -->
		<!-- <RangeCalendar bind:value class="rounded-md border" /> -->
		<DatePicker {value} on:cha />
		<Button variant="default" on:click={generateReport} disabled={!(report && project && tasks)}
			>Generate Report</Button
		>
		<DownloadCsv jsonData={reports}></DownloadCsv>
	</div>

	{#if report?.value && report.value === 'time-resolution'}
		<TimeResolution data={chartData} />
	{/if}
</div>
