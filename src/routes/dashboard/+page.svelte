<script lang="ts">
	import { enhance } from '$app/forms';
	import { LightSwitch } from '$lib/components/ui/light-switch';
</script>

<LightSwitch />

<form method="post" use:enhance>
	<button>Sign out</button>
</form>
