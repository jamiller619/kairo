import defaultOptions from '@/utils/defaultOptions'
import {Options} from '@types'
import Storage from './Storage'

function wait(n: number) {
  return new Promise<void>((resolve) => window.setTimeout(() => resolve(), n * 1000))
}

export async function bindForm(form: HTMLFormElement, storage: Storage<Options>) {
  const saveButton = createButton('savebtn', 'Save')
  const resetButton = createButton('resetbtn', 'Reset')
  const notify = form.querySelector('#notify')
  let timer = 0

  function clearTimeout() {
    window.clearTimeout(timer)
    timer = 0
  }

  async function showNotification(msg: string) {
    if (!notify) {
      return console.error(`Unable to show notification!`, msg)
    }

    if (timer) {
      notify.classList.remove('show')

      clearTimeout()

      await wait(0.2)
    }

    notify.querySelector('p')!.textContent = msg
    notify.classList.add('show')

    timer = window.setTimeout(() => {
      notify.classList.remove('show')
      clearTimeout()
    }, 3000) // 3 seconds
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault()

    const data = formToObj(form)

    await storage.set(data)

    showNotification('✓ Options saved successfully!')
  }

  handleInput()

  function handleInput() {
    const data = formToObj(form)

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

  const options = await storage.get()

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
    if (b[key as keyof typeof b] !== value) {
      return false
    }
  }

  return true
}

function formToObj(form: HTMLFormElement) {
  const data: Record<string, string | boolean> = {}
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


