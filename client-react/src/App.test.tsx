import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders Fortune menubar link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/Fortune/i);
  expect(linkElement).toBeInTheDocument();
});
