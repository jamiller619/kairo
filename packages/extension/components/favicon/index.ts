import getClockAngles from '@/utils/getClockAngles'
import conic from './conic.png?base64'

const template = document.createElement('template')

template.innerHTML = /* html */`
  <svg
    id="clock"
    width="16"
    height="16"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    style="position: relative">
    <foreignObject width="100" height="100">
      <div
        id="hour"
        xmlns="http://www.w3.org/1999/xhtml"
        style="background-color: dodgerblue"></div>
      <div
        id="minute"
        xmlns="http://www.w3.org/1999/xhtml"
        style="background-color: deeppink"></div>
      <div
        id="background"
        xmlns="http://www.w3.org/1999/xhtml"
        style="background-color: white"></div>
    </foreignObject>
    <!-- Center point -->
    <circle cx="50" cy="50" r="22" fill="black" />
    <style>
      #clock #hour,
      #clock #minute {
        position: absolute;
        inset: 0;
        clip-path: circle();
        mix-blend-mode: multiply;
        background-image: url(data:image/png;base64,${conic});
      }

      #clock #background {
        position: absolute;
        inset: 0;
        clip-path: circle();
        mix-blend-mode: soft-light;
      }
    </style>
  </svg>
`

const hourHand = template.content.getElementById('hour')!
const minuteHand = template.content.getElementById('minute')!
const head = document.querySelector('head')
const link = document.createElement('link')
const xmlSerializer = new XMLSerializer()

link.setAttribute('rel', 'shortcut icon')

head?.append(link)

render()

setInterval(() => {
  window.requestAnimationFrame(render)
}, 1000 * 30) // 30 seconds

function render() {
  const now = new Date()
  const angles = getClockAngles(now)

  minuteHand.style.rotate = `${angles.minute}deg`
  hourHand.style.rotate = `${angles.hour}deg`

  const content = xmlSerializer.serializeToString(template.content)
  const decoded = decodeURI(content)
  const b64 = btoa(decoded)
  const imgsrc = `data:image/svg+xml;base64,${b64}`

  link.setAttribute('href', imgsrc)

  document.querySelector('link[rel="shortcut icon"]')?.replaceWith(link)
}
