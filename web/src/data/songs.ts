import type { Song } from '../types/song'

/**
 * Guitool's built-in song catalog.
 *
 * Metadata only — title, artist, genre, tuning, and (where genuinely
 * well-established and not just "however the last recording you heard
 * played it") capo/key. `practiceNotes` describes what's technically
 * interesting about each song in our own words; it never quotes or
 * transcribes any tab, chord chart, or lyric. For the actual tab/chords,
 * `services/webLookup.ts` builds links out to Songsterr / Ultimate Guitar /
 * YouTube — see `buildSongLookupLinks`.
 *
 * A song here is a real, well-known piece of guitar repertoire chosen to
 * cover a spread of genres and difficulty levels, not an endorsement of any
 * particular arrangement or transcription of it.
 */
export const SONGS: Song[] = [
  {
    id: 'song-knockin-heavens-door',
    title: "Knockin' on Heaven's Door",
    artist: 'Bob Dylan',
    genre: 'Folk',
    difficulty: 1,
    tuning: 'Standard (EADGBE)',
    keySignature: 'G major',
    practiceNotes:
      'A four-chord loop in open position — as gentle an introduction to changing chords in time as there is. Focus on landing each new shape cleanly on the beat rather than rushing the strum.',
    tags: ['open chords', 'first song', 'strumming'],
  },
  {
    id: 'song-three-little-birds',
    title: 'Three Little Birds',
    artist: 'Bob Marley',
    genre: 'Reggae',
    difficulty: 1,
    tuning: 'Standard (EADGBE)',
    practiceNotes:
      'Three open chords over a reggae skank — the strumming pattern (light upstrokes, muted downbeats) matters more than the chords here. Great for building a feel for off-beat rhythm.',
    tags: ['open chords', 'reggae strumming', 'rhythm'],
  },
  {
    id: 'song-horse-with-no-name',
    title: 'A Horse with No Name',
    artist: 'America',
    genre: 'Folk',
    difficulty: 1,
    tuning: 'Standard (EADGBE)',
    keySignature: 'E minor',
    practiceNotes:
      'Basically two chord shapes for the entire song. With the chord vocabulary out of the way, use it to drill clean, quiet string changes and a steady strumming hand.',
    tags: ['open chords', 'two-chord song', 'beginner friendly'],
  },
  {
    id: 'song-wonderwall',
    title: 'Wonderwall',
    artist: 'Oasis',
    genre: 'Rock',
    difficulty: 2,
    tuning: 'Standard (EADGBE)',
    capo: 2,
    practiceNotes:
      'A repeating capo\'d chord sequence that shows up constantly in beginner songbooks for a reason — it builds strumming-pattern stamina and mid-song chord-shape recall at the same time.',
    tags: ['capo', 'strumming pattern', '90s'],
  },
  {
    id: 'song-sweet-home-alabama',
    title: 'Sweet Home Alabama',
    artist: 'Lynyrd Skynyrd',
    genre: 'Rock',
    difficulty: 2,
    tuning: 'Standard (EADGBE)',
    practiceNotes:
      'A riff-driven rock rhythm alternating between a couple of open-chord shapes. Good practice for locking a rhythm part to an imaginary (or real) drummer rather than drifting tempo.',
    tags: ['open chords', 'rhythm guitar', 'classic rock'],
  },
  {
    id: 'song-redemption-song',
    title: 'Redemption Song',
    artist: 'Bob Marley',
    genre: 'Folk',
    difficulty: 2,
    tuning: 'Standard (EADGBE)',
    practiceNotes:
      'A folk-leaning progression that can be strummed or picked. A natural next step once basic chord changes feel comfortable and you want to start blending in some fingerpicking.',
    tags: ['open chords', 'fingerpicking intro'],
  },
  {
    id: 'song-ring-of-fire',
    title: 'Ring of Fire',
    artist: 'Johnny Cash',
    genre: 'Country',
    difficulty: 2,
    tuning: 'Standard (EADGBE)',
    practiceNotes:
      'A steady country "boom-chick" strum — alternating bass note, then a chord brush — over a simple progression. Great for practicing bass-note targeting with the thumb or pick before the strum.',
    tags: ['boom-chick strum', 'country rhythm'],
  },
  {
    id: 'song-dust-in-the-wind',
    title: 'Dust in the Wind',
    artist: 'Kansas',
    genre: 'Folk',
    difficulty: 3,
    tuning: 'Standard (EADGBE)',
    practiceNotes:
      'A Travis-picking-style fingerpicked pattern with a steady alternating thumb. A good benchmark for keeping the thumb metronomic while the fingers pick out a melody on top.',
    tags: ['fingerpicking', 'travis picking', 'folk'],
  },
  {
    id: 'song-wish-you-were-here',
    title: 'Wish You Were Here',
    artist: 'Pink Floyd',
    genre: 'Rock',
    difficulty: 3,
    tuning: 'Standard (EADGBE)',
    practiceNotes:
      'A recognizable picked/strummed intro figure that opens into full chord strumming. Good practice for switching cleanly between a picking-hand texture and a full strum within the same song.',
    tags: ['hybrid picking', 'intro riff', 'classic rock'],
  },
  {
    id: 'song-hotel-california',
    title: 'Hotel California (intro & verse)',
    artist: 'Eagles',
    genre: 'Rock',
    difficulty: 3,
    tuning: 'Standard (EADGBE)',
    keySignature: 'B minor',
    practiceNotes:
      'A minor-key arpeggiated progression with more chord shapes to remember than most beginner songs. Good for arpeggio consistency — picking each string clearly instead of blurring into a strum.',
    tags: ['arpeggios', 'minor key', 'fingerstyle'],
  },
  {
    id: 'song-nothing-else-matters',
    title: 'Nothing Else Matters (intro)',
    artist: 'Metallica',
    genre: 'Rock',
    difficulty: 3,
    tuning: 'Standard (EADGBE)',
    practiceNotes:
      'A fingerpicked pattern built around ringing open strings under a moving shape — a "drone string" technique. Slow it down with a metronome before bringing it up to tempo.',
    tags: ['fingerpicking', 'drone strings', 'metal ballad'],
  },
  {
    id: 'song-under-the-bridge',
    title: 'Under the Bridge (intro)',
    artist: 'Red Hot Chili Peppers',
    genre: 'Rock',
    difficulty: 3,
    tuning: 'Standard (EADGBE)',
    practiceNotes:
      'High-neck arpeggiated chord voicings, picked one string at a time. Good for clean single-note articulation inside a chord shape rather than strumming through it.',
    tags: ['arpeggios', 'high-neck voicings'],
  },
  {
    id: 'song-thrill-is-gone',
    title: 'The Thrill Is Gone',
    artist: 'B.B. King',
    genre: 'Blues',
    difficulty: 3,
    tuning: 'Standard (EADGBE)',
    keySignature: 'B minor',
    practiceNotes:
      'A slow minor-key blues built for expressive lead playing — bends, vibrato, and phrasing matter far more here than speed. Good for developing pitch-accurate string bending.',
    tags: ['blues', 'string bending', 'vibrato', 'lead guitar'],
  },
  {
    id: 'song-crazy-train',
    title: 'Crazy Train (main riff)',
    artist: 'Ozzy Osbourne',
    genre: 'Metal',
    difficulty: 4,
    tuning: 'Standard (EADGBE)',
    practiceNotes:
      'A palm-muted, syncopated rock/metal riff. Practice the palm-muting hand separately at a slow tempo first — a loose mute is the most common thing that makes this riff sound sloppy.',
    tags: ['palm muting', 'metal riff', 'rhythm guitar'],
  },
  {
    id: 'song-blackbird',
    title: 'Blackbird',
    artist: 'The Beatles',
    genre: 'Classical / Fingerstyle',
    difficulty: 4,
    tuning: 'Standard (EADGBE)',
    practiceNotes:
      'A fingerstyle benchmark: a moving bass line under a melody, both played by the same picking hand. Isolate the bass line alone, then the melody alone, before combining them.',
    tags: ['fingerstyle', 'independent bass line', 'classic'],
  },
  {
    id: 'song-canon-in-d',
    title: 'Canon in D (fingerstyle arrangement)',
    artist: 'Johann Pachelbel (trad., arr. for solo guitar)',
    genre: 'Classical / Fingerstyle',
    difficulty: 4,
    tuning: 'Standard (EADGBE)',
    practiceNotes:
      'A classical piece adapted for solo fingerstyle guitar — a repeating bass progression under a sustained picking pattern. Good for endurance: keeping the pattern even over several minutes.',
    tags: ['fingerstyle', 'classical', 'arpeggios'],
  },
  {
    id: 'song-cliffs-of-dover',
    title: 'Cliffs of Dover',
    artist: 'Eric Johnson',
    genre: 'Blues',
    difficulty: 5,
    tuning: 'Standard (EADGBE)',
    practiceNotes:
      'Fast pentatonic lead lines with legato phrasing (hammer-ons/pull-offs strung together at speed). A serious benchmark for lead-guitar speed and clean articulation — start well under tempo.',
    tags: ['lead guitar', 'legato', 'pentatonic', 'speed'],
  },
  {
    id: 'song-master-of-puppets',
    title: 'Master of Puppets (main riff)',
    artist: 'Metallica',
    genre: 'Metal',
    difficulty: 5,
    tuning: 'Standard (EADGBE)',
    practiceNotes:
      'Fast, palm-muted alternate picking on the low strings. A demanding endurance and precision benchmark for the picking hand — build it up gradually with a metronome rather than forcing full speed early.',
    tags: ['alternate picking', 'palm muting', 'metal', 'speed'],
  },
  {
    id: 'song-eruption',
    title: 'Eruption',
    artist: 'Van Halen',
    genre: 'Metal',
    difficulty: 5,
    tuning: 'Standard (EADGBE)',
    practiceNotes:
      'The piece that popularized two-hand tapping in rock guitar. A benchmark for tapping accuracy and legato control — isolate short tapped phrases before trying to link them together.',
    tags: ['tapping', 'legato', 'lead guitar', 'benchmark piece'],
  },
  {
    id: 'song-classical-gas',
    title: 'Classical Gas',
    artist: 'Mason Williams',
    genre: 'Classical / Fingerstyle',
    difficulty: 5,
    tuning: 'Standard (EADGBE)',
    practiceNotes:
      'A fast fingerstyle instrumental that mixes strummed and picked passages. One of the more demanding fingerstyle benchmark pieces — worth breaking into short sections and looping each slowly.',
    tags: ['fingerstyle', 'instrumental', 'speed', 'benchmark piece'],
  },
]
