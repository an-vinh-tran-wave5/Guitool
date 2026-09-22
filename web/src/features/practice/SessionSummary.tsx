import type { PracticeSession } from '../../types/session'
import type { Exercise } from '../../types/exercise'
import { formatHoursMinutes } from '../../utils/time'
import { sessionMeaningfulSeconds } from '../../services/progressService'

export default function SessionSummary({
  session,
  getExercise,
  onDone,
}: {
  session: PracticeSession
  getExercise: (id: string) => Exercise | undefined
  onDone: () => void
}) {
  const totalSeconds = sessionMeaningfulSeconds(session)
  const completedCount = session.exercises.filter((e) => e.completed).length

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="text-5xl" aria-hidden>
        🎉
      </div>
      <div>
        <p className="label-eyebrow">Session complete</p>
        <h1 className="mt-1 text-3xl font-semibold text-parchment-100">Nice playing.</h1>
      </div>

      <div className="panel-raised w-full max-w-sm px-5 py-5">
        <p className="font-display text-3xl font-semibold text-brass-300">{formatHoursMinutes(totalSeconds)}</p>
        <p className="mt-1 text-sm text-parchment-400/70">
          {completedCount} of {session.exercises.length} exercises completed
        </p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-2">
        {session.exercises.map((se) => {
          const exercise = getExercise(se.exerciseId)
          if (!exercise) return null
          return (
            <div key={se.exerciseId} className="panel flex items-center justify-between px-4 py-3">
              <span className="text-left text-sm text-parchment-200">{exercise.name}</span>
              <span className="text-xs text-parchment-400/70">
                {se.skipped ? 'Skipped' : `${Math.round(se.elapsedSeconds / 60)} min`}
              </span>
            </div>
          )
        })}
      </div>

      <button className="btn-primary" onClick={onDone}>
        Back to Dashboard
      </button>
    </div>
  )
}
