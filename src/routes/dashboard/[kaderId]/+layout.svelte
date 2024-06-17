<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Combobox } from '$lib/components/ui/combobox';
	import * as Dialog from '$lib/components/ui/dialog/index';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { LightSwitch } from '$lib/components/ui/light-switch';
	import { fullWidth } from '$lib/stores/fullWidth';
	import { createQrSvgDataUrl, createQrSvgString } from '@svelte-put/qr';
	import QR from '@svelte-put/qr/svg/QR.svelte';
	import { Bell, Check } from 'lucide-svelte/icons';

	export let data;

	let copied = false;
	const qrData = createQrSvgDataUrl({
		data: $page.url.origin + '/invite/' + $page.params.kaderId
	});
</script>

<div class="flex {$fullWidth ? 'w-full' : 'container'}">
	<div class="flex h-screen w-44 flex-col justify-between border-r px-2 pb-4 pt-6">
		<div>
			<div class="mb-4 px-3">
				<h3 class="font-archivo text-2xl">Kader</h3>
			</div>

			<Combobox
				items={data.kaders.map((kader) => ({ value: kader.id, label: kader.name }))}
				defaultValue={$page.params.kaderId}
			/>

			<div class="mb-1 mt-2">
				<Button
					on:click={() => goto('/dashboard')}
					size="sm"
					variant="ghost"
					class="w-full justify-start text-left duration-200 {$page.url.pathname ==
					'/dashboard/' + $page.params.kaderId
						? ''
						: 'text-stone-500'}"
				>
					Overview
				</Button>
				<Button
					on:click={() => goto('/dashboard/' + $page.params.kaderId + '/members')}
					size="sm"
					variant="ghost"
					class="w-full justify-start text-left duration-200 {$page.url.pathname.startsWith(
						'/dashboard/' + $page.params.kaderId + '/members'
					)
						? ''
						: 'text-stone-500'}"
				>
					Members
				</Button>
				<Button
					on:click={() => goto('/dashboard/' + $page.params.kaderId + '/settings')}
					size="sm"
					variant="ghost"
					class="w-full justify-start text-left duration-200 {$page.url.pathname.startsWith(
						'/dashboard/' + $page.params.kaderId + '/settings'
					)
						? ''
						: 'text-stone-500'}"
				>
					Settings
				</Button>
			</div>
		</div>

		<div class="flex flex-col gap-4">
			<Dialog.Root>
				<Dialog.Trigger class="w-full {buttonVariants({ variant: 'secondary', size: 'sm' })}">
					Invite Users
				</Dialog.Trigger>
				<Dialog.Content class="sm:max-w-[425px]">
					<Dialog.Header>
						<Dialog.Title>Invite Users</Dialog.Title>
						<Dialog.Description></Dialog.Description>
					</Dialog.Header>

					<QR data="{$page.url.origin}/invite/{$page.params.kaderId}" />

					<Dialog.Footer>
						<Button
							variant="outline"
							on:click={() => {
								navigator.clipboard.writeText($page.url.origin + '/invite/' + $page.params.kaderId);
								copied = true;
								setTimeout(() => (copied = false), 20000);
							}}
						>
							{#if copied}
								<Check class="-mb-0.5 mr-1 h-4 w-4" />
								Copied
							{:else}
								Copy URL
							{/if}
						</Button>
						<Button href={qrData} download="KaderQR.svg">Download SVG</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Root>

			<div class="flex justify-between px-4">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Avatar.Root class="mr-1 h-8 w-8">
							<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
							<Avatar.Fallback>CN</Avatar.Fallback>
						</Avatar.Root>
					</DropdownMenu.Trigger>

					<DropdownMenu.Content align="end">
						<DropdownMenu.Item on:click={() => goto('/dashboard/account')}>
							Account Settings
						</DropdownMenu.Item>
						<DropdownMenu.Item on:click={() => fetch('/api/logout')}>Log out</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>

				<Button
					variant="ghost"
					size="icon"
					class={$page.url.pathname.startsWith('/dashboard') ? '' : 'text-stone-500'}
				>
					<Bell class="h-5 w-5" />
				</Button>

				<LightSwitch />
			</div>
		</div>
	</div>

	<div class="px-8 py-6">
		<slot />
	</div>
</div>
