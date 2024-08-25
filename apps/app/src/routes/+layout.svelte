<script>
	import '@kader/ui/styles.css';
	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';

	onMount(async () => {
		const registration = await navigator.serviceWorker.ready;

		registration.addEventListener('updatefound', () => {
			const newWorker = registration.installing;
			newWorker?.addEventListener('statechange', () => {
				if (newWorker?.state === 'installed') {
					if (confirm('A new version is available. Reload to update?')) {
						newWorker.postMessage({ type: 'SKIP_WAITING' });
						location.reload();
					}
				}
			});
		});
	});
</script>

<ModeWatcher />

<slot />
