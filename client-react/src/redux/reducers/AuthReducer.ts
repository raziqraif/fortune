import { Type } from '../actions/Types'

export type State = typeof initialState;
const initialState = {
  loggedIn: false,
}

export type Action = {
  type: Type;
  payload?: any;
  error?: string;
}

export type Auth = {
  loggedIn: boolean;
  registrationErrorMessage: string;
  loginErrorMessage: string;
}

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case Type.SET_SIGNIN_STATUS:
      return {
        ...state,
        loginErrorMessage: action.error,
        loggedIn: action.payload,
      }
    case Type.SET_REGISTRATION_STATUS: {
      if (!action.hasOwnProperty('payload')) {
        return {
          ...state,
          registrationErrorMessage: action.error,
        }
      }
      return {
        ...state,
        registrationErrorMessage: action.error,
        loggedIn: action.payload,
      }
    }
    default:
      return state
  }
}
