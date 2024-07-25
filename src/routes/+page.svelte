<script lang="ts">
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores'; //$page.data.session
	import { toggleMode } from 'mode-watcher';
	import Button from '$lib/components/ui/button/button.svelte';

	let email: string = '';

	const handleEmailSignIn = () => {
		signIn('nodemailer', { email, callbackUrl: '/' });
	};

	console.log($page.data.session);
</script>

<div class="p-10">
	{#if $page.data.session}
		<h1>You are logged in.</h1>
	{:else}
		<h1>You are NOT logged in.</h1>
	{/if}
</div>
