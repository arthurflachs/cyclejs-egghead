const Rx = require('rx')

// Logic: Event stream (functional)
Rx.Observable.timer(0, 1000)
  .map(i => `Seconds elapsed ${i}`)

// Effects: change the external world (imperative)
  .subscribe(text => {
    const container = document.querySelector('#app')
    container.textContent = text
  })
