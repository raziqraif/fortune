import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';

import Landing from './Landing';


test('Should render Landing page', () => {
  const {getByText} = render(<Landing/>)
  expect(getByText('Landing')).toBeInTheDocument() //TODO
})
