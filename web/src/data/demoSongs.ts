import { chordsInLine } from '../utils/chordpro'

/**
 * A small, wholly original demo dataset for the Song Lyrics + Chords
 * feature — deliberately NOT the real `Song` catalog (`types/song.ts`,
 * `data/songs.ts`), which has an explicit doc comment that Guitool never
 * stores lyrics/chord charts for real songs, for copyright reasons.
 *
 * These three songs, their titles, artist credits, and every lyric line
 * below were written from scratch for this feature (not sourced from
 * Kaggle or anywhere else) so the app has something real to render without
 * any copyright risk. Swap this file out for a real licensed dataset later
 * if you have one — the page/rendering code doesn't care where the data
 * comes from, just that it's `DemoSong[]` shaped like this.
 *
 * Lines use ChordPro-lite bracket notation (`utils/chordpro.ts`):
 * `[G]like this[C]`. An empty string line is a blank line (verse/section
 * break) in the rendered lyrics.
 */
export interface DemoSong {
  id: string
  title: string
  artist: string
  key: string
  lines: string[]
}

const HARBOR_LIGHTS: DemoSong = {
  id: 'harbor-lights',
  title: 'Harbor Lights',
  artist: 'Guitool Demo Songs',
  key: 'G',
  lines: [
    '[G]Down by the water the [C]boats come in',
    '[G]Salt on the [D]air and the [G]gulls begin',
    '[Em]Singing a [C]song that the [G]tide can [D]bring',
    '[G]Home is a [C]harbor [D]light in [G]spring',
    '',
    '[C]Hold on, [G]hold on',
    '[Em]Wherever you [D]roam',
    '[C]Hold on, [G]hold [D]on',
    "[G]The harbor lights will [C]lead you [G]home",
    '',
    '[G]Every gray morning the [C]fog rolls thin',
    '[G]Wakes up the [D]harbor and the [G]nets pull in',
    '[Em]Nothing but [C]open sky and [G]sea and [D]sand',
    '[G]Steady as an [C]anchor in my [D]hand',
    '',
    '[C]Hold on, [G]hold on',
    '[Em]Wherever you [D]roam',
    '[C]Hold on, [G]hold [D]on',
    "[G]The harbor lights will [C]lead you [G]home",
  ],
}

const QUIET_HIGHWAY: DemoSong = {
  id: 'quiet-highway',
  title: 'Quiet Highway',
  artist: 'Guitool Demo Songs',
  key: 'Am',
  lines: [
    '[Am]Miles of gray line running [F]out ahead',
    '[C]Radio hums a [G]song I half [Am]remember',
    '[Am]Every town a [F]light I never [C]said',
    "[G]Goodbye to, just a [Am]blur in the window",
    '',
    '[F]Quiet highway, [C]carry me [G]slow',
    "[F]Quiet highway, [C]I've got nowhere to [Am]go",
    '',
    '[Am]Stars come out like [F]sparks off the road',
    '[C]Engine ticking [G]soft as it [Am]cools down',
    '[Am]Somewhere is a [F]bed I can call [C]home',
    "[G]But tonight I'll [Am]sleep in this old town",
    '',
    '[F]Quiet highway, [C]carry me [G]slow',
    "[F]Quiet highway, [C]I've got nowhere to [Am]go",
  ],
}

const PAPER_BOATS: DemoSong = {
  id: 'paper-boats',
  title: 'Paper Boats',
  artist: 'Guitool Demo Songs',
  key: 'C',
  lines: [
    '[C]Fold a little [F]boat from a [C]page',
    '[C]Set it on the [G]puddle after [C]rain',
    '[Am]Watch it turn in [F]circles like it [C]knows',
    '[F]Every [G]way the [C]wind blows',
    '',
    '[C]Paper boats, [F]paper boats',
    '[Am]Sailing off to [G]nowhere and [C]back',
    '[C]Paper boats, [F]paper boats',
    "[G]Little ships that [C]never sink",
    '',
    '[C]Send one out for [F]every worry [C]too',
    '[C]Let the gutter [G]carry them from [C]view',
    '[Am]Nothing but a [F]page and a small [C]hand',
    '[F]Learning how the [G]world is [C]planned',
    '',
    '[C]Paper boats, [F]paper boats',
    '[Am]Sailing off to [G]nowhere and [C]back',
    '[C]Paper boats, [F]paper boats',
    "[G]Little ships that [C]never sink",
  ],
}

export const DEMO_SONGS: DemoSong[] = [HARBOR_LIGHTS, QUIET_HIGHWAY, PAPER_BOATS]

export function getDemoSong(id: string): DemoSong | undefined {
  return DEMO_SONGS.find((s) => s.id === id)
}

/** Every distinct chord name used across a song's lines, in first-appearance order. */
export function chordsUsedIn(song: DemoSong): string[] {
  const seen = new Set<string>()
  for (const line of song.lines) {
    for (const chord of chordsInLine(line)) seen.add(chord)
  }
  return [...seen]
}
