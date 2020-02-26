import { Type } from './Types'
import axios from 'axios'
import { Dispatch } from 'redux'
import { Action } from '../reducers/AuthReducer'


export const getAllCoins = () => {
  return async (dispatch: Dispatch<Action>) => {
    // replace this with an api module assumedly
    // const res = await axios.post('/api/login', {email, password})
    // just an example
    const tempCoins = [
        {
            id: "1",
            name: "Bitcoin"
        },
        {
            id: "2",
            name: "Etherium"
        },
        {
            id: "3",
            name: "Coin 3"
        },
        {
            id: "4",
            name: "Coin 4"
        },
        {
            id: "5",
            name: "Coin 5"
        },
        {
            id: "6",
            name: "Coin 6"
        },
    ]
    dispatch({type: Type.SET_COINS, payload: tempCoins})
  }
}