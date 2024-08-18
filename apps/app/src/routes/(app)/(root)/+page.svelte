<script lang="ts">
	import { PUBLIC_SERVER_URL } from '$env/static/public';
	import { user } from '$lib/stores.js';
	import { Buffer } from 'buffer';
	import * as OTPAuth from 'otpauth';
	import QRCode from 'qrcode';
	import { onMount } from 'svelte';

	let token: string;
	let qr: string;

	onMount(async () => {
		if (!$user) return;

		let hex_qr_id = localStorage.getItem('qr_id');
		let qrId: Uint8Array;
		if (!hex_qr_id) {
			const res = await fetch(PUBLIC_SERVER_URL + '/id');
			if (res.ok) {
				hex_qr_id = await res.text();
			} else {
				throw new Error('Failed to fetch QR ID');
			}

			localStorage.setItem('qr_id', hex_qr_id);
			qrId = Uint8Array.from(Buffer.from(hex_qr_id, 'hex'));
		} else qrId = Uint8Array.from(Buffer.from(localStorage.getItem('qr_id')!, 'hex'));

		let secret = new OTPAuth.Secret({ buffer: qrId.buffer });
		let totp = new OTPAuth.TOTP({
			algorithm: 'SHA1',
			digits: 6,
			period: 30,
			secret
		});

		const generate = async () => {
			token = totp.generate() ?? token;
			let seconds = totp.period - (Math.floor(Date.now() / 1000) % totp.period);

			qr = await QRCode.toDataURL(
				JSON.stringify({
					user: $user.id,
					token
				}),
				{ errorCorrectionLevel: 'H' }
			);

			setTimeout(generate, seconds * 1000);
		};

		generate();
	});
</script>

<img class="h-64" src={qr} alt="" />
