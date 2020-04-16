import { Type } from './Types'
import io from 'socket.io-client'
import axios from 'axios'
import { Dispatch } from 'redux'
import { Action } from '../reducers/AuthReducer'
import {push} from 'connected-react-router'
import { toast } from 'react-toastify';

import {handleAxiosError} from './Utils'
import { setCurrentPrices } from './Coins'
import { RootState } from '../reducers'


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

async function fetchToken() {
  const token = await localStorage.getItem('token')
  axios.defaults.headers.common['AUTHORIZATION'] = `Bearer ${token}`
  return token
}

export const login = (username: string, password: string) => {
  return async (dispatch: Dispatch<Action>, store: () => RootState) => {
    // replace this with an api module assumedly
    // const res = await axios.post('/api/login', {email, password})
    // just an example
    dispatch({type: Type.LOGIN})
    let res: AuthTokenResponse
    let tok: string = ''
    try {
      // TODO please don't hard-code this, we're working on getting nginx with
      // docker
      res = await axios.post('http://localhost:5000/auth/login', {username, password})
      persistToken(res.data.token)
      tok = res.data.token
      dispatch({type: Type.LOGIN_SUCCEEDED, payload: res.data.token})
      const pushAction: any = push('/')
      dispatch(pushAction)
    } catch (e) {
      // TODO failed, dispatch error
      console.log(e)
      handleAxiosError(e, dispatch, Type.LOGIN_FAILED)
      return
    }
    try{
      await store().auth.socket.disconnect()
    } catch (e) {}
    const acn: any = initializeSocketConnection(tok)
    await dispatch(acn)
  }
}

export const logout = () => {
  return async (dispatch: Dispatch<Action>, store: () => RootState) => {
    // TODO remove token from localStorage and send to backend to delete
    localStorage.removeItem('token')
    try{
      store().auth.socket.disconnect()
    }catch(e){}
    await dispatch(initializeSocketConnection(''))
    dispatch({type: Type.LOGOUT})
  }
}

export const register = (username: string, password: string) => {
  return async (dispatch: Dispatch<Action>, store: () => RootState) => {
    dispatch({type: Type.REGISTER})
    let res: AuthTokenResponse
    let tok: string = ''
    try {
      res = await axios.post('http://localhost:5000/auth/register', {username, password})
      persistToken(res.data.token)
      tok = res.data.token
      dispatch({type: Type.REGISTER_SUCCEEDED, payload: res.data.token})
      const pushAction: any = push('/')
      dispatch(pushAction)
    } catch (e) {
      // TODO failed, dispatch error
      console.log('registration error', e)
      handleAxiosError(e, dispatch, Type.REGISTER_FAILED)
      return
    }
    try {
      store().auth.socket.disconnect()
    } catch(e) {}
    const acn: any = initializeSocketConnection(tok)
    dispatch(acn)
  }
}

export const fetchAuthToken = () => {
  return async (dispatch: Dispatch<Action>) => {
    const token = await fetchToken()
    if (token) {
      dispatch({type: Type.LOGIN_SUCCEEDED, payload: token})
    }
  }
}

export const initializeSocketConnection = (authToken: string) => {
  return async (dispatch: Dispatch<Action>) => {
    console.log('initializing connection with token', authToken)
    const socket = io('http://localhost:5000', {query: {token: authToken}}).connect();
    socket.on('message', (data: any) => {
      console.log('event received:', data)
      //this.setCurrentPrices(data);
      const acn: any = setCurrentPrices(data)
      dispatch(acn)
    });
    socket.on('notification', function(data: string){
      console.log('notification received:', data)
      toast(data)
    });
    await dispatch({type: Type.SET_SOCKET, payload: socket})
  }
}
