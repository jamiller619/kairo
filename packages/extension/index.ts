/// <reference lib="DOM" />
import storage from '@/utils/storage'

import '@/components/favicon'
import '@/components/EpicUnsplash.ts'
import '@/components/DateTime.js'
import '@/components/ZiiiroClock.ts'
import '@/components/Options.ts'

const ziiiroClock = document.querySelector('ziiiro-clock')
const epicUnsplash = document.querySelector('epic-unsplash')
const dateTime = document.querySelector('.datetime') as HTMLElement

storage.watch('clock.hours.color', (color) => {
  ziiiroClock?.setAttribute('hour', color as string)
})

storage.watch('clock.minutes.color', (color) => {
  ziiiroClock?.setAttribute('minute', color as string)
})

storage.watch('unsplash.photo.type', (type) => {
  epicUnsplash?.setAttribute('key', type as string)
})

storage.watch('unsplash.photo.value', (value) => {
  epicUnsplash?.setAttribute('value', value as string)
})

storage.watch('datetime.display', (value) => {
  dateTime.style.visibility = value === true ? 'visible' : 'hidden'
})

const main = document.querySelector('main')

document
  .querySelector('options-page')
  ?.addEventListener('options.toggle', (e) => {
    main?.classList.toggle('open', (e as CustomEvent<boolean>).detail)
  })
