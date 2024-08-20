<script lang="ts">
	import { PUBLIC_SERVER_URL } from '$env/static/public';
	import { onMount } from 'svelte';
	import type { Vendor } from '../../../app';
	import DataTable from './data-table.svelte';

	export let data;
	let vendors: Vendor[] = [];

	onMount(async () => {
		const res = await fetch(`${PUBLIC_SERVER_URL}/vendor/all`, {
			body: JSON.stringify(data.session?.id),
			method: 'POST'
		});
		vendors = await res.json();
		console.log(vendors);
	});
</script>

<div class="container py-10 mx-auto">
	<DataTable data={vendors} />
</div>
