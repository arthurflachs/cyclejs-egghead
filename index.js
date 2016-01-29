const Rx = require('rx')

// Logic: Event stream (functional)
function main() {
  return Rx.Observable.timer(0, 1000)
    .map(i => `Seconds elapsed ${i}`)
}

function DOMEffect(text$) {
// Effects: change the external world (imperative)
  text$.subscribe(text => {
    const container = document.querySelector('#app')
    container.textContent = text
  })
}

function consoleLogEffect(msg$) {
  msg$.subscribe(msg => console.log(msg))
}

const sink = main()
DOMEffect(sink)
consoleLogEffect(sink)
