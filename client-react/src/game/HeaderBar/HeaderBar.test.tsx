import React from 'react';
import { render, fireEvent, screen, queryByText } from '@testing-library/react';
import History from 'history'

import HeaderBar from './HeaderBar';
import { deeplyRenderComponentWithRedux } from '../../test-utils';

// data
const emptyProps = {
    game: {
        data: {
            name: '',
            startingCash: '',
            shareableLink: '',
            shareableCode: '',
            endsAt: new Date(),
        },
        gameProfile: {
            cash: '',
            netWorth: ''
        },
        coins: []
    },
    global: false,
    history: History,
    gameId: '',
}

const nameTooLong = {
    ...emptyProps,
    game: {
        ...emptyProps.game,
        data: {
            ...emptyProps.game.data,
            name: 'This name is too long. It has over 30 characters.',
        },
    },
}

const nameFine = {
    ...emptyProps,
    game: {
        ...emptyProps.game,
        data: {
            ...emptyProps.game.data,
            name: 'Name fine',
        },
    },
}

const noEndDate = {
    ...emptyProps,
    game: {
        ...emptyProps.game,
        data: {
            ...emptyProps.game.data,
            endsAt: undefined,
        },
    },
}

const longCode = {
    ...emptyProps,
    game: {
        ...emptyProps.game,
        data: {
            ...emptyProps.game.data,
            shareableCode: 'ABCDEFG'
        },
    },
}

test('Truncates too long title', () => {
    const { getByText } = deeplyRenderComponentWithRedux(<HeaderBar
        game={nameTooLong.game.data}
        global={nameTooLong.global}
        history={nameTooLong.history}
        gameId={nameTooLong.gameId}
    />);
    expect(getByText('Private Game: This name ...')).toBeInTheDocument()
});

test('No end date', () => {
    const { queryByText } = deeplyRenderComponentWithRedux(<HeaderBar
        game={noEndDate.game.data}
        global={noEndDate.global}
        history={noEndDate.history}
        gameId={noEndDate.gameId}
    />);
    expect(queryByText('Hours')).toBeNull()
});

test('Displays long code', () => {
    const { queryByText } = deeplyRenderComponentWithRedux(<HeaderBar
        game={longCode.game.data}
        global={longCode.global}
        history={longCode.history}
        gameId={longCode.gameId}
    />);
    
    fireEvent.click(screen.getByText('Share'))
    expect(queryByText('ABCDEFG')).toBeInTheDocument()
});

