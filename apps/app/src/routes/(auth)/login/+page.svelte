<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { trpc } from '$lib/trpc';
	import { Button, Card, Input, Label } from '@kader/ui/components';
	import '@kader/ui/styles.css';

	const login = async (
		e: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);

		const { success, error } = await trpc.auth.login.mutate({
			email: formData.get('email') as string,
			password: formData.get('password') as string
		});

		if (!success) {
			alert(error);
			return;
		}

		window.location.reload();
	};
</script>

<Card.Root class="max-w-sm mx-auto">
	<Card.Header>
		<Card.Title class="text-2xl">Login</Card.Title>
		<Card.Description>Enter your email below to login to your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form on:submit={login}>
			<div class="grid gap-4">
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input id="email" name="email" type="email" placeholder="m@example.com" required />
				</div>
				<div class="grid gap-2">
					<div class="flex items-center">
						<Label for="password">Password</Label>
						<a href="{base}/login" class="inline-block ml-auto text-sm underline">
							Forgot your password?
						</a>
					</div>
					<Input id="password" name="password" type="password" required />
				</div>
				<Button type="submit" class="w-full">Login</Button>
				<Button variant="neu" class="w-full">I have a code</Button>
			</div>
			<div class="mt-4 text-sm text-center">
				Don&apos;t have an account?
				<button on:click={() => goto('/signup')} class="underline">Sign up</button>
			</div>
		</form>
	</Card.Content>
</Card.Root>
