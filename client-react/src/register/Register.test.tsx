import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';

import Register from './Register';


test('Should render register page', () => {
  const {getByText} = render(<Register/>)
  expect(getByText('Register')).toBeInTheDocument()
})
