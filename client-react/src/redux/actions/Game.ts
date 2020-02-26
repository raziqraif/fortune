import { Type } from './Types'
import axios from 'axios'
import { Dispatch } from 'redux'
import { Action } from '../reducers/AuthReducer'


export const createGame = (
    activeCoins: Array<{ id: string, name: string }>,
    endsOn: Date,
    startingCash: string,
    title: string
) => {
  return async () => {
    const res = await axios.post('http://localhost:5000/game/new_game', {activeCoins, endsOn, startingCash, title});
  }
}
