import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import { GuitoolProvider } from './hooks/useGuitool'
import { ThemeProvider } from './hooks/useTheme'
import { LocaleProvider } from './hooks/useLocale'
import Dashboard from './pages/Dashboard'
import Practice from './pages/Practice'
import Progress from './pages/Progress'
import Tuner from './pages/Tuner'
import Metronome from './pages/Metronome'
import SongsTabs from './pages/SongsTabs'
import SongsChords from './pages/SongsChords'
import AmpTones from './pages/AmpTones'
import Library from './pages/Library'
import Level from './pages/Level'

export default function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <GuitoolProvider>
          <AppShell>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/tuner" element={<Tuner />} />
              <Route path="/metronome" element={<Metronome />} />
              {/* "Songs" is now a dropdown (Tabs / Chords) in the nav rather than
                  its own page — /songs and the old /my-tabs both redirect to the
                  new default so existing bookmarks/links keep working. */}
              <Route path="/songs" element={<Navigate to="/songs/tabs" replace />} />
              <Route path="/songs/tabs" element={<SongsTabs />} />
              <Route path="/songs/chords" element={<SongsChords />} />
              <Route path="/my-tabs" element={<Navigate to="/songs/tabs" replace />} />
              <Route path="/amp-tones" element={<AmpTones />} />
              <Route path="/library" element={<Library />} />
              <Route path="/level" element={<Level />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppShell>
        </GuitoolProvider>
      </LocaleProvider>
    </ThemeProvider>
  )
}
