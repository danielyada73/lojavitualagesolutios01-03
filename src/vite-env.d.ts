/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_YAMPI_ALIAS: string
  readonly VITE_YAMPI_TOKEN: string
  readonly VITE_YAMPI_SECRET_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
