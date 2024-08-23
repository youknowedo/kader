<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores.js';
	import { trpc } from '@kader/shared/trpc';
	import { Alert } from '@kader/ui/components';
	import { Buffer } from 'buffer';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
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
			const { success, error, qr } = await trpc.qr.getSingle.query();
			if (!success) throw new Error(error);

			hex_qr_id = qr ?? null;
			if (!hex_qr_id) throw new Error('Failed to fetch QR ID');

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

<div class="flex flex-col items-center justify-center">
	{#if !$user?.completed_profile}
		<button class="text-left" on:click={() => goto('/completeProfile')}>
			<Alert.Root class="mb-12 -mt-6">
				<CircleAlert class="w-4 h-4" />
				<Alert.Title>Heads up!</Alert.Title>
				<Alert.Description>
					Most vendors don't accept users without a profile picture. Add it now just to be safe!
				</Alert.Description>
			</Alert.Root>
		</button>
	{/if}

	{#if qr}
		<img class="h-64" src={qr} alt="" />
	{:else}
		Loading...
	{/if}
</div>
