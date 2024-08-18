<script lang="ts">
	import { enhance } from '$app/forms';
	import { user } from '$lib/stores';
	import { Button, Input, Label, Separator } from '@kader/ui/components';
</script>

<div class="flex flex-col items-center gap-4">
	<img src={$user?.pfp} alt="Profile" class="w-32 h-32 mx-auto rounded-full neu-up bg-background" />

	<h3 class="text-xl">{$user?.full_name}</h3>
</div>

<Separator class="box-content w-64 h-0.5 mx-auto my-12 rounded-full bg-background" />

<form method="post" action="?/logout" use:enhance>
	<button type="submit">Log out</button>
</form>
