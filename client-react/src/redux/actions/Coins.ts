import { Type } from './Types'
import axios from 'axios'
import { Dispatch } from 'redux'
import { Action } from '../reducers/AuthReducer'
import { currentPricesType } from '../reducers/CoinReducer'

export const getAllCoins = () => {
  return async (dispatch: Dispatch<Action>) => {
    // replace this with an api module assumedly
    // const res = await axios.post('/api/login', {email, password})
    // just an example
    const res = await axios.get('http://localhost:5000/game/coins')
    dispatch({type: Type.SET_COINS, payload: res.data})
  }
}

export const get24hrTickers = () => {
  return async (dispatch: Dispatch<Action>) => {
    const res = await axios.get('http://localhost:5000/tickers/1d')
    dispatch({type: Type.SET_ONEDAY_TICKERS, payload: res.data})
  }
}

export const setCurrentPrices = (payload: currentPricesType) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({type: Type.SET_CURRENT_PRICES, payload });
  }
}
