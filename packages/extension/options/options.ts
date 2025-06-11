type Options = Record<string, string | boolean>

function createHandler(key: string, value: () => string | boolean) {
  return async () => {
    await chrome.storage.sync.set({
      [key]: value(),
    })
  }
}

export async function bindForm(form: HTMLFormElement, defaultOptions: Options) {
  const saved = await getOptions(defaultOptions)

  for (const [key, value] of Object.entries(saved)) {
    if (key in form.elements) {
      // @ts-ignore: This works
      const el = form.elements[key] as HTMLElement

      if (el instanceof HTMLInputElement && el.type === 'checkbox') {
        el.checked = saved[key] === true ? true : false

        el.addEventListener(
          'change',
          createHandler(key, () => el.checked),
        )
      } else if (el instanceof HTMLInputElement) {
        el.value = saved[key].toString()

        el.addEventListener(
          'input',
          createHandler(key, () => el.value),
        )
      } else if (el instanceof HTMLSelectElement) {
        el.value = saved[key] as string

        el.addEventListener(
          'change',
          createHandler(key, () => el.value),
        )
      }
    }
  }

  return saved
}

export async function handleResetButtonClick() {
  await chrome.storage.sync.clear()

  window.location.reload()
}

export function getOptions<T>(defaultOptions: T): Promise<T> {
  return new Promise((resolve) => {
    chrome.storage.sync.get<T>(defaultOptions, (options) => {
      resolve(options)
    })
  })
}
