import { Type } from './Types'
import axios from 'axios'
import { Dispatch } from 'redux'
import { Action } from '../reducers/AuthReducer'
import {fetchAuthToken} from "./Auth";
import {handleAxiosError} from "./Utils";

type Coin = {
  id: string;
  name: string;
  symbol: string;
  number: number;
}

type Ticker = {
  price: number;
  captured_at: Date;
}

type CoinAndPrices = {
  coin: Array<Coin>;
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