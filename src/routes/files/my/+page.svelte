<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Select from '$lib/components/ui/select';
	import type { PageData } from './$types';
	import { superForm, fileProxy } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { zFileCreateSchema } from '$lib/validation/file';
	import SuperDebug from 'sveltekit-superforms';
	import { getEnumValues } from '$lib/utils';
	import { LanguageEnum } from '$lib/types/enums';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import * as Table from '$lib/components/ui/table';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(zFileCreateSchema)
	});

	const { form: formData, enhance, errors } = form;

	$: selectedLangFrom = $formData.langFrom
		? {
				label: $formData.langFrom,
				value: $formData.langFrom
			}
		: undefined;

	$: selectedLangTo = $formData.langTo
		? {
				label: $formData.langTo,
				value: $formData.langTo
			}
		: undefined;

	const file = fileProxy(form, 'file');

</script>

{#if data.normal}
	<h3>You have to be logged as client</h3>
{:else}
	<Dialog.Root>
		<Dialog.Trigger><Button>Upload a new file</Button></Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>New file</Dialog.Title>
				<Dialog.Description>Add file here.</Dialog.Description>
			</Dialog.Header>
			<SuperDebug data={$formData} />
			<form method="POST" enctype="multipart/form-data" action="?/addFile" use:enhance>
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
					<div class="form-group col-span-2">
						<Form.Field {form} name="name">
							<Form.Control let:attrs>
								<Form.Label>Name</Form.Label>
								<Input {...attrs} bind:value={$formData.name} />
							</Form.Control>
							<Form.Description>This is name of your file.</Form.Description>
							<Form.FieldErrors />
						</Form.Field>
					</div>
					<div class="form-group">
						<Form.Field {form} name="langFrom">
							<Form.Control let:attrs>
								<Form.Label>Original Language</Form.Label>
								<Select.Root
									selected={selectedLangFrom}
									onSelectedChange={(v) => {
										v && ($formData.langFrom = v.value);
									}}
								>
									<Select.Trigger {...attrs}>
										<Select.Value placeholder="Select a original language" />
									</Select.Trigger>
									<Select.Content>
										{#each getEnumValues(LanguageEnum) as option}
											<Select.Item value={option} label={option} />
										{/each}
									</Select.Content>
								</Select.Root>
								<input hidden bind:value={$formData.langFrom} name={attrs.name} />
							</Form.Control>
							<Form.Description>This is your original language.</Form.Description>
							<Form.FieldErrors />
						</Form.Field>
					</div>
					<div class="form-group">
						<Form.Field {form} name="langTo">
							<Form.Control let:attrs>
								<Form.Label>Wanted Language</Form.Label>
								<Select.Root
									selected={selectedLangTo}
									onSelectedChange={(v) => {
										v && ($formData.langTo = v.value);
									}}
								>
									<Select.Trigger {...attrs}>
										<Select.Value placeholder="Select a wanted language" />
									</Select.Trigger>
									<Select.Content>
										{#each getEnumValues(LanguageEnum) as option}
											<Select.Item value={option} label={option} />
										{/each}
									</Select.Content>
								</Select.Root>
								<input hidden bind:value={$formData.langTo} name={attrs.name} />
							</Form.Control>
							<Form.Description>This is your wanted language.</Form.Description>
							<Form.FieldErrors />
						</Form.Field>
					</div>
					<div class="form-group col-span-2">
						<input type="file" name="file" bind:files={$file} />
						{#if $errors.file}<span>{$errors.file}</span>{/if}
					</div>
					<div class="form-group">
						<Form.Button>Save</Form.Button>
					</div>
				</div>
			</form>
		</Dialog.Content>
	</Dialog.Root>

	<Table.Root>
		<Table.Caption>Files that you've uploaded</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head>Name</Table.Head>
				<Table.Head>Original language</Table.Head>
				<Table.Head>Wanted language</Table.Head>
				<Table.Head>Progress</Table.Head>
				<Table.Head>Status</Table.Head>
				<Table.Head>Created on</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.userFiles as file}
			<Table.Row>
				<Table.Cell>{file.name}</Table.Cell>
				<Table.Cell>{file.langFrom}</Table.Cell>
				<Table.Cell>{file.langFrom}</Table.Cell>
				<Table.Cell>{file.progress}%</Table.Cell>
				<Table.Cell>{file.status}</Table.Cell>
				<Table.Cell>{file.createdOn}</Table.Cell>
				<Table.Cell>
					<form method="post" action="?/removeFile">
						<input type="hidden" name="fileId" value={file.id} />
						<Button type="submit" variant="destructive">Remove</Button>
					</form>
				</Table.Cell>
			</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
{/if}
