function h(tagName, children) {
  return {
    tagName: tagName,
    children: children,
  }
}

const h1 = h.bind(null, 'H1')
const span = h.bind(null, 'SPAN')

const Rx = require('rx')
const Cycle = require('@cycle/core')

// Logic: Event stream (functional)
function main(sources) {
  const mouseover$ = sources.DOM.selectEvents('span', 'mouseover')

  const sinks = {
    DOM: mouseover$
      .startWith(null)
      .flatMapLatest(() =>
        Rx.Observable.timer(0, 1000)
        .map(i => h1([
          span([
            `Seconds elapsed ${i}`
          ])
        ]))
      ),
    Log: Rx.Observable.timer(0, 2000).map(i => 2 * i),
  }
  return sinks
}

// Drivers: change the external world (imperative)
function DOMDriver(obj$) {
  function createElement(obj) {
    const element = document.createElement(obj.tagName)

    const child = obj.children
      .forEach(c => {
        if (typeof c === 'object') {
          element.appendChild(createElement(c))
          return c;
        }
        element.innerHTML += c
        return c
      })

    return element
  }

  obj$.subscribe(obj => {
    const container = document.querySelector('#app')
    container.innerHTML = ''
    const element = createElement(obj)
    container.appendChild(element)
  })

  const DOMSource = {
    selectEvents: function(tagName, eventType) {
      return Rx.Observable.fromEvent(document, eventType)
        .filter(ev => ev.target.tagName === tagName.toUpperCase())
    }
  }
  return DOMSource
}

function consoleLogDriver(msg$) {
  msg$.subscribe(msg => console.log(msg))
}

const drivers = {
  DOM: DOMDriver,
  Log: consoleLogDriver,
}

Cycle.run(main, drivers)
