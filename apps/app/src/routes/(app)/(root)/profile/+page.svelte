<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { user } from '$lib/stores';
	import { trpc } from '$lib/trpc';
	import { Button, Input, Label, Separator } from '@kader/ui/components';
</script>

<div class="flex flex-col items-center gap-4">
	<img src={$user?.pfp} alt="Profile" class="w-32 h-32 mx-auto rounded-full neu-up bg-background" />

	<h3 class="text-xl">{$user?.full_name}</h3>
</div>

<Separator class="box-content w-64 h-0.5 mx-auto my-12 rounded-full bg-background" />

<Button on:click={() => (trpc.auth.logout.mutate(), goto(base + '/login'))}>Log out</Button>
