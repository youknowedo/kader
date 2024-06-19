<script lang="ts">
	import { browser } from '$app/environment';
	import QR from '@svelte-put/qr/svg/QR.svelte';
	import type { GetResponseData } from '../../api/totp/+server.js';

	export let data;

	let otp = data.otp;

	if (browser)
		setTimeout(async () => {
			const data: GetResponseData = await fetch('/api/totp').then((res) => res.json());

			otp = data;
		}, data.otp.secondsLeft * 1000);
</script>

<div class="flex h-screen items-center justify-center">
	<QR height="10rem" data={JSON.stringify(otp)} />
</div>
