import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {createBrowserHistory} from 'history'
import thunk from 'redux-thunk'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware, compose} from 'redux'
import {ConnectedRouter, routerMiddleware} from 'connected-react-router'
import reducers from './redux/reducers'

const history = createBrowserHistory()
const store = createStore(
  reducers(history),
  compose(applyMiddleware(routerMiddleware(history), thunk))
)

const Entrypoint = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App/>
      </ConnectedRouter>
    </Provider>
  )
}

ReactDOM.render(<Entrypoint />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
