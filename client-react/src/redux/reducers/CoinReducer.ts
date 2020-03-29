import { Type } from '../actions/Types'

export type CoinState = typeof initialState;
const initialState = {
  coins: [] as Array<{ id: string, name: string, symbol:string}>,
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
