import { Type } from '../actions/Types'

export type CoinState = typeof initialState;
const initialState = {
  coins: [] as Array<{ id: string, name: string, symbol:string }>,
}

export type Action = {
  type: Type;
  payload?: any;
}

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case Type.SET_COINS:
      return {
        ...state,
        coins: action.payload,
      }
    default:
      return state
  }
}
