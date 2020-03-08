import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';

import Play from './Play';


test('Should render Play page', () => {
  const {getByText} = render(<Play/>);
  expect(getByText('Play')).toBeInTheDocument();
  expect(getByText('Global Game')).toBeInTheDocument()
  expect(getByText('Global Timed Game')).toBeInTheDocument()
  expect(getByText('Create A Game')).toBeInTheDocument()
  expect(getByText('Join A Game')).toBeInTheDocument()
});

test('Redirect to the global game page', ()=> {
  const {getByText} = render(<Play/>);
  fireEvent.click(getByText("Global Game"));
  expect(getByText('Global')).toBeInTheDocument()
});
