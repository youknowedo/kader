<script lang="ts">
	import Moon from 'lucide-svelte/icons/moon';
	import Sun from 'lucide-svelte/icons/sun';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { fullWidth } from '$lib/stores/fullWidth';
	import { mode, resetMode, setMode } from 'mode-watcher';

	let m: 'dark' | 'light' | 'system' = $mode ?? 'system';
	$: setMode(m);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} variant="ghost" size="icon" class="text-stone-400">
			<Sun class="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<Moon
				class="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="start">
		<DropdownMenu.RadioGroup bind:value={m}>
			<DropdownMenu.RadioItem value="light">Light</DropdownMenu.RadioItem>
			<DropdownMenu.RadioItem value="dark">Dark</DropdownMenu.RadioItem>
			<DropdownMenu.RadioItem value="system">System</DropdownMenu.RadioItem>
		</DropdownMenu.RadioGroup>

		<DropdownMenu.Separator />

		<DropdownMenu.CheckboxItem checked={$fullWidth} on:click={() => fullWidth.update((v) => !v)}>
			Full width
		</DropdownMenu.CheckboxItem>
	</DropdownMenu.Content>
</DropdownMenu.Root>
