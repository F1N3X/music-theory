<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import '$lib/i18n';
	import { locale, waitLocale } from 'svelte-i18n';

    export const load = async function preload() {
        await waitLocale()
    }

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<button
	type="button"
	class="locale-toggle"
	onclick={() => ($locale = $locale === 'solfege' ? 'letters' : 'solfege')}
	aria-label="Switch note naming system"
	title="Switch note naming system"
>
	{$locale === 'solfege' ? 'Do Ré Mi → C D E' : 'C D E → Do Ré Mi'}
</button>

{@render children()}

<style>
	.locale-toggle {
		position: fixed;
		top: 1rem;
		right: 1rem;
	}
</style>