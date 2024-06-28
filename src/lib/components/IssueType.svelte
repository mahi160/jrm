<script lang="ts">
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
	let issues: string[] = ['Task', 'Bug', 'Story'];
	const getData = async () => {
		const res = await fetch('/api/v1/list/issue-types');
		issues = await res.json();
	};
	onMount(getData);
</script>

<Select multiple bind:selected>
	<SelectTrigger>
		<SelectValue placeholder="Select Issue Type" />
	</SelectTrigger>
	<SelectContent class="max-h-96 overflow-auto">
		{#each issues as issue}
			<SelectItem value={issue} label={issue}>{issue}</SelectItem>
		{/each}
	</SelectContent>
	<SelectInput name="report" />
</Select>
