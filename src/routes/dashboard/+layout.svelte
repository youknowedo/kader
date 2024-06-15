<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { LightSwitch } from '$lib/components/ui/light-switch';
	import { fullWidth } from '$lib/stores/fullWidth';
	import { Bell } from 'lucide-svelte/icons';
</script>

<div class="flex {$fullWidth ? 'w-full' : 'container'}">
	<div class="flex h-screen w-44 flex-col justify-between border-r px-2 pb-4 pt-6">
		<div>
			<div class="mb-4 px-4">
				<h3 class="font-archivo text-2xl">Kader</h3>
			</div>

			<Button size="sm" variant="ghost" class="w-full justify-start text-left text-stone-400">
				Overview
			</Button>
			<Button size="sm" variant="ghost" class="w-full justify-start text-left text-stone-400">
				Members
			</Button>
			<Button
				on:click={() => fetch('/api/logout')}
				size="sm"
				variant="ghost"
				class="w-full justify-start text-left text-stone-400"
			>
				Settings
			</Button>
		</div>

		<div class="flex justify-between px-4">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Avatar.Root class="mr-1 h-8 w-8">
						<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
						<Avatar.Fallback>CN</Avatar.Fallback>
					</Avatar.Root>
				</DropdownMenu.Trigger>

				<DropdownMenu.Content align="end">
					<DropdownMenu.Item>Account Settings</DropdownMenu.Item>
					<DropdownMenu.Item>Log out</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<Button variant="ghost" size="icon" class="text-stone-400">
				<Bell class="h-5 w-5" />
			</Button>

			<LightSwitch />
		</div>
	</div>

	<div class="px-8 py-6">
		<slot />
	</div>
</div>
