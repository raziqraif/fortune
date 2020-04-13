import { Type } from '../actions/Types'
import {GameType} from '../actions/Game'

export type State = typeof initialState;
const initialState = {
  notifications: [],
  pages: 0,
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
  pages: number;
}

export default (state = initialState, action: Action) => {
    switch (action.type) {
        case Type.GET_NOTIFICATIONS_SUCCEEDED:
          console.log(action.payload)
            return {
                ...state,
                notifications: action.payload.notifications,
                pages: action.payload.pages,
            }
    default:
        return state
  }
}
