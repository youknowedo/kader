<script lang="ts">
	import { Combobox } from '$lib/components/ui/combobox';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import {
		deleteFormSchema,
		editFormSchema,
		type DeleteFormSchema,
		type EditFormSchema
	} from './schema';

	export let data: SuperValidated<Infer<EditFormSchema>>;
	export let deleteData: SuperValidated<Infer<DeleteFormSchema>>;
	export let defaultValues: Infer<EditFormSchema>;

	const editForm = superForm(data, {
		validators: zodClient(editFormSchema),
		resetForm: false
	});
	const deleteForm = superForm(deleteData, {
		validators: zodClient(deleteFormSchema)
	});

	const { form: editFormData, enhance: editEnhance } = editForm;
	const { form: deleteFormData, enhance: deleteEnhance } = deleteForm;

	if (defaultValues) {
		editFormData.set(defaultValues);
		deleteFormData.set(defaultValues);
	}
</script>

<form method="POST" action="?/delete" id={'delete-' + $editFormData.id} use:deleteEnhance>
	<input hidden bind:value={$deleteFormData.id} name="id" />
</form>
<form method="POST" action="?/edit" id={'edit-' + $editFormData.id} use:editEnhance>
	<Form.Field form={editForm} name="name">
		<Form.Control let:attrs>
			<Form.Label>Name</Form.Label>
			<Input {...attrs} bind:value={$editFormData.name} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<div class="grid grid-cols-[3fr,2fr] gap-4">
		<Form.Field form={editForm} name="price">
			<Form.Control let:attrs>
				<Form.Label>Price</Form.Label>

				<Input
					{...attrs}
					type="number"
					value={$editFormData.price}
					on:change={(e) => ($editFormData.price = parseInt(e.currentTarget.value))}
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field form={editForm} name="currency">
			<Form.Control let:attrs>
				<Form.Label>Currency</Form.Label>
				<Combobox
					{...attrs}
					itemName="currency"
					bind:value={$editFormData.currency}
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
			<Form.Field form={editForm} name="periodDay">
				<Form.Control let:attrs>
					<Form.Label>Period Start</Form.Label>
					<Input
						{...attrs}
						type="number"
						value={$editFormData.periodDay}
						on:change={(e) => ($editFormData.periodDay = parseInt(e.currentTarget.value))}
						placeholder="day"
					/>
				</Form.Control>
				<Form.FieldErrors />
				<Form.Description class="w-4 text-nowrap">
					What day renewal invoices should come.
				</Form.Description>
			</Form.Field>

			<div class="-mx-4 mt-8 flex justify-center text-xl">/</div>

			<Form.Field form={editForm} name="periodMonth">
				<Form.Control let:attrs>
					<Form.Label>&#8205;</Form.Label>
					<Input
						{...attrs}
						type="number"
						value={$editFormData.periodMonth}
						on:change={(e) => ($editFormData.periodMonth = parseInt(e.currentTarget.value))}
						placeholder="month"
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</div>
	</div>
	<div class="flex justify-end gap-2">
		<Form.Button variant="destructive" type="submit" form={'delete-' + $editFormData.id}>
			Delete
		</Form.Button>
		<Form.Button type="submit">Edit</Form.Button>
	</div>
</form>
