import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { alphaTab } from '@coderline/alphatab-vite'

// https://vite.dev/config/
export default defineConfig({
  // The alphaTab plugin copies its bundled Bravura web font and SONiVOX
  // soundfont into the build output (served from /font/ and /soundfont/)
  // and wires up the web workers / audio worklets it uses internally for
  // rendering and playback — see src/features/mytabs/TabPlayer.tsx and
  // https://www.alphatab.net/docs/getting-started/installation-vite.
  plugins: [react(), alphaTab()],
  server: {
    port: 5173,
  },
})
