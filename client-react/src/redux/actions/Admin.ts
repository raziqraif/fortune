import { Type } from './Types';
import axios from 'axios';
import { Dispatch } from 'redux';
import { RootState } from '../reducers';
import { Action } from '../reducers/AdminReducer';
import { fetchAuthToken } from './Auth';
import { handleAxiosError } from './Utils';

export const getUsers = () => {
    return async (dispatch: Dispatch<Action>, store: () => RootState) => {
        try {
            await fetchAuthToken();
            const res = await axios.get('http://localhost:5000/users');
            // const res = {
            //     data: {
            //         users: [
            //             {
            //                 id: 1,
            //                 username: 'Sample',
            //             },
            //             {
            //                 id: 2,
            //                 username: 'Next',
            //             },
            //             {
            //                 id: 3,
            //                 username: 'Blake',
            //             },
            //         ]
            //     }
            // }

            dispatch({type: Type.SET_USERS, payload: res.data});
        } catch (e) {
            handleAxiosError(e, dispatch, Type.GET_USERS_FAILED);
        }
    }
}

export const notifyUser = (message: string, userId?: number) => {
    return async (dispatch: Dispatch<Action>, store: () => RootState) => {
        try {
            await fetchAuthToken();
            await axios.post(
                `http://localhost:5000/notification${userId ? '/' + userId : ''}`,
                { message }
            );
            dispatch({type: Type.NOTIFY_USER_SUCCESS});
        } catch (e) {
            handleAxiosError(e, dispatch, Type.NOTIFY_USER_FAILED);
        }
    }
}