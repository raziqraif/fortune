import axios from 'axios'
import { Dispatch } from 'redux'
import { Action } from '../reducers/AuthReducer'
import {Type} from './Types'
import {SortCriteriaType} from '../../play/Play'
import {push} from 'connected-react-router'
import {handleAxiosError} from './Utils'
import {fetchAuthToken} from "./Auth";

type ActiveGamesAtPageResponse = {
    data: {
        games: [],
        totalGames: number,
        pageSize: number,
    }
}

type JoinGameResponse = {
    data: {
        games: [],
        totalGames: number,
        pageSize: number,
    }
}

export const activeGamesAtPage = (
    pageNumber: number,
    keyword: string,
    sortCriteria: SortCriteriaType) => {
    return async (dispatch: Dispatch<Action>) => {
        try {
            await fetchAuthToken();
            const res = await axios.get('http://localhost:5000/play',
                {params: {page: pageNumber, keyword: keyword, criteria: sortCriteria}});
            dispatch({type: Type.GET_ACTIVE_GAMES, payload: res.data})
        } catch (e) {
            handleAxiosError(e, dispatch, Type.GET_ACTIVE_GAMES_FAILED)
        }
    }
};

export const joinGame = (
    code: string) => {
    return async (dispatch: Dispatch<Action>) => {
        try {
            await fetchAuthToken();
            const res = await axios.get('http://localhost:5000/join',
                {params: {code: code}});
            console.log("Join Response", res.data)
            dispatch({type: Type.JOIN_GAME, payload: res.data})
        } catch (e) {
            handleAxiosError(e, dispatch, Type.JOIN_GAME_FAILED)
        }
    }
};
