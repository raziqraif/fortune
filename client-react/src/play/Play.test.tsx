import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';

import Play from './Play';


test('Should render Play page', () => {
  const {getByText} = render(<Play/>)
  expect(getByText('Play')).toBeInTheDocument()
})
