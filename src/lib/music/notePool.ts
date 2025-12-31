export type KeySignature = 'C' | 'G' | 'D' | 'A' | 'E' | 'F' | 'Bb' | 'Eb' | 'Ab';
export type Clef = 'treble' | 'bass' | 'alto' | 'tenor';

export type NoteName =
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

export type NoteSpec = {
	name: NoteName;
	octave: 2 | 3 | 4 | 5;
};

export const keySignatureScales: Record<KeySignature, NoteName[]> = {
	C: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
	G: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
	D: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'],
	A: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
	E: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
	F: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
	Bb: ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'],
	Eb: ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D'],
	Ab: ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G']
};

export function getNoteNamesForKey(signature: KeySignature): NoteName[] {
	return keySignatureScales[signature];
}

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

export function getNotePool(signature: KeySignature, selectedClef: Clef): NoteSpec[] {
	const scale = keySignatureScales[signature];
	const octaves = getOctavesForClef(selectedClef);
	const pool: NoteSpec[] = [];
	for (const octave of octaves) {
		for (const name of scale) {
			pool.push({ name, octave });
		}
	}
	return pool;
}

export function pickRandomNote(signature: KeySignature, selectedClef: Clef): NoteSpec {
	const notePool = getNotePool(signature, selectedClef);
    return notePool[Math.floor(Math.random() * notePool.length)];
}
