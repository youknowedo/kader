<script lang="ts">
	import Home from 'lucide-svelte/icons/house';
	import PanelLeft from 'lucide-svelte/icons/panel-left';
	import Settings from 'lucide-svelte/icons/settings';
	import Store from 'lucide-svelte/icons/store';
	import Users from 'lucide-svelte/icons/users';

	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { user } from '$lib/stores.js';
	import { trpc } from '$lib/trpc';
	import { Breadcrumb, Button, DropdownMenu, Sheet, Tooltip } from '@kader/ui/components';

	export let data;

	user.set(data.user);

	const menuItems: {
		icon: typeof Home;
		name: string;
		href: string;
		admin?: boolean;
	}[] = [
		{ icon: Home, name: 'Dashboard', href: '/dashboard' },
		{ icon: Users, name: 'Users', href: '/dashboard/users', admin: true },
		{ icon: Store, name: 'Vendors', href: '/dashboard/vendors', admin: true }
	];

	$: breadcrumbs = browser
		? $page.url.pathname
				.split('/')
				.slice(1)
				.map((path, index) => ({
					// path up until the current index
					path: $page.url.pathname
						.split('/')
						.slice(0, index + 2)
						.join('/'),
					name: path,
					isLast: index === $page.url.pathname.split('/').length - 2
				}))
		: [];

	$: browser &&
		data.sessionId &&
		breadcrumbs.forEach(async (breadcrumb, i) => {
			if (breadcrumb.name !== $page.params.vendorId)
				return (breadcrumbs[i].name =
					breadcrumb.name.charAt(0).toUpperCase() + breadcrumb.name.slice(1));

			const { vendor } = await trpc.vendor.getSingle.query($page.params.vendorId);

			breadcrumbs[i].name = vendor?.name ?? 'N/A';
		});

	const logout = async () => {
		await trpc.auth.logout.mutate();
		user.set(null);
		goto('/login');
	};
</script>

<div class="flex flex-col w-full min-h-screen bg-muted/40">
	<aside class="fixed inset-y-0 left-0 z-10 flex-col hidden border-r bg-background w-14 sm:flex">
		<nav class="flex flex-col items-center gap-4 px-2 sm:py-5">
			<a
				href="##"
				class="flex items-center justify-center gap-2 text-lg font-semibold rounded-full bg-primary text-primary-foreground group h-9 w-9 shrink-0 md:h-8 md:w-8 md:text-base"
			>
				<img class="w-4 h-4 transition-all group-hover:scale-110" src="/logo.svg" alt="" />
				<span class="sr-only">Acme Inc</span>
			</a>
			{#each menuItems as { icon, name, href, admin }}
				{#if !admin || $user?.role === 'admin'}
					<Tooltip.Root>
						<Tooltip.Trigger asChild let:builder>
							<a
								{href}
								class="flex items-center justify-center transition-colors rounded-lg hover:text-foreground h-9 w-9 md:h-8 md:w-8 {$page
									.url.pathname === href
									? 'bg-accent text-accent-foreground'
									: 'text-muted-foreground'}"
								use:builder.action
								{...builder}
							>
								<svelte:component this={icon} class="w-5 h-5" />
								<span class="sr-only">{name}</span>
							</a>
						</Tooltip.Trigger>
						<Tooltip.Content side="right">{name}</Tooltip.Content>
					</Tooltip.Root>
				{/if}
			{/each}
		</nav>
		<nav class="flex flex-col items-center gap-4 px-2 mt-auto sm:py-5">
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<a
						href="/dashboard/settings"
						class="flex items-center justify-center transition-colors rounded-lg text-muted-foreground hover:text-foreground h-9 w-9 md:h-8 md:w-8 {$page
							.url.pathname === '/dashboard/settings'
							? 'bg-accent text-accent-foreground'
							: 'text-muted-foreground'}}"
						use:builder.action
						{...builder}
					>
						<Settings class="w-5 h-5" />
						<span class="sr-only">Settings</span>
					</a>
				</Tooltip.Trigger>
				<Tooltip.Content side="right">Settings</Tooltip.Content>
			</Tooltip.Root>
		</nav>
	</aside>
	<div class="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
		<header
			class="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 border-b bg-background h-14 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
		>
			<Breadcrumb.Root class="hidden sm:flex">
				<Breadcrumb.List>
					{#each breadcrumbs as { path, name, isLast }, index}
						<Breadcrumb.Item>
							<Breadcrumb.Link href={path}>{name}</Breadcrumb.Link>
						</Breadcrumb.Item>
						{#if !isLast}
							<Breadcrumb.Separator />
						{/if}
					{/each}
				</Breadcrumb.List>
			</Breadcrumb.Root>

			<Sheet.Root>
				<Sheet.Trigger asChild let:builder>
					<Button builders={[builder]} size="icon" variant="outline" class="sm:hidden">
						<PanelLeft class="w-5 h-5" />
						<span class="sr-only">Toggle Menu</span>
					</Button>
				</Sheet.Trigger>
				<Sheet.Content side="left" class="sm:max-w-xs">
					<nav class="flex flex-col justify-between h-full">
						<div class="grid gap-6 text-lg font-medium">
							<a
								href="##"
								class="flex items-center justify-center w-10 h-10 gap-2 text-lg font-semibold rounded-full bg-primary text-primary-foreground group shrink-0 md:text-base"
							>
								<img class="w-5 h-5 transition-all group-hover:scale-110" src="/logo.svg" alt="" />
								<span class="sr-only">Acme Inc</span>
							</a>
							{#each menuItems as { icon, name, href, admin }}
								{#if !admin || $user?.role === 'admin'}
									<a
										{href}
										class="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
									>
										<svelte:component this={icon} class="w-5 h-5" />
										{name}
									</a>
								{/if}
							{/each}
						</div>

						<a
							href="/dahsboard/settings"
							class="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
						>
							<Settings class="w-5 h-5" />
							Settings
						</a>
					</nav>
				</Sheet.Content>
			</Sheet.Root>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button
						variant="outline"
						size="icon"
						class="overflow-hidden rounded-full"
						builders={[builder]}
					>
						<img
							src={$user?.pfp}
							width={36}
							height={36}
							alt="Avatar"
							class="overflow-hidden rounded-full"
						/>
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Label>My Account</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Item>Settings</DropdownMenu.Item>
					<DropdownMenu.Item>Support</DropdownMenu.Item>

					<DropdownMenu.Separator />

					<DropdownMenu.Item on:click={logout}>Logout</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</header>

		<main class="px-6">
			<slot />
		</main>
	</div>
</div>
