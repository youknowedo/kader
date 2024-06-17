<script lang="ts">
	import { cn } from '$lib/utils.js';
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import { Button } from '../button';
	import * as Command from '../command';
	import * as Popover from '../popover';

	export let items: { value: string; label: string }[];

	let open = false;
	export let defaultValue = '';
	export let itemName = 'kader';

	export let selectedValue = `Select an ${itemName}...`;
	$: selectedValue =
		items.find((item) => item.value === defaultValue)?.label ?? `Select an ${itemName}...`;

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			role="combobox"
			aria-expanded={open}
			class="w-full justify-between"
		>
			{selectedValue}
			<ChevronsUpDown class="-mr-2 ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0">
		<Command.Root>
			<Command.Input placeholder="Search {itemName}..." />
			<Command.Empty>No {itemName} found.</Command.Empty>
			<Command.Group>
				{#each items as item}
					<Command.Item
						value={item.value}
						onSelect={(currentValue) => {
							defaultValue = currentValue;
							closeAndFocusTrigger(ids.trigger);
						}}
					>
						<Check class={cn('mr-2 h-4 w-4', defaultValue !== item.value && 'text-transparent')} />
						{item.label}
					</Command.Item>
				{/each}
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
