import { Type } from '../actions/Types'

export type State = typeof initialState;
const initialState = {
  pending: [],
  friendsList: [],

  pendingErrorMessage: '',
  listErrorMessage: '',
}

export type FriendsState = {
  pending: Array<Friend>;
  friendsList: Array<Friend>;
  errorMessage: string;
  listErrorMessage: string;
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
        return {
          ...state,
          friendsList: action.payload
        };
    case Type.FRIEND_FAILED:
      return state;
    case Type.GET_PENDING:
      return {
        ...state,
        pending: action.payload.pending
      }
    case Type.GET_FRIENDS:
      return {
        ...state,
        friendsList: action.payload
      }
    case Type.GET_PENDING_FAILED:
      return {
        ...state,
        pendingErrorMessage: action.payload
      }
    case Type.GET_LIST_FAILED:
      return {
        ...state,
        listErrorMessage: action.payload
      }
    default:
      return state;
  }
}