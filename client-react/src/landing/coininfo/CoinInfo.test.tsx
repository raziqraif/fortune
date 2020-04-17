import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';

import { CoinInfo } from './CoinInfo';
import { deeplyRenderComponentWithRedux } from '../../test-utils';
import { CoinAndPrices, Ticker } from '../../redux/actions/Coins';

const sampleData = [
{
    coin: {
      id: '1',
      name: '1',
      symbol: '1',
      number: '1',
    },
   prices: [{
      price: '11',
      captured_at: '',
      price_change_day_pct: '0.96',
      id: '1',
    },]
}

];
const getCoins = (
  gameId: number,
  timeSpan?: number,
  sortBy?: number,
  pageNum?: number,
  numPerPage?: number
) => {};

const noData = [];

test('Should display specified coin data', () => {
  const {getByText} = deeplyRenderComponentWithRedux(
    <CoinInfo allCoins={sampleData} getCoins= {getCoins}/>);
  expect(getByText('$11.00')).toBeInTheDocument()
  expect(getByText('96.00%')).toBeInTheDocument()
})

test('Should display message about no coins available to display', () => {
  const {getByText} = deeplyRenderComponentWithRedux(
    <CoinInfo allCoins={noData} getCoins= {getCoins}/>);
  expect(getByText('No coins available to display')).toBeInTheDocument()
})
