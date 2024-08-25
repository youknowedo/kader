<script>
	import { user } from '$lib/stores';
	import { trpc } from '$lib/trpc';
	import '@kader/ui/styles.css';
	import cookie from 'cookie';
	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';

	onMount(async () => {
		const { user: u } = await trpc.user.getSingle
			.query()
			.catch(
				() => (console.log('failed'), { user: JSON.parse(localStorage.getItem('user') ?? 'null') })
			);
		user.set(u ?? null);

		if (u) localStorage.setItem('user', JSON.stringify(u));
	});
</script>

<ModeWatcher />

<slot />
