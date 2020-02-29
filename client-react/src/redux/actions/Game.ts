import axios from 'axios'


export const createGame = (
    activeCoins: Array<{ id: string, name: string }>,
    endsOn: Date,
    startingCash: string,
    title: string
) => {
  return async () => {
    await axios.post('http://localhost:5000/game/', {activeCoins, endsOn, startingCash, title});
  }
}
