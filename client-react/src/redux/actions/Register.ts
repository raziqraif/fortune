import { Type } from './Types'
import axios from 'axios'
import { Dispatch } from 'redux'
import { Action } from '../reducers/AuthReducer'


export const register = (
    username: string,
    password: string
) => {
  return async () => {
    const res = await axios.post('/api/register', {username, password});
  }
}
