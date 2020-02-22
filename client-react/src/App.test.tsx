import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import {deeplyRenderComponentWithRedux} from './test-utils'

test('renders Fortune menubar link', () => {
  const { getByText } = deeplyRenderComponentWithRedux(<App />);
  const linkElement = getByText(/Fortune/i);
  expect(linkElement).toBeInTheDocument();
});
