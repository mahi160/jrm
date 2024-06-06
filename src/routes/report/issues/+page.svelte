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
	import type { IIssue } from '$lib/models/issue.model';
	import { getLocalTimeZone, today } from '@internationalized/date';
	import type { Selected } from 'bits-ui';
	import dayjs from 'dayjs';
	import IssueByDate from './mods/issue-by-date.svelte';
	import TimeResolution from './mods/time-resolution.svelte';

	const reports = [
		{ title: 'Time Resolution Report', value: 'time-resolution' },
		{ title: 'Created vs Resolved', value: 'issues-with-date' }
	];
	let report: Selected<unknown>;
	let project: Selected<unknown>[];
	let tasks: Selected<unknown>[];
	const start = today(getLocalTimeZone());
	const end = start.add({ days: 14 });
	let value = {
		start,
		end
	};

	let rawData: IIssue[];

	const generateReport = async () => {
		const r = report.value;
		const keys = project.map((p) => p.value).toString();
		const t = tasks.map((x) => x.value).toString();
		const start = dayjs(value.start.toString()).format('YYYY-MM-DD');
		const end = dayjs(value.end.toString()).format('YYYY-MM-DD');
		const days = value.end.compare(value.start);
		const url = `/api/v1/report/${r}?key=${keys}&start=${start}&end=${end}&tasks=${t}&days=${days}`;
		const res = await fetch(url);

		rawData = await res.json();
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

		<DatePicker bind:value />
		<Button variant="default" on:click={generateReport} disabled={!(report && project && tasks)}>
			Generate Report
		</Button>
		<DownloadCsv data={rawData}></DownloadCsv>
	</div>

	{#if report?.value && report.value === 'time-resolution'}
		<TimeResolution {rawData} />
	{/if}

	{#if report?.value && report.value === 'issues-with-date'}
		<IssueByDate {rawData} />
	{/if}
</div>
