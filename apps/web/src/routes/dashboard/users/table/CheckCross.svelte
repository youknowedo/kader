<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import X from 'lucide-svelte/icons/x';

	export let value: boolean;
</script>

{#if value}
	<Check />
{:else}
	<X />
{/if}
