import { Type } from '../actions/Types';

export type UsersType = Array<UserType>
export type UserType = {
    id: number;
    username: string;
}

export type ReportsType = Array<ReportType>;
export type ReportType = {
    id: number,
    createdAt: Date,
    game: {
        id: number,
        title: string,
    },
    issuer: UserType,
    offender: UserType,
    flaggedMessage: string,
    resolved: boolean,
    takenAction: string,
}

export type AdminState = typeof initialState;
const initialState = {
    users: [] as UsersType,
    usersErrorMessage: '',
    userActionErrorMessage: '',
    notifyErrorMessage: '',
    reports: [] as ReportsType,
    numberOfReports: 0,
    reportsErrorMessage: '',
}

export type Action = {
    type: Type;
    payload?: any;
}

export default (state = initialState, action: Action) => {
    switch (action.type) {
        case Type.SET_USERS:
            return {
                ...state,
                users: action.payload.users,
                usersErrorMessage: '',
            }
        case Type.GET_USERS_FAILED:
            return {
                ...state,
                usersErrorMessage: action.payload,
            }
        case Type.NOTIFY_USER_SUCCESS:
            return {
                ...state,
                notifyErrorMessage: '',
            }
        case Type.NOTIFY_USER_FAILED:
            return {
                ...state,
                notifyErrorMessage: action.payload,
            }
        case Type.USER_ACTION_SUCCESS:
            return {
                ...state,
                userActionErrorMessage: '',
            }
        case Type.USER_ACTION_FAILED:
            return {
                ...state,
                userActionErrorMessage: action.payload,
            }
        case Type.GET_REPORTS_SUCCESS:
            return {
                ...state,
                reports: action.payload.reports,
                numberOfReports: action.payload.totalItems,
                reportsErrorMessage: '',
            }
        case Type.GET_REPORTS_FAILED:
            return {
                ...state,
                reportsErrorMessage: action.payload,
            }
        case Type.UPDATE_REPORT_SUCCESS:
            return {
                ...state,
                reportsErrorMessage: '',
            }
        case Type.UPDATE_REPORT_FAILED:
            return {
                ...state,
                reportsErrorMessage: action.payload,
            }
        default:
            return state;
    }
}