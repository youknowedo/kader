<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { offline, user } from '$lib/stores';
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
	import { toast } from 'svelte-sonner';

	let token: string;
	let qr: string;

	let scanMode = false;
	let video: HTMLVideoElement;
	let qrScanner: QrScanner | null = null;
	let scannedUser: User | null = null;

	const switchMode = () => {
		if ($offline) {
			toast.error('You are offline!');
			return;
		}

		scanMode = !scanMode;
		if (scanMode) {
			qrScanner = new QrScanner(
				video,
				async (result) => {
					qrScanner?.stop();

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

	user.subscribe(async (u) => {
		if (!u) return;

		let hex_qr_id = localStorage.getItem('qr_id');
		let qrId: Uint8Array;
		if (!hex_qr_id) {
			const { success, error, qr } = await trpc.qr.getSingle.query();
			if (!success) throw new Error(error);

			hex_qr_id = qr ?? null;
			if (!hex_qr_id) throw new Error('Failed to fetch QR ID');

			localStorage.setItem('qr_id', hex_qr_id);
			qrId = Uint8Array.from(Buffer.from(hex_qr_id, 'hex'));
		} else qrId = Uint8Array.from(Buffer.from(hex_qr_id, 'hex'));

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
					userId: u.id,
					token
				}),
				{ errorCorrectionLevel: 'H', scale: 10 }
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

	{#if qr}
		<img class="h-64 {!scanMode && $user?.role !== 'vendor' ? '' : 'hidden'}" src={qr} alt="" />
	{:else}
		Loading...
	{/if}

	{#if $offline && $user?.role === 'vendor'}
		You are offline. Cannot scan QR codes.
	{/if}

	<div class={$offline || (!scanMode && $user?.role !== 'vendor') ? 'hidden' : ''}>
		<div class="flex-col items-center justify-center {scannedUser ? 'flex' : 'hidden'}">
			<img class="w-24 h-24 rounded-full" src={scannedUser?.pfp} alt="" />
			<p class="mt-2 text-lg font-semibold">{scannedUser?.full_name}</p>
			<p class="mt-1 text-sm text-gray-500">{scannedUser?.email}</p>

			<Button on:click={() => ((scannedUser = null), qrScanner?.start())}>Back</Button>
		</div>
		<video
			id="scanner"
			class="w-64 h-64 object-cover {scannedUser ? 'hidden' : ''}"
			bind:this={video}
		>
			<div class="placeholder">No cameras loaded!</div>
			<track kind="captions" />
		</video>
	</div>
</div>
