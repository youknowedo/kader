<script lang="ts">
	import { Checkbox } from '@kader/ui/components';
	import type { Writable } from 'svelte/store';

	export let checked: Writable<boolean>;
</script>

<Checkbox bind:checked={$checked} />
