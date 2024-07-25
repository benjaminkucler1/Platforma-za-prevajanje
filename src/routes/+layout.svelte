<script>
	import '../app.css';
	import { ModeWatcher } from "mode-watcher";
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';
	import { signOut } from '@auth/sveltekit/client';
</script>

<ModeWatcher />

<nav class="flex justify-between items-center py-4 px-6">
	<a href="/" class="text-xl font-extrabold">TODO APP</a>
	{#if !$page.data.session}
		<div class="flex gap-4">
			<a href="/login">Login</a>
		</div>
	{:else}
		<div class="flex gap-4 items-center">
			
			<div class="flex items-center gap-2">
				<img class="h-12 w-12" src={$page.data.session.user?.image} alt="User Profile" />
				<div class="flex flex-col">
					<p class="text-sm">{$page.data.session.user?.name}</p>
					<p class="text-xs text-zinc-500">{$page.data.session.user?.email}</p>
				</div>
			</div>
			<Button on:click={() => signOut()}>Logout</Button>
		</div>
	{/if}
</nav>
<main>
	<slot />
</main>


