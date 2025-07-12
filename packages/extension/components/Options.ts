import settingsIcon from '@/assets/settings.svg?raw'
import backIcon from '@/assets/chevron-left.svg?raw'
import { Options } from '@types'
import { bindForm } from '@/options'
import storage from '@/utils/storage'
import upDownIcon from '@/assets/up-down.svg'

const defaults: Options = {
  'unsplash.photo.type': 'collection',
  'unsplash.photo.value': 'yvLAh9Xk5B4',
  'datetime.display': true,
  'clock.hours.color': '#1e90ff', // dodgerblue
  'clock.minutes.color': '#ff1493', // deeppink
}

const style = document.createElement('style')
const template = /* html */ `
  <form class="closed">
    <section>
      <label>
        <span>Unsplash photo type</span>
        <select name="unsplash.photo.type">
          <button>
            <selectedcontent></selectedcontent>
          </button>
          <option value="collection">Collection</option>
          <option value="search">Search</option>
          <option value="topic">Topic</option>
          <option value="user">User</option>
        </select>
      </label>
      <label>
        <span id="unsplash.photo.value.label"></span>
        <input type="text" name="unsplash.photo.value" required />
      </label>
    </section>
    <section>
      <label class="align">
        <input type="checkbox" name="datetime.display" />
        <span>Display time</span>
      </label>
    </section>
    <section>
      <label class="align">
        <input type="color" name="clock.hours.color" />
        <span>Hour hand color</span>
      </label>
      <label class="align">
        <input type="color" name="clock.minutes.color" />
        <span>Minute hand color</span>
      </label>
    </section>
    <section id="buttons"></section>
    <section id="notify">
      <p></p>
    </section>
  </form>
`

class OptionsPage extends HTMLElement {
  template = document.createElement('template')
  toggleButton = document.createElement('button')
  form: HTMLFormElement | null = null
  formButtons: HTMLElement | null = null
  isOpen = false

  async connectedCallback() {
    this.attachShadow({ mode: 'open' })

    this.toggleButton.id = 'toggle-icon'
    this.toggleButton.innerHTML = settingsIcon
    this.template.innerHTML = template

    this.toggleButton.addEventListener('click', this.toggle.bind(this))
    this.shadowRoot?.append(style, this.toggleButton, this.template.content)
    this.form = this.shadowRoot?.querySelector('form') as HTMLFormElement

    const buttons = await bindForm(this.form, storage)

    buttons.get('reset')?.classList.add('ghost')

    this.formButtons = this.shadowRoot?.querySelector('#buttons') ?? null
    this.formButtons?.append(...buttons)

    const unsplashPhotoValue = this.form!.elements.namedItem(
      'unsplash.photo.value',
    ) as HTMLInputElement

    const unsplashPhotoValueLabel = this.shadowRoot?.querySelector(
      '#unsplash.photo.value.label'.replace(/\./g, '\\.'),
    )!

    const unsplashPhotoType = this.form!.elements.namedItem(
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
  }

  async toggle() {
    if (!this.isOpen) {
      window.location.assign('/options')
    }

    await this.toggle2()
  }

  async toggle2() {
    this.isOpen = !this.isOpen

    this.dispatchEvent(
      new CustomEvent('options.toggle', {
        detail: this.isOpen,
      }),
    )

    this.toggleButton.classList.toggle('open')

    if (this.isOpen) {
      this.toggleButton.innerHTML = backIcon
      ;(this.form?.elements.item(0) as HTMLInputElement).focus()
    } else {
      this.toggleButton.innerHTML = settingsIcon
    }

    this.form?.classList.remove('open', 'closed')
    this.form?.classList.add(this.isOpen ? 'open' : 'closed')
  }
}

style.textContent = /* css */ `
  :host {
    --color-bg: light-dark(#a7a7a7c7, #131313c7);
    --color-bg-highlight: light-dark(white, #f7f7f733);
    --color-fg: light-dark(#131313, #a7a7a7);
    --color-control: rgb(from field r g b / 0.8);

    color: inherit;
    color-scheme: inherit;
  }

  #toggle-icon {
    all: unset;
    background: var(--color-bg);
    color: light-dark(black, white);
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 150ms 50ms ease-in-out;
    transform: translateX(0px);
    cursor: pointer;

    &:hover {
      background: light-dark(white, black);
    }

    svg {
      animation: appear 100ms alternate ease-out;
    }

    &.open {
      transform: translateX(230px);
    }
  }

  @keyframes appear {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  svg {
    fill: currentColor;
  }

  form {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    transition: transform 200ms ease-in-out;
    z-index: -1;
    padding: 3rem 3rem 2rem;
    background: var(--color-bg);
    backdrop-filter: blur(20px) saturate(1.8);
    height: 100%;

    &.closed {
      transform: translateX(-100%);
      pointer-events: none;
    }

    &.open {
      transform: translateX(0);
      pointer-events: all;
    }
  }

  button {
    all: unset;
  }

  select,
  input,
  button,
  option {
    display: flex;
    width: 100%;
    font: inherit;
    box-sizing: border-box;
    min-block-size: 2rem;
    background-color: var(--color-control);
    transition: background-color 50ms;

    &:hover {
      background-color: var(--color-bg-highlight);
    }
  }

  button,
  select,
  input:not([type="checkbox"]) {
    box-shadow: 1px 1px 10px 0px rgb(0 0 0 / 30%);
  }

  select::picker(select) {
    min-block-size: 2rem;
  }

  input[type='text'] {
    padding-inline-start: 1rem;
  }

  input[type='checkbox'],
  input[type='color'] {
    width: revert;
    border: none;
  }

  input[type='checkbox'] {
    width: 18px;
    height: 18px;
  }

  input[type='text'],
  select,
  ::picker(select) {
    border: none;
    border-radius: 0.5rem;
  }

  select,
  ::picker(select) {
    appearance: base-select;
  }

  select {
    button {
      all: unset;
    }

    &::picker-icon {
      place-content: end;
      content: url(${upDownIcon});
    }
  }

  section {
    display: flex;
    flex-direction: column;
    place-content: center;
    gap: 0.5rem;
    padding-block: 0.5rem;
    margin-inline: 0.5rem;
    min-block-size: 3rem;
    border-bottom: 2px solid rgb(255 255 255 / 0.1);
  }

  label {
    display: block;

    span {
      line-height: 2rem;
    }
  }

  label.align {
    margin-right: auto;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  button {
    border-radius: 0.5rem;
    padding: 0.5rem;
    text-align: center;
    cursor: pointer;
    place-content: center;

    &.ghost {
      background: none;
      outline: 2px solid var(--color-control);
      outline-offset: -1px;

      &:hover {
        background: var(--color-bg-highlight);
        outline-color: transparent;
      }
    }
  }

  #buttons {
    padding-block: 1rem;
    gap: 0.75rem;
    border: none;
  }

  #notify {
    background: linear-gradient(0deg, #02994c, #00ff8066);
    border-radius: 0.5rem;
    padding-block: 0.25rem;
    padding-inline: 1rem;
    margin: 0;
    opacity: 0;
    border: none;
    transform: translateY(20px);
    transition:
      opacity 200ms,
      transform 200ms ease-in-out;

    &.show {
      opacity: 1;
      transform: translateY(0px);
    }
  }
`

globalThis.customElements.define('options-page', OptionsPage)
