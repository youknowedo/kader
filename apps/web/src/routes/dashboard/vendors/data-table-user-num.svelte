<script lang="ts">
	import { goto } from '$app/navigation';

	export let id: string;
	export let numOfUsers: number;
</script>

<button
	on:click={() => goto(`/dashboard/vendors/${id}/users`)}
	class="flex border-b-2 border-dotted border-muted-foreground w-fit"
>
	{numOfUsers}
</button>
