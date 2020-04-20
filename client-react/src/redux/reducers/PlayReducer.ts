import { Type } from '../actions/Types'

export type State = typeof initialState;
const initialState = {
    gamesInPage: [],
    totalGames: 0,
    pageSize: 0,
    redirectLink: "",
    showGameNotFound: false,
};

export type Action = {
    type: Type;
    payload?: any;
};

export type PlayState = {
    gamesInPage: GameType[],
    totalGames: number,
    pageSize: number,
    redirectLink: string,
    showGameNotFound: boolean,
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
                gamesInPage: [],
                totalGames: 0,
                pageSize: 0,
            };
        case Type.JOIN_GAME:
            console.log("Join game")
            return {
                ...state,
                redirectLink: action.payload.redirectLink,
                showGameNotFound: action.payload.showGameNotFound,
            };
        case Type.JOIN_GAME_FAILED:
            console.log("Join game failed")
            return {
               ...state,
            };
        case Type.LOGOUT:
            return initialState
        default:
            return state
    }
}
