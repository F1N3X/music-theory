<script lang="ts">
	import { onMount } from 'svelte';
	import { Accidental, Formatter, Renderer, Stave, StaveNote, Voice } from 'vexflow';

	export type KeySignature = 'C' | 'G' | 'D' | 'A' | 'E' | 'F' | 'Bb' | 'Eb' | 'Ab';
	export type Clef = 'treble' | 'bass' | 'alto' | 'tenor';

	let { keySignature = 'C', clef = 'treble' } = $props<{ keySignature?: KeySignature; clef?: Clef }>();

	type NoteName =
		| 'C'
		| 'C#'
		| 'D'
		| 'D#'
		| 'E'
		| 'F'
		| 'F#'
		| 'G'
		| 'G#'
		| 'A'
		| 'A#'
		| 'B'
		| 'Bb'
		| 'Eb'
		| 'Ab'
		| 'Db';

	type NoteSpec = {
		name: NoteName;
		octave: 2 | 3 | 4 | 5;
	};

	const keySignatureScales: Record<KeySignature, NoteName[]> = {
		C:  ['C', 'D', 'E', 'F', 'G', 'A', 'B'    ],
		G:  ['G', 'A', 'B', 'C', 'D', 'E', 'F#'   ],
		D:  ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'  ],
		A:  ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#' ],
		E:  ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
		F:  ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'   ],
		Bb: ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'  ],
		Eb: ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D' ],
		Ab: ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G']
	};

	function getOctavesForClef(selectedClef: Clef): Array<2 | 3 | 4 | 5> {
		switch (selectedClef) {
			case 'bass':
				return [2, 3];
			case 'alto':
				return [3, 4];
			case 'tenor':
				return [3, 4];
			case 'treble':
			default:
				return [4, 5];
		}
	}

	function getNotePool(signature: KeySignature, selectedClef: Clef): NoteSpec[] {
		const scale = keySignatureScales[signature];
		const octaves = getOctavesForClef(selectedClef);
		const pool: NoteSpec[] = [];
		for (const octave of octaves) {
			for (const name of scale){
				pool.push({ name, octave });
			}
		}
		return pool;
	}

	function pickRandom<T>(items: T[]): T {
		return items[Math.floor(Math.random() * items.length)];
	}

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
	let currentNote = $state<NoteSpec>(pickRandom(getNotePool('C', 'treble')));
	let isReady = $state(false);
	let errorMessage = $state<string | null>(null);
	let renderScore: (() => void) | null = null;

	$effect(() => {
		const signature = keySignature;
		const selectedClef = clef;
		currentNote = pickRandom(getNotePool(signature, selectedClef));
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
		currentNote = pickRandom(getNotePool(keySignature, clef));
		renderScore?.();
	}
</script>

<div class="card">
	<div bind:this={scoreElement} aria-label="Sheet"></div>
	<button onclick={regenerateNote} disabled={!isReady || !!errorMessage}>New note</button>
	{#if errorMessage}
		<p>{errorMessage}</p>
	{/if}
</div>
