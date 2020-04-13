import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';
import * as H from 'history';

import AuthReducer, { Auth } from './AuthReducer';
import CoinReducer, { CoinState } from './CoinReducer';
import GameReducer, { GameState } from './GameReducer';
import PlayReducer, { PlayState } from "./PlayReducer";

export type RootState = {
  router: any;
  auth: Auth;
  coins: CoinState;
  game: GameState;
  play: PlayState;
}

const rootReducer = (history: H.History) => combineReducers({
  router: connectRouter(history),
  auth: AuthReducer,
  coins: CoinReducer,
  game: GameReducer,
  play: PlayReducer,
});

export default rootReducer;

