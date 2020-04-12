export enum Type {
    // auth types
    LOGIN,
    LOGIN_FAILED,
    LOGIN_SUCCEEDED,
    REGISTER,
    REGISTER_FAILED,
    REGISTER_SUCCEEDED,
    LOGOUT,

    // coin types
    SET_COINS,
    SET_GAME_COINS,
    SET_CURRENT_PRICES,
    SET_ONEDAY_TICKERS,

    // game types
    CREATE_GAME,
    CREATE_GAME_FAILED,
    GET_ACTIVE_GAMES,
    GET_ACTIVE_GAMES_FAILED,
    JOIN_GAME,
    JOIN_GAME_FAILED,
    SET_GAME,
    SET_GAME_FAILED,
    SET_GAME_PROFILE,
    LIQUIFY_FAILED,
    TRANSACTION,
    TRANSACTION_FAILED,

    SET_REGISTRATION_ERROR,
    SET_LOGIN_ERROR,

    CLEAR_ERRORS
}
