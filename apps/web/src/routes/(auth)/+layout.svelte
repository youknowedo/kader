<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores';
	import { onMount } from 'svelte';

	onMount(async () => {
		user.subscribe((u) => {
			if (u) goto('/dashboard');
		});
	});
</script>

<div class="flex flex-col justify-center">
	<slot />
</div>
