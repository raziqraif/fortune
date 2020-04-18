import { Type } from '../actions/Types'

export type State = typeof initialState;
const initialState = {
  username: '' as string | undefined,
  profileId: 0 as number | undefined,
  loggedIn: false,
  registrationErrorMessage: '',
  registrationLoading: false,
  loginErrorMessage: '',
  loginLoading: false,
  usernameErrorMessage: '',
  passwordErrorMessage: '',
  passwordSuccessMessage: '',
}

export type Action = {
  type: Type;
  payload?: any;
}

export type Auth = {
  username: string | undefined;
  profileId: number | undefined;
  loggedIn: boolean;
  registrationErrorMessage: string;
  registrationLoading: boolean;
  loginErrorMessage: string;
  loginLoading: boolean;
  usernameErrorMessage: string;
  passwordErrorMessage: string;
  passwordSuccessMessage: string;
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
    case Type.VERIFY_AUTH_TOKEN_SUCCEEDED:
      return {
        ...state,
        username: action.payload.username,
        profileId: action.payload.id,
      }
    case Type.CHANGE_USERNAME_SUCCEEDED:
      return {
        ...state,
        username: action.payload.username,
        usernameErrorMessage: ''
      }
    case Type.SET_CHANGE_USERNAME_FAILED:
      return {
        ...state,
        usernameErrorMessage: action.payload
      }
    case Type.CHANGE_PASSWORD_SUCCEEDED:
      return {
        ...state,
        passwordSuccessMessage: 'Password change successful',
        passwordErrorMessage: '',
      }
    case Type.SET_CHANGE_PASSWORD_FAILED:
      return {
        ...state,
        passwordSuccessMessage: '',
        passwordErrorMessage: action.payload,
      }
    default:
      return state
  }
}
