<script lang="ts">
	import { trpc } from '$lib/trpc';
	import type { User } from 'lucia';
	import { onMount } from 'svelte';
	import DataTable from './table/DataTable.svelte';

	let users: User[] = [];

	onMount(async () => {
		const { users: u } = await trpc.user.getMultiple.query({ noVendors: true });
		users = u ?? [];
	});
</script>

{#key users}
	<div class="container py-10 mx-auto">
		<DataTable data={users} />
	</div>
{/key}
