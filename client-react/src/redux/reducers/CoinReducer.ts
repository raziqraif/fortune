import { Type } from '../actions/Types'
import { CoinsAndPrices } from '../actions/Coins';

export type CoinState = typeof initialState;
export type Coin = {
  id: string;
  name: string;
}
const initialState = {
  simpleCoins: [] as Array<{id: string, name: string}>,
  coins: [] as CoinsAndPrices,
}

export type Action = {
  type: Type;
  payload?: any;
}

type currentPrice = {
  price_change_day_pct: string,
  coin: {
    id: number,
    name: string,
    symbol: string
  },
  captured_at: string,
  id: number,
  price: string,
}

// This is only a transfer type, should only be used to add
// websocket information to the coins array.
export type currentPricesType = Array<currentPrice>


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
        coins: action.payload.coins_and_prices,
      }
    case Type.SET_CURRENT_PRICES:
      return setCurrentPrices(state, action.payload);
    case Type.ZERO_COIN_AMOUNT:
      var newCoins = state.coins.map((coin) => {
        coin.coin.number = "0";
        return coin;
      })
      return {
        ...state,
        coins: newCoins,
      }
    case Type.LOGOUT:
      return initialState
    default:
      return state;
  }
}

const setCurrentPrices = (state = initialState, currentPrices: currentPricesType) => {
  let previousCoins = state.coins;
  if (!previousCoins) {
    previousCoins = [];
  }
  const newCoins = previousCoins.map(coinAndPrices => {
    const newPrice = currentPrices.find(
      (currentPrice: currentPrice) => {
        return currentPrice.coin.id === coinAndPrices.coin.id;
      }
    );
    if (newPrice) {
      coinAndPrices.prices.unshift({
        price: parseFloat(newPrice.price),
        captured_at: new Date(newPrice.captured_at),
        price_change_day_pct: newPrice.price_change_day_pct,
        id: newPrice.id.toString()
      })
    }
    return coinAndPrices;
  })
  return {
    ...state,
    coins: newCoins,
  }
}
