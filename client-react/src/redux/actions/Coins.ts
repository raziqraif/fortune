import { Type } from './Types'
import axios from 'axios'
import { Dispatch } from 'redux'
import { Action } from '../reducers/AuthReducer'
import {fetchAuthToken} from "./Auth";
import {handleAxiosError} from "./Utils";
import { currentPricesType } from '../reducers/CoinReducer';

type Coin = {
  id: string;
  name: string;
  symbol: string;
  number: string;
}

type Ticker = {
  price: number;
  captured_at: Date;
  price_change_day_pct: string;
  id: string;
}

type CoinAndPrices = {
  coin: Coin;
  prices: Array<Ticker>
}

export type CoinsAndPrices = Array<CoinAndPrices>;

export const getAllCoins = () => {
  return async (dispatch: Dispatch<Action>) => {
    // replace this with an api module assumedly
    // const res = await axios.post('/api/login', {email, password})
    // just an example
    const res = await axios.get('http://localhost:5000/game/coins')
    dispatch({type: Type.SET_SIMPLE_COINS, payload: res.data})
  }
}

/* usage:
timeSpan:
0 - 1 hr
1 - 1 day
2 - 1 week
3 - 4 weeks
4 - 1 year
sortBy:
0 - default
1 - coin name ascending (a-z)
2 - coin name descending (z-a)
3 - price descending (high-low)
4 - price ascending (low-high)
*/
export const getAllCoinsForGame = (
  gameId: number,
  timeSpan: number = 1,
  sortBy: number = 0,
  pageNum: number = 1,
  numPerPage: number = 25) => {
  return async (dispatch: Dispatch<Action>) => {
      try {
          await fetchAuthToken()  // TODO: Remove this if no authentication is required for this API. Eg, if non
          // logged-in players can still view the global game
          const res = await axios.get(
              'http://localhost:5000/game/' + gameId + '/coins',
              { params: { timeSpan, sortBy, numPerPage, pageNum } }
          );
          dispatch({type: Type.SET_COINS, payload: res.data});  // TODO: Is this the correct type?
          console.log("Coin result:", res);
    } catch (e) {
          handleAxiosError(e, dispatch, Type.SET_COINS)   // TODO: Use the correct type
      }
  }
};

export const setCurrentPrices = (payload: currentPricesType) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({type: Type.SET_CURRENT_PRICES, payload });
  }
}
