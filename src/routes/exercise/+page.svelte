<script lang="ts">
	import RandomNoteStaff from '$lib/components/RandomNoteStaff.svelte';

	type KeySignature = 'C' | 'G' | 'D' | 'A' | 'E' | 'F' | 'Bb' | 'Eb' | 'Ab';

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

	type Clef = 'treble' | 'bass' | 'alto' | 'tenor';
	const CLEFS: { value: Clef; label: string }[] = [
		{ value: 'treble', label: 'Treble clef' },
		{ value: 'bass', label: 'Bass clef' },
		{ value: 'alto', label: 'Alto clef (C clef)' },
		{ value: 'tenor', label: 'Tenor clef (C clef)' }
	];
	let clef = $state<Clef>('treble');
</script>

<main>
	<h1>Exercise</h1>
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
			{#each CLEFS as item}
				<option value={item.value}>{item.label}</option>
			{/each}
		</select>
	</label>
	<RandomNoteStaff keySignature={keySignature} clef={clef} />
</main>
