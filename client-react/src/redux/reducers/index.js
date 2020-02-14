import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';

import authReducer from './authReducer';

export default history => combineReducers({
  router: connectRouter(history),
  auth: authReducer,
})
