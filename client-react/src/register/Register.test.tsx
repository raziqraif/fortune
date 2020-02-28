import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';

import Register from './Register';
import {deeplyRenderComponentWithRedux} from '../test-utils'


test('Should render register page', () => {
  const {getByText} = deeplyRenderComponentWithRedux(<Register/>)
  expect(getByText('Register')).toBeInTheDocument()
})
