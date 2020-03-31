import axios from 'axios'
import { Dispatch } from 'redux'
import { Action } from '../reducers/AuthReducer'
import {Type} from './Types'
import {push} from 'connected-react-router'
import {handleAxiosError} from './Utils'
import { fetchAuthToken } from './Auth'

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

export type GameDataType = {
  name: string;
  startingCash: string;
  shareableLink: string;
  shareableCode: string;
  endsAt?: Date;
}

export type GetGameResponse = {
  data: {
    game: GameType,
    gameProfile: {
      cash: string;
    }
    coins: Array<{
      id: string;
      name: string;
      symbol: string;
      number: string;
    }>
  }
}

export type GameType = {
  data: GameDataType,
  gameProfile: {
    cash: string,
    netWorth: string,
  },
  coins: Array<{
    id: string;
    name: string;
    symbol: string;
    number: number;
  }>
}

export const createGame = (
    activeCoins: Array<{ id: string, name: string }>,
    endsOn: Date,
    startingCash: string,
    title: string
) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      await fetchAuthToken();
      const res: CreateGameResponse = await axios.post('http://localhost:5000/game/', {activeCoins, endsOn, startingCash, title});
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
      await fetchAuthToken();
      const res = await axios.get(`http://localhost:5000/game/${id}`);

      dispatch({type: Type.SET_GAME, payload: res.data.game});
      dispatch({type: Type.SET_GAME_COINS, payload: res.data.coins});
      dispatch({type: Type.SET_GAME_PROFILE, payload: res.data.gameProfile});
    } catch (e) {
      handleAxiosError(e, dispatch, Type.SET_GAME_FAILED);
    }
  }
}

// liquify
export const liquify = () => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      await fetchAuthToken();
      const res = await axios.get(`http://localhost:5000/game/liquify`);

      // I'm thinking this method's response will contain a player's new gameProfile and gameCoins after liquifying
      dispatch({type: Type.SET_GAME_COINS, payload: res.data.coins});
      dispatch({type: Type.SET_GAME_PROFILE, payload: res.data.gameProfile});
    } catch (e) {
      handleAxiosError(e, dispatch, Type.LIQUIFY_FAILED);
    }
  }
}

// transaction type will either be "buy" or "sell"
export const transaction = (
  amount: string,
  type: string,
) => {
  return async (dispatch: Dispatch<Action>) => {
    console.log(amount)
    console.log(type)
    try {
      await fetchAuthToken();
      const res = await axios.post(`http://localhost:5000/game/${type}`, {amount});

      dispatch({type: Type.TRANSACTION});
      dispatch({type: Type.SET_GAME_COINS, payload: res.data.coins});
      dispatch({type: Type.SET_GAME_PROFILE, payload: res.data.gameProfile});
    } catch (e) {
      handleAxiosError(e, dispatch, Type.TRANSACTION_FAILED);
    }
  }
}

// clear all error messages
// used when a user cannot complete a transaction, but tries to make another
export const clearErrorMessages = () => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({type: Type.CLEAR_ERRORS});
  }
}
