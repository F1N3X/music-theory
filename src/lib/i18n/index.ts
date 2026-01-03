import { browser } from '$app/environment';
import { init, locale, register } from 'svelte-i18n';

export type NoteNamingSystem = 'letters' | 'solfege';

const localStorageKey = 'music-theory:note-naming-system';

function isNoteNamingSystem(value: unknown): value is NoteNamingSystem {
  return value === 'letters' || value === 'solfege';
}

function getInitialSystem(): NoteNamingSystem {
  if (!browser) {
    return 'letters';
  }
  const saved = localStorage.getItem(localStorageKey);
  return isNoteNamingSystem(saved) ? saved : 'letters';
}

register('letters', () => import('./letters.json'));
register('solfege', () => import('./solfege.json'));

init({
  fallbackLocale: 'letters',
  initialLocale: getInitialSystem()
});

if (browser) {
  console.log(locale)
  locale.subscribe((value) => {
    if (isNoteNamingSystem(value)) {
      localStorage.setItem(localStorageKey, value);
    } 
  });
}