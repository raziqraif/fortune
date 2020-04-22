import axios from 'axios'
import { Dispatch } from 'redux'
import { Action } from '../reducers/AuthReducer'
import {Type} from './Types'
import {push} from 'connected-react-router'
import {handleAxiosError} from './Utils'
import { fetchAuthToken } from './Auth'




export const sendFriendRequest = (requester_name) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      await fetchAuthToken();
      const res = await axios.post('http://localhost:5000/friends/', {requester_name});
      dispatch({type: Type.SET_FRIEND_REQUEST, payload: res })
    } catch (e) {
      handleAxiosError(e, dispatch, Type.FRIEND_REQUEST_FAILED);
    }
  }
}