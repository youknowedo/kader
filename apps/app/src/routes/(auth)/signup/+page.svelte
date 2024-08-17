<script lang="ts">
	import { goto } from '$app/navigation';
	import { PUBLIC_SERVER_URL } from '$env/static/public';
	import { Button, Card, Input, Label } from '@kader/ui/components';
</script>

<Card.Root class="max-w-sm mx-auto">
	<Card.Header>
		<Card.Title class="text-xl">Sign Up</Card.Title>
		<Card.Description>Enter your information to create an account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form action="{PUBLIC_SERVER_URL}/auth/email/signup" method="post">
			<div class="grid gap-4">
				<div class="grid grid-cols-2 gap-4">
					<div class="grid gap-2">
						<Label for="first-name">First name</Label>
						<Input id="first-name" placeholder="Max" required />
					</div>
					<div class="grid gap-2">
						<Label for="last-name">Last name</Label>
						<Input id="last-name" placeholder="Robinson" required />
					</div>
				</div>
				<div class="grid gap-2">
					<Label for="username">Username</Label>
					<Input id="username" placeholder="moot" required />
				</div>
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input id="email" type="email" placeholder="m@example.com" required />
				</div>
				<div class="grid gap-2">
					<Label for="password">Password</Label>
					<Input id="password" type="password" />
				</div>
				<Button type="submit" class="w-full">Create an account</Button>
				<Button variant="outline" class="w-full">Sign up with GitHub</Button>
			</div>
			<div class="mt-4 text-sm text-center">
				Already have an account?
				<button on:click={() => goto('/login')} class="underline"> Login </button>
			</div>
		</form>
	</Card.Content>
</Card.Root>
