import { type Plugin } from 'vite'
import fs from 'node:fs/promises'

export default function base64loader(): Plugin {
  return {
    name: 'base64-loader',
    async transform(_: unknown, id: string) {
      const [path, query] = id.split('?')
      if (query != 'base64') return null

      const data = await fs.readFile(path)
      const base64 = data.toString('base64')

      return `export default '${base64}';`
    },
  }
}
