<script>
	import '@kader/ui/styles.css';
	import { ModeWatcher } from 'mode-watcher';
</script>

<ModeWatcher />
<slot />

<div class="flex items-center justify-center h-screen">
	<div class="h-20 rounded-3xl bg-background w-96 neu-up"></div>
</div>
