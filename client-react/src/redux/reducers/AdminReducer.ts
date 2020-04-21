import { Type } from '../actions/Types';

export type UsersType = Array<{
    id: number;
    username: string;
}>

export type AdminState = typeof initialState;
const initialState = {
    users: [] as UsersType,
    usersErrorMessage: '',
    userActionErrorMessage: '',
    notifyErrorMessage: '',
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
        default:
            return state;
    }
}