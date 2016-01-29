const Rx = require('rx')
const Cycle = require('@cycle/core')
const CycleDOM = require('@cycle/dom')
const h1 = CycleDOM.h1
const span = CycleDOM.span
const makeDOMDriver = CycleDOM.makeDOMDriver

// Logic: Event stream (functional)
function main(sources) {
  return  {}
}

const drivers = {
  DOM: makeDOMDriver('#app'),
}

Cycle.run(main, drivers)
