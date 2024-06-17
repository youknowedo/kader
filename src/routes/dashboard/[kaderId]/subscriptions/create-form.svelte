<script lang="ts">
	import { Combobox } from '$lib/components/ui/combobox';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { createSchema, type CreateSchema } from './schema';

	export let data: SuperValidated<Infer<CreateSchema>>;

	const form = superForm(data, {
		validators: zodClient(createSchema)
	});

	const { form: formData, enhance } = form;
</script>

{$formData.currency}

<form method="POST" action="?/create" use:enhance>
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input {...attrs} bind:value={$formData.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<div class="grid grid-cols-[3fr,2fr] gap-4">
		<Form.Field {form} name="price">
			<Form.Control let:attrs>
				<Form.Label>Price</Form.Label>

				<Input
					{...attrs}
					type="number"
					on:change={(e) => ($formData.periodDay = parseInt(e.currentTarget.value))}
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="currency">
			<Form.Control let:attrs>
				<Form.Label>Currency</Form.Label>
				<Combobox
					{...attrs}
					itemName="currency"
					bind:value={$formData.currency}
					items={[
						{
							value: 'SEK',
							label: 'kr (SEK)'
						}
					]}
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>
	<div class="grid grid-cols-[3fr,2fr] gap-4">
		<div class="grid grid-cols-[1fr,0.5rem,1fr] gap-2">
			<Form.Field {form} name="periodDay">
				<Form.Control let:attrs>
					<Form.Label>Period Start</Form.Label>
					<Input
						{...attrs}
						type="number"
						on:change={(e) => ($formData.periodDay = parseInt(e.currentTarget.value))}
						placeholder="day"
					/>
				</Form.Control>
				<Form.FieldErrors />
				<Form.Description class="w-4 text-nowrap">
					What day renewal invoices should come.
				</Form.Description>
			</Form.Field>

			<div class="-mx-4 mt-8 flex justify-center text-xl">/</div>

			<Form.Field {form} name="periodMonth">
				<Form.Control let:attrs>
					<Form.Label>&#8205;</Form.Label>
					<Input
						{...attrs}
						type="number"
						on:change={(e) => ($formData.periodMonth = parseInt(e.currentTarget.value))}
						placeholder="month"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
	</div>
	<div class="flex justify-end">
		<Form.Button>Create</Form.Button>
	</div>
</form>
