<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_SERVER_URL } from '$env/static/public';
	import { trpc } from '$lib/trpc';
	import type { User } from 'lucia';
	import { onMount } from 'svelte';
	import DataTable from './table/DataTable.svelte';

	export let data;

	let users: User[] = [];

	onMount(async () => {
		const { users: u } = await trpc.user.getMultiple.query({
			vendorId: $page.params.vendorId
		});
		users = u ?? [];
	});
</script>

{#key users}
	<div class="container py-10 mx-auto">
		<DataTable data={users} pageData={data} />
	</div>
{/key}
