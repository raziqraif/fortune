import axios from 'axios'
import { Dispatch } from 'redux'
import { Action } from '../reducers/AuthReducer'
import {Type} from './Types'
import {push} from 'connected-react-router'
import {handleAxiosError} from './Utils'
import { fetchAuthToken } from './Auth'

export const sendFriendRequest = (requester, requestee, status) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      await fetchAuthToken();
      const res = await axios.post('http://localhost:5000/friends/', {requester, requestee, status});
      dispatch({type: Type.SET_FRIEND_REQUEST, payload: res.data })
    } catch (e) {
      handleAxiosError(e, dispatch, Type.FRIEND_FAILED);
    }
  }
}

export const acceptFriendRequest = (requester, requestee, status) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      await fetchAuthToken();
      const res = await axios.put('http://localhost:5000/friends/accept', {requester, requestee, status});
      dispatch({type: Type.ACCEPT_FRIEND_REQUEST, payload: res.data })
    } catch (e) {
      handleAxiosError(e, dispatch, Type.FRIEND_FAILED);
    }
  }
}

export const getPending = (username) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      await fetchAuthToken();
      const res = await axios.get('http://localhost:5000/friends/pending/');
      dispatch({type: Type.GET_PENDING, payload: res.data })
    } catch (e) {
      handleAxiosError(e, dispatch, Type.GET_PENDING_FAILED);
    }
  }
}

export const getFriendsList = (username) => {
  return async (dispatch: Dispatch<Action>) => {
    try {
      await fetchAuthToken();
      const res = await axios.get('http://localhost:5000/friends/list/');
      dispatch({type: Type.GET_FRIENDS, payload: res.data })
    } catch (e) {
      handleAxiosError(e, dispatch, Type.GET_LIST_FAILED);
    }
  }
}

