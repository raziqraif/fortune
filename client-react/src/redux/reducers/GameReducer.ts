import { Type } from '../actions/Types'
import {GameType} from '../actions/Game'

export type State = typeof initialState;
const initialState = {
  createGameErrorMessage: '',
  createGameLoading: false,
  game: {
    data: {
      name: '',
      startingCash: '',
      shareableLink: '',
      shareableCode: '',
      endsAt: new Date()
    },
    gameProfile: {
      cash: ''
    },
    coins: [],
  },
  setGameErrorMessage: ''
}

export type Action = {
  type: Type;
  payload?: any;
}

export type GameState = {
  createGameErrorMessage: string;
  createGameLoading: boolean;
  game: {
    data: GameType,
    gameProfile: {
      cash: string;
    }
    coins: Array<{
      id: string;
      name: string;
      symbol: string;
      number: number;
    }>
  };
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
        game: {
          ...state.game,
          data: {
            endsAt: action.payload.ends_at,
            name: action.payload.name,
            shareableCode: action.payload.shareable_code,
            shareableLink: action.payload.shareable_link,
            startingCash:  action.payload.starting_cash,
          }
        },
        setGameErrorMessage: '',
      }
    case Type.SET_GAME_FAILED:
      return {
        ...state,
        setGameErrorMessage: action.payload,
      }
    case Type.SET_GAME_PROFILE:
      return {
        ...state,
        game: {
          ...state.game,
          gameProfile: action.payload,
        },
      }
    case Type.SET_GAME_COINS:
        return {
          ...state,
          game: {
            ...state.game,
            coins: action.payload,
          }
        }
    case Type.LIQUIFY_FAILED:
      return state;
    default:
      return state
  }
}
