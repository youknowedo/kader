<script>
	import { offline, user } from '$lib/stores';
	import { trpc } from '$lib/trpc';
	import { AlertDialog, Toaster } from '@kader/ui/components';
	import '@kader/ui/styles.css';
	import { onMount } from 'svelte';

	let open = false;

	onMount(async () => {
		offline.set(false);

		const registration = await navigator.serviceWorker.ready;

		registration.addEventListener('updatefound', () => {
			const newWorker = registration.installing;

			newWorker?.addEventListener('statechange', () => {
				if (newWorker.state === 'installed') {
					open = true;
				}
			});
		});

		const { user: u } = await trpc.user.getSingle
			.query()
			.catch(
				() => (offline.set(true), { user: JSON.parse(localStorage.getItem('user') ?? 'null') })
			);
		user.set(u ?? null);

		if (u) localStorage.setItem('user', JSON.stringify(u));
	});
</script>

<Toaster />

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>An update is available</AlertDialog.Title>
			<AlertDialog.Description>
				There is a new version of the app available. Do you want to update now?
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Skip</AlertDialog.Cancel>
			<AlertDialog.Action on:click={() => window.location.reload()}>Update</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

{#if $user !== undefined}
	<slot />
{:else}
	yurr
{/if}

{#if $offline}
	<div
		class="absolute inset-x-0 bottom-0 flex items-center justify-center text-center text-white bg-primary"
	>
		offline
	</div>
{/if}
