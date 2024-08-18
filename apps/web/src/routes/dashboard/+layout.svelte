<script lang="ts">
	import LineChart from 'lucide-svelte/icons/chart-line';
	import Home from 'lucide-svelte/icons/house';
	import Package from 'lucide-svelte/icons/package';
	import Package2 from 'lucide-svelte/icons/package-2';
	import PanelLeft from 'lucide-svelte/icons/panel-left';
	import Search from 'lucide-svelte/icons/search';
	import Settings from 'lucide-svelte/icons/settings';
	import ShoppingCart from 'lucide-svelte/icons/shopping-cart';
	import UsersRound from 'lucide-svelte/icons/users-round';

	import { page } from '$app/stores';
	import { Breadcrumb, Button, DropdownMenu, Input, Sheet, Tooltip } from '@kader/ui/components';

	const menuItems = [
		{ icon: Home, name: 'Dashboard', href: '/dashboard' },
		{ icon: ShoppingCart, name: 'Orders', href: '/dashboard/orders' },
		{ icon: Package, name: 'Products', href: '/dashboard/products' },
		{ icon: UsersRound, name: 'Customers', href: '/dashboard/customers' },
		{ icon: LineChart, name: 'Settings', href: '/dashboard/settings' }
	];

	const breadcrumbs = $page.url.pathname
		.split('/')
		.slice(1)
		.map((path, index) => {
			return {
				// path up until the current index
				path: $page.url.pathname
					.split('/')
					.slice(0, index + 2)
					.join('/'),
				name: path.charAt(0).toUpperCase() + path.slice(1),
				isLast: index === $page.url.pathname.split('/').length - 2
			};
		});
</script>

<div class="flex flex-col w-full min-h-screen bg-muted/40">
	<aside class="fixed inset-y-0 left-0 z-10 flex-col hidden border-r bg-background w-14 sm:flex">
		<nav class="flex flex-col items-center gap-4 px-2 sm:py-5">
			<a
				href="##"
				class="flex items-center justify-center gap-2 text-lg font-semibold rounded-full bg-primary text-primary-foreground group h-9 w-9 shrink-0 md:h-8 md:w-8 md:text-base"
			>
				<Package2 class="w-4 h-4 transition-all group-hover:scale-110" />
				<span class="sr-only">Acme Inc</span>
			</a>
			{#each menuItems as { icon, name, href }}
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
			{/each}
		</nav>
		<nav class="flex flex-col items-center gap-4 px-2 mt-auto sm:py-5">
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<a
						href="##"
						class="flex items-center justify-center transition-colors rounded-lg text-muted-foreground hover:text-foreground h-9 w-9 md:h-8 md:w-8"
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
			class="sticky top-0 z-30 flex items-center gap-4 px-4 border-b bg-background h-14 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
		>
			<Sheet.Root>
				<Sheet.Trigger asChild let:builder>
					<Button builders={[builder]} size="icon" variant="outline" class="sm:hidden">
						<PanelLeft class="w-5 h-5" />
						<span class="sr-only">Toggle Menu</span>
					</Button>
				</Sheet.Trigger>
				<Sheet.Content side="left" class="sm:max-w-xs">
					<nav class="grid gap-6 text-lg font-medium">
						<a
							href="##"
							class="flex items-center justify-center w-10 h-10 gap-2 text-lg font-semibold rounded-full bg-primary text-primary-foreground group shrink-0 md:text-base"
						>
							<Package2 class="w-5 h-5 transition-all group-hover:scale-110" />
							<span class="sr-only">Acme Inc</span>
						</a>
						<a
							href="##"
							class="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
						>
							<Home class="w-5 h-5" />
							Dashboard
						</a>
						<a href="##" class="text-foreground flex items-center gap-4 px-2.5">
							<ShoppingCart class="w-5 h-5" />
							Orders
						</a>
						<a
							href="##"
							class="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
						>
							<Package class="w-5 h-5" />
							Products
						</a>
						<a
							href="##"
							class="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
						>
							<UsersRound class="w-5 h-5" />
							Customers
						</a>
						<a
							href="##"
							class="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
						>
							<LineChart class="w-5 h-5" />
							Settings
						</a>
					</nav>
				</Sheet.Content>
			</Sheet.Root>
			<Breadcrumb.Root class="hidden md:flex">
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
			<div class="relative flex-1 ml-auto md:grow-0">
				<Search class="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
				<Input
					type="search"
					placeholder="Search..."
					class="bg-background w-full rounded-lg pl-8 md:w-[200px] lg:w-[336px]"
				/>
			</div>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button
						variant="outline"
						size="icon"
						class="overflow-hidden rounded-full"
						builders={[builder]}
					>
						<img
							src="/images/placeholder-user.jpg"
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
					<DropdownMenu.Item>Logout</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</header>

		<main>
			<slot />
		</main>
	</div>
</div>
