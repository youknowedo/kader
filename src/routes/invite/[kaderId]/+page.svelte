<script>
	import { Button } from '$lib/components/ui/button';

	export let data;
</script>

{#if data.valid}
	<h1>You have been invited to a kader</h1>

	<Button href="/signup">Sign Up</Button>

	<Button variant="secondary" href="/login">Log In</Button>
{:else}
	<h1>Invalid invite link</h1>
{/if}
