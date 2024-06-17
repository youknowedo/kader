<script>
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
</script>

<h1>What do you want to do?</h1>

<Button on:click={() => goto('/onboarding/create')}>Create</Button>
