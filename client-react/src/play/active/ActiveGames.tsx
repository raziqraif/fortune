import React, {CSSProperties} from "react";
import {Pagination, Card, Container, Row, Button, Col} from "react-bootstrap";

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
    currentPage: number,
    maxPerPage: number,
    activeGames: GameType[]
}

interface ActiveGamesState {
    currentPage: number,
}

export default class ActiveGames extends React.Component<ActiveGamesProps, ActiveGamesState> {
    constructor(props: ActiveGamesProps) {
        super(props);

        this.state = {
            currentPage: this.props.currentPage,
        };
    }

    endTimeToString = (game: GameType) => {
        return game.endTime.toLocaleString();
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
        let maxPerPage = this.props.maxPerPage;
        let games = this.props.activeGames.slice(pageNum * maxPerPage, (pageNum + 1) * maxPerPage);
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
            // gameCards.push({gameCardsInARow});
            gameCards.push(<br/>);
        }
        if (gameCards.length == 0) {
            return <p> No matches were found </p>
        }
        return gameCards;
    };

    // TODO: Make sure this won't break when handling a large number of pages.
    getPaginationItems = () => {
        let pItems = [];
        let maxPerPage = this.props.maxPerPage;
        for (let i = 1; i <= Math.ceil(this.props.activeGames.length / maxPerPage); i++) {
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
