<script lang="ts">
	import type { PageData } from "./$types";
    import * as Table from '$lib/components/ui/table';
    import { Button } from '$lib/components/ui/button/index.js';

    export let data: PageData;
</script>

{#if !data.normal}
	<h3>You have to be logged as normal user</h3>
{:else}
	<Table.Root>
		<Table.Caption>All obtainable files</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head>Name</Table.Head>
				<Table.Head>Original language</Table.Head>
				<Table.Head>Wanted language</Table.Head>
				<Table.Head>Progress</Table.Head>
				<Table.Head>Status</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each data.obtainableFiles as file}
			<Table.Row>
				<Table.Cell>{file.name}</Table.Cell>
				<Table.Cell>{file.langFrom}</Table.Cell>
				<Table.Cell>{file.langFrom}</Table.Cell>
				<Table.Cell>{file.progress}%</Table.Cell>
				<Table.Cell>{file.status}</Table.Cell>
				<Table.Cell>
					<form method="post" action="?/obtainFile">
						<input type="hidden" name="fileId" value={file.id} />
						<Button type="submit">Obtain</Button>
					</form>
				</Table.Cell>
			</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
{/if}
