import React, {CSSProperties} from "react";
import {Card, Container, Row, Button, Col, OverlayTrigger, Tooltip} from "react-bootstrap";
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
        if (game.title == "Global Indefinite") {
            return "N/A"
        }
        return game.endTime.toLocaleString()
    };

    gameCardTitle(title: string) {
        let maxTitleLength = 26;    // TODO: Title consisting of 16 W will take two lines, but 16 is too short.
        if (title.length <= maxTitleLength) {
            return title;
        }
        title = title.substring(0, maxTitleLength - 3);
        title += "...";
        return title;
    }

    getGameCards = () => {
        let games = this.props.games;
        if (!games) {
            games = [];
        }
        let gameCards = [];
        for (let i = 0; i < games.length; i += 3) {
            let gameCardsInARow = [];
            for (let j = i; (j < i + 3) && (j < games.length); j++) {
                let gameCard =
                    <Col>
                        <Card
                            bg={"primary"}
                            text={"white"}
                            style={gameCardStyle}
                        >
                            <OverlayTrigger
                                placement={"right"}
                                delay={{show: 300, hide: 0}}
                                overlay={
                                    <Tooltip id={'tooltip-title'}>
                                        {games[j].title}
                                    </Tooltip>
                                }
                            >
                                <Card.Header><h6>{this.gameCardTitle(games[j].title)}</h6></Card.Header>
                            </OverlayTrigger>
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
            gameCards.push(<Row style={{marginBottom: 30}}>{gameCardsInARow}</Row>);
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
