import { Type } from '../actions/Types'
import { CoinsAndPrices } from '../actions/Coins';

export type CoinState = typeof initialState;
const initialState = {
  simpleCoins: [] as Array<{id: string, name: string}>,
  coins: [] as CoinsAndPrices,
}

export type Action = {
  type: Type;
  payload?: any;
}

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case Type.SET_SIMPLE_COINS:
      return {
        ...state,
        simpleCoins: action.payload,
      }
    case Type.SET_COINS:
      return {
        ...state,
        coins: action.payload,
      }
    default:
      return state
  }
}
