<script>
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	export let data;

	if (data.user) goto(base + '/');
</script>

<div class="flex flex-col justify-center h-screen">
	<slot />
</div>
