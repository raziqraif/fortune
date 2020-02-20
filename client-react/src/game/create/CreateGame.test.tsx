import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';

import CreateGame from './CreateGame';


test('Shows global if global game', () => {
  const {getByText} = render(<CreateGame allCoins={[]} />)
  expect(getByText('Create Game')).toBeInTheDocument()
})
