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

export type GameType = {
  data: {
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
      const res = await axios.post('http://localhost:5000/game/', {activeCoins, endsOn, startingCash, title});
      const action: any = push(`/game/${res.data.id}`);
      dispatch(action);
    } catch (e) {
      handleAxiosError(e, dispatch, Type.CREATE_GAME_FAILED);
    }
  }
}

// get game by game ID
export const getGame = (
  id: number
) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      // FIXME - dispatching dummy data until backend endpoint is up
      // const res = await axios.get(`http://localhost:5000/game/get_game/${id}`);
      const res: GameType = {
        data: {
          name: 'Sam\'s game 1',
          startingCash: '10000.00',
          shareableLink: 'http://localhost:5000/game/78da4a0b-0381-4d6f-a487-89ce3866e365',
          shareableCode: 'OWCO',
          endsAt: new Date(),
        }
      }
      dispatch({type: Type.SET_GAME, payload: res});
    } catch (e) {
      handleAxiosError(e, dispatch, Type.SET_GAME_FAILED);
    }
  }
}
