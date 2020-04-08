import { Type } from '../actions/Types'
import {GameType} from '../actions/Game'

export type State = typeof initialState;
const initialState = {
  notifications: []
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

export type NotificationState = {
  notifications: Array<Notification>;
}

export default (state = initialState, action: Action) => {
    switch (action.type) {
        case Type.GET_NOTIFICATIONS_SUCCEEDED:
            return {
                ...state,
                notifications: action.payload,
            }
    default:
        return state
  }
}
