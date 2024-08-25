<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores';
	import { trpc } from '$lib/trpc';
	import type { User } from '@kader/shared';
	import { Alert, Button } from '@kader/ui/components';
	import { Buffer } from 'buffer';
	import CircleAlert from 'lucide-svelte/icons/circle-alert';
	import QrCode from 'lucide-svelte/icons/qr-code';
	import ScanQrCode from 'lucide-svelte/icons/scan-qr-code';
	import * as OTPAuth from 'otpauth';
	import QrScanner from 'qr-scanner';
	import QRCode from 'qrcode';
	import { onMount } from 'svelte';

	let token: string;
	let qr: string;

	let scanMode = false;
	let video: HTMLVideoElement;
	let qrScanner: QrScanner | null = null;
	let scannedUser: User | null = null;

	const switchMode = () => {
		scanMode = !scanMode;
		if (scanMode) {
			qrScanner = new QrScanner(
				video,
				async (result) => {
					const {
						userId,
						token
					}: {
						userId: string;
						token: string;
					} = JSON.parse(result.data);

					const { user: u } = await trpc.user.fromQr.query({ userId, token });

					if (!u) return;

					scannedUser = u;
				},
				{
					preferredCamera: 'environment'
				}
			);
			qrScanner.start();
		} else {
			qrScanner?.destroy();
			qrScanner = null;
		}
	};

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
					userId: $user.id,
					token
				}),
				{ errorCorrectionLevel: 'H' }
			);

			setTimeout(generate, seconds * 1000);
		};

		generate();
	});
</script>

<div class="relative flex flex-col items-center justify-center flex-1 w-full">
	<Button on:click={switchMode} class="absolute top-0 right-0 h-12" variant="ghost" size="sm">
		<svelte:component
			this={!scanMode && $user?.role !== 'vendor' ? ScanQrCode : QrCode}
			class="w-6 h-6"
		/>
	</Button>

	{#if !$user?.completed_profile}
		<button class="text-left" on:click={() => goto('/app/completeProfile')}>
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
		<img class="h-64 {!scanMode && $user?.role !== 'vendor' ? '' : 'hidden'}" src={qr} alt="" />
	{:else}
		Loading...
	{/if}
	<div class={!scanMode && $user?.role !== 'vendor' ? 'hidden' : ''}>
		{#if scannedUser}
			<div class="flex flex-col items-center justify-center">
				<img class="w-24 h-24 rounded-full" src={scannedUser.pfp} alt="" />
				<p class="mt-2 text-lg font-semibold">{scannedUser.full_name}</p>
				<p class="mt-1 text-sm text-gray-500">{scannedUser.email}</p>

				<Button on:click={() => (scannedUser = null)}>Back</Button>
			</div>
		{:else}
			<video id="scanner" class="w-64 h-64" bind:this={video}>
				<div class="placeholder">No cameras loaded!</div>
				<track kind="captions" />
			</video>
		{/if}
	</div>
</div>
