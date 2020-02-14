import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';

import Login from './Login';


test('Should render login page', () => {
  const {getByText} = render(<Login/>)
  expect(getByText('Login')).toBeInTheDocument()
})
