<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { user } from '$lib/stores.js';
	import { onMount } from 'svelte';

	onMount(() => {
		user.subscribe((u) => {
			if (!u) goto(base + '/login');
		});
	});
</script>

<div class="mx-auto max-w-80">
	<slot />
</div>
