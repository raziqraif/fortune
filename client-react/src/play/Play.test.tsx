import React from 'react';
import {render, fireEvent, screen, getByPlaceholderText} from '@testing-library/react';

import Play from './Play';
import assert from "assert";
import {deeplyRenderComponentWithRedux} from "../test-utils";
import CreateGame from "../game/create/CreateGame";


test('Should render Play page', () => {
  const {getByText} = deeplyRenderComponentWithRedux(<Play />);
  expect(getByText('Play')).toBeInTheDocument();
  expect(getByText('Search')).toBeInTheDocument();
  expect(getByText('Sort by')).toBeInTheDocument();
  expect(getByText('Create')).toBeInTheDocument()
  expect(getByText('Join')).toBeInTheDocument()
});

test('Should redirect to Create', () => {
  const {getByText} = deeplyRenderComponentWithRedux(<Play />);
  fireEvent.click(getByText("Create"));
  expect(getByText('Create')).toBeInTheDocument()
});

test('Should display modal', () => {
  const {getByText} = deeplyRenderComponentWithRedux(<Play />);
  fireEvent.click(getByText("Join"));
  expect(getByText('Code')).toBeInTheDocument();
});

//
// test('Redirect to the global game page', ()=> {
//   const {getByText} = render(<Play/>);
//   fireEvent.click(getByText("Global Game"));
//   expect(getByText('Global')).toBeInTheDocument()
// });

/* Temporary interface to backend data */

// let ACTIVE_GAMES: GameType[] = [];
//
// function _populateSeedData() {
//   ACTIVE_GAMES.push({title: "Global Game", link: "/global", endTime: new Date()});
//   ACTIVE_GAMES.push({title: "Global Timed Game", link: "/global_timed", endTime: new Date()});
//   ACTIVE_GAMES.push({title: "Boilermaker", link: "boilermaker", endTime: new Date()});
//   ACTIVE_GAMES.push({title: "A Really Long Game Name Because Why Not", link: "boilermaker", endTime: new Date()});
//   for (let i = 5; i <= 1000; i++) {
//       ACTIVE_GAMES.push({title: "Game " + i, link: "/my_game" + i, endTime: new Date()})
//   }
// }
//
// function _filteredGames(keyword: string) {
//   let activeGames = ACTIVE_GAMES;
//   if (keyword !== '') {
//     activeGames = activeGames.filter((game: GameType) =>
//         game.title.toLowerCase().includes(keyword.toLowerCase()));
//   }
//   return activeGames;
// }
//
// function _compareTitleSmallest(a: GameType, b: GameType) {
//   const titleA = a.title;
//   const titleB = b.title;
//   if (titleA < titleB) {
//     return -1;
//   } else if (titleA > titleB) {
//     return 1;
//   } else {
//     return 0;
//   }
// }
//
// function _compareTitleLargest(a: GameType, b: GameType) {
//   const titleA = a.title;
//   const titleB = b.title;
//   if (titleA > titleB) {
//     return -1;
//   } else if (titleA < titleB) {
//     return 1;
//   } else {
//     return 0;
//   }
// }
//
// function _compareEndTimeEarliest(a: GameType, b: GameType) {
//   const dateA = a.endTime;
//   const dateB = b.endTime;
//   if (dateA < dateB) {
//     return -1;
//   } else if (dateA > dateB) {
//     return 1;
//   } else {
//     return 0;
//   }
// }
//
// function _compareEndTimeLatest(a: GameType, b: GameType) {
//   const dateA = a.endTime;
//   const dateB = b.endTime;
//   if (dateA > dateB) {
//     return -1;
//   } else if (dateA < dateB) {
//     return 1;
//   } else {
//     return 0;
//   }
// }
//
// function gameAPI(
//     pageNumber: number,
//     keyword: string = '',
//     sortCriteria: SortCriteriaType) {
//
//   let trueCount = 0;
//   for (let prop in sortCriteria) {
//     if (Object.prototype.hasOwnProperty.call(sortCriteria, prop) && sortCriteria.prop) {
//       trueCount++;
//     }
//   }
//   assert(trueCount <= 1);
//
//   const PAGE_SIZE = 12;
//   let games = _filteredGames(keyword);
//   let totalGames = games.length;
//   if (sortCriteria.titleSmallest) {
//     games = games.slice().sort(_compareTitleSmallest)
//   } else if (sortCriteria.titleLargest) {
//     games = games.slice().sort(_compareTitleLargest)
//   } else if (sortCriteria.endTimeEarliest) {
//     games = games.slice().sort(_compareEndTimeEarliest)
//   } else if (sortCriteria.endTimeLatest) {
//     games = games.slice().sort(_compareEndTimeLatest)
//   }
//   let gamesInPage = games.slice((pageNumber - 1) * PAGE_SIZE, pageNumber * PAGE_SIZE);
//
//   let resp: ResponseType = {
//     gamesInPage: gamesInPage,
//     totalGames: totalGames,
//     pageSize: PAGE_SIZE
//   };
//   return resp;
// }
//
