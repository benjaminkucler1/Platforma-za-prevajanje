<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { zWordsSchema } from '$lib/validation/word';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Select from '$lib/components/ui/select';
	import { zFileCreateSchema } from '$lib/validation/file';
	import SuperDebug from 'sveltekit-superforms';
	import { getEnumValues } from '$lib/utils';
	import * as Table from '$lib/components/ui/table';
	import { CircleCheck, CircleDashed, CircleX, CircleAlert } from 'lucide-svelte';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(zWordsSchema),
		dataType: 'json'
	});

	const { form: formData, enhance, errors } = form;

	/*
    <CircleDashed size={28} color="#317e15" strokeWidth={1.5} />
        <CircleCheck size={28} color="#317e15" strokeWidth={1.5} />
        <CircleAlert size={28} color="#fbd38e" strokeWidth={1.5} />
        <CircleX size={28} color="#ff0000" strokeWidth={1.5} />
    */
</script>

{#if data.normal}
	<!--<SuperDebug data={$formData} /> -->
	<form action="?/saveWords" method="POST" use:enhance>
		<Table.Root>
			<Table.Caption>Word editor</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head>Status</Table.Head>
					<Table.Head>Source</Table.Head>
					<Table.Head>Target</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each $formData.words as word, index}
					<Table.Row>
						<Table.Cell>
							{#if $formData.words[index].value == ''}
								<CircleDashed size={28} color="#317e15" strokeWidth={1.5} />
							{:else if $formData.words[index].forbidden}
								<CircleX size={28} color="#ff0000" strokeWidth={1.5} />
							{:else if $formData.words[index].reviewRequired && !$formData.words[index].reviewed}
								<CircleAlert size={28} color="#fbd38e" strokeWidth={1.5} />
							{:else}
								<CircleCheck size={28} color="#317e15" strokeWidth={1.5} />
							{/if}
						</Table.Cell>
						<Table.Cell
							><Input
								style="text-align: right"
								id={`name-${index}`}
								type="text"
								value={word.name}
								readonly
							/></Table.Cell
						>
						<Table.Cell
							><Input
								id={`value-${index}`}
								type="text"
								bind:value={$formData.words[index].value}
							/></Table.Cell
						>
						{#if $formData.words[index].reviewRequired && !$formData.words[index].reviewed}
						<Table.Cell>
						<form method="post" action="?/confirmWord">
							<input type="hidden" name="wordId" value = {$formData.words[index].id}/>
							<Button type="submit">Confirm</Button>
						</form>
					</Table.Cell>
						{/if}
					</Table.Row>
				{/each}
			</Table.Body>
			<Form.Button>Save</Form.Button>
		</Table.Root>
	</form>
{:else}
	<h3>You have to be logged as normal user</h3>
{/if}
