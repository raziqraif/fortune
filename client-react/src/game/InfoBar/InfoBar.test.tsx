import React from 'react';
import { render, fireEvent, screen, queryByText } from '@testing-library/react';
import History from 'history'

import InfoBar from './InfoBar';
import { deeplyRenderComponentWithRedux } from '../../test-utils';

// data
const emptyProps = {
    gameProfile: {
        cash: '',
        netWorth: ''
    },
    coins: []
}

const tooManyDecimals = {
    ...emptyProps,
    gameProfile: {
        cash: '1111.12345',
        netWorth: '2222.54321'
    },
}

const noDecimals = {
    ...emptyProps,
    gameProfile: {
        cash: '2222',
        netWorth: '1111'
    },
}

test('Truncates too many decimals', () => {
    const { getByText } = deeplyRenderComponentWithRedux(<InfoBar
        {...tooManyDecimals}
    />);
    expect(getByText('Cash: $1111.12')).toBeInTheDocument()
    expect(getByText('Net worth: $2222.54')).toBeInTheDocument()
});

test('Adds decimals if there are none', () => {
    const { getByText } = deeplyRenderComponentWithRedux(<InfoBar
        {...noDecimals}
    />);
    expect(getByText('Cash: $2222.00')).toBeInTheDocument()
    expect(getByText('Net worth: $1111.00')).toBeInTheDocument()
});

