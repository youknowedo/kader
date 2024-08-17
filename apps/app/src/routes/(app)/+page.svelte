<script lang="ts">
	import { PUBLIC_SERVER_URL } from '$env/static/public';
	import { onMount } from 'svelte';

	let qrId: Uint8Array;

	onMount(() => {
		const qr_id = localStorage.getItem('qr_id');
		if (!qr_id) {
			fetch(PUBLIC_SERVER_URL + '/id')
				.then((response) => {
					if (response.ok) {
						return response.text();
					} else {
						throw new Error('Failed to fetch QR ID');
					}
				})
				.then((qr_id) => {
					localStorage.setItem('qr_id', qr_id);
					qrId = Uint8Array.from(Buffer.from(qr_id, 'hex'));
					console.log(qrId);
				})
				.catch((error) => {
					console.error(error);
				});
		} else qrId = Uint8Array.from(Buffer.from(localStorage.getItem('qr_id')!, 'hex'));

		console.log(qrId);
	});
</script>

{qrId}
