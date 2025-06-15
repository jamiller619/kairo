import icon from '@/assets/settings.svg?raw'
import { css, html } from '@/utils/cis'

const style = document.createElement('style')
const template = html`
  <form class="closed">
    <section>
      <label>
        <span>Unsplash photo type</span>
        <select name="unsplash.photo.type">
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
  </form>
`

class OptionsPage extends HTMLElement {
  template = document.createElement('template')
  button = document.createElement('button')
  icon!: SVGSVGElement
  isOpen = false
  form!: HTMLFormElement

  connectedCallback() {
    this.attachShadow({ mode: 'open' })

    this.button.innerHTML = icon
    this.template.innerHTML = template
    this.shadowRoot!.append(style, this.button, this.template.content)

    this.button.addEventListener('click', this.toggle.bind(this))
    this.form = this.shadowRoot?.querySelector('form') as HTMLFormElement
  }

  toggle() {
    this.isOpen = !this.isOpen

    if (this.isOpen === true) {
      this.dispatchEvent(new Event('options.open'))
    } else {
      this.dispatchEvent(new Event('options.close'))
    }

    this.form.classList.remove('open')
    this.form.classList.remove('closed')
    this.form.classList.add(this.isOpen ? 'open' : 'closed')
  }
}

style.textContent = css`
  :host {
    color: inherit;
  }

  button {
    all: unset;
    background: #000000a3;
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
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
    transition: transform 500ms ease-in-out;
    z-index: -1;
    padding: 2rem;
    background: #232323;
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

  section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 0 0 2rem;
    padding: 0 0 2rem;
    border-bottom: 3px solid lightgray;

    &:last-child {
      border-bottom: none;
    }
  }

  label.align {
    margin-right: auto;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  input[type='checkbox'] {
    height: 2rem;
  }

  button {
    background: var(--color-grey);
    color: var(--bg-color);

    &.ghost {
      background: var(--color-lightGrey);
      color: var(--color-grey);
    }
  }

  #buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  #save {
    flex: 2;
  }
`

globalThis.customElements.define('options-page', OptionsPage)
