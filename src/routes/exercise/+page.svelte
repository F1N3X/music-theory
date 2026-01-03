<script lang="ts">
	import { goto } from '$app/navigation';
	import { House } from 'lucide-svelte';
	import RandomNoteStaff from '$lib/components/RandomNoteStaff.svelte';
	import {
		getNoteNamesForKey,
		pickRandomNote,
		type Clef,
		type KeySignature,
		type NoteName,
		type NoteSpec
	} from '$lib/music/notePool';
	import { _ } from 'svelte-i18n'

	const keySignatures: { value: KeySignature; label: string }[] = [
		{ value: 'C', label: 'C (C major)' },
		{ value: 'G', label: 'G (G major)' },
		{ value: 'D', label: 'D (D major)' },
		{ value: 'A', label: 'A (A major)' },
		{ value: 'E', label: 'E (E major)' },
		{ value: 'F', label: 'F (F major)' },
		{ value: 'Bb', label: 'Bb (B-flat major)' },
		{ value: 'Eb', label: 'Eb (E-flat major)' },
		{ value: 'Ab', label: 'Ab (A-flat major)' }
	];

	let keySignature = $state<KeySignature>('C');
	const clefs: { value: Clef; label: string }[] = [
		{ value: 'treble', label: 'Treble clef' },
		{ value: 'bass', label: 'Bass clef' },
		{ value: 'alto', label: 'Alto clef (C clef)' },
		{ value: 'tenor', label: 'Tenor clef (C clef)' }
	];
	let clef = $state<Clef>('treble');

	let currentNote = $state<NoteSpec>(pickRandomNote('C', 'treble'));
	let feedback = $state<{ kind: 'success' | 'error'; text: string } | null>(null);
	const answerOptions = $derived(getNoteNamesForKey(keySignature));

	$effect(() => {
		keySignature;
		clef;
		currentNote = pickRandomNote(keySignature, clef);
		feedback = null;
	});

	function submitAnswer(answer: NoteName) {
		if (answer === currentNote.name) {
			feedback = { kind: 'success', text: 'Succès !' };
			currentNote = pickRandomNote(keySignature, clef);
			return;
		}
		feedback = { kind: 'error', text: 'Échec, réessayer.' };
	}
</script>

<main>
	<h1>Exercise</h1>
	<button
		type="button"
		class="home-button"
		onclick={() => goto('/')}
		aria-label="Retour au menu d'accueil"
		title="Retour au menu d'accueil"
	>
		<House size={24} />
	</button>
	<label>
		Key signature
		<select bind:value={keySignature}>
			{#each keySignatures as item}
				<option value={item.value}>{item.label}</option>
			{/each}
		</select>
	</label>
	<label>
		Clef
		<select bind:value={clef}>
			{#each clefs as item}
				<option value={item.value}>{item.label}</option>
			{/each}
		</select>
	</label>
	<RandomNoteStaff keySignature={keySignature} clef={clef} note={currentNote} showNewNoteButton={false} />

	<div class="answers" aria-label="Answer buttons">
		{#each answerOptions as noteName}
			<button type="button" onclick={() => submitAnswer(noteName)}>
				{$_(`noteName.${noteName}`)}
			</button>
		{/each}
	</div>

	{#if feedback}
		<p class="feedback" role="status" aria-live="polite">{feedback.text}</p>
	{/if}
</main>

<style>
	.home-button {
		position: fixed;
		top: 1rem;
		left: 1rem;
		padding: 0.5rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.answers {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: center;
		max-width: 520px;
	}
	.feedback {
		margin-top: 0.75rem;
	}
</style>
