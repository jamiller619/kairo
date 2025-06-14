import { defineConfig } from 'vite'
import cp from 'vite-plugin-cp'
import base64loader from './vite-base64-import'
import { fileURLToPath } from 'node:url'

function root(path: string) {
  return fileURLToPath(new URL(path, import.meta.url))
}

export default defineConfig({
  root: './',
  envPrefix: 'PUBLIC',
  envDir: '../../',
  plugins: [
    base64loader(),
    cp({
      targets: [
        {
          src: './assets/icons',
          dest: '../../dist/extension/assets/icons',
        },
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
