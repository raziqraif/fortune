import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';
import * as H from 'history';

import AuthReducer, { Auth } from './AuthReducer';

export type RootState = {
  router: any;
  auth: Auth;
}

const rootReducer = (history: H.History) => combineReducers({
  router: connectRouter(history),
  auth: AuthReducer,
})

export default rootReducer;

