import * as Types from '../actions/Types'


const initialState = {
  signedIn: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case Types.SET_SIGNIN_STATUS:
      return {
        ...state,
        signedIn: action.payload,
      }
    default:
      return state
  }
}
