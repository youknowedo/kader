<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import CreateForm from './createForm.svelte';
	import EditForm from './editForm.svelte';

	export let data;

	let accordionValue: string | string[] | undefined = undefined;
</script>

<Accordion.Root bind:value={accordionValue}>
	{#each data.subscriptions as subscription}
		<Accordion.Item value={subscription.id}>
			<Accordion.Trigger>
				{subscription.name}
			</Accordion.Trigger>
			<Accordion.Content class="overflow-visible">
				<EditForm
					data={subscription.form}
					defaultValues={{
						id: subscription.id,
						name: subscription.name,
						price: subscription.price,
						currency: subscription.currency,
						periodMonth: subscription.periodMonth,
						periodDay: subscription.periodDay
					}}
				/>
			</Accordion.Content>
		</Accordion.Item>
	{/each}
	<Accordion.Item value="create">
		<Accordion.Trigger>Create a new subscription</Accordion.Trigger>
		<Accordion.Content class="overflow-visible">
			<CreateForm data={data.createForm} />
		</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>
