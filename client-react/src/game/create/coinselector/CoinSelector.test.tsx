import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';

import CoinSelector from './CoinSelector';

const allCoins = [
    {
        id: '1',
        name: 'coin'
    }
]
const activeCoins: Array<{ id: string, name: string }> = [];
const setActiveCoins = (activeCoins: Array<{ id: string, name: string }>) => {};

test('Renders CoinSelector filter label', () => {
    const {getByText} = render(
        <CoinSelector 
            allCoins={allCoins}
            activeCoins={activeCoins}
            setActiveCoins={setActiveCoins}/>
    );
    expect(getByText('Coins available to your players')).toBeInTheDocument()
})
