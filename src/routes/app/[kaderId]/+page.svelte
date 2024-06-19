<script lang="ts">
	import { browser } from '$app/environment';
	import QRCode from 'qrcode';
	import type { GetResponseData } from '../../api/totp/+server.js';

	let qrEl: HTMLCanvasElement | undefined = undefined;

	let otp: GetResponseData;
	if (browser) {
		fetch('/api/totp').then(async (res) => {
			otp = await res.json();
		});
	}

	const generateQR = async () => {
		if (!qrEl) return;

		const data: GetResponseData = await fetch('/api/totp').then((res) => res.json());
		otp = data;
		QRCode.toCanvas(qrEl, 'sample text', function (error) {
			if (error) console.error(error);
			console.log('success!');
		});

		setTimeout(generateQR, otp.secondsLeft * 1000);
	};
</script>

<div class="flex h-screen items-center justify-center">
	<canvas bind:this={qrEl}></canvas>
</div>
