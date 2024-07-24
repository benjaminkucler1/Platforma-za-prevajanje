<!-- src/routes/register.svelte -->

<script lang="ts">
    import { invalidate } from '$app/navigation';
  
    let email = '';
    let password = '';
    let name = '';
    let error = '';
  
  </script>
  
  <form method="post" action="?/register">
    <div>
      <label for="email">Email</label>
      <input type="email" id="email" name="email" bind:value={email} required>
    </div>
    <div>
      <label for="password">Password</label>
      <input type="password" id="password" name="password" bind:value={password} required>
    </div>
    <div>
        <label for="name">Name</label>
        <input type="text" id="name" name="name" bind:value={name} required>
      </div>
    {#if error}
      <p style="color: red;">{error}</p>
    {/if}
    <button class="bg-blue-500 py-1 px-2 rounded text-white font-bold" type="submit">Register</button>
  </form>
  