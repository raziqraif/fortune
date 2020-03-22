import React, {CSSProperties} from "react";
import {Card, Container, Row, Button, Col} from "react-bootstrap";
import "./ActiveGames.css"

const buttonStyle: CSSProperties = {
    width: 120,
    color: "white",
    background: "#156beb"
};

const gameCardStyle: CSSProperties = {
    width: '18rem',
};

type GameType = { title: string, link: string, endTime: Date }

interface ActiveGamesProps {
    games: GameType[]
}

export default class ActiveGames extends React.Component<ActiveGamesProps> {

    endTimeToString = (game: GameType) => {
        return game.endTime.toLocaleString();
    };

    // TODO: Prevent cards from being shifted when the window is resized
    // TODO: Prevent things from being shifted when there are less than 9 cards in a page.
    // TODO: Truncate long game titles
    // TODO: Implement tooltip to display game title
    getGameCards = () => {
        let games = this.props.games;
        let gameCards = [];
        for (let i = 0; i < games.length; i += 3) {
            let gameCardsInARow = [];
            for (let j = i; (j < i + 3) && (j < games.length); j++) {
                let gameCard = <Col>
                    <Card
                        bg={"primary"}
                        text={"white"}
                        style={gameCardStyle}
                    >{/* className={"col-sm-4"}>*/}
                        <Card.Header><h6>{games[j].title}</h6></Card.Header>
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
        if (gameCards.length === 0) {
            return <p> No matches were found </p>
        }
        return <div className={"gamecards-container"}> {gameCards} </div>;
    };

    render() {
        return (
            <div>
                {this.getGameCards()}
            </div>
        )
    }
}

// TODO: It's possible that the game has ended when player clicks the "Play" button (when the page wasn't refreshed). Handle this.
