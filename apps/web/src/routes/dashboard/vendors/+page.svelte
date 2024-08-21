<script lang="ts">
	import { PUBLIC_SERVER_URL } from '$env/static/public';
	import type { User } from 'lucia';
	import { onMount } from 'svelte';
	import type { Vendor } from '../../../app';
	import DataTable from './table/DataTable.svelte';

	export let data;
	let vendors: Vendor[] = [];
	let loading = true;

	onMount(async () => {
		const vendorsRes = await fetch(`${PUBLIC_SERVER_URL}/vendor/all`, {
			body: data.session?.id,
			method: 'POST'
		});
		const v: Vendor[] = await vendorsRes.json();

		// Get owners
		const ownersRes = await fetch(`${PUBLIC_SERVER_URL}/user/some`, {
			body: JSON.stringify({
				sessionId: data.session?.id,
				users: v.map((vendor) => vendor.owner)
			}),
			method: 'POST'
		});
		const owners: User[] = await ownersRes.json();

		vendors = [];
		v.forEach(async (vendor) => {
			const owner = owners.find((user) => user.id === (vendor.owner as unknown as string));

			const numOfUsersRes = await fetch(`${PUBLIC_SERVER_URL}/vendor/numOfUsers`, {
				body: JSON.stringify({
					sessionId: data.session?.id,
					vendorId: vendor.id
				}),
				method: 'POST'
			});

			vendors.push({
				...vendor,
				owner: owner!,
				numOfUsers: await numOfUsersRes.json()
			});
			loading = false;
		});
	});
</script>

{#key loading}
	<div class="container py-10 mx-auto">
		<DataTable data={vendors} />
	</div>
{/key}
