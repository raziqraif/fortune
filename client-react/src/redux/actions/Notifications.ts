import axios from "axios"
import { Dispatch } from 'redux'
import { Action } from '../reducers/AuthReducer'
import { Type } from "./Types"
import { handleAxiosError } from "./Utils"
import { Notification } from "../reducers/NotificationsReducer"


type GetNotificationsResponse = {
    data: Array<Notification>,
}

export const getNotifications = () => {
    return async (dispatch: Dispatch<Action>) => {
        let res: GetNotificationsResponse
        try {
            res = await axios.get('http://localhost:5000/notification?page=0')
        } catch (e) {
            handleAxiosError(e, dispatch, Type.GET_NOTIFICATIONS_FAILED);
            return
        }
        dispatch({type: Type.GET_NOTIFICATIONS_SUCCEEDED, payload: res.data})
    }
}