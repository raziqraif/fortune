import axios from 'axios'
import { Dispatch } from 'redux'
import { Action } from '../reducers/AuthReducer'
import {Type} from './Types'
import {push} from 'connected-react-router'
import {handleAxiosError} from './Utils'

type CreateGameResponse = {
  data: {
    id: number;
    name: string;
    startingCash: string;
    shareableLink: string;
    shareableCode: string;
    endsAt: Date;
  }
}

export const createGame = (
    activeCoins: Array<{ id: string, name: string }>,
    endsOn: Date,
    startingCash: string,
    title: string
) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const res = await axios.post('http://localhost:5000/game/', {activeCoins, endsOn, startingCash, title})
      const action: any = push(`/game/${res.data.id}`)
      dispatch(action)
    } catch (e) {
      handleAxiosError(e, dispatch, Type.CREATE_GAME_FAILED)
    }
  }
}

// get game by game ID
export const getGame = (
  id: number
) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      const res = await axios.get(`http://localhost:5000/game/get_game/${id}`)
      dispatch({type: Type.SET_GAME, payload: res.data})
    } catch (e) {
      handleAxiosError(e, dispatch, Type.SET_GAME_FAILED)
    }
  }
}
