import * as Types from '../actions/Types'


const initialState = {
  loggedIn: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case Types.SET_SIGNIN_STATUS:
      return {
        ...state,
        loggedIn: action.payload,
      }
    default:
      return state
  }
}
