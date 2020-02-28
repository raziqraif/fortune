import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';

import CreateGame from './CreateGame';
import { deeplyRenderComponentWithRedux } from '../../test-utils';


test('Shows create game title', () => {
  const {getByText} = deeplyRenderComponentWithRedux(<CreateGame />);
  expect(getByText('Create Game')).toBeInTheDocument()
});

