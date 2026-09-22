/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the `tabs-server` Docker service — see `src/services/tabShareApi.ts`. */
  readonly VITE_TABS_SERVER_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
