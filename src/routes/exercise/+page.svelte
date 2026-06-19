<script lang="ts">
	import { goto } from '$app/navigation';
	import { House, CircleCheck, CircleX } from 'lucide-svelte';
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
		currentNote = keyMode === 'no-key' 
			? pickRandomChromaticNote(clef) 
			: pickRandomNote(keySignature, clef);
		feedback = null;
	});

	function submitAnswer(answer: NoteName) {
		if (answer === currentNote.name) {
			feedback = { kind: 'success', text: 'Success!' };
			currentNote = keyMode === 'no-key' ? pickRandomChromaticNote(clef) : pickRandomNote(keySignature, clef);
			return;
		}
		feedback = { kind: 'error', text: 'Fail, try again.' };
	}
</script>

<main>
	<h1>Exercise</h1>
	<button
		type="button"
		class="home-button"
		onclick={() => goto('/')}
		aria-label="Return to home menu"
		title="Return to home menu"
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

	{#key feedback}
		{#if feedback}
			<p class="feedback {feedback.kind}" role="status" aria-live="polite">
				{#if feedback.kind === 'success'}
					<CircleCheck size={20} />
				{:else}
					<CircleX size={20} />
				{/if}
				{feedback.text}
			</p>
		{/if}
	{/key}
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
	@keyframes pop-in {
		from {
			opacity: 0;
			transform: translateY(6px) scale(0.97);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	@keyframes shake {
		0%   { transform: translateX(0); }
		15%  { transform: translateX(-6px); }
		30%  { transform: translateX(6px); }
		45%  { transform: translateX(-5px); }
		60%  { transform: translateX(5px); }
		75%  { transform: translateX(-3px); }
		90%  { transform: translateX(3px); }
		100% { transform: translateX(0); }
	}

	.feedback {
		display: inline-flex;
		align-items: center;
		gap: 0.5em;
		margin-top: 1rem;
		padding: 0.5em 1.2em;
		border-radius: 99px;
		font-size: 0.95em;
		font-weight: 500;
	}

	.feedback.success {
		animation: pop-in 0.25s cubic-bezier(0.4, 0, 0.2, 1);
		background: #edfaf4;
		color: #1a7f4e;
		border: 1px solid #b6ead0;
	}

	.feedback.error {
		animation: shake 0.4s ease;
		background: #fff0f0;
		color: #c0392b;
		border: 1px solid #f5c0bb;
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
