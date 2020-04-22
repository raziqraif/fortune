import { Type } from '../actions/Types'

export type State = typeof initialState;
const initialState = {
  pending: [],
  list: [],
}

export type FriendsState = {
  pending: Array<Friend>;
  list: Array<Friend>;
}

type FriendsRequest = {
  requester: string;
  requestee: string;
  status: number;
}

export type Friend = {
  username: string;
}

export type Action = {
  type: Type;
  payload?: any;
}

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case Type.SET_FRIEND_REQUEST:
      return state;
      case Type.ACCEPT_FRIEND_REQUEST:
        return state;
    case Type.FRIEND_FAILED:
      return state;
    case Type.GET_PENDING:
      return {
        ...state,
        pending: action.payload.pending
      }
    default:
      return state;
  }
}