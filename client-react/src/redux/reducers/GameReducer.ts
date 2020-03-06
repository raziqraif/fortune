import { Type } from '../actions/Types'

export type State = typeof initialState;
const initialState = {
  createGameErrorMessage: '',
  createGameLoading: false,
}

export type Action = {
  type: Type;
  payload?: any;
}

export type GameState = {
  createGameErrorMessage: string;
  createGameLoading: boolean;
  registrationLoading: boolean;
  loginErrorMessage: string;
  loginLoading: boolean;
}

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case Type.CREATE_GAME:
      return {
        ...state,
        createGameErrorMessage: '',
        createGameLoading: true,
      }
    case Type.CREATE_GAME_FAILED:
      return {
        ...state,
        createGameErrorMessage: action.payload,
        createGameLoading: false,
      }
    default:
      return state
  }
}
