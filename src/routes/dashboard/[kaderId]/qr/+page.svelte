<script lang="ts">
	import { browser } from '$app/environment';
	import QrScanner from 'qr-scanner';

	let videoEl: HTMLVideoElement | undefined = undefined;

	$: qrScanner =
		videoEl &&
		new QrScanner(videoEl, (result) => console.log('decoded qr code:', result), {
			returnDetailedScanResult: true
		});
	$: qrScanner && qrScanner.start();
</script>

<video bind:this={videoEl}>
	<track kind="captions" />
</video>
