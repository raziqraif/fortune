import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';

import {deeplyRenderComponentWithRedux} from '../test-utils';
import Login from './Login';


test('Should render login page', () => {
  const {getByText} = deeplyRenderComponentWithRedux(<Login/>)
  expect(getByText('Login')).toBeInTheDocument()
})
