import { Type } from '../actions/Types'
import { CoinsAndPrices } from '../actions/Coins';

export type CoinState = typeof initialState;
const initialState = {
  simpleCoins: [] as Array<{id: string, name: string}>,
  coins: [] as CoinsAndPrices,
  currentPrices: [] as currentPricesType,
  oneDayTickers: [] as Array<{ tickers: currentPricesType }>
}

export type Action = {
  type: Type;
  payload?: any;
}

export type currentPricesType =
  Array<{
    price_change_day_pct: string,
    coin: {
      id: number,
      name: string,
      symbol: string
    },
    captured_at: string,
    id: number,
    price: string,
}>


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
    case Type.SET_CURRENT_PRICES:
      return {
        ...state,
        currentPrices: action.payload,
      }
    case Type.SET_ONEDAY_TICKERS:
      return {
        ...state,
        oneDayTickers: action.payload,
      }
    default:
      return state
  }
}
