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

            dispatch({type: Type.SET_USERS, payload: res.data});
        } catch (e) {
            handleAxiosError(e, dispatch, Type.GET_USERS_FAILED);
        }
    }
}

export const notifyUser = (message: string, userId?: number) => {
    return async (dispatch: Dispatch<Action>, store: () => RootState) => {
        if (!message) {
            dispatch({type: Type.NOTIFY_USER_FAILED, payload: 'You must have a message.'});
            return;
        }
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
};

export const issueWarning = (userId: number, message: string) => {
    return async (dispatch: Dispatch<Action>, store: () => RootState) => {
        if (!message) {
            dispatch({type: Type.USER_ACTION_FAILED, payload: 'Warnings must have a message.'});
            return;
        }
        try {
            await fetchAuthToken();
            await axios.put(`http://localhost:5000/users/${userId}`, {message});
            dispatch({type: Type.USER_ACTION_SUCCESS});
        } catch (e) {
            handleAxiosError(e, dispatch, Type.USER_ACTION_FAILED);
        }
    }
};

export const issueBan = (userId: number) => {
    return async (dispatch: Dispatch<Action>, store: () => RootState) => {
        try {
            await fetchAuthToken();
            await axios.delete(`http://localhost:5000/users/${userId}`);
            dispatch(getUsers() as any);
            dispatch({type: Type.USER_ACTION_SUCCESS});
        } catch (e) {
            handleAxiosError(e, dispatch, Type.USER_ACTION_FAILED);
        }
    }
};

export const getReports = (page: number, numPerPage: number = 9) => {
    return async (dispatch: Dispatch<Action>, store: () => RootState) => {
        try {
            await fetchAuthToken();
            const res = await axios.get(
                'http://localhost:5000/reports/',
                { params: { sortByStatusDescending: true, numPerPage: numPerPage, page: page } }
            );
            dispatch({type: Type.GET_REPORTS_SUCCESS, payload: res.data});
        } catch (e) {
            handleAxiosError(e, dispatch, Type.GET_REPORTS_FAILED);
        }
    }
}

export const updateReport = (
    reportId: number,
    selectedAction: 'None' | 'Warning' | 'Ban',
    warningMessage?: string
) => {
    return async (dispatch: Dispatch<Action>, store: () => RootState) => {
        if (selectedAction === 'Warning' && !warningMessage) {
            dispatch({type: Type.UPDATE_REPORT_FAILED, payload: 'Warnings must have a message.'});
            return;
        }
        try {
            await fetchAuthToken();
            await axios.put(
                `http://localhost:5000/reports/${reportId}`,
                {
                    userAction: selectedAction.toLowerCase(),
                    message: warningMessage
                }
            );

            dispatch({type: Type.UPDATE_REPORT_SUCCESS});
        } catch (e) {
            handleAxiosError(e, dispatch, Type.UPDATE_REPORT_FAILED);
        }
    }
};

export const createReport = (messageID: number) => {
    return async (dispatch: Dispatch<Action>, store: () => RootState) => {
        try {
            await fetchAuthToken();
            const res = await axios.post(
                'http://localhost:5000/reports/',
                {messageID: messageID}
            );
            // TODO: dispatch appropriate stuff if given time
            // dispatch({type: Type.GET_REPORTS_SUCCESS, payload: res.data});
        } catch (e) {
            // handleAxiosError(e, dispatch, Type.GET_REPORTS_FAILED);
        }
    }
};
