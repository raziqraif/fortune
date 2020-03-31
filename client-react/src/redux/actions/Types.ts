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

    // game types
    CREATE_GAME,
    CREATE_GAME_FAILED,
    SET_GAME,
    SET_GAME_FAILED,
    SET_GAME_PROFILE,
    LIQUIFY_FAILED,

    SET_REGISTRATION_ERROR,
    SET_LOGIN_ERROR,
    
}
