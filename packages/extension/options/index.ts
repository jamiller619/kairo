import { Options } from '@types'
import '@/components/favicon'
import './style.css'
import { handleResetButtonClick, bindForm } from './options'
import { createBind } from './bind'

const defaults: Options = {
  'unsplash.photo.type': 'collection',
  'unsplash.photo.value': 'yvLAh9Xk5B4',
  'datetime.display': true,
  'clock.hours.color': '#1e90ff', // dodgerblue
  'clock.minutes.color': '#ff1493', // deeppink
}

const resetButton = document.getElementById('reset')

resetButton?.addEventListener('click', handleResetButtonClick)

await bindForm(document.forms[0], defaults)

const unsplashPhotoValue = document.forms.namedItem('unsplash.photo.value')!
const unsplashPhotoValueLabel = document.getElementById(
  'unsplash.photo.value.label',
)!

const bind = createBind<Options>()

bind('unsplash.photo.type', (value) => {
  switch (value) {
    case 'search':
      unsplashPhotoValueLabel.textContent = 'Search term'
      unsplashPhotoValue.placeholder = 'e.g. nature'
      break
    case 'topic':
      unsplashPhotoValueLabel.textContent = 'Topic ID or name'
      unsplashPhotoValue.placeholder = 'e.g. wallpapers'
      break
    case 'user':
      unsplashPhotoValueLabel.textContent = 'Username'
      unsplashPhotoValue.placeholder = 'e.g. naoufal'
      break
    default:
      unsplashPhotoValueLabel.textContent = 'Collection ID'
      unsplashPhotoValue.placeholder = 'e.g. yvLAh9Xk5B4'
      break
  }
})
