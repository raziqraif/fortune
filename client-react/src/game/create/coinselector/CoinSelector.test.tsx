import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event'

import CoinSelector from './CoinSelector';
import {getAllCoins} from "../../../redux/actions/Coins";

const allCoins = [
    {
        id: '1',
        name: 'coin1'
    },
    {
        id: '2',
        name: 'coin2'
    }
];

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
});

test('Renders all coins', () => {
    const {getByText} = render(
        <CoinSelector
            allCoins={allCoins}
            activeCoins={activeCoins}
            setActiveCoins={setActiveCoins}/>
    );
    allCoins.forEach((coin) => {
        expect(getByText(coin.name)).toBeInTheDocument()
    });
});

test('Select/Deselect all button functionality',() => {
    const {getByText} = render(
        <CoinSelector
            allCoins={allCoins}
            activeCoins={activeCoins}
            setActiveCoins={setActiveCoins}/>
    );
    expect(getByText('Select All')).toBeInTheDocument()
    expect(getByText('Deselect All')).toBeInTheDocument()
});

test('Filter an invalid coin', ()=>{
    const {queryByText, getByPlaceholderText} = render(
        <CoinSelector
            allCoins={allCoins}
            activeCoins={activeCoins}
            setActiveCoins={setActiveCoins}/>
    );
    let txtFilter = getByPlaceholderText('Filter coins')
    expect(txtFilter).toBeInTheDocument()
    userEvent.type(txtFilter, 'INVALID_COIN_X')
    expect(txtFilter).toHaveAttribute('value', 'INVALID_COIN_X')
    allCoins.forEach((coin) => {
        expect(queryByText(coin.name)).toBeNull()
    });
});

test('Filter all valid coin', ()=>{
    const {getByText, queryByText, getByPlaceholderText} = render(
        <CoinSelector
            allCoins={allCoins}
            activeCoins={activeCoins}
            setActiveCoins={setActiveCoins}/>
    );
    let txtFilter = getByPlaceholderText('Filter coins')
    let index = 0
    userEvent.type(txtFilter, allCoins[index].name)
    expect(txtFilter).toHaveAttribute('value', allCoins[index].name)
    allCoins.forEach((coin) => {
        if (coin.name != allCoins[index].name) {
            expect(queryByText(coin.name)).toBeNull()
        }
        else {
            expect(queryByText(coin.name)).toBeInTheDocument()
        }
    });

    expect(getByText('coin1')).toBeInTheDocument()
});


