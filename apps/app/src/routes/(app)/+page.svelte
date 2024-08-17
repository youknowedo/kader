<script lang="ts">
	import { PUBLIC_SERVER_URL } from '$env/static/public';
	import { Buffer } from 'buffer';
	import * as OTPAuth from 'otpauth';
	import { onMount } from 'svelte';

	let token: string;

	onMount(async () => {
		let hexQrId = localStorage.getItem('qr_id');
		let qrId: Uint8Array;
		if (!hexQrId) {
			const res = await fetch(PUBLIC_SERVER_URL + '/id');
			if (res.ok) {
				hexQrId = await res.text();
			} else {
				throw new Error('Failed to fetch QR ID');
			}

			localStorage.setItem('qr_id', hexQrId);
			qrId = Uint8Array.from(Buffer.from(hexQrId, 'hex'));
		} else qrId = Uint8Array.from(Buffer.from(localStorage.getItem('qr_id')!, 'hex'));

		let secret = new OTPAuth.Secret({ buffer: qrId.buffer });
		let totp = new OTPAuth.TOTP({
			algorithm: 'SHA1',
			digits: 6,
			period: 30,
			secret
		});

		const generate = () => {
			token = totp.generate() ?? token;
			let seconds = totp.period - (Math.floor(Date.now() / 1000) % totp.period);

			setTimeout(generate, seconds * 1000);

			return token;
		};

		generate();
	});
</script>

{token}
