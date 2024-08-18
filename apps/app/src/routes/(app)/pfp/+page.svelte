<script lang="ts">
	import { Uppy } from '@uppy/core';
	import Dashboard from '@uppy/dashboard';
	import Webcam from '@uppy/webcam';
	import { onMount } from 'svelte';

	import '@uppy/core/dist/style.min.css';
	import '@uppy/dashboard/dist/style.min.css';

	onMount(() => {
		new Uppy().use(Dashboard, { inline: true, target: '#uppy' }).use(Webcam);
	});
</script>

<div id="uppy"></div>
