import { Type } from '../actions/Types'
import {GameType} from '../actions/Game'

export type State = typeof initialState;
const initialState = {
  notifications: [],
  pages: 0,
  priceAlerts: [],
}

export type NotificationState = {
  notifications: Array<Notification>;
  pages: number;
  priceAlerts: Array<PriceAlert>;
}

export type Action = {
  type: Type;
  payload?: any;
}

export type Notification = {
    id: number;
    content: string;
    createdAt: Date;
}

export type PriceAlert = {
  id: number;
  createdAt: Date;
  above: boolean;
  coinId: number;
  strikePrice: number;
  hit: boolean;
}

export default (state = initialState, action: Action) => {
    switch (action.type) {
        case Type.GET_NOTIFICATIONS_SUCCEEDED:
            return {
                ...state,
                notifications: action.payload.notifications,
                pages: action.payload.pages,
            }
        case Type.GET_PRICE_ALERTS_SUCCEEDED:
            return {
                ...state,
                priceAlerts: action.payload,
            }
        case Type.LOGOUT:
            return initialState
    default:
        return state
  }
}
