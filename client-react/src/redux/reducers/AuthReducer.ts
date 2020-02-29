import { Type } from '../actions/Types'

export type State = typeof initialState;
const initialState = {
  loggedIn: false,
  registrationErrorMessage: '',
  registrationLoading: false,
  loginErrorMessage: '',
  loginLoading: false,
}

export type Action = {
  type: Type;
  payload?: any;
}

export type Auth = {
  loggedIn: boolean;
  registrationErrorMessage: string;
  registrationLoading: boolean;
  loginErrorMessage: string;
  loginLoading: boolean;
}

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case Type.LOGIN:
      return {
        ...state,
        loginErrorMessage: '',
        loginLoading: true,
      }
    case Type.LOGIN_FAILED:
      return {
        ...state,
        loginErrorMessage: action.payload,
        loginLoading: false,
      }
    case Type.LOGIN_SUCCEEDED:
      return {
        ...state,
        loginErrorMessage: '',
        loginLoading: false,
        loggedIn: true,
      }
    case Type.LOGOUT:
      return {
        ...state,
        loggedIn: false,
      }
    case Type.REGISTER:
      return {
        ...state,
        registrationErrorMessage: '',
        registrationLoading: true,
      }
    case Type.REGISTER_FAILED:
      return {
        ...state,
        registrationErrorMessage: action.payload,
        registrationLoading: false,
      }
    case Type.REGISTER_SUCCEEDED:
      return {
        ...state,
        registrationErrorMessage: '',
        registrationLoading: false,
        loggedIn: true,
      }
    default:
      return state
  }
}
