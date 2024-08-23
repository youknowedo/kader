<script lang="ts">
	import { PUBLIC_SERVER_URL } from '$env/static/public';
	import { trpc } from '@kader/shared/trpc';
	import type { User } from 'lucia';
	import { onMount } from 'svelte';
	import type { Vendor } from '../../../app';
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
