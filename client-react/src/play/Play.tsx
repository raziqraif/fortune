import * as React from 'react';
import {Button, ButtonGroup, ButtonToolbar, Col, Container, FormControl, InputGroup, Row} from "react-bootstrap";
import './Play.css'
import {CSSProperties} from "react";
import ActiveGames from "./active";
import Game from "../game";

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
    filteredGames: GameType[],
}

type GameType = { name: string, link: string, endTime: Date }

export default class Play extends React.Component<PlayProp, PlayState> {
    activeGames: GameType[] = [];  // TODO: Remove this after real data has been pulled
    keyword = '';

    constructor(props: PlayProp) {
        super(props);
        this.populateSeedData()

        this.state = {
            filteredGames: this.filteredGames(),
        };
    }

    populateSeedData() {
        this.activeGames.push({name: "Global Game", link: "/global", endTime: new Date()});
        this.activeGames.push({name: "Global Timed Game", link: "/global_timed", endTime: new Date()});
        this.activeGames.push({name: "Boilermaker", link: "boilermaker", endTime: new Date()});
        for (let i = 4; i <= 40; i++) {
            this.activeGames.push({name: "Game " + i, link: "/my_game" + i, endTime: new Date()})
        }
    }

    requestActiveGames() {
        // TODO: Request all active games from the backend
        return this.activeGames;
    }

    filteredGames() {
        let activeGames = this.requestActiveGames();
        if (this.keyword != '') {
            activeGames = activeGames.filter((game: GameType) =>
                game.name.toLowerCase().includes(this.keyword.toLowerCase()));
        }
        return activeGames;
    }

    showJoinModal() {
        console.log("Clicked Join");
    };

    handleKeywordChange = (event: any) => {
        this.keyword = event.target.value.trim();
    };

    handleSearchGames = (event: any) => {
        this.setState({filteredGames: this.filteredGames()});
    };

    handleEnterKey = (event: any) => {
        if (event.key === "Enter") {
            this.handleSearchGames(event);
        }
    };

    render() {
        return (
            // <div>
            <div className={'container'}>
            <h1>Play a Game</h1>
                <br/>
                <div className={"searchbar-wrapper"}>
                    <div className={"wrapper"} style={{marginRight:10}}>
                        <InputGroup>
                            <FormControl
                                onChange={this.handleKeywordChange}
                                onKeyPress={this.handleEnterKey}
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
                    <div>
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
                <ActiveGames filteredGames={this.state.filteredGames}/>
            {/*</div>*/}
            </div>
        )
    }
}
