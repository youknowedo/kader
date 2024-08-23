<script lang="ts">
	import type { Vendor } from '@kader/shared';
	import { Button, DropdownMenu, Input, Table } from '@kader/ui/components';
	import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import {
		addHiddenColumns,
		addPagination,
		addSelectedRows,
		addSortBy,
		addTableFilter
	} from 'svelte-headless-table/plugins';
	import { readable } from 'svelte/store';
	import DataTableCheckbox from './Checkbox.svelte';
	import DataTableUserNum from './NumOfUsers.svelte';

	export let data: Vendor[];

	const table = createTable(readable(data), {
		page: addPagination(),
		sort: addSortBy(),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		}),
		hide: addHiddenColumns(),
		select: addSelectedRows()
	});

	const columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: (_, { pluginStates }) => {
				const { allPageRowsSelected } = pluginStates.select;
				return createRender(DataTableCheckbox, {
					checked: allPageRowsSelected
				});
			},
			cell: ({ row }, { pluginStates }) => {
				const { getRowState } = pluginStates.select;
				const { isSelected } = getRowState(row);

				return createRender(DataTableCheckbox, {
					checked: isSelected
				});
			},
			plugins: {
				sort: { disable: true },
				filter: { exclude: true }
			}
		}),
		table.column({
			accessor: 'name',
			header: 'Name',
			cell: ({ value }) => value
		}),
		table.column({
			accessor: 'description',
			header: 'Description',
			cell: ({ value }) => value ?? 'N/A',
			plugins: {
				sort: { disable: true },
				filter: { exclude: true }
			}
		}),
		table.column({
			accessor: 'owner',
			header: 'Owner',
			cell: ({ value }) => value?.full_name ?? 'N/A'
		}),
		table.column({
			accessor: ({ id, numOfUsers }) => ({ id, numOfUsers }),
			header: 'Number of Users',
			cell: ({ value: { id, numOfUsers } }) => {
				return createRender(DataTableUserNum, { id, numOfUsers });
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, flatColumns, rows } =
		table.createViewModel(columns);

	const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;

	const { filterValue } = pluginStates.filter;
	const { hiddenColumnIds } = pluginStates.hide;
	const { selectedDataIds } = pluginStates.select;

	const ids = flatColumns.map((col) => col.id);
	let hideForId = Object.fromEntries(ids.map((id) => [id, true]));

	$: $hiddenColumnIds = Object.entries(hideForId)
		.filter(([, hide]) => !hide)
		.map(([id]) => id);

	const hidableCols = ['name', 'description', 'owner', 'numOfUsers'];
</script>

<div class="flex items-center py-4">
	<Input class="max-w-sm" placeholder="Filter emails..." type="text" bind:value={$filterValue} />

	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button variant="outline" class="ml-auto" builders={[builder]}>
				Columns <ChevronDown class="w-4 h-4 ml-2" />
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			{#each flatColumns as col}
				{#if hidableCols.includes(col.id)}
					<DropdownMenu.CheckboxItem bind:checked={hideForId[col.id]}>
						{col.header}
					</DropdownMenu.CheckboxItem>
				{/if}
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>

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
									{:else if cell.id === 'name'}
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
								<Table.Cell {...attrs}>
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
