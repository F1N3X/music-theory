<script lang="ts">
    import { goto } from '$app/navigation';
</script>

<main>
    <h1>Welcome to Music Theory</h1>
    <p>Let's practice together!</p>
    <button type="button" on:click={() => goto('/exercise')}>Start Exercise</button>
</main>