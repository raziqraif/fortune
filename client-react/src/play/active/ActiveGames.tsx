import React, {CSSProperties} from "react";
import {Card, Container, Row, Button, Col} from "react-bootstrap";
import Pagination from '../../pagination'

const buttonStyle: CSSProperties = {
    width: 120,
    color: "white",
    background: "#156beb"
};

const gameCardStyle: CSSProperties = {
    width: '18rem',
};

const MAX_ITEMS_PER_PAGE = 9;

type GameType = { name: string, link: string, endTime: Date }

interface ActiveGamesProps {
    filteredGames: GameType[]
}

interface ActiveGamesState {
    currentPage: number,
}

export default class ActiveGames extends React.Component<ActiveGamesProps, ActiveGamesState> {
    constructor(props: ActiveGamesProps) {
        super(props);

        this.state = {
            currentPage: 1,
        };
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    endTimeToString = (game: GameType) => {
        return game.endTime.toLocaleString();
    };

    handlePageChange(currentPage: number) {
        this.setState({currentPage: currentPage})
    };

    // TODO: Prevent cards from being shifted when the window is resized
    // TODO: Prevent things from being shifted when there are less than 9 cards in a page.
    // TODO: Truncate long game titles
    // TODO: Implement tooltip to display game title
    getGameCards = () => {
        let pageNum = this.state.currentPage - 1;
        let games = this.props.filteredGames.slice(pageNum * MAX_ITEMS_PER_PAGE, (pageNum + 1) * MAX_ITEMS_PER_PAGE);
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

    render() {
        return (
            <div>
                <Container>
                    {this.getGameCards()}
                    <Row>
                        <Pagination
                            currentPage={this.state.currentPage}
                            maxItemsPerPage={MAX_ITEMS_PER_PAGE}
                            totalItems={this.props.filteredGames.length}
                            handlePageChange={this.handlePageChange}
                        />
                    </Row>
                </Container>
            </div>
        )
    }
}

// TODO: It's possible that the game has ended when player clicks the "Play" button (when the page wasn't refreshed). Handle this.
