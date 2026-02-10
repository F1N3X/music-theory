<script lang="ts">
	import { goto } from '$app/navigation';
	import { House } from 'lucide-svelte';
	import RandomNoteStaff from '$lib/components/RandomNoteStaff.svelte';
	import {
		getNoteNamesForKey,
		pickRandomNote,
		pickRandomChromaticNote,
		chromaticNotes,
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
	let keyMode = $state<'with-key' | 'no-key'>('with-key');
	const clefs: { value: Clef; label: string }[] = [
		{ value: 'treble', label: 'Treble clef' },
		{ value: 'bass', label: 'Bass clef' },
		{ value: 'alto', label: 'Alto clef (C clef)' },
		{ value: 'tenor', label: 'Tenor clef (C clef)' }
	];
	let clef = $state<Clef>('treble');

	let currentNote = $state<NoteSpec>(pickRandomNote('C', 'treble'));
	let feedback = $state<{ kind: 'success' | 'error'; text: string } | null>(null);
	const answerOptions = $derived(keyMode === 'no-key' ? chromaticNotes : getNoteNamesForKey(keySignature));

	$effect(() => {
		keySignature;
		clef;
		keyMode;
		currentNote = keyMode === 'no-key' ? pickRandomChromaticNote(clef) : pickRandomNote(keySignature, clef);
		feedback = null;
	});

	function submitAnswer(answer: NoteName) {
		if (answer === currentNote.name) {
			feedback = { kind: 'success', text: 'Succès !' };
			currentNote = keyMode === 'no-key' ? pickRandomChromaticNote(clef) : pickRandomNote(keySignature, clef);
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
	<div class="mode-selection">
		<label>
			<input type="radio" bind:group={keyMode} value="with-key" />
			With key signature
		</label>
		<label>
			<input type="radio" bind:group={keyMode} value="no-key" />
			No key signature
		</label>
	</div>
	{#if keyMode === 'with-key'}
		<label>
			Key signature
			<select bind:value={keySignature}>
				{#each keySignatures as item}
					<option value={item.value}>{item.label}</option>
				{/each}
			</select>
		</label>
	{/if}
	<label>
		Clef
		<select bind:value={clef}>
			{#each clefs as item}
				<option value={item.value}>{item.label}</option>
			{/each}
		</select>
	</label>
	<RandomNoteStaff keySignature={keySignature} clef={clef} note={currentNote} showNewNoteButton={false} noKeySignature={keyMode === 'no-key'} />

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
	
	.mode-selection {
		display: flex;
		gap: 1.5rem;
		margin-bottom: 1rem;
	}
	
	.mode-selection label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}
</style>
