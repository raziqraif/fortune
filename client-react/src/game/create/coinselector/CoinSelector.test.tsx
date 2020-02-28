import React from 'react';
import {render, fireEvent, cleanup} from '@testing-library/react';
import userEvent from '@testing-library/user-event'

import CoinSelector from './CoinSelector';

afterEach(cleanup)

const testCoin = '***'
const allCoins = [
    {
        id: '1',
        name: 'coin1'
    },
    {
        id: '2',
        name: 'coin2'
    },
    {
        id: '3',
        name: testCoin // Coin with no common substrings
    }
];

const setActiveCoins = (activeCoins: Array<{ id: string, name: string }>) => {};
let activeCoins: Array<{ id: string, name: string }> = [];

test('Render labels and buttons', () => {
    const {getByText, getByPlaceholderText} = render(
        <CoinSelector 
            allCoins={allCoins}
            activeCoins={activeCoins}
            setActiveCoins={setActiveCoins}/>
    );
    expect(getByText('Coins available to your players')).toBeInTheDocument();
    expect(getByText('Selected Coins')).toBeInTheDocument();
    expect(getByText('Select All')).toBeInTheDocument();
    expect(getByText('Deselect All')).toBeInTheDocument();
    expect(getByPlaceholderText('Filter coins')).toBeInTheDocument();
});

test('Renders all coins', () => {
    const {getByText} = render(
        <CoinSelector
            allCoins={allCoins}
            activeCoins={activeCoins}
            setActiveCoins={setActiveCoins}/>
    );
    allCoins.forEach((coin) => {
        expect(getByText(coin.name)).toBeInTheDocument();
    });
});

test('Select/Deselect all button functionality',() => {
    const {getAllByText, getByText, queryAllByPlaceholderText} = render(
        <CoinSelector
            allCoins={allCoins}
            activeCoins={activeCoins}
            setActiveCoins={setActiveCoins}/>
    );

    let btn_select = getByText('Select All');
    let btn_deselect = getByText('Deselect All');
    expect(btn_select).toBeInTheDocument();
    expect(btn_deselect).toBeInTheDocument();

    // TODO: Figure out how to pass a valid setActiveCoins() and uncomment these.
    // TODO: Should this be done in the parent component instead(?)
    // expect(queryAllByPlaceholderText('active-coin').length).toEqual(0);
    // fireEvent.click(btn_select);
    // expect(queryAllByPlaceholderText('active-coin').length).toEqual(allCoins.length);
    // allCoins.forEach((coin)=>{
    //     let cur_coins = getAllByText(coin.name);
    //     expect(cur_coins.length).toEqual(2);  // for active checkbox and available checkbox
    //     expect(cur_coins[0]).toHaveAttribute("checked", "true")
    //     expect(cur_coins[1]).toHaveAttribute("checked", "true")
    // });
    // fireEvent.click(btn_deselect);
    // expect(queryAllByPlaceholderText('active-coin').length).toEqual(allCoins.length);
    // allCoins.forEach((coin)=>{
    //     let cur_coins = getAllByText(coin.name);
    //     expect(cur_coins.length).toEqual(1);
    //     expect(cur_coins[0]).toHaveAttribute("checked", "false")
    // });
});

// TODO: Test for manually selecting coins (after setActiveCoins() is done)

test('Filter an invalid coin', ()=>{
    const {queryAllByPlaceholderText, getByPlaceholderText} = render(
        <CoinSelector
            allCoins={allCoins}
            activeCoins={activeCoins}
            setActiveCoins={setActiveCoins}/>
    );
    let txtFilter = getByPlaceholderText('Filter coins');
    expect(txtFilter).toBeInTheDocument();
    userEvent.type(txtFilter, 'INVALID_COIN_X');
    expect(txtFilter).toHaveAttribute('value', 'INVALID_COIN_X');
    expect(queryAllByPlaceholderText('available-coin').length).toEqual(0)
});

test('Filter all valid coins', ()=>{
    const {queryByText, getByPlaceholderText} = render(
        <CoinSelector
            allCoins={allCoins}
            activeCoins={activeCoins}
            setActiveCoins={setActiveCoins}/>
    );
    let txtFilter = getByPlaceholderText('Filter coins');
    for (let i = 0; i < allCoins.length; i++) {
        userEvent.type(txtFilter, allCoins[i].name);
        expect(queryByText("Select All")).toBeNull(); // TODO: Ideally, the button should only be disabled
        expect(txtFilter).toHaveAttribute('value', allCoins[i].name);
        allCoins.forEach((coin) => {
            if (coin.name != allCoins[i].name) {
                expect(queryByText(coin.name)).toBeNull();
            } else {
                expect(queryByText(coin.name)).toBeInTheDocument();
            }
        });
        fireEvent.change(txtFilter, {target: {value: ""}});
    }
});

test('Filter coins by substring', ()=> {
    const {queryByText, getByPlaceholderText} = render(
        <CoinSelector
            allCoins={allCoins}
            activeCoins={activeCoins}
            setActiveCoins={setActiveCoins}/>
    );

    let txtFilter = getByPlaceholderText('Filter coins');
    expect(allCoins[0].name.length).toBeGreaterThanOrEqual(3);
    let keyword = allCoins[0].name.substr(1,2);

    userEvent.type(txtFilter, keyword);
    expect(queryByText(testCoin)).toBeNull();
    allCoins.forEach((coin) => {
        if (coin.name.includes(keyword)) {
            expect(queryByText(coin.name)).toBeInTheDocument();
        }
        else {
            expect(queryByText(coin.name)).toBeNull();
        }
    });
});

