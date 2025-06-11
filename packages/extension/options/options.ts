import pThrottle from 'p-throttle'

type Options = Record<string, string | boolean>

const throttle = pThrottle({
  limit: 1,
  interval: 1000,
})

export async function init(defaultOptions: Options) {
  const form = document.forms[0] as HTMLFormElement
  const prev = await getStoredOptions(defaultOptions)

  for (const el of form.elements) {
    if (el instanceof HTMLInputElement && el.type === 'checkbox') {
      el.checked = prev[el.name] === true ? true : false

      el.addEventListener('change', async () => {
        await chrome.storage.sync.set({
          [el.name]: el.checked,
        })
      })
    } else if (el instanceof HTMLInputElement) {
      el.value = prev[el.name].toString()

      el.addEventListener('input', async () => {
        await chrome.storage.sync.set({
          [el.name]: el.value,
        })
      })
    } else if (el instanceof HTMLSelectElement) {
      el.value = prev[el.name].toString()

      el.addEventListener('change', async () => {
        await chrome.storage.sync.set({
          [el.name]: el.value,
        })
      })
    }
  }

  return prev
}

export async function handleResetButtonClick() {
  await chrome.storage.sync.clear()

  window.location.reload()
}

function getStoredOptions<T>(defaultOptions: T): Promise<T> {
  return new Promise((resolve) => {
    chrome.storage.sync.get<T>(defaultOptions, (options) => {
      resolve(options)
    })
  })
}
