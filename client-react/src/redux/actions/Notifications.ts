import axios from "axios"
import { Dispatch } from 'redux'
import { Action } from '../reducers/AuthReducer'
import { Type } from "./Types"
import { handleAxiosError } from "./Utils"
import { Notification } from "../reducers/NotificationsReducer"

export enum PriceAlertType {
    ABOVE,
    BELOW,
}


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

export const createPriceAlert = (coinId: string, strikePrice: string, type: PriceAlertType) => {
    return async (dispatch: Dispatch<Action>) => {
        let res: GetNotificationsResponse
        dispatch({type: Type.CREATE_PRICE_ALERT})
        let stringType;
        if (type == PriceAlertType.ABOVE) {
            stringType = 'above'
        } else {
            stringType = 'below'
        }
        try {
            res = await axios.post('http://localhost:5000/alert', {coinId, strikePrice, type: stringType})
        } catch (e) {
            handleAxiosError(e, dispatch, Type.CREATE_PRICE_ALERT_FAILED);
            return
        }
        await dispatch({type: Type.CREATE_PRICE_ALERT_SUCCEEDED, payload: res.data})
        const b: any = getNotifications()
        await dispatch(b)
    }
}