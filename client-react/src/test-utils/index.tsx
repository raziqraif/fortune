import React from 'react'
import {createMemoryHistory} from 'history'
import {render} from '@testing-library/react'
import thunk from 'redux-thunk'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware, compose} from 'redux'
import {ConnectedRouter, routerMiddleware} from 'connected-react-router'
import reducers from '../redux/reducers'


/**
 * This served as inspiration to this function, and was borrowed from:
 * https://github.com/kentcdodds/react-testing-library-examples/blob/master/src/__tests__/react-router.js#L35
 */
export function deeplyRenderComponentWithRedux(jsx: React.ReactElement) {
  const history = createMemoryHistory({initialEntries: ['/']})
  const store = createStore(
    reducers(history),
    compose(applyMiddleware(routerMiddleware(history), thunk))
  )
  return {
    ...render(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          {jsx}
        </ConnectedRouter>
      </Provider>
    ),
    store,
  }
}

