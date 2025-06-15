type Options = Record<string, string | boolean>

export async function bindForm(form: HTMLFormElement, defaultOptions: Options) {
  const saveButton = createButton('savebtn', 'Save')
  const resetButton = createButton('resetbtn', 'Reset')

  async function handleSubmit(e: SubmitEvent) {
    const data = formToObj(form, defaultOptions)

    await chrome.storage?.sync.set(data)

    e.preventDefault()
  }

  handleInput()

  function handleInput() {
    const data = formToObj(form, defaultOptions)

    resetButton.setAttribute('disabled', '')

    if (!areObjectsEqual(data, defaultOptions)) {
      resetButton.removeAttribute('disabled')
    }
  }

  function handleReset() {
    setForm(form, defaultOptions)

    resetButton.setAttribute('disabled', '')
  }

  form.addEventListener('submit', handleSubmit)
  form.addEventListener('input', handleInput)
  resetButton.addEventListener('click', handleReset)

  const options = await getOptions(defaultOptions)

  setForm(form, options)

  return new ButtonList(saveButton, resetButton)
}

function setForm(form: HTMLFormElement, options: Options) {
  for (const [key, value] of Object.entries(options)) {
    const el = form.elements.namedItem(key)

    if (el) {
      if (el instanceof HTMLInputElement && el.type === 'checkbox') {
        el.checked = value === true ? true : false
      } else if ('value' in el) {
        el.value = value.toString()
      }
    }
  }
}

function createHandler(key: string, value: () => string | boolean) {
  return async () => {
    await chrome.storage.sync.set({
      [key]: value(),
    })
  }
}

export async function bindAutoSavingForm(
  form: HTMLFormElement,
  defaultOptions: Options,
) {
  const saved = await getOptions(defaultOptions)

  for (const [key] of Object.entries(saved)) {
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

class ButtonList extends Array<HTMLButtonElement> {
  #map = new Map<string, HTMLButtonElement>()

  get(name: string) {
    return this.#map.get(`${name}btn`)
  }

  constructor(...args: HTMLButtonElement[]) {
    super(...args)

    for (const button of args) {
      if (button.id) {
        this.#map.set(button.id, button)
      }
    }
  }
}

function createButton(id: string, text: string) {
  const button = document.createElement('button')

  button.id = id
  button.textContent = text

  return button
}

function areObjectsEqual(a: Options, b: Options) {
  for (const [key, value] of Object.entries(a)) {
    if (b[key] !== value) {
      return false
    }
  }

  return true
}

function formToObj(form: HTMLFormElement, defaultOptions: Options) {
  const data: Options = {}
  const formData = new FormData(form)

  for (const [key, value] of Object.entries(defaultOptions)) {
    const el = form.elements.namedItem(key)

    if (el && el instanceof HTMLInputElement && el.type === 'checkbox') {
      data[key] = formData.get(key) === 'on'
    } else {
      data[key] = formData.get(key) as string
    }
  }

  return {
    ...defaultOptions,
    ...data,
  }
}

export async function handleResetButtonClick() {
  await chrome.storage?.sync.clear()

  window.location.reload()
}

export function getOptions<T>(defaultOptions: T): Promise<T> {
  return new Promise((resolve) => {
    if (chrome.storage?.sync) {
      chrome.storage.sync.get<T>(defaultOptions, (options) => {
        resolve(options)
      })
    } else {
      resolve({} as T)
    }
  })
}
