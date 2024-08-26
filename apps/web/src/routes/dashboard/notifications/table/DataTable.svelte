<script lang="ts">
	import { Button, Table } from '@kader/ui/components';
	import type { User } from 'lucia';
	import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';

	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { addPagination, addSelectedRows, addSortBy } from 'svelte-headless-table/plugins';
	import { readable } from 'svelte/store';
	import Checkbox from './Checkbox.svelte';
	import Profile from './Profile.svelte';

	export let data: User[];

	const table = createTable(readable(data), {
		page: addPagination(),
		sort: addSortBy(),
		select: addSelectedRows()
	});

	const columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: (_, { pluginStates }) => {
				const { allPageRowsSelected } = pluginStates.select;
				return createRender(Checkbox, {
					checked: allPageRowsSelected
				});
			},
			cell: ({ row }, { pluginStates }) => {
				const { getRowState } = pluginStates.select;
				const { isSelected } = getRowState(row);

				return createRender(Checkbox, {
					checked: isSelected
				});
			}
		}),
		table.column({
			id: 'full_name',
			accessor: (u) => ({ user: u }),
			header: 'Name',
			cell: ({ value }) => createRender(Profile, value)
		}),
		table.column({
			id: 'email',
			accessor: 'email',
			header: 'Email',
			cell: ({ value }) => value
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, flatColumns, rows } =
		table.createViewModel(columns);

	const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;

	const { selectedDataIds } = pluginStates.select;

	const ids = flatColumns.map((col) => col.id);
	let hideForId = Object.fromEntries(ids.map((id) => [id, true]));
</script>

<div class="border rounded-md">
	<Table.Root {...$tableAttrs}>
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
								<Table.Head {...attrs} class="[&:has([role=checkbox])]:pl-3">
									{#if cell.id === 'id'}
										<div class="pl-1 -mb-1">
											<Render of={cell.render()} />
										</div>
									{:else if cell.id === 'full_name' || cell.id === 'email'}
										<Button class="-mx-4" variant="ghost" on:click={props.sort.toggle}>
											<Render of={cell.render()} />
											<ArrowUpDown class={'ml-2 h-4 w-4'} />
										</Button>
									{:else}
										<Render of={cell.render()} />
									{/if}
								</Table.Head>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Header>
		<Table.Body {...$tableBodyAttrs}>
			{#each $pageRows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<Table.Row {...rowAttrs} data-state={$selectedDataIds[row.id] && 'selected'}>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<Table.Cell {...attrs} width="10px">
									{#if cell.id === 'id'}
										<div class="-mb-1">
											<Render of={cell.render()} />
										</div>
									{:else if cell.id === 'status'}
										<div class="capitalize">
											<Render of={cell.render()} />
										</div>
									{:else}
										<Render of={cell.render()} />
									{/if}
								</Table.Cell>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Body>
	</Table.Root>
</div>

<div class="flex items-center justify-end py-4 space-x-4">
	<div class="flex-1 text-sm text-muted-foreground">
		{Object.keys($selectedDataIds).length} of{' '}
		{$rows.length} row(s) selected.
	</div>
	<Button
		variant="outline"
		size="sm"
		on:click={() => ($pageIndex = $pageIndex - 1)}
		disabled={!$hasPreviousPage}>Previous</Button
	>
	<Button
		variant="outline"
		size="sm"
		disabled={!$hasNextPage}
		on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
	>
</div>
