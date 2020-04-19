export enum Type {
    // auth types
    LOGIN,
    LOGIN_FAILED,
    LOGIN_SUCCEEDED,
    REGISTER,
    REGISTER_FAILED,
    REGISTER_SUCCEEDED,
    LOGOUT,
    VERIFY_AUTH_TOKEN,
    VERIFY_AUTH_TOKEN_SUCCEEDED,
    SET_VERIFY_FAILED,

    // coin types
    SET_SIMPLE_COINS,
    SET_COINS,
    SET_GAME_COINS,
    SET_CURRENT_PRICES,
    SET_COIN_AMOUNT,

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
    SET_CASH,
    LIQUIFY_FAILED,
    TRANSACTION,
    TRANSACTION_FAILED,

    SET_REGISTRATION_ERROR,
    SET_LOGIN_ERROR,
    CLEAR_ERRORS,

    // achievement types
    SET_ACHIEVEMENTS,
    SET_ACHIEVEMENT_PROFILE,
    SET_ACHIEVEMENTS_FAILED,
}
