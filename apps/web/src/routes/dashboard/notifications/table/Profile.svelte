<script lang="ts">
	import { trpc } from '$lib/trpc';
	import type { User } from '@kader/shared';
	import { Button, Drawer } from '@kader/ui/components';
	import { toast } from 'svelte-sonner';

	export let user: User;
</script>

<Drawer.Root
	onOpenChange={async () => (user = (await trpc.user.getSingle.query(user.id)).user ?? user)}
>
	<Drawer.Trigger>
		<span class="flex border-b-2 border-dotted border-muted-foreground w-fit">
			{user?.full_name ?? 'N/A'}
		</span>
	</Drawer.Trigger>
	<Drawer.Content>
		<Drawer.Header class="flex flex-col items-center gap-4">
			<img src={user.pfp} class="object-cover w-32 h-32 rounded-full" alt="" />

			<Drawer.Title>{user.full_name}</Drawer.Title>
		</Drawer.Header>
		<Drawer.Footer class="flex flex-col gap-4">
			<Drawer.Close>
				<Button
					on:click={async () => {
						const { error } = await trpc.user.acceptMembership.mutate(user.id);

						if (error) toast.error(error);
						toast.success("User's membership accepted");
					}}
					variant="neu"
				>
					Submit
				</Button>
				<Button
					on:click={async () => {
						const { error } = await trpc.user.rejectMembership.mutate(user.id);

						if (error) toast.error(error);
						toast.success("User's membership rejected");
					}}
					class="flex w-full text-primary"
					variant="ghost"
				>
					Cancel
				</Button>
			</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
