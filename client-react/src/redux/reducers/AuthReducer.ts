import { Type } from '../actions/Types'

export type State = typeof initialState;
const initialState = {
  loggedIn: false,
}

export type Action = {
  type: Type;
  payload?: any;
}

export type Auth = {
  loggedIn: boolean;
}

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case Type.SET_SIGNIN_STATUS:
      return {
        ...state,
        loggedIn: action.payload,
      }
    default:
      return state
  }
}
