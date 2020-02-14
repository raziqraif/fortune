import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';

import MenuBar from './MenuBar';


test('Shows the title', () => {
  const {getByText} = render(<MenuBar/>)
  expect(getByText('Fortune')).toBeInTheDocument()
})

test('Shows dropdown item only after clicking on dropdown', () => {
  const {getByText, queryByText} = render(<MenuBar/>)
  // get* methods will throw an exception if nothing matches,
  // query* methods will return null instead
  expect(queryByText('Logout')).toBeNull()
  fireEvent.click(getByText('Username'))
  expect(getByText('Logout')).toBeInTheDocument()
})
