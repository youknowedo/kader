<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let switching = false;
</script>

<div class="flex flex-col items-center justify-center h-screen overflow-hidden">
	<slot />

	<div class="relative flex items-center justify-around h-20 rounded-3xl bg-background w-96 neu-up">
		<div
			class="absolute w-16 h-16 rounded-full bg-primary neu-r -z-10 duration-500 {$page.url.pathname.startsWith(
				'/explore'
			)
				? 'left-8'
				: $page.url.pathname.startsWith('/profile')
					? 'left-72'
					: 'left-40'} {switching ? 'elongate' : ''}"
		/>

		<button
			on:click={() => {
				switching = true;
				setTimeout(() => {
					switching = false;
				}, 500);
				goto('/explore');
			}}
		>
			<img class="w-6 h-6 m-6" src="/explore.svg" alt="" />
		</button>
		<button
			on:click={() => {
				switching = true;
				setTimeout(() => {
					switching = false;
				}, 500);
				goto('/');
			}}
		>
			<img class="w-6 h-6 m-6" src="/logo.svg" alt="" />
		</button>
		<button
			on:click={() => {
				switching = true;
				setTimeout(() => {
					switching = false;
				}, 500);
				goto('/profile');
			}}
		>
			<img class="w-6 h-6 m-6" src="/profile.svg" alt="" />
		</button>
	</div>
</div>
