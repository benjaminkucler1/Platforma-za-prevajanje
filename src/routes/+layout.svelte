<script>
	import '../app.css';
	import { ModeWatcher } from "mode-watcher";
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';
	import { signOut } from '@auth/sveltekit/client';
</script>

<ModeWatcher />

{#if $page.data.session}
	<Button on:click={() => signOut()}>Logout</Button>
	<slot />
{:else}
	<a href="/login">Login</a>
{/if}



