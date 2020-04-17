import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';

import CoinInfo from './CoinInfo';
import { deeplyRenderComponentWithRedux } from '../../test-utils';
import { CoinAndPrices, Ticker } from '../../redux/actions/Coins';

const emptyProps = {
  allCoins: {
    coin: {
      id: '',
      name: '',
      symbol: '',
      number: '',
    },
    prices: {
      price: '',
      captured_at: new Date(),
      price_change_day_pct: '',
      id: '',
    },
  }
}
const sampleData = {
    coin: {
      id: '1',
      name: '1',
      symbol: '1',
      number: '1',
    },
    prices: [{
      price: '11',
      captured_at: new Date(),
      price_change_day_pct: '',
      id: '1',
    },],
}





test('Should display correct coin data', () => {
  const {getByText} = deeplyRenderComponentWithRedux(
    <CoinInfo allCoins={sampleData}/>);
  expect(getByText('11')).toBeInTheDocument() //TODO
})
