<script>
	import { offline, user } from '$lib/stores';
	import { trpc } from '$lib/trpc';
	import { Toaster } from '@kader/ui/components';
	import '@kader/ui/styles.css';
	import { onMount } from 'svelte';

	onMount(async () => {
		offline.set(false);
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

<slot />

{#if $offline}
	<div
		class="absolute inset-x-0 bottom-0 flex items-center justify-center text-center text-white bg-primary"
	>
		offline
	</div>
{/if}
