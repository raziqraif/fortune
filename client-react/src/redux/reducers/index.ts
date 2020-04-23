import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';
import * as H from 'history';

import AuthReducer, { Auth } from './AuthReducer';
import CoinReducer, { CoinState } from './CoinReducer';
import FriendsReducer, { FriendsState } from './FriendsReducer';
import GameReducer, { GameState } from './GameReducer';
import NotificationsReducer, { NotificationState } from './NotificationsReducer';
import PlayReducer, { PlayState } from "./PlayReducer";
import AchievementReducer, { AchievementState } from './AchievementReducer';

export type RootState = {
  router: any;
  auth: Auth;
  coins: CoinState;
  friends: FriendsState;
  game: GameState;
  notifications: NotificationState;
  play: PlayState;
  achievement: AchievementState;
}

const rootReducer = (history: H.History) => combineReducers({
  router: connectRouter(history),
  auth: AuthReducer,
  coins: CoinReducer,
  friends: FriendsReducer,
  game: GameReducer,
  notifications: NotificationsReducer,
  play: PlayReducer,
  achievement: AchievementReducer,
});

export default rootReducer;

