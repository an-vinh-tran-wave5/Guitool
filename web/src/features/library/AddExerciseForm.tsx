import { useMemo, useState, type FormEvent } from 'react'
import type { Exercise, ExerciseCategory, Rating1to5 } from '../../types/exercise'
import { EXERCISE_CATEGORY_LABELS } from '../../types/exercise'
import { validateCustomExerciseInput, type CustomExerciseInput } from '../../services/exerciseLibrary'
import { classifyByRatings, EXERCISE_TAG_LABELS, EXERCISE_TAG_STYLES } from '../../services/exerciseTags'
import { buildLookupLinks } from '../../services/webLookup'
import LookupOnlineLinks from './LookupOnlineLinks'

const CATEGORY_OPTIONS = Object.entries(EXERCISE_CATEGORY_LABELS) as [ExerciseCategory, string][]

interface FormState {
  name: string
  category: ExerciseCategory
  description: string
  difficulty: number
  importance: number
  usefulness: number
  recommendedDuration: string
  minDuration: string
  maxDuration: string
  skillTagsRaw: string
  instructionsRaw: string
  tipsRaw: string
  commonMistakesRaw: string
  bpmMin: string
  bpmMax: string
}

function blankForm(): FormState {
  return {
    name: '',
    category: 'technique',
    description: '',
    difficulty: 3,
    importance: 3,
    usefulness: 3,
    recommendedDuration: '15',
    minDuration: '10',
    maxDuration: '20',
    skillTagsRaw: '',
    instructionsRaw: '',
    tipsRaw: '',
    commonMistakesRaw: '',
    bpmMin: '',
    bpmMax: '',
  }
}

function exerciseToForm(exercise: Exercise): FormState {
  return {
    name: exercise.name,
    category: exercise.category,
    description: exercise.description,
    difficulty: exercise.difficulty,
    importance: exercise.importance,
    usefulness: exercise.usefulness,
    recommendedDuration: String(exercise.recommendedDuration),
    minDuration: String(exercise.minDuration),
    maxDuration: String(exercise.maxDuration),
    skillTagsRaw: exercise.skillTags.join(', '),
    instructionsRaw: exercise.instructions.join('\n'),
    tipsRaw: (exercise.tips ?? []).join('\n'),
    commonMistakesRaw: (exercise.commonMistakes ?? []).join('\n'),
    bpmMin: exercise.recommendedBpm ? String(exercise.recommendedBpm.min) : '',
    bpmMax: exercise.recommendedBpm ? String(exercise.recommendedBpm.max) : '',
  }
}

function formToInput(form: FormState): CustomExerciseInput {
  return {
    name: form.name,
    category: form.category,
    description: form.description,
    difficulty: form.difficulty,
    importance: form.importance,
    usefulness: form.usefulness,
    recommendedDuration: Number(form.recommendedDuration) || 0,
    minDuration: Number(form.minDuration) || 0,
    maxDuration: Number(form.maxDuration) || 0,
    skillTags: form.skillTagsRaw.split(',').map((s) => s.trim()).filter(Boolean),
    instructions: form.instructionsRaw.split('\n'),
    tips: form.tipsRaw.split('\n'),
    commonMistakes: form.commonMistakesRaw.split('\n'),
    bpmMin: form.bpmMin ? Number(form.bpmMin) : undefined,
    bpmMax: form.bpmMax ? Number(form.bpmMax) : undefined,
  }
}

function RatingSlider({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: Rating1to5) => void
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-xs font-medium uppercase tracking-wide text-parchment-400/70">{label}</label>
        <span className="font-display text-sm text-brass-300">{value}</span>
      </div>
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) as Rating1to5)}
        className="w-full accent-ember-500"
      />
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-ink-600 bg-ink-900/60 px-3 py-2 text-sm text-parchment-100 placeholder:text-parchment-500/50 focus:border-ember-500 focus:outline-none'

export default function AddExerciseForm({
  initial,
  onCancel,
  onSubmit,
  onDelete,
}: {
  initial?: Exercise
  onCancel: () => void
  onSubmit: (input: CustomExerciseInput) => void
  onDelete?: () => void
}) {
  const [form, setForm] = useState<FormState>(() => (initial ? exerciseToForm(initial) : blankForm()))
  const [errors, setErrors] = useState<string[]>([])

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const input = useMemo(() => formToInput(form), [form])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const validationErrors = validateCustomExerciseInput(input)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors([])
    onSubmit(input)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <section className="panel flex flex-col gap-4 p-5">
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-parchment-400/70">
            Exercise name
          </label>
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="e.g. Two-hand tapping basics"
            maxLength={80}
          />
        </div>

        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-parchment-400/70">Look up online</p>
          <LookupOnlineLinks links={buildLookupLinks(form.name)} />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-parchment-400/70">
            Category
          </label>
          <select
            className={inputClass}
            value={form.category}
            onChange={(e) => update('category', e.target.value as ExerciseCategory)}
          >
            {CATEGORY_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-parchment-400/70">
            Description
          </label>
          <textarea
            className={inputClass}
            rows={2}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="One or two sentences: what it is and why it helps."
          />
        </div>
      </section>

      <section className="panel flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-parchment-400/70">
            Auto-tag preview
          </p>
          <span className={`chip ${EXERCISE_TAG_STYLES[classifyByRatings(form.importance, form.difficulty)]}`}>
            {EXERCISE_TAG_LABELS[classifyByRatings(form.importance, form.difficulty)]}
          </span>
        </div>
        <p className="-mt-2 text-xs text-parchment-400/60">
          Importance 5/5 always tags as Must Learn; otherwise the difficulty rating decides Easy, Medium, or Hard.
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <RatingSlider label="Difficulty" value={form.difficulty} onChange={(v) => update('difficulty', v)} />
          <RatingSlider label="Importance" value={form.importance} onChange={(v) => update('importance', v)} />
          <RatingSlider label="Usefulness" value={form.usefulness} onChange={(v) => update('usefulness', v)} />
        </div>
      </section>

      <section className="panel grid grid-cols-1 gap-4 p-5 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-parchment-400/70">
            Typical minutes
          </label>
          <input
            type="number"
            min={5}
            className={inputClass}
            value={form.recommendedDuration}
            onChange={(e) => update('recommendedDuration', e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-parchment-400/70">
            Min minutes
          </label>
          <input
            type="number"
            min={5}
            className={inputClass}
            value={form.minDuration}
            onChange={(e) => update('minDuration', e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-parchment-400/70">
            Max minutes
          </label>
          <input
            type="number"
            min={5}
            className={inputClass}
            value={form.maxDuration}
            onChange={(e) => update('maxDuration', e.target.value)}
          />
        </div>
      </section>

      <section className="panel flex flex-col gap-4 p-5">
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-parchment-400/70">
            Instructions — one step per line
          </label>
          <textarea
            className={inputClass}
            rows={4}
            value={form.instructionsRaw}
            onChange={(e) => update('instructionsRaw', e.target.value)}
            placeholder={'Set a metronome to a slow tempo…\nPlay the pattern ascending and descending…'}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-parchment-400/70">
            Tips — one per line (optional)
          </label>
          <textarea
            className={inputClass}
            rows={2}
            value={form.tipsRaw}
            onChange={(e) => update('tipsRaw', e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-parchment-400/70">
            Common mistakes — one per line (optional)
          </label>
          <textarea
            className={inputClass}
            rows={2}
            value={form.commonMistakesRaw}
            onChange={(e) => update('commonMistakesRaw', e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-parchment-400/70">
            Skill tags — comma separated (optional)
          </label>
          <input
            className={inputClass}
            value={form.skillTagsRaw}
            onChange={(e) => update('skillTagsRaw', e.target.value)}
            placeholder="picking, right-hand, speed"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-parchment-400/70">
              Recommended BPM min (optional)
            </label>
            <input
              type="number"
              min={20}
              className={inputClass}
              value={form.bpmMin}
              onChange={(e) => update('bpmMin', e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-parchment-400/70">
              Recommended BPM max (optional)
            </label>
            <input
              type="number"
              min={20}
              className={inputClass}
              value={form.bpmMax}
              onChange={(e) => update('bpmMax', e.target.value)}
            />
          </div>
        </div>
      </section>

      {errors.length > 0 && (
        <div className="rounded-xl border border-ember-600/50 bg-ember-500/10 px-4 py-3">
          <ul className="flex flex-col gap-1 text-sm text-ember-300">
            {errors.map((err) => (
              <li key={err}>• {err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-primary">
          {initial ? 'Save changes' : '+ Add to library'}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        {onDelete && (
          <button
            type="button"
            className="btn-ghost ml-auto !text-ember-400"
            onClick={onDelete}
          >
            Delete exercise
          </button>
        )}
      </div>
    </form>
  )
}
