import type { Exercise } from '../types/exercise'

/**
 * The exercise library.
 *
 * Content is original — written from general, well-established guitar
 * pedagogy (alternate/economy/sweep picking, the CAGED system, pentatonic
 * and blues scales, metronome subdivision practice, call-and-response
 * improvisation, etc.), not copied from any single source. Categories and
 * the underlying ideas are commonly taught across guitar method books and
 * lesson sites; the specific wording, structure and exercise steps here are
 * this app's own.
 *
 * To add a new exercise: append an object matching the `Exercise` type.
 * Nothing else needs to change — the session generator and every page read
 * from this array.
 */
export const EXERCISES: Exercise[] = [
  // ---------------------------------------------------------------- Technique
  {
    id: 'technique-alternate-picking',
    name: 'Alternate Picking Fundamentals',
    category: 'technique',
    description:
      'Strict down-up picking on a single note or simple pattern, building the right-hand engine that almost every other technique depends on.',
    difficulty: 3,
    importance: 5,
    usefulness: 5,
    recommendedDuration: 15,
    minDuration: 10,
    maxDuration: 25,
    skillTags: ['picking', 'right-hand', 'speed', 'accuracy'],
    instructions: [
      'Mute the strings lightly with your fret hand and pick a single open string in strict down-up-down-up motion.',
      'Set a metronome to a comfortable tempo and play steady 8th notes for two minutes without breaking the pattern.',
      'Move to a 1-2-3-4 chromatic finger pattern on one string, keeping the same strict alternation.',
      'Increase the metronome by 4-6 BPM once you can play two full minutes cleanly.',
    ],
    tips: [
      'Keep pick strokes small — most speed is lost to over-large motions.',
      'Relax your fretting-hand grip; tension there slows the picking hand too.',
    ],
    commonMistakes: [
      'Speeding up only the easy parts and rushing string changes.',
      'Gripping the pick too tightly, which stiffens the whole arm.',
    ],
    recommendedBpm: { min: 70, max: 140 },
  },
  {
    id: 'technique-economy-picking',
    name: 'Economy Picking Transitions',
    category: 'technique',
    description:
      'Blends alternate picking with picking in the same direction as the next string, so the pick "falls" naturally when crossing strings.',
    difficulty: 4,
    importance: 3,
    usefulness: 3,
    recommendedDuration: 15,
    minDuration: 10,
    maxDuration: 20,
    skillTags: ['picking', 'economy', 'string-crossing'],
    instructions: [
      'Play a 3-note-per-string scale fragment and pick the first note of a new string in the same direction you just used.',
      'Practice a single string-crossing (e.g. 3rd string to 2nd string) in isolation before stringing a full scale together.',
      'Alternate between strict alternate picking and economy picking on the same lick to feel the difference in motion.',
    ],
    tips: [
      'Let the pick glide toward the next string instead of lifting straight off.',
      'Start slow — this technique lives or dies on small motion control.',
    ],
    commonMistakes: [
      'Reverting to alternate picking under pressure and losing the economy motion.',
      "Digging in too hard on the string change, causing an accent that shouldn't be there.",
    ],
    recommendedBpm: { min: 60, max: 120 },
  },
  {
    id: 'technique-string-skipping',
    name: 'String Skipping Accuracy',
    category: 'technique',
    description:
      'Jumping over one or more strings while keeping picking and muting clean — useful for wide-interval licks and arpeggios.',
    difficulty: 4,
    importance: 3,
    usefulness: 3,
    recommendedDuration: 12,
    minDuration: 8,
    maxDuration: 18,
    skillTags: ['picking', 'accuracy', 'string-crossing'],
    instructions: [
      'Pick a two-note pattern that skips one string (e.g. 6th string then 4th string) and repeat it slowly.',
      'Mute the skipped string with a spare fret-hand finger or the side of the picking hand to avoid ringing.',
      'Gradually widen the skip (skip two strings) once the first pattern is clean at tempo.',
    ],
    tips: [
      'Anchor your attention on the target string before you pick it.',
      'Small, controlled pick strokes beat big sweeping motions here.',
    ],
    commonMistakes: [
      'Letting the skipped string ring unmuted.',
      'Picking too far from the strings, losing accuracy on the jump.',
    ],
    recommendedBpm: { min: 70, max: 130 },
  },
  {
    id: 'technique-legato',
    name: 'Legato: Hammer-ons & Pull-offs',
    category: 'technique',
    description:
      'Sounding notes with the fretting hand alone to build smooth, flowing lines and strengthen individual finger independence.',
    difficulty: 3,
    importance: 4,
    usefulness: 4,
    recommendedDuration: 15,
    minDuration: 10,
    maxDuration: 25,
    skillTags: ['legato', 'left-hand', 'fluidity'],
    instructions: [
      'On one string, hammer from an open or fretted note up to the next finger without picking the second note.',
      'Reverse the motion with pull-offs, plucking the string slightly as you release each finger.',
      'Chain a 4-note hammer-on/pull-off pattern per string and move it across all six strings.',
    ],
    tips: [
      'Hammer from the knuckle, not just the fingertip, for real volume.',
      'Keep unused fingers hovering close to the strings, ready to fret.',
    ],
    commonMistakes: [
      'Hammering too softly so notes fade out inaudibly.',
      'Pulling off flat instead of slightly sideways, which produces a weak pluck.',
    ],
    recommendedBpm: { min: 70, max: 140 },
  },
  {
    id: 'technique-bending-vibrato',
    name: 'Bending & Vibrato Control',
    category: 'technique',
    description:
      'Pitch-accurate bends and a controlled, singing vibrato — the details that make lead lines sound expressive instead of just "correct."',
    difficulty: 3,
    importance: 4,
    usefulness: 5,
    recommendedDuration: 15,
    minDuration: 10,
    maxDuration: 20,
    skillTags: ['bending', 'vibrato', 'expression', 'lead'],
    instructions: [
      'Fret a note and bend it up while comparing it to the target pitch played on an adjacent string, to check your bend is in tune.',
      'Practice whole-step and half-step bends until you can hit the target pitch without checking it first.',
      'Add vibrato on a held note using a consistent wrist or forearm rotation, keeping the pitch wobble even.',
    ],
    tips: [
      'Use multiple fingers behind the bending finger for support on heavier strings.',
      "Vibrato speed and width are a personal 'voice' — experiment rather than copying one style exactly.",
    ],
    commonMistakes: [
      'Bending sharp or flat of the target pitch.',
      'Vibrato that speeds up or slows down unevenly instead of staying steady.',
    ],
    recommendedBpm: { min: 60, max: 100 },
  },
  {
    id: 'technique-sweep-picking',
    name: 'Sweep Picking Basics',
    category: 'technique',
    description:
      'A single, continuous picking motion across several strings to outline arpeggios quickly — a high-payoff but technically demanding skill.',
    difficulty: 5,
    importance: 2,
    usefulness: 2,
    recommendedDuration: 15,
    minDuration: 10,
    maxDuration: 20,
    skillTags: ['sweep-picking', 'arpeggios', 'advanced'],
    instructions: [
      'Start with a 3-string minor or major triad shape and pick it with one continuous down or up sweep.',
      "Focus on the fretting hand rolling off each note cleanly so notes don't blur together.",
      'Once the 3-string shape is clean at a slow tempo, extend to a 5-string arpeggio shape.',
    ],
    tips: [
      "Mute aggressively with both hands — sweep picking is unforgiving of stray noise.",
      'Practice silently (fretting only, no pick) first to nail the left-hand rolling motion.',
    ],
    commonMistakes: [
      'Strumming through the shape like a chord instead of a controlled sweep.',
      'Trying full tempo before the muting and rolling motion is under control.',
    ],
    recommendedBpm: { min: 50, max: 110 },
  },

  // -------------------------------------------------------------------- Scales
  {
    id: 'scales-minor-pentatonic',
    name: 'Minor Pentatonic Patterns',
    category: 'scales',
    description:
      'The five-note scale behind most rock, blues and pop lead playing, practiced across its five box positions so you can find it anywhere on the neck.',
    difficulty: 2,
    importance: 5,
    usefulness: 5,
    recommendedDuration: 20,
    minDuration: 10,
    maxDuration: 30,
    skillTags: ['scales', 'pentatonic', 'lead', 'improvisation'],
    instructions: [
      'Play box 1 of the minor pentatonic scale ascending and descending with a metronome at a comfortable tempo.',
      'Practice connecting box 1 into box 2 by sliding or shifting on the top string.',
      'Pick a familiar key and run through as many of the five positions as you can from memory.',
    ],
    tips: [
      'Say or think the scale degree (1, b3, 4, 5, b7) as you play to build fretboard/ear connection.',
      "Practice in more than one key so the shape doesn't get tied to one set of frets.",
    ],
    commonMistakes: [
      'Only ever practicing box 1 and never learning the other positions.',
      'Playing the pattern with no rhythmic intention, just running up and down.',
    ],
    recommendedBpm: { min: 70, max: 140 },
    conceptIds: ['scale-minor-pentatonic'],
  },
  {
    id: 'scales-major-pentatonic',
    name: 'Major Pentatonic Patterns',
    category: 'scales',
    description:
      'The brighter cousin of the minor pentatonic, essential for country, pop and major-key rock soloing.',
    difficulty: 2,
    importance: 4,
    usefulness: 4,
    recommendedDuration: 15,
    minDuration: 10,
    maxDuration: 25,
    skillTags: ['scales', 'pentatonic', 'lead'],
    instructions: [
      'Play the major pentatonic box shape that shares its root with a minor pentatonic shape you already know (its relative major).',
      'Compare the two scales back to back over a drone or backing track to hear the difference in mood.',
      'Practice simple 3-note licks that outline the major 3rd, a defining color tone of the scale.',
    ],
    tips: [
      'The major pentatonic is the minor pentatonic shape three frets lower with the same fingering — a fast way to learn it.',
    ],
    commonMistakes: [
      'Defaulting back to minor pentatonic licks out of habit even over major-key progressions.',
    ],
    recommendedBpm: { min: 70, max: 130 },
    diagram: {
      mode: 'scale',
      startFret: 7,
      fretCount: 4,
      notes: [
        { string: 1, fret: 8, finger: 2, root: true },
        { string: 1, fret: 10, finger: 4 },
        { string: 2, fret: 7, finger: 1 },
        { string: 2, fret: 10, finger: 4 },
        { string: 3, fret: 7, finger: 1 },
        { string: 3, fret: 10, finger: 4, root: true },
        { string: 4, fret: 7, finger: 1 },
        { string: 4, fret: 9, finger: 3 },
        { string: 5, fret: 8, finger: 2 },
        { string: 5, fret: 10, finger: 4 },
        { string: 6, fret: 8, finger: 2, root: true },
        { string: 6, fret: 10, finger: 4 },
      ],
      caption:
        'C major pentatonic box (frets 7–10). Movable — the gold dots mark where the root falls in this shape; shift the whole box to change key.',
    },
  },
  {
    id: 'scales-major-minor',
    name: 'Natural Minor & Major Scale',
    category: 'scales',
    description:
      'The seven-note major and natural minor scales that underpin most Western music theory and unlock modal playing later on.',
    difficulty: 3,
    importance: 4,
    usefulness: 4,
    recommendedDuration: 20,
    minDuration: 10,
    maxDuration: 30,
    skillTags: ['scales', 'diatonic', 'theory'],
    instructions: [
      'Play one position of the major scale ascending and descending slowly, naming each scale degree.',
      'Play the relative natural minor scale starting from its own root, noticing it uses the same notes as the major scale.',
      'Practice in 3rds (skip a note each time) through the scale to build a more musical ear for it than straight runs.',
    ],
    tips: ['Anchor the scale to a chord progression in that key rather than practicing it in isolation.'],
    commonMistakes: [
      'Memorizing finger patterns without ever connecting them to a key signature or chord progression.',
    ],
    recommendedBpm: { min: 60, max: 120 },
  },
  {
    id: 'scales-blues',
    name: 'Blues Scale Phrasing',
    category: 'scales',
    description:
      'The minor pentatonic plus a "blue note," adding tension and character — central to blues, rock and soulful lead lines.',
    difficulty: 3,
    importance: 4,
    usefulness: 4,
    recommendedDuration: 15,
    minDuration: 10,
    maxDuration: 20,
    skillTags: ['scales', 'blues', 'lead', 'phrasing'],
    instructions: [
      'Play the minor pentatonic box shape you know, then add the flat-5 blue note between the 4th and 5th scale degrees.',
      'Practice resolving the blue note quickly to the 4th or 5th rather than lingering on it.',
      'Build a short 4-bar phrase using the scale over a slow blues backing track or drone.',
    ],
    tips: ['The blue note works best as a passing tone, not a landing note.', 'Space and phrasing matter more here than speed.'],
    commonMistakes: ['Overusing the blue note until it sounds like a mistake instead of a color tone.'],
    recommendedBpm: { min: 60, max: 100 },
    diagram: {
      mode: 'scale',
      startFret: 5,
      fretCount: 4,
      notes: [
        { string: 1, fret: 5, finger: 1, root: true },
        { string: 1, fret: 8, finger: 4 },
        { string: 2, fret: 5, finger: 1 },
        { string: 2, fret: 6, finger: 2 },
        { string: 2, fret: 7, finger: 3 },
        { string: 3, fret: 5, finger: 1 },
        { string: 3, fret: 7, finger: 3 },
        { string: 4, fret: 5, finger: 1 },
        { string: 4, fret: 7, finger: 3 },
        { string: 4, fret: 8, finger: 4 },
        { string: 5, fret: 5, finger: 1 },
        { string: 5, fret: 8, finger: 4 },
        { string: 6, fret: 5, finger: 1, root: true },
        { string: 6, fret: 8, finger: 4 },
      ],
      caption:
        'A minor pentatonic box 1, plus the ♭5 "blue note" — A string fret 6 and G string fret 8. Pass through it quickly toward the 4th or 5th rather than landing on it.',
    },
  },

  // -------------------------------------------------------------------- Rhythm
  {
    id: 'rhythm-subdivisions',
    name: 'Metronome Subdivision Training',
    category: 'rhythm',
    description:
      'Practicing quarter, eighth, triplet and sixteenth-note subdivisions against a click to build an internal sense of time.',
    difficulty: 2,
    importance: 5,
    usefulness: 5,
    recommendedDuration: 15,
    minDuration: 10,
    maxDuration: 20,
    skillTags: ['timing', 'metronome', 'subdivision'],
    instructions: [
      'Set the metronome to a slow tempo and strum or pick a single chord in steady quarter notes, locked to the click.',
      'Switch to eighth notes, then eighth-note triplets, then sixteenth notes, keeping the chord and tempo the same.',
      'Try setting the click to only beats 2 and 4 once comfortable, forcing you to feel beats 1 and 3 internally.',
    ],
    tips: ['Tap your foot on the beat while subdividing with your hands to reinforce the pulse physically.'],
    commonMistakes: ['Rushing subdivisions faster than the beat, especially on the first note after a rest.'],
    recommendedBpm: { min: 60, max: 120 },
  },
  {
    id: 'rhythm-strumming-patterns',
    name: 'Strumming Pattern Practice',
    category: 'rhythm',
    description:
      'Building a vocabulary of down/up strumming patterns, including "ghost strums" over muted strings, for confident rhythm playing.',
    difficulty: 2,
    importance: 4,
    usefulness: 5,
    recommendedDuration: 15,
    minDuration: 10,
    maxDuration: 20,
    skillTags: ['rhythm', 'strumming', 'chords'],
    instructions: [
      "Practice a constant down-up 8th-note strumming hand motion, even when some strums don't hit the strings (ghost strums).",
      'Layer a simple down-down-up-up-down-up pattern over a single chord, keeping the strumming hand moving throughout.',
      'Apply the pattern to a two-chord progression, focusing on clean chord changes on the beat.',
    ],
    tips: ['Keep the strumming arm moving in constant 8th notes even during rests — it’s the secret to steady rhythm.'],
    commonMistakes: ['Stopping the strumming arm during rests, which breaks the internal pulse.'],
    recommendedBpm: { min: 70, max: 130 },
  },
  {
    id: 'rhythm-palm-muting',
    name: 'Palm Muting Control',
    category: 'rhythm',
    description:
      'Using the edge of the picking hand to control sustain and create the tight, percussive "chugging" sound common in rock and metal rhythm playing.',
    difficulty: 2,
    importance: 3,
    usefulness: 4,
    recommendedDuration: 12,
    minDuration: 8,
    maxDuration: 18,
    skillTags: ['palm-muting', 'rhythm', 'tone-control'],
    instructions: [
      'Rest the edge of your picking-hand palm lightly on the strings near the bridge and pick a single low string.',
      'Adjust palm pressure and position to find the point between "too open" and "too dead" for a tight chug.',
      'Alternate between muted and open (unmuted) notes in a simple riff to practice switching quickly.',
    ],
    tips: ['A little palm movement toward or away from the bridge changes the tone significantly — experiment.'],
    commonMistakes: ['Muting so hard the note loses all pitch, or so lightly it barely mutes at all.'],
    recommendedBpm: { min: 80, max: 160 },
  },
  {
    id: 'rhythm-syncopation',
    name: 'Syncopation & Off-beat Accents',
    category: 'rhythm',
    description:
      'Deliberately accenting off-beats (the "and" of a beat) to add groove and push/pull feel to rhythm parts.',
    difficulty: 3,
    importance: 3,
    usefulness: 3,
    recommendedDuration: 12,
    minDuration: 8,
    maxDuration: 18,
    skillTags: ['syncopation', 'rhythm', 'feel'],
    instructions: [
      "Clap or tap a simple syncopated rhythm (e.g. accent the 'and' of beat 2) away from the guitar first.",
      'Transfer the same rhythm to a single muted chord stab on the guitar, locked to a metronome.',
      'Apply the syncopated accent within a full strumming or riff pattern.',
    ],
    tips: ['Isolating the rhythm away from the instrument first makes it much easier to feel accurately.'],
    commonMistakes: ['Accenting the wrong subdivision because the underlying pulse was not solid first.'],
    recommendedBpm: { min: 70, max: 120 },
  },

  // -------------------------------------------------------------------- Chords
  {
    id: 'chords-open-chord-changes',
    name: 'Open Chord Changes',
    category: 'chords',
    description:
      'Fast, clean transitions between common open chords (G, C, D, Em, Am) — the foundation of rhythm guitar for most styles.',
    difficulty: 1,
    importance: 5,
    usefulness: 5,
    recommendedDuration: 15,
    minDuration: 10,
    maxDuration: 20,
    skillTags: ['chords', 'open-chords', 'transitions', 'beginner'],
    instructions: [
      'Pick two chords you find awkward together (e.g. C to G) and change between them slowly, checking every string rings clean.',
      'Add a metronome and change chords on every 4th beat, then every 2nd beat as it gets comfortable.',
      'String three or four chords into a short progression and loop it for two minutes without stopping.',
    ],
    tips: ["Move fingers that stay on the same string/fret as little as possible between chords ('common tone' economy)."],
    commonMistakes: ['Looking away from the fretboard too soon, before the muscle memory is really there.'],
    recommendedBpm: { min: 60, max: 110 },
    conceptIds: [
      'chord-open-g-major',
      'chord-open-c-major',
      'chord-open-d-major',
      'chord-open-e-minor',
      'chord-open-a-minor',
    ],
  },
  {
    id: 'chords-barre-strength',
    name: 'Barre Chord Strength Builder',
    category: 'chords',
    description:
      'Building the hand strength and finger positioning needed for clean, buzz-free barre chords across the neck.',
    difficulty: 3,
    importance: 4,
    usefulness: 5,
    recommendedDuration: 15,
    minDuration: 10,
    maxDuration: 20,
    skillTags: ['chords', 'barre-chords', 'strength'],
    instructions: [
      'Form an E-shape barre chord at the 3rd fret and check each string rings clearly one at a time.',
      'Release and reform the barre chord ten times in a row, resting briefly between sets to avoid strain.',
      'Move the same shape up and down the neck, changing root note without looking at a chord chart.',
    ],
    tips: ['Roll your index finger slightly onto its side rather than pressing flat — it takes less effort.'],
    commonMistakes: ['Squeezing with the thumb wrapped over the top of the neck, which adds tension instead of leverage.'],
    recommendedBpm: { min: 50, max: 100 },
  },
  {
    id: 'chords-power-chords',
    name: 'Power Chord Chugging',
    category: 'chords',
    description:
      'Two and three-note power chords moved quickly around the low strings, the backbone of rock and metal rhythm parts.',
    difficulty: 2,
    importance: 4,
    usefulness: 5,
    recommendedDuration: 12,
    minDuration: 8,
    maxDuration: 18,
    skillTags: ['power-chords', 'rock', 'metal', 'rhythm'],
    instructions: [
      'Play a single power chord shape on the low E and A strings, palm-muted, in steady quarter notes.',
      'Move the same shape to a new root every two beats, keeping the muting and picking hand consistent.',
      'Combine two power chords into a simple riff and loop it against a metronome.',
    ],
    tips: ["Keep the power-chord shape's finger spacing fixed so you can slide it anywhere without rethinking it."],
    commonMistakes: ['Letting the open strings above the shape ring and clash with the chord.'],
    recommendedBpm: { min: 80, max: 160 },
    diagram: {
      mode: 'chord',
      startFret: 5,
      fretCount: 3,
      notes: [
        { string: 1, fret: 5, finger: 1, root: true },
        { string: 2, fret: 7, finger: 3 },
      ],
      mutedStrings: [3, 4, 5, 6],
      caption:
        'A5 power chord (root on the low E string, fret 5) — a movable 2-note shape. Slide it to any fret to change the root; keep the higher strings muted or out of the strum.',
    },
  },
  {
    id: 'chords-transition-speed',
    name: 'Chord-to-Chord Transition Speed',
    category: 'chords',
    description:
      'Timed drills that push chord-change speed up gradually, closing the gap between "knowing" a chord and playing it in real time.',
    difficulty: 3,
    importance: 3,
    usefulness: 4,
    recommendedDuration: 12,
    minDuration: 8,
    maxDuration: 18,
    skillTags: ['chords', 'transitions', 'speed'],
    instructions: [
      "Pick your two slowest chord changes and set a metronome to a tempo where they're just barely comfortable.",
      'Loop the change for one minute, then raise the tempo by a small increment.',
      "Repeat with a three or four chord progression pulled from a song you're learning.",
    ],
    tips: ['Small, frequent tempo increases beat one big jump — the hand needs repetition to relearn the shape at speed.'],
    commonMistakes: ['Jumping to a much faster tempo too soon and reinforcing sloppy changes.'],
    recommendedBpm: { min: 70, max: 140 },
  },

  // ---------------------------------------------------------------- Fretboard
  {
    id: 'fretboard-note-memorization',
    name: 'Fretboard Note Memorization',
    category: 'fretboard',
    description: 'Drilling note names across the neck so you can find any note instantly, rather than relying purely on shapes.',
    difficulty: 2,
    importance: 4,
    usefulness: 5,
    recommendedDuration: 15,
    minDuration: 10,
    maxDuration: 20,
    skillTags: ['fretboard', 'theory', 'note-names'],
    instructions: [
      'Pick one string and name every natural note (no sharps/flats) from open to the 12th fret out loud.',
      'Have someone call out notes (or use a random note generator) and find each one on that string as fast as you can.',
      'Repeat on a second string, then practice finding the same note name on two different strings.',
    ],
    tips: [
      "Learn the string's 'landmark' notes (open, 5th, 7th, 12th fret) first, then fill in the gaps around them.",
    ],
    commonMistakes: ['Only ever thinking in shapes, so note names stay a mystery even after years of playing.'],
  },
  {
    id: 'fretboard-caged',
    name: 'CAGED System Mapping',
    category: 'fretboard',
    description:
      'Seeing how the five open chord shapes (C, A, G, E, D) tile up the neck, connecting chord shapes, scale patterns and arpeggios into one map.',
    difficulty: 3,
    importance: 3,
    usefulness: 4,
    recommendedDuration: 20,
    minDuration: 10,
    maxDuration: 25,
    skillTags: ['fretboard', 'caged', 'chord-shapes', 'theory'],
    instructions: [
      'Play an open C chord, then find the same chord tones using the A-shape barre chord a few frets up.',
      'Continue through the G, E and D shapes for the same root note, moving up the neck each time.',
      'Overlay the minor pentatonic box that sits closest to each CAGED shape to link chords and scales visually.',
    ],
    tips: ['Focus on one shape pair (e.g. C to A) until it clicks before trying to chain all five.'],
    commonMistakes: ['Trying to learn all five shapes for every chord in one sitting instead of one connection at a time.'],
    conceptIds: ['chord-caged-major-g'],
  },
  {
    id: 'fretboard-intervals',
    name: 'Interval Recognition on the Neck',
    category: 'fretboard',
    description:
      'Recognizing common interval shapes (3rds, 5ths, octaves) by sight and sound — useful for improvising, harmonizing and sight-reading the neck.',
    difficulty: 3,
    importance: 3,
    usefulness: 4,
    recommendedDuration: 15,
    minDuration: 10,
    maxDuration: 20,
    skillTags: ['fretboard', 'intervals', 'ear-training'],
    instructions: [
      'Play a root note, then find its octave two different ways on the neck (same string vs. a two-string shape).',
      'Practice the fixed shape for a perfect 5th from any root, moving it to five different starting notes.',
      'Sing or hum an interval before playing it to connect the sound to the shape.',
    ],
    tips: ['Octave and 5th shapes are movable — once memorized in one spot they work everywhere on the neck.'],
    commonMistakes: ['Learning the shape without ever checking that it actually sounds like the interval it is named after.'],
  },

  // ------------------------------------------------------------ Improvisation
  {
    id: 'improv-call-response',
    name: 'Call and Response Phrasing',
    category: 'improvisation',
    description:
      'Playing a short musical "question," leaving space, then answering it — the basic building block of musical, conversational soloing.',
    difficulty: 3,
    importance: 4,
    usefulness: 4,
    recommendedDuration: 15,
    minDuration: 10,
    maxDuration: 20,
    skillTags: ['improvisation', 'phrasing', 'listening'],
    instructions: [
      'Play a short 2-4 note phrase, then stop completely for an equal amount of silence.',
      'Play a second phrase that answers or varies the first one, keeping the same rhythmic feel.',
      'Record a short loop of yourself doing this and listen back for spots where the "conversation" felt natural.',
    ],
    tips: ['Silence is part of the phrase — resist the urge to fill every gap with notes.'],
    commonMistakes: [
      "Playing a constant stream of notes with no space, which removes the 'question and answer' effect.",
    ],
  },
  {
    id: 'improv-target-notes',
    name: 'Target Note Landing',
    category: 'improvisation',
    description:
      'Practicing landing on a chord tone exactly when a chord change happens, so improvised lines sound intentional rather than random.',
    difficulty: 3,
    importance: 4,
    usefulness: 4,
    recommendedDuration: 15,
    minDuration: 10,
    maxDuration: 20,
    skillTags: ['improvisation', 'chord-tones', 'ear'],
    instructions: [
      'Loop a simple two-chord progression and identify the root note of each chord on your fretboard.',
      'Improvise freely, but make sure you land on the root of each chord right as it changes.',
      'Repeat, targeting the 3rd of each chord instead of the root, to add more melodic color.',
    ],
    tips: ["It's fine to play any notes you like between target notes — the target is what needs to be precise."],
    commonMistakes: ['Losing track of the chord changes and landing on notes that clash with the new chord.'],
  },
  {
    id: 'improv-backing-track',
    name: 'Improvising Over a Backing Track',
    category: 'improvisation',
    description:
      'Applying scales, phrasing and target notes in a real musical context by soloing freely over a backing track or looped chord progression.',
    difficulty: 3,
    importance: 4,
    usefulness: 5,
    recommendedDuration: 20,
    minDuration: 10,
    maxDuration: 30,
    skillTags: ['improvisation', 'backing-track', 'application'],
    instructions: [
      'Choose a backing track or loop in a key you know a scale for, and identify the scale/box position to use.',
      'Play through the track focusing on one idea only (e.g. rhythm, or space, or a single scale position).',
      'Record the take and listen back critically for phrasing, timing and note choices you would change.',
    ],
    tips: [
      'Limiting yourself to one string or one small area of the neck often produces more musical ideas than roaming freely.',
    ],
    commonMistakes: [
      'Trying to use every scale and technique at once instead of focusing on one musical idea per pass.',
    ],
  },

  // ------------------------------------------------------------ Song Practice
  {
    id: 'song-riff-breakdown',
    name: 'Riff Breakdown Practice',
    category: 'song',
    description:
      "Isolating a short riff from a song you're learning, slowing it down, and building it back up to speed in small, secure chunks.",
    difficulty: 3,
    importance: 4,
    usefulness: 4,
    recommendedDuration: 15,
    minDuration: 10,
    maxDuration: 25,
    skillTags: ['song', 'riff', 'learning-by-ear'],
    instructions: [
      'Break the riff into 1-2 bar chunks and loop the hardest chunk first at a slow, comfortable tempo.',
      'Once clean, connect it to the chunk before or after it, rather than practicing every chunk in isolation forever.',
      'Raise the tempo in small steps only after three clean repetitions in a row.',
    ],
    tips: ['It is normal and efficient to spend most of the time on the single hardest bar rather than the whole riff.'],
    commonMistakes: [
      'Practicing the riff start-to-finish every time, which wastes time on parts that are already solid.',
    ],
  },
  {
    id: 'song-solo-section',
    name: 'Solo / Lead Section Practice',
    category: 'song',
    description:
      'Working through a solo or lead break phrase by phrase, matching bends, vibrato and timing to the original rather than just the right notes.',
    difficulty: 4,
    importance: 4,
    usefulness: 4,
    recommendedDuration: 20,
    minDuration: 10,
    maxDuration: 30,
    skillTags: ['song', 'solo', 'lead', 'learning-by-ear'],
    instructions: [
      'Isolate a single phrase (2-4 seconds) of the solo and loop just that section, slowed down if possible.',
      'Match not just the notes but the bends, slides and vibrato as closely as you can to the reference.',
      'Once one phrase is solid, add the next phrase and practice the join between them.',
    ],
    tips: ['Getting one phrase truly clean is more valuable than getting the whole solo "roughly" right.'],
    commonMistakes: [
      'Focusing only on correct notes and skipping the expressive details (bends, vibrato, dynamics) that make the solo recognizable.',
    ],
    recommendedBpm: { min: 60, max: 120 },
  },
  {
    id: 'song-full-run-through',
    name: 'Full Song Run-Through',
    category: 'song',
    description:
      "Playing a song you're learning from start to finish without stopping, to build performance stamina and glue the sections together musically.",
    difficulty: 2,
    importance: 3,
    usefulness: 4,
    recommendedDuration: 15,
    minDuration: 10,
    maxDuration: 25,
    skillTags: ['song', 'performance', 'endurance'],
    instructions: [
      'Play through the full song at a tempo where you can get through it without stopping, even if slower than the original.',
      'If you make a mistake, keep going rather than restarting — recovering in time is its own skill.',
      'Note the one or two spots that broke down, to target them in a future riff or solo-focused session.',
    ],
    tips: ['This exercise is about flow and recovery, not precision — save precision work for the breakdown exercises.'],
    commonMistakes: [
      'Stopping and restarting at every small mistake, which never builds the ability to play through a full song.',
    ],
  },
]

// Note: to look up an exercise by id, use `findExercise` from
// `services/exerciseLibrary.ts` instead of adding a lookup here — that one
// searches built-in *and* user-added exercises together.
