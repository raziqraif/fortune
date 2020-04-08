import axios from "axios"
import { Dispatch } from 'redux'
import { Action } from '../reducers/AuthReducer'
import { Type } from "./Types"
import { handleAxiosError } from "./Utils"


type GetNotificationsResponse = {
    data: Array<{
        message: string;
        createdAt: Date;
    }>,
}

export const getNotifications = () => {
    return async (dispatch: Dispatch<Action>) => {
        let res: GetNotificationsResponse
        try {
            res = await axios.get('localhost:5000/notifications')
        } catch (e) {
            handleAxiosError(e, dispatch, Type.GET_NOTIFICATIONS_FAILED);
            return
        }
        dispatch({type: Type.GET_NOTIFICATIONS_SUCCEEDED, payload: res.data})
    }
}