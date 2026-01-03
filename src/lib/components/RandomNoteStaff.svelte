<script lang="ts">
	import { onMount } from 'svelte';

	import { 
		Accidental, 
		Formatter, 
		Renderer, 
		Stave, 
		StaveNote, 
		Voice 
	} from 'vexflow';

	import { 
		pickRandomNote, 
		type Clef, 
		type KeySignature, 
		type NoteSpec 
	} from '$lib/music/notePool';

	let {
		keySignature = 'C',
		clef = 'treble',
		note = undefined,
		showNewNoteButton = true
	} = $props<{
		keySignature?: KeySignature;
		clef?: Clef;
		note?: NoteSpec;
		showNewNoteButton?: boolean;
	}>();

	function toVexKey(note: NoteSpec): { key: string; accidental: '#' | 'b' | null } {
		const lower = note.name.toLowerCase();
		if (lower.includes('#')) {
			return { key: `${lower[0]}#/${note.octave}`, accidental: '#' };
		}
		if (lower.includes('b')) {
			return { key: `${lower[0]}b/${note.octave}`, accidental: 'b' };
		}
		return { key: `${lower}/${note.octave}`, accidental: null };
	}

	let scoreElement: HTMLDivElement | null = null;
	let currentNote = $state<NoteSpec>(pickRandomNote('C', 'treble'));
	let isReady = $state(false);
	let errorMessage = $state<string | null>(null);
	let renderScore: (() => void) | null = null;

	$effect(() => {
		const incoming = note;
		if (incoming) {
			currentNote = incoming;
			return;
		}
		currentNote = pickRandomNote(keySignature, clef);
	});

	$effect(() => {
		if (!isReady){
			return;
		}
		currentNote;
		renderScore?.();
	});

	onMount(() => {
		let disposed = false;

		try {
			isReady = true;

			renderScore = () => {
				if (disposed || !scoreElement) {
					return;
				}

				scoreElement.innerHTML = '';
				const renderer = new Renderer(scoreElement, Renderer.Backends.SVG);
				renderer.resize(460, 180);
				const context = renderer.getContext();

				const stave = new Stave(10, 40, 440);
				stave.addClef(clef);
				stave.addKeySignature(keySignature);
				stave.setContext(context).draw();

				const { key, accidental } = toVexKey(currentNote);
				const staveNote = new StaveNote({ keys: [key], duration: 'q' });
				if (accidental) {
					staveNote.addModifier(new Accidental(accidental), 0);
				}

				const voice = new Voice({ numBeats: 1, beatValue: 4 });
				voice.addTickables([staveNote]);

				new Formatter().joinVoices([voice]).format([voice], 240);
				voice.draw(context, stave);
			};

			renderScore();
		} catch (err) {
			if (disposed) {
				return;
			}
			const message = err instanceof Error ? err.message : String(err);
			errorMessage = `Unable to load the sheet music renderer (${message}).`;
		}

		return () => {
			disposed = true;
			renderScore = null;
			if (scoreElement) {
				scoreElement.innerHTML = '';
			}
		};
	});

	function regenerateNote() {
		if (note) {
			return;
		}
		currentNote = pickRandomNote(keySignature, clef);
		renderScore?.();
	}
</script>

<div class="card">
	<div bind:this={scoreElement} aria-label="sheet"></div>
	{#if showNewNoteButton}
		<button onclick={regenerateNote} disabled={!isReady || !!errorMessage}>New note</button>
	{/if}
	{#if errorMessage}
		<p>{errorMessage}</p>
	{/if}
</div>
