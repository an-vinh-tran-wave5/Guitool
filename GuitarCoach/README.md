# GuitarCoach — Full MVP (M0–M9)

This is the complete MVP from the design doc: Today's practice plan with the
allocation algorithm, a real countdown timer with a Session Complete screen,
local progress tracking with charts, daily reminder notifications, a
synthesized-click metronome, and a chromatic tuner. Phase 2/3 features (song
library, amp/tone presets, custom exercises) are intentionally not included.

This code was written in a cloud sandbox with no macOS/Xcode available, so
every file has been carefully hand-reviewed (brace/paren balance, SwiftData/
SwiftUI/AVFoundation API shapes, Swift argument-order rules) but never
compiled. **Build it in Xcode and tell me about any errors** — for a project
this size, expect a handful of small fixes on the first build, and they
should go quickly.

If you're on Windows, see **HOW-TO-INSTALL-ON-IPHONE-FROM-WINDOWS.md** in this
same delivery — that's the part that's actually different for you, since
Xcode itself only runs on macOS.

## Setting up the Xcode project

1. **File → New → Project → iOS → App.** Product Name `GuitarCoach`,
   Interface **SwiftUI**, Storage **SwiftData**, Language Swift.
2. Set the deployment target to **iOS 17.0** (target → General → Minimum
   Deployments). Required for SwiftData's `VersionedSchema`, `@Observable`,
   and the `AVAudioApplication` microphone-permission API used by the tuner.
3. Delete the template's default `ContentView.swift` and `Item.swift`.
4. Drag `App/`, `Models/`, `Services/`, `Features/` into the project
   navigator as groups (copy items if needed), added to the `GuitarCoach`
   target.
5. Drag `Resources/seed_exercises.json` in too — Xcode should add it to
   "Copy Bundle Resources" automatically; double check under Build Phases.
6. **App icon**: open `Assets.xcassets → AppIcon`, and drag
   `Resources/AppIcon/AppIcon-1024.png` into the single 1024×1024 slot
   (Xcode 14+ uses one image for all sizes). This is a placeholder pick-mark
   icon — swap it for real artwork whenever you like.
7. **Info settings** (target → Info, or add rows directly to Info.plist):
   - **Privacy - Microphone Usage Description** → something like "GuitarCoach
     uses the microphone to detect pitch for the tuner." Required or the app
     crashes the instant `TunerEngine` tries to request access.
   - Nothing else non-default is required — no background modes, no App
     Transport Security exceptions (the app makes no network calls at all).
8. **Unit tests**: File → New → Target → Unit Testing Bundle, name it
   `GuitarCoachTests`, add both files from `Tests/` to that target.
   `@testable import GuitarCoach` exposes the app's internal types to it
   automatically.
9. Build (⌘B) on a simulator first to catch straightforward errors fast,
   then run on your actual iPhone (Xcode → select your device → ⌘R) since
   the tuner and metronome need a real microphone and speaker.

## What to check once it builds

- **Today tab**: 2-4 exercises summing to 60 minutes, each with a reason
  line; ± adjusts minutes, swiping left offers "Swap." **Start Today's
  Practice** opens a full-screen countdown that auto-advances, supports
  pause/resume/skip/±2 min, and ends on a plain Session Complete summary.
- **Exercises tab**: 25 seeded exercises grouped by category; tapping one
  lets you adjust proficiency, BPM, priority, and notes, plus a "Practice at
  N BPM" shortcut into the metronome.
- **Tools tab**: Metronome (BPM slider, tap tempo, time signature, accent
  toggle, visual beat dots) and Tuner (note name, cents needle, standard
  tuning reference row — will ask for microphone permission on first use).
- **Progress tab**: current streak, a weekly bar chart, this month's total,
  and a most-practiced list. Empty until you complete a session or two.
- **Settings** (gear icon on Today): session length, exercises-per-session
  override, a daily reminder (toggle, time, day-of-week picker — will ask
  for notification permission), and "Reset All Local Data."
- **Unit tests**: both `PracticeAllocationEngineTests` and
  `ProgressStatsCalculatorTests` should pass.

## Design decisions worth knowing about

- **The metronome's clicks are synthesized at runtime** (a short decaying
  sine burst in `ClickSoundFactory`), not bundled audio files — one less
  thing that can be set up wrong in Xcode.
- **The tuner uses simple autocorrelation**, not an FFT or ML model —
  accurate enough for a single plucked string and cheap enough to run on
  every audio buffer in real time, per the "avoid over-engineering" brief.
- **The reminder scheduling is simpler than the design doc's original
  sketch.** A `UNCalendarNotificationTrigger` built from just
  weekday+hour+minute with `repeats: true` recurs indefinitely on its own —
  only one pending request per selected weekday (max 7), so there's no need
  to "top up a rolling window" on every foreground launch as the doc
  suggested.
- **The metronome's audio scheduling is sample-accurate** (scheduled ~2
  seconds ahead on `AVAudioEngine`'s own sample clock), but the **visual**
  beat indicator is a simpler wall-clock `Timer` restarted whenever BPM
  changes — accurate enough to look in sync without routing UI updates
  through the audio render thread.
- **BPM fields are optional (`Int?`)**, not the plain `Int` the data-model
  section implied, because three Guitar Knowledge exercises (fretboard
  memorization, note ID, interval training) aren't tempo-based.
- Default Xcode concurrency checking (Swift 5 language mode) is assumed.
  If you later turn on Swift 6 strict concurrency, the audio engines
  (`MetronomeEngine`, `TunerEngine`) and the notification/timer callback
  closures are the files most likely to need `Sendable`/`@MainActor`
  touch-ups.

## What's genuinely not here (by design)

Song/tab library, amp & tone presets, custom exercises, and BPM-progression
charts beyond the simple "most practiced" list are all Phase 2/3 in the
design doc and out of scope for this MVP. The four-tab structure has room
for a fifth "Songs" tab later without restructuring anything.
