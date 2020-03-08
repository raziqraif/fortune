import {ReactComponent} from "*.svg";
import React from "react";
import {Form, Card, Container, Row, Button, Col} from "react-bootstrap";

export default class ActiveGames extends React.Component {
    activeGames = [
        {name: "Global Game", link: "/my_game1"},
        {name: "Global Timed Game", link: "/my_game2"},
        {name: "Boilermaker", link: "my_game3"}
    ]

    // TODO: Remove this after real data has been pulled
    componentWillMount(): void {
        for (let i = 4; i < 20; i++) {
            this.activeGames.push({name: "Game " + i, link: "/my_game" + i})
        }
    }

    filteredGames = () => {
        return this.activeGames;
    }

    populateGames = () => {
        let games = this.filteredGames();
        let gameCards = [];
        for (let i = 0; i < games.length / 3; i += 3) {
            let gameCardsInARow = []
            for (let j = i; (j < i + 3) && (j < games.length); j++) {
                let gameCard = <Col style={{width: "auto"}}>
                    <Card bg={"primary"} text={"white"} style={{width: '18rem'}}>
                        <Card.Header>{games[j].name}</Card.Header>
                        <Card.Body>
                            <Card.Text>Ends at 4/9/2020</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                console.log(gameCard)
                gameCardsInARow.push(gameCard)
            }
            gameCards.push(<Row>{gameCardsInARow}</Row>)
            gameCards.push(<br/>)
        }
        return gameCards;
    }

    createTable = () => {
        let table = []

        // Outer loop to create parent
        for (let i = 0; i < 3; i++) {
            let children = []
            //Inner loop to create children
            for (let j = 0; j < 5; j++) {
                children.push(<td>{`Column ${j + 1}`}</td>)
            }
            //Create the parent and add the children
            table.push(<tr>{children}</tr>)
        }
        return table
    }
    render() {
        return (
            <div>
                <Container>
                    {this.populateGames()}
                </Container>
            </div>
            // <table>
            //     {this.createTable()}
            // </table>
            // <div>
            //     <Container>
            //         {console.log("hello")}
            //         {this.populateGames()}
            //         {this.activeGames.map((game: { name: string, link: string}) => {
            //             let index = this.activeGames.indexOf(game)
            //             let result = <Col>
            //                 <Card bg={"primary"} text={"white"} style={{width: '18rem'}}>
            //                     <Card.Header>{game.name}</Card.Header>
            //                     <Card.Body>
            //                         <Card.Text>Ends at 4/9/2020</Card.Text>
            //                     </Card.Body>
            //                 </Card>
            //             </Col>
            //
            //             if (index % 4 == 0) {
            //                 result = <Col>
            //                     <Card bg={"primary"} text={"white"} style={{width: '18rem'}}>
            //                         <Card.Header>{game.name}</Card.Header>
            //                         <Card.Body>
            //                             <Card.Text>Ends at 4/9/2020</Card.Text>
            //                         </Card.Body>
            //                     </Card>
            //                 </Col>
            //             }
            //             return result
            //         })}
            //     </Container>
            // </div>
        )
    }
}
