import { Type } from '../actions/Types'

export type State = typeof initialState;
const initialState = {
  createGameErrorMessage: '',
  createGameLoading: false,
  game: {},
  setGameErrorMessage: ''
}

export type Action = {
  type: Type;
  payload?: any;
}

export type GameState = {
  createGameErrorMessage: string;
  createGameLoading: boolean;
  game: object;
  setGameErrorMessage: string;
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
    case Type.SET_GAME:
      return {
        ...state,
        game: action.payload,
        setGameErrorMessage: '',
      }
    case Type.SET_GAME_FAILED:
      return {
        ...state,
        setGameErrorMessage: action.payload,
      }
    default:
      return state
  }
}
