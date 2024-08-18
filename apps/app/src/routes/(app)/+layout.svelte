<script lang="ts">
	import { user } from '$lib/stores.js';

	export let data;

	user.set(data.user);
</script>

<div class="mx-auto max-w-80">
	<slot />
</div>
