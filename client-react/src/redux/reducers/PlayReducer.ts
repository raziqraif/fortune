import { Type } from '../actions/Types'

export type State = typeof initialState;
const initialState = {
    gamesInPage: [],
    totalGames: 0,
    pageSize: 0,
};

export type Action = {
    type: Type;
    payload?: any;
};

export type PlayState = {
    gamesInPage: GameType[],
    totalGames: number,
    pageSize: number,
};

export type GameType = {
    title: string,
    link: string,
    endTime: Date
}

export default (state = initialState, action: Action) => {
    switch (action.type) {
        case Type.GET_ACTIVE_GAMES:
            console.log("Get active games")
            console.log(action.payload)
            return {
                ...state,
                gamesInPage: action.payload.games,
                totalGames: action.payload.totalGames,
                pageSize: action.payload.pageSize,
            };
        case Type.GET_ACTIVE_GAMES_FAILED:
            console.log("Get active games failed")
            return {
                ...state,
            };
        default:
            return state
    }
}
