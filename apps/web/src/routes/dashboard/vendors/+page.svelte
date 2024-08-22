<script lang="ts">
	import { PUBLIC_SERVER_URL } from '$env/static/public';
	import { trpc } from '$lib/trpc';
	import type { User } from 'lucia';
	import { onMount } from 'svelte';
	import type { Vendor } from '../../../app';
	import DataTable from './table/DataTable.svelte';

	let vendors: Vendor[] = [];
	let loading = true;

	onMount(async () => {
		const { vendors: v } = await trpc.vendor.getMultiple.query();
		vendors = v ?? [];
	});
</script>

{#key loading}
	<div class="container py-10 mx-auto">
		<DataTable data={vendors} />
	</div>
{/key}
