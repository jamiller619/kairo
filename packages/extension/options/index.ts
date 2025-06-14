import { Options } from '@types'
import '@/components/favicon'
import './style.css'
import { bindForm } from './options'

const defaults: Options = {
  'unsplash.photo.type': 'collection',
  'unsplash.photo.value': 'yvLAh9Xk5B4',
  'datetime.display': true,
  'clock.hours.color': '#1e90ff', // dodgerblue
  'clock.minutes.color': '#ff1493', // deeppink
}

const form = document.forms[0]
const buttons = await bindForm(form, defaults)

document.getElementById('buttons')?.append(...buttons)

buttons.get('reset')?.classList.add('ghost')

const unsplashPhotoValue = form.elements.namedItem(
  'unsplash.photo.value',
) as HTMLInputElement
const unsplashPhotoValueLabel = document.getElementById(
  'unsplash.photo.value.label',
)!
const unsplashPhotoType = form.elements.namedItem(
  'unsplash.photo.type',
) as HTMLSelectElement

unsplashPhotoType.addEventListener('change', () => {
  unsplashPhotoValue.value = ''

  setUnsplashPhotoType()
})

setUnsplashPhotoType()

function setUnsplashPhotoType() {
  const value = unsplashPhotoType.value

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
      unsplashPhotoValue.placeholder = `e.g. ${defaults['unsplash.photo.value']}`
      break
  }
}
