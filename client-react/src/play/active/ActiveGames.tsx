import {ReactComponent} from "*.svg";
import React, {CSSProperties} from "react";
import {Form, Card, Container, Row, Button, Col} from "react-bootstrap";

const buttonStyle: CSSProperties = {
    width: 120,
    color: "white",
    background: "#156beb"
};

const gameCardStyle: CSSProperties = {
    width: '18rem',
};

type GameType = { name: string, link: string, endTime: Date }

export default class ActiveGames extends React.Component {
    activeGames: GameType[] = [
        {name: "Global Game", link: "/global", endTime: new Date()},
        {name: "Global Timed Game", link: "/global_timed", endTime: new Date()},
        {name: "Boilermaker", link: "my_game3", endTime: new Date()}
    ];

    // TODO: Remove this after real data has been pulled
    componentWillMount(): void {
        for (let i = 4; i <= 9; i++) {
            this.activeGames.push({name: "Game " + i, link: "/my_game" + i, endTime: new Date()})
        }
    }

    endTimeToString = (game: GameType) => {
        return game.endTime.toLocaleString();
    }

    filteredGames = () => {
        // TODO: Implement this
        return this.activeGames;
    };

    // TODO: Prevent cards from being shifted when the window is resized
    // TODO: Truncate long game titles
    // TODO: Implement tooltip to display game title
    populateGameCards = () => {
        let games = this.filteredGames();
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

    render() {
        return (
            <div>
                <Container>
                    {this.populateGameCards()}
                </Container>
            </div>
        )
    }
}
