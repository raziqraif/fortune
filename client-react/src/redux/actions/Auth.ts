import { Type } from './Types'
import axios from 'axios'
import { Dispatch } from 'redux'
import { Action } from '../reducers/AuthReducer'
import {push} from 'connected-react-router'

import {handleAxiosError} from './Utils'


type AuthTokenResponse = {
  data: {
    token: string,
    issued_at: Date,
  }
}

type ChangeUsernameResponse = {
  data: {
    username: string
  }
}

function persistToken(token: string) {
  axios.defaults.headers.common['AUTHORIZATION'] = `Bearer ${token}`
  localStorage.setItem('token', token)
}

async function fetchToken() {
  const token = await localStorage.getItem('token')
  axios.defaults.headers.common['AUTHORIZATION'] = `Bearer ${token}`
  return token
}

export const login = (username: string, password: string) => {
  return async (dispatch: Dispatch<Action>) => {
    // replace this with an api module assumedly
    // const res = await axios.post('/api/login', {email, password})
    // just an example
    dispatch({type: Type.LOGIN})
    let res: AuthTokenResponse
    try {
      // TODO please don't hard-code this, we're working on getting nginx with
      // docker
      res = await axios.post('http://localhost:5000/auth/login', {username, password})
      persistToken(res.data.token)
      dispatch({type: Type.LOGIN_SUCCEEDED, payload: true})
      dispatch(verifyToken() as any);
      const pushAction: any = push('/')
      dispatch(pushAction)
    } catch (e) {
      handleAxiosError(e, dispatch, Type.LOGIN_FAILED)
    }
  }
}

export const logout = () => {
  return async (dispatch: Dispatch<Action>) => {
    // TODO remove token from localStorage and send to backend to delete
    localStorage.removeItem('token')
    dispatch({type: Type.LOGOUT})
  }
}

export const register = (username: string, password: string) => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({type: Type.REGISTER})
    let res: AuthTokenResponse
    try {
      res = await axios.post('http://localhost:5000/auth/register', {username, password})
      persistToken(res.data.token)
      dispatch({type: Type.REGISTER_SUCCEEDED, payload: true})
      dispatch(verifyToken() as any);
      const pushAction: any = push('/')
      dispatch(pushAction)
    } catch (e) {
      handleAxiosError(e, dispatch, Type.REGISTER_FAILED)
    }
  }
}

export const changeUsername = (username: string) => {
  return async (dispatch: Dispatch<Action>) => {
    if (!username) {
      dispatch({type: Type.SET_CHANGE_USERNAME_FAILED, payload: 'Please enter a username'})
      return;
    }
    let res: ChangeUsernameResponse;
    try {
      res = await axios.put('http://localhost:5000/auth/username', { username })
      dispatch({type: Type.CHANGE_USERNAME_SUCCEEDED, payload: res.data});
    }
    catch (e) {
      handleAxiosError(e, dispatch, Type.SET_CHANGE_USERNAME_FAILED);
    }
  }
}

export const verifyToken = () => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      await fetchAuthToken()

      const res = await axios.post('http://localhost:5000/auth/verify');
      
      if (!res.data.username) {
        dispatch(logout() as any);
      }
      else {
        dispatch({type: Type.VERIFY_AUTH_TOKEN_SUCCEEDED, payload: res.data});
      }
    }
    catch (e) {
      handleAxiosError(e, dispatch, Type.SET_VERIFY_FAILED);
    }
  }
}

export const fetchAuthToken = () => {
  return async (dispatch: Dispatch<Action>) => {
    const token = await fetchToken()
    if (token) {
      dispatch({type: Type.LOGIN_SUCCEEDED, payload: true})
    }
  }
}
