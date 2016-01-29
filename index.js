const Rx = require('rx')

// Logic: Event stream (functional)
function main(sources) {
  const click$ = sources.DOM
  const sinks = {
    DOM: click$
      .startWith(null)
      .flatMapLatest(() =>
        Rx.Observable.timer(0, 1000)
          .map(i => `Seconds elapsed ${i}`)
      ),
    Log: Rx.Observable.timer(0, 2000).map(i => 2 * i),
  }
  return sinks
}

// source: input (read) effects
// sink: output (write) effects

function DOMDriver(text$) {
// Drivers: change the external world (imperative)
  text$.subscribe(text => {
    const container = document.querySelector('#app')
    container.textContent = text
  })

  const DOMSource = Rx.Observable.fromEvent(document, 'click')
  return DOMSource
}

function consoleLogDriver(msg$) {
  msg$.subscribe(msg => console.log(msg))
}

// a = f(b)
// b = g(a)
function run(mainFn, drivers) {
  const proxySources = {}
  Object.keys(drivers).forEach(key => {
    proxySources[key] = new Rx.Subject()
  })
  const sinks = mainFn(proxySources)

  Object.keys(drivers).forEach(key => {
    const source = drivers[key](sinks[key])
    source.subscribe(x => proxySources[key].onNext(x))
  })
}

const drivers = {
  DOM: DOMDriver,
  Log: consoleLogDriver,
}

run(main, drivers)
