<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_SERVER_URL } from '$env/static/public';
	import type { User } from 'lucia';
	import { onMount } from 'svelte';
	import DataTable from './table/DataTable.svelte';

	export let data;

	let users: User[] = [];

	onMount(async () => {
		const usersRes = await fetch(`${PUBLIC_SERVER_URL}/vendor/users`, {
			body: JSON.stringify({ sessionId: data.session?.id, vendorId: $page.params.vendorId }),
			method: 'POST'
		});

		if (usersRes.ok) {
			users = await usersRes.json();
			console.log(users);
		}
	});
</script>

{#key users}
	<div class="container py-10 mx-auto">
		<DataTable data={users} pageData={data} />
	</div>
{/key}
