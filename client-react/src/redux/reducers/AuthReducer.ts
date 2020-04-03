import { Type } from '../actions/Types'

export type State = typeof initialState;
const initialState = {
  loggedIn: false,
  authToken: '',
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
  authToken: string;
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
        authToken: '',
        loginErrorMessage: action.payload,
        loginLoading: false,
      }
    case Type.LOGIN_SUCCEEDED:
      return {
        ...state,
        authToken: action.payload,
        loginErrorMessage: '',
        loginLoading: false,
        loggedIn: true,
      }
    case Type.LOGOUT:
      return {
        ...state,
        authToken: '',
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
        authToken: '',
        registrationErrorMessage: action.payload,
        registrationLoading: false,
      }
    case Type.REGISTER_SUCCEEDED:
      return {
        ...state,
        authToken: action.payload,
        registrationErrorMessage: '',
        registrationLoading: false,
        loggedIn: true,
      }
    default:
      return state
  }
}
