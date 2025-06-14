import { fileURLToPath } from 'node:url'
import { defineConfig, PluginOption } from 'vite'
import cp from 'vite-plugin-cp'
import htmlPurge from 'vite-plugin-purgecss'

function root(path: string) {
  return fileURLToPath(new URL(path, import.meta.url))
}

export default defineConfig({
  root: './',
  envPrefix: 'PUBLIC',
  envDir: '../../',
  plugins: [
    htmlPurge({}) as PluginOption,
    cp({
      targets: [
        {
          src: './manifest.json',
          dest: '../../dist/extension',
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': root('./'),
      '@types': root('../../types'),
    },
  },
  build: {
    target: 'esnext',
    outDir: '../../dist/extension',
    emptyOutDir: true,
    minify: false,
    rollupOptions: {
      input: {
        main: 'index.html',
        options: 'options/index.html',
      },
    },
  },
})
