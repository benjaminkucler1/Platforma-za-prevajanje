<script>
	import '../app.css';
	import { ModeWatcher } from "mode-watcher";
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';
	import { signOut } from '@auth/sveltekit/client';
	import { Sun } from 'lucide-svelte';
	import { Moon } from 'lucide-svelte';
	import { toggleMode } from 'mode-watcher';
</script>

<ModeWatcher />

<nav class="flex justify-between items-center py-4 px-6">
	<div>
		<Button on:click={toggleMode} variant="outline" size="icon">
			<Sun
				class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
			/>
			<Moon
				class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
		<a href="/" class="text-xl font-extrabold">TRANSLATOR</a>
	</div>
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
<main class="p-5">
	<slot />
</main>


