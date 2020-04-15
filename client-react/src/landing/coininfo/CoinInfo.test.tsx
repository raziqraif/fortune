import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';

import CoinInfo from './CoinInfo';
import { deeplyRenderComponentWithRedux } from '../../test-utils';

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
  ...emptyProps,
  coin: {
    ...emptyProps.coin
  },
  prices: {
    ...emptyProps.prices,
    price: '11'
  }
}


test('Should display correct coin data', () => {
  const {getByText} = deeplyRenderComponentWithRedux(<CoinInfo
          allCoins={sampleData}
          />);
  expect(getByText('11')).toBeInTheDocument() //TODO
})
