import { useState } from 'react'
import { useGuitool } from '../hooks/useGuitool'
import type { Song } from '../types/song'
import type { CustomSongInput } from '../services/songLibrary'
import SongLibraryList from '../features/songs/SongLibraryList'
import AddSongForm from '../features/songs/AddSongForm'
import SongDetailView from '../features/songs/SongDetailView'

type View =
  | { mode: 'list' }
  | { mode: 'detail'; song: Song }
  | { mode: 'add'; duplicateFrom?: Song }
  | { mode: 'edit'; song: Song }

export default function Songs() {
  const { songs, getSongProgress, addCustomSong, editCustomSong, removeCustomSong, setSongStatus, toggleSongFavorite } =
    useGuitool()
  const [view, setView] = useState<View>({ mode: 'list' })

  const handleAddSubmit = (input: CustomSongInput) => {
    addCustomSong(input)
    setView({ mode: 'list' })
  }

  const handleEditSubmit = (id: string) => (input: CustomSongInput) => {
    editCustomSong(id, input)
    setView({ mode: 'list' })
  }

  const handleDelete = (id: string) => () => {
    removeCustomSong(id)
    setView({ mode: 'list' })
  }

  if (view.mode === 'add') {
    return (
      <div className="flex flex-col gap-6">
        <button className="btn-ghost self-start" onClick={() => setView({ mode: 'list' })}>
          ‹ Back to songs
        </button>
        <div>
          <p className="label-eyebrow">New song</p>
          <h1 className="mt-1 text-3xl font-semibold text-parchment-100">Add to your songs</h1>
        </div>
        <AddSongForm
          initial={view.duplicateFrom}
          onCancel={() => setView({ mode: 'list' })}
          onSubmit={handleAddSubmit}
        />
      </div>
    )
  }

  if (view.mode === 'edit') {
    return (
      <div className="flex flex-col gap-6">
        <button className="btn-ghost self-start" onClick={() => setView({ mode: 'list' })}>
          ‹ Back to songs
        </button>
        <div>
          <p className="label-eyebrow">Custom song</p>
          <h1 className="mt-1 text-3xl font-semibold text-parchment-100">{view.song.title}</h1>
        </div>
        <AddSongForm
          initial={view.song}
          onCancel={() => setView({ mode: 'list' })}
          onSubmit={handleEditSubmit(view.song.id)}
          onDelete={handleDelete(view.song.id)}
        />
      </div>
    )
  }

  if (view.mode === 'detail') {
    const song = view.song
    return (
      <SongDetailView
        song={song}
        progress={getSongProgress(song.id)}
        onBack={() => setView({ mode: 'list' })}
        onSetStatus={(status) => setSongStatus(song.id, status)}
        onToggleFavorite={() => toggleSongFavorite(song.id)}
        onEdit={song.isCustom ? () => setView({ mode: 'edit', song }) : undefined}
        onDuplicate={!song.isCustom ? () => setView({ mode: 'add', duplicateFrom: song }) : undefined}
        onDelete={song.isCustom ? handleDelete(song.id) : undefined}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label-eyebrow">Songs</p>
          <h1 className="mt-1 text-3xl font-semibold text-parchment-100">Your song list</h1>
        </div>
        <button className="btn-primary shrink-0" onClick={() => setView({ mode: 'add' })}>
          + Add Song
        </button>
      </div>

      <p className="text-sm text-parchment-400/70">
        A catalog of real songs worth learning, with our own practice notes — and links out to
        Songsterr / Ultimate Guitar for the actual tab or chords, since Guitool doesn't store or
        reproduce tab content itself. Track your status and star your favorites as you go.
      </p>

      <SongLibraryList
        songs={songs}
        getProgress={getSongProgress}
        onSelect={(song) => setView({ mode: 'detail', song })}
        onToggleFavorite={toggleSongFavorite}
      />
    </div>
  )
}
