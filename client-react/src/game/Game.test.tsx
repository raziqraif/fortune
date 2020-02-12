import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';

import Game from './Game';


test('Shows global if global game', () => {
  const {getByText} = render(<Game/>)
  expect(getByText('Global')).toBeInTheDocument()
})

test('Shows private if private game', () => {
  const {getByText} = render(<Game gameId={"aax"}/>)
  expect(getByText('Private: aax')).toBeInTheDocument()
})
