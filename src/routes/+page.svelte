<script lang="ts">
    import { signIn, signOut } from "@auth/sveltekit/client";
    import { page } from "$app/stores"; //$page.data.session

    let email = "";
    let password = "";

    console.log($page.data.session);


</script>

<div class="p-24">
    {#if $page.data.session}
        <h1> You are logged in. </h1>
        {#if $page.data.session.user?.image}
            <img class="w-12 h-12" src="{$page.data.session.user.image}" alt="User Profile">
        {/if}
        <p>Signed in as {$page.data.session.user?.name}</p>
        <button on:click={() => signOut()} class="bg-blue-500 py-1 px-2 rounded text-white font-bold">Sign out</button>

    {:else}
        <h1> You are NOT logged in. </h1>
        <form>
            <label>
              Email
              <input name="email" type="email" bind:value={email} />
            </label>
            <label>
              Password
              <input name="password" type="password" bind:value={password} />
            </label>
            <button on:click={() => signIn('credentials', { email, password })}>
              Log in
            </button>
          </form>
        <button on:click={() => signIn("github")} class="bg-blue-500 py-1 px-2 rounded text-white font-bold">Sign in with Github</button>
        <br><br>
        
        {/if}
</div>
