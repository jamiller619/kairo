interface ImportMetaEnv {
  readonly PUBLIC_API_URL: string
  readonly PUBLIC_CACHE_TTL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
