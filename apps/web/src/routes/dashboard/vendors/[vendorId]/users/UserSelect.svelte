<script lang="ts">
	import { PUBLIC_SERVER_URL } from '$env/static/public';
	import { trpc } from '$lib/trpc';
	import { Button, Command, Popover } from '@kader/ui/components';
	import { cn } from '@kader/ui/utils';
	import type { User } from 'lucia';
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { onMount, tick } from 'svelte';

	export let pageData;
	export let data;

	let users: { label: string; value: string }[] = [];

	let open = false;
	let value = '';

	$: selectedValue = users.find((f) => f.value === value)?.label ?? 'Select a user...';

	onMount(async () => {
		console.log(pageData);
		const { users: u } = await trpc(pageData.sessionId).user.getMultiple.query({});

		users =
			u
				?.filter((user) => !(data as User[]).find((u) => u.id == user.id))
				.map((user) => ({ label: user.email, value: user.id })) ?? [];
	});

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
			class="relative justify-between w-full"
		>
			{selectedValue}
			<ChevronsUpDown class="w-4 h-4 ml-2 opacity-50 shrink-0" />
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-full p-0">
		<Command.Root>
			<Command.Input placeholder="Search user..." />
			<Command.Empty>No user found.</Command.Empty>
			<Command.Group>
				{#each users as user}
					<Command.Item
						value={user.value}
						onSelect={(currentValue) => {
							value = currentValue;
							closeAndFocusTrigger(ids.trigger);
						}}
					>
						<Check class={cn('mr-2 h-4 w-4', value !== user.value && 'text-transparent')} />
						{user.label}
					</Command.Item>
				{/each}
			</Command.Group>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
