<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Select from '$lib/components/ui/select';

	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { zUserProfileSchema } from '$lib/validation/user';
	import SuperDebug from 'sveltekit-superforms';
	import type { PageData } from '../$types';
	import { LanguageEnum } from '$lib/types/enums';
	import { getEnumValues } from '$lib/utils';
	import { Trigger } from '$lib/components/ui/alert-dialog';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(zUserProfileSchema)
	});

	const { form: formData, enhance } = form;


	$: selectedFirstLang = $formData.firstLang
    ? {
        label: $formData.firstLang,
        value: $formData.firstLang
      }
    : undefined;
</script>

<SuperDebug data={$formData} />
<form method="POST" use:enhance>
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
		<div class="form-group">
			<Form.Field {form} name="name">
				<Form.Control let:attrs>
					<Form.Label>Name</Form.Label>
					<Input {...attrs} bind:value={$formData.name} />
				</Form.Control>
				<Form.Description>This is your public display name.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<div class="form-group">
			<Form.Field {form} name="phone">
				<Form.Control let:attrs>
					<Form.Label>Phone</Form.Label>
					<Input {...attrs} bind:value={$formData.phone} />
				</Form.Control>
				<Form.Description>This is your phone number.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<div class="form-group">
			<Form.Field {form} name="street">
				<Form.Control let:attrs>
					<Form.Label>Street</Form.Label>
					<Input {...attrs} bind:value={$formData.street} />
				</Form.Control>
				<Form.Description>This is your street address.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<div class="form-group">
			<Form.Field {form} name="postnumber">
				<Form.Control let:attrs>
					<Form.Label>Post Number</Form.Label>
					<Input {...attrs} bind:value={$formData.postnumber} />
				</Form.Control>
				<Form.Description>This is your post number.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<div class="form-group">
			<Form.Field {form} name="city">
				<Form.Control let:attrs>
					<Form.Label>City</Form.Label>
					<Input {...attrs} bind:value={$formData.city} />
				</Form.Control>
				<Form.Description>This is your city.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
		</div>
	</div>
	{#if data.normal}
		<div class="form-group">
			<Form.Field {form} name="school">
				<Form.Control let:attrs>
					<Form.Label>School</Form.Label>
					<Input {...attrs} bind:value={$formData.school} />
				</Form.Control>
				<Form.Description>This is your school.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<div class="form-group">
			<Form.Field {form} name="birthday">
				<Form.Control let:attrs>
					<Form.Label>Birthday</Form.Label>
					<Input type="date" {...attrs} bind:value={$formData.birthday} />
				</Form.Control>
				<Form.Description>This is your birthday.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
		</div>

		<div class="form-group">
			<Form.Field {form} name="firstLang">
				<Form.Control let:attrs>
					<Form.Label>First Language</Form.Label>
					<Select.Root
						selected = {selectedFirstLang}
						onSelectedChange={(v) => {
							v && ($formData.firstLang = v.value);
						  }}>
						  <Select.Trigger {...attrs}>
							<Select.Value placeholder="Select a first language" />
						  </Select.Trigger>
						  <Select.Content>
							{#each getEnumValues(LanguageEnum) as option}
								<Select.Item value="{option}" label="{option}" />
							{/each}
						  </Select.Content>
					</Select.Root>
					<input hidden bind:value={$formData.firstLang} name={attrs.name} />
				</Form.Control>
				<Form.Description>This is your first language.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
		</div>
	{/if}
	<div class="form-group">
		<Form.Button>Save</Form.Button>
	</div>
</form>
