import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';
import * as H from 'history';

import AuthReducer, { Auth } from './AuthReducer';
import CoinReducer, { CoinState } from './CoinReducer';

export type RootState = {
  router: any;
  auth: Auth;
  coins: CoinState;
}

const rootReducer = (history: H.History) => combineReducers({
  router: connectRouter(history),
  auth: AuthReducer,
  coins: CoinReducer
})

export default rootReducer;

