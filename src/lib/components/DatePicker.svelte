<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '$lib/utils.js';
	import { DateFormatter, getLocalTimeZone, today } from '@internationalized/date';
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import RangeCalendar from './ui/range-calendar/range-calendar.svelte';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	const start = today(getLocalTimeZone());
	const end = start.add({ days: 7 });

	export let value = {
		start,
		end
	};
</script>

<Popover.Root>
	<Popover.Trigger asChild let:builder>
		<Button
			variant="outline"
			class={cn('justify-start text-left font-normal')}
			builders={[builder]}
		>
			<CalendarIcon class="mr-2 h-4 w-4" />
			{df.format(value.start?.toDate(getLocalTimeZone()))} - {df.format(
				value.end?.toDate(getLocalTimeZone())
			)}
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-auto p-0">
		<RangeCalendar bind:value initialFocus />
	</Popover.Content>
</Popover.Root>
