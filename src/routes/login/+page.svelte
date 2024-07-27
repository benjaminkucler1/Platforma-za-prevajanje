<script lang="ts">
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores'; //$page.data.session
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';


	let email: string = '';

	const handleEmailSignIn = () => {
		signIn('nodemailer', { email, callbackUrl: '/' });
	};

	console.log($page.data.session);
</script>

<div class="p-10">
	{#if $page.data.session}
		<h1>You are logged in.</h1>
		{#if $page.data.session.user?.image}
			<img class="h-12 w-12" src={$page.data.session.user.image} alt="User Profile" />
		{/if}
		<p>Signed in as {$page.data.session.user?.name}</p>
		<Button on:click={() => signOut()}>Sign out</Button>
	{:else}
		<h1>You are NOT logged in.</h1>
		<div class="pt-10">
			<Button on:click={() => signIn('github')}>Sign in with Github</Button>
		</div>
		<div class="pt-10">
			<form on:submit={handleEmailSignIn} class="flex w-full max-w-sm items-center space-x-2">
				<Input type="email" placeholder="email" bind:value={email} />
				<Button type="submit">Sign in with magic links</Button>
			</form>
		</div>
		<div class="pt-10">
			<Button on:click={() => signIn('google')}>Sign in with Google</Button>
		</div>
	{/if}
</div>
