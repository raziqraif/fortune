import React, {CSSProperties} from "react";
import {Pagination, Card, Container, Row, Button, Col} from "react-bootstrap";

import Game from "../../game";

const buttonStyle: CSSProperties = {
    width: 120,
    color: "white",
    background: "#156beb"
};

const gameCardStyle: CSSProperties = {
    width: '18rem',
};

type GameType = { name: string, link: string, endTime: Date }

interface ActiveGamesProps {
}

interface ActiveGamesState {
    currentPage: number,
    maxPerPage: number,
}

export default class ActiveGames extends React.Component<ActiveGamesProps, ActiveGamesState> {
    activeGames: GameType[] = [];

    constructor(props: ActiveGamesProps) {
        super(props);

        this.activeGames.push({name: "Global Game", link: "/global", endTime: new Date()});
        this.activeGames.push({name: "Global Timed Game", link: "/global_timed", endTime: new Date()});
        this.activeGames.push({name: "Boilermaker", link: "my_game3", endTime: new Date()});
        for (let i = 4; i <= 40; i++) {
            this.activeGames.push({name: "Game " + i, link: "/my_game" + i, endTime: new Date()})
        }

        this.state = {
            currentPage: 1,
            maxPerPage: 9
        };

        this.handlePageChanged = this.handlePageChanged.bind(this);
    }

    endTimeToString = (game: GameType) => {
        return game.endTime.toLocaleString();
    };

    filteredGames = () => {
        // TODO: Implement this
        return this.activeGames;
    };

    handlePageChanged = (event: any) => {
        if (!event.currentTarget.text) {    // Active page number was clicked
            return;
        }
        this.setState({currentPage: Number(event.currentTarget.text)})
    };

    // TODO: Prevent cards from being shifted when the window is resized
    // TODO: Prevent things from being shifted when there are less than 9 cards in a page.
    // TODO: Truncate long game titles
    // TODO: Implement tooltip to display game title
    getGameCards = () => {
        let pageNum = this.state.currentPage - 1;
        let maxPerPage = this.state.maxPerPage;
        // let games = this.filteredGames();
        let games = this.filteredGames().slice(pageNum * maxPerPage, (pageNum + 1) * maxPerPage);
        let gameCards = [];
        for (let i = 0; i < games.length; i += 3) {
            let gameCardsInARow = [];
            for (let j = i; (j < i + 3) && (j < games.length); j++) {
                let gameCard = <Col>
                    <Card bg={"primary"} text={"white"} style={gameCardStyle}>
                        <Card.Header><h6>{games[j].name}</h6></Card.Header>
                        <Card.Body>
                            <Card.Text>Ends at: {this.endTimeToString(games[j])}</Card.Text>
                            <Container>
                                <Button variant={"primary"}
                                        size={"sm"}
                                        href={games[j].link}
                                        style={buttonStyle}
                                >Play</Button>
                            </Container>
                        </Card.Body>
                    </Card>
                </Col>;
                gameCardsInARow.push(gameCard);
            }
            gameCards.push(<Row>{gameCardsInARow}</Row>);
            gameCards.push(<br/>);
        }
        return gameCards;
    };

    // TODO: Make sure this won't break when handling a large number of pages.
    getPaginationItems = () => {
        let pItems = [];
        let maxPerPage = this.state.maxPerPage;
        for (let i = 1; i <= Math.ceil(this.filteredGames().length / maxPerPage); i++) {
                pItems.push((
                    <Pagination.Item
                        active={this.state.currentPage === i}
                        onClick={this.handlePageChanged}
                    >{i}
                    </Pagination.Item>
                ));
        }
        return pItems;
    };

    render() {
        return (
            <div>
                <Container>
                    {this.getGameCards()}
                    <Row>
                        <Pagination>
                            {this.getPaginationItems()}
                        </Pagination>
                    </Row>
                </Container>
            </div>
        )
    }
}

// TODO: It's possible that the game has ended when player clicks the "Play" button (when the page wasn't refreshed). Handle this.
