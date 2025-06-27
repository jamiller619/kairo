export default function logger(name: string) {
  return console.log.bind(console, `[${name}]`)
}
