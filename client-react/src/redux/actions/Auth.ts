import { Type } from './Types'
import axios from 'axios'
import { Dispatch } from 'redux'
import { Action } from '../reducers/AuthReducer'


export const login = (email: string, password: string) => {
  return async (dispatch: Dispatch<Action>) => {
    // replace this with an api module assumedly
    // const res = await axios.post('/api/login', {email, password})
    // just an example
    dispatch({type: Type.SET_SIGNIN_STATUS, payload: true})
  }
}

export const logout = () => {
  return async (dispatch: Dispatch<Action>) => {
    // TODO remove token from localStorage and send to backend to delete
    dispatch({type: Type.SET_SIGNIN_STATUS, payload: false})
  }
}
