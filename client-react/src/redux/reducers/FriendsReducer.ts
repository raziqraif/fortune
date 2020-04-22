import { Type } from '../actions/Types'

export type State = typeof initialState;
const initialState = {
  requester: '',
  requestee: '',
  status: '',
}

export type FriendsState = {
  requester: string;
  requestee: string;
  status: number;
}

export type Action = {
  type: Type;
  payload?: any;
}

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case Type.SET_FRIEND_REQUEST:
      return action.payload;
      case Type.ACCEPT_FRIEND_REQUEST:
        return action.payload;
    case Type.FRIEND_FAILED:
      return initialState;
    default:
      return state;
  }
}