<script lang="ts">
	import { user } from '$lib/stores.js';

	export let data;

	user.set(data.user);
</script>

<slot />
