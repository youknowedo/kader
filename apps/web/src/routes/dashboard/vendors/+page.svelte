<script lang="ts">
	import type { Vendor } from '@kader/shared';
	import { trpc } from '@kader/shared/trpc';
	import { onMount } from 'svelte';
	import DataTable from './table/DataTable.svelte';

	let vendors: Vendor[] = [];

	onMount(async () => {
		const { vendors: v } = await trpc.vendor.getMultiple.query();
		vendors = v ?? [];
	});
</script>

{#key vendors}
	<div class="container py-10 mx-auto">
		<DataTable data={vendors} />
	</div>
{/key}
