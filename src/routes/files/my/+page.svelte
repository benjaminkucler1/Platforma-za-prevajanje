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
	import { LanguageSourceEnum, LanguageTargetEnum } from '$lib/types/enums';
	import * as Table from '$lib/components/ui/table';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(zFileCreateSchema)
	});

	const { form: formData, enhance, errors } = form;

	$: selectedSourceLanguage = $formData.sourceLanguage
		? {
				label: $formData.sourceLanguage,
				value: $formData.sourceLanguage
			}
		: undefined;

	$: selectedTargetLanguage = $formData.targetLanguage
		? {
				label: $formData.targetLanguage,
				value: $formData.targetLanguage
			}
		: undefined;

	const file = fileProxy(form, 'file');

</script>

{#if data.normal}
<Table.Root>
	<Table.Caption>Files that you are editing</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head>Name</Table.Head>
			<Table.Head>Source language</Table.Head>
			<Table.Head>Target language</Table.Head>
			<Table.Head>Progress</Table.Head>
			<Table.Head>Status</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each data.userObtainedFiles as file}
		<Table.Row>
			<Table.Cell>{file.name}</Table.Cell>
			<Table.Cell>{file.sourceLanguage}</Table.Cell>
			<Table.Cell>{file.targetLanguage}</Table.Cell>
			<Table.Cell>{file.progress}%</Table.Cell>
			<Table.Cell>{file.status}</Table.Cell>
			<Table.Cell>
				<form method="post" action="">
					<input type="hidden" name="fileId" value={file.id} />
					<Button type="submit" disabled>Edit</Button>
				</form>
			</Table.Cell>
			<Table.Cell>
				<form method="post" action="?/abandonFile">
					<input type="hidden" name="fileId" value={file.id} />
					<Button type="submit" variant="destructive">Abandon</Button>
				</form>
			</Table.Cell>
		</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
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
						<Form.Field {form} name="sourceLanguage">
							<Form.Control let:attrs>
								<Form.Label>Original Language</Form.Label>
								<Select.Root
									selected={selectedSourceLanguage}
									onSelectedChange={(v) => {
										v && ($formData.sourceLanguage = v.value);
									}}
								>
									<Select.Trigger {...attrs}>
										<Select.Value placeholder="Select a source language" />
									</Select.Trigger>
									<Select.Content>
										{#each getEnumValues(LanguageSourceEnum) as option}
											<Select.Item value={option} label={option} />
										{/each}
									</Select.Content>
								</Select.Root>
								<input hidden bind:value={$formData.sourceLanguage} name={attrs.name} />
							</Form.Control>
							<Form.Description>This is your source language.</Form.Description>
							<Form.FieldErrors />
						</Form.Field>
					</div>
					<div class="form-group">
						<Form.Field {form} name="targetLanguage">
							<Form.Control let:attrs>
								<Form.Label>Wanted Language</Form.Label>
								<Select.Root
									selected={selectedTargetLanguage}
									onSelectedChange={(v) => {
										v && ($formData.targetLanguage = v.value);
									}}
								>
									<Select.Trigger {...attrs}>
										<Select.Value placeholder="Select a target language" />
									</Select.Trigger>
									<Select.Content>
										{#each getEnumValues(LanguageTargetEnum) as option}
											<Select.Item value={option} label={option} />
										{/each}
									</Select.Content>
								</Select.Root>
								<input hidden bind:value={$formData.targetLanguage} name={attrs.name} />
							</Form.Control>
							<Form.Description>This is your target language.</Form.Description>
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
				<Table.Head>Source language</Table.Head>
				<Table.Head>Target language</Table.Head>
				<Table.Head>Progress</Table.Head>
				<Table.Head>Status</Table.Head>
				<Table.Head>Created on</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.userFiles as file}
			<Table.Row>
				<Table.Cell>{file.name}</Table.Cell>
				<Table.Cell>{file.sourceLanguage}</Table.Cell>
				<Table.Cell>{file.targetLanguage}</Table.Cell>
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
