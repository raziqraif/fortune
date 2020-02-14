import * as Types from './Types'


export const signin = (email, password) => {
  return async dispatch {
    // replace this with an api module assumedly
    const res = await axios.post('/login', {email, password})
    // just an example
    dispatch({type: Types.SET_SIGNIN_STATUS, payload: true})
  }
}
