import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';

import {GameType} from "../../redux/reducers/PlayReducer";
import assert from "assert";
import {deeplyRenderComponentWithRedux} from "../../test-utils";
import ActiveGames from "./ActiveGames";

let ACTIVE_GAMES: GameType[] = [];

ACTIVE_GAMES.push({title: "Global Game", link: "/global", endTime: new Date()});
ACTIVE_GAMES.push({title: "Global Timed Game", link: "/global_timed", endTime: new Date()});
ACTIVE_GAMES.push({title: "Boilermaker", link: "boilermaker", endTime: new Date()});
let LONG_TITLE = {title: "A Really Long Game Title Because Why Not", link: "boilermaker", endTime: new Date()}

for (let i = 5; i <= 10; i++) {
  ACTIVE_GAMES.push({title: "Game " + i, link: "/my_game" + i, endTime: new Date()})
}

test('Should render all active game cards', () => {
    const {getByText} = render(<ActiveGames games={ACTIVE_GAMES}/>);
    for (let i = 0; i < ACTIVE_GAMES.length; i++) {
        expect(getByText(ACTIVE_GAMES[i].title)).toBeInTheDocument();
    }
});

test('Should truncate', () => {
    const {getByText} = render(<ActiveGames games={[LONG_TITLE]}/>);
    // fireEvent.click(getByText("A Really Long Game Title Because Why Not"))
    expect(getByText("A Really Long Game Titl...")).toBeInTheDocument()
});

