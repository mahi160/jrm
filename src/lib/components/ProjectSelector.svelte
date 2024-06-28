<script lang="ts">
	import type { IProject } from '$lib/models/project.model';
	import type { Selected } from 'bits-ui';
	import { onMount } from 'svelte';
	import {
		Select,
		SelectContent,
		SelectInput,
		SelectItem,
		SelectTrigger,
		SelectValue
	} from './ui/select';

	export let selected: Selected<unknown>[];
	let projects: IProject[];
	const getData = async () => {
		const res = await fetch('/api/v1/list/projects');
		projects = await res.json();
	};
	onMount(getData);
</script>

<Select multiple bind:selected>
	<SelectTrigger>
		<SelectValue placeholder="Select a report" />
	</SelectTrigger>
	<SelectContent>
		{#each projects as project}
			<SelectItem value={project.key} label={project.name}>{project.name}</SelectItem>
		{/each}
	</SelectContent>
	<SelectInput name="report" />
</Select>
