import * as React from 'react';
import {Button, Container, FormControl, InputGroup, Row} from "react-bootstrap";
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
    // fontSize: '120%',
    // lineHeight: "620%",
};

interface PlayProp {
}

interface PlayState {
    gamesInCurrentPage: GameType[],
    pageSize: number,
    totalGames: number,
}

type GameType = { title: string, link: string, endTime: Date }
type ResponseType = {gamesInCurrentPage: GameType[],  pageSize: number, totalGames: number}

export default class Play extends React.Component<PlayProp, PlayState> {
    pageNumber = 1;
    keyword = '';
    sortByTitle = false;
    sortByEndTime = false;

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

    // TODO: Use proper API call
    updateBackendData() {
        let resp = gameAPI(
            this.pageNumber,
            this.keyword,
            this.sortByTitle,
            this.sortByEndTime
        );
        this.setState({
            gamesInCurrentPage: resp.gamesInCurrentPage,
            totalGames: resp.totalGames,
            pageSize: resp.pageSize
        });
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
        this.updateBackendData()
    };

    handleKeyPress = (event: any) => {
        if (event.key === "Enter") {
            this.handleSearchGames(event);
        }
    };

    // TODO: Design API to prevent too large of a data request.
    render() {
        return (
            // <div>
            <div className={'container'}>
            <h1>Play a Game</h1>
                <br/>
                <div className={"tools-wrapper"}>
                    <div className={"searchbar-wrapper"} style={{marginRight:10}}>
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
                    <br/>
                    {/*<ButtonGroup>*/}
                    <div className={"buttons-wrapper"}>
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
                    {/*</ButtonGroup>*/}
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
                {/*</div>*/}
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
    for (let i = 4; i <= 20; i++) {
        ACTIVE_GAMES.push({title: "Game " + i, link: "/my_game" + i, endTime: new Date()})
    }
}

function _filteredGames(keyword: string) {
    let activeGames = ACTIVE_GAMES;
    if (keyword != '') {
        activeGames = activeGames.filter((game: GameType) =>
            game.title.toLowerCase().includes(keyword.toLowerCase()));
    }
    return activeGames;
}

function _compareTitle(a: GameType, b: GameType) {
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

function _compareEndTime(a: GameType, b: GameType) {
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

function gameAPI(
    pageNumber: number,
    keyword: string = '',
    sortByTitle: boolean = false,
    sortByEndTime: boolean = false) {

    assert(!sortByTitle || !sortByEndTime);

    const PAGE_SIZE = 9;
    let games = _filteredGames(keyword);
    let totalGames = games.length;
    if (sortByTitle) {
        games = games.slice().sort(_compareTitle)
    } else if (sortByEndTime) {
        games = games.slice().sort(_compareEndTime)
    }
    let gamesInCurrentPage = games.slice((pageNumber - 1) * PAGE_SIZE, pageNumber * PAGE_SIZE);

    let resp: ResponseType = {
        gamesInCurrentPage: gamesInCurrentPage,
        totalGames: totalGames,
        pageSize: PAGE_SIZE
    };
    return resp;
}

