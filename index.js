import Rx from 'rx'
import Cycle from '@cycle/core'
import { button, h1, h4, a, div, makeDOMDriver } from '@cycle/dom'
import { makeHTTPDriver } from '@cycle/http'

function main(sources) {
  const url = 'http://jsonplaceholder.typicode.com/users/1'
  const clickEvent$ = sources.DOM
    .select('.get-first')
    .events('click')
  const request$ = clickEvent$.map(() => {
    return {
      url: url,
      method: 'GET',
    }
  })

  const response$$ = sources.HTTP
    .filter(response$ => response$.request.url === url)
  const response$ = response$$.switch()
  const firstUser$ = response$
    .map(response => response.body)
    .startWith(null)

  return {
    DOM: firstUser$.map(firstUser => div([
      button('.get-first', 'Get first user'),
      firstUser === null ? null : div('.user-details', [
        h1('.user-name', firstUser.name),
        h4('.user-email', firstUser.email),
        a('.user-website', { href: firstUser.website }, firstUser.website),
      ]),
    ])),
    HTTP: request$,
  }
}



const drivers = {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver(),
}

Cycle.run(main, drivers)
