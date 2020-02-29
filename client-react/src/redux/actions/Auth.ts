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

function persistToken(token: string) {
  axios.defaults.headers.common['AUTHORIZATION'] = `Bearer ${token}`
  localStorage.setItem('token', token)
}

export const login = (username: string, password: string) => {
  return async (dispatch: Dispatch<Action>) => {
    // replace this with an api module assumedly
    // const res = await axios.post('/api/login', {email, password})
    // just an example
    let res: AuthTokenResponse
    try {
      // TODO please don't hard-code this, we're working on getting nginx with
      // docker
      res = await axios.post('http://localhost:5000/auth/login', {username, password})
      persistToken(res.data.token)
      dispatch({type: Type.SET_SIGNIN_STATUS, payload: true, error: ''})
      const pushAction: any = push('/')
      dispatch(pushAction)
    } catch (e) {
      // TODO failed, dispatch error
      handleAxiosError(e, dispatch, Type.SET_SIGNIN_STATUS)
    }
  }
}

export const logout = () => {
  return async (dispatch: Dispatch<Action>) => {
    // TODO remove token from localStorage and send to backend to delete
    localStorage.removeItem('token')
    dispatch({type: Type.SET_SIGNIN_STATUS, payload: false})
  }
}

export const register = (username: string, password: string) => {
  return async (dispatch: Dispatch<Action>) => {
    let res: AuthTokenResponse
    try {
      res = await axios.post('http://localhost:5000/auth/register', {username, password})
      persistToken(res.data.token)
      dispatch({type: Type.SET_SIGNIN_STATUS, payload: true})
      const pushAction: any = push('/')
      dispatch(pushAction)
    } catch (e) {
      // TODO failed, dispatch error
      handleAxiosError(e, dispatch, Type.SET_SIGNIN_STATUS)
    }
  }
}
