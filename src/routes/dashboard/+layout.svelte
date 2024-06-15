<script lang="ts">
	import { browser } from '$app/environment';
	import { fullWidth } from '$lib/stores/fullWidth';

	if (browser) {
		fullWidth.set(localStorage.getItem('fullWidth') === 'true');
		fullWidth.subscribe((v) => localStorage.setItem('fullWidth', v.toString()));
	}
</script>

<div class={$fullWidth ? 'w-full' : 'container'}>
	<slot />
</div>
