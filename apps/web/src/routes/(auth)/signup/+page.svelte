<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { trpc } from '$lib/trpc';
	import { Button, Card, Input, Label } from '@kader/ui/components';

	const onSubmit = async (
		e: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) => {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		const data = Object.fromEntries(form.entries());

		const { success, error } = await trpc.auth.signup.mutate({
			username: data.username.toString(),
			email: data.email.toString(),
			password: data.password.toString()
		});

		if (success) goto('/dashboard');
		else console.error('Failed to sign up', error);
	};
</script>

<Card.Root class="max-w-sm mx-auto">
	<Card.Header>
		<Card.Title class="text-xl">Sign Up</Card.Title>
		<Card.Description>Enter your information to create an account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form on:submit={onSubmit}>
			<input type="hidden" name="redirect" value="{$page.url.origin}/dashboard" />
			<div class="grid gap-4">
				<div class="grid gap-2">
					<Label for="username">Username</Label>
					<Input id="username" name="username" placeholder="moot" required />
				</div>
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input id="email" name="email" type="email" placeholder="m@example.com" required />
				</div>
				<div class="grid gap-2">
					<Label for="password">Password</Label>
					<Input id="password" name="password" type="password" />
				</div>
				<Button type="submit" class="w-full">Create an account</Button>
			</div>
			<div class="mt-4 text-sm text-center">
				Already have an account?
				<button on:click={() => goto('/login')} class="underline"> Login </button>
			</div>
		</form>
	</Card.Content>
</Card.Root>
