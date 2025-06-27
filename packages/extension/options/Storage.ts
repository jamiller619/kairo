import { Options } from '@types'

const STORAGE_KEY = 'kairo.options'

type GenericOptions = Record<string, string | boolean | number>

export default interface Storage<T extends GenericOptions> {
  get(): T | Promise<T>
  set(data: T): void | Promise<void>
  watch(key: keyof T, callback: (v: undefined | T[typeof key]) => void): void | Promise<void>
}

class BaseStorage<T extends GenericOptions> {
  defaults: T

  constructor(defaultOptions: T) {
    this.defaults = defaultOptions
  }
}

export class ChromeStorage extends BaseStorage<Options> implements Storage<Options> {
  async get() {
    const data = await chrome.storage.sync.get<Options>()

    if (!data) {
      await this.set(this.defaults)

      return this.defaults
    }

    return data
  }

  async set(data: Options) {
    return chrome.storage.sync.set({
      ...await this.get(),
      ...data,
    })
  }

  async watch<K extends keyof Options>(key: K, handler: (v: Options[K]) => void) {
    chrome.storage.onChanged.addListener((changes) => {
      if (key in changes) {
        const nv = changes[key as keyof typeof changes].newValue

        handler(nv)
      }
    })

    const val = (await this.get())[key]

    handler(val)
  }
}

export class LocalStorage extends BaseStorage<Options> implements Storage<Options> {
  get(): Options {
    const data = localStorage.getItem(STORAGE_KEY)

    if (data) {
      return JSON.parse(data)
    }

    this.set(this.defaults)
    return this.defaults
  }

  set(data: Options) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  watch(key: keyof Options, handler: (v: undefined | Options[typeof key]) => void | Promise<void>) {
    window.addEventListener('storage', async (ev) => {
      if (ev.key === key) {
        if (ev.newValue === 'true' || ev.newValue === 'false') {
          await handler(ev.newValue === 'true')
        } else {
          await handler(ev.newValue || undefined)
        }
      }
    })

    const data = this.get()

    handler(data[key])
  }
}
