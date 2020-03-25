import { Type } from './Types'
import axios from 'axios'
import { Dispatch } from 'redux'
import { Action } from '../reducers/AuthReducer'


export const getAllCoins = () => {
  return async (dispatch: Dispatch<Action>) => {
    // replace this with an api module assumedly
    // const res = await axios.post('/api/login', {email, password})
    // just an example
    const res = await axios.get('http://localhost:5000/game/coins')
    dispatch({type: Type.SET_COINS, payload: res.data})
  }
}