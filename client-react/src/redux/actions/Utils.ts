import {push} from 'connected-react-router'
import {Type} from './Types'


type ApiError = {
  response?: {
    status: number,
    data: {
      error: string,
    }
  },
}


export const handleAxiosError = (error: ApiError, dispatch: Function, type: Type) => {
  if (!error.response) {
    dispatch({type, payload: 'Cannot connect to the server'})
    return
  }
  if (error.response.status === 401) {
    dispatch({type, payload: error.response.data.error})
    // this token is invalid, remove it from localStorage
    // and redirect to the login page
    dispatch(push('/login'))
    return
  }
  dispatch({type, payload: error.response.data.error})
}