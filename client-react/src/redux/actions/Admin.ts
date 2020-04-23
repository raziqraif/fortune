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
            const res = await axios.get('http://localhost:5000/admin/users');

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
}

export const issueWarning = (userId: number, message: string) => {
    return async (dispatch: Dispatch<Action>, store: () => RootState) => {
        if (!message) {
            dispatch({type: Type.USER_ACTION_FAILED, payload: 'Warnings must have a message.'});
            return;
        }
        try {
            await fetchAuthToken();
            await axios.put(`http://localhost:5000/notification/${userId}`, {message});
            dispatch({type: Type.USER_ACTION_SUCCESS});
        } catch (e) {
            handleAxiosError(e, dispatch, Type.USER_ACTION_FAILED);
        }
    }
}

export const issueBan = (userId: number) => {
    return async (dispatch: Dispatch<Action>, store: () => RootState) => {
        try {
            await fetchAuthToken();
            await axios.delete(`http://localhost:5000/notification/${userId}`);
            dispatch(getUsers() as any);
            dispatch({type: Type.USER_ACTION_SUCCESS});
        } catch (e) {
            handleAxiosError(e, dispatch, Type.USER_ACTION_FAILED);
        }
    }
}

export const getReports = (page: number, numPerPage: number = 9) => {
    return async (dispatch: Dispatch<Action>, store: () => RootState) => {
        try {
            await fetchAuthToken();
            const res = await axios.get(
                'http://localhost:5000/reports',
                { params: { sortByStatusSescending: true, numPerPage, page } }
            );
            // const reports = [
            //     {
            //         id: 3,
            //         createdAt: new Date(),
            //         game: {
            //             id: 1,
            //             title: 'Global',
            //         },
            //         issuer: {
            //             id: 1,
            //             username: 'Sample'
            //         },
            //         offender: {
            //             id: 3,
            //             username: 'Blake'
            //         },
            //         flaggedMessage: '[toxicity]',
            //         resolved: false,
            //         takenAction: '',
            //     },
            //     {
            //         id: 4,
            //         createdAt: new Date(),
            //         game: {
            //             id: 1,
            //             title: 'Global',
            //         },
            //         issuer: {
            //             id: 2,
            //             username: 'Next'
            //         },
            //         offender: {
            //             id: 1,
            //             username: 'Sample'
            //         },
            //         flaggedMessage: 'I\'m reporting you',
            //         resolved: false,
            //         takenAction: '',
            //     },
            //     {
            //         id: 1,
            //         createdAt: new Date(),
            //         game: {
            //             id: 1,
            //             title: 'Global',
            //         },
            //         issuer: {
            //             id: 1,
            //             username: 'Sample'
            //         },
            //         offender: {
            //             id: 2,
            //             username: 'Next'
            //         },
            //         flaggedMessage: 'n-word',
            //         resolved: true,
            //         takenAction: 'warning',
            //     },
            //     {
            //         id: 2,
            //         createdAt: new Date(),
            //         game: {
            //             id: 1,
            //             title: 'Global',
            //         },
            //         issuer: {
            //             id: 3,
            //             username: 'Blake'
            //         },
            //         offender: {
            //             id: 2,
            //             username: 'Next'
            //         },
            //         flaggedMessage: 'n-word',
            //         resolved: true,
            //         takenAction: 'ban',
            //     },
            // ]

            // const res = {
            //     data: {
            //         reports: reports,
            //         totalItems: 4
            //     }
            // }

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
}