<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { user } from '$lib/stores.js';

	export let data;

	if (!data.user) goto(base + '/login');
	else user.set(data.user);
</script>

<div class="mx-auto max-w-80">
	<slot />
</div>
