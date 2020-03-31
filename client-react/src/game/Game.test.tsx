import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';

import Game from './Game';
import { deeplyRenderComponentWithRedux } from '../test-utils';

test('Shows global if global game', () => {
  const { getByText } = deeplyRenderComponentWithRedux(<Game history={{ push: () => {}}}/>)
  expect(getByText('Global Game')).toBeInTheDocument()
})

test('Shows private if private game', () => {
  const {getByText} = deeplyRenderComponentWithRedux(<Game gameId={"aax"} history={{ push: () => {}}}/>)
  expect(getByText('Private Game:')).toBeInTheDocument()
})
