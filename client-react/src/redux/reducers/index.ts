import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';
import * as H from 'history';

import AuthReducer, { Auth } from './AuthReducer';
import CoinReducer, { CoinState } from './CoinReducer';
import GameReducer, { GameState } from './GameReducer';
import NotificationsReducer, { NotificationState } from './NotificationsReducer';

export type RootState = {
  router: any;
  auth: Auth;
  coins: CoinState;
  game: GameState;
  notifications: NotificationState;
}

const rootReducer = (history: H.History) => combineReducers({
  router: connectRouter(history),
  auth: AuthReducer,
  coins: CoinReducer,
  game: GameReducer,
  notifications: NotificationsReducer,
})

export default rootReducer;

