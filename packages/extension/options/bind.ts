import pThrottle from 'p-throttle'

const throttle = pThrottle({
  limit: 1,
  interval: 1000,
})

export function createBind<T extends object>() {
  return function bind<K extends keyof T>(
    key: K,
    handler: (value: T[K]) => void,
  ) {
    const throttled = throttle(handler)

    chrome.storage?.onChanged.addListener((changes) => {
      if (key in changes) {
        throttled(changes[key as keyof typeof changes].newValue)
      }
    })

    chrome.storage?.sync.get<T>(key, (options: T) => {
      throttled(options[key])
    })
  }
}
