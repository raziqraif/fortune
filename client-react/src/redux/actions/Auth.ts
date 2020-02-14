import * as Types from './Types'
import axios from 'axios'


export const login = (email: string, password: string) => {
  return async dispatch => {
    // replace this with an api module assumedly
    // const res = await axios.post('/api/login', {email, password})
    // just an example
    dispatch({type: Types.SET_SIGNIN_STATUS, payload: true})
  }
}

export const logout = () => {
  return async dispatch => {
    // TODO remove token from localStorage and send to backend to delete
    dispatch({type: Types.SET_SIGNIN_STATUS, payload: false})
  }
}
