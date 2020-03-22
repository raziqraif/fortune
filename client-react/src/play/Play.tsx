import * as React from 'react';
import {Button, Container, Dropdown, DropdownButton, FormControl, InputGroup, Row} from "react-bootstrap";
import './Play.css'
import {CSSProperties} from "react";
import ActiveGames from "./active";
import assert from "assert";
import Pagination from "../pagination";

const buttonStyle: CSSProperties = {
    width: 100,
    height: 38,
    marginRight: 2,
    marginLeft: 2
};

interface PlayProp {
}

interface PlayState {
    gamesInCurrentPage: GameType[],
    pageSize: number,
    totalGames: number,
}

type GameType = {
    title: string,
    link: string,
    endTime: Date
}

type ResponseType = {
    gamesInCurrentPage: GameType[],
    pageSize: number,
    totalGames: number
}

type SortCriteriaType = {
    [key: string]: boolean,
    titleSmallest: boolean,
    titleLargest: boolean,
    endTimeEarliest: boolean,
    endTimeLatest: boolean
}

enum SortCriteriaKey {
    TITLE_SMALLEST = "titleSmallest",
    TITLE_LARGEST = "titleLargest",
    ENDTIME_EARLIEST = "endTimeEarliest",
    ENDTIME_LATEST = "endTimeLatest",
}

export default class Play extends React.Component<PlayProp, PlayState> {
    pageNumber = 1;
    keyword = '';
    sortCriteria: SortCriteriaType = {
        titleSmallest: false,
        titleLargest: false,
        endTimeEarliest: false,
        endTimeLatest: false
    };

    constructor(props: PlayProp) {
        super(props);
        _populateSeedData();  // TODO: Remove this later

        this.state = {
            gamesInCurrentPage: [],
            pageSize: 0,
            totalGames: 0,
        };
    }

    componentDidMount(): void {
        this.updateBackendData();
    }

    // TODO: Use a proper API call
    updateBackendData(resetPageNumber= false) {
        if (resetPageNumber) {
            this.pageNumber = 1;
        }
        let resp = gameAPI(
            this.pageNumber,
            this.keyword,
            this.sortCriteria
        );
        this.setState({
            gamesInCurrentPage: resp.gamesInCurrentPage,
            totalGames: resp.totalGames,
            pageSize: resp.pageSize
        });
    }

    toggleSortCriteria(criteria: string) {
        let sortCriteriaProps = Object.keys(this.sortCriteria);
        assert(sortCriteriaProps.includes(criteria));

        let prevCriteriaValue: boolean = (this.sortCriteria as SortCriteriaType)[criteria];
        sortCriteriaProps.forEach((prop) => {
            this.sortCriteria[prop] = false;
        });

        this.sortCriteria[criteria] = !prevCriteriaValue;
        this.updateBackendData(true);
    }

    showJoinModal() {
        console.log("Clicked Join");
    };

    handlePageChange = (pageNumber: number) => {
        this.pageNumber = pageNumber;
        this.updateBackendData()
    };

    handleKeywordChange = (event: any) => {
        this.keyword = event.target.value.trim();
    };

    handleSearchGames = (_event: any) => {
        this.pageNumber = 1;
        this.updateBackendData()
    };

    handleKeyPress = (event: any) => {
        if (event.key === "Enter") {
            this.handleSearchGames(event);
        }
    };

    render() {
        return (
            <div className={'container'}>
            <h1>Play a Game</h1>
                <br/>
                <div className={"toolbar-wrapper"}>
                    <div className={"searchbar-wrapper"} style={{marginRight:5}}>
                        <InputGroup>
                            <FormControl
                                onChange={this.handleKeywordChange}
                                onKeyPress={this.handleKeyPress}
                                placeholder={"Game title"}
                            />
                            <InputGroup.Append>
                                <Button
                                    variant={"primary"}
                                    onClick={this.handleSearchGames}
                                >Search</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </div>
                    <div className={"widgets-wrapper"} style={{marginRight:40}}>
                        <DropdownButton
                            id={'dropdown-basic-button'}
                            title={'Sort by'}
                        >
                            <Dropdown.Item
                                eventKey="1"
                                active={this.sortCriteria.titleSmallest}
                                onClick={() => this.toggleSortCriteria(SortCriteriaKey.TITLE_SMALLEST)}
                            >Title: smallest first</Dropdown.Item>
                            <Dropdown.Item
                                eventKey="2"
                                active={this.sortCriteria.titleLargest}
                                onClick={() => this.toggleSortCriteria(SortCriteriaKey.TITLE_LARGEST)}
                            >Title: largest first</Dropdown.Item>
                            <Dropdown.Item
                                eventKey="3"
                                active={this.sortCriteria.endTimeEarliest}
                                onClick={() => this.toggleSortCriteria(SortCriteriaKey.ENDTIME_EARLIEST)}
                            >End time: earliest first</Dropdown.Item>
                            <Dropdown.Item
                                eventKey="4"
                                active={this.sortCriteria.endTimeLatest}
                                onClick={() => this.toggleSortCriteria(SortCriteriaKey.ENDTIME_LATEST)}
                            >End time: latest first</Dropdown.Item>
                        </DropdownButton>
                    </div>
                    <div className={"widgets-wrapper"}>
                        <Button
                            style={buttonStyle}
                            variant={"primary"}
                            onClick={this.showJoinModal}
                        > Join </Button>
                        <Button
                            style={buttonStyle}
                            href={"/create"}
                            variant={"primary"}
                        > Create </Button>
                    </div>
                </div>
                <br/>
                <Container>
                    <ActiveGames games={this.state.gamesInCurrentPage}/>
                    <Row>
                        <Pagination
                            currentPage={this.pageNumber}
                            pageSize={this.state.pageSize}
                            totalItems={this.state.totalGames}
                            handlePageChange={this.handlePageChange}
                        />
                    </Row>
                </Container>
            </div>
        )
    }
}

/* Temporary interface to backend data */
// TODO: Remove all of these

let ACTIVE_GAMES: GameType[] = [];

function _populateSeedData() {
    ACTIVE_GAMES.push({title: "Global Game", link: "/global", endTime: new Date()});
    ACTIVE_GAMES.push({title: "Global Timed Game", link: "/global_timed", endTime: new Date()});
    ACTIVE_GAMES.push({title: "Boilermaker", link: "boilermaker", endTime: new Date()});
    ACTIVE_GAMES.push({title: "A Really Long Game Name Because Why Not", link: "boilermaker", endTime: new Date()});
    for (let i = 5; i <= 40; i++) {
        ACTIVE_GAMES.push({title: "Game " + i, link: "/my_game" + i, endTime: new Date()})
    }
}

function _filteredGames(keyword: string) {
    let activeGames = ACTIVE_GAMES;
    if (keyword !== '') {
        activeGames = activeGames.filter((game: GameType) =>
            game.title.toLowerCase().includes(keyword.toLowerCase()));
    }
    return activeGames;
}

function _compareTitleSmallest(a: GameType, b: GameType) {
    const titleA = a.title;
    const titleB = b.title;
    if (titleA < titleB) {
        return -1;
    } else if (titleA > titleB) {
        return 1;
    } else {
        return 0;
    }
}

function _compareTitleLargest(a: GameType, b: GameType) {
    const titleA = a.title;
    const titleB = b.title;
    if (titleA > titleB) {
        return -1;
    } else if (titleA < titleB) {
        return 1;
    } else {
        return 0;
    }
}

function _compareEndTimeEarliest(a: GameType, b: GameType) {
    const dateA = a.endTime;
    const dateB = b.endTime;
    if (dateA < dateB) {
        return -1;
    } else if (dateA > dateB) {
        return 1;
    } else {
        return 0;
    }
}

function _compareEndTimeLatest(a: GameType, b: GameType) {
    const dateA = a.endTime;
    const dateB = b.endTime;
    if (dateA > dateB) {
        return -1;
    } else if (dateA < dateB) {
        return 1;
    } else {
        return 0;
    }
}

function gameAPI(
    pageNumber: number,
    keyword: string = '',
    sortCriteria: SortCriteriaType) {

    let trueCount = 0;
    for (let prop in sortCriteria) {
        if (Object.prototype.hasOwnProperty.call(sortCriteria, prop) && sortCriteria.prop) {
            trueCount++;
        }
    }
    assert(trueCount <= 1);

    const PAGE_SIZE = 12;
    let games = _filteredGames(keyword);
    let totalGames = games.length;
    if (sortCriteria.titleSmallest) {
        games = games.slice().sort(_compareTitleSmallest)
    } else if (sortCriteria.titleLargest) {
        games = games.slice().sort(_compareTitleLargest)
    } else if (sortCriteria.endTimeEarliest) {
        games = games.slice().sort(_compareEndTimeEarliest)
    } else if (sortCriteria.endTimeLatest) {
        games = games.slice().sort(_compareEndTimeLatest)
    }
    let gamesInCurrentPage = games.slice((pageNumber - 1) * PAGE_SIZE, pageNumber * PAGE_SIZE);

    let resp: ResponseType = {
        gamesInCurrentPage: gamesInCurrentPage,
        totalGames: totalGames,
        pageSize: PAGE_SIZE
    };
    return resp;
}

