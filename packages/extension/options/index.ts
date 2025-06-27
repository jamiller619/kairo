import defaultOptions from '@/utils/defaultOptions'
import OptionsComponent from '@/components/Options'
import { Options } from '@types'
import Storage from './Storage'

export async function bindForm(form: HTMLFormElement, storage: Storage<Options>) {
  const saveButton = createButton('savebtn', 'Save')
  const resetButton = createButton('resetbtn', 'Reset')
  const optionsPage = document.querySelector('options-page') as OptionsComponent

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault()

    const data = formToObj(form)

    await storage.set(data)

    optionsPage.showNotification('✓ Options saved!')
  }

  function handleReset() {
    setForm(form, defaultOptions)
  }

  form.addEventListener('submit', handleSubmit)
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


