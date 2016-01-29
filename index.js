const Rx = require('rx')
const Cycle = require('@cycle/core')
const CycleDOM = require('@cycle/dom')
const h1 = CycleDOM.h1
const span = CycleDOM.span
const makeDOMDriver = CycleDOM.makeDOMDriver

// Logic: Event stream (functional)
function main(sources) {
  const mouseover$ = sources.DOM.select('.foo').events('mouseover')

  const sinks = {
    DOM: mouseover$
      .startWith(null)
      .flatMapLatest(() =>
        Rx.Observable.timer(0, 1000)
        .map(i => h1({style: {background: 'red'}}, [
          span([
            `Seconds elapsed ${i}`
          ])
        ]))
      ),
    Log: Rx.Observable.timer(0, 2000).map(i => 2 * i),
  }
  return sinks
}

function consoleLogDriver(msg$) {
  msg$.subscribe(msg => console.log(msg))
}

const drivers = {
  DOM: makeDOMDriver('#app'),
  Log: consoleLogDriver,
}

Cycle.run(main, drivers)
